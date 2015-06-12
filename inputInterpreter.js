userInputEvents.on('game area tap', function (ev) {

	var gameLocation = {
		x: vp.getCentre().x,
		y: vp.getCentre().y
	};
	gameLocation.x += (ev.clientX - vp.size.width / 2);
	gameLocation.y += (ev.clientY - vp.size.height / 2);
	console.log('place game item at', gameLocation)
	userCommands.emit('place game item', {
		location: gameLocation,
		type: 'flower'
	});
});

userInputEvents.on('movement control on', function (direction) {
	userCommands.emit('make player move', direction);
});
userInputEvents.on('movement control off', function (direction) {
	userCommands.emit('stop player moving');
});
