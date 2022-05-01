const path = require('path')
const express = require('express');
const morgan = require('morgan');
const {engine} = require('express-handlebars');
const app = express();
const port = 3000;

const route = require('./routes');

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

app.get('/forum', (req, res) => {
  res.render('forum');
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})