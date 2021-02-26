const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('./models/User');
const app = express();


const db = require('./config/keys').mongoURI;
mongoose
  .connect(
    db,
    { useNewUrlParser: true ,useUnifiedTopology: true}
  )
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));


 
app.get('/api', (req, res) => {
    res.json({
        message: 'Welcome to the API'
    });
});

app.get('/api/posts', verifyToken, (req, res) => {
    
    jwt.verify(req.token, 'secretkey', async(err) => {
        if(err) {
          res.sendStatus(403);
        } else {
            try{
                const user = await User.find() ;
                 res.json(user);
                }catch(err){
                    res.json({message: err})
                }
          
            }
        });
    });

   
app.post('/api/login', (req, res) => {
    const admin = {
        id: 1, 
        adminname: 'kalyani',
        email: 'my@gmail.com'
      }

    jwt.sign({admin}, 'secretkey', { expiresIn: '50s' }, (err, token) => {
        res.json({
          token
        });
      });
    });
    

function verifyToken(req, res, next) {
    
    const bearerHeader = req.headers['authorization'];
    
    if(typeof bearerHeader !== 'undefined') {
     
      const bearer = bearerHeader.split(' ');
      
      const bearerToken = bearer[1];
      
      req.token = bearerToken;
      
      next();
    } else {
      
      res.sendStatus(403);
    }
  
  } 

app.listen(5000, () => console.log('Server started on port 5000'));