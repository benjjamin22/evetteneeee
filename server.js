const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const expressSanitizer = require('express-sanitizer')
const multer = require('multer');
const { google } = require('googleapis');
const axios = require('axios');
const stream = require("stream");
const cron = require('node-cron');
const { customAlphabet } = require('nanoid');
const path = require ( 'path') ;
const fs = require ( 'fs') ;
const Schema = mongoose.Schema

  const accountan = path.join(process.cwd(),'./check.json')
  const accounts = JSON.parse(fs.readFileSync(accountan,'utf-8'));



const serverUrl = 'https://evettid.onrender.com';

const keepAlive = () => {
    axios.get(serverUrl)
        .then(response => {
            console.log(`server response with status:${response.status}`)
        })
        .catch(error => {
            console.log(`error keeping server alive:${error.message}`)
        })
}

cron.schedule('*/14 * * * *', () => {
  console.log('Sending keep-alive request to server...');
  keepAlive();
});

console.log('Keep-alive script started.');

const oauth2Client = new google.auth.OAuth2(
  '299799989715-9j5t32aoriem1chgjkd1d91vleh9njni.apps.googleusercontent.com',
  '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',
  'https://developers.google.com/oauthplayground'
);

oauth2Client.setCredentials({ refresh_token: '1//04SleHQlO68aLCgYIARAAGAQSNwF-L9IrZKYFd3YWazjkliZA_Z3tO98_P1q76Eb-_zLAugY-fN2A6M0kHNABfJL9OEnrB90YC3c' });

const drive = google.drive({ version: 'v3', auth: oauth2Client });

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const app = express();


  mongoose.set('strictQuery', false);
const connectDB = async() => {
    try {
        //const conn = await mongoose.connect('mongodb+srv://Mydatabase:prototype22@database.tswsylv.mongodb.net/database?retryWrites=true&w=majority');
       const conn =await mongoose.connect('mongodb+srv://Ben:benjamin@evettestudentsid.rlm3y.mongodb.net/evettestudentsid?retryWrites=true&w=majority');
      console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(methodOverride('_method'))


//SCHEMA
var NoteSchemer = new Schema({
  Aname: {
    Name: { type: String, uppercase: true },
    Mname: { type: String, uppercase: true },
    Surname: { type: String, uppercase: true }
},
    RegNo: { type: String, uppercase: true },
    Validity: { type: String, uppercase: true },
    Modeofstudy: { type: String, uppercase: true },
    Gender: { type: String, uppercase: true },
    Bloodgroup: { type: String, uppercase: true },
    PhoneNumber: { type: String, uppercase: true },
    EmergencyNo:{ type: String, uppercase: true },
    State: { type: String, uppercase: true },
    LocalGovernment: { type: String, uppercase: true },
    image: { type: String },
    picturepath:{ type: String },
    sn: { type: Number }
});
NoteSchemer.pre("save", function(next) {
  var docs = this;
  mongoose.model('Evette', NoteSchemer).countDocuments()
      .then(function(counter) {
          docs.sn = counter + 1;
          next();
      });
});
var Evette = mongoose.model("Evette", NoteSchemer);

app.get('/detail', async(req, res) => {
  try {
      const data = await Evette.find().sort({_id:-1});
      res.json(data);
  } catch (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
  }
});

  app.get('/getall', function(req, res, next) {
    const data = accounts;
    res.json(data)
  });

//EDIT
app.get('/:id', async(req, res) => {
const id = req.params.id;
try{
  const founduser = await Evette.findById(id);
  if (!founduser){
    return res.status(404).send('no user found')
  }
    res.render('result', {data:founduser})
} catch (err){
res.status(500).send('error ocĉured');
}
});

//new
app.get('/new', (req, res) => {

  try{
    
      res.render('user')
  } catch (err){
  res.status(500).send('error ocĉured');
  }
  });
     
//UPDATE ROUT
app.post('/edit/:id', async (req, res) => {
  const {id} = req.params;
  try{
    const founduser = await Evette.findById(id);
    if (!founduser){
      return res.status(404).send('no user found')
    }
    founduser.Aname.Name = req.body.Name,
    founduser.Aname.Mname = req.body.Mname,
    founduser.Aname.Surname = req.body.Surname,
    founduser.RegNo = req.body.RegNo,
    founduser.Sex = req.body.Sex,
    founduser.Bloodgroup= req.body.Bloodgroup,
    founduser.PhoneNumber= req.body.PhoneNo,
    founduser.EmergencyNo= req.body.EmergencyNo,
    founduser.State= req.body.State,
    founduser.LocalGovernment= req.body.LocalGovt,          
  
  await founduser.save();
  res.redirect('/' + req.params.id)

  } catch (err){
  res.status(500).send('error occured');
  }
  });

  //const passo = hashID(6)
  let gen = n=> [...Array(n)].map(_=>Math.random()*10|0).join``

  // TEST: generate 6 digit number
  // first number can't be zero - so we generate it separatley
  let sixDigitStr = (1+Math.random()*9|0) + gen(4)
  let uuide = ( +(sixDigitStr) ) // + convert to num
  
  
  const uuidfh = customAlphabet('123456890',5);
  
  
  async function uploadImageToGoogleDrive(file) {
    const bufferStream = new stream.PassThrough();
    bufferStream.end(file.buffer);
    const uuidf = uuidfh() + '.jpg';
    const fileMetadata = {
        name: uuidf,
        //name: req.file.originalname,
        //name: file.originalname,
        parents: ["10KpoRo-jHT62ko_7BNH9khxA2S_6GY42"],
    };

    const media = {
        mimeType: file.mimetype,
        body: bufferStream
    };

    const response = await drive.files.create({
        resource: fileMetadata,
        media: media,
        fields: 'id,name'
        //fields: 'id, webContentLink',
    });

    return response.data.name
}


 
  app.post("/new", upload.single('image'), async(req, res) => {
    try {
        const Pathoo = await uploadImageToGoogleDrive(req.file);
        const imagePath = Pathoo;

      let newEvette = new Evette({
        Aname: {
          Name: req.body.Name,
          Mname: req.body.Mname,
          Surname: req.body.Surname
      },
        RegNo: req.body.RegNo,
        Validity: req.body.Validity,
        Modeofstudy: req.body.Modeofstudy,
        Gender: req.body.Gender,
        Bloodgroup: req.body.Bloodgroup,
        PhoneNumber: req.body.PhoneNumber,
        EmergencyNo: req.body.EmergencyNo,
        State: req.body.State,
        LocalGovernment: req.body.LocalGovernment, 
        image: '/image/' + req.body.image + '.jpg', 
        picturepath: imagePath        
    });
    await newEvette.save();
    res.send(`<!DOCTYPE html><html><body><h1 style="font-size:6rem; margin-top:8rem;text-align: center;">SUCCESSFUL</h1>
      </html>`)
    } catch (err){
    res.status(500).send('error ocĉured');
    }
    });

   
  

connectDB()
app.listen(3000, (req, res) => {
  console.log('The server is up and running on port 3000')
});
