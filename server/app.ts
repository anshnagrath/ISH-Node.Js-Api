import * as express from "express";
import { urlencoded, json } from "body-parser";
import * as morgan from 'morgan';
import { TackingRouter } from './routes/tracking/tracking.controller';
import { mongoose } from "./config/database";
import { ProductRouter } from "./routes/product/product.controller";
const app = express();
app.use(json());
app.use(urlencoded({
  limit: '50mb',
  extended: true
}));
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type,*');
  next();
});
app.use(morgan("dev"));
//calling databasesefile
const goose = mongoose;
app.get("/", (request: express.Request, response: express.Response) => {
  response.send("Welcome to  API");
});
app.use('/api', new TackingRouter().getRouter());
app.use('/api', new ProductRouter().getRouter());
app.use((err: Error & { status: number }, request: express.Request, response: express.Response, next: express.NextFunction): void => {
  console.log(err, request.body)
  response.status(err.status || 500);
  response.json({
    status: {
      code: 500,
      message: "Error",
      error: err
    }
  })
});
const server = app.listen(4000, () => console.log("server is up"));
export { server };
