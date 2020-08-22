//Configurando o servidor
const express = require("express")
const server = express()



//Configurar o servidor para apresentar arquivos extras, style.css e scripts.js
server.use(express.static('public'))

//Habilitar body do form
server.use(express.urlencoded({ extended: true}))

//CONEXÃO COM O BANCO DE DADOS
const Pool = require('pg').Pool
const db = new Pool({
    user:'postgres',
    password: 'infantaria0729',
    host: 'localhost',
    port: 5432,
    database: 'doe'
})

//Configurando a template engine
const nunjucks = require("nunjucks")
nunjucks.configure("./", {
    express: server,
    noCache: true,
})

//Configurar a apresentação da pág HTML
server.get("/", function(req, res) {
    db.query("SELECT * FROM donors", function(err, result){
        if (err) return res.send("Erro no banco de dados")

        const donors = result.rows
        return res.render("index.html", {donors })
    })
    
})


server.post("/", function(req, res){
    //pegar dados do formulário
    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood

    // Condição para não entrar valor vazio no banco
    if (name == "" || email == "" || blood == ""){
        return res.send("Todos campos são obrigatórios")
    }

    //coloco valores dentro do banco de dados
    const query= `
    INSERT INTO donors ("name", "email", "blood")
    VALUES ($1, $2, $3)`
    
    const values = [name, email, blood]

    db.query(query, values, function(err) {
        if (err) return res.send ("erro no banco de dados.")

        return res.redirect("/")
    })

})


//Ligar o servidor e permitir o acesso na porta 3000
server.listen(3000, function() {
    console.log("Iniciei o servidor")
})
