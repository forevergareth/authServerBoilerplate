require("dotenv").config();
const http = require("http");
const app = require("express")();
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const passport = require("passport");

require("./services/database");
require("./services/passport");

app.use(morgan("dev"));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
  res.send({ Appname: process.env.APP_NAME });
});
const apirouter = require("./routes/api");
app.use("/api", apirouter);

const server = http.createServer(app);

server.listen(process.env.PORT, () => {
  console.log(
    `${process.env.APP_NAME} is listening on port ${process.env.PORT}`
  );
});
