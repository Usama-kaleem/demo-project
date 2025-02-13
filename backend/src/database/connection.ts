import { Sequelize } from "sequelize-typescript";

export const connection = new Sequelize({
  dialect: 'mysql',
  host: '0.0.0.0',
    username: 'root',
    password: 'asdf',
    port: 3306,
    database: 'demoproject',
    models: [__dirname + '/../models']

});