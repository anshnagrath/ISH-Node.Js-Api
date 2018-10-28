import { Mockgoose } from "mockgoose-fix";
import * as mongoose from "mongoose";

(mongoose as any).Promise = global.Promise;
const mockgoose = new Mockgoose(mongoose);
mockgoose.helper.setDbVersion("3.4.3");
// mongoose.set('debug', true);

mongoose.connect("mongodb://localhost:27017/devdb", {
  useMongoClient: true,
}).then(() => {
  console.log("connedted to database");
});

export { mongoose };
