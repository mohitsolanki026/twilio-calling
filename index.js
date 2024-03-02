import Express from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import cors from "cors";
import dotenv from 'dotenv';
import UserRoutes from "./routes/user.route.js";
import taskCronJobs from "./utils/taskCronJobs.js";
import callCronJobs from "./utils/callcronJob.js";

const app = Express();

dotenv.config();
const PORT = process.env.PORT || 3000;
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost:27017/express-mongo";


app.use(Express.json());
app.use(Express.urlencoded({ extended: true }));
app.use(cors("*"));
app.use(morgan("dev"));

app.use("/user", UserRoutes);

app.get("/", (req, res) => {
    return res.send("server is up and running");
});


mongoose.connect(mongoUrl).then(()=>{
    app.listen(PORT, () => {
        console.log("Server is running on",PORT);
        taskCronJobs();
        callCronJobs()
    });
})