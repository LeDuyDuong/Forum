const path = require('path')
const express = require('express');
const morgan = require('morgan');
const {engine} = require('express-handlebars');
const app = express();
const { Sequelize, Model, DataTypes  } = require('sequelize');
const port = 3000;
const bcrypt = require('bcrypt');
//var session = require('express-session');
const route = require('./routes');
const { userInfo } = require('os');


//define
const sequelize = new Sequelize('sqlite::memory:');

class User extends Model {}

User.init({
  // Model attributes are defined here
  firstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING
    // allowNull defaults to true
  }
}, {
  // Other model options go here
  sequelize, // We need to pass the connection instance
  modelName: 'User' // We need to choose the model name
});



async function CheckConnect()
{
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

async function CreateDatase()
{
  await User.sync({force:true});
  console.log("The table for the User model was just created!");
}

CheckConnect();



app.use(express.static(path.join(__dirname, 'public')));

// HTTP logger
app.use(morgan('combined'))

//template engine
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'resources/views'));

// Routes init
//route(app);

app.get('/', (req, res) => {
  res.render('home');
})


app.get('/create', (req, res) => {
  res.render('create');
})

app.post('/create',(req,res)=>
{
 try{
    async function CreateUser()
    {
      const hashedPassword = await bcrypt.hash(req.body.password,10);
      return User.create(
      {
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
      }
      
    );
    }
    CreateUser();
    res.redirect('/read')
 }
 catch
 {
  res.redirect('/read')
 }
})


app.get('/read', (req, res) => {
  res.render('read');
})

app.post('/read',(req,res)=>
{
  try{
    async function CheckLogin()
    {
      const identify = await User.findOne({ where: { email:req.body.email } });
      if (identify === null) {
        res.redirect('/read')
      } else {
        if (bcrypt.compare(req.body.password,identify.password))
          res.redirect('/')
      }
    }
    CheckLogin();
  }
  catch{
    res.redirect('/read')
  }
})



app.get('/update', (req, res) => {
  res.render('update');
})

app.get('/delete', (req, res) => {
  res.render('delete');
})

app.get('/forum', (req, res) => {
  res.render('forum');
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

const test = async ()=>{ return await User.findOne({ where: { title: 'admin@' } })};
console.log(test);