//Setting up express (global variables for other files to access)
const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');

//Setting up PORT, change port if necessary
const PORT = 3000;
    app.listen(PORT, () => {
    console.log('Server running on port 3000');
});

//Making GET accessible---------------------------------------------------------------------------------
//PathHere should contain your path to the html files
const pathHere = path.join(__dirname);
app.use(express.static(pathHere));

app.get('/', function(req, res, next) { 
    res.sendFile(path.join(pathHere, 'index.js'));
});

//BodyParser middleware (helps get data from input fields)
app.use(bodyParser.urlencoded( {extended:false} ));
app.use(bodyParser.json());

//MySQL constant for other files to access
const mysql = require('mysql2');

//Setting up the connection to the database -----------------------------------------------------------------------------
//Make sure to have the correct info for the database 
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'database287',
});

db.connect((err) => {
    if(err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connection to MySQL database was successful.');
});

//Client section START ---------------------------------------------------------------------------------------------------------------------------------------------

//Getting username and email
app.get('/getClient', (req, res) => {
  const sql = 'SELECT * FROM client';
  let query = db.query(sql, (err, result) => {
      if(err) {
          console.log('Error: ' + err.message);
          res.status(500).send('Could not retrieve client information from database.');
      }else{
          console.log("Got client data!");
          res.send(result);
          return;
      }
  });
});

//Getting data for client.js (to make the tables with active and inactive serial numbers)
//Active licenses
app.get('/getactivelicenses', (req, res) => {
  const sql = 'SELECT * FROM serialnumbers';
  let query = db.query(sql, (err, result) => {
      if (err) {
      console.log('Error: ' + err.message);
      res.status(500).send('Could not retrieve inactive licenses from database.');
      }
      console.log("Got active licenses!");
      res.send(result);
      return;
  });
});
//Inactive licenses
app.get('/getinactivelicenses', (req, res) => {
  const sql = 'SELECT * FROM inactivelicenses';
  let query = db.query(sql, (err, result) => {
      if(err){
          console.log('Error: ' + err.message);
          response.send("Could not retrieve inactive licenses from database.");
      }else{
          console.log("It worked!");
          console.log(result);
          res.send(result);
          return;
      }                    
  });
});

//Form data handling --------------
//Helps me fetch data here
app.get('/', (req, res) => {
res.sendFile('/client.html');
});

//This is where I'm supposed to grab the data... not working :) I keep getting CANNOT POST /submit error when I submit the form but i think thats just me
//that didnt really understand how I'm supposed to grab the data
app.post('/addNewLicense', (req, res) => {
  const serialNumber = req.body.sn;
  const software = req.body.software;
  const purchaseDate = req.body.purchasedate;
  const expiryDate = req.body.expirydate;
  const additionalInfo = req.body.productinfo;

  const dataObject = {
      sn: serialNumber,
      sft: software,
      pd: purchaseDate,
      ed: expiryDate,
      addInf: additionalInfo
  };

  const insertSerialNumberInfo = 'INSERT INTO serialnumbers (id, serialNumber, brand, purchaseDate, expiryDate, extraInfo) VALUES (?,?,?,?,?,?)';
  
  let query = db.query(insertSerialNumberInfo, ['', dataObject.sn, dataObject.sft, dataObject.pd, dataObject.ed, dataObject.addInf], (err, results) => {
      if(err){
          console.log('Error: ' + err.message);
          res.status(500).send("Could not insert serial number to database.");
      }else{
          console.log('Serial number successfully added into MySQL.', results);
          res.redirect('/client.html');
      }
  });
});

// ------- Modify account information --------
app.post('/editClientInfoModification', (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const oldpassword = req.body.oldpassword;
  const password = req.body.password;

  console.log(req.body);
  console.log(req.params.id);
  const sql = `UPDATE client SET name='${name}', email='${email}', password='${password}' WHERE password='${oldpassword}';`;
  let query = db.query(sql, (err, result) => {
      if(err){
          console.log('Error: ' + err.message);
          res.status(500).send("Could modify account information.");
      }else{
          console.log('User information updated successfully.', result);
          res.redirect('/client.html');
      }
  });
});

// ------- Delete account --------
app.post('/deletingClientAccount', (req, res) => {
  const password = req.body.password;

  // const pw = req.body.
  const sql = `DELETE FROM client WHERE password='${password}'`;
  let query = db.query(sql, (err, result) => {
      if(err){
          console.log('Error: ' + err.message);
          res.status(500).send("Could not delete client from database.");
      }else{
          console.log('Client successfully deleted.', result);
          res.redirect('/deletedaccount.html');
      }
  });    
});

// Handling feedback submissions
app.post('/feedback', (req, res) => {
  const feedback = req.body.feedback;

  const sql = 'INSERT INTO feedback (feedback_text) VALUES (?)';
  db.query(sql, [feedback], (err, results) => {
      if (err) {
          console.error('Error submitting feedback: ' + err.stack);
          res.status(500).send('Error submitting feedback.');
          return;
      }
      res.send('Feedback submitted successfully!');
  });
});


//Client section END -----------------------------------------------------------------------------------------------------------------------------------------------


//Newsletter section START ---------------------------------------------------------------------------------------------------------------------------------------------

// Parse JSON bodies for this app
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // To support URL-encoded bodies

// Handling newsletter subscriptions
app.post('/subscribe', (req, res) => {
    const { email } = req.body;
  
    // Assuming a 'newsletter_subscribers' table exists in your MySQL database
    const sql = 'INSERT INTO newsletter_subscribers (email) VALUES (?)';
    db.query(sql, [email], (err, results) => {
      if (err) {
        console.error('Error subscribing to newsletter: ' + err.stack);
        res.status(500).send('Error subscribing to newsletter.');
        return;
      }
      res.send('You have been successfully subscribed to the newsletter!');
    });
  });

//Newsletter section END -----------------------------------------------------------------------------------------------------------------------------------------------


//Nav4 section START ---------------------------------------------------------------------------------------------------------------------------------------------

// Handling contact messages 
app.post('/contacts', (req, res) => {
    const { name, email, message } = req.body;
    
    // Assuming a 'contacts' table exists in your MySQL database
    const sql = 'INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)';
    db.query(sql, [name, email, message], (err, results) => {
      if (err) {
        console.error('Error sending message: ' + err.stack);
        res.status(500).send('Error sending message.');
        return;
      }
      res.send('Message sent successfully! We will contact you shortly for an answer.');
    });
  });

//Nav4 section END ---------------------------------------------------------------------------------------------------------------------------------------------



//Sign up section START --------------------------------------------------------------------------------------------------------------------------------------------
// POST route for /register

app.post('/register', (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password; 


  if (!name || !email || !password) {
      return res.status(400).send('All fields are required');
  }

  //insert new user
  const sql = `INSERT INTO client (name, email, password, serialNumbers) VALUES ('${name}', '${email}', '${password}', 0);`;

  let query = db.query(sql, (err, result) => {
      if(err) {
          console.log('Error: ' + err.message);
          return res.status(500).send("Could not register user.");
      } else {
          console.log('User registered successfully.', result);
          res.redirect('/client.html');
      }
  });
});


//Sign up section END --------------------------------------------------------------------------------------------------------------------------------------------





//Sign in section START --------------------------------------------------------------------------------------------------------------------------------------------





//Sign in section END --------------------------------------------------------------------------------------------------------------------------------------------