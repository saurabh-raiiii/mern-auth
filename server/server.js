import express from "express"
import cors from "cors"
import 'dotenv/config'
import cookieParser from "cookie-parser"
import connectDB from "./config/mongodb.js";
import authRouter from './routers/authRoutes.js'
import userRouter from "./routers/userRoutes.js";

const app = express();
const port = process.env.PORT || 3000;
const allowedOrigins = [
    'http://localhost:5173',
    'https://mern-auth-frontend-njdi.onrender.com'
];

app.use(express.json());
app.use(cookieParser());
app.use(cors({origin: allowedOrigins, credentials: true}));
connectDB();

app.get('/', (req, res) => {
    res.send("API Working fine");
})
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);


app.listen(port, "0.0.0.0", () => {
    console.log(`Server is running on port ${port}`);
});
