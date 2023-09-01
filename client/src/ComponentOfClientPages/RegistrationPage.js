import React, { useState} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./RegistrationPage.css";

export default function ReturnRegistrationComponents() {

  const [customerName, setCustomerName] = useState("");
  //const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [password, setPassword] = useState("");
  
  
  //const [locationID, setLocationID] = useState(null);
  const [emailError, setEmailError] = useState("");
  const [phoneNoError, setPhoneNoError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();


  const validateCustomerName = async (value) => {
    setCustomerName(value);
  };
  const validateEmail = async (value) => {
    setEmail(value);
  };
  const validatePhoneNo = (value) => {
    setPhoneNo(value);
    if (value.length  !==  11) {
      setPhoneNoError("PhoneNum must be 11 characters long.");
    } else {
      setPhoneNoError("");
    }
  };

  const validatePassword = (value) => {
    setPassword(value);
    if (value.length < 8) {
      setPasswordError("Password must be at least 8 characters long.");
    } else {
      setPasswordError("");
    }
  };

  const handleRegistration = async (e) => {
    e.preventDefault();

    if (/*usernameError ||*/ emailError || passwordError ||phoneNoError) return;
    //console.log('Location ID:', locationID);
    try {
      const response = await axios.post("http://localhost:8000/Register", {
        customerName,
        email,
        phoneNo,
        password
       
      });
      console.log("hello1");
      if (response.status === 200) {
        const userData = response.data[0];
        console.log("hello");
        navigate("/login");
      }
      console.log("hello2");
    } catch (error) {
      console.error("Error during signup:", error);
    }
  };

  return (
    <div className="clear-content-wrapper">
      <div className="container">
        <div className="signup-container">
          <h2>Register</h2>
          <form onSubmit={handleRegistration}>
            <input
             className="form-control"
              type="text"
              placeholder="Customer Name"
              value={customerName}
              onChange={(e) => validateCustomerName(e.target.value)}
            />

            <input
             className="form-control"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => validateEmail(e.target.value)}
            />
            {emailError && <div className="error-message">{emailError}</div>}
            <input
             className="form-control"
              type="text"
              placeholder="Phone no"
              value={phoneNo}
              onChange={(e) => validatePhoneNo(e.target.value)}
            />
            {phoneNoError && <div className="error-message">{phoneNoError}</div>}
            <input
             className="form-control"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => validatePassword(e.target.value)}
            />
            {passwordError && (
              <div className="error-message">{passwordError}</div>
            )}
            {/* <div className="location">
              <LocationSelector onLocationChange={setLocationID} />
            </div> */}
            <button type="submit">Register</button>
          </form>
        </div>
      </div>
    </div>
  );
};


