//const oracledb = require('oracledb');
import oracledb from "oracledb";
import { whereToConnect } from './connectToDataBase.js';

async function runQuery(query, bindParams) {
    let connection;
    let result;

    try {
        
        connection = await oracledb.getConnection(whereToConnect);

        result = await connection.execute(query, bindParams, { autoCommit: true });
    } catch (err) {
        console.error('Error executing query:', err);
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error('Error closing connection:', err);
            }
        }
    }

    return result;
}

export const extractData = (result, columnNamesNeeded) => {
    if (!result ) {
        return [];
    }
    const uppercaseColumnNamesNeeded = columnNamesNeeded.map(name => name.toUpperCase());

    // Extract column names from metaData
    const columnNames = result.metaData.map(col => col.name);

    const indices = uppercaseColumnNamesNeeded.map(name => columnNames.indexOf(name));

    // // Extract and structure the required data
    const outputData = result.rows.map(row => {
        const rowData = {};
        indices.forEach((index, idx) => {
            rowData[columnNamesNeeded[idx]] = row[index];
        });
        return rowData;
    });

     return outputData;
}


export default runQuery;

