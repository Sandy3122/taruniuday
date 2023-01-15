const express = require('express');
const bodyParser = require('body-parser');
// const exphbs = require('express-handlebars');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();

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
// app.get('/temp', (req, res) => {
//   res.send(alert("testing"));
//   // res.render('invitation');
// });

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
        pass: 'wlvylwfusenplrsq'  // generated ethereal password
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
      res.send(`Thanks For Your Wishes, ${req.body.name} Ji`)

  });
  });

app.listen(8080, () => console.log('Server started...'));