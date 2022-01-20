let urlBase = 'http://ec2-3-16-166-251.us-east-2.compute.amazonaws.com:3000';

function start() {
    var x = document.getElementById("Lpassword");
    
    x.addEventListener("keyup", function(event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            document.getElementById("signInBTN").click();
        }
    });
    
    var y = document.getElementById("Lusername");
    
    y.addEventListener("keyup", function(event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            document.getElementById("signInBTN").click();
        }
    });
}

async function tryLogin() {
    let currentUser = document.getElementById("Lusername").value;
    let currentPassword = document.getElementById("Lpassword").value
    
    let url = urlBase+'/'+'tryLogin';

    let res = await fetch(url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: currentUser,
            password: currentPassword
        })
    })
    .then(response => response.json())

    console.log(res.message);

    if (res.message === "success") {
        window.localStorage.setItem('currentUsername', currentUser)
        window.location.replace("http://macrotrackingsupremo.com/AddMeals.html");
    }
    else {
        alert("Username/Password Combination Is Incorrect");
    }
}