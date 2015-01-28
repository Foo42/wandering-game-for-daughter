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

    var catImg = new Image();
    catImg.src = 'cat.png'

    function makeAnimalChunks(position, chunkSize) {
        return cacheOrCalculate('animalChunk' + position.x + position.y, function () {

            var animalChunk = {
                animals: [],
                position: position
            }

            animalChunk.draw = function (context) {
                if (animalChunk.animals.length) {
                    animalChunk.animals[0].draw(context);
                }
            }
            animalChunk.tick = function (context) {
                if (animalChunk.animals.length) {
                    return animalChunk.animals[0].tick(context);
                }
                return function () {};
            }

            if (hashRandom(position.x, position.y, 'should have animal?') > 0.5) {
                var cat = {
                    maxSpeed: 30
                };
                console.log('cat at', position.x, position.y);
                var img = catImg;
                cat.position = {
                    x: hashRandom(position.x, position.y, 'animal x') * chunkSize,
                    y: hashRandom(position.x, position.y, 'animal y') * chunkSize
                };

                cat.img = img,
                    cat.size = 100;
                cat.velocity = {
                    x: 0,
                    y: 0
                };
                cat.id = 'cat' + position.x + position.y;
                cat.tick = function (elapsedMs) {
                    var newPosition = {
                        x: cat.position.x + (cat.velocity.x * elapsedMs / 1000),
                        y: cat.position.y + (cat.velocity.y * elapsedMs / 1000)
                    };
                    if (cat.velocity.x || cat.velocity.y) {
                        if (hashRandom(performance.now(), cat.id, 'should stop') > 0.995) {
                            console.log('cat', cat.id, 'stopping');
                            cat.velocity.x = cat.velocity.y = 0;
                        }
                    } else {
                        if (hashRandom(performance.now(), cat.id, 'should start') > 0.995) {
                            var dimension = hashRandom(performance.now(), cat.id, 'dimension') > 0.5 ? 'x' : 'y';
                            var direction = hashRandom(performance.now(), cat.id, 'direction') > 0.5 ? 1 : -1;
                            console.log('cat', cat.id, 'moving');
                            cat.velocity[dimension] = direction * cat.maxSpeed;
                        }
                    }
                    return function () {
                        cat.position = newPosition;
                    };
                };
                cat.draw = function (context) {
                    var drawBounds = false;
                    if (drawBounds) {
                        context.save();
                        context.beginPath();
                        context.lineWidth = 10;
                        context.strokeStyle = 'red';
                        context.moveTo(0, 0);
                        context.lineTo(chunkSize, 0);
                        context.lineTo(chunkSize, chunkSize);
                        context.lineTo(0, chunkSize);
                        context.lineTo(0, 0);
                        context.stroke();

                        context.beginPath();
                        context.lineWidth = 5;
                        context.strokeStyle = 'blue';
                        context.moveTo(0, 0);
                        context.lineTo(cat.position.x, cat.position.y);
                        context.stroke();

                        context.restore();
                    }
                    if (cat && cat.img.complete) {
                        context.save();
                        // context.fillStyle = "red";
                        // context.fillRect(0, 0, 10, 10)
                        context.drawImage(cat.img, 0, 0, cat.img.width, cat.img.height, cat.position.x, cat.position.y, cat.img.width / 6, cat.img.height / 6);
                        context.restore();
                    }
                }
                animalChunk.animals.push(cat);
            }

            return animalChunk;
        });
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
        tick: function (viewPort, elapsedMs) {
            var pieceUpdates = world.updatables(viewPort).map(function (piece) {
                return piece.tick(elapsedMs);
            });
            return pieceUpdates.forEach.bind(pieceUpdates, function (f) {
                if (!f) return;
                f()
            });
        },
        player: function () {
            return this.characters.player;
        },
        updatables: function (viewPort) {
            if (!this.player()) {
                return this.pieces;
            }
            return [this.player()]
                .concat(this.pieces)
                .concat(chunker.getVisibleChunks(viewPort, makeAnimalChunks, 2000));
        },
        drawables: function (viewPort) {
            if (!this.player()) {
                return this.pieces;
            }
            return this.pieces
                .concat(chunker.getVisibleChunks(viewPort, makeGrassChunk))
                .concat(chunker.getVisibleChunks(viewPort, makeFlowerChunk, 300))
                .concat(chunker.getVisibleChunks(viewPort, makeAnimalChunks, 2000))
                .concat(this.player());
        }
    }
    return world;
}
