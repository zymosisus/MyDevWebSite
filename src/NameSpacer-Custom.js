var THEDREWORG = THEDREWORG || {};
(function (thedreworg) {
	thedreworg.namespace = function (ns_string) {
		var parts = ns_string.split('.')
				, parent = THEDREWORG
				, i;

		if (parts[0] === "THEDREWORG")
			parts = parts.slice(1);

		for (i = 0; i < parts.length; i += 1) {
			if (typeof parent[parts[i]] === "undefined") {
				parent[parts[i]] = {};
			}
			parent = parent[parts[i]];
		}
		return parent;
	};
})(THEDREWORG);