import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useRoutes, useNavigate } from 'react-router-dom';
import "./otp_validate.css";
import styled from "styled-components";

function  OTP_Validate(){
	console.log('Inside the otp_validate function');
	let callAuth = false;
	let resendCount = 0;
	const [otp, setOtp] = useState('');
	const [userdetails, setUserdetails] = useState(null); // [state, function to update state
	const navigate = useNavigate();
	const [errorMessage,setErrorMessage]=useState('');
	const accessToken = localStorage.getItem('etoken');
	// const ButtonWrapper = styled.div`
	//   display: flex;
	// 	justify-content: space-between;
	// `;
	//
	// const ResendButton = styled.button`
	//   background-color: #3498db;
	//   color: #fff;
	//   padding: 10px 15px;
	//   border: none;
	//   border-radius: 5px;
	// 	width: 80px;
	//   cursor: pointer;
	//   font-size: 16px;
	//   margin: 10px;
	// 	float: left;
	//   &:hover {
	// 	background-color: #2980b9;
	//   }
	// `;

	useEffect(() => {
		if(callAuth)
			return;
		console.log('Inside useEffect of otp of employee.');
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
			if(res.status === 200 && res.data.id>0 && res.data.auth === false)
			{
				console.log(res.data.message, res.data.id);
				setUserdetails(res.data);
				console.log(userdetails);
			}
			else if(res.status === 200 && res.data.id>0 && res.data.auth === true)
			{
				console.log(res.data.message, res.data.id);
				navigate('/ProfileOfEmployee');
			}
			else
			{
				console.log(res.data.message);
				localStorage.removeItem('etoken');
				// navigate('/loginAsEmployee');
			}
		});
	}, []);

	//const [data, setData]=useState('');

	const handleLogin = async (e) =>{
		e.preventDefault();
		try{
			const resFromServer = await axios.post('http://localhost:8000/verifyOTP', {
				otp: otp,
				role: 'employee',
				id: userdetails.id
			});
			console.log(resFromServer.data);
			if(resFromServer.status === 200 && resFromServer.data !== 'OTP not verified.'){
				if(localStorage.getItem("etoken"))
					localStorage.removeItem("etoken");
				localStorage.setItem("etoken", resFromServer.data);
				// const userData = resFromServer.data.output[0];    /// upto here it is working fine .......
				// console.log(userData.C_ID);
				navigate('/ProfileOfEmployee');
			}
			else {
				setErrorMessage(resFromServer.data || "Login failed! Try resending another OTP.");
			}
		}catch(error)
		{
			setErrorMessage(error.message || "Something went wrong ! ");
		}
	};

	async function handleResend() {
		resendCount++;
		if (resendCount >= 4) {
			localStorage.removeItem('etoken');
			navigate('/loginAsEmployee');
		} else if (resendCount >= 3) {
			setErrorMessage('Maximum resend limit reached!');
			alert('Maximum resend limit reached!');
		}
		try {
			const resFromServer = await axios.post('http://localhost:8000/sendOTP', {
				id: userdetails.id
			});
			if (resFromServer.status === 200) {
				setErrorMessage('OTP sent successfully!');
			} else {
				setErrorMessage(resFromServer.data.message || "OTP sending failed!");
			}
		} catch (error) {
			setErrorMessage(error.message || "Something went wrong ! ");
		}
	}

	return (

		<div className="clear-content-wrapper">
			<div className="container">
				<div className="otp-form">
					{errorMessage && <div className="error-message">{errorMessage}</div>}
					<h2>Validate OTP</h2>
					<form onSubmit={handleLogin}>
						<input
							type="otp"
							placeholder="OTP"
							value={otp}
							onChange={(e) => setOtp(e.target.value)}
						/>
						<button type="submit">Login</button>
						<p>Didn't get an OTP?</p>
						{/*<ButtonWrapper>*/}
						{/*	<ResendButton onClick={handleResend}>Resend OTP</ResendButton>*/}
						{/*</ButtonWrapper>*/}
						<button onClick={handleResend}>Resend OTP</button>
					</form>
				</div>
			</div>
		</div>
	);
};
export default OTP_Validate;
