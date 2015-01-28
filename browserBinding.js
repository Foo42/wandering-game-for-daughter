document.getElementById('viewport').addEventListener('mousedown', function (ev) {
    vp.mousedown = true;
    vp.dragStart = {
        x: ev.clientX,
        y: ev.clientY
    };
    vp.centerAtDragStart = vp.getCentre();
});
document.getElementById('viewport').addEventListener('mouseup', function (ev) {
    vp.mousedown = false;
    vp.dragStart = undefined;
});
document.getElementById('viewport').addEventListener('mousemove', function (ev) {
    if (!vp.mousedown) {
        return;
    }
    var diff = {
        dx: (ev.clientX - vp.dragStart.x),
        dy: (ev.clientY - vp.dragStart.y)
    };
    console.log('diff', JSON.stringify(diff));
    var newCentre = vp.getCentre();
    newCentre.x = newCentre.x - diff.dx;
    newCentre.y = newCentre.y - diff.dy;
    console.log('newCentre =', JSON.stringify(newCentre));
    vp.move(newCentre);
    vp.dragStart = {
        x: ev.clientX,
        y: ev.clientY
    };
    //redrawPiece(piece);
});

var keydown = {
    UP: function () {
        world.player().velocity.y = -world.player().walkingSpeed;
    },
    DOWN: function () {
        world.player().velocity.y = player.walkingSpeed;
    },
    LEFT: function () {
        world.player().velocity.x = -player.walkingSpeed;
    },
    RIGHT: function () {
        world.player().velocity.x = +player.walkingSpeed;
    }
};

var keyup = {
    UP: function () {
        world.player().velocity.y = 0;
    },
    DOWN: function () {
        world.player().velocity.y = 0;
    },
    LEFT: function () {
        world.player().velocity.x = 0;
    },
    RIGHT: function () {
        world.player().velocity.x = 0;
    }
};

function decodeKey(evt) {
    switch (evt.keyCode) {
    case 38:
        /* Up arrow was pressed */
        return 'UP';
    case 40:
        /* Down arrow was pressed */
        return 'DOWN';
    case 37:
        /* Left arrow was pressed */
        return 'LEFT';
    case 39:
        /* Right arrow was pressed */
        return 'RIGHT';
    }
}

function doKeyDown(evt) {
    keydown[decodeKey(evt)]();
}

function doKeyUp(evt) {
    keyup[decodeKey(evt)]();
}
window.addEventListener('keydown', doKeyDown, true);
window.addEventListener('keyup', doKeyUp, true);

function scrollFunc(e) {
    if (typeof scrollFunc.x == 'undefined') {
        scrollFunc.x = window.pageXOffset;
        scrollFunc.y = window.pageYOffset;
    }
    var diffX = scrollFunc.x - window.pageXOffset;
    var diffY = scrollFunc.y - window.pageYOffset;

    if (diffX < 0) {
        // Scroll right
    } else if (diffX > 0) {
        // Scroll left
    } else if (diffY < 0) {
        alert('scroll in');
    } else if (diffY > 0) {
        // Scroll up
        alert('scroll out');
    } else {
        // First scroll event
    }
    scrollFunc.x = window.pageXOffset;
    scrollFunc.y = window.pageYOffset;
}
window.onscroll = scrollFunc

var fpsDisplay = document.getElementById('fps');
var cacheDisplay = document.getElementById('cache');
var positionDisplay = document.getElementById('position');
setInterval(function updateDiagnosticDisplays() {
    fpsDisplay.innerHTML = world.fps + ' fps';
    cacheDisplay.innerHTML = cacheSize() + ' items in cache';
    positionDisplay.innerHTML = JSON.stringify(world.player().position);
}, 2000);
