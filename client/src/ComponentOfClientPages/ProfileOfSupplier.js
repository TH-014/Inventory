import React, {useContext, useEffect} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import supplierIdContext from "../Context/supplierContext";
import axios from "axios";
import styled from "styled-components";

let callAuth = false;
let accessGranted = false;

export default function ProfileOfSupplierComponents() {
    // console.log(localStorage.getItem("token"));
    const [userData, setUserData] = React.useState(null); // [state, function to update state]
    const location = useLocation();
    const navigate = useNavigate();
    const accessToken = localStorage.getItem("token");

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
    background-color: #2980b9;
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
        console.log('Inside useEffect of profile of supplier.');
        async function checkLoginStatus() {
            try {
                const authRes = await axios.get('http://localhost:8000/auth/supplier', {headers: {Authorization: `${localStorage.getItem('token')}`}});
                callAuth = true;
                return authRes;
            } catch (e) {
                console.log(e);
            }
        }
        async function getSupplierData(sid) {
            try {
                console.log('sid = ',sid);
                const resFromServer = await axios.post('http://localhost:8000/getSupplierData', {sid});
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
                getSupplierData(res.data.id).then(r => {
                    setUserData(r[0]);
                    console.log('Got supplier data.');
                    console.log(r);
                });
            }
        });
    });

    // const userData = location.state && location.state.userData; // Check for undefined
    const {status, changeId} = useContext(supplierIdContext)
    if (!accessGranted) {
        return (
            <div align="center" className="error">
                <h2>Access Denied!</h2><hr/>
                <p>Go back to
                    <a href="/loginAsSupplier"> Login page.</a></p>
            </div>
        );
    }

    function handleLogOut() {
        callAuth = false;
        accessGranted = false;
        localStorage.removeItem("token");
        navigate('/');
    }

    function handleHome() {
        callAuth = false;
        accessGranted = false;
        navigate('/');
    }

    return (
        <div className="dashboard" style={{height: 'calc(100vh - 64px)', overflowY: 'auto'}}>
            <h2 align="center"> Welcome to the Dashboard </h2>
            {userData ? (
                <div>
                    <ButtonWrapper>
                        <HomeButton onClick={handleHome}>Back to Home</HomeButton>
                        <LogoutButton onClick={handleLogOut}>Log Out</LogoutButton>
                    </ButtonWrapper>
                    <div align="center" className="user-data">
                        <img src={userData.PHOTO} alt="Avatar" className="avatar" width="300" height="400"/>
                        <p>Supplier ID : {userData.SID}</p>
                        <p>Supplier Name : {userData.S_NAME}</p>
                        <p>Email: {userData.EMAIL}</p>
                        <p>Phone no : {userData.PHONE_NO}</p>
                        <p>Due : {userData.TOTDUE}</p>
                        <a href="/AddProduct" className="addProduct-link">
                            Add product ?
                        </a>
                    </div>
                </div>
            ) : (
                <p>Loading user data...</p>
            )}
        </div>
    );
};