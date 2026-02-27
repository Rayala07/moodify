const app = require("./src/app");
const connectToDb = require("./src/config/database");

app.listen(3000, () => {
  console.log("Listening on PORT 3000");
});

connectToDb();
