import express from "express"
import route from "./routes"

const PORT = process.env.PORT || 5000;
const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(route)
console.log(process.env.CANISTER_ID_SIKACHAINPHONENUMBER)

// app.post("/",(req,res)=>{
//     console.log(req.body);
// })
app.listen(PORT, ()=> console.log(`listening on port: ${PORT}`));

