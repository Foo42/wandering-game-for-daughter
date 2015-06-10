userInputEvents.on('game area tap', function () {
	var gameLocation = vp.getCentre();
	console.log('place game item at', gameLocation)
	userCommands.emit('place game item', {
		location: gameLocation,
		type: 'flower'
	});
});
