import React, { useState} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./RegistrationPageOfSupplier.css";
import {
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { storage } from "../firebaseConfig";
import { v4 } from "uuid";

let imageurl = "default";

export default function RegistrationPageOfSupplierComponents() {

  const [imageUpload, setImageUpload] = useState(null);
  const [imageError, setImageError] = useState("");
  const [supplierName, setSupplierName] = useState("");
  const [supplierAddress, setSupplierAddress] = useState("");
  //const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [password, setPassword] = useState("");
  
  
  //const [locationID, setLocationID] = useState(null);
  const [emailError, setEmailError] = useState("");
  const [phoneNoError, setPhoneNoError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();

  ref(storage, "supplier/");
  const uploadFile = () => {
    // if (imageUpload == null) return;
    return new Promise((resolve, reject) => {
      const imageRef = ref(storage, `supplier/${imageUpload.name + v4()}`);
      uploadBytes(imageRef, imageUpload).then((snapshot) => {
        getDownloadURL(snapshot.ref).then((url) => {
          console.log(url); // this is the url of the uploaded image
          // setProductImage(url);
          imageurl = url;
          console.log(typeof url);
          console.log('this is the url string', imageurl);
          resolve(url);
        }).catch((err) => {
          imageurl = "error";
          reject("Error while getting download url:", err);
        });
      });
    });
  };

  const validateSupplierName = async (value) => {
    setSupplierName(value);
  };
  const validateEmail = async (value) => {
    setEmail(value);
    if(value.indexOf("@")===-1|| value.indexOf(".com")===-1)
    {
       setEmailError("Your Email must contain @ and . ");
    }
    else{
        setEmailError("");
    }
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

  const validateAddress = value => {
    setSupplierAddress(value);
  };

  const validateImage = (value) => {
    if (imageUpload == null) {
      setImageError("You must upload an image.");
    } else {
      setImageError("");
    }
  };

  const handleRegistrationOfSupplier = async (e) => {
    e.preventDefault();

    if (/*usernameError ||*/ emailError || passwordError ||phoneNoError || imageError) return;
    //console.log('Location ID:', locationID);
    const req_url = await uploadFile();
    // console.log(req_url);
    console.log('Sending request to add product', imageurl);
    try {
      const response = await axios.post("http://localhost:8000/RegisterAsSupplier", {
        supplierName,
        email,
        phoneNo,
        password,
        imageurl,
        supplierAddress
      });
      console.log("hello1");
      if (response.status === 200) {
        const userData = response.data[0];
        console.log("hello");
        navigate("/loginAsSupplier");
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
          <form onSubmit={handleRegistrationOfSupplier}>
            <input
             className="form-control"
              type="text"
              placeholder="Customer Name"
              value={supplierName}
              onChange={(e) => validateSupplierName(e.target.value)}
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
            <input
                className="form-control"
                type="text"
                placeholder="Address"
                value={supplierAddress}
                onChange={(e) => validateAddress(e.target.value)}
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
            <input
                type="file"
                onChange={(event) => {
                  setImageUpload(event.target.files[0]);
                }}
            />
            <button type="submit">Register</button>
          </form>
        </div>
      </div>
    </div>
  );
};


