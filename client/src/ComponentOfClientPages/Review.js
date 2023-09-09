import * as React from 'react';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Grid from '@mui/material/Grid';
import { payments } from './Checkout';
import { addresses } from './Checkout';
import { productsDetails } from './Checkout';

export let total = 0;
let presentPrice = 0;
export let productQuantity = [];

export default function Review() {

    console.log(payments);
    const UpdateTotal = (value, price) => {
        productQuantity.push(value);

        console.log(price);
        total = total + price;
        console.log(total);
        presentPrice = price;
        return total;
    }

   

  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Order summary
      </Typography>


            <List disablePadding>
            {productsDetails !== null ? (
                productsDetails.map((product, index) => (
                <ListItem key={product.name} sx={{ py: 1, px: 0 }}>
                    <ListItemText primary={product.P_NAME} secondary={product.PRICE} />
                    <Typography variant="body2">{product.DESCRIPTION}</Typography>
                    <input
                    className="form-control"
                    type="number"
                    placeholder="Enter Quantity"
                    //value={product.quantity}
                    onBlur={ 
                        (e) =>
                        UpdateTotal(
                        e.target.value,
                        (product.PRICE - product.DISCOUNT * 0.01 * product.PRICE) *
                            e.target.value
                        )
                    }
                    />

                    {/* {index === productsDetails.length -1 ? (
                    <div>
                        <ListItemText primary="Total" />
                        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                        $ {returnTotal(presentPrice)}
                            $ {total}
                        </Typography>
                    </div>
                    ) : null} */}
                </ListItem>
                ))
            ) : null}
            </List>





      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            Shipping
          </Typography>
          <Typography gutterBottom>{localStorage.getItem('lastName')  } </Typography>
          <Typography gutterBottom>{addresses.join(', ')}</Typography>
        </Grid>
        {/* <Grid item container direction="column" xs={12} sm={6}>
          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            Payment details
          </Typography>
          <Grid container>
            {payments.map((payment) => (
              <React.Fragment key={payment.name}>
                <Grid item xs={6}>
                  <Typography gutterBottom>{payment.name}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography gutterBottom>{payment.detail}</Typography>
                </Grid>
              </React.Fragment>
            ))}
          </Grid>
        </Grid> */}
      </Grid>
    </React.Fragment>
  );
}