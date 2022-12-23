// External Lib
import app from "./app.js";
import mongoose from "mongoose";

// Connected With Db
const url = process.env.MONGO_URI;

mongoose
  .connect(`${url}`)
  .then(() => {
    console.log(`Db Connected`);
  });

const port = process.env.PORT || 5000;
// Server Listing
app.listen(port, () =>{
    console.log(`Server Listing ${port}`)
});
