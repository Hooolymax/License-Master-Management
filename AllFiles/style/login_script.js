
//Redirecting the user to the proper page
var modal = document.querySelector("#signInModal");
var modal2 = document.querySelector("#signUpModal");
console.log(modal2);

function redirectEnduser(){
    window.location.href = ("signIn.html");
    sessionStorage.setItem("userType", "End-User");
}

function redirectVendor(){
    window.location.href = ("signIn.html");
    sessionStorage.setItem("userType", "Vendor");
}

function redirectEnduserSignup(){
    window.location.href = ("signUp.html");
    sessionStorage.setItem("userType", "End-User");    
}
function redirectVendorSignup(){
    window.location.href = ("signUp.html");
    sessionStorage.setItem("userType", "End-User");    
}

function redirecting(){
    let sendingUser = sessionStorage.getItem("userType");
    if(sendingUser == "End-User"){
        window.location.href = ("client.html");
        closing();
    }else{
        window.location.href = ("control.html");
        closing();
    }
}

function noUserType(){
    if(sessionStorage.length == 0){
        if(modal == null){
         modal2.style.display = "block";
        modal2.style.backgroundColor = 'black';   
        }
        if(modal2 == null){
        modal.style.display = "block";
        modal.style.backgroundColor = 'black';            
        }       
    }
}


function redirecting(event) {
    event.preventDefault();

    let userType = sessionStorage.getItem("userType");
    if (userType === "End-User") {
        window.location.href = "client.html";
    } else {
        window.location.href = "control.html";
    } 
}

function closing() {
    sessionStorage.clear();
}




//sign up form


document.getElementById('signupForm').addEventListener('submit', function(event) {
    event.preventDefault();

  
    var formDataObj = {};
    new FormData(this).forEach((value, key) => { formDataObj[key] = value; });

    // Send the form data to the server
    fetch('/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json' 
        },
        body: JSON.stringify(formDataObj) 
    })
    .then(response => response.json()) 
    .then(data => {
        
        console.log(data);
        if (data.success) { 
            window.location.href = '/path-to-success-page.html'; // Redirect to the success page
        } else {
            alert('Registration successd: ' + data.message); 
        }
    })
    .catch(error => {
        console.error('Error:', error);
        
    });
});

