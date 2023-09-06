import React, {useContext, useEffect} from "react";
import { useLocation } from "react-router-dom";
import supplierIdContext from "../Context/supplierContext";
import { useRoutes, useNavigate } from 'react-router-dom';
import axios from "axios";

export default function ProfileOfSupplierComponents() {
    // console.log(localStorage.getItem("token"));
    const location = useLocation();
    const navigate = useNavigate();
    const accessToken = localStorage.getItem("token");

    useEffect(() => {
        async function checkLoginStatus() {
            try {
                const authRes = await axios.get('http://localhost:8000/auth', {headers: {Authorization: `${localStorage.getItem('token')}`}});
            } catch (e) {
                console.log(e);
            }
        }
        checkLoginStatus().then(res => {
            console.log('Checked login status.');
        }).catch(e => {
            console.log(e);
        });
    });

    const userData = location.state && location.state.userData; // Check for undefined
    const {status, changeId} = useContext(supplierIdContext)
    if (!accessToken) {
        return (
            <div align="center" className="error">
                <h2>Access Denied!</h2>
                <p>Go back to
                    <a href="/loginAsSupplier"> Login page.</a></p>
            </div>
        );
    }

    function handleLogOut() {
        localStorage.removeItem("token");
        navigate('/loginAsSupplier');
    }

    return (
        <div className="dashboard" style={{height: 'calc(100vh - 64px)', overflowY: 'auto'}}>
            <h2 align="center"> Welcome to the Dashboard </h2>
            {userData ? (
                <div>
                    <div align="right" className="Logout">
                        <button className="button" onClick={handleLogOut}>Log Out</button>
                    </div>
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