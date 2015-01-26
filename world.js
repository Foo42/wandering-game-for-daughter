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

    function makeFlowerChunk(position, chunkSize) {
        return {
            position: position,

            draw: function draw(context) {

                var cellState = cacheOrCalculate('flower' + position.x + position.y, function () {
                    var state = {};

                    var numberOfFlowers = Math.round(hashRandom(position.x, position.y, 'numberOfFlowers') * 3);
                    state.flowers = [];
                    for (var i = 0; i < numberOfFlowers; i++) {
                        state.flowers.push(i);
                    }
                    state.flowers = state.flowers.map(function (flowerNumber) {
                        var flower = {};
                        var flowerSize = hashRandom(position.x, position.y, flowerNumber, 'flower size') * 10 + 5;

                        var radius = flowerSize / 3;
                        var baseFlowerColor = hashRandom(position.x, position.y, flowerNumber, 'flower color') > 0.98 ? '#FFFF00' : '#FF0000';
                        var colorOp = hashRandom(position.x, position.y, flowerNumber, 'lighten or darken') > 0.5 ? 'lighten' : 'darken';
                        var flowerColor = tinycolor(baseFlowerColor)[colorOp](hashRandom(position.x, position.y, flowerNumber, 'flower darken') * 30).toHexString();

                        flower.color = flowerColor;
                        flower.radius = radius;
                        flower.position = {
                            x: hashRandom(position.x, position.y, flowerNumber, 'flower-x') * chunkSize,
                            y: hashRandom(position.x, position.y, flowerNumber, 'flower-y') * chunkSize
                        }
                        return flower;
                    });
                    console.log('state.flowers', state.flowers);

                    return state;
                });

                function drawFlower(context, options) {
                    console.log('drawing flower');
                    context.save();
                    var radius = options.radius;
                    var flowerColor = options.color;
                    context.translate(options.position.x, options.position.y);
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
                    context.restore();

                }

                //console.log('cellState.flowers', cellState.flowers);
                cellState.flowers.forEach(function (flower) {
                    drawFlower(context, flower);
                });

                if (cellState.hasFlower) {
                    drawFlower(context, cellState.flower);
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
