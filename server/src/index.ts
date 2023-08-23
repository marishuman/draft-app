import express from "express";
import { Dummy, create, save,join, getDrafts} from './routes';
import bodyParser from 'body-parser';


// Configure and start the HTTP server.
const port = 8088;
const app = express();
app.use(bodyParser.json());
app.post("/api/create", create);
app.post("/api/getDrafts", getDrafts);
app.post("/api/save", save);
app.post("/api/join", join);
app.get("/api/dummy", Dummy);
app.listen(port, () => console.log(`Server listening on ${port}`));
