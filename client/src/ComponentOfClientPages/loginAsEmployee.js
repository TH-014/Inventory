import React, { useState, useContext } from "react";
import axios from "axios";
import { useRoutes, useNavigate } from 'react-router-dom';
import "./loginAsEmployee.css";


 function  LoginAsEmployeeComponents(){
    console.log('Inside the function');
    //const [user,setUser]=useState('');
    const [email,setEmail]=useState('');
    const [password,setPassword]=useState('');

    const navigate = useNavigate();
    const [errorMessage,setErrorMessage]=useState('');

    //const [data, setData]=useState('');

    const handleLoginAsEmployee = async (e) =>{
        e.preventDefault();
        

       // setUser('JBL Flip 5');
       // console.log(user);
       try{
          const resFromServer = await axios.post('http://localhost:8000/loginAsEmployee', {
            email,
            password
          });
          console.log('here am i \n\n\n\n\n\n\n\n\n\n\n\n\n');
          console.log(resFromServer.data[0]);

          if(resFromServer.status === 200){
            const userData = resFromServer.data[0];           ///////////////////////// upto here it is working fine .......
            //console.log(userData.S_ID);
            navigate('/ProfileOfEmployee',{ state : {userData}});
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


