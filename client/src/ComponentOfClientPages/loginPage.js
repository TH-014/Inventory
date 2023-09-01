import React, { useState, useContext } from "react";
import axios from "axios";
import { useRoutes, useNavigate } from 'react-router-dom';
import "./loginPage.css";



export function  ReturnLoginComponents(){
    console.log('Inside the function');
    //const [user,setUser]=useState('');
    const [email,setEmail]=useState('');
    const [password,setPassword]=useState('');

    const navigate = useNavigate();
    const [errorMessage,setErrorMessage]=useState('');

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
          console.log('here am i \n\n\n\n\n\n\n\n\n\n\n\n\n');
          console.log(resFromServer.data[0]);

          if(resFromServer.status === 200){
            const userData = resFromServer.data[0];           ///////////////////////// upto here it is working fine .......
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


//};

    // return (
    //      <div>
    //         <button onClick={handleClick}> Submit </button>
    //         <p>
    //             {data.data}
    //         </p>

    //      </div>
    // )


//}




// import React, { useState } from "react";
// import axios from "axios";

// export default function ReturnLoginComponents() {
//     const SERVER_URL = process.env.REACT_APP_SERVER_URL || 'http://localhost:8000';
//     const [user,setUser]=useState('')
//     const handleClick = async () => {
//         setUser('Moyen');
//         try {
//             console.log(user);
//             const response = await axios.post(`${SERVER_URL}/login`, {
//                 user// Consider replacing this with a dynamic value
//             });
//             console.log(response);
//         } catch (error) {
//             console.error("Error logging in:", error);
//         }
//     }

//     return (
//         <div>
//             <button onClick={handleClick}>Submit</button>
//             <p>Hello world</p>
//         </div>
//     )
// }




// import React, { useState, useContext } from "react";
// import axios from "axios";
// import { useRoutes, useNavigate } from 'react-router-dom';
// import "./loginPage.css";
// // import UserContext from "../context/UserContext";



// export function  ReturnLoginComponents(){
//     console.log('Inside the function');
//     //const [user,setUser]=useState('');
//     const [email,setEmail]=useState('');
//     const [password,setPassword]=useState('');

//     const navigate = useNavigate();
//     const [errorMessage,setErrorMessage]=useState('');

//     //const [data, setData]=useState('');

//     const handleLogin = async (e) =>{
//         e.preventDefault();
        

//        // setUser('JBL Flip 5');
//        // console.log(user);
//        try{
//           const resFromServer = await axios.post('http://localhost:8000/login', {
//             email,
//             password
//           });
//           console.log('here am i \n\n\n\n\n\n\n\n\n\n\n\n\n');
//           console.log(resFromServer.data[0]);

//           if(resFromServer.status === 200){
//             const userData = resFromServer.data[0];           ///////////////////////// upto here it is working fine .......
//             console.log(userData.C_ID);
//            // navigate('/Dashboard',{ state : {userData}});
//           }
//           else {
//             setErrorMessage(resFromServer.data.message || "Login failed!");
//           }
//         }catch(error)
//         {
//            setErrorMessage(error.message || "Something went wrong ! ");
//         }
//     };

//     return (

//     <div className="clear-content-wrapper">
//       <div className="container">
//         <div className="login-form">
//           {errorMessage && <div className="error-message">{errorMessage}</div>}
//           <h2>Login</h2>
//           <form onSubmit={handleLogin}>
//           {/* <input
//                     type="user"
//                     placeholder="Username"
//                     value={user}
//                     onChange={(e) => setUser(e.target.value)}
//                 /> */}
//           <input
//                     type="email"
//                     placeholder="Email"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                 />
//             <input
//               type="password"
//               id="password"
//               placeholder="Password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//             />
//             <button type="submit" onClick={()=>{
//               navigate('/client/src/ComponentsOfClientPages/RegistrationPage.js')
//             }}>Login</button>
//             <p className="signup">
//               Don't have an account?<br/>{" "}
//               {/* <a href="/Register" className="signup-link"> */}
//                 Create a New Account
//               {/* </a> */}
//             </p>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };
// export default ReturnLoginComponents;

// import React, { useState, useContext } from "react";
// import axios from "axios";
// import { useRoutes, useNavigate } from 'react-router-dom';
// import "./loginPage.css";



// function  ReturnLoginComponents(){
//     return (
//     <div className="clear-content-wrapper">
//     hello
//     </div>
//   );
// };
// export default ReturnLoginComponents;

