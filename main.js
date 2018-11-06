var pageData = {
    playerOne: "",
    playerTwo: "",
    playerOneScore: 0,
    playerTwoScore: 0,
    userInfo: []
    // usernames: []
};

function listenForSignUp(pageData) {
    var signUpLink = document.querySelector("#SignUpLink");
    signUpLink.addEventListener("click", function() {
        showSignUpPage(pageData);
    });
}
listenForSignUp(pageData);

function showSignUpPage(pageData) {
    var source = document.getElementById("showSignUp").innerHTML;
    var template = Handlebars.compile(source);
    content = template({
        username: "Username:",
        password: "Password:",
        passwordConfirm: "Password Confirmation:",
        buttonMessage: "Submit"
    });
    var place = document.querySelector("#script-placement");
    place.innerHTML = content;
    button = document.querySelector("#signupButton");
    button.addEventListener("click", function(event) {
        event.preventDefault();
        onSignIn(pageData);
    });
}

function listenForLogin(pageData) {
    var loginLink = document.querySelector("#LoginLink");
    loginLink.addEventListener("click", function() {
        showLoginPage(pageData);
    });
}
listenForLogin(pageData);

function showLoginPage(pageData) {
    var source = document.getElementById("showLogin").innerHTML;
    var template = Handlebars.compile(source);
    content = template({
        username: "Username:",
        password: "Password",
        buttonMessage: "Submit"
    });
    var place = document.querySelector("#script-placement");
    place.innerHTML = content;
    button = document.querySelector("#loginButton");
    button.addEventListener("click", function(event) {
        event.preventDefault();
        onLogin(pageData);
    });
}

function onSignIn(pageData) {
    username = document.querySelector("#inputUsername").value;
    password = document.querySelector("#inputPassword").value;
    passwordRepeat = document.querySelector("#inputPasswordRepeat").value;
    fetch(`http://bcca-pingpong.herokuapp.com/api/register/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json; charset=utf8"
        },
        body: JSON.stringify({
            username: username,
            password: password,
            password_repeat: passwordRepeat
        })
    })
        .then(function(response) {
            return response.json();
        })
        .then(function(newJson) {
            pageData.username = username;
            pageData.token = newJson.token;
            getUsers();
            showHome(pageData);
        });
}

function onLogin(pageData) {
    username = document.querySelector("#existingUsername").value;
    password = document.querySelector("#existingPassword").value;
    fetch(`http://bcca-pingpong.herokuapp.com/api/login/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json; charset=utf8"
        },
        body: JSON.stringify({
            username: username,
            password: password
        })
    })
        .then(function(response) {
            return response.json();
        })
        .then(function(newJson) {
            pageData.username = username;
            pageData.token = newJson.token;
            getUsers();
            showHome(pageData);
        });
}

function getUsers() {
    return fetch("https://bcca-pingpong.herokuapp.com/api/users/", {
        method: "GET",
        headers: {
            Authorization: `Token ${pageData.token}`
        }
    })
        .then(function(response) {
            return response.json();
        })
        .then(function(newJson) {
            return (pageData.userInfo = newJson);
        });
}

function showHome(pageData) {
    var source = document.getElementById("showHome").innerHTML;
    var template = Handlebars.compile(source);
    content = template({
        welcomeUserMessage: `Welcome ${pageData.username}!`,
        buttonMessage: "Start A New Game",
        leaderBoardPlacement: "This is where the leaderboard goes!"
    });
    var place = document.querySelector("#script-placement");
    place.innerHTML = content;
    showGameStart();
}

function showPlayGame() {
    var source = document.getElementById("showGameSet").innerHTML;
    var template = Handlebars.compile(source);
    getUsers().then(function() {
        content = template({
            setGameMessage: "Set up New Game",
            ref: `${pageData.username}`,
            playerOne: "Player One:",
            playerTwo: "Player Two:",
            listOfUsers: pageData.userInfo,
            // secondListOfUsers: `${getList()}`,
            buttonMessage: "Start Game"
        });
        var place = document.querySelector("#script-placement");
        place.innerHTML = content;

        showGamePlay();
        listenForInput();
    });
}

function showGameStart() {
    var newGameButton = document.getElementById("startNewGame");
    newGameButton.addEventListener("click", showPlayGame);
}

function showScoreGame() {
    var source = document.getElementById("showScoreGame").innerHTML;
    var template = Handlebars.compile(source);
    content = template({
        setScoreGame: "YOUR SCORE TRACKER",
        ref: `${pageData.username}`,
        playerOne: `${pageData.playerOne}`,
        playerOneScore: `Score: ${pageData.playerOneScore}`,
        scoreButtonText: "+1",
        playerTwo: `${pageData.playerTwo}`,
        playerTwoScore: `Score: ${pageData.playerTwoScore}`,
        scoreButtonText2: "+1"
    });
    var place = document.querySelector("#script-placement");
    place.innerHTML = content;
    addOne();
}

function showGamePlay() {
    var newGameButton = document.getElementById("startGame");
    newGameButton.addEventListener("click", function() {
        pageData.playerOne = document.getElementById("firstInput").value;
        pageData.playerTwo = document.getElementById("secondInput").value;
        showScoreGame();
    });
}

function disableButton() {
    var button = document.getElementById("startGame");
    var playerOneInput = document.querySelector(".input1").value;
    var playerTwoInput = document.querySelector(".input2").value;
    if (playerOneInput !== "" && playerTwoInput !== "") {
        button.removeAttribute("disabled", "disabled");
    } else {
        button.setAttribute("disabled", "disabled");
    }
}

function listenForInput() {
    var firstInput = document.getElementById("firstInput");
    var secondInput = document.getElementById("secondInput");
    firstInput.addEventListener("change", disableButton);
    secondInput.addEventListener("change", disableButton);
}

function addOne() {
    var player1Button = document.getElementById("first-player");
    var player2Button = document.getElementById("second-player");
    player1Button.addEventListener("click", function() {
        pageData.playerOneScore += 1;
        showScoreGame();
    });
    player2Button.addEventListener("click", function() {
        pageData.playerTwoScore += 1;
        showScoreGame();
    });
}

function getList(userList) {
    var usernames = [];
    for (var i = 0; i < userList.length; i++) {
        usernames.push(userList[i].username);
        // return usernames;
    }
    return usernames;
}
