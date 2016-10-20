// userInputEvents.on('game area tap', function (ev) {

	
// 	console.log('place game item at', gameLocation)
// 	userCommands.emit('place game item', {
// 		location: gameLocation,
// 		type: 'flower'
// 	});
// });

userInputEvents.on('movement control on', function (direction) {
	userCommands.emit('make player move', direction);
});
userInputEvents.on('movement control off', function (direction) {
	userCommands.emit('stop player moving');
});


function eventToGameLocation(ev){
	var gameLocation = {
		x: vp.getCentre().x,
		y: vp.getCentre().y
	};
	gameLocation.x += (ev.clientX - vp.size.width / 2);
	gameLocation.y += (ev.clientY - vp.size.height / 2);
	return gameLocation;
}

var tools = {
    'red flowers':function(ev){
        console.log('red flower tool');
        userCommands.emit('place game item', {
			position: eventToGameLocation(ev),
			type: 'flower',
			color: 'red'
		});
    },
    'yellow flowers':function(ev){
        console.log('yellow flower tool');
        userCommands.emit('place game item', {
			position: eventToGameLocation(ev),
			type: 'flower',
			color: 'yellow'
		});
    },
    'houses':function(ev){
    	console.log('house tool');
    	userCommands.emit('place game item',{
    		position: eventToGameLocation(ev),
    		type: 'house'
    	});
    }
};

userInputEvents.on('change active tool',function(tool){
    userInputEvents.on('game area tap', tools[tool]);
    userInputEvents.once('change active tool',function(){
        userInputEvents.off('game area tap', tools[tool]);
        console.log('tool no longer',tool);
    });
    console.log('change tool to',tool);
});
