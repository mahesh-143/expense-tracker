import express from "express";
import { routes } from "./routes";
import cors from "cors";
import { errorHandler } from "./middlewares/errorHandler";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

routes(app);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
