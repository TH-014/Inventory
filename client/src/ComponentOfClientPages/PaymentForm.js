import * as React from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { total } from './Review';   /// this is the total cost of the products

export default function PaymentForm() {

  return (
    <React.Fragment>
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            Your Total Cost is : $ {total.toFixed(2)}
        </Typography>
      <Typography variant="h6" gutterBottom>
        Bkash Payment
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            required
            id="BKash-Phoneno"
            label="BKash Phone no"
            fullWidth
            autoComplete="phone-number"
            variant="standard"
            onChange = {(e) => localStorage.setItem('phoneNo', e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            required
            id="transaction-Number"
            label="Transaction Number"
            fullWidth
            autoComplete="transaction-number"
            variant="standard"
            onChange = {(e) => localStorage.setItem('transactionNumber', e.target.value)}
          />
        </Grid>
        {/* <Grid item xs={12} md={6}>
          <TextField
            required
            id="expDate"
            label="Expiry date"
            fullWidth
            autoComplete="cc-exp"
            variant="standard"
            onChange = {(e) => localStorage.setItem('expDate', e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            required
            id="cvv"
            label="CVV"
            helperText="Last three digits on signature strip"
            fullWidth
            autoComplete="cc-csc"
            variant="standard"
            onChange = {(e) => localStorage.setItem('cvv', e.target.value)}
          />
        </Grid> */}
        <Grid item xs={12}>
          <FormControlLabel
            control={<Checkbox color="secondary" name="savePhoneNo" value="yes" />}
            label="Remember my phone no for next time"
          />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}