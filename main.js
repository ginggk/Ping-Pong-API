var pageData = {
    playerOne: "",
    playerTwo: "",
    playerOneScore: 0,
    playerTwoScore: 0,
    userInfo: [],
    token: ""
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
    getUsers().then(function() {
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
        listenForConfirmation();
        // listenForTakenUsername();
    });
    // listenForConfirmation();
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
    // listenForPassword();
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
            if (newJson.token) {
                pageData.username = username;
                pageData.token = newJson.token;
                var button = document.getElementById("loginButton");
                getUsers().then(function() {
                    showHome(pageData);
                });
            }
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
// showPlayGame();

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
        if (pageData.playerOneScore < 10) {
            pageData.playerOneScore += 1;
            showScoreGame();
        } else {
            var source = document.getElementById("endGame").innerHTML;
            var template = Handlebars.compile(source);
            var winMessage = document.getElementById("script-placement");
            winMessage.innerHTML = template({
                userWon: `${pageData.playerOne} won!`,
                scores: `${pageData.playerOne} had 10 points.\n${
                    pageData.playerTwo
                } had ${pageData.playerTwoScore}`,
                buttonMessage: "Home"
            });
            listenForWin();
        }
    });
    player2Button.addEventListener("click", function() {
        if (pageData.playerTwoScore < 10) {
            pageData.playerTwoScore += 1;
            showScoreGame();
        } else {
            var source = document.getElementById("endGame").innerHTML;
            var template = Handlebars.compile(source);
            var winMessage = document.getElementById("script-placement");
            winMessage.innerHTML = template({
                userWon: `${pageData.playerTwo} won!`,
                scores: `${pageData.playerTwo} had 10 points.\n ${
                    pageData.playerOne
                } had ${pageData.playerOneScore}`,
                buttonMessage: "Home"
            });
            listenForWin();
        }
        // listenForWin();
    });
    // listenForWin();
}

function listenForWin() {
    var button = document.getElementById("winButton");
    button.addEventListener("click", showPlayGame);
}

function confirmPassword() {
    var password = document.getElementById("inputPassword").value;
    var repeatPassword = document.getElementById("inputPasswordRepeat").value;
    var passwordRepeat = document.getElementById("inputPasswordRepeat");
    var button = document.getElementById("signupButton");
    if (password != repeatPassword) {
        button.setAttribute("disabled", "disabled");
        passwordRepeat.classList.remove("valid");
        passwordRepeat.classList.add("invalid");
        var pTag = document.getElementById("pTag2");
        pTag.innerHTML = "That is not the same password as the one above.";
    } else {
        button.removeAttribute("disabled", "disabled");
        passwordRepeat.classList.remove("invalid");
        passwordRepeat.classList.add("valid");
        var pTag = document.getElementById("pTag2");
        pTag.innerHTML = "";
    }
}

function listenForConfirmation() {
    var passwordRepeat = document.getElementById("inputPasswordRepeat");
    passwordRepeat.addEventListener("change", confirmPassword);
}
