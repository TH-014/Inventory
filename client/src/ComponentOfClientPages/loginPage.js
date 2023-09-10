import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useRoutes, useNavigate } from 'react-router-dom';
import "./loginPage.css";

export function  ReturnLoginComponents(){
    console.log('Inside the function');
    let callAuth = false;

    //const [user,setUser]=useState('');
    const [email,setEmail]=useState('');
    const [password,setPassword]=useState('');

    const navigate = useNavigate();
    const [errorMessage,setErrorMessage]=useState('');

    useEffect(() => {
        console.log('Inside useEffect of login of customer.');
        if(callAuth)
            return;
        console.log('Inside useEffect of profile of customer.');
        async function checkLoginStatus() {
            try {
                const authRes = await axios.get('http://localhost:8000/auth/customer', {headers: {Authorization: `${localStorage.getItem('token')}`}});
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
                console.log('Authorized.', res.data.id);
                callAuth = false;
                navigate('/Dashboard');
            }
        });
    });

    //const [data, setData]=useState('');

    const handleLogin = async (e) =>{
        e.preventDefault();
        

       // setUser('JBL Flip 5');
       // console.log(user);
       try{
          const resFromServer = await axios.post('http://localhost:8000/login', {
            email,
            password
          });
          console.log('here am i \n');
          console.log(resFromServer.data[0]);

          if(resFromServer.status === 200){
              if(localStorage.getItem("token"))
                  localStorage.removeItem("token");
              localStorage.setItem("token", resFromServer.data.accessToken);
            const userData = resFromServer.data.output[0];           /// upto here it is working fine .......
            console.log(userData.C_ID);
            navigate('/Dashboard',{ state : {userData}});
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
          <form onSubmit={handleLogin}>
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
              <a href="/Register" className="signup-link">
                Create a New Account
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};
export default ReturnLoginComponents;