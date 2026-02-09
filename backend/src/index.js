//step 1 setting up server
//step 4 cookie parser
const express=require('express');
const app=express();
require('dotenv').config();
const main=require('./config/db')
const cookieParser=require('cookie-parser');
const authRouter=require('./routes/UserAuthentication')
const redisClient = require('./config/redis');
const problemRouter=require('./routes/problemCreator');
const submitRouter=require('./routes/submit');
const aiRouter=require('./routes/aiChatting')
const cors=require('cors');
const videoRouter = require('./routes/videoCreator');
const profileRouter = require('./routes/profile');

// request.body mei jo data aata vo JSON format mei aata hai to app.use(express()) usko Js object mei convert karta hai
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://algonest-dev.netlify.app',
  'https://algonest.netlify.app'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, postman)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true, // ✅ REQUIRED for cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie', 'Accept', 'Origin', 'X-Requested-With']
}));

// ✅ HANDLE PREFLIGHT REQUESTS
app.options('*', cors()); // Enable preflight for all routes

// ✅ MANUAL CORS HEADERS AS FALLBACK
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Cookie');
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

app.use(express.json());
app.use(cookieParser());
app.use('/user',authRouter);
app.use('/problem',problemRouter);
app.use('/submission',submitRouter);
app.use('/ai',aiRouter);
app.use('/video',videoRouter);
app.use('/profile', profileRouter);


const InitalizeConnection = async ()=>{
    try{

        await Promise.all([main(),redisClient.connect()]);
        console.log("DB Connected");
         
        
        app.listen(process.env.PORT, ()=>{
            console.log("Server listening at port number: "+ process.env.PORT);
        })

    }
    catch(err){
        console.log("Error: "+err);
    }
}


InitalizeConnection();
