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





const express = require('express')
const cors = require("cors")
const bodyParser = require("body-parser")
const MongoClient = require('mongodb').MongoClient;
const app = express()
const port = 5000

app.use(cors())
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.send('Hello World!')
})




const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const orderscollection = client.db("creativeagency").collection("orders");
  const reviewcollection = client.db("creativeagency").collection("reviews");
 
app.post("/addorder",(req,res) => {
    const orderinfo = req.body
console.log(orderinfo);
orderscollection.insertOne(orderinfo)
.then(result => {
    console.log(result.insertedCount > 0);
})

})


app.get('/getorders',(req,res) => {
    orderscollection.find({email: req.query.email})
    .toArray((err,documents) => {
        res.send(documents)
        // console.log(documents);
    })
})


app.get('/getallreviews',(req,res) => {
    
    reviewcollection.find({})
    .toArray((err,documents) => {
        res.send(documents)
    })
})

app.post("/addreview",(req,res) => {
    const reviewinfo = req.body
    console.log(reviewinfo);
    reviewcollection.insertOne(reviewinfo)
    .then(result => {
        console.log(result.insertedCount > 0);
    })
})

  console.log("db connected");
});



app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})