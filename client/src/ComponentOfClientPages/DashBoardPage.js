import React, {useContext, useEffect} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import axios from "axios";
import supplierIdContext from "../Context/supplierContext";

let callAuth = false;
let accessGranted = false;

export default function ReturnDashBoardComponents() {
  const [userData, setUserData] = React.useState(null); // [state, function to update state]
  const location = useLocation();
  const navigate = useNavigate();
  // const userData = location.state && location.state.userData; // Check for undefined
  const accessToken = localStorage.getItem("token");


  useEffect(() => {
    if(callAuth)
      return;
    console.log('Inside useEffect of profile of customer.');
    async function checkLoginStatus() {
      try {
        const authRes = await axios.get('http://localhost:8000/auth/customer', {headers: {Authorization: `${localStorage.getItem('token')}`}});
        callAuth = true;
        return authRes;
      } catch (e) {
        console.log(e);
      }
    }
    async function getCustomerData(cid) {
      try {
        console.log('cid = ',cid);
        const resFromServer = await axios.post('http://localhost:8000/getCustomerData', {cid});
        console.log(resFromServer);
        if (resFromServer.status === 200) {
          return resFromServer.data;
        }
      } catch (e) {
        console.log(e);
      }
    }
    checkLoginStatus().then(res => {
      console.log('Checked login status.');
      if(res.status === 200 && res.data.auth === true && res.data.id>0)
      {
        accessGranted = true;
        console.log('Authorized.', res.data.id);
        getCustomerData(res.data.id).then(r => {
          setUserData(r[0]);
          console.log('Got customer data.');
          console.log(r);
        });
      }
    });
  });

  if (!accessGranted) {
    return (
        <div align="center" className="error">
          <h2>Access Denied!</h2><hr/>
          <p>Go back to
            <a href="/login"> Login page.</a></p>
        </div>
    );
  }

  function handleLogOut() {
    callAuth = false;
    accessGranted = false;
    localStorage.removeItem("token");
    navigate('/');
  }

  return (
      <div className="dashboard" style={{ height: 'calc(100vh - 64px)', overflowY: 'auto' }}>
      <h2 align="center">   Welcome to the Dashboard  </h2>
      {userData ? (
          <div>
            <div align="right" className="Logout">
              <button className="button" onClick={handleLogOut}>Log Out</button>
            </div>
            <div align="center" className="user-data">
              <img src={userData.PHOTO} alt="Avatar" className="avatar" width="300" height="400"/>
              <p>Customer ID : {userData.C_ID}</p>
              <p>Customer Name : {userData.C_NAME}</p>
              <p>Email: {userData.EMAIL}</p>
              <p>Phone no : {userData.PHONE_NO}</p>
              <p>Address : {userData.ADDRESS}</p>
            </div>
          </div>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  );
};

