// import React from "react";
// import { useLocation } from "react-router-dom";
//
// export default function ProductDetails() {
//     const location = useLocation();
//     const productDetailsData = location.state && location.state.productData; // Check for undefined
//
//     return (
//         <div className="product-details" align = "center">
//             <h2>   Product Details   </h2>
//             {productDetailsData ? (
//                 <div className="product-data">
//                     <img src={productDetailsData.PICTURE} alt="" width="300" height="400"></img>
//                     <p> {productDetailsData.P_NAME}</p>
//                     <p> Price : $ {productDetailsData.PRICE}</p>
//                     {productDetailsData.DESCRIPTION?<p>Description: {productDetailsData.DESCRIPTION}</p>:null}
//                     <p>Category : {productDetailsData.TYPE}</p>
//                     <p>Remaining item : {productDetailsData.REMAINING_ITEM}</p>
//                     <p>Sold Quantity : {productDetailsData.SOLD_QUANTITY}</p>
//                     <p>Rating : {productDetailsData.RATING}</p><hr/>
//                 </div>
//             ) : (
//                 <p>Loading product data...</p>
//             )}
//         </div>
//     );
// };

import React from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

export default function ProductDetails() {
    const navigate = useNavigate();
    const location = useLocation();
    const productDetailsData = location.state && location.state.productData; // Check for undefined
    //console.log(productDetailsData);
    const handleShowReviews = async () => {
        console.log('inside handleShowReviews');
        try{
            const P_ID = productDetailsData.P_ID;
            const resFromServer = await axios.post('http://localhost:8000/showReviews',{P_ID});
            console.log(resFromServer);

            // let customerID = [];
            const reviewData = resFromServer.data.rows;
            // for(let i=0;i<reviewData.length;i++){
            //   console.log(reviewData[i]);
            //   customerID[i] = reviewData[i][0];
            //   console.log(customerID[i]);
            // }
            console.log(reviewData);

            navigate('/showReviews',{ state : {reviewData}});
        }
        catch(err){
            console.error("Error during signup:", err);
        }
    }



    return (
        <div className="product-details" align = "center" style={{height: 'calc(100vh - 64px)', overflowY: 'auto'}}>
            <h2>   Product Details   </h2>
            {productDetailsData ? (
                <div className="product-data">
                    <img src={productDetailsData.PICTURE} alt="" width="300" height="400"></img>
                    <p> {productDetailsData.P_NAME}</p>
                    <p> Price : $ {productDetailsData.PRICE}</p>
                    {productDetailsData.DESCRIPTION?<p>Description: {productDetailsData.DESCRIPTION}</p>:null}
                    <p>Category : {productDetailsData.TYPE}</p>
                    <p>Remaining item : {productDetailsData.REMAINING_ITEM}</p>
                    <p>Sold Quantity : {productDetailsData.SOLD_QUANTITY}</p>
                    <p>Rating : {productDetailsData.RATING}</p>

                </div>
            ) : (
                <p>Loading product data...</p>
            )}
            <button onClick = {handleShowReviews}>Show Reviews</button>
        </div>
    );
};