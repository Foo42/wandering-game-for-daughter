var world = createWorld();
var viewportDiv = document.getElementById('viewport');
var viewPortSize = {
    width: window.innerWidth,
    height: window.innerHeight
};
var vp = createViewport(world, {
    size: viewPortSize
});

function createPlayer(options, id) {
    var img = new Image(); // Create new img element
    var imgLoaded = false;
    img.addEventListener("load", function () {
        imgLoaded = true;
        // execute drawImage statements here
    }, false);
    img.src = 'naomi-small.png'; // Set source path

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
    player.walkingSpeed = 250;
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
            context.drawImage(img, 0, 0, img.width, img.height, 0, 0, player.size, player.size)
        }
    }

    return player;
}

var player = createPlayer('hello');
world.characters.player = player;

function startGameLoop() {
    var lastTime;

    function doGameLoop(time) {
        lastTime = lastTime || time - 1;
        var elapsedMs = time - lastTime;
        lastTime = time;
        world.fps = 1000 / elapsedMs;
        var tock = world.tick(vp, elapsedMs);
        tock();
        vp.ensureVisible(world.player().position);
        vp.draw();
        requestAnimationFrame(doGameLoop);
    }
    requestAnimationFrame(doGameLoop);
}
startGameLoop();
