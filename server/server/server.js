import bodyParser from "body-parser";
import runQuery ,{extractData} from './Queries.js';
import connectToDatabase, {whereToConnect} from './connectToDataBase.js';
import cors from "cors";
import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { ACCESS_TOKEN_SECRET } from "./config.js";
import authRoute from "./authRoute.js";
import otpGenerator from "otp-generator";
import {mailOptions, transporter} from "./mail.js";
import oracledb from "oracledb";
import axios from "axios";
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

app.post("/PlacedOrder", async (req, res) => {
        const {E_ID} = req.body;
        console.log(E_ID);
        try{
            const queryToExtractDataFromTempOrderTable = `SELECT * FROM "INVENTORY"."TEMP_ORDER" WHERE E_ID = :E_ID`;
            const bindParamsToExtractDataFromTempOrderTable = {
                E_ID : E_ID
            };
            const resultOfDataFromTempOrderTable = await runQuery(queryToExtractDataFromTempOrderTable,bindParamsToExtractDataFromTempOrderTable);
            console.log(resultOfDataFromTempOrderTable.rows[0]);
            res.send(resultOfDataFromTempOrderTable);
        }
        catch(error)
        {
            console.error("Error while taking the data from temp order : ", error);
            res.status(500).json({message: "Error while taking the data from temp order"});
        }
    }
);



app.post("/deleteOrder", async (req, res) => {
        let selectedArray = req.body.selectedArray;
        console.log(selectedArray);
        try{
            for(let i=0;i<selectedArray.length;i++)
            {
                const queryToDeleteDataFromTempOrderTable = `DELETE FROM "INVENTORY"."TEMP_ORDER" WHERE TEMP_O_ID = :TEMP_O_ID`;
                const bindParamsToDeleteDataFromTempOrderTable = {
                    TEMP_O_ID : selectedArray[i]
                };
                const resultOfDeleteDataFromTempOrderTable = await runQuery(queryToDeleteDataFromTempOrderTable,bindParamsToDeleteDataFromTempOrderTable);
                console.log(resultOfDeleteDataFromTempOrderTable);

                res.send('data deleted');
            }
        }
        catch(error)
        {
            console.error("Error while taking the data from temp order : ", error);
            res.status(500).json({message: "Error while taking the data from temp order"});
        }
    }
);




app.post("/acceptOrder", async (req, res) => {
        let selectedArray = req.body.selectedArray;
        console.log(selectedArray);
        try{
            for(let i=0;i<selectedArray.length;i++)
            {
                const queryToExtractDataFromTempOrderTable = `SELECT * FROM "INVENTORY"."TEMP_ORDER" WHERE TEMP_O_ID = :TEMP_O_ID`;
                const bindParamsToExtractDataFromTempOrderTable = {
                    TEMP_O_ID : selectedArray[i]
                };
                const resultOfDataFromTempOrderTable = await runQuery(queryToExtractDataFromTempOrderTable,bindParamsToExtractDataFromTempOrderTable);
                console.log(resultOfDataFromTempOrderTable.rows[0]);

                const queryToInsertDataIntoOrderTable = `INSERT INTO "INVENTORY"."ORDER"("C_ID","O_ID","ORDER_DATE","E_ID","SHIPPING_ADDRESS","BKASH_MOB_NO","BKASH_TRANS_ID")
         VALUES(:customerID,:newOrderID,:orderDate,:employeeID,:shippingAddress,:bkash_mob_no,:bkash_trans_id)`;
                const bindParamsToInsertDataIntoOrderTable = {
                    customerID : resultOfDataFromTempOrderTable.rows[0][1],
                    newOrderID : selectedArray[i],
                    orderDate : resultOfDataFromTempOrderTable.rows[0][2],
                    employeeID : resultOfDataFromTempOrderTable.rows[0][7],
                    shippingAddress : resultOfDataFromTempOrderTable.rows[0][3],
                    bkash_mob_no : resultOfDataFromTempOrderTable.rows[0][4],
                    bkash_trans_id : resultOfDataFromTempOrderTable.rows[0][5]
                };
                const resultOfInsertDataIntoOrderTable = await runQuery(queryToInsertDataIntoOrderTable,bindParamsToInsertDataIntoOrderTable);
                console.log(resultOfInsertDataIntoOrderTable);
                const queryToDeleteDataFromTempOrderTable = `DELETE FROM "INVENTORY"."TEMP_ORDER" WHERE TEMP_O_ID = :TEMP_O_ID`;
                const bindParamsToDeleteDataFromTempOrderTable = {
                    TEMP_O_ID : selectedArray[i]
                };
                const resultOfDeleteDataFromTempOrderTable = await runQuery(queryToDeleteDataFromTempOrderTable,bindParamsToDeleteDataFromTempOrderTable);
                console.log(resultOfDeleteDataFromTempOrderTable);

                res.send(resultOfInsertDataIntoOrderTable);
            }
        }
        catch(error)
        {
            console.error("Error while taking the data from temp order : ", error);
            res.status(500).json({message: "Error while taking the data from temp order"});
        }
    }
);



app.post("/insertOrder", async (req, res) => {
    const {Address,phoneNo,transactionNumber,total,productQuantity, productsDetails} = req.body;
    console.log(req.body);
    const token = req.headers.authorization;
    const resAuth = await axios.get('http://localhost:8000/auth/customer',{headers: {Authorization: token}});
    if(resAuth.data.id<0)
        res.send({message: 'Unauthorized user.'});
    try{
        const queryToExtractE_ID = `SELECT EID FROM (SELECT EMPLOYEE.E_ID EID FROM EMPLOYEE LEFT JOIN TEMP_ORDER ON( EMPLOYEE.E_ID = TEMP_ORDER.E_ID) GROUP BY EMPLOYEE.E_ID ORDER BY COUNT(TEMP_ORDER.TEMP_O_ID) ASC, EMPLOYEE.E_ID ASC) WHERE ROWNUM = 1`;
        const resultOfE_ID = await runQuery(queryToExtractE_ID, []);
        const newE_ID = resultOfE_ID.rows[0][0];
        const  C_ID = resAuth.data.id; // We need to change this to the customer id of the logged in user by using the token
        const queryToInsertOrder = `INSERT INTO "INVENTORY"."TEMP_ORDER"("TEMP_O_ID","PLACE_DATE","SHIPPING_ADDRESS","BKASH_MOB_NO","BKASH_TRANS_ID","TOTAL_EXPENSE","C_ID","E_ID") VALUES(SEQ_O_ID.NEXTVAL,SYSDATE,:Address,:phoneNo,:transactionNumber,:total,:C_ID,:newE_ID)`;
        const bindParamsToInsertOrder = {
            Address : Address,
            phoneNo : phoneNo,
            transactionNumber : transactionNumber,
            total : total,
            C_ID : C_ID,
            newE_ID : newE_ID
        };
        const resultOfInsertOrder = await runQuery(queryToInsertOrder,bindParamsToInsertOrder);
        console.log(resultOfInsertOrder);
        const queryToExtractOrderID = `SELECT TEMP_O_ID FROM "INVENTORY"."TEMP_ORDER" WHERE BKASH_TRANS_ID = :transactionNumber AND C_ID = :C_ID AND E_ID = :newE_ID AND TOTAL_EXPENSE = :total`;
        const bindParamsToExtractOrderID = {
            transactionNumber : transactionNumber,
            C_ID : C_ID,
            newE_ID : newE_ID,
            total : total
        };


        const resultOfOrderID = await runQuery(queryToExtractOrderID, bindParamsToExtractOrderID);
        const newOrderID = resultOfOrderID.rows[0][0];
        console.log(newOrderID);
        for(let i=0;i<productsDetails.length;i++)
        {
            const queryToInsertOrderDetails = `INSERT INTO "INVENTORY"."ORDERED_PRODUCTS"("TEMP_O_ID","P_ID","QUANTITY") VALUES(:newOrderID,:newP_ID,:Quantity)`;
            const bindParamsToInsertOrderDetails = {
                newOrderID : newOrderID,
                newP_ID : productsDetails[i].P_ID,
                Quantity : productQuantity[i]
            };
            const resultOfInsertOrderDetails = await runQuery(queryToInsertOrderDetails,bindParamsToInsertOrderDetails);
            console.log(resultOfInsertOrderDetails);
        }
        res.send({newOrderID,newE_ID});
    }
    catch(error)
    {
        console.error("Error while INSERTING DATA : ", error);
        res.status(500).json({message: "Error while INSERTING DATA"});
    }
});

app.post("/showReviews", async (req, res) => {
        const {P_ID} = req.body;
        console.log(P_ID);
        try{
            const queryToExtractDataFromReviewTable = `SELECT * FROM "INVENTORY"."REVIEWS" LEFT JOIN "INVENTORY"."CUSTOMER" ON(REVIEWS.C_ID = CUSTOMER.C_ID) JOIN "INVENTORY"."PRODUCT" ON(REVIEWS.P_ID= PRODUCT.P_ID) WHERE REVIEWS.P_ID = :P_ID`;
            const bindParamsToExtractDataFromReviewTable = {
                P_ID : P_ID
            };
            const resultOfDataFromReviewTable = await runQuery(queryToExtractDataFromReviewTable,bindParamsToExtractDataFromReviewTable);
            console.log(resultOfDataFromReviewTable);
            res.send(resultOfDataFromReviewTable);
        }
        catch(error)
        {
            console.error("Error while taking the data from review : ", error);
            res.status(500).json({message: "Error while taking the data from review"});
        }
    }
);

// app.post("/productDetails", async (req, res) => {
//         const {P_ID} = req.body; // May be P_ID as in Frontend
//         console.log(P_ID);
//         try{
//
//             const queryToCheckTypeOfProduct = `SELECT TYPE FROM "INVENTORY"."PRODUCT" WHERE P_ID = :P_ID`;
//
//             const bindParamsToCheckProductType = {
//                 ":P_ID" :P_ID
//             };
//             const resultOfTypeCheck = await runQuery(queryToCheckTypeOfProduct,bindParamsToCheckProductType);
//             const typeOfProduct = resultOfTypeCheck.rows[0][0];
//             // console.log(typeOfProduct);
//
//             let queryToProductDetails = `SELECT * FROM "INVENTORY"."PRODUCT" `;
//             let columnsToExtract = [];
//
//             if(typeOfProduct === 'EDUCATIONAL')
//             {
//                 queryToProductDetails += 'NATURAL JOIN "INVENTORY"."EDUCATIONAL" WHERE P_ID = :P_ID';
//                 columnsToExtract = ['P_ID','P_NAME','PRICE','DISCOUNT','DESCRIPTION','TYPE','REMAINING_ITEM','SOLD_QUANTITY','LEVEL','PICTURE','RATING'];
//             }
//             else if(typeOfProduct === 'FASHION')
//             {
//                 queryToProductDetails += 'NATURAL JOIN "INVENTORY"."FASHION" WHERE P_ID = :P_ID';
//                 columnsToExtract = ['P_ID','P_NAME','PRICE','DISCOUNT','DESCRIPTION','TYPE','REMAINING_ITEM','SOLD_QUANTITY','MADE_OF','SIZE','COLOR','PICTURE','RATING'];
//             }
//             else if(typeOfProduct === 'GROCERY')
//             {
//                 queryToProductDetails += 'NATURAL JOIN "INVENTORY"."GROCERY" WHERE P_ID = :P_ID';
//                 columnsToExtract = ['P_ID','P_NAME','PRICE','DISCOUNT','DESCRIPTION','TYPE','REMAINING_ITEM','SOLD_QUANTITY','PRODUCTION_DATE','EXPIARY_DATE','PICTURE','RATING'];
//             }
//             else if(typeOfProduct === 'IT_PRODUCTS')
//             {
//                 queryToProductDetails += 'NATURAL JOIN "INVENTORY"."IT_PRODUCTS" WHERE P_ID = :P_ID';
//                 columnsToExtract = ['P_ID','P_NAME','PRICE','DISCOUNT','DESCRIPTION','TYPE','REMAINING_ITEM','SOLD_QUANTITY','RAM(GB)','STORAGE(GB)','PROCESSOR(GHZ)','PICTURE','RATING'];
//             }
//             else if(typeOfProduct === 'TOY')
//             {
//                 queryToProductDetails += 'NATURAL JOIN "INVENTORY"."TOY" WHERE P_ID = :P_ID';
//                 columnsToExtract = ['P_ID','P_NAME','PRICE','DISCOUNT','DESCRIPTION','TYPE','REMAINING_ITEM','SOLD_QUANTITY','COLOR','LEVEL','PICTURE','RATING'];
//             }
//             else
//             {
//                 console.log("No matching product found.");
//             }
//             const bindParamsToProductDetails = {
//                 ":P_ID" :P_ID
//             };
//             const resultOfProductDetails = await runQuery(queryToProductDetails,bindParamsToProductDetails);
//
//             const output = extractData(resultOfProductDetails, columnsToExtract);
//             // console.log(output);
//
//             res.send(output);
//
//
//
//         }catch(error)
//         {
//             console.error("Error while taking the data from employees : ", error);
//             res.status(500).json({message: "Error while taking the data from products"});
//         }
//
//     }
// );

app.post("/productDetails", async (req, res) => {
        const {P_ID} = req.body;
        console.log(P_ID);
        try{
            const queryToCheckTypeOfProduct = `SELECT TYPE FROM "INVENTORY"."PRODUCT" WHERE P_ID = :P_ID`;

            const bindParamsToCheckProductType = {
                ":P_ID" :P_ID
            };
            const resultOfTypeCheck = await runQuery(queryToCheckTypeOfProduct,bindParamsToCheckProductType);
            const typeOfProduct = resultOfTypeCheck.rows[0][0];
            //console.log(typeOfProduct);



            let queryToProductDetails = `SELECT * FROM "INVENTORY"."PRODUCT" `;
            let columnsToExtract = [];

            if(typeOfProduct === 'EDUCATIONAL')
            {
                queryToProductDetails += 'NATURAL JOIN "INVENTORY"."EDUCATIONAL" WHERE P_ID = :P_ID';
                //  columnsToExtract = ['P_ID','P_NAME','PRICE','DISCOUNT','DESCRIPTION','TYPE','REMAINING_ITEM','SOLD_QUANTITY','LEVEL','PICTURE','RATING'];
                columnsToExtract = ['P_ID','P_NAME','PRICE','DISCOUNT','DESCRIPTION','TYPE','REMAINING_ITEM','SOLD_QUANTITY','LEVEL','PICTURE','RATING'];
            }
            else if(typeOfProduct === 'FASHION')
            {
                queryToProductDetails += 'NATURAL JOIN "INVENTORY"."FASHION" WHERE P_ID = :P_ID';
                columnsToExtract = ['P_ID','P_NAME','PRICE','DISCOUNT','DESCRIPTION','TYPE','REMAINING_ITEM','SOLD_QUANTITY','MADE_OF','SIZE','COLOR','PICTURE','RATING'];
            }
            else if(typeOfProduct === 'GROCERY')
            {
                queryToProductDetails += 'NATURAL JOIN "INVENTORY"."GROCERY" WHERE P_ID = :P_ID';
                columnsToExtract = ['P_ID','P_NAME','PRICE','DISCOUNT','DESCRIPTION','TYPE','REMAINING_ITEM','SOLD_QUANTITY','PRODUCTION_DATE','EXPIARY_DATE','PICTURE','RATING'];
            }
            else if(typeOfProduct === 'IT_PRODUCTS')
            {
                queryToProductDetails += 'NATURAL JOIN "INVENTORY"."IT_PRODUCTS" WHERE P_ID = :P_ID';
                columnsToExtract = ['P_ID','P_NAME','PRICE','DISCOUNT','DESCRIPTION','TYPE','REMAINING_ITEM','SOLD_QUANTITY','RAM(GB)','STORAGE(GB)','PROCESSOR(GHZ)','PICTURE','RATING'];
            }
            else if(typeOfProduct === 'TOY')
            {
                queryToProductDetails += 'NATURAL JOIN "INVENTORY"."TOY" WHERE P_ID = :P_ID';
                columnsToExtract = ['P_ID','P_NAME','PRICE','DISCOUNT','DESCRIPTION','TYPE','REMAINING_ITEM','SOLD_QUANTITY','COLOR','LEVEL','PICTURE','RATING'];
            }
            else
            {
                console.log("No matching product found.");
            }
            const bindParamsToProductDetails = {
                ":P_ID" :P_ID
            };
            const resultOfProductDetails = await runQuery(queryToProductDetails,bindParamsToProductDetails);

            const output = extractData(resultOfProductDetails, columnsToExtract);
            console.log(output);

            res.send(output);

        }catch(error)
        {
            console.error("Error while taking the data from employees : ", error);
            res.status(500).json({message: "Error while taking the data from products"});
        }

    }
);

app.get("/Educational", async (req, res) => {
    try {
        const queryToExtractEduProduct = 'SELECT * FROM "INVENTORY"."PRODUCT" NATURAL JOIN "INVENTORY"."EDUCATIONAL"';
        const resultOfEduProd = await runQuery(queryToExtractEduProduct, []);
        const columnsToExtract = ['P_ID','P_NAME','PRICE','DISCOUNT','DESCRIPTION','TYPE','REMAINING_ITEM','SOLD_QUANTITY','LEVEL','PICTURE','RATING'];
        const output = extractData(resultOfEduProd, columnsToExtract);
        // console.log(output);
        res.send(output);
    } catch (error) {
        console.error('Error fetching Edu products:', error);
        res.status(500).json({ error: 'Error fetching Edu products' });
    }
});

app.get("/itproducts", async (req, res) => {
    try {
        const queryToExtractEduProduct = 'SELECT * FROM "INVENTORY"."PRODUCT" NATURAL JOIN "INVENTORY"."IT_PRODUCTS"';
        const resultOfEduProd = await runQuery(queryToExtractEduProduct, []);
        const columnsToExtract = ['P_ID','P_NAME','PRICE','DISCOUNT','DESCRIPTION','TYPE','REMAINING_ITEM','SOLD_QUANTITY','RAM(GB)','PICTURE','RATING'];
        const output = extractData(resultOfEduProd, columnsToExtract);
        //console.log(output);
        res.send(output);
    } catch (error) {
        console.error('Error fetching Edu products:', error);
        res.status(500).json({ error: 'Error fetching Edu products' });
    }
});

app.get("/TopSoldProducts", async (req, res) => {
    try {
        const query = 'SELECT * FROM (SELECT * FROM PRODUCT ORDER BY SOLD_QUANTITY DESC) WHERE ROWNUM <= 5';
        const queryData = await runQuery(query, []);
        //console.log(queryData)
        const output = extractData(queryData, [
            "P_ID", // "P_ID" is added to the query to get the product id of the top sold products
            "P_NAME",
            "TYPE",
            "DESCRIPTION",
            "PRICE",
            "DISCOUNT",
            "PICTURE"
        ]);
        res.json(output);
    } catch (error) {
        console.error("Error fetching TOP SOLD products:", error);
        res.status(500).json({ error: "Error fetching TOP SOLD products" });
    }
});


app.get("/TopRatedProducts", async (req, res) => {
    try {
        const query = 'SELECT * FROM (SELECT * FROM PRODUCT ORDER BY RATING DESC) WHERE ROWNUM <= 5';
        const queryData = await runQuery(query, []);
        //console.log(queryData)
        const output = extractData(queryData, [
            "P_ID", // "P_ID" is added to the query to get the product id of the top rated products
            "P_NAME",
            "TYPE",
            "DESCRIPTION",
            "PRICE",
            "DISCOUNT",
            "PICTURE"
        ]);
        res.json(output);
    } catch (error) {
        console.error("Error fetching RATED products:", error);
        res.status(500).json({ error: "Error fetching TOP RATED products" });
    }
});


// app.get('/',async (req, res) => {
//   try{
//           console.log(req.headers.authorization);
//           const array = [];
//           let result = await runQuery("select * from PRODUCT WHERE PRICE > 20000",[]);
//           const jsonResult = JSON.stringify(result);
//           array.push(result);
//           console.log(result);
//           const columnNames = ['P_NAME','TYPE','DESCRIPTION','PRICE','DISCOUNT'];
//           const output = extractData(result, columnNames);
//           console.log(output);
//           console.log(extractData(result,columnsToExtract));
//           res.status(200).json({output});
//           console.log(output);
//           res.status(200).json({data: result, message: "welcome to our wedpage"});
//           console.log("this is a array : \n\n\n\n",array);
//           console.log(array[0])
//           res.status(200).send();
//         }catch(error)
//         {
//             console.error("Error while taking the data from employees : ", error);
//             res.status(500).json({message: "Error while taking the data from employees"});
//         }
// });

app.post("/myWishList", async (req, res) => {
        const {C_ID1} = req.body;
        console.log(C_ID1);
        try{
            const queryToExtractDataFromWishList = `SELECT * FROM "INVENTORY"."WISHLIST" NATURAL JOIN "INVENTORY"."PRODUCT" WHERE "WISHLIST".C_ID = :C_ID1`;
            const bindParamsToExtractDataFromWishList = {
                C_ID1 : C_ID1
            };
            const resultOfDataFromWishList = await runQuery(queryToExtractDataFromWishList,bindParamsToExtractDataFromWishList);
            //console.log(resultOfDataFromWishList);
            res.send(resultOfDataFromWishList);
        }
        catch(error)
        {
            console.error("Error while taking the data from WISHLIST JOIN PRODUCT  : ", error);
            res.status(500).json({message: "Error while taking the data from products"});
        }
    }
);



app.post("/wishList", async (req, res) => {
        const {P_ID} = req.body;
        console.log(P_ID);
        const token = req.headers.authorization;
        const resAuth = await axios.get('http://localhost:8000/auth/customer',{headers: {Authorization: token}});
        if(resAuth.data.id<0)
            res.send({message: 'Unauthorized user.'});
        try{
            let C_ID = resAuth.data.id; // We need to change this to the customer id of the logged in user by using the token
            const queryToInsertIntoWishList = `INSERT INTO "INVENTORY"."WISHLIST"("C_ID","P_ID") VALUES(:C_ID,:P_ID)`;
            const bindParamsToInsertIntoWishList = {
                C_ID : C_ID,
                P_ID : P_ID
            };
            const resultOfInsertIntoWishList = await runQuery(queryToInsertIntoWishList,bindParamsToInsertIntoWishList);
            console.log(resultOfInsertIntoWishList);
            res.send(resultOfInsertIntoWishList);
        }catch(error)
        {
            console.error("Error while taking the data from employees : ", error);
            res.status(500).json({message: "Error while taking the data from products"});
        }
    }
);


app.post('/RegisterAsSupplier', async (req,res) => {

  //console.log(req);
  const {supplierName, email, phoneNo,password, imageurl,supplierAddress} = req.body;
    const hashedpwd = await bcrypt.hash(password, 10);
  const queryToExtractUserID = `SELECT S_ID FROM "INVENTORY"."SUPPLIER" ORDER BY S_ID DESC`;
  const result2 =   await runQuery(queryToExtractUserID, []);

  //console.log(result2);

  const newuId = result2.rows.length+1;
  const username = result2.rows.length+1;
  //const reg = '12-JAN-2023';

  const insertQuery = `INSERT INTO "INVENTORY"."SUPPLIER"("S_ID","S_NAME","EMAIL","PHONE_NO","PASSWORD","PHOTO","ADDRESS") VALUES(:newuId,:supplierName, :email,:phoneNo,:password, :imageurl, :supplierAddress )`;
  console.log("this is a ID : " ,newuId);

  const bindParams = {
    newuId : newuId,
    supplierName: supplierName,
    email:email,
    phoneNo : phoneNo,
    password: hashedpwd,
      imageurl: imageurl,
      supplierAddress: supplierAddress
};
const result3 = await runQuery(insertQuery,bindParams);
res.send(result3);

});

app.post('/RegisterAsEmployee', async (req,res) => {

    //console.log(req);
    const {employeeName, email, phoneNo,password, imageurl,employeeAddress} = req.body;
    const hashedpwd = await bcrypt.hash(password, 10);
    const queryToExtractUserID = `SELECT S_ID FROM "INVENTORY"."EMPLOYEE" ORDER BY E_ID DESC`;
    const result2 =   await runQuery(queryToExtractUserID, []);

    //console.log(result2);

    const newuId = result2.rows.length+1;
    const username = result2.rows.length+1;
    //const reg = '12-JAN-2023';

    const insertQuery = `INSERT INTO "INVENTORY"."EMPLOYEE"("E_ID","E_NAME","EMAIL","PHONE_NO","PASSWORD","PHOTO","ADDRESS") VALUES(:newuId,:employeeName, :email,:phoneNo,:password, :imageurl, :employeeAddress )`;
    console.log("this is a ID : " ,newuId);

    const bindParams = {
        newuId : newuId,
        employeeName: employeeName,
        email:email,
        phoneNo : phoneNo,
        password: hashedpwd,
        imageurl: imageurl,
        employeeAddress: employeeAddress
    };
    const result3 = await runQuery(insertQuery,bindParams);
    res.send(result3);

});




app.post('/Register', async (req,res) => {

  //console.log(req);
  const {customerName, email, phoneNo,password,imageurl,Address} = req.body;
  const hashedpwd = await bcrypt.hash(password, 10);
  const queryToExtractUserID = `SELECT C_ID FROM "INVENTORY"."CUSTOMER" ORDER BY C_ID DESC`;
  const result2 =   await runQuery(queryToExtractUserID, []);

  //console.log(result2);

  const newuId = result2.rows.length+1;
  const username = result2.rows.length+1;
  // const reg = '12-JAN-2023';

  const insertQuery = `INSERT INTO "INVENTORY"."CUSTOMER"("C_ID","C_NAME","EMAIL","PHONE_NO","REG_DATE","PASSWORD","PHOTO","ADDRESS") VALUES(:newuId,:customerName,:email,:phoneNo,SYSDATE,:password,:imageurl,:Address)`;
  console.log("this is a ID : " ,newuId);

  const bindParams = {
    newuId : newuId,
    customerName: customerName,
    email:email,
    phoneNo : phoneNo,
    password: hashedpwd,
      imageurl : imageurl,
      Address : Address
};
const result3 = await runQuery(insertQuery,bindParams);
res.send(result3);

});




app.post('/login', async (req, res) => {
  console.log("Inside post");
  const { email, password } = req.body;
  const otp = otpGenerator.generate(8, { upperCase: true, specialChars: false, alphabets: true });
  //console.log(req.body.email);
   
  //const passwordHash = crypto.createHash('sha1').update(password).digest('hex');
  //console.log(passwordHash)

  const query = 'SELECT * FROM "INVENTORY"."CUSTOMER" WHERE "EMAIL" = :email';

const bindParams = {
    email: email
};


  try {
    console.log('Inside try and before query');
    const result = await runQuery(query, bindParams);
    // console.log('Result : ', result);
    const columnsToExtract = ['C_ID','C_NAME', 'EMAIL','PASSWORD','PHONE_NO','ADDRESS','PHOTO'];
    const output = extractData(result, columnsToExtract);
    // console.log(output);
    const match = await bcrypt.compare(password, output[0].PASSWORD);
    //console.log(extractData(result,columnsToExtract));

      if (match) {
          // Login successful
          const userInfo = {
              userId: output[0].C_ID,
              userRole: 'customer'
          }
          console.log(userInfo);
          const accessToken = jwt.sign(userInfo, ACCESS_TOKEN_SECRET, {expiresIn: '1800s'});
          console.log('OTP: ', otp);
          res.send({output: output, accessToken: accessToken});
      } else {
          // Invalid credentials
          res.status(401).send("Invalid username or password.");
      }

  } catch (error) {
      console.error("Error during login:", error);
      res.status(500).json({ message: "Internal server error." });
  }
});

app.post('/getCustomerData', async (req, res) => {
    console.log("Inside post");
    const { cid } = req.body;
    const query = 'SELECT * FROM "INVENTORY"."CUSTOMER" WHERE "C_ID" = :cid';
    const bindParams = {
        cid: cid
    };
    try {
        console.log('Inside try and before query');
        const result = await runQuery(query, bindParams);
        // console.log('Result : ', result);
        const columnsToExtract = ['C_ID','C_NAME', 'EMAIL','PHONE_NO','ADDRESS','PHOTO'];
        const output = extractData(result, columnsToExtract);
        // console.log(output);
        res.send(output);
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
const query = 'SELECT SUPPLIER.S_ID SID,NVL(SUM(DUE),0) TOTDUE,SUPPLIER.S_NAME, SUPPLIER.EMAIL,SUPPLIER.PHONE_NO,SUPPLIER.PASSWORD, SUPPLIER.PHOTO FROM SUPPLIER LEFT JOIN CHARGES  ON (SUPPLIER.S_ID = CHARGES.S_ID) GROUP BY SUPPLIER.S_ID,SUPPLIER.S_NAME, SUPPLIER.EMAIL,SUPPLIER.PHONE_NO,SUPPLIER.PASSWORD, SUPPLIER.PHOTO HAVING EMAIL = :email';
const bindParams = {
    email: email
};


  try {
    console.log('Inside try and before query');
    const result = await runQuery(query, bindParams);
    //console.log(result);
    const columnsToExtract = ['SID','TOTDUE','S_NAME', 'EMAIL','PASSWORD','PHONE_NO','PHOTO'];
    const output = extractData(result, columnsToExtract);
      const match = await bcrypt.compare(password, output[0].PASSWORD);
    //console.log(extractData(result,columnsToExtract));

      if (match) {
          // Login successful
          const userInfo = {
              userId: output[0].SID,
              userRole: 'supplier'
          }
          console.log(userInfo);
          // console.log(ACCESS_TOKEN_SECRET);
          const accessToken = jwt.sign(userInfo, ACCESS_TOKEN_SECRET, {expiresIn: '1800s'});
          // console.log(accessToken);
          res.send({output: output, accessToken: accessToken});
          // console.log(output);
      } else {
          // Invalid credentials
          res.status(401).send("Invalid username or password.");
      }

  } catch (error) {
      console.error("Error during login:", error);
      res.status(500).json({ message: "Internal server error." });
  }
});

app.post('/getSupplierData', async (req, res) => {
    console.log("Inside getSupplierData post");
    const { sid } = req.body;
    // console.log(req.body);
    const query = 'SELECT SUPPLIER.S_ID SID,NVL(SUM(DUE),0) TOTDUE,SUPPLIER.S_NAME, SUPPLIER.EMAIL,SUPPLIER.PHONE_NO,SUPPLIER.PASSWORD, SUPPLIER.PHOTO FROM SUPPLIER LEFT JOIN CHARGES  ON (SUPPLIER.S_ID = CHARGES.S_ID) GROUP BY SUPPLIER.S_ID,SUPPLIER.S_NAME, SUPPLIER.EMAIL,SUPPLIER.PHONE_NO,SUPPLIER.PASSWORD, SUPPLIER.PHOTO HAVING SUPPLIER.S_ID = :sid';
    const bindParams = {
        sid: sid
    };

    try {
        const result = await runQuery(query, bindParams);
        // console.log(result);
        //console.log(result);
        const columnsToExtract = ['SID','TOTDUE','S_NAME', 'EMAIL','PHONE_NO','PHOTO'];
        const output = extractData(result, columnsToExtract);
        res.send(output);
        // console.log(output);
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: "Internal server error." });
    }
});


app.post('/loginAsEmployee', async (req, res) => {
    console.log("Inside post");
  const { email, password } = req.body;
  const query = `SELECT E_ID,E_NAME,EMAIL,PASSWORD,PHONE_NO,TO_CHAR(JOIN_DATE,'DD-MON-YYYY') JOINDATE,ADDRESS, PHOTO FROM "INVENTORY"."EMPLOYEE" WHERE "EMAIL" = :email`;
const bindParams = {
    email: email
};


  try {
    console.log('Inside try and before query');
    const result = await runQuery(query, bindParams);
    //console.log(result);
    const columnsToExtract = ['E_ID','E_NAME', 'EMAIL','PASSWORD','PHONE_NO','JOINDATE','ADDRESS','PHOTO'];
    const output = extractData(result, columnsToExtract);
    // console.log(output);
    const match = await bcrypt.compare(password, output[0].PASSWORD);
    //console.log(extractData(result,columnsToExtract));
    console.log(match);
      if (match) {
          // Login successful
          const userInfo = {
              userId: output[0].E_ID,
              userRole: 'employee',
              f2auth: 'pending'
          }
          console.log(userInfo);
          const accessToken = jwt.sign(userInfo, ACCESS_TOKEN_SECRET, {expiresIn: '36000s'});
          res.send({output: output, accessToken: accessToken});
          // console.log(output);
      } else {
          // Invalid credentials
          res.status(401).send("Invalid username or password.");
      }

  } catch (error) {
      console.error("Error during login:", error);
      res.status(500).json({ message: "Internal server error." });
  }
});

app.post('/sendOTP', async (req, res) => {
    console.log("Inside sendOTP post");
    let emailId;
    const otp = otpGenerator.generate(8, { upperCase: true, specialChars: false, alphabets: true });
    const query = `SELECT EMAIL FROM "INVENTORY"."EMPLOYEE" WHERE "E_ID" = :id`;
    const bindParams = {
        id: req.body.id
    };
    console.log(req.body.id);
    try{
        const result = await runQuery(query, bindParams);
        console.log(result);
        const columnsToExtract = ['E_ID'];
        const output = extractData(result, columnsToExtract);
        console.log(output);
        emailId = result.rows[0][0];
        console.log(emailId);
        const emailBody = `<p>Dear User,</p><p>As per your request to login into INVENTORY MANAGEMENT SYSTEM, we're sending you an OTP.</p><br/> <p>Your OTP is <b>${otp}</b>.</p><p>This OTP is valid for 5 minutes. Please don't share this OTP with anyone.</p><p>Regards,<br/>Inventory Management System</p>`;
        const mail = mailOptions(emailId, 'OTP for Login as Employee', emailBody);
        console.log('email created', mail);
        await transporter.sendMail(mail, (error, info) => {
            if (error) {
                console.error('Error sending email: ', error);
            } else {
                console.log('Email sent: to ',emailId, info.response);
            }
        });
        const insertQuery = `INSERT INTO "INVENTORY"."OTP_VERIFY"("USER_ID","OTP","GENERATED_ON","USER_ROLE") VALUES(:id,:otp,SYSDATE, 'employee')`;
        const bindParams2 = {
            id: req.body.id,
            otp: otp
        }
        const result2 = await runQuery(insertQuery, bindParams2);
        res.send('OTP sent successfully.');
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: "Internal server error." });
    }
});

app.post('/verifyOTP', async (req, res) => {
    console.log("Inside verifyOTP post");
    const { otp, role, id } = req.body;
    async function runPLSQL(query, otp, role, id) {
        let connection;
        let result;
        const bindParams = {
            output: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
            id: id,
            otp: otp,
            role: role
        };
        console.log(bindParams.id);
        try {

            connection = await oracledb.getConnection(whereToConnect);
            console.log(bindParams);
            result = await connection.execute(query, bindParams, { autoCommit: true });
            console.log(result);
            return result.outBinds.output;
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
        console.log('outside of finally block', result);
        return result;
    }
    const plsql = `BEGIN :output := VALIDATE_OTP(:otp, :role, :id); END;`;
    const resQ = await runPLSQL(plsql, otp, role, id);
    console.log(resQ);
    if(resQ == 1)
    {
        const userInfo = {
            userId: id,
            userRole: 'employee',
            f2auth: 'verified'
        }
        console.log(userInfo);
        const accessToken = jwt.sign(userInfo, ACCESS_TOKEN_SECRET, {expiresIn: '36000s'});
        res.send( accessToken);
    }
    else{
        res.send('OTP not verified.');
    }
});

app.post('/getEmployeeData', async (req, res) => {
    console.log("Inside getEmployeeData post");
    const { eid } = req.body;

    const query = `SELECT E_ID,E_NAME,EMAIL,PASSWORD,PHONE_NO,TO_CHAR(JOIN_DATE,'DD-MON-YYYY') JOINDATE,ADDRESS, PHOTO FROM "INVENTORY"."EMPLOYEE" WHERE "E_ID" = :eid`;
    const bindParams = {
        eid: eid
    };
    try {
        console.log('Inside try and before query');
        const result = await runQuery(query, bindParams);
        //console.log(result);
        const columnsToExtract = ['E_ID','E_NAME', 'EMAIL','PHONE_NO','JOINDATE','ADDRESS','PHOTO'];
        const output = extractData(result, columnsToExtract);
        res.send(output);
        // console.log(output);
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: "Internal server error." });
    }
});

app.post('/login/inventory/admin', async (req, res) => {
    console.log("Inside post");
    const { email, password } = req.body;
    const query = `SELECT ID,NAME,EMAIL,PASSWORD,PHONE_NO,ADDRESS, PHOTO FROM "INVENTORY"."ADMIN" WHERE "EMAIL" = :email`;
    const bindParams = {
        email: email
    };


    try {
        console.log('Inside try and before query');
        const result = await runQuery(query, bindParams);
        //console.log(result);
        const columnsToExtract = ['ID','NAME', 'EMAIL','PASSWORD','PHONE_NO','ADDRESS','PHOTO'];
        const output = extractData(result, columnsToExtract);
        // console.log(output);
        const match = await bcrypt.compare(password, output[0].PASSWORD);
        //console.log(extractData(result,columnsToExtract));
        console.log(match);
        if (match) {
            // Login successful
            const userInfo = {
                userId: output[0].ID,
                userRole: 'admin',
                f2auth: 'pending'
            }
            console.log(userInfo);
            const accessToken = jwt.sign(userInfo, ACCESS_TOKEN_SECRET, {expiresIn: '36000s'});
            res.send({output: output, accessToken: accessToken});
            // console.log(output);
        } else {
            // Invalid credentials
            res.status(401).send("Invalid username or password.");
        }

    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: "Internal server error." });
    }
});

app.post('/sendOTPadmin', async (req, res) => {
    console.log("Inside sendOTP admin post");
    let emailId;
    const otp = otpGenerator.generate(8, { upperCase: true, specialChars: false, alphabets: true });
    const query = `SELECT EMAIL FROM "INVENTORY"."ADMIN" WHERE "ID" = :id`;
    const bindParams = {
        id: req.body.id
    };
    console.log(req.body.id);
    try{
        const result = await runQuery(query, bindParams);
        console.log(result);
        const columnsToExtract = ['ID'];
        const output = extractData(result, columnsToExtract);
        console.log(output);
        emailId = result.rows[0][0];
        console.log(emailId);
        const emailBody = `<p>Dear admin,</p><p>As per your request to login into INVENTORY MANAGEMENT SYSTEM, we're sending you an OTP.</p><br/> <p>Your OTP is <b>${otp}</b>.</p><p>This OTP is valid for 5 minutes. Please don't share this OTP with anyone.</p><p>Regards,<br/>Inventory Management System</p>`;
        const mail = mailOptions(emailId, 'OTP for Login as Admin', emailBody);
        console.log('email created', mail);
        await transporter.sendMail(mail, (error, info) => {
            if (error) {
                console.error('Error sending email: ', error);
            } else {
                console.log('Email sent: to ',emailId, info.response);
            }
        });
        const insertQuery = `INSERT INTO "INVENTORY"."OTP_VERIFY"("USER_ID","OTP","GENERATED_ON","USER_ROLE") VALUES(:id,:otp,SYSDATE, 'admin')`;
        const bindParams2 = {
            id: req.body.id,
            otp: otp
        }
        const result2 = await runQuery(insertQuery, bindParams2);
        res.send('OTP sent successfully.');
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: "Internal server error." });
    }
});

app.post('/verifyOTPadmin', async (req, res) => {
    console.log("Inside verifyOTP admin post");
    const { otp, role, id } = req.body;
    async function runPLSQL(query, otp, role, id) {
        let connection;
        let result;
        const bindParams = {
            output: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
            id: id,
            otp: otp,
            role: role
        };
        console.log(bindParams.id);
        try {

            connection = await oracledb.getConnection(whereToConnect);
            console.log(bindParams);
            result = await connection.execute(query, bindParams, { autoCommit: true });
            console.log(result);
            return result.outBinds.output;
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
        console.log('outside of finally block', result);
        return result;
    }
    const plsql = `BEGIN :output := VALIDATE_OTP(:otp, :role, :id); END;`;
    const resQ = await runPLSQL(plsql, otp, role, id);
    console.log(resQ);
    if(resQ == 1)
    {
        const userInfo = {
            userId: id,
            userRole: 'admin',
            f2auth: 'verified'
        }
        console.log(userInfo);
        const accessToken = jwt.sign(userInfo, ACCESS_TOKEN_SECRET, {expiresIn: '36000s'});
        res.send( accessToken);
    }
    else{
        res.send('OTP not verified.');
    }
});

app.post('/getAdminData', async (req, res) => {
    console.log("Inside getAdminData post");
    const { id } = req.body;

    const query = `SELECT ID,NAME,EMAIL,PASSWORD,PHONE_NO,ADDRESS, PHOTO FROM "INVENTORY"."ADMIN" WHERE "ID" = :id`;
    const bindParams = {
        id: id
    };
    try {
        console.log('Inside try and before query');
        const result = await runQuery(query, bindParams);
        //console.log(result);
        const columnsToExtract = ['ID','NAME', 'EMAIL','PHONE_NO','ADDRESS','PHOTO'];
        const output = extractData(result, columnsToExtract);
        res.send(output);
        // console.log(output);
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: "Internal server error." });
    }
});


app.get('/categories', (req, res) => {
    // console.log(req);
    const categories = ['Electronics', 'Clothing', 'Groceries'];
  res.json(categories);
});



app.get('/rootCategories', async (req, res) => {
  try {
      // console.log(req);
      const query = 'SELECT DISTINCT("TYPE") FROM "INVENTORY"."PRODUCT"';  // Assuming RootCategories is the name of your table
      const queryData = await runQuery(query, []);
      const output = extractData(queryData, ['TYPE']);
      res.json(output);
  } catch (error) {
      console.error('Error fetching categories:', error);
      res.status(500).json({ error: 'Error fetching categories' });
  }
});

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
        // console.log(output);
        res.json(output);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ error: 'Error fetching categories' });
    }
});

app.post('/AddProduct',async (req, res) => {

  const {
    // productImage,
      imageurl,
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
    s_id
  } = req.body;
    console.log(req.body.status);
    // console.log(req.body);
    console.log(req.body.productName + " " + req.body.productSize + " " + req.body.productWeight + " " + req.body.productQuantity + " " + req.body.productPrice + " " + req.body.productDiscount + " " + req.body.productTemp + " " + req.body.productDescription + " " + req.body.selectedRootCategory + " " + req.body.educationalLevel + " " + req.body.fashionMadeOf + " " + req.body.fashionSize + " " + req.body.fashionColor + " " + req.body.productionDate + " " + req.body.ExpiaryDate + " " + req.body.IT_ram + " " + req.body.IT_storage + " " + req.body.IT_processor + " " + req.body.Toy_color + " " + req.body.Toy_level+req.body.imageurl);
    console.log(productName, imageurl);

  const queryToExtractProductID = `SELECT NVL(P_ID,0) FROM "INVENTORY"."PRODUCT" WHERE P_NAME = :pName`;

 const bindParams = {
    pName: productName
};

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
      s_id: s_id,
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
  s_id: s_id,
  pID: pID,
  psize: productSize,
  pWeight: productWeight,
  prefTemp: productTemp,
  quantity: productQuantity,
  invoiceNo: invoiceNo
}
const result5 = await runQuery(queryToInsertInSupplies,bindParams2);

  const insertIntoProduct = `INSERT INTO "INVENTORY"."PRODUCT"("P_ID","P_NAME","PRICE","DISCOUNT","DESCRIPTION","TYPE","REMAINING_ITEM","SOLD_QUANTITY","PICTURE") VALUES(:pID,:pName,:price,:discount,:description,:type,:quantity,0,:productImage)`;
  const bindParams3 = {
    pID: pID,
    pName: productName,
    price: productPrice,
    discount: productDiscount,
    description: productDescription,
    type: selectedRootCategory,
    quantity: productQuantity,
    productImage: imageurl
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
    res.send('Product Added');
}
else if(selectedRootCategory === 'EDUCATIONAL'){
      const insertIntoEducational = `INSERT INTO "INVENTORY"."EDUCATIONAL"("P_ID","LEVEL") VALUES(:pID,:elevel)`;
      const bindParams5 = {
        pID: pID,
        elevel: educationalLevel
    }
    const result8 = await runQuery(insertIntoEducational,bindParams5);
    res.send('Product Added');
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
    res.send('Product Added');
}
else if(selectedRootCategory === 'TOY'){
  const insertIntoToys = `INSERT INTO "INVENTORY"."TOY"("P_ID","COLOR","LEVEL") VALUES(:pID,:tcolor,:tlevel)`;
  const bindParams7 = {
    pID: pID,
    tcolor: Toy_color,
    tlevel: Toy_level
}
const result10 = await runQuery(insertIntoToys,bindParams7);
    res.send('Product Added');
}
else if(selectedRootCategory === 'GROCERIES'){
  const insertIntoGroceries = `INSERT INTO "INVENTORY"."GROCERIES"("P_ID","PRODUCTION_DATE","EXPIARY_DATE") VALUES(:pID,:prodDate,:expDate)`;
  const bindParams8 = {
    pID: pID,
    prodDate: productionDate,
    expDate: ExpiaryDate
}
const result11 = await runQuery(insertIntoGroceries,bindParams8);
    res.send('Product Added');
}
else{
  console.log("No matching product found.");
}
}
});

app.use('/auth', authRoute);

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