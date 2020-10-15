const express = require("express");
const fileupload = require("express-fileupload");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs-extra");
const MongoClient = require("mongodb").MongoClient;
require('dotenv').config({path:'./config/.env'})
const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(fileupload());
app.use(express.static("services"));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const uri =
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vigvf.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
//db connection
client.connect((err) => {
  const orderscollection = client.db("creativeagency").collection("orders");
  const reviewcollection = client.db("creativeagency").collection("reviews");
  const servicescollection = client.db("creativeagency").collection("services");
  const admincollection = client.db("creativeagency").collection("admin");

//add orders
  app.post("/addorder", (req, res) => {
    const orderinfo = req.body;
    console.log(orderinfo);
    orderscollection.insertOne(orderinfo).then((result) => {
      console.log(result.insertedCount > 0);
    });
  });
//get orders by email
  app.get("/getorders", (req, res) => {
    orderscollection
      .find({ email: req.query.email })
      .toArray((err, documents) => {
        res.send(documents);
      
      });
  });
//get all reviews
  app.get("/getallreviews", (req, res) => {
    reviewcollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });
// add  a review
  app.post("/addreview", (req, res) => {
    const reviewinfo = req.body;
    console.log(reviewinfo);
    reviewcollection.insertOne(reviewinfo).then((result) => {
      console.log(result.insertedCount > 0);
    });
  });
//get all orders
  app.get("/getallorders", (req, res) => {
    orderscollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });
//add a service
  app.post("/addservice", (req, res) => {
    const file = req.files.file;
    const name = req.body.name;
    const des = req.body.des;

   
      const newimg = file.data;

      const encodedimg = newimg.toString("base64");

      var image = {
        contentType: file.mimetype,
        size: file.size,
        img: Buffer.from(encodedimg, "base64"),
      };

      servicescollection.insertOne({ name, des, image }).then((r) => {
        console.log(r.insertedCount > 0);
      
      
          res.send(r.insertedCount > 0);
   
      });
   

  });
//get all services
  app.get("/allservcies", (req, res) => {
    servicescollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });

  app.post("/isdoctor", (req, res) => {
    const email = req.body.email;
    admincollection.find({ email: email }).toArray((err, documents) => {
      res.send(documents.length > 0);
      console.log(documents.length > 0);
    });
  });


app.post("/makeadmin",(req,res) => {
  const email = req.body
  console.log(email);
  admincollection.insertOne(email)
  .then(result => console.log(result.insertedCount))
})

  console.log("db connected");
});

app.listen(process.env.PORT ||  port);
