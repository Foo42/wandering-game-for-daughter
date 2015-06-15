(function () {
    var lastDownTime;
    document.getElementById('viewport').addEventListener('mousedown', function (ev) {
        lastDownTime = ev.timeStamp;
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
        if (ev.timeStamp - lastDownTime < 500) {
            userInputEvents.emit('game area tap', ev);
        }
    });
})();

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
        userInputEvents.emit('movement control on', 'up');
    },
    DOWN: function () {
        userInputEvents.emit('movement control on', 'down');
    },
    LEFT: function () {
        userInputEvents.emit('movement control on', 'left');
    },
    RIGHT: function () {
        userInputEvents.emit('movement control on', 'right');
    }
};

var keyup = {
    UP: function () {
        userInputEvents.emit('movement control off', 'up');
    },
    DOWN: function () {
        userInputEvents.emit('movement control off', 'down');
    },
    LEFT: function () {
        userInputEvents.emit('movement control off', 'left');
    },
    RIGHT: function () {
        userInputEvents.emit('movement control off', 'right');
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

['up', 'down', 'left', 'right'].forEach(function (direction) {
    var button = document.getElementById(direction + '-control');
    button.addEventListener('mousedown', function () {
        userInputEvents.emit('movement control on', direction);
    });
    button.addEventListener('touchstart', function () {
        userInputEvents.emit('movement control on', direction);
    });
    button.addEventListener('mouseup', function () {
        userInputEvents.emit('movement control off', direction);
    });
    button.addEventListener('touchend', function () {
        userInputEvents.emit('movement control off', direction);
    });
});

function launchIntoFullscreen(element) {
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
    }
}

// Launch fullscreen for browsers that support it!
launchIntoFullscreen(document.documentElement); // the whole page

function $(selector) {
    var elList = document.querySelectorAll(selector);
    elList = Array.prototype.slice.call(elList, 0);
    return elList;
}

document.getElementById('tray-toggle').addEventListener('click', function () {
    document.getElementById('tray').classList.toggle('open');
});

$('[data-command]').forEach(function (el) {
    var command = el.attributes['data-command'].value;
    var argument = el.attributes['data-argument'].value;
    el.addEventListener('click',function(){
        userInputEvents.emit(command,argument);
    });
});



// function scrollFunc(e) {
//     if (typeof scrollFunc.x == 'undefined') {
//         scrollFunc.x = window.pageXOffset;
//         scrollFunc.y = window.pageYOffset;
//     }
//     var diffX = scrollFunc.x - window.pageXOffset;
//     var diffY = scrollFunc.y - window.pageYOffset;

//     if (diffX < 0) {
//         // Scroll right
//     } else if (diffX > 0) {
//         // Scroll left
//     } else if (diffY < 0) {
//         alert('scroll in');
//     } else if (diffY > 0) {
//         // Scroll up
//         alert('scroll out');
//     } else {
//         // First scroll event
//     }
//     scrollFunc.x = window.pageXOffset;
//     scrollFunc.y = window.pageYOffset;
// }
// window.onscroll = scrollFunc

var fpsDisplay = document.getElementById('fps');
var cacheDisplay = document.getElementById('cache');
var positionDisplay = document.getElementById('position');
setInterval(function updateDiagnosticDisplays() {
    fpsDisplay.innerHTML = world.fps + ' fps';
    cacheDisplay.innerHTML = cacheSize() + ' items in cache';
    positionDisplay.innerHTML = JSON.stringify(world.player().position);
}, 2000);
