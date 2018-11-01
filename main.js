function listenForHome() {
    var homeLink = document.querySelector("#HomeLink");
    homeLink.addEventListener("click", showHomePage);
}
listenForHome();

function showHomePage() {
    var source = document.getElementById("showHomePage").innerHTML;
    var template = Handlebars.compile(source);
    content = template({
        emptyMessage: "Empty holder for when we put stuff here."
    });
    var place = document.querySelector("#script-placement");
    place.innerHTML = content;
}

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

function listenForBrand() {
    var brand = document.getElementById("brandName");
    brand.addEventListener("click", showHomePage);
}

listenForBrand();
