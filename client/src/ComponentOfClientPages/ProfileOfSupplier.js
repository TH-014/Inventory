import React, { useContext } from "react";
import { useLocation } from "react-router-dom";
import supplierIdContext from "../Context/supplierContext";

export default function ProfileOfSupplierComponents() {
  const location = useLocation();
  const userData = location.state && location.state.userData; // Check for undefined
  const {status,changeId}=useContext(supplierIdContext)

  return (
    <div align="center" className="dashboard">
      <h2>   Welcome to the Dashboard       </h2>
      {userData ? (
        <div className="user-data" style={{ height: 'calc(100vh - 64px)', overflowY: 'auto' }}>
          <img src={userData.PHOTO} alt="Avatar" className="avatar" width="300" height="400"/>
          <p>{status}</p>
          <p>Supplier ID : {userData.SID}</p>
          <p>Supplier Name : {userData.S_NAME}</p>
          <p>Email: {userData.EMAIL}</p>
          <p>Phone no : {userData.PHONE_NO}</p>
          <p>Due : {userData.TOTDUE}</p>
          <a href="/AddProduct" className="addProduct-link">
                Add product ?
              </a>
        </div>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  );
};