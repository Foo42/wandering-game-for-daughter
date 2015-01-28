(function (root) {
    function nextCellularState(state) {

        return state;
    }

    function iterate(start, count) {
        for (var i = 0; i < count; i++) {
            start = nextCellularState(start);
        }
        return start;
    }

    function generateInitialState(position, chunkSize) {
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

        return state;
    }

    function makeFlowerChunk(position, chunkSize) {
        return {
            position: position,

            draw: function draw(context) {

                var cellState = cacheOrCalculate('flower' + position.x + position.y, function () {
                    return iterate(generateInitialState(position, chunkSize), 3);
                });

                function drawFlower(context, options) {
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

    root.makeFlowerChunk = makeFlowerChunk;
})(window);
