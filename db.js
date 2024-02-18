const {Sequelize} = require('sequelize')

module.exports = new Sequelize(
    'telega_bot',
    'root',
    'root',
    {
        host: 'master.a9e6fb20-acbb-42d5-ab4c-1523122be31f.c.dbaas.selcloud.ru',
        port: '5432',
        dialect: 'postgres',
    }
)