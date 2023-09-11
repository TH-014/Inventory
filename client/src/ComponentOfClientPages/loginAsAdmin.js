import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useRoutes, useNavigate } from 'react-router-dom';
import "./loginAsAdmin.css";


 function  LoginAsAdminComponents(){
     let callAuth = false;
    console.log('Inside the function');
    const [email,setEmail]=useState('');
    const [password,setPassword]=useState('');

    const navigate = useNavigate();
    const [errorMessage,setErrorMessage]=useState('');

     useEffect(() => {
         if(callAuth)
             return;
         console.log('Inside useEffect of login of employee.');
         async function checkLoginStatus() {
             try {
                 const authRes = await axios.get('http://localhost:8000/auth/admin', {headers: {Authorization: `${localStorage.getItem('atoken')}`}});
                 callAuth = true;
                 return authRes;
             } catch (e) {
                 console.log(e);
             }
         }
         checkLoginStatus().then(res => {
             console.log('Checked login status.');
             if(res.status === 200 && res.data.auth === true && res.data.id>0)
             {
                 callAuth = false;
                 console.log('Authorized.', res.data.id);
                 navigate('/otp_validate_admin');
             }
         });
     });

    const handleLoginAsAdmin = async (e) =>{
        e.preventDefault();

       try{
          const resFromServer = await axios.post('http://localhost:8000/login/inventory/admin', {
            email,
            password
          });
          console.log('here am i \n');
           if(localStorage.getItem("atoken"))
               localStorage.removeItem("atoken");
           localStorage.setItem("atoken", resFromServer.data.accessToken);
           // console.log(resFromServer.data);
          if(resFromServer.status === 200){
              const userData = resFromServer.data.output[0];
              try {
                  // console.log('printing from login_as_empoloyee',userData);
                  const resFromServer = await axios.post('http://localhost:8000/sendOTPadmin', {
                      id: userData.ID
                  });
                  console.log('navigating now to otp_validate');
                  navigate('/otp_validate_admin');
              } catch (error) {
                  console.log(error.message || "Something went wrong ! ");
              }
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
          <form onSubmit={handleLoginAsAdmin}>
          {/* <input
                    type="user"
                    placeholder="Username"
                    value={user}
                    onChange={(e) => setUser(e.target.value)}
                /> */}
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
            {/*<p className="signup">*/}
            {/*  Don't have an account?<br/>{" "}*/}
            {/*  <a href="/RegisterAsEmployee" className="signup-link">*/}
            {/*    Create a New Account*/}
            {/*  </a>*/}
            {/*</p>*/}
          </form>
        </div>
      </div>
    </div>
  );
};
export default LoginAsAdminComponents;


