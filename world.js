function createWorld(options) {
    function getChunk(position, chunkSize) {
        return {
            position: position,

            draw: function draw(context) {
                var baseGrassColor = '#008B45';
                var grassColor = tinycolor(baseGrassColor).darken(hashRandom(position.x, position.y, 'grass darken') * 5).toHexString();
                context.fillStyle = grassColor;

                var hasFlower = hashRandom(position.x, position.y, 'flower') > 0.93;
                context.fillRect(0, 0, chunkSize, chunkSize);
                if (hasFlower) {
                    var flowerSize = hashRandom(position.x, position.y, 'flower size') * 10 + 5;
                    context.translate(chunkSize / 2, chunkSize / 2);
                    context.translate(-flowerSize / 2, -flowerSize / 2);

                    var radius = flowerSize / 3;
                    var baseFlowerColor = hashRandom(position.x, position.y, 'flower color') > 0.98 ? '#FFFF00' : '#FF0000';
                    var colorOp = hashRandom(position.x, position.y, 'lighten or darken') > 0.5 ? 'lighten' : 'darken';
                    var flowerColor = tinycolor(baseFlowerColor)[colorOp](hashRandom(position.x, position.y, 'flower darken') * 30).toHexString();

                    context.beginPath();

                    context.arc(0, 0 + radius, radius, 0, 2 * Math.PI, false);
                    context.fillStyle = flowerColor;
                    context.fill();

                    context.beginPath();

                    context.arc(0, 0 - radius, radius, 0, 2 * Math.PI, false);
                    context.fillStyle = flowerColor;
                    context.fill();

                    context.beginPath();

                    context.arc(0 + radius, 0, radius, 0, 2 * Math.PI, false);
                    context.fillStyle = flowerColor;
                    context.fill();

                    context.beginPath();

                    context.arc(0 - radius, 0, radius, 0, 2 * Math.PI, false);
                    context.fillStyle = flowerColor;
                    context.fill();

                    context.beginPath();
                    context.arc(0, 0, radius / 1.8, 0, 2 * Math.PI, false);
                    context.fillStyle = 'white';
                    context.fill();

                }
            }
        }
    }

    var chunker = {
        getVisibleChunks: function getVisibleChunks(viewPort) {
            var chunkSize = 80;
            var minX = Math.floor((viewPort.centre.x - viewPort.size.width / 2) / chunkSize) * chunkSize;
            var maxX = Math.floor((viewPort.centre.x + viewPort.size.width / 2) / chunkSize) * chunkSize;
            var minY = Math.floor((viewPort.centre.y - viewPort.size.height / 2) / chunkSize) * chunkSize;
            var maxY = Math.floor((viewPort.centre.y + viewPort.size.height / 2) / chunkSize) * chunkSize;

            var visibleChunks = [];
            for (var x = minX; x <= maxX; x += chunkSize) {
                for (var y = minY; y <= maxY; y += chunkSize) {
                    (function () {
                        var position = {
                            x: x,
                            y: y
                        };

                        visibleChunks.push(getChunk(position, chunkSize));
                    })();
                }
            }
            // console.log('generated ', visibleChunks.length, 'chunks, centred on', viewPort.centre.x, viewPort.centre.y);

            return visibleChunks;
        }
    }

    var world = {
        height: 1000,
        width: 1000,
        pieces: [],
        characters: {},
        tick: function (elapsedMs) {
            var pieceUpdates = world.updatables().map(function (piece) {
                return piece.tick(elapsedMs);
            });
            return pieceUpdates.forEach.bind(pieceUpdates, function (f) {
                f()
            });
        },
        player: function () {
            return this.characters.player;
        },
        updatables: function () {
            if (!this.player()) {
                return this.pieces;
            }
            return [this.player()].concat(this.pieces);
        },
        drawables: function (viewPort) {
            if (!this.player()) {
                return this.pieces;
            }
            return this.pieces.concat(chunker.getVisibleChunks(viewPort)).concat(this.player());
        }
    }
    return world;
}
