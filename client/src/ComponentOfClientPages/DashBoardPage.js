import React from "react";
import { useLocation } from "react-router-dom";

export default function ReturnDashBoardComponents() {
  const location = useLocation();
  const userData = location.state && location.state.userData; // Check for undefined

  return (
    <div className="dashboard">
      <h2>   Welcome to the Dashboard                                        </h2>
      {userData ? (
        <div className="user-data">
          <p>Customer ID : {userData.C_ID}</p>
          <p>Customer Name : {userData.C_NAME}</p>
          <p>Email: {userData.EMAIL}</p>
          <p>Phone no : {userData.PHONE_NO}</p>
        </div>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  );
};

