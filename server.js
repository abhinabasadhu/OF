import express from "express";
import router from "./src/routes/index.js";
import connectToDB from './src/util/db.js';


const app = express();
const port = 3000;

app.use(express.json());
app.use('/api', router);

// Initialize database connection
connectToDB().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}).catch(err => {
  console.error('Failed to connect to the database:', err);
});