const AWS = require('aws-sdk');

class Conexion {

  constructor()
  {
      var dynamoDB;

      // si estamos en modo offline, usara dynamo local, sino, de amazon
      if (process.env.IS_OFFLINE) {

        // dynamoDB en modo local
        dynamoDB = new AWS.DynamoDB.DocumentClient({
          region: 'localhost',
          accessKeyId: 'xxxx',
          secretAccessKey: 'xxxx',
          endpoint: 'http://localhost:8000'
        });

      } else {

        // dybamoDB en modo Amazon
        dynamoDB = new AWS.DynamoDB.DocumentClient();
      }

      return dynamoDB;
    }

}

module.exports = Conexion;
