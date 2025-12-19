import app from "./app.js"
import Config from "./utils/config.js";

const PORT = Config.PORT;
app.listen(PORT, () => {
    console.log(`Server Running on port: ${PORT}`);
});