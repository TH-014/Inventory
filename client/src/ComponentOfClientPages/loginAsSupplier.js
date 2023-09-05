import React, { useState, useContext } from "react";
import axios from "axios";
import { useRoutes, useNavigate } from 'react-router-dom';
import "./loginAsSupplier.css";
import supplierIdContext from "../Context/supplierContext";


 function  LoginAsSupplierComponents(){
  //const {status,changeId} = useContext(supplierIdContext)
    console.log('Inside the function');
    //const [user,setUser]=useState('');
    const [email,setEmail]=useState('');
    const [password,setPassword]=useState('');

    const navigate = useNavigate();
    const [errorMessage,setErrorMessage]=useState('');
    const {status,changeId}=useContext(supplierIdContext)

    //const [data, setData]=useState('');

    const handleLoginAsSupplier = async (e) =>{
        e.preventDefault();

        

       // setUser('JBL Flip 5');
       // console.log(user);
       try{
          const resFromServer = await axios.post('http://localhost:8000/loginAsSupplier', {
            email,
            password
          });
          console.log('here am i \n');
          console.log(resFromServer.data.accessToken);
          console.log(resFromServer.data.output[0]);
          if(localStorage.getItem("token"))
              localStorage.removeItem("token");
          localStorage.setItem("token", resFromServer.data.accessToken);
          if(resFromServer.status === 200){
            const userData = resFromServer.data.output[0];           ///////////////////////// upto here it is working fine .......
            //console.log(userData.S_ID);
            navigate('/ProfileOfSupplier',{ state : {userData}});
          }
          else {
            setErrorMessage(resFromServer.data.message || "Login failed!");
          }
        }catch(error)
        {
           setErrorMessage(error.message || "Something went wrong ! ");
        }
         // setData(resFromServer);
         // console.log(resFromServer);
    };

    return (

    <div className="clear-content-wrapper">
      <div className="container">
        <div className="login-form">
          {errorMessage && <div className="error-message">{errorMessage}</div>}
          <h2>Login</h2>
          <form onSubmit={handleLoginAsSupplier}>
          <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            <input
              type="password"
              id="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit">Login</button>
            <p className="signup">
              Don't have an account?<br/>{" "}
              <a href="/RegisterAsSupplier" className="signup-link">
                Create a New Account
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};
export default LoginAsSupplierComponents;


