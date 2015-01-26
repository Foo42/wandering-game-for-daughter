function createWorld(options) {
    function makeGrassChunk(position, chunkSize) {
        return {
            position: position,

            draw: function draw(context) {
                var grassVariationFactor = 3;
                var cellState = cacheOrCalculate('grass' + position.x + position.y, function () {
                    var state = {
                        grassColors: [],
                        innerDimension: 3
                    };

                    var baseGrassColor = '#008B45';
                    for (var i = 0; i < state.innerDimension; i++) {
                        state.grassColors.push([])
                        for (var j = 0; j < state.innerDimension; j++) {

                            var grassColor = tinycolor(baseGrassColor).darken(hashRandom(position.x, position.y, i, j, 'grass darken') * grassVariationFactor).toHexString();
                            state.grassColors[i].push(grassColor);
                        }
                    }
                    return state;
                });

                var cellSize = chunkSize / cellState.innerDimension;
                for (var i = 0; i < cellState.innerDimension; i++) {
                    for (var j = 0; j < cellState.innerDimension; j++) {
                        context.fillStyle = cellState.grassColors[i][j];
                        context.fillRect(i * cellSize, j * cellSize, cellSize, cellSize);
                    }
                }

            }
        }
    }

    var chunker = {
        getVisibleChunks: function getVisibleChunks(viewPort, makeChunk, chunkSize) {
            var chunkSize = chunkSize || 80;
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

                        visibleChunks.push(makeChunk(position, chunkSize));
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
            return this.pieces.concat(chunker.getVisibleChunks(viewPort, makeGrassChunk)).concat(chunker.getVisibleChunks(viewPort, makeFlowerChunk, 300)).concat(this.player());
        }
    }
    return world;
}
