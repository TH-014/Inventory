
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
export default function Grocery() {
	const location = useLocation();
	const navigate = useNavigate();

	const [grceryproducts, setProducts] = useState([]);

	const ButtonWrapper = styled.div`
      display: flex;
      justify-content: space-between;
	`;

	const HomeButton = styled.button`
      background-color: #3498db;
      color: #fff;
      padding: 10px 15px;
	  width: 140px;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-size: 16px;
      position: fixed;
      top: 20px;
      left: 20px;
      z-index: 1000; /* Use a higher z-index to ensure the button is above other content */
      &:hover {
        background-color: #2980b9;
      }
	`;



	useEffect(() => {
		async function fetchGroceryData() {
			try {
				const res = await axios.get("http://localhost:8000/grocery");
				setProducts(res.data);
				productCards = res.data;
				console.log(productCards);
				// fetchTopSoldProducts();
				// fetchTopRatedProducts();

			} catch (err) {
				console.error("Error fetching root categories:", err);
			}
		}
		fetchGroceryData();
		if(callAuth)
			return;
		console.log('Inside useEffect of Home.');
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
				accessGranted = true;
				console.log('Authorized.', res.data.id);
			}
		});
	}, []);

	function handleHome() {
		callAuth = false;
		accessGranted = false;
		navigate('/');
	}


	const handleDetailsButtonClick = async (P_ID) => {
		console.log(P_ID);
		const resFromServer = await axios.post('http://localhost:8000/productDetails',{P_ID}); /// write the code in server
		console.log(resFromServer);
		const productData = resFromServer.data[0];
		navigate('/productDetails',{ state : {productData}});
		// alert('You clicked the Detais Button.');
	};

	const handleAddToCartButtonClick = async (P_ID) => {
		if(!accessGranted)
		{
			alert('You must be logged in as a customer to add to Cart.');
			return;
		}
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

	const handleWishListButtonClick = async(P_ID) => {
		if(!accessGranted)
		{
			alert('You must be logged in as a customer to add to WishList.');
			return;
		}
		console.log(P_ID);
		const resFromServer = await axios.post('http://localhost:8000/wishList',{P_ID},{headers: {Authorization: `${localStorage.getItem('token')}`}}); /// write the code in server
		console.log(resFromServer);
		alert('The product has been added to your WishList.');
	};

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
					<ButtonWrapper>
						<HomeButton onClick={handleHome}>Back to Home</HomeButton>
					</ButtonWrapper>
					<Container maxWidth="sm">
						<Typography
							component="h1"
							variant="h4"
							align="center"
							color="text.primary"
							gutterBottom
						>
							PRODUCTS OF GROCERIES...<hr/>
						</Typography>
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
						{productCards.map((card) => (
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
										image = {card.PICTURE}
									/>
									<CardContent sx={{ flexGrow: 1 }}>
										<Typography gutterBottom variant="h6" component="h2">
											{card.P_NAME}<br/>
											Price: $ {card.PRICE} <br/>
											{card.DISCOUNT? <p>Discount: {card.DISCOUNT}%</p>:null}
											{ card.RATING <= 2? null : <p>Rating: {card.RATING}</p>}
										</Typography>
										<Typography>
										</Typography>

									</CardContent>
									<CardActions>
										<Button size="small" onClick={()=>handleWishListButtonClick(card.P_ID)}>WishList</Button>
										<Button size="small" onClick={()=>handleDetailsButtonClick(card.P_ID)}>Details</Button>
										<Button size="small" onClick={()=>handleAddToCartButtonClick(card.P_ID)}>Add To Cart</Button>
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
					For any necessity call 014567856786 !
				</Typography>
				<Copyright />
			</Box>
			{/* End footer */}
		</ThemeProvider>

	);
};