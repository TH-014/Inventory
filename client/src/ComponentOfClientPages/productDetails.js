import React from "react";
import { useLocation } from "react-router-dom";

export default function ProductDetails() {
  const location = useLocation();
  const productDetailsData = location.state && location.state.productData; // Check for undefined

  return (
    <div className="product-details" align = "center">
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
    </div>
  );
};