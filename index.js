var express = require("express")
var app = express()
var router = require("./routes/routes")
 
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use("/", router);

app.listen(8686,() => {
    console.log("Servidor rodando")
});
