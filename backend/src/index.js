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
app.use(cors({
    origin: [
        'http://localhost:5173',  // Vite dev server
        'http://localhost:3000',   // Alternative localhost
        'https://algonest-dev.netlify.app',  // Your Netlify frontend
        'https://algonest.netlify.app'       // Future custom domain
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}));
app.use(express.json());
app.use(cookieParser());
app.use('/user',authRouter);
app.use('/problem',problemRouter);
app.use('/submission',submitRouter);
app.use('/ai',aiRouter);
app.use('/video',videoRouter);
app.use('/profile', profileRouter);

app.use(cookieParser());
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
