// JS Array
const accounts = [
    { name: "Client1", address: "Address1", email: "client1@example.com"},
    { name: "Client2", address: "Address2", email: "client2@example.com"},
    { name: "Client3", address: "Address3", email: "client3@example.com"}
];
const associations = [
    { clientName: "Client1", serialNumber: "L23434305SX", product: "Microsoft Windows 10 Home", purchaseDate: "2023-01-15", expiryDate: "2024-01-15", status: "Active" },
    { clientName: "Client2", serialNumber: "P28917218SX", product: "Clip Studio Paint EX", purchaseDate: "2023-02-20", expiryDate: "2024-02-20", status: "Inactive" },
    { clientName: "Client3", serialNumber: "LOP89217SX", product: "McAffee Total Protection", purchaseDate: "2023-03-25", expiryDate: "2024-03-25", status: "Active" }
];

// Create or Edit an account Feature
document.getElementById('createEditAccount').addEventListener('click', function () {
    const name = document.getElementById('name').value;
    const address = document.getElementById('address').value;
    const email = document.getElementById('email').value;
    const existingAccount = accounts.find(account => account.name === name);

    if (existingAccount) {
        existingAccount.address = address;
        existingAccount.email = email;
    } else {
    accounts.push({ name, address, email });
    }
    clearAccountForm();
    updateClientOptions();
    updateClientTable();
});

// Delete Account Feature
document.getElementById('deleteAccount').addEventListener('click', function () {
    const name = document.getElementById('name').value;
    const index = accounts.findIndex(account => account.name === name);

    if (index !== -1) {
        accounts.splice(index, 1);
        clearAccountForm();
        updateClientOptions();
        updateClientTable();
        }
});

// Clear Account from Display
function clearAccountForm() {
    document.getElementById('name').value = '';
    document.getElementById('address').value = '';
    document.getElementById('email').value = '';
}

// Client dropdown list
function updateClientOptions() {
    const clientSelect = document.getElementById('clientSelect');
    clientSelect.innerHTML = '';

    for (const account of accounts) {
        const option = document.createElement('option');
        option.value = account.name;
        option.text = account.name;
        clientSelect.appendChild(option);
    }
}

// Generate a serial number
document.getElementById('generateSerial').addEventListener('click', function () {
    const serialNumber = generateRandomSerialNumber();
    alert(`Generated Serial Number: ${serialNumber}`);
});

// Associate a serial number with a client and product
document.getElementById('associate').addEventListener('click', function () {
    const clientName = document.getElementById('clientSelect').value;
    const serialNumber = document.getElementById('serialNumber').value;
    const product = document.getElementById('product').value;

    associations.push({ clientName, serialNumber, product });
    updateAssociationsTable();
});

// Generate a random serial number
function generateRandomSerialNumber() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let serialNumber = '';

    for (let i = 0; i < 16; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        serialNumber += characters.charAt(randomIndex);
    }

    return serialNumber;
}

// Update the client information table
function updateClientTable() {
    const clientTable = document.getElementById('clientTable');
    clientTable.innerHTML = '';

    for (const account of accounts) {
        const row = clientTable.insertRow();
        row.insertCell(0).textContent = account.name;
        row.insertCell(1).textContent = account.address;
        row.insertCell(2).textContent = account.email;
    }
}

// Update the associations table
function updateAssociationsTable() {
    const associationTable = document.getElementById('associationTable');
    associationTable.innerHTML = '';

    for (const association of associations) {
        const row = associationTable.insertRow();
        row.insertCell(0).textContent = association.clientName;
        row.insertCell(1).textContent = association.serialNumber;
        row.insertCell(2).textContent = association.product;
        row.insertCell(3).textContent = association.purchaseDate;
        row.insertCell(4).textContent = association.expiryDate;
        row.insertCell(5).textContent = association.status;
    }
}

// Array of serial numbers and states
const serialNumbersState = [];

//Manage serial number feature
document.getElementById('enableSerial').addEventListener('click', function () {
    manageSerialNumber('enabled');
});
document.getElementById('blockSerial').addEventListener('click', function () {
    manageSerialNumber('blocked');
});
document.getElementById('disableSerial').addEventListener('click', function () {
    manageSerialNumber('disabled');
});

function manageSerialNumber(newState) {
    const serial = document.getElementById('serialNumber2').value;

    if (!serial) {
        alert('Please enter a serial number.');
        return;
    }

    const associationExists = associations.some(assoc => assoc.serialNumber === serial);
    
    if (!associationExists) {
        alert('This serial number is not associated with any client.');
        return;
    }
    
    const serialState = serialNumbersState.find(s => s.serial === serial);
    
    if (serialState) {
        serialState.state = newState;
    } else {
        serialNumbersState.push({ serial, state: newState });
    }
    
    alert(`Serial number has been ${newState}.`);
}



function manageSerialNumber(newState) {
    const serial = document.getElementById('serialNumber2').value;
    
    if (!serial) {
        alert('Please enter a valid serial number.');
        return;
    }
    
    const associationExists = associations.some(assoc => assoc.serialNumber === serial);
    
    if (!associationExists) {
        alert('This serial number is not associated with any client.');
        return;
    }
    
    const serialState = serialNumbersState.find(s => s.serial === serial);
    
    if (serialState) {
        serialState.state = newState;
    } else {
        serialNumbersState.push({ serial, state: newState });
    }
    
 
    const associationTableRows = document.getElementById('associationTable').rows;
    for (let i = 0; i < associationTableRows.length; i++) {
        const cell = associationTableRows[i].cells[1];
        if (cell.textContent === serial) {
            cell.classList.remove('serial-enabled', 'serial-blocked', 'serial-disabled');
            cell.classList.add('serial-' + newState);
        }
    }
    
    alert(`Serial number has been ${newState}.`);
}

// Initialize client options and associations tables
updateClientOptions();
updateClientTable();
updateAssociationsTable();