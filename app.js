import express from "express";
import * as utils from "./utils/utils.js";
import * as db from "./utils/database.js";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";

let projects = [];
let contracts = [];
let mints = [];

const app = express();
app.use(cors({ methods: ["GET", "POST"] }));
const port = 3000;
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.static("public"));

app.get("/", async (req, res, next) => {
  await db
    .connect()
    .then(async () => {
      // query the databse for project records
      projects = await db.getAllProjects();
      contracts = [];
      mints = [];
      projects.forEach((item) => {
        contracts.push(item.contractAddress);
        mints.push(0); // initializing parallel array
        let arr = item.open_date_gmt.toString().split(" ");
        arr[5] = "";
        let newDTG = arr.join(" ");
        item.open_date_gmt = newDTG;
      });
      res.render("index.ejs", {
        contracts: contracts,
        mints: mints,
        projects: projects,
      });
    })
    .catch(next);
});

app.post("/mail", async (req, res) => {
  if (req.body.ftb == true) {
    await utils
      .sendMessage(req.body.sub, req.body.txt)
      .then(() => {
        res.send({ result: "Success" });
      })
      .catch(() => {
        res.send({ result: "Failure" });
      });
  } else {
    res.send({ result: "No mail bots allowed" });
  }
});

// app.post("/captcha", async (req, res) => {
//   if (
//     req.body.token === undefined ||
//     req.body.token === "" ||
//     req.body.token === null
//   ) {
//     return res.json({ responseError: "something is wrong" });
//   } else {
//   }
//   const secretKey = process.env.RECAPTCHA_SECRET_KEY;
//   const verificationURL = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${req.body.token}`;
//   fetch(verificationURL, {
//     headers: {
//       Accept: "application/json",
//       "Content-Type": "application/json",
//     },
//     method: "POST",
//   })
//     .then((response) => {
//       return response.text();
//     })
//     .then((text) => {
//       let info = JSON.parse(text);
//       if (info.success == true && info.score >= 0.75) {
//         res.send({ result: "success" });
//       }
//     })
//     .catch((error) => {
//       res.send({ result: "failure" });
//     });
// });

app.use(async (err, req, res, next) => {
  console.log(err);
  let msg;
  msg = err.message;
  if (msg != "No project with that ID") {
    msg =
      "There was an internal error. Apologies. We are working on cleaning up the mess.  Please try again later.";
  }
  res.render("error.ejs", { msg: msg });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
