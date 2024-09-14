const Sequelize = require('sequelize')
//Conexao com banco de dados Mysql
const sequelize = new Sequelize('postagens', 'root', 'sql1234',{
    host: "localhost",
    dialect: 'mysql'
})

module.exports = {
    Sequelize: Sequelize,
    sequelize: sequelize
}