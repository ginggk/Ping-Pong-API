function listenForSignUp() {
    var signUpLink = document.querySelector("#SignUpLink");
    signUpLink.addEventListener("click", showSignUpPage);
}
listenForSignUp();

function showSignUpPage() {
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
        onSignIn();
    });
}

function listenForLogin() {
    var loginLink = document.querySelector("#LoginLink");
    loginLink.addEventListener("click", showLoginPage);
}
listenForLogin();

function showLoginPage() {
    var source = document.getElementById("showLogin").innerHTML;
    var template = Handlebars.compile(source);
    content = template({
        username: "Username:",
        password: "Password",
        buttonMessage: "Submit"
    });
    var place = document.querySelector("#script-placement");
    place.innerHTML = content;
}

function onSignIn() {
    username = document.querySelector("#inputUsername").value;
    password = document.querySelector("#inputPassword").value;
    passwordRepeat = document.querySelector("#inputPasswordRepeat").value;
    fetch(`http://bcca-pingpong.herokuapp.com/api/register/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json, charset=utf8"
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
            console.log(newJson);
        });
}
