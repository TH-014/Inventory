//const oracledb = require('oracledb');

import bodyParser from "body-parser";
import crypto from 'crypto';
//import AddProduct from "../client/src/ComponentsOfClientPages/AddProductPage.js";
import runQuery ,{extractData} from './Queries.js';
import connectToDatabase from './connectToDataBase.js';
import cors from "cors";
import express from "express";
//const cors = require('cors');
//const express = require('express');  // or you can do this   in paccket json file under main /* "type": "module",*/
const app = express();

(async ()=> {
    try{
        await connectToDatabase();

    }catch(error){
        console.error("Error while connecting to the database: ",error);
    }
})();

app.use(cors());
app.use(express.json()); // ??????
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// app.get("/", async (req, res)=> {
//     try{
//         let result = await runQuery("select * from Employee",[]);
//         const columnNames = ['E_NAME','EMAIL'];
//         const output = extractData(result, columnNames);
//         //console.log(extractData(result,columnsToExtract));

//         res.status(200).json({data: result || [], message: "welcome to our wedpage"});
//     }catch(error)
//     {
//         console.error("Error while taking the data from employees : ", error);
//         res.status(500).json({message: "Error while taking the data from employees"});
//     }

// });



app.post('/Trial',async (req, res) => {
  try{
            let result = await runQuery("select * from PRODUCT WHERE PRICE > 20000",[]);
            console.log(result)
            const columnNames = ['P_NAME','TYPE','DESCRIPTION','PRICE','DISCOUNT'];
            const output = extractData(result, columnNames);
            console.log(output);
            //console.log(extractData(result,columnsToExtract));
            // res.status(200).json({output});
            console.log(output);
           res.status(200).json({data: result || [], message: "welcome to our webpage"});
        }catch(error)
        {
            console.error("Error while taking the data from employees : ", error);
            res.status(500).json({message: "Error while taking the data from employees"});
        }
});


app.post('/RegisterAsSupplier', async (req,res) => {

  //console.log(req);
  const {supplierName, email, phoneNo,password} = req.body;
  //const passwordHash = crypto.createHash('sha1').update(password).digest('hex');
  const queryToExtractUserID = `SELECT S_ID FROM "INVENTORY"."SUPPLIER" ORDER BY S_ID DESC`;
  const result2 =   await runQuery(queryToExtractUserID, []);

  //console.log(result2);

  const newuId = result2.rows.length+1;
  const username = result2.rows.length+1;
  //const reg = '12-JAN-2023';

  const insertQuery = `INSERT INTO "INVENTORY"."SUPPLIER"("S_ID","USER_NAME","S_NAME","EMAIL","PHONE_NO","PASSWORD") VALUES(:newuId,:username,:supplierName, :email,:phoneNo,:password)`;
  console.log("this is a ID : " ,newuId);

  const bindParams = {
    username: username,
    //reg:reg,
    newuId : newuId,
    supplierName: supplierName,
    email:email,
    phoneNo : phoneNo,
    password: password
};
const result3 = await runQuery(insertQuery,bindParams);
res.send(result3);

});




app.post('/Register', async (req,res) => {

  //console.log(req);
  const {customerName, email, phoneNo,password} = req.body;
  //const passwordHash = crypto.createHash('sha1').update(password).digest('hex');
  const queryToExtractUserID = `SELECT C_ID FROM "INVENTORY"."CUSTOMER" ORDER BY C_ID DESC`;
  const result2 =   await runQuery(queryToExtractUserID, []);

  //console.log(result2);

  const newuId = result2.rows.length+1;
  const username = result2.rows.length+1;
  const reg = '12-JAN-2023';

  const insertQuery = `INSERT INTO "INVENTORY"."CUSTOMER"("C_ID","USER_NAME","C_NAME","EMAIL","PHONE_NO","REG_DATE","PASSWORD") VALUES(:newuId,:username,:customerName, :email,:phoneNo,:reg,:password)`;
  console.log("this is a ID : " ,newuId);

  const bindParams = {
    username: username,
    reg:reg,
    newuId : newuId,
    customerName: customerName,
    email:email,
    phoneNo : phoneNo,
    password: password
};
const result3 = await runQuery(insertQuery,bindParams);
res.send(result3);

});




app.post('/login', async (req, res) => {
  console.log("Inside post");
  const { email, password } = req.body;
  //console.log(req.body.email);
   
  //const passwordHash = crypto.createHash('sha1').update(password).digest('hex');
  //console.log(passwordHash)

  const query = 'SELECT * FROM "INVENTORY"."CUSTOMER" WHERE "EMAIL" = :email AND "PASSWORD" = :password';

const bindParams = {
    email: email,
    password: password
};


  try {
    console.log('Inside try and before query');
    const result = await runQuery(query, bindParams);
    console.log(result);
    const columnsToExtract = ['C_ID','C_NAME', 'EMAIL','PASSWORD','PHONE_NO'];
    const output = extractData(result, columnsToExtract);
    //console.log(extractData(result,columnsToExtract));

      if (result &&result.rows.length > 0) {
          // Login successful
          res.send(output);
          console.log(output);
      } else {
          // Invalid credentials
          res.status(401).send("Invalid username or password.");
      }

  } catch (error) {
      console.error("Error during login:", error);
      res.status(500).json({ message: "Internal server error." });
  }
});



app.post('/loginAsSupplier', async (req, res) => {
  console.log("Inside post");
  const { email, password } = req.body;
  //console.log(req.body.email);
   
  //const passwordHash = crypto.createHash('sha1').update(password).digest('hex');
  //console.log(passwordHash)

 // const query = 'SELECT * FROM "INVENTORY"."SUPPLIER" WHERE "EMAIL" = :email AND "PASSWORD" = :password';
const query = 'SELECT SUPPLIER.S_ID SID,NVL(SUM(DUE),0) TOTDUE,SUPPLIER.S_NAME, SUPPLIER.EMAIL,SUPPLIER.PHONE_NO,SUPPLIER.PASSWORD FROM SUPPLIER LEFT JOIN CHARGES  ON (SUPPLIER.S_ID = CHARGES.S_ID) GROUP BY SUPPLIER.S_ID,SUPPLIER.S_NAME, SUPPLIER.EMAIL,SUPPLIER.PHONE_NO,SUPPLIER.PASSWORD HAVING EMAIL = :email AND PASSWORD = :password';
const bindParams = {
    email: email,
    password: password
};


  try {
    console.log('Inside try abd before query');
    const result = await runQuery(query, bindParams);
    //console.log(result);
    const columnsToExtract = ['SID','TOTDUE','S_NAME', 'EMAIL','PASSWORD','PHONE_NO'];
    const output = extractData(result, columnsToExtract);
    //console.log(extractData(result,columnsToExtract));

      if (result &&result.rows.length > 0) {
          // Login successful
          res.send(output);
          console.log(output);
      } else {
          // Invalid credentials
          res.status(401).send("Invalid username or password.");
      }

  } catch (error) {
      console.error("Error during login:", error);
      res.status(500).json({ message: "Internal server error." });
  }
});


app.post('/loginAsEmployee', async (req, res) => {
  console.log("Inside post");
  const { email, password } = req.body;
  //console.log(req.body.email);
   
  //const passwordHash = crypto.createHash('sha1').update(password).digest('hex');
  //console.log(passwordHash)

  const query = `SELECT E_ID,E_NAME,EMAIL,PASSWORD,PHONE_NO,TO_CHAR(JOIN_DATE,'DD-MON-YYYY') JOINDATE,ADDRESS FROM "INVENTORY"."EMPLOYEE" WHERE "EMAIL" = :email AND "PASSWORD" = :password`;
//const query = 'SELECT SUPPLIER.S_ID SID,NVL(SUM(DUE),0) TOTDUE,SUPPLIER.S_NAME, SUPPLIER.EMAIL,SUPPLIER.PHONE_NO,SUPPLIER.PASSWORD FROM SUPPLIER LEFT JOIN CHARGES  ON (SUPPLIER.S_ID = CHARGES.S_ID) GROUP BY SUPPLIER.S_ID,SUPPLIER.S_NAME, SUPPLIER.EMAIL,SUPPLIER.PHONE_NO,SUPPLIER.PASSWORD HAVING EMAIL = :email AND PASSWORD = :password';
const bindParams = {
    email: email,
    password: password
};


  try {
    console.log('Inside try abd before query');
    const result = await runQuery(query, bindParams);
    //console.log(result);
    const columnsToExtract = ['E_ID','E_NAME', 'EMAIL','PASSWORD','PHONE_NO','JOINDATE','ADDRESS'];
    const output = extractData(result, columnsToExtract);
    //console.log(extractData(result,columnsToExtract));

      if (result &&result.rows.length > 0) {
          // Login successful
          res.send(output);
          console.log(output);
      } else {
          // Invalid credentials
          res.status(401).send("Invalid username or password.");
      }

  } catch (error) {
      console.error("Error during login:", error);
      res.status(500).json({ message: "Internal server error." });
  }
});


app.get('/categories', (req, res) => {
  const categories = ['Electronics', 'Clothing', 'Groceries'];
  res.json(categories);
});



app.get('/rootCategories', async (req, res) => {
  try {
      const query = 'SELECT DISTINCT("TYPE") FROM "INVENTORY"."PRODUCT"';  // Assuming RootCategories is the name of your table
      const queryData = await runQuery(query, []);
      const output = extractData(queryData, ['TYPE']);
      res.json(output);
  } catch (error) {
      console.error('Error fetching categories:', error);
      res.status(500).json({ error: 'Error fetching categories' });
  }
});




// app.post('/AddProduct',async (req, res) => {
//   // const level = req.body.LEVEL;
//   // const name = req.body.NAME;
//   // const category = req.body.CATEGORY;

//   // // Process the data or perform desired operations here

//   // res.status(200).json({ message: 'Data received successfully' });

//   // formData.append('PICTURE', productImage);


//   // formData.append('P_NAME', productName);
//   // formData.append('P_SIZE(CC)', productSize);
//   // formData.append('P_WEIGHT(KG)', productWeight);
//   // formData.append('QUANTITY', productQuantity);
//   // formData.append('PRICE', productPrice);
//   // formData.append('DISCOUNT', productDiscount);
//   // formData.append('PREFERRED_TEMP', productTemp);

//   // formData.append('DESCRIPTION', productDescription);

//   // formData.append('TYPE', selectedRootCategory);


//   // formData.append('ELEVEL',educationalLevel );
//   // formData.append('MADE_OF', fashionMadeOf);
//   // formData.append('SIZE',fashionSize );
//   // formData.append('FCOLOR',fashionColor );
//   // formData.append('PRODUCTION_DATE',productionDate );
//   // formData.append('EXPIARY_DATE', ExpiaryDate);
//   // formData.append('RAM(GB)',IT_ram );
//   // formData.append('STORAGE(GB)',IT_storage );
//   // formData.append('PROCESSOR(GHZ)',IT_processor );
//   // formData.append('TCOLOR',Toy_color );
//   // formData.append('TLEVEL',Toy_level );



//   const {picture, pName, pSize,pWeight,quantity,price,discount,
//     prefTemp,description,type,elevel,madeOf,fcolor,prodDate,expDate,ram,storage,processor,tcolor,tlevel,s_id} = req.body;
//     // for (const entry of req.body.entries()) {
//     //   console.log(entry);
//     // }
//     console.log(req.body.productName + " " + req.body.productSize + " " + req.body.productWeight + " " + req.body.productQuantity + " " + req.body.productPrice + " " + req.body.productDiscount + " " + req.body.productTemp + " " + req.body.productDescription + " " + req.body.selectedRootCategory + " " + req.body.educationalLevel + " " + req.body.fashionMadeOf + " " + req.body.fashionSize + " " + req.body.fashionColor + " " + req.body.productionDate + " " + req.body.ExpiaryDate + " " + req.body.IT_ram + " " + req.body.IT_storage + " " + req.body.IT_processor + " " + req.body.Toy_color + " " + req.body.Toy_level);
//    // const name = req.body.productName;
//     //console.log(name);
//   //const passwordHash = crypto.createHash('sha1').update(password).digest('hex');

//   const queryToExtractProductID = `SELECT NVL(P_ID,0) FROM "INVENTORY"."PRODUCT" WHERE P_NAME = :pName`;
//   // const queryToExtractProductID = `BEGIN
//   //     GET_PRODUCT_ID(:pName);
//   // END;`;

//  const bindParams = {
//     //picture: picture,
//     pName: pName
//     // pSize:pSize,
//     // pWeight:pWeight,
//     // quantity:quantity,
//     // price:price,
//     // discount:discount,
//     // prefTemp:prefTemp,
//     // description:description,
//     // type:type,
//     // elevel:elevel,
//     // madeOf:madeOf,
//     // fcolor:fcolor,
//     // prodDate:prodDate,
//     // expDate:expDate,
//     // ram:ram,
//     // storage:storage,
//     // processor:processor,
//     // tcolor:tcolor,
//     // tlevel:tlevel,
//     // s_id:s_id
// };
// //console.log(bindParams['pName']);

  

//   const result2 =   await runQuery(queryToExtractProductID,bindParams);
//   let pID =0;
//   if (result2.rows.length > 0) {
//   pID = result2.rows[0][0];

    
//     const ifExistThenQuery = ``
//     if (extractedID !== 0) {
//         console.log("hello");
//     } else {
//         console.log("No matching product found.");
//     }
// } else {
//   const queryToExtractpID = `SELECT P_ID FROM "INVENTORY"."PRODUCT" ORDER BY P_ID DESC`;
//   const result3 =   await runQuery(queryToExtractpID, []);

//   //console.log(result2);

//   pID = result3.rows.length+1;
//     console.log("No rows returned from the query.");
// }

// const queryToExtractInvoiceNo = `SELECT * FROM "INVENTORY"."SUPPLIES"`;
// const result4 =   await runQuery(queryToExtractInvoiceNo, []);

// console.log('ok');

// const invoiceNo = result4.rows.length+1;
// // check s_id validation......here##################################
// const size = req.body.productSize;


// const queryToInsertInSupplies = `INSERT INTO "INVENTORY"."SUPPLIES"("DATE","S_ID","P_ID","P_SIZE(CC)","P_WEIGHT(KG)","PREFERRED_TEMP(C)","QUANTITY","INVOICE_NO") VALUES(SYSDATE,:s_id,:pID,:size,:pWeight,:prefTemp,:quantity,:invoiceNo)`;
// const bindParams2 = {
//   s_id: s_id,
//   pID: pID,
//   //pSize:pSize,
//   size:size,
//   pWeight:pWeight,
//   prefTemp:prefTemp,
//   quantity: quantity,
//   invoiceNo:invoiceNo
  
// }
// console.log("this is a ID : " ,bindParams2.size);

// //const result5 = await runQuery(queryToInsertInSupplies,bindParams2);

//   //if(result2.rows[0][0]==1)console.log("hello");

// //   const newuId = result2.rows.length+1;
// //   const username = result2.rows.length+1;
// //   const reg = '12-JAN-2023';

// //   const insertQuery = `INSERT INTO "INVENTORY"."CUSTOMER"("C_ID","USER_NAME","C_NAME","EMAIL","PHONE_NO","REG_DATE","PASSWORD") VALUES(:newuId,:username,:customerName, :email,:phoneNo,:reg,:password)`;
// //   console.log("this is a ID : " ,newuId);

// //   const bindParams = {
// //     username: username,
// //     reg:reg,
// //     newuId : newuId,
// //     customerName: customerName,
// //     email:email,
// //     phoneNo : phoneNo,
// //     password: password
// // };
// // const result3 = await runQuery(insertQuery,bindParams);
// // res.send(result3);
// });

app.post('/search', async (req, res) => {
    try {
        // console.log(req.body);
        let search = req.body.searchBoxInput;
        search = search.toUpperCase();
        console.log('In server searching for:', search);
        const query = `SELECT * FROM "INVENTORY"."PRODUCT" WHERE UPPER("P_NAME") LIKE '%${search}%'`;
        const result = await runQuery(query, []);
        const columnsToExtract = ['P_ID', 'P_NAME', 'PRICE', 'DISCOUNT', 'DESCRIPTION', 'TYPE', 'REMAINING_ITEM', 'STORAGE_ID', 'SOLD_QUANTITY', 'PER_UNIT_CHARGE', 'PICTURE', 'RATING'];
        const output = extractData(result, columnsToExtract);
        console.log(output);
        res.json(output);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ error: 'Error fetching categories' });
    }
});

app.post('/AddProduct',async (req, res) => {
  // const level = req.body.LEVEL;
  // const name = req.body.NAME;
  // const category = req.body.CATEGORY;

  // // Process the data or perform desired operations here

  // res.status(200).json({ message: 'Data received successfully' });

  // formData.append('PICTURE', productImage);


  // formData.append('P_NAME', productName);
  // formData.append('P_SIZE(CC)', productSize);
  // formData.append('P_WEIGHT(KG)', productWeight);
  // formData.append('QUANTITY', productQuantity);
  // formData.append('PRICE', productPrice);
  // formData.append('DISCOUNT', productDiscount);
  // formData.append('PREFERRED_TEMP', productTemp);

  // formData.append('DESCRIPTION', productDescription);

  // formData.append('TYPE', selectedRootCategory);


  // formData.append('ELEVEL',educationalLevel );
  // formData.append('MADE_OF', fashionMadeOf);
  // formData.append('SIZE',fashionSize );
  // formData.append('FCOLOR',fashionColor );
  // formData.append('PRODUCTION_DATE',productionDate );
  // formData.append('EXPIARY_DATE', ExpiaryDate);
  // formData.append('RAM(GB)',IT_ram );
  // formData.append('STORAGE(GB)',IT_storage );
  // formData.append('PROCESSOR(GHZ)',IT_processor );
  // formData.append('TCOLOR',Toy_color );
  // formData.append('TLEVEL',Toy_level );



  const {
    productImage,
    productName,
    productSize,
    productWeight,
    productQuantity,
    productPrice,
    productDiscount,
    productTemp,
    productDescription,
    selectedRootCategory,
    educationalLevel,
    fashionMadeOf,
    fashionSize,
    fashionColor,
    productionDate,
    ExpiaryDate,
    IT_ram,
    IT_storage,
    IT_processor,
    Toy_color,
    Toy_level,
    status} = req.body;
    console.log(req.body.status);
    // for (const entry of req.body.entries()) {
    //   console.log(entry);
    // }
    console.log(req.body.productName + " " + req.body.productSize + " " + req.body.productWeight + " " + req.body.productQuantity + " " + req.body.productPrice + " " + req.body.productDiscount + " " + req.body.productTemp + " " + req.body.productDescription + " " + req.body.selectedRootCategory + " " + req.body.educationalLevel + " " + req.body.fashionMadeOf + " " + req.body.fashionSize + " " + req.body.fashionColor + " " + req.body.productionDate + " " + req.body.ExpiaryDate + " " + req.body.IT_ram + " " + req.body.IT_storage + " " + req.body.IT_processor + " " + req.body.Toy_color + " " + req.body.Toy_level);
   // const name = req.body.productName;
    //console.log(name);
  //const passwordHash = crypto.createHash('sha1').update(password).digest('hex');

  const queryToExtractProductID = `SELECT NVL(P_ID,0) FROM "INVENTORY"."PRODUCT" WHERE P_NAME = :pName`;
  // const queryToExtractProductID = `BEGIN
  //     GET_PRODUCT_ID(:pName);
  // END;`;

 const bindParams = {
    //picture: picture,
    pName: productName
    // pSize:pSize,
    // pWeight:pWeight,
    // quantity:quantity,
    // price:price,
    // discount:discount,
    // prefTemp:prefTemp,
    // description:description,
    // type:type,
    // elevel:elevel,
    // madeOf:madeOf,
    // fcolor:fcolor,
    // prodDate:prodDate,
    // expDate:expDate,
    // ram:ram,
    // storage:storage,
    // processor:processor,
    // tcolor:tcolor,
    // tlevel:tlevel,
    // s_id:s_id
};
//console.log(bindParams['pName']);

const queryToExtractInvoiceNo = `SELECT * FROM "INVENTORY"."SUPPLIES"`;
const result4 =   await runQuery(queryToExtractInvoiceNo, []);

console.log('ok');

const invoiceNo = result4.rows.length+1;
// check s_id validation......here##################################

  const result2 =   await runQuery(queryToExtractProductID,bindParams);


  
  let pID =0;
  if (result2.rows.length > 0) {
  pID = result2.rows[0][0];
  const queryToInsertInSupplies = `INSERT INTO "INVENTORY"."SUPPLIES"("DATE","S_ID","P_ID","P_SIZE(CC)","P_WEIGHT(KG)","PREFERRED_TEMP(C)","QUANTITY","INVOICE_NO") VALUES(SYSDATE,:s_id,:pID,:psize,:pWeight,:prefTemp,:quantity,:invoiceNo)`;

const bindParams2 = {
  s_id: status,
  pID: pID,
  psize: productSize,
  pWeight: productWeight,
  prefTemp: productTemp,
  quantity: productQuantity,
  invoiceNo: invoiceNo
}
const result5 = await runQuery(queryToInsertInSupplies,bindParams2);

    
    const ifExistThenQuery = `UPDATE "INVENTORY"."PRODUCT" SET "REMAINING_ITEM" = "REMAINING_ITEM" + :productQuantity WHERE "P_ID" = :pID`;
    // HERE NEEDS TO RUN A TRIGGER ON UPDATE THE DAILY CHARGE AND DUE WILL BE UPDATED
    const bindParams4 = {
      productQuantity: productQuantity,
      pID: pID
    }
    const result7 = await runQuery(ifExistThenQuery,bindParams4);

    if (pID !== 0) {
        console.log("hello");
    } else {
        console.log("No matching product found.");
    }
} else {
  const queryToExtractpID = `SELECT P_ID FROM "INVENTORY"."PRODUCT" ORDER BY P_ID DESC`;
  const result3 =   await runQuery(queryToExtractpID, []);  // redundant query can use query2's result

  //console.log(result2);

  pID = result3.rows.length+1;  // can write pID = result2.rows.length+1;

    console.log("No rows returned from the query.");




const queryToInsertInSupplies = `INSERT INTO "INVENTORY"."SUPPLIES"("DATE","S_ID","P_ID","P_SIZE(CC)","P_WEIGHT(KG)","PREFERRED_TEMP(C)","QUANTITY","INVOICE_NO") VALUES(SYSDATE,:s_id,:pID,:psize,:pWeight,:prefTemp,:quantity,:invoiceNo)`;

const bindParams2 = {
  s_id: status,
  pID: pID,
  psize: productSize,
  pWeight: productWeight,
  prefTemp: productTemp,
  quantity: productQuantity,
  invoiceNo: invoiceNo
}
const result5 = await runQuery(queryToInsertInSupplies,bindParams2);

// now we will decide what will be the storage it by using the supplies table and storage table...
const queryToRetrieveStorageId = `SELECT ST_ID FROM "INVENTORY"."STORAGE" WHERE  "TYPE"= :selectedRootCategory AND :prefTemp >= "MIN_TEMP"  AND :prefTemp <= "MAX_TEMP"`;
const bindParams6 = {
  selectedRootCategory: selectedRootCategory,
  prefTemp: productTemp
}
const result8 = await runQuery(queryToRetrieveStorageId,bindParams6);
const storageId = result8.rows[0][0];
const perUnitChargeQuery = `SELECT PER_VOL_COST*(:productSize) FROM "INVENTORY"."STORAGE" WHERE ST_ID = :storageId`;
const bindParams7 = {
  productSize: productSize,
  storageId: storageId
}
const result9 = await runQuery(perUnitChargeQuery,bindParams7);
const perUnitCharge = result9.rows[0][0];
const totalCharge = perUnitCharge*productQuantity; // not necessary
console.log("perUnitCharge :",perUnitCharge);
console.log("storage id is : " , storageId);



  const insertIntoProduct = `INSERT INTO "INVENTORY"."PRODUCT"("P_ID","P_NAME","PRICE","DISCOUNT","DESCRIPTION","TYPE","REMAINING_ITEM","STORAGE_ID","SOLD_QUANTITY","PER_UNIT_CHARGE") VALUES(:pID,:pName,:price,:discount,:description,:type,:quantity,:storageId,0,:perUnitCharge)`; // sold quantity will be updated by trigger
  const bindParams3 = {
    pID: pID,
    pName: productName,
    price: productPrice,
    discount: productDiscount,
    description: productDescription,
    type: selectedRootCategory,
    quantity: productQuantity,
    storageId: storageId,
    perUnitCharge: perUnitCharge
 }
const result6 = await runQuery(insertIntoProduct,bindParams3);

if(selectedRootCategory === 'IT_PRODUCTS'){
  const insertIntoElectronics = `INSERT INTO "INVENTORY"."IT_PRODUCTS"("P_ID","RAM(GB)","STORAGE(GB)","PROCESSOR(GHZ)") VALUES(:pID,:ram,:storage,:processor)`;
  const bindParams4 = {
    pID: pID,
    ram: IT_ram,
    storage: IT_storage,
    processor: IT_processor
}
const result7 = await runQuery(insertIntoElectronics,bindParams4);
}
else if(selectedRootCategory === 'EDUCATIONAL'){
  const insertIntoEducational = `INSERT INTO "INVENTORY"."EDUCATIONAL"("P_ID","LEVEL") VALUES(:pID,:elevel)`;
  const bindParams5 = {
    pID: pID,
    elevel: educationalLevel
}
const result8 = await runQuery(insertIntoEducational,bindParams5);
}
else if(selectedRootCategory === 'FASHION'){
  const insertIntoFashion = `INSERT INTO "INVENTORY"."FASHION"("P_ID","MADE_OF","SIZE","COLOR") VALUES(:pID,:fmadeOf,:fsize,:fcolor)`;
  const bindParams6 = {
    pID: pID,
    fmadeOf: fashionMadeOf,
    fsize: fashionSize,
    fcolor: fashionColor
}
const result9 = await runQuery(insertIntoFashion,bindParams6);
}
else if(selectedRootCategory === 'TOYS'){
  const insertIntoToys = `INSERT INTO "INVENTORY"."TOYS"("P_ID","COLOR","LEVEL") VALUES(:pID,:tcolor,:tlevel)`;
  const bindParams7 = {
    pID: pID,
    tcolor: Toy_color,
    tlevel: Toy_level
}
const result10 = await runQuery(insertIntoToys,bindParams7);
}
else if(selectedRootCategory === 'GROCERIES'){
  const insertIntoGroceries = `INSERT INTO "INVENTORY"."GROCERIES"("P_ID","PRODUCTION_DATE","EXPIARY_DATE") VALUES(:pID,:prodDate,:expDate)`;
  const bindParams8 = {
    pID: pID,
    prodDate: productionDate,
    expDate: ExpiaryDate
}
const result11 = await runQuery(insertIntoGroceries,bindParams8);
}
else{
  console.log("No matching product found.");
}
}


const size = req.body.productSize;


// const queryToInsertInSupplies = `INSERT INTO "INVENTORY"."SUPPLIES"("DATE","S_ID","P_ID","P_SIZE(CC)","P_WEIGHT(KG)","PREFERRED_TEMP(C)","QUANTITY","INVOICE_NO") VALUES(SYSDATE,:s_id,:pID,:size,:pWeight,:prefTemp,:quantity,:invoiceNo)`;
// const bindParams2 = {
//   s_id: s_id,
//   pID: pID,
//   size:size,
//   pWeight:productWeight,
//   prefTemp:productTemp,
//   quantity:productQuantity,
//   invoiceNo:invoiceNo
  
// }
// console.log(bindParams2)
// console.log("this is a ID : " ,bindParams2.size);

// const result5 = await runQuery(queryToInsertInSupplies,bindParams2);

// const queryToInsertInSupplies = `INSERT INTO "INVENTORY"."SUPPLIES"("DATE","S_ID","P_ID","P_SIZE(CC)","P_WEIGHT(KG)","PREFERRED_TEMP(C)","QUANTITY","INVOICE_NO") VALUES(SYSDATE,:s_id,:pID,:psize,:pWeight,:prefTemp,:quantity,:invoiceNo)`;

// const bindParams2 = {
//   s_id: status,
//   pID: pID,
//   psize: productSize,
//   pWeight: productWeight,
//   prefTemp: productTemp,
//   quantity: productQuantity,
//   invoiceNo: invoiceNo
// }
// const result5 = await runQuery(queryToInsertInSupplies,bindParams2);



  //if(result2.rows[0][0]==1)console.log("hello");

//   const newuId = result2.rows.length+1;
//   const username = result2.rows.length+1;
//   const reg = '12-JAN-2023';

//   const insertQuery = `INSERT INTO "INVENTORY"."CUSTOMER"("C_ID","USER_NAME","C_NAME","EMAIL","PHONE_NO","REG_DATE","PASSWORD") VALUES(:newuId,:username,:customerName, :email,:phoneNo,:reg,:password)`;
//   console.log("this is a ID : " ,newuId);

//   const bindParams = {
//     username: username,
//     reg:reg,
//     newuId : newuId,
//     customerName: customerName,
//     email:email,
//     phoneNo : phoneNo,
//     password: password
// };
// const result3 = await runQuery(insertQuery,bindParams);
// res.send(result3);
});

const port = 8000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});






// app.post('/login',async (req, res)=>{

//     console.log(req.body);

//     const username = req.body.user;
//     const data = await runQuery(
//         `SELECT * FROM "INVENTORY"."Product" WHERE "P_NAME" ='${username}'`,[]
//     );
//     res.send(data.rows);


// })


/*
/import bodyParser from "body-parser";
import cors from "cors";
import crypto from 'crypto';
import express from "express";
import connectToDatabase from "./connectToDatabase.js"; // Import connectToDatabase using ESM syntax
import runQuery, { extractData } from "./runQuery.js"; // Import runQuery using ESM syntax
import AddProduct from "../client/src/pages/AddProducts.js";

const app = express();

(async () => {
  try {
    await connectToDatabase();
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
})();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());



app.get("/", async (req, res) => {
  try {
    let result = await runQuery("select * from employees", []);
    const columnsToExtract = ['FIRST_NAME', 'SALARY'];
    const output = extractData(result, columnsToExtract);
    //console.log(extractData(result,columnsToExtract));

    res.status(200).json({ data: result || [], message: "Welcome to the API!" });
  } catch (error) {
    console.error("Error fetching employees:", error);
    res.status(500).json({ message: "Error fetching employees." });
  }
});



app.get('/locations', async (req, res) => {
  try {

    
        const query = `
      SELECT
        u.locationID AS ID, 
        d.divisionName AS division,
        di.districtName AS district,
        u.thanaName AS upazilla
      FROM
        Division d
      JOIN
        District di ON d.divisionID = di.divisionID
      JOIN
        Upazilla u ON di.districtID = u.districtID
    `;
    const queryData=await runQuery(query,[]);
    // console.log(queryData);

    // result=extractData(query,['division','district','upazilla']);
    //console.log(queryData);
    //res.json(extractData(queryData),['DIVISION','DISTRICT','UPAZILLA']);
    res.json(extractData(queryData,['ID','DIVISION','DISTRICT','UPAZILLA']));

  } catch (error) {
    console.error('Error fetching locations:', error);
    res.status(500).json({ error: 'Error fetching locations' });
  }
});

app.post('/signup', async (req,res) => {

  //console.log(req);
  const {firstname, lastname, email, password, locationID} = req.body;
  const passwordHash = crypto.createHash('sha1').update(password).digest('hex');
  const queryToExtractUserID = `SELECT userID FROM USERS ORDER BY userID DESC`;
  const result2 =   await runQuery(queryToExtractUserID, []);

  //console.log(result2);

  const newuId = result2.rows.length+1;
  const insertQuery = `INSERT INTO USERS(userID,email,passwords,firstname,lastname,locationID) VALUES(:newuId,:email,:passwordHash,:firstname,:lastname,:locationID)`;
  console.log("this is a ID : " ,newuId);

  const bindParams = {
    newuId : newuId,
    passwordHash: passwordHash,
    email:email,
    firstname:firstname,
    lastname:lastname,
    locationID: locationID,
};

  const result3 = await runQuery(insertQuery,bindParams);
  res.send(result3);

})


app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const passwordHash = crypto.createHash('sha1').update(password).digest('hex');
  //console.log(passwordHash)

  const query = 'SELECT * FROM users WHERE email = :email AND passwords = :password';

const bindParams = {
    email: email,
    password: passwordHash
};


  try {
    const result = await runQuery(query, bindParams);
    //console.log(result);
    const columnsToExtract = ['userID', 'email','firstName','lastName','locationID','reported'];
    const output = extractData(result, columnsToExtract);
    //console.log(extractData(result,columnsToExtract));

      if (result &&result.rows.length > 0) {
          // Login successful
          res.send(output);
      } else {
          // Invalid credentials
          res.status(401).send("Invalid username or password.");
      }

  } catch (error) {
      console.error("Error during login:", error);
      res.status(500).json({ message: "Internal server error." });
  }
});

app.get('/categories', (req, res) => {
  const categories = ['Electronics', 'Clothing', 'Groceries'];
  res.json(categories);
});



// app.get('/products', async (req, res) => {
//   try {
//     const query = 'SELECT * FROM Product';
//     const queryData = await runQuery(query, []);
//     console.log(queryData)
//     const output = extractData(queryData, ['productID', 'subCategoryID', 'productName', 'brand', 'picture', 'descriptions']);
//     res.json(output);
//   } catch (error) {
//     console.error('Error fetching products:', error);
//     res.status(500).json({ error: 'Error fetching products' });
//   }
// });

app.get('/products', async (req, res) => {
  const subCategoryID = req.query.subCategoryID;
  console.log(subCategoryID)
  try {
      const query = 'SELECT * FROM Product WHERE subCategoryID = :subCategoryID';
      const queryData = await runQuery(query, [subCategoryID]);
      //console.log(queryData)



      const output = extractData(queryData, ['productID', 'subCategoryID', 'productName', 'brand', 'picture', 'descriptions']);
      res.json(output);
  } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ error: 'Error fetching products' });
  }
});


app.get('/rootCategories', async (req, res) => {
  try {
      const query = 'SELECT * FROM RootCategory';  // Assuming RootCategories is the name of your table
      const queryData = await runQuery(query, []);
      const output = extractData(queryData, ['rootCategoryID', 'name']);
      res.json(output);
  } catch (error) {
      console.error('Error fetching root categories:', error);
      res.status(500).json({ error: 'Error fetching root categories' });
  }
});

app.get('/subCategories', async (req, res) => {
  const rootCategoryID = req.query.rootCategoryID;
  try {
      const query = 'SELECT * FROM SubCategory WHERE rootCategoryID = :rootCategoryID';
      const queryData = await runQuery(query, [rootCategoryID]);
      const output = extractData(queryData, ['subCategoryID', 'name']);
      res.json(output);
  } catch (error) {
      console.error('Error fetching subcategories:', error);
      res.status(500).json({ error: 'Error fetching subcategories' });
  }
});

app.post('/AddProduct',(req,res)=>
{
  console.log(req);
}
);



app.put("/add", async (req, res) => {
  const query = "INSERT INTO EMPLOYEES (name, age, country) VALUES (?, ?, ?)";
  const bindParams = [req.body.name, req.body.age, req.body.country];

  try {
    const result = await runQuery(query, bindParams);
    //console.log("Row inserted:", result);
    res.status(200).json({ message: "Row inserted successfully!" });
  } catch (error) {
    console.error("Error inserting row:", error);
    res.status(500).json({ message: "Error inserting row." });
  }
});

const port = 8000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

*/