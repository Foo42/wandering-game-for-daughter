(function (root) {
	var cache = {};
	root.cacheOrCalculate = function cacheOrCalculate(key, f) {
		var item = cache[key];
		if (item !== undefined) {
			return item;
		}
		item = f();
		cache[key] = item;
		return item;
	}

	root.cacheSize = function cacheSize() {
		return Object.keys(cache).length;
	}
})(window)
