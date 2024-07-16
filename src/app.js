import express from "express";
import morgan from "morgan";
import cors from "cors";
import loginRouter from "./routes/login.routes.js";
import userRouter from "./routes/user.routes.js";
import eventRouter from "./routes/event.routes.js";
import guestRouter from "./routes/guest.routes.js";

const app = express();

app.use(express.json());


app.use(cors());
app.use(morgan("dev"));

app.use('/api', loginRouter);
app.use('/api', userRouter);
app.use('/api', eventRouter);
app.use('/api', guestRouter);

app.use((req, res) => {
    res.status(404).json("ruta no encontrada");
})

export default app;