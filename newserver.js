const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const expressSanitizer = require('express-sanitizer')
const Schema = mongoose.Schema



const app = express();


  mongoose.set('strictQuery', false);
const connectDB = async() => {
    try {
        const conn = await mongoose.connect('mongodb+srv://Mydatabase:prototype22@database.tswsylv.mongodb.net/database?retryWrites=true&w=majority');
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
    Gender: { type: String, uppercase: true },
    Bloodgroup: { type: String, uppercase: true },
    PhoneNumber: { type: String, uppercase: true },
    EmergencyNo:{ type: String, uppercase: true },
    State: { type: String, uppercase: true },
    LocalGovernment: { type: String, uppercase: true }
});
var Note = mongoose.model("Note", NoteSchemer);


//EDIT
app.get('/:key/:value', async(req, res) => {
const {key,value} = req.params;
try{
  const founduser = await Note.findOne({[key]:value});
  if (!founduser){
    return res.status(404).send('no user found')
  }
    res.render('result', {data:founduser})
} catch (err){
res.status(500).send('error ocĉured');
}
});
     
//UPDATE ROUT
app.post('/:id', async (req, res) => {
  const {id} = req.params;
  try{
    const founduser = await Note.findOne(id);
    if (!founduser){
      return res.status(404).send('no user found')
    }
      
    let newNote = new Note({
      Gender: req.body.Gender,
      Bloodgroup: req.body.Bloodgroup,
      PhoneNumber: req.body.PhoneNumber,
      EmergencyNo: req.body.EmergencyNo,
      State: req.body.State,
      LocalGovernment: req.body.LocalGovernment,          
  });
  await newNote.save();
  res.redirect('/id/' + founduser.id)

  } catch (err){
  res.status(500).send('error ocĉured');
  }
  });


connectDB()
app.listen(3000, (req, res) => {
  console.log('The server is up and running on port 3000')
});