import React, {useContext, useEffect} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import axios from "axios";
import styled from "styled-components";

let callAuth = false;
let accessGranted = false;

export default function ProfileOfAdminComponents() {
  const [userData, setUserData] = React.useState(null); // [state, function to update state]
  const location = useLocation();
  const navigate = useNavigate();
  const accessToken = localStorage.getItem("atoken");
  // const userData = location.state && location.state.userData; // Check for undefined

  const ButtonWrapper = styled.div`
    display: flex;
    justify-content: space-between;
  `;

  const HomeButton = styled.button`
  background-color: #3498db;
  color: #fff;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
    width: 140px;
  cursor: pointer;
  font-size: 16px;
  margin: 10px;
    float: left;
  &:hover {
    background-color: #2965b9;
  }
`;

  const LogoutButton = styled.button`
  background-color: #ff0000;
  color: #fff;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
    width: 140px;
  cursor: pointer;
  font-size: 16px;
  margin: 10px;
  float : right;
  &:hover {
    background-color: #8B0000;
  }
`;

  useEffect(() => {
    if(callAuth)
      return;
    console.log('Inside useEffect of profile of admin.');
    async function checkLoginStatus() {
      try {
        const authRes = await axios.get('http://localhost:8000/auth/admin', {headers: {Authorization: `${localStorage.getItem('atoken')}`}});
        callAuth = true;
        return authRes;
      } catch (e) {
        console.log(e);
      }
    }
    async function getAdminData(id) {
      try {
        console.log('id = ',id);
        const resFromServer = await axios.post('http://localhost:8000/getAdminData', {id});
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
        getAdminData(res.data.id).then(r => {
          setUserData(r[0]);
          console.log('Got admin data.');
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
            <a href="/loginAsAdmin"> Login page.</a></p>
        </div>
    );
  }

  function handleLogOut() {
    callAuth = false;
    accessGranted = false;
    localStorage.removeItem("atoken");
    navigate('/');
  }

  function handleHome() {
    callAuth = false;
    accessGranted = false;
    navigate('/');
  }

  return (
      <div className="dashboard" style={{height: 'calc(100vh - 64px)', overflowY: 'auto'}}>
      <h2 align="center">   Welcome to the Dashboard       </h2>
      {userData ? (
          <div>
            <ButtonWrapper>
              <HomeButton onClick={handleHome}>Back to Home</HomeButton>
              <LogoutButton onClick={handleLogOut}>Log Out</LogoutButton>
            </ButtonWrapper>
            <div align="center" className="user-data">
                <img src={userData.PHOTO} alt="Avatar" className="avatar" width="300" height="300"/>
                <p>Admin ID : {userData.ID}</p>
                <p>Admin Name : {userData.NAME}</p>
                <p>Email: {userData.EMAIL}</p>
                <p>Phone no : {userData.PHONE_NO}</p>
                {/*<p>Joining Date : {userData.JOINDATE}</p>*/}
                <p>Address: {userData.ADDRESS}</p>
            </div>
          </div>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  );
};