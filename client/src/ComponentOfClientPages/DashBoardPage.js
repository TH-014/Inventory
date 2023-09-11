import React from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { useRoutes, useNavigate } from 'react-router-dom';

export default function ReturnDashBoardComponents() {
  const navigate = useNavigate();
  const location = useLocation();
  const userData = location.state && location.state.userData; // Check for undefined

  const handleMyWishList = async () => {
    
    console.log('inside handleMyWishList');
    try{
      const C_ID1 = 2;//userData.C_ID;
      const resFromServer = await axios.post('http://localhost:8000/myWishList',{C_ID1});
      console.log(resFromServer);
      const wishedProductData = resFromServer.data;
      
      navigate('/myWishList',{ state : {wishedProductData}});
    }
    catch(err){
      console.error("Error during signup:", err);
    }

  }

  return (
    <div className="dashboard">
      <h2>   Welcome to the Dashboard                                        </h2>
      {userData ? (
        <div className="user-data">
          <p>Customer ID : {userData.C_ID}</p>
          <p>Customer Name : {userData.C_NAME}</p>
          <p>Email: {userData.EMAIL}</p>
          <p>Phone no : {userData.PHONE_NO}</p>
          <button onclick ={handleMyWishList}>
          My WishList
          </button>
        </div>
      ) : (
        <div>
        <p>Loading user data...</p>
       
        </div>
      )}
       <button onClick ={handleMyWishList}>
         My WishList
        </button>
    </div>
  );
};

