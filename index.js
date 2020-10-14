// const express = require("express")
// const fileupload = require("express-fileupload")
// const app = express()
// const port = 5000

// app.use(fileupload())

// app.get("/",(req,res) => {
//     res.send("hello")
// })

// app.post('/add',(req,res) => {
//     if (req.files === null) {
//         return res.status(400).json({msg:"no file"})
//     }

//     const file = req.files.file

//     file.mv(`${__dirname}/${file.name}`,err => {
//         if (err) {
//             console.error(err);
//             return res.status(500)
//         }

// res.json({fileName: file.name,filePath: `${file.name}`})

//     })
// })

// app.listen(port,()=> {
//     console.log("running");
// })

const express = require("express");
const fileupload = require("express-fileupload");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs-extra");
const MongoClient = require("mongodb").MongoClient;
const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(fileupload());
app.use(express.static("services"));

app.get("/", (req, res) => {
  res.send("Hello World!");
});



const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const orderscollection = client.db("creativeagency").collection("orders");
  const reviewcollection = client.db("creativeagency").collection("reviews");
  const servicescollection = client.db("creativeagency").collection("services");

  app.post("/addorder", (req, res) => {
    const orderinfo = req.body;
    console.log(orderinfo);
    orderscollection.insertOne(orderinfo).then((result) => {
      console.log(result.insertedCount > 0);
    });
  });

  app.get("/getorders", (req, res) => {
    orderscollection
      .find({ email: req.query.email })
      .toArray((err, documents) => {
        res.send(documents);
        // console.log(documents);
      });
  });

  app.get("/getallreviews", (req, res) => {
    reviewcollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });

  app.post("/addreview", (req, res) => {
    const reviewinfo = req.body;
    console.log(reviewinfo);
    reviewcollection.insertOne(reviewinfo).then((result) => {
      console.log(result.insertedCount > 0);
    });
  });

  app.get("/getallorders", (req, res) => {
    orderscollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });

  app.post("/addservice", (req, res) => {
    const file = req.files.file;
    const name = req.body.name;
    const des = req.body.des;
    const filePath = `${__dirname}/services/${file.name}`;

    console.log(file, name, des);
    file.mv(filePath, (err) => {
      // console.log(err);
      if (err) {
        console.log(err);
      }

      const newimg = fs.readFileSync(filePath);

      const encodedimg = newimg.toString("base64");

      var image = {
        contentType: req.files.file.mimetype,
        size: req.files.file.size,
        img: Buffer(encodedimg, "base64"),
      };

      servicescollection.insertOne({ name, des, image }).then((r) => {
        console.log(r.insertedCount > 0);
        fs.remove(filePath, (err) => {
          if (err) {
            console.log(err);
            res.status(500).send({ msg: "failed to uploaad" });
          }
          res.send(r.insertedCount > 0);
        });
      });
      // return res.send({name: file.name,path:`/${file.name}`})
    });
  });

  app.get("/allservcies", (req, res) => {
    servicescollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });

  console.log("db connected");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
