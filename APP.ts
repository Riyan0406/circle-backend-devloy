import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import db from "./src/lib/db";
import indexRouter from "./src/routers";
import path from "path";

dotenv.config();

const PORT = process.env.PORT || 5200;
const app = express();

// CORS Configuration
const allowedOrigins = ["http://localhost:5173"];
const corsOptions = {
   origin: allowedOrigins,
   methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
   allowedHeaders: ["Content-Type", "Authorization"]
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "src/uploads")));

app.use(indexRouter);

app.get("/", (req, res) => {
   res.send("CIRCLE APP - API");
});

app.listen(+PORT, async () => {
   await db.$connect();
   console.log("Server is running at port " + PORT);
});
