const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const nodemailer = require('nodemailer');
port = 8080

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
});

app.get('/invitation', (req, res) => {
  res.sendFile(__dirname + '/invitation.html');
});



app.post('/send', (req, res) => {
  const output = `
  <div class="text-center text-success">
    <h2>Wishes From Your Loved One's</h2>
    <h3>Name : ${req.body.name}</h3>
    <h3>Wishes : ${req.body.message}</h3>
    <h3>Email : ${req.body.email}</h3>
</div>`;


  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    pool: true,
    // maxconnections: 10,
    // socketTimeout: 1000000,
    // maxMessages: 'infinity',
    // ratelimit: 2,
    // rateDelta: 2000,
    host: 'smtp.gmail.com',
    // host: 'my.smtp.host',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: 'tarunianduday@gmail.com', // generated ethereal user
      pass: 'merafvawkstibhfy'  // generated ethereal password
    },
    // tls: {
    //   rejectUnauthorized: false
    // }

  });

  // setup email data with unicode symbols
  let mailOptions = {
    // from: 'arjunreddyseeram87@gmail.com', // sender address
    from: 'req.body.email', // sender address
    to: 'tarunianduday@gmail.com', // list of receivers
    subject: 'Lovely Wishes', // Subject line
    // text: req.body.message, // plain text body
    replyTo: req.body.email,
    html: output // html body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

    res.send(`<html lang="en" class="no-js">

      <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title>Taruni Weds Uday | Love For Eternity | We Are Getting Married | Feb 10 </title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"/>
        <link rel="shortcut icon" href="/assets/images/favicon.ico" type="image/x-icon">
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css">
        <link rel="stylesheet" href="css/main.css" type="text/css">
      </head>
      <body>
        <section id="story" class="our-story section-boxed section-bg-color border-top-5 border-bottom-0">
          <div class="container">
            <div class="row">
              <div class="col-sm-12 col-md-6 mb-5 story-block text-center">
                <div class="story-image scale-image-effect">
                  <img src="/assets/images/thankyou.jpg" class="rounded-circle" alt="">
                </div>
              </div>
              <div class="col-sm-12 col-md-6 story-block text-center d-flex justify-content-center align-items-center">
                <h3>
                  Dear, <strong> ${req.body.name} </strong> Ji, We really thank you from the bottom of our hearts for your lovely wishes.
                </h3>
                <br>
              </div>
        </section>
        <center><a href="/#rsvp"><button class="button small-button">Back</button></a></center>
      </body>
      </html>`)
  });
});

app.listen(port, () => console.log("Successfully Server Started And Listening To Server Port :",port));
