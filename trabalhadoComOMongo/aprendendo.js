const mongoose = require("mongoose")

//Configurando o Mongoose
    mongoose.Promise = global.Promise;
    mongoose.connect("mongodb://localhost/aprendendo")
    .then(() => {
        console.log('Acertouuuuu')
    }).catch((err) => {
        console.log("Errouuuu!"+err)
    })

 //Model - Usuários
 //Definindo o Model
 const UsuarioSchema = mongoose.Schema({
    nome: {
        type: String,
        required: true
    },
    sobrenome: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required:true
    },
    idade: {
        type: Number,
        required: true
    },
    pais: {
        type: String
    
    }
    
 })
//Collection
     mongoose.model('usuarios', UsuarioSchema )

 const Anderson = mongoose.model('usuarios')


 new Anderson({
    nome: "Karina",
    sobrenome: "Souza",
    email: "asouzanderson@gmail.com",
    idade: 37,
    pais: "Brasil"
 }).save().then(() => {
    console.log('Usuario Criado')
}).catch((err) => {
    console.log("Houve um erro"+err)
})

