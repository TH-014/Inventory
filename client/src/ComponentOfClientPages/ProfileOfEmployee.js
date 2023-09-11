import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";


export default function ProfileOfEmployeeComponents() {
  const location = useLocation();
  const userData = location.state && location.state.userData; // Check for undefined
  const navigate = useNavigate();
  let E_ID = 2; /// You know it here 

  const handlePlacedOrderButtonClick = async (e) => {
    e.preventDefault();
     
    
   
    //console.log('Location ID:', locationID);
    try {
      const response = await axios.post("http://localhost:8000/PlacedOrder", {
        E_ID});
      
     
      if (response.status === 200) {
        const orderData = response.data.rows;
        console.log(response.data.rows);
        navigate("/Table",{ state : {orderData}});
      }
      console.log("hello2");
    } catch (error) {
      console.error("Error during signup:", error);
    }
  };

  return (
    <div className="dashboard">
      <h2>   Welcome to the Dashboard       </h2>
      {userData ? (
        <div className="user-data">
          <p>Employee ID : {userData.E_ID}</p>
          <p>Employee Name : {userData.E_NAME}</p>
          <p>Email: {userData.EMAIL}</p>
          <p>Phone no : {userData.PHONE_NO}</p>
          <p>Joining Date : {userData.JOINDATE}</p>
          <p>Address: {userData.ADDRESS}</p>
          
        </div>
      ) : (<div>
        <p>Loading user data...</p>
        <button onClick={handlePlacedOrderButtonClick}>Placed Orders...</button>
      </div>)}
    </div>
  );
};



// import React, {useContext, useEffect} from "react";
// import {useLocation, useNavigate} from "react-router-dom";
// import axios from "axios";
// import styled from "styled-components";

// let callAuth = false;
// let accessGranted = false;

// export default function ProfileOfEmployeeComponents() {
//   const [userData, setUserData] = React.useState(null); // [state, function to update state]
//   const location = useLocation();
//   const navigate = useNavigate();
//   const accessToken = localStorage.getItem("token");
//   // const userData = location.state && location.state.userData; // Check for undefined

//   const ButtonWrapper = styled.div`
//     display: flex;
//     justify-content: space-between;
//   `;

//   const HomeButton = styled.button`
//   background-color: #3498db;
//   color: #fff;
//   padding: 10px 15px;
//   border: none;
//   border-radius: 5px;
//     width: 140px;
//   cursor: pointer;
//   font-size: 16px;
//   margin: 10px;
//     float: left;
//   &:hover {
//     background-color: #2965b9;
//   }
// `;

//   const LogoutButton = styled.button`
//   background-color: #ff0000;
//   color: #fff;
//   padding: 10px 15px;
//   border: none;
//   border-radius: 5px;
//     width: 140px;
//   cursor: pointer;
//   font-size: 16px;
//   margin: 10px;
//   float : right;
//   &:hover {
//     background-color: #8B0000;
//   }
// `;

//   useEffect(() => {
//     if(callAuth)
//       return;
//     console.log('Inside useEffect of profile of employee.');
//     async function checkLoginStatus() {
//       try {
//         const authRes = await axios.get('http://localhost:8000/auth/employee', {headers: {Authorization: `${localStorage.getItem('token')}`}});
//         callAuth = true;
//         return authRes;
//       } catch (e) {
//         console.log(e);
//       }
//     }
//     async function getEmployeeData(eid) {
//       try {
//         console.log('eid = ',eid);
//         const resFromServer = await axios.post('http://localhost:8000/getEmployeeData', {eid});
//         console.log(resFromServer);
//         if (resFromServer.status === 200) {
//           return resFromServer.data;
//         }
//       } catch (e) {
//         console.log(e);
//       }
//     }
//     checkLoginStatus().then(res => {
//       console.log('Checked login status.');
//       if(res.status === 200 && res.data.auth === true && res.data.id>0)
//       {
//         accessGranted = true;
//         console.log('Authorized.', res.data.id);
//         getEmployeeData(res.data.id).then(r => {
//           setUserData(r[0]);
//           console.log('Got employee data.');
//           console.log(r);
//         });
//       }
//     });
//   });

//   if (!accessGranted) {
//     return (
//         <div align="center" className="error">
//           <h2>Access Denied!</h2><hr/>
//           <p>Go back to
//             <a href="/loginAsEmployee"> Login page.</a></p>
//         </div>
//     );
//   }

//   function handleLogOut() {
//     callAuth = false;
//     accessGranted = false;
//     localStorage.removeItem("token");
//     navigate('/');
//   }

//   function handleHome() {
//     callAuth = false;
//     accessGranted = false;
//     navigate('/');
//   }

//   return (
//       <div className="dashboard" style={{height: 'calc(100vh - 64px)', overflowY: 'auto'}}>
//       <h2 align="center">   Welcome to the Dashboard       </h2>
//       {userData ? (
//           <div>
//             <ButtonWrapper>
//               <HomeButton onClick={handleHome}>Back to Home</HomeButton>
//               <LogoutButton onClick={handleLogOut}>Log Out</LogoutButton>
//             </ButtonWrapper>
//             <div align="center" className="user-data">
//                 <img src={userData.PHOTO} alt="Avatar" className="avatar" width="300" height="400"/>
//                 <p>Employee ID : {userData.E_ID}</p>
//                 <p>Employee Name : {userData.E_NAME}</p>
//                 <p>Email: {userData.EMAIL}</p>
//                 <p>Phone no : {userData.PHONE_NO}</p>
//                 <p>Joining Date : {userData.JOINDATE}</p>
//                 <p>Address: {userData.ADDRESS}</p>
//             </div>
//           </div>
//       ) : (
//         <p>Loading user data...</p>
//       )}
//     </div>
//   );
// };