function drawHouse(context, options) {
	context.save();
	context.translate(options.position.x, options.position.y);

	var houseHeight = 140;
	var houseWidth = 80;
	var doorColor = "#990000";
	var doorHeight = houseHeight / 2;
	var doorWidth = doorHeight / 3;

	context.fillStyle = "#FFF3C2";
	context.fillRect(0, 0, houseHeight, houseWidth);

	context.fillStyle = doorColor;
	context.fillRect((houseWidth - doorWidth) / 2, houseHeight - doorHeight, doorWidth, doorHeight);

	context.restore();
}
