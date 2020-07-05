const express = require('express');
const bodyParser= require('body-parser')
const app = express();
const MongoClient = require('mongodb').MongoClient  
const uri = "mongodb+srv://akashkarma:1234@database.q8w8g.gcp.mongodb.net/CreditManagement?retryWrites=true&w=majority";
const ObjectId = require('mongodb').ObjectID;
const port = process.env.PORT ;

MongoClient.connect(uri,{ useUnifiedTopology: true })
.then(client => {
  console.log('Connected to Database')
  db = client.db('CreditManagement')
  userCollection = db.collection('UserDB')
})

var path = require('path');
const { error } = require('console');

app.use(express.static(path.join(__dirname, "styles")));
app.use(express.static(path.join(__dirname, "assests")));
app.use(express.static(path.join(__dirname, "./")));
app.use(bodyParser.urlencoded({ extended: true }))
app.set('views', './');
app.set("view engine", "ejs");

app.get('/view', (req, res) => {
    db.collection('UserDB').find().toArray()
      .then(results => {
        res.render("view", {details: results})
      })
      .catch(error => console.error(error))
});
var user1;
var user2;
var cr;
app.post('/creditsend', (req, res)=> {
    db.collection('Transfers').insertOne(req.body).then(out => {
       user1 = req.body.From;
        user2 = req.body.To;
        cr = req.body.Credit;
        db.collection('UserDB').updateOne(
            {Name : user1},
            {$inc: {"Currentcredit" : - Number(cr)}
             });
        db.collection('UserDB').updateOne(
            {Name : user2 },
            {$inc: {"Currentcredit" : + Number(cr)}
             });
        res.redirect('/view')
    })
    
    
    });
    app.get('/transferhistory', (req, res) => {
        db.collection('Transfers').find().toArray()
          .then(results => {
            res.render("transferhistory", {user: results})
          })
          .catch(error => console.error(error))
    });
server.listen(port, () => {
  console.log(`Listening on http://localhost:${port}/`);
});
