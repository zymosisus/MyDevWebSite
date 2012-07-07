THEDREWORG.namespace('userRepository');
THEDREWORG.UserRepository = (function () {
	return function () {
		this.length = function () {
            ///TODO: Unit test this method
			var users = JSON.parse(localStorage.getItem('users'));
			if (users) return users.length;
			else return 0;
		};

		this.getAllUsers = function () {
            ///TODO: Unit test this method
			return JSON.parse(localStorage.getItem('users'));
		};

		this.getUserList = function () {
			/// Returns a JSON of user names and user ids
			var users = JSON.parse(localStorage.getItem('users'))
				, userLen = users.length, i, userList = new Array();
			for (i = 0; i < userLen; i++) {
				userList[i] = {};
				userList[i].userIndex = i;
				userList[i].userName = users[i].userName;
			}
			return userList;
		};

		this.getUserById = function (id) {
            ///TODO: Unit test this method
			var users = JSON.parse(localStorage.getItem('users'));
			return users[id];
		};

		this.addUser = function (user) {
            ///TODO: Unit test this method
			var users = JSON.parse(localStorage.getItem('users')) || new Array()
				, userIndex = this.length();
			users[userIndex] = user;
			localStorage.setItem('users', JSON.stringify(users));
			return userIndex;
		};

		this.addUserWeighIn = function (userId, weighIn) {
            ///TODO: Unit test this method
			var users = JSON.parse(localStorage.getItem('users')) || new Array()
				,user = users[userId];
			user.weighIns.push(weighIn);
			localStorage.setItem('users', JSON.stringify(users));
		};

		this.getUserWeighIns = function (userId) {
            ///TODO: Unit test this method
			var users = JSON.parse(localStorage.getItem('users'));
			return users[userId].weighIns;
		};

		this.getCurrentWeighIn = function (userId) {
            ///TODO: Unit test this method
			var weighIns = this.getUserWeighIns(userId);
			return weighIns[weighIns.length - 1];
		};

		//Delete Method goes here (Haven't gotten there yet)
	};
})();