
import { useLocation } from "react-router-dom";
import React, {useContext} from "react";
import axios from "axios";
import { useRoutes, useNavigate } from 'react-router-dom';
import  { useEffect,useState} from 'react';

import supplierIdContext from "../Context/supplierContext";
import {createTheme, ThemeProvider} from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import {Copyright} from "@mui/icons-material";
import styled from "styled-components";
let productCards = [];
const defaultTheme = createTheme();
let ProductsInCart = [];
let callAuth = false;
let accessGranted = false;
export default function WishedProducts() {
	const location = useLocation();
	const navigate = useNavigate();
	// let wishData = location.state && location.state.wishedProductData.rows; // Check for undefined

	const [wishData, setWishData] = useState([]);

	const ButtonWrapper = styled.div`
  align-content: center;
`;

	const HomeButton = styled.button`
  background-color: #3498db;
  color: #fff;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
    width: 140px;
  cursor: pointer;
  font-size: 16px;
  margin: 10px;
    align: left;
  &:hover {
    background-color: #2980b9;
  }
`;

	const ProfileButton = styled.button`
  background-color: #3498db;
  color: #fff;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
    width: 140px;
  cursor: pointer;
  font-size: 16px;
  margin: 10px;
    align: left;
  &:hover {
    background-color: #2980b9;
  }
`;

	useEffect(() => {
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
		async function getCustomerData(cid) {
			try {
				console.log('cid = ',cid);
				const resFromServer = await axios.post('http://localhost:8000/myWishList',{C_ID1: cid});
				console.log(resFromServer);
				if (resFromServer.status === 200) {
					return resFromServer.data;
				}
			} catch (e) {
				console.log(e);
			}
		}
		checkLoginStatus().then(res => {
			console.log('Checked login status from mywishlist page.');
			if(res.status === 200 && res.data.auth === true && res.data.id>0)
			{
				accessGranted = true;
				console.log('Authorized.', res.data.id);
				getCustomerData(res.data.id).then(r => {
					// setUserData(r[0]);
					setWishData(r);
					console.log('Got customer data.');
					console.log(r);
				});
			}
		});
	},[]);

	// if (!accessGranted) {
	// 	return (
	// 		<div align="center" className="error">
	// 			<h2>Access Denied!</h2><hr/>
	// 			<p>Go back to
	// 				<a href="/login"> Login page.</a></p>
	// 		</div>
	// 	);
	// }

	const handleDetailsButtonClick = async (P_ID) => {
        console.log(P_ID);
        const resFromServer = await axios.post('http://localhost:8000/productDetails',{P_ID}, {headers: {Authorization: `${localStorage.getItem('stoken')}`}});
        //console.log(resFromServer);
        const productData = resFromServer.data.output[0];
        const editToken = resFromServer.data.editToken;
        console.log(productData, editToken);
        navigate('/productDetails',{ state : {productData: productData, editToken: editToken}});
        // alert('You clicked the Detais Button.');
    };


	const handleAddToCartButtonClick = async (P_ID) => {
		//localStorage.removeItem('ProductsInCart');
		if(localStorage.getItem('ProductsInCart') !== null) {  ///check whether it is null
			console.log('inside if');
			ProductsInCart = JSON.parse(localStorage.getItem('ProductsInCart')); /// checking whether it is assigned before......
		}
		console.log(P_ID);
		console.log(ProductsInCart);
		const resFromServer = await axios.post('http://localhost:8000/productDetails',{ P_ID});
		if(ProductsInCart === null) {
			ProductsInCart = [];
			console.log('inside if1');
		}
		ProductsInCart.push(resFromServer.data[0]);
		//ProductsInCart[ProductsInCart.length] = P_ID;
		console.log(ProductsInCart);
		//localStorage.removeItem('ProductsInCart');



		localStorage.setItem('ProductsInCart',JSON.stringify(ProductsInCart)); /// basicallllly we are overriding the array again and again .................
		// console.log('inside get',localStorage.getItem('ProductsInCart')[0]);
		//localStorage.removeItem('ProductsInCart');
		//console.log(localStorage.getItem('ProductsInCart')[0]);
		alert('The product has been added to your cart.');
	};
	const donothing = async () => {
		alert('You clicked the Order Now Button.');
	};


	function handleHome() {
		// callAuth = false;
		// accessGranted = false;
		navigate('/');
	}

	function handleProfile() {
		// callAuth = false;
		// accessGranted = false;
		navigate('/DashBoard');
	}

	async function handleRemoveButtonClick(P_ID) {
		console.log(P_ID);
		const resFromServer = await axios.post('http://localhost:8000/removeFromWishList', {P_ID}, {headers: {Authorization: `${localStorage.getItem('token')}`}}); /// write the code in server
		callAuth= false;
		console.log(resFromServer);
		window.location.reload();
	}

	return (

		<ThemeProvider theme={defaultTheme}>
			<CssBaseline />
			{/* <AppBar position="relative">
        <Toolbar>
          <CameraIcon sx={{ mr: 2 }} />
          <Typography variant="h6" color="inherit" noWrap>
            Product Home
          </Typography>
        </Toolbar>
      </AppBar> */}
			<main style={{ height: 'calc(100vh - 64px)', overflowY: 'auto' }}>
				{/* Hero unit */}
				<Box
					sx={{
						bgcolor: 'background.paper',
						pt: 8,
						pb: 6,
					}}
				>
					<Container maxWidth="sm">
						<Typography
							component="h1"
							variant="h4"
							align="center"
							color="text.primary"
							gutterBottom
						>
							PRODUCTS IN YOUR WISHLIST.....
						</Typography>
						<ButtonWrapper>
							<ProfileButton onClick={handleProfile}>Back to Profile</ProfileButton>
							<HomeButton onClick={handleHome}>Back to Home</HomeButton>
						</ButtonWrapper>
						{/* <Typography variant="h5" align="center" color="text.secondary" paragraph>
              Something short and leading about the collection below—its contents,
              the creator, etc. Make it short and sweet, but not too short so folks
              don&apos;t simply skip over it entirely.
            </Typography> */}
						<Stack
							sx={{ pt: 4 }}
							direction="row"
							spacing={2}
							justifyContent="center"
						>
						</Stack>
					</Container>
				</Box>
				<Container sx={{ py: 8 }} maxWidth="md">
					{/* End hero unit */}
					<Grid container spacing={4}>
						{wishData.map((card) => (
							<Grid item key={card} xs={12} sm={6} md={4}>
								<Card
									sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
								>
									<CardMedia
										component="div"
										sx={{
											// 16:9
											pt: '56.25%',
										}}
										// image="https://source.unsplash.com/photos?wallpapers"
										image = {card[11]}
									/>
									<CardContent sx={{ flexGrow: 1 }}>
										<Typography gutterBottom variant="h6" component="h2">
											{card[2]}<br/>
											Price: $ {card[5]}
											{card[7]? <p>In stock: {card[7]}</p>:null}
											{ card[12] <= 2? null : <p>Rating: {card[12]}</p>}
										</Typography>
										<Typography>
										</Typography>

									</CardContent>
									<CardActions>
										<Button size="small" onClick={()=>handleDetailsButtonClick(card[0])}>Details</Button>
										<Button size="small" onClick={()=>handleAddToCartButtonClick(card[0])}>ADD TO CART</Button>
										<Button size="small" onClick={()=>handleRemoveButtonClick(card[0])}>Remove</Button>
									</CardActions>
								</Card>
							</Grid>
						))}
					</Grid>
				</Container>
			</main>
			{/* Footer */}
			<Box sx={{ bgcolor: 'background.paper', p: 6 }} component="footer">
				<Typography variant="h6" align="center" gutterBottom>
					Footer
				</Typography>
				<Typography
					variant="subtitle1"
					align="center"
					color="text.secondary"
					component="p"
				>
					Something here to give the footer a purpose!
				</Typography>
				<Copyright />
			</Box>
			{/* End footer */}
		</ThemeProvider>

	);
};