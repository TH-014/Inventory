import React from "react";
import { useLocation } from "react-router-dom";

export default function ReturnDashBoardComponents() {
  const location = useLocation();
  const userData = location.state && location.state.userData; // Check for undefined

  return (
      <div align="center" className="dashboard">
      <h2>   Welcome to the Dashboard  </h2>
      {userData ? (
          <div className="user-data" style={{ height: 'calc(100vh - 64px)', overflowY: 'auto' }}>
            <img src={userData.PHOTO} alt="Avatar" className="avatar" width="300" height="400"/>
          <p>Customer ID : {userData.C_ID}</p>
          <p>Customer Name : {userData.C_NAME}</p>
          <p>Email: {userData.EMAIL}</p>
          <p>Phone no : {userData.PHONE_NO}</p>
            <p>Address : {userData.ADDRESS}</p>
        </div>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  );
};

