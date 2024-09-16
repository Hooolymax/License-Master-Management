//Change the URL to /getinactivelicenses and /getactivelicenses to load active and inactive licenses

//Code to deal with the modals (does NOT work on dynamically added buttons... I tried to fix but it doesn't work)
window.onclick = function closeOnClick(event) {
    if (event.target.className === "modal") {
        event.target.style.display = "none";
}};

//Fetching user data to display name & email
//UPDATE INFORMATION HERE DEPENDING ON WHICH USER ARRIVES HERE
async function getClient(){
    const res = await fetch('/getClient');
    const data = await res.json();

    const headName = document.getElementById('clientName');
    const headEmail = document.getElementById('clientEmail');
    let welcome = 'Welcome back, ';
    let email = 'Email: ';
    headName.append(welcome + data[1].name);
    headEmail.append(email + data[1].email);
};
getClient();

//Getting elements for active license & inactive license table
async function getActiveLicenses() {
    const response = await fetch('/getactivelicenses');
    const data = await response.json();
    console.log(data);

    const table = document.getElementById('activeTableBody');
    table.innerHTML = '';

    //Inactive licenses will be put in inactive license table
     for(let i = 0; i < data.length; i++){
       const row = table.insertRow();
       row.insertCell(0).textContent = data[i].serialNumber;
       row.insertCell(1).textContent = data[i].brand;
       row.insertCell(2).textContent = data[i].purchaseDate;
       row.insertCell(3).textContent = data[i].expiryDate;
       row.insertCell(4).innerHTML = '<button class="dropbtn"> More </button> <div class="modal"> <div class="modal-content">' + 
       '<span class="close"> &times; </span> <h3> Product Information </h3>' + data[i].extraInfo +
       '</br> <button class="renewbtn"> Renew Subscription </button> <button id="cancelbtn"> Cancel Subscription </button>' +
       '</div> </div>';  
     };
};

async function getInactiveLicenses() {
    const response = await fetch('/getinactivelicenses');
    const data = await response.json();
    console.log(data);

    const table = document.getElementById('inactiveTableBody');
    table.innerHTML = '';

    //Inactive licenses will be put in inactive license table
     for(let i = 0; i < data.length; i++){
       const row = table.insertRow();
       row.insertCell(0).textContent = data[i].sn;
       row.insertCell(1).textContent = data[i].software;
       row.insertCell(2).textContent = data[i].purchaseDate;
       row.insertCell(3).textContent = data[i].expiryDate;
       row.insertCell(4).innerHTML = '<button id = "renewbtn1"> Renew </button>';  
     };
};

//Initializing functions
async function initialize(){
    await getInactiveLicenses();
    await getActiveLicenses();

    var btns = document.querySelectorAll(".dropbtn");
    var modals = document.querySelectorAll(".modal");
    var spans = document.querySelectorAll(".close");
    var renewbtn = document.querySelectorAll(".renewbtn");
    var renewbtn1 = document.querySelectorAll("#renewbtn1");
    var cancelbtn = document.querySelectorAll("#cancelbtn");
    
    console.log("Initializing stuff..");
    
    spans.forEach(function(span, index){
        span.addEventListener("click", (event) => {
            const dynamicSpan = event.target.closest(".close");
            modals[index].style.display = "none";
        });
    });
    
    btns.forEach(function(btn, index) {
        btn.addEventListener("click", (event) => {
            const dynamicBtn = event.target.closest(".dropbtn");
            if(!dynamicBtn) return;
            modals[index].style.display = "block";
        });
    });

    //ERROR: renewbtn.addEventListener is not a function

    //Creating a popup when the renew subscription button is clicked
    renewbtn.forEach(function(btn, index) {
        btn.addEventListener('click', (event) => {
            if(confirm("You're about to renew the subscription of the currently selected license. Your credit card will continue to be charged as usual. " +
                            "Are you sure you want to continue your selection?")){
                        modals[index].style.display = 'none';
                        alert('Your subscription has been successfully renewed and will be active for one more year.');
             }
        });       
    });
    //Creating a popup when the cancel subscription button is clicked
    renewbtn1.forEach(function(btn, index) {
        btn.addEventListener('click', (event) => {
            if(confirm("You're about to renew the subscription of the currently selected license. Your credit card will continue to be charged as usual. " +
                        "Are you sure you want to continue your selection?")){  
                alert('Your subscription has been successfully renewed and will be active for one more year.');
                return;
            }
        });
    });

    cancelbtn.forEach(function(btn, index) {
        btn.addEventListener('click', (event) => {
            if(confirm("You're about to cancel the subscription of the currently selected license. Your credit card will stop being charged yearly," +
                        " and your license will turn inactive on the expiry date. Are you sure you want to continue your selection?")){
            modals[index].style.display = 'none';    
                alert('Your subscription has been successfully cancelled and will be rendered inactive on the expiry date.' + 
                            ' A message will be added to the product information window.');
            }           
        });
    });   
};

initialize();


