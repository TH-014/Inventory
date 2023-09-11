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

export default function ShowReviews() {
  const location = useLocation();
  const navigate = useNavigate();
  const reviewData = location.state && location.state.reviewData; // Check for undefined

  //const [wishedProducts, setProducts] = useState([]);



//   useEffect(() => {
//     async function fetchWishedData() {
//       try {
//         const wishProdResponse = await axios.post("http://localhost:8000/myWishList1",{wishData});
//         setProducts(wishProdResponse.data.rows);
//         productCards = wishProdResponse.data.rows;
//         console.log(productCards);
//         // fetchTopSoldProducts();
//         // fetchTopRatedProducts();
        
//       } catch (err) {
//         console.error("Error fetching root categories:", err);
//       }
//     }

//     fetchWishedData();
// }, [wishData]);



  
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
            <h1 align = 'center'>{reviewData[0][16]}<hr/><br/></h1>
            <h3> Customer Name  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Comment</h3>
            {/* End hero unit */}
            {/* <Grid container spacing={4}> */}
              {reviewData.map((card) => (

                <div>
                  <p>{card[6]} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {card[4]}</p>
                  <p></p>
                </div>





                  // <Grid item key={card} xs={12} sm={6} md={4}>
                  //   <Card
                  //       sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                  //   >
                  //     <CardMedia
                  //         component="div"
                  //         sx={{
                  //           // 16:9
                  //           pt: '56.25%',
                  //         }}
                  //         // image="https://source.unsplash.com/photos?wallpapers"
                  //         image = {card[11]}
                  //     />
                  //     <CardContent sx={{ flexGrow: 1 }}>
                  //       <Typography gutterBottom variant="h6" component="h2">
                  //       {card[2]}<br/>
                  //       Price: $ {card[5]} <br/>
                  //       {card[10]? <p>Discount: {card[10]}%</p>:null}
                  //       { card[12] <= 2? null : <p>Rating: {card[12]}</p>}
                  //       </Typography>
                  //       <Typography>
                  //       </Typography>

                  //     </CardContent>
        
                   
                  //   </Card>
                  // </Grid>
              ))}
            {/* </Grid> */}
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