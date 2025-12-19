import e, { json } from "express";
import cors from "cors";
import epicRoutes from "./routes/epic.js";

const app = e();

app.use(e.json());
app.use(cors());

app.get("/", async (req, res) => {
    res.json({
        "status": "Working"
    });
});

app.use("/api/epic", epicRoutes);

export default app;