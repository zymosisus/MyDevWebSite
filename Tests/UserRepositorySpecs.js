/**
 * Created with JetBrains WebStorm.
 * User: zymosisus
 * Date: 7/6/12
 * Time: 5:30 PM
 * To change this template use File | Settings | File Templates.
 */
describe("The User Repository", function (){
	localStorage.clear();
	userRepository = new THEDREWORG.UserRepository();

	beforeEach(function (){
		//create the user repository
		var user = {}, users = new Array();
		user.userName = "User 1";
		user.goalWeight = "175";
		user.weighIns = new Array();
		user.weighIns.push({weighInDate: "06-01-2012", weighInWeight: "200"});
		users.push(user);

		localStorage.setItem("users", JSON.stringify(users));
	});

	afterEach(function () {
		localStorage.clear();
	});

	it("can retrieve all users", function (){
		var users = userRepository.getAllUsers();
		var localUsers = JSON.parse(localStorage.getItem('users'));

		expect(users).toEqual(localUsers);
	});

	it("returns a length", function(){
		expect(userRepository.length()).toBe(1);
	});

	it("returns 0 length if there are no users defined", function(){
		localStorage.clear();
		expect(userRepository.length()).toBe(0);
	});

	it("can return a user by id", function(){
		var user = userRepository.getUserById(0)
			, localUsers = JSON.parse(localStorage.getItem('users'))
			, localUser = localUsers[0];

		expect(user).toEqual(localUser);
	});

	it("can add a user", function() {
		var newUser = {};
		newUser.userName = "User 2";
		newUser.goalWeight = 200;
		newUser.weighIns = new Array();
		newUser.weighIns.push({weighInDate: "06-01-2012", weighInWeight: "200"});

		var newUserIndex = userRepository.addUser(newUser);
		expect(newUserIndex).toBe(1);

		var localUser = JSON.parse(localStorage.getItem('users'))[1];
		expect(localUser).toEqual(newUser)
	});

	it("can add a weigh-in to an existing user", function() {
		var newWeighIn = {weighInDate: '08-01-2012', weighInWeight: '190'};
		userRepository.addUserWeighIn(0, newWeighIn);

		var users = JSON.parse(localStorage.getItem('users'));
		expect(users[0].weighIns[1]).toEqual(newWeighIn);

	});

	it("get users weigh in by user id", function(){
		var expectedWeighIns = new Array();
		expectedWeighIns.push({weighInDate: "06-01-2012", weighInWeight: "200"});

		expect(userRepository.getUserWeighIns(0)).toEqual(expectedWeighIns);
	})

	it("gets the latest weigh in for a user", function() {
		var expectedWeighIns = {weighInDate: "06-01-2012", weighInWeight: "200"};

		expect(userRepository.getCurrentWeighIn(0)).toEqual(expectedWeighIns);
	})

	it("returns an array of users", function() {
		var expectedArray = new Array()
			, userArray = userRepository.getUserList();
		expectedArray.push({userIndex: 0, userName: "User 1"});

		expect(userArray).toEqual(expectedArray);
	});
});
