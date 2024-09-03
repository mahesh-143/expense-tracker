import express, { Request, Response } from "express";
import { routes } from "./routes";
import cors from "cors";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!!!");
});

routes(app);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
