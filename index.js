const express = require('express');
const app = express();
const bodyParser = require('body-parser');
// const exphbs = require('express-handlebars');
const path = require('path');
const nodemailer = require('nodemailer');

const popup = require('node-popup');
const Swal = require('sweetalert2');
const swal = require('sweetalert2/dist/sweetalert2.js');



// View engine setup
// app.engine('handlebars', exphbs());
// app.set('view engine', 'hbs');


// Static folder
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/fonts', express.static(path.join(__dirname, 'fonts')));
app.use('/js', express.static(path.join(__dirname, 'js')));

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//main page
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
  // res.render('index');
});

app.get('/invitation', (req, res) => {
  res.sendFile(__dirname + '/invitation.html');
  // res.render('invitation');
});



app.post('/send', (req, res) => {
  const output = `
  <div class="text-center text-success">
    <h2>Wishes From Your Dear One's : </h2>
    <h3>Name : ${req.body.name}</h3>
    <h3>Wishes : ${req.body.message}</h3>
</div>
  `;

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: 'tarunianduday@gmail.com', // generated ethereal user
        pass: 'elllonvepltyhkav'  // generated ethereal password
    },
    tls:{
      rejectUnauthorized:false
    }

  });

  // setup email data with unicode symbols
  let mailOptions = {
      from: 'tarunianduday@gmail.com', // sender address
      to: 'arjunreddyseeram87@gmail.com', // list of receivers
      subject: 'Lovely Wishes', // Subject line
      // text: 'Hello world?', // plain text body
      html: output // html body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          return console.log(error);
      }
      console.log('Message sent: %s', info.messageId);   
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

      // res.render('index', {successmsg:`Thank You So Much, ${req.body.name} Ji`});
      res.send(`<!DOCTYPE html>
      <html lang="en" class="no-js">
      <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title>Taruni Weds Uday</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <meta name="description" content="We Are Getting Married" />
        <meta name="keywords" content="Love For Eternity" />
        <meta name="author" content="SEERAM SANDEEP" />
        <link rel="shortcut icon" href="/favicon.ico">
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css">
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-w76AqPfDkMBDXo30jS1Sgez6pr3x5MlQ1ZAGC+nuZB+EYdgRZgiwxhTBTkF7CXvN" crossorigin="anonymous"></script>
        <link rel="stylesheet" href="css/bootstrap.css">
        <link rel="stylesheet" href="css/main.css" type="text/css">
        <script src="js/bootstrap.min.js"></script>
      </head>
      <body>
        <section id="story" class="our-story section-boxed section-bg-color">
          <div class="container">
            <div class="section-title">
              <h2>Our Story</h2>
            </div>
            <div class="row story-row">
              <div class="col-sm-12 col-md-5 story-block text-center">
                <div class="story-image scale-image-effect">
                  <img src="/assets/images/story_photo_1.jpg" class="rounded-circle" alt="">
                </div>
              </div>
              <div class="col-sm-12 col-md-2 story-block text-center">
                <div class="story-date">
                  <div style="margin-top: 38px" class="mb-4 year">T / U</div>
                  <!-- <div class="month">Aug</div> -->
                </div>
              </div>
              <div class="col-sm-12 col-md-5 story-block text-center">
                <h3>
                  Dear, <strong>${req.body.message}</strong>, We thank you from the bottom of our hearts for your lovely wishes.
                </h3>
              <div>
              <div class="vertical-line"></div>
            </div>
          </div>
        </section>
      </body>
      </html>`)
  });
  });

app.listen(8080, () => console.log('Server started...'));