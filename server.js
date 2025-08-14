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



const serverUrl = 'https://evettenew.onrender.com';

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
  keepAlive;
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
    Sex: { type: String, uppercase: true },
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
    const founduser = await Evette.findByIdAndUpdate(id);
    if (!founduser){
      return res.status(404).send('no user found')
    }
    founduser.Aname.Name = req.body.Name,
    founduser.Aname.Mname = req.body.Mname,
    founduser.Aname.Surname = req.body.Surname,
    founduser.RegNo = req.body.RegNo,
    founduser.Validity = req.body.Validity,
    founduser.Sex = req.body.Gender,
    founduser.Bloodgroup= req.body.Bloodgroup,
    founduser.PhoneNumber= req.body.PhoneNumber,
    founduser.EmergencyNo= req.body.EmergencyNo,
    founduser.State= req.body.State,
    founduser.LocalGovernment= req.body.LocalGovernment,          
  
  //await founduser.save();
  await founduser.updateOne({$set:founduser},{ new: true, runValidators: true });
  res.redirect('/' + req.params.id)

  } catch (err){
  res.status(500).send('error occured');
  }
  });

//  const useroo = await ben.updateOne({_id:_id},{$set:{used:true}});
       // useroo.used = true

  app.post('/edippoot/:id', async (req, res) => {
  try {
    let updateData = {};

    // Top-level fields
    if (req.body.RegNo) updateData.RegNo = req.body.RegNo;
    if (req.body.Sex) updateData.Sex = req.body.Gender;
    if (req.body.Bloodgroup) updateData.Bloodgroup = req.body.Bloodgroup;
    if (req.body.PhoneNumber) updateData.PhoneNumber = req.body.PhoneNumber;
    if (req.body.EmergencyNo) updateData.EmergencyNo = req.body.EmergencyNo;
    if (req.body.State) updateData.State = req.body.State;
    if (req.body.LocalGovernment) updateData.LocalGovernment = req.body.LocalGovernment

    // Nested contact fields
    if (req.body.Name) updateData['Aname.Name'] = req.body.Name;
    if (req.body.Mname) updateData['Aname.Mname'] = req.body.Mname;
    if (req.body.Surname) updateData['Aname.Surname'] = req.body.Surname;

    await Evette.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    res.redirect('/' + req.params.id);
  } catch (err) {
    res.status(500).send(err.message);
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
    const uuid = uuidfh() + '.jpg';
    const fileMetadata = {
        name: uuid,
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
        fields: 'id,webViewLink,name'
    });

    return response.data
}

   app.post("/new", upload.single('image'), async(req, res) => {
    try {
        const Pathoo = await uploadImageToGoogleDrive(req.file);
       const imagePath = 'image/' + Pathoo.name;
        const urli =  Pathoo.webViewLink;
        const urlii =  'https://lh3.googleusercontent.com/d/' + Pathoo.id + '=s400?authuser=0';

        function pad(n) {
            return n < 10 ? '0' + n : n;
        }

        // Get the current date and time
        const now = new Date();
        const year = now.getFullYear();
        const month = pad(now.getMonth() + 1); // Months are zero-based
        const day = pad(now.getDate());
        const hours = pad(now.getHours());
        const minutes = pad(now.getMinutes());
        const seconds = pad(now.getSeconds());

        // Format the date and time
        const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;


        let newEvette = new Evette({
            Aname: {
                 Name: req.body.Name,
                 Mname: req.body.Mname,
                 Surname: req.body.Surname
             },
            fullname: req.body.fullname,
            State: req.body.State,
            LocalGovernment: req.body.LocalGovernment,
            Sex: req.body.Gender,
            Bloodgroup: req.body.Bloodgroup,
            PhoneNumber: req.body.PhoneNumber,
            EmergencyNo: req.body.EmergencyNo,
            RegNo: req.body.RegNo,
            Validity: req.body.Validity,
            picturepath: imagePath,
            //picturepath: req.body.imagePath,
            imgurl: urli,
            image: urlii,
            //imgurli: req.body.urlii,
            time: formattedDate,
            
        });
        const {RegNo} = req.body;
        const exist = await Evette.findOne({ RegNo });
          if (exist) {
         res.send('<h1 style="font-size:6rem;margin-top:15rem;text-align:center;justify-self:center;">Already exist<h1>');
          }
        await newEvette.save();
        res.redirect(`/sample.html`)
    } catch (error) {
        res.status(500).send('Error saving data');
    } //finally {
    //fs.unlinkSync(req.file.path); // Clean up the uploaded file
    //}
    //res.json({message: `Post added successfully! Your Post Id is ${newPost.id}`,});
    //res.redirect("/"); <h1 style="font-size:5rem; margin-top:0rem;text-align: center;">${newNote.EmergencyNo}</h1>
})
  

connectDB()
app.listen(3000, (req, res) => {
  console.log('The server is up and running on port 3000')
});
