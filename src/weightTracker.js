var userRepository = new THEDREWORG.UserRepository();

// Document Ready Function
$(function () {
    loadUser();

    $('.datePicker').datepicker();

    $('#addWeighIn').click(function () {
        addWeighIn();
    });

    $('#changeUser').click(function () {
        changeUser();
    });

    $('#clearConfiguration').click(function () {
        localStorage.clear();
    });
});


function loadUser() {
    //users = userRepository.getAllUsers() || new Array();
    var numOfUsers = userRepository.length();

    if (numOfUsers === 0) {//No users defined
        createUserDialog();
    } else if (numOfUsers > 1) { //Multiple users defined
        chooseUserDialog();
    } else { //Only one user defined
        userIndex = 0;
        populateUserDataToPage();
    }
}

function createUserDialog() {
    //Create User Account
    var $newUserDialog = $('<fieldset id="configuration"><legend>Create New User</legend><div class="fieldGroup"><label>Name:</label><input type="text" id="userName"></div><div class="fieldGroup"><label>Starting Date:</label><input type="text" id="startDate" class="datePicker"/></div><div class="fieldGroup"><label>Start Weight:</label><input type="text" id="startWeight"/></div><div class="fieldGroup"><label>Goal Weight:</label><input type="text" id="goalWeight"/></div><div id="validationMessages"></div></fieldset>');
    $newUserDialog.find('#startDate').datepicker();

    $newUserDialog.dialog({
        modal:true,
        draggable:false,
        resizable:false,
        closeOnEscape:false,
        position:'top',
        buttons:[
            {
                text:"Create",
                click:function () {
                    var user = {};
                    var userName = $('#userName'),
                        startDate = $('#startDate'),
                        startWeight = $('#startWeight'),
                        goalWeight = $('#goalWeight'),
                        allFields = $([]).add(userName).add(startDate).add(startWeight).add(goalWeight),
                        inputsValid = true;
                    allFields.removeClass('inputError');

                    if (!userName.val()) {
                        userName.addClass('inputError');
                        inputsValid = false;
                    }
                    if (new Date(startDate.val()) == 'Invalid Date') {
                        startDate.addClass('inputError');
                        inputsValid = false;
                    }
                    if (!$.isNumeric(startWeight.val())) {
                        startWeight.addClass('inputError');
                        inputsValid = false;
                    }
                    if (inputsValid) {
                        user.userName = userName.val();
                        user.goalWeight = goalWeight.val();
                        user.weighIns = [
                            { 'weighInDate':startDate.val(), 'weighInWeight':startWeight.val() }
                        ];

                        userIndex = userRepository.addUser(user);
                        $(this).dialog('close');
                    }
                }
            }
        ],
        close:function () {
            //Populate fields on screen.
            populateUserDataToPage()
        }
    });

    return true;
}

function populateUserDataToPage() {
    ///TODO: Unit test this method
    var user = userRepository.getUserById(userIndex);

    //User Index
    $('#userIndex').val(userIndex);

    //User Name
    $('#userNameTitle').append(user.userName);

    //User Stats (start wight, current weight, percentage Change)
    var startingWeight = user.weighIns[0].weighInWeight
        , currentWeight = user.weighIns[user.weighIns.length - 1].weighInWeight;

    $('#startingWeight').append(startingWeight);
    $('#currentWeight').append(currentWeight);
    var delta = changePercentage(startingWeight, currentWeight);
    var $delta = $('#delta');
    $delta.append(delta + '%');
    if(delta < 0 ){ $delta.addClass('greenText'); }
    else if(delta > 0){ $delta.addClass('redText'); }

    //Weigh In Table and Chart
    $('#weighIns').empty();
    populateWeighInTable(user.weighIns)
    displayChart();
}

function populateWeighInTable(data, paramPreviousWeight) {

    var weighInTemplate = _.template($('#weighInRow').html())
        , $weighIns = $('#weighIns')
        , dataLen = data.length
        , previousWeight = paramPreviousWeight;
    for (var i = 0; i < dataLen; i++) {
        if (previousWeight) {
            data[i].weighInChange = changePercentage(previousWeight, data[i].weighInWeight);
        } else {
            data[i].weighInChange = '----'
        }
        previousWeight = data[i].weighInWeight;
        $weighIns.append(weighInTemplate(data[i]));
    }
}

function chooseUserDialog() {
    var $chooseUserDialog = $('<div class="section"><div class="fieldGroup"><label>Please select user:</label><select id="chooseUser"><option value="-1" selected>-- Please Choose --</option></select></div></div>')

    var userList = userRepository.getUserList();
    var numUsers = userRepository.length();
    var $userSelect = $chooseUserDialog.find('#chooseUser');
    for (var i = 0; i < numUsers; i++) {
        $userSelect.append($('<option value="' + userList[i].userIndex + '">' + userList[i].userName + '</option>'));
    }

    $userSelect.change(function () {
        userIndex = $(this).val();
        $($(this).parents()[1]).dialog('close')
        populateUserDataToPage();
    });

    $chooseUserDialog.dialog({
        modal:true,
        draggable:false,
        resizable:false,
        closeOnEscape:false,
        buttons:[
            {
                text:"Create New User",
                click:function () {
                    $(this).dialog('close');
                    createUserDialog();
                }
            }
        ],
        close:function () {
        }
    });
}

function clearCurrentUserData() {
    //Clear User Index, User Name, Weigh in Table, Chart
    var allFields = $([]).add($('#userIndex')).add($('#userNameTitle')).add($('#weighIns')).add($('#container')).add($('#startingWeight')).add($('#currentWeight')).add($('#delta'));
    allFields.empty();
    $('#delta').removeClass();
}

function changeUser() {
    clearCurrentUserData();
    if (userRepository.length() == 1) {
        createUserDialog();
    } else {
        chooseUserDialog();
    }
}

function addWeighIn() {
    var userIndex = $('#userIndex').val()
        , previousWeighIn = userRepository.getCurrentWeighIn(userIndex)
        , weighIn = {}
        , $date = $('#weighInDate')
        , $weight = $('#weighInWeight')
        , $currentWeight = $('#currentWeight')
        , $delta = $('#delta');
    weighIn.weighInDate = $('#weighInDate').val();
    weighIn.weighInWeight = $('#weighInWeight').val();

    var allFields = $([]).add($date).add($weight);
    allFields.removeClass('inputError');

    var validInput = validateDate($date, previousWeighIn.weighInDate)
    validInput = validateWeight($weight) && validInput;





    if (validInput) {
        //Clear and add to userStatus fields
        $currentWeight.empty().append(weighIn.weighInWeight);
        $delta.empty().append(changePercentage($('#startingWeight').text(), weighIn.weighInWeight));


        //If user has reached or surpassed their goal, let them know.


        userRepository.addUserWeighIn(userIndex, weighIn);
        populateWeighInTable($([]).add(weighIn), previousWeighIn.weighInWeight);
        allFields.val('');
        displayChart();
    }
}

//Data Validation functions
function validateDate(dateField, previousDate) {
    ///TODO: Unit test this method
    var newDate = new Date(dateField.val());
    if (!dateField.val() || newDate == "Invalid Date" || new Date(previousDate) >= newDate) {
        dateField.addClass('inputError');
        return false;
    }else return true;
}

function validateWeight(weightField) {
    ///TODO: Unit test this method
    if (!$.isNumeric(weightField.val())) {
        weightField.addClass('inputError');
        return false;
    } else return true;
}

//Data Calculation Functions
function changePercentage(startWeight, currentWeight) {
    ///TODO: Unit test this method
    var start = parseFloat(startWeight)
        , current = parseFloat(currentWeight);

    return ((current - start) / start * 100.0).toFixed(2);
}


//Chart display methods.
function displayChart() {
    var userIndex = $('#userIndex');
    var weighIns = userRepository.getUserWeighIns($('#userIndex').val());
    var weighInLen = weighIns.length;
    var line1 = new Array();
    for (var i = 0; i < weighInLen; i++) {
        var plotPoint = new Array();
        plotPoint[0] = new Date(weighIns[i].weighInDate);
        plotPoint[1] = parseFloat(weighIns[i].weighInWeight);
        line1[i] = plotPoint;
    }

    $('#container').empty();

    var plot1 = $.jqplot('container', [line1], {
        title:'Default Date Axis',
        axes:{
            xaxis:{
                renderer:$.jqplot.DateAxisRenderer,
                //				tickOptions: {
                //					formatString: '%d %b',
                //					angle: -30,
                //				},
                tickRenderer:$.jqplot.CanvasAxisTickRenderer,
                numberTicks:4,
                tickOptions:{
                    formatString:'%d %b',
                    angle:-30
                }
                //				tickRenderer: $.jqplot.CanvasAxisTickRenderer

                //,
                //ticketInterval: '3 weeks'

            }
        }
    });
}


//Dev/Debug Methods
function reinitalizeLocalStorage(){
    localStorage.clear();

    var user = {};
    user.userName = 'User 1';
    user.goalWeight = '200';
    user.weighIns = [ {weighInDate: '06/01/2012', weighInWeight: 250}, {weighInDate: '06/08/2012', weighInWeight: 245}, {weighInDate: '06/015/2012', weighInWeight: 240}, {weighInDate: '06/22/2012', weighInWeight: 243}, {weighInDate: '06/29/2012', weighInWeight: 238}];
    var users = new Array();
    users[0] = user;
    localStorage.setItem('users', JSON.stringify(users));
}