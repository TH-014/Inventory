
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
let productCards = [];
const defaultTheme = createTheme();
let ProductsInCart = [];

export default function EducationalProducts() {
  const location = useLocation();
  const navigate = useNavigate();

  const [educationalProducts, setProducts] = useState([]);



  useEffect(() => {
    async function fetchEducationalData() {
      try {
        const eduProdResponse = await axios.get("http://localhost:8000/Educational");
        setProducts(eduProdResponse.data);
        productCards = eduProdResponse.data;
        console.log(productCards);
        // fetchTopSoldProducts();
        // fetchTopRatedProducts();
        
      } catch (err) {
        console.error("Error fetching root categories:", err);
      }
    }

    fetchEducationalData();
}, []);


const handleDetailsButtonClick = async (P_ID) => {
    console.log(P_ID);
    const resFromServer = await axios.post('http://localhost:8000/productDetails',{P_ID}); /// write the code in server
    console.log(resFromServer); 
    const productData = resFromServer.data[0];
    navigate('/productDetails',{ state : {productData}});
   // alert('You clicked the Detais Button.');
  };
  
  
  const handleAddToCartButtonClick = async (P_ID) => {
    if(localStorage.getItem('ProductsInCart') !== null) {  ///check whether it is null
  
      ProductsInCart = localStorage.getItem('ProductsInCart'); /// checking whether it is assigned before...... 
    }
  
    ProductsInCart.push(P_ID);
    localStorage.setItem('ProductsInCart',ProductsInCart); /// basicallllly we are overriding the array again and again .................
   // console.log('inside get',localStorage.getItem('ProductsInCart')[0]);
    //localStorage.removeItem('ProductsInCart');
    //console.log(localStorage.getItem('ProductsInCart')[0]);
    //alert('You clicked the Order Now Button.');
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
            <Container maxWidth="sm">
              <Typography
                  component="h1"
                  variant="h4"
                  align="center"
                  color="text.primary"
                  gutterBottom
              >
                PRODUCTS RELATED TO YOUR EDUCATION.....
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
                      <Button size="small" onClick={()=>handleDetailsButtonClick(card.P_ID)}>Details</Button>
                    <Button size="small" onClick={()=>handleAddToCartButtonClick(card.P_ID)}>Order Now</Button>
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