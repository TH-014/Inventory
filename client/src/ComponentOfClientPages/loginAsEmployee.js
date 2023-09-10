import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useRoutes, useNavigate } from 'react-router-dom';
import "./loginAsEmployee.css";


 function  LoginAsEmployeeComponents(){
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
                 const authRes = await axios.get('http://localhost:8000/auth/employee', {headers: {Authorization: `${localStorage.getItem('etoken')}`}});
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
                 navigate('/otp_validate');
             }
         });
     });

    const handleLoginAsEmployee = async (e) =>{
        e.preventDefault();

       try{
          const resFromServer = await axios.post('http://localhost:8000/loginAsEmployee', {
            email,
            password
          });
          console.log('here am i \n');
           if(localStorage.getItem("etoken"))
               localStorage.removeItem("etoken");
           localStorage.setItem("etoken", resFromServer.data.accessToken);
          if(resFromServer.status === 200){
            const userData = resFromServer.data.output[0];
            navigate('/otp_validate',{ state : {userData}});
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
          <form onSubmit={handleLoginAsEmployee}>
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
            <p className="signup">
              Don't have an account?<br/>{" "}
              <a href="/RegisterAsEmployee" className="signup-link">
                Create a New Account
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};
export default LoginAsEmployeeComponents;


