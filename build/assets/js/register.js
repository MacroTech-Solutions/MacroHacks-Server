errorBox = document.querySelector("#error");

async function register() {
    event.preventDefault();
    let firstName = document.getElementById("firstName").value;
    let lastName = document.getElementById("lastName").value;
    let email = document.getElementById("email").value.toLowerCase();
    let discord = document.getElementById("discord").value;
    let terms = document.getElementById("terms").checked;
    let result;

    await axios({
        method: 'POST',
        url: 'https://macrohacks.macrotechsolutions.us:9146/http://localhost/register',
        headers: {
            'Content-Type': 'application/json',
            'email': email,
            'firstname': firstName,
            'lastname': lastName,
            "discord": discord,
            "terms": terms
        }
    })
        .then(data => result = data.data)
        .catch(err => console.log(err))
    if (result.data != "Success") {
        errorBox.innerText = result.data;
    } else{
        await clearForm();
        errorBox.innerText = "Successfully registered!";
    }
}

function clearForm(){
    document.querySelector("#fullForm").innerHTML = "<h2 class=\"sr-only\">Login Form</h2>\
    <div class=\"illustration\"><i class=\"fas fa-user-plus\"></i></div>\
    <p style=\"text-align:center\" id=\"error\"></p>\
    <div class=\"form-group\"><input id=\"firstName\" class=\"form-control\" type=\"text\" name=\"firstName\" placeholder=\"First Name\"></div>\
    <div class=\"form-group\"><input id=\"lastName\" class=\"form-control\" type=\"text\" name=\"lastName\" placeholder=\"Last Name\"></div>\
    <div class=\"form-group\"><input id=\"email\" class=\"form-control\" type=\"email\" name=\"email\" placeholder=\"Email Address\"></div>\
    <div class=\"form-group\"><input id=\"discord\" class=\"form-control\" type=\"text\" name=\"discord\" placeholder=\"Discord Username\"></div>\
    <div class=\"form-group d-lg-flex justify-content-lg-center align-items-lg-center\"><input id=\"terms\" type=\"checkbox\" name=\"terms\" placeholder=\"Discord Username\">\
        <p class=\"text-center\" style=\"font-size: 9px;margin-bottom: 0px;\">I agree to the <a href=\"terms\">Terms and Conditions</a> and <a href=\"privacy\">Privacy Policy</a> for MacroHacks.</p>\
    </div>\
    <div class=\"form-group\"><button class=\"btn btn-primary btn-block\" type=\"submit\" onclick=\"register()\">Register</button></div>"
}