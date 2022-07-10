import { config } from 'dotenv';
config();
import express from 'express'
import cors from 'cors'
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import errorHandler from './middleware/error';

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
app.use(cookieParser());


// Routes
app.get('/', (req, res) =>{
    res.send("Api Working")
})

// Internal Import Route
import auth from './routes/auth/authRoute'
import user from './routes/user/userRoute'
import category from './routes/category/categoryRoute'
import blog from './routes/blog/blogRoute'
import comment from './routes/comment/commentRoute'


app.use('/api/v1/auth', auth)
app.use('/api/v1/user', user)
app.use('/api/v1/category', category)
app.use('/api/v1/blog', blog)
app.use('/api/v1/comment', comment)

// Error Middleware
app.use(errorHandler)

export default app