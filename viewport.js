function createViewport(world, options) {
    var viewport = {
        centre: {
            x: 0,
            y: 0
        },
        size: {
            width: 800,
            height: 500
        },
        scale: 1
    };

    var canvasElement = document.querySelector('canvas');
    var context = canvasElement.getContext('2d');

    function drawAllPieces(context) {
        context.save();
        context.clearRect(0, 0, viewport.size.width, viewport.size.height);
        context.translate(viewport.size.width / 2, viewport.size.height / 2); //origin in centre;
        context.translate(-viewport.centre.x, -viewport.centre.y); //account for where viewport is in world

        world.drawables(viewport).forEach(function (piece) {
            context.save();
            context.translate(piece.position.x, piece.position.y);
            if (piece.draw) {
                piece.draw(context);
            } else {
                context.translate(-piece.size / 2, -piece.size / 2);
                context.fillRect(0, 0, piece.size, piece.size);
            }
            context.restore();
        });

        context.restore();
    }
    drawAllPieces(context);

    viewport.getDisplayPosition = function getDisplayPosition(positionInWorld) {
        return {
            x: (viewport.size.width / 2) + positionInWorld.x + viewport.centre.x,
            y: (viewport.size.height / 2) + positionInWorld.y + viewport.centre.y
        }
    };

    viewport.move = function move(newCentre) {
        viewport.centre = newCentre;
    };

    viewport.getCentre = function () {
        return viewport.centre;
    }

    viewport.draw = drawAllPieces.bind(null, context);

    viewport.ensureVisible = function ensureVisible(point) {
        //viewport.move(point);

        var boxRatio = 0.5;
        var boxWidth = boxRatio * viewport.size.width;
        var boxHeight = boxRatio * viewport.size.height;
        var box = {
            top: viewport.centre.y - boxHeight / 2,
            bottom: viewport.centre.y + boxHeight / 2,
            left: viewport.centre.x - boxWidth / 2,
            right: viewport.centre.x + boxWidth / 2,
        }
        if (point.x < box.left) {
            var outOfBoxBy = point.x - box.left;
            console.log('out of box by', outOfBoxBy);
            viewport.move({
                x: viewport.centre.x + outOfBoxBy,
                y: viewport.centre.y
            });
        } else if (point.x > box.right) {
            var outOfBoxBy = point.x - box.right;
            console.log('out of box by', outOfBoxBy);
            viewport.move({
                x: viewport.centre.x + outOfBoxBy,
                y: viewport.centre.y
            });
        }

        if (point.y < box.top) {
            var outOfBoxBy = point.y - box.top;
            console.log('out of box by', outOfBoxBy);
            viewport.move({
                x: viewport.centre.x,
                y: viewport.centre.y + outOfBoxBy
            });
        } else if (point.y > box.bottom) {
            var outOfBoxBy = point.y - box.bottom;
            console.log('out of box by', outOfBoxBy);
            viewport.move({
                x: viewport.centre.x,
                y: viewport.centre.y + outOfBoxBy
            });
        }
    }

    return viewport;
}
