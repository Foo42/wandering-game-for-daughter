var world = createWorld();
var vp = createViewport(world);

function createPlayer(options, id) {
    var img = new Image(); // Create new img element
    var imgLoaded = false;
    img.addEventListener("load", function () {
        imgLoaded = true;
        img.width = 50;
        img.height = 50;
        // execute drawImage statements here
    }, false);
    img.src = 'naomi.png'; // Set source path

    if (id === undefined) {
        id = options;
        options = undefined;
    }
    var options = options || {
        position: {}
    };

    var position = {
        x: options.position.x || 0,
        y: options.position.y || 0
    };
    var velocity = {
        x: 0,
        y: 0
    };

    var player = {
        position: position,
        velocity: velocity
    };

    player.size = 120;
    player.walkingSpeed = 150;
    player.tick = function (elapsedMs) {
        var factor = elapsedMs / 1000;

        var newPosition = {
            x: (player.position.x + player.velocity.x * factor),
            y: (player.position.y + player.velocity.y * factor)
        }
        return function () {
            player.position = newPosition;
        }
    }

    player.draw = function (context) {
        context.fillStyle = '#F00';
        context.translate(-player.size / 2, -player.size / 2);
        //context.fillRect(0, 0, player.size, player.size);

        if (imgLoaded) {
            context.drawImage(img, 0, 0, player.size, player.size)
        }
    }

    return player;
}

var player = createPlayer('hello');
world.characters.player = player;

function startGameLoop(fps) {
    period = 1000 / fps;

    function doGameLoop(elapsedMs) {
        var tock = world.tick(period);
        tock();
        vp.ensureVisible(world.player().position);
        vp.draw();
        setTimeout(doGameLoop, period);
    }
    setTimeout(doGameLoop, period);
}
startGameLoop(20);
