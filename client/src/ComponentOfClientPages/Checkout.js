import * as React from 'react';
import axios from 'axios';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import Paper from '@mui/material/Paper';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import AddressForm from './AddressForm';
import PaymentForm from './PaymentForm';
import Review, { total } from './Review';
import addressForm from './AddressForm';
import { ProductsInCart } from './Trial';

function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const steps = ['Shipping address', 'Payment details', 'Review your order'];

function getStepContent(step) {
  switch (step) {
    case 0:
      return <AddressForm />;
    case 1:
      return <PaymentForm />;
    case 2:
      return <Review />;
    default:
      throw new Error('Unknown step');
  }
}
// function getAddressForm(){
//     alert("You clicked the Detais Button.");
// }
export let payments = [];
export let addresses = [];
export let productsDetails = [];//JSON.parse(localStorage.getItem('ProductsInCart'));

export default function Checkout() {
  const [activeStep, setActiveStep] = React.useState(0);

  const  handleNext = async (e) => {
    e.preventDefault();   /// it was not here 
    if(activeStep === 0){
        //console.log(addressForm.SetFormDataOfAddress());
        console.log('from local storage : ' , localStorage.getItem('firstName'));
        console.log('from local storage : ' , localStorage.getItem('lastName'));
        console.log('from local storage : ' , localStorage.getItem('address1'));
        console.log('from local storage : ' , localStorage.getItem('address2'));
        console.log('from local storage : ' , localStorage.getItem('city'));
        console.log('from local storage : ' , localStorage.getItem('state'));
        console.log('from local storage : ' , localStorage.getItem('zip'));
        console.log('from local storage : ' , localStorage.getItem('country'));

         addresses = [localStorage.getItem('address1'), localStorage.getItem('city'), localStorage.getItem('state'), localStorage.getItem('zip'), localStorage.getItem('country')];
        setActiveStep( 1);
    }
    else if(activeStep === 1){

        console.log('from local storage : ' , localStorage.getItem('cardName'));
        console.log('from local storage : ' , localStorage.getItem('cardNumber'));
        console.log('from local storage : ' , localStorage.getItem('expDate'));
        console.log('from local storage : ' , localStorage.getItem('cvv'));

         payments = [
            { name: 'Card type', detail: 'Visa' },
            { name: 'Card holder', detail: `${localStorage.getItem('cardName')}` },
            { name: 'Card number', detail: localStorage.getItem('cardNumber') },
            { name: 'Expiry date', detail: localStorage.getItem('expDate') },
          ];
          if(localStorage.getItem('ProductsInCart') !== null){
            // const products = JSON.parse(localStorage.getItem('ProductsInCart'));
            // console.log('products : ' , products[0]);
            // for(let i = 0; i < products.length; i++){
            //     const P_ID = products[i];
            //    if( P_ID!== null) {const resFromServer = await axios.post('http://localhost:8000/productDetails',{ P_ID}); /// write the code in server
            // //    if(localStorage.getItem('ProductsInCart') !== null) {  ///check whether it is null
            // //     console.log('inside if');
            // //     productsDetails = JSON.parse(localStorage.getItem('ProductsInCart')); /// checking whether it is assigned before...... 
            // //   }       
            // console.log('resFromServer.data : ' , resFromServer.data);
               productsDetails = JSON.parse(localStorage.getItem('ProductsInCart'));
            }

        //   }
        // }



        setActiveStep( 2);
    }
    else if(activeStep === 2){
        /// Here to write the code to send the data to the server ....................................

        // const resFromServer = await axios.post('http://localhost:8000/productDetails',{ productsDetails}); /// write the code in server
        // try{
        //     const resFromServer = await axios.post('http://localhost:8000/login', {
        //       email,
        //       password
        //     });
        // }catch(error)
        // {
        //    setErrorMessage(error.message || "Something went wrong ! ");
        // }
            
            localStorage.removeItem('firstName');
            localStorage.removeItem('lastName');
            localStorage.removeItem('address1');
            localStorage.removeItem('address2');
            localStorage.removeItem('city');
            localStorage.removeItem('state');
            localStorage.removeItem('zip');
            localStorage.removeItem('country');
            localStorage.removeItem('cardName');
            localStorage.removeItem('cardNumber');
            localStorage.removeItem('expDate');
            localStorage.removeItem('cvv');
            localStorage.removeItem('ProductsInCart');
            while(ProductsInCart.length) {
                console.log('inside while');
                ProductsInCart.pop(); // Removing the last element in each iteration clears the array
              }
            //ProductsInCart = null;

            //ProductsInCart = JSON.parse(localStorage.getItem('ProductsInCart'));

            console.log('from local storage : ' , localStorage.getItem('firstName'));
            console.log('from local storage : ' , localStorage.getItem('lastName'));
            console.log('from local storage : ' , localStorage.getItem('address1'));
            console.log('from local storage : ' , localStorage.getItem('address2'));
            console.log('from local storage : ' , localStorage.getItem('city'));
            console.log('from local storage : ' , localStorage.getItem('state'));
            console.log('from local storage : ' , localStorage.getItem('zip'));
            console.log('from local storage : ' , localStorage.getItem('country'));
            console.log('from local storage : ' , localStorage.getItem('cardName'));
            console.log('from local storage : ' , localStorage.getItem('cardNumber'));
            console.log('from local storage : ' , localStorage.getItem('expDate'));
            console.log('from local storage : ' , localStorage.getItem('cvv'));
            console.log('from local storage : ' , localStorage.getItem('ProductsInCart'));


        setActiveStep( 3);
    }
   // setActiveStep(activeStep + 1);
  };
//   const handleNextOfFormAddress = () => {
//    // getAddressForm();
    
//   };
//   const handleNextOfFormPayment = () => {
//     //AddressForm();
//     setActiveStep( 2);
//   };

  const handleBack = () => {
    //// Here you need to remove the storage data from the local storage
    if(activeStep === 1){
        localStorage.removeItem('firstName');
        localStorage.removeItem('lastName');
        localStorage.removeItem('address1');
        localStorage.removeItem('address2');
        localStorage.removeItem('city');
        localStorage.removeItem('state');
        localStorage.removeItem('zip');
        localStorage.removeItem('country');
    }
    else if(activeStep === 2){
        localStorage.removeItem('cardName');
        localStorage.removeItem('cardNumber');
        localStorage.removeItem('expDate');
        localStorage.removeItem('cvv');
    }


   
    setActiveStep(activeStep - 1);
  };

  return (
    <React.Fragment >
      <CssBaseline />
      <AppBar
        position="absolute"
        color="default"
        elevation={0}
        sx={{
          position: 'relative',
          borderBottom: (t) => `1px solid ${t.palette.divider}`,
        }}
      >
        <Toolbar>
          <Typography variant="h6" color="inherit" noWrap>
            Payment...
          </Typography>
        </Toolbar>
      </AppBar>
      <Container component="main" maxWidth="sm" sx={{ mb: 4 }} style={{ height: 'calc(100vh - 64px)', overflowY: 'auto' }}>
        <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
          <Typography component="h1" variant="h4" align="center">
            Checkout
          </Typography>
          <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          {activeStep === steps.length ? (
            <React.Fragment>
              <Typography variant="h5" gutterBottom>
                Thank you for your order.
              </Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                Your Total Cost is : $ {total.toFixed(2)}
              </Typography>
              <Typography variant="subtitle1">
                Your order number is #2001539. We have emailed your order
                confirmation, and will send you an update when your order has
                shipped.
              </Typography>
            </React.Fragment>
          ) : (
            <React.Fragment>
              {getStepContent(activeStep)}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                {activeStep !== 0 && (
                  <Button onClick={handleBack} sx={{ mt: 3, ml: 1 }}>
                    Back
                  </Button>
                )}

                <Button
                  variant="contained"
                  onClick= {handleNext}
                  sx={{ mt: 3, ml: 1 }}
                >
                  {activeStep === steps.length - 1 ? 'Place order' : 'Next'}
                </Button>
              </Box>
            </React.Fragment>
          )}
        </Paper>
        <Copyright />
      </Container>
    </React.Fragment>
  );
}