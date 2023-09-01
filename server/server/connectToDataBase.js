//const oracledb = require('oracledb');
import oracledb from "oracledb";

export const whereToConnect = {
    user          : 'INVENTORY',
    password      : 'inventory',  // contains the hr schema password
    connectString : 'localhost/orclpdb'
};


async function connectToDatabase() {
   
    try{

        const connection = await oracledb.getConnection(whereToConnect); 
        console.log('connected to database');
       return connection;
    }catch(err){
        console.error('Error while connecting to database : ',err);
        throw err;
    }
}

export default connectToDatabase;