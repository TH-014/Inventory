import * as React from 'react';
import axios from "axios";
import  { useEffect,useState} from 'react';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import CameraIcon from '@mui/icons-material/PhotoCamera';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import { createTheme, ThemeProvider } from '@mui/material/styles';
//import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
//import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
//import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
//import CssBaseline from '@mui/material/CssBaseline';
//import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';

import { useRoutes, useNavigate } from 'react-router-dom';
import { Avatar, Icon } from '@mui/material';
import { Image } from '@mui/icons-material';
import Trial from './Trial.css'
import {productsDetails} from "./Checkout";

const drawerWidth = 240;

const openedMixin = (theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme) => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));

const AppBar1 = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        ...(open && {
            ...openedMixin(theme),
            '& .MuiDrawer-paper': openedMixin(theme),
        }),
        ...(!open && {
            ...closedMixin(theme),
            '& .MuiDrawer-paper': closedMixin(theme),
        }),
    }),
);





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

let cards = [];  // This defines number of elements
const cards1 = ['a','b','c','d','e','f','g','h','i'];  // This defines number of elements

let cardsForTopSoldProducts = [];
let cardsForTopRatedProducts = [];
export let ProductsInCart = JSON.parse(localStorage.getItem('ProductsInCart'));
// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

let callAuth = false;
let accessGranted = false;

export default function Album() {

    const navigate = useNavigate();
    const [productCards, setProductCards] = useState([]);
    const [changed, setChanged] = useState(false);
    const [TopSoldProducts, setTopSoldProducts] = useState([]);
    const [TopRatedProducts, setTopRatedProducts] = useState([]);
    const [selectedSubCategory, setSelectedSubCategory] = useState("");
    const [priceRange, setPriceRange] = useState({ min: '', max: '' });
    const [orderByPrice, setOrderByPrice] = useState('');
    const [errorMessage,setErrorMessage]=useState('');

    const [rootCategories, setRootCategories] = useState([]);
    const [selectedRootCategory, setSelectedRootCategory] = useState(null);

    const theme = useTheme();
    const [open, setOpen] = React.useState(false);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };
    // const navigate = useNavigate();
    const handleButtonClick = async () => {
        navigate('/login');
        alert('You clicked the third ListButton.');
    };

    useEffect(() => {
        async function fetchInitialData() {
            try {
                const rootCatResponse = await axios.get("http://localhost:8000/rootCategories");
                setRootCategories(rootCatResponse.data);
                fetchTopSoldProducts();
                fetchTopRatedProducts();

            } catch (err) {
                console.error("Error fetching root categories:", err);
            }
        }
        fetchInitialData();
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

    async function fetchTopSoldProducts() {
        const response = await axios.get("http://localhost:8000/TopSoldProducts");
        setTopSoldProducts(response.data);
        cardsForTopSoldProducts = response.data;
    }

    async function fetchTopRatedProducts() {
        const response = await axios.get("http://localhost:8000/TopRatedProducts");
        setTopRatedProducts(response.data);
        cardsForTopRatedProducts = response.data;
    }


    const handleWishListButtonClick = async(P_ID) => {
        if(!accessGranted)
        {
            alert('You must be logged in as a customer to add to WishList.');
            return;
        }
        console.log(P_ID);
        const resFromServer = await axios.post('http://localhost:8000/wishList',{P_ID},{headers: {Authorization: `${localStorage.getItem('token')}`}}); /// write the code in server
        console.log(resFromServer.data.message);
        alert(resFromServer.data.message);
    };



    const handleDetailsButtonClick = async (P_ID) => {
        console.log(P_ID);
        const resFromServer = await axios.post('http://localhost:8000/productDetails',{P_ID}, {headers: {Authorization: `${localStorage.getItem('stoken')}`}});
        //console.log(resFromServer);
        const productData = resFromServer.data.output[0];
        const editToken = resFromServer.data.editToken;
        // console.log(productData, editToken);
        navigate('/productDetails',{ state : {productData: productData, editToken: editToken}});
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
            for(let i=0;i<ProductsInCart.length;i++)
            {
                if(ProductsInCart[i].P_ID === P_ID)
                {
                    alert('This product is already in your cart.');
                    return;
                }
            }
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

        alert('The product has been added to your cart.');
    };
    const donothing = async () => {
        alert('You clicked the Order Now Button.');
    };




    const handleLoginAsCustomerClick = async () => {
        callAuth = accessGranted = false;
        navigate('/login');
        // alert('You clicked the third ListButton.');
    };


    const handleLoginAsSupplierClick = async () => {
        callAuth = accessGranted = false;
        navigate('/loginAsSupplier');
        // alert('You clicked the third ListButton.');
    };

    const handleRegisterAsCustomerClick = async () => {
        callAuth = accessGranted = false;
        navigate('/Register');
        // alert('You clicked the third ListButton.');
    };


    const handleRegisterAsSupplierClick = async () => {
        callAuth = accessGranted = false;
        navigate('/RegisterAsSupplier');
        // alert('You clicked the third ListButton.');
    };
    const handleLoginAsEmployeeClick = async () => {
        callAuth = accessGranted = false;
        navigate('/loginAsEmployee');
        // alert('You clicked the third ListButton.');
    };

    const handleRegisterAsEmployeeClick = async () => {
        callAuth = accessGranted = false;
        navigate('/RegisterAsEmployee');
        // alert('You clicked the third ListButton.');
    };
    const handleCheckoutButtonClick = async () => {
        // console.log('inside checkout()', accessGranted);
        if(!accessGranted)
        {
            alert('You must be logged in as a customer to buy products.');
            return;
        }
        if(localStorage.getItem('ProductsInCart') === null) {  ///check whether it is null
            alert('Your cart is empty!');
            return;
        }
        // console.log('inside checkout()', accessGranted);
        navigate('/checkout');
        // alert('You clicked the third ListButton.');
    };

    async function searchIt(value) {
        console.log(value);
        if(value !== '') {
            //send request to server
            setChanged(true);
            console.log('inside SEARCH IT');
            const resFromServer = await axios.post('http://localhost:8000/search',{value});
            console.log(resFromServer);
            setProductCards(resFromServer.data);
            // window.location.reload();
            return(
                <ThemeProvider theme={defaultTheme}>
                    {/* <CssBaseline /> */}
                    <Box sx={{ display: 'flex' }}>
                        <CssBaseline />
                        <AppBar1 position="fixed" open={open}>
                            <Toolbar>
                                <Toolbar>
                                    <div className='addProduct-link' style={{ display: 'flex', margin: '0', padding: '0'}}>
                                        <a href="/Educational" className="addProduct-link"><strong>EDUCATIONAL</strong></a>
                                        <a href="/IT_Products" className="addProduct-link"><strong>IT_PRODUCTS</strong></a>
                                        <a href="/Grocery" className="addProduct-link"><strong>GROCERY</strong></a>
                                        <a href="/Toy" className="addProduct-link"><strong>TOY</strong></a>
                                        <a href="/Fashion" className="addProduct-link"><strong>FASHION</strong></a>
                                    </div>
                                </Toolbar>
        
                                <Toolbar>
                                    <IconButton
                                        color="inherit"
                                        aria-label="open drawer"
                                        onClick={handleDrawerOpen}
                                        edge="start"
                                        sx={{
                                            marginRight: '36px',
                                            ...(open && { display: 'none' }),
                                        }}
                                    >
                                        <MenuIcon />
        
                                    </IconButton>
                                    <Typography variant="h6" noWrap component="div">
                                        Inventory Management System
                                    </Typography>
                                </Toolbar>
                            </Toolbar>
                            <style>
        
                            </style>
        
        
                        </AppBar1>
                        <Drawer variant="permanent" open={open}>
                            <DrawerHeader>
                                <IconButton onClick={handleDrawerClose}>
                                    {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                                </IconButton>
                            </DrawerHeader>
                            <Divider />
                            <div className='profilePage'>
                  <span className="text-primary" onClick={handleButtonClick} style={{ cursor: 'pointer' }}>
                        </span>
                            </div>
                            <div className='profilePage'>
                  <span className="text-primary" onClick={handleButtonClick} style={{ cursor: 'pointer' }}>
                        </span>
                            </div>
                            <List>
        
                                {['LoginAsCustomer', 'LoginAsSupplier', 'LoginAsEmployee','RegisterAsCustomer', 'RegisterAsSupplier','RegisterAsEmployee'].map((text, index) => (
                                    <ListItem key={text} disablePadding sx={{ display: 'block' }}>
                                        <ListItemButton
                                            sx={{
                                                minHeight: 48,
                                                justifyContent: open ? 'initial' : 'center',
                                                px: 2.5,
                                            }} onClick={index === 0 ? handleLoginAsCustomerClick : index === 1 ? handleLoginAsSupplierClick : index === 2 ? handleLoginAsEmployeeClick : index === 3 ? handleRegisterAsCustomerClick : index === 4 ? handleRegisterAsSupplierClick : index === 5 ? handleRegisterAsEmployeeClick : null}
                                        >
                                            <ListItemIcon
                                                sx={{
                                                    minWidth: 0,
                                                    mr: open ? 3 : 'auto',
                                                    justifyContent: 'center',
                                                }}
                                            >
                                                {index === 0 || index ===1 || index === 2 ? <Avatar /> : index === 3 || index === 4 || index === 5? <Avatar /> : null}
                                            </ListItemIcon>
                                            <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
                                        </ListItemButton>
                                    </ListItem>
                                ))}
                            </List>
                            <Divider />
                        </Drawer>
                    </Box>
        
                    <main style={{ height: 'calc(100vh - 64px)', overflowY: 'auto' }}>
                        <Container maxWidth="sm">
                            <Typography
                                component="h1"
                                variant="h4"
                                align="center"
                                color="text.primary"
                                gutterBottom
                            >
                                PRODUCTS RELATED TO YOUR SEARCH.....
                            </Typography>
                            <Stack
                                sx={{ pt: 4 }}
                                direction="row"
                                spacing={2}
                                justifyContent="center"
                            >
                            </Stack>
                        </Container>
                        <Container sx={{ py: 8 }} maxWidth="md">
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
                                                image = {card.PICTURE}
                                            />
                                            <CardContent sx={{ flexGrow: 1 }}>
                                                <Typography gutterBottom variant="h5" component="h2">
                                                    {card.P_NAME}<br/>
                                                    {card.PRICE}<br/>
                                                    {card.RATING}
                                                </Typography>
                                                <Typography>
                                                </Typography>

                                            </CardContent>
                                            <CardActions>
                                                <Button size="small" onClick={()=>handleWishListButtonClick(card.P_ID)}>WishList</Button>
                                                <Button size="small" onClick={()=>handleDetailsButtonClick(card.P_ID)}>Details</Button>
                                                <Button size="small" onClick={()=>handleAddToCartButtonClick(card.P_ID)}>Add to Cart</Button>
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
                            For any necessary information, please contact us : 01700000000
                        </Typography>
                        <Typography
                            variant="subtitle1"
                            align="center"
                            color="text.secondary"
                            component="p"
                        >
                            Lets start with our products.....
                        </Typography>
                        <Copyright />
                    </Box>
                    {/* End footer */}
        
        
                </ThemeProvider>
            );
        }
        else{
            setChanged(false);
        }
    }

    return(

        <ThemeProvider theme={defaultTheme}>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <AppBar1 position="fixed" open={open}>
                    <Toolbar>
                        <Toolbar>
                            <div className='addProduct-link' style={{ display: 'flex', margin: '0', padding: '0'}}>
                                <a href="/Educational" className="addProduct-link"><strong>EDUCATIONAL</strong></a>
                                <a href="/IT_Products" className="addProduct-link"><strong>IT_PRODUCTS</strong></a>
                                <a href="/Grocery" className="addProduct-link"><strong>GROCERY</strong></a>
                                <a href="/Toy" className="addProduct-link"><strong>TOY</strong></a>
                                <a href="/Fashion" className="addProduct-link"><strong>FASHION</strong></a>
                            </div>
                        </Toolbar>

                        <Toolbar>
                            <IconButton
                                color="inherit"
                                aria-label="open drawer"
                                onClick={handleDrawerOpen}
                                edge="start"
                                sx={{
                                    marginRight: '36px',
                                    ...(open && { display: 'none' }),
                                }}
                            >
                                <MenuIcon />

                            </IconButton>
                            <Typography variant="h6" noWrap component="div">
                                Inventory Management System
                            </Typography>
                        </Toolbar>
                    </Toolbar>
                    <style>

                    </style>


                </AppBar1>
                <Drawer variant="permanent" open={open}>
                    <DrawerHeader>
                        <IconButton onClick={handleDrawerClose}>
                            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                        </IconButton>
                    </DrawerHeader>
                    <Divider />
                    <div className='profilePage'>
          <span className="text-primary" onClick={handleButtonClick} style={{ cursor: 'pointer' }}>
                </span>
                    </div>
                    <div className='profilePage'>
          <span className="text-primary" onClick={handleButtonClick} style={{ cursor: 'pointer' }}>
                </span>
                    </div>
                    <List>

                        {['LoginAsCustomer', 'LoginAsSupplier', 'LoginAsEmployee','RegisterAsCustomer', 'RegisterAsSupplier','RegisterAsEmployee'].map((text, index) => (
                            <ListItem key={text} disablePadding sx={{ display: 'block' }}>
                                <ListItemButton
                                    sx={{
                                        minHeight: 48,
                                        justifyContent: open ? 'initial' : 'center',
                                        px: 2.5,
                                    }} onClick={index === 0 ? handleLoginAsCustomerClick : index === 1 ? handleLoginAsSupplierClick : index === 2 ? handleLoginAsEmployeeClick : index === 3 ? handleRegisterAsCustomerClick : index === 4 ? handleRegisterAsSupplierClick : index === 5 ? handleRegisterAsEmployeeClick : null}
                                >
                                    <ListItemIcon
                                        sx={{
                                            minWidth: 0,
                                            mr: open ? 3 : 'auto',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        {index === 0 || index ===1 || index === 2 ? <Avatar /> : index === 3 || index === 4 || index === 5? <Avatar /> : null}
                                    </ListItemIcon>
                                    <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                    <Divider />
                </Drawer>
            </Box>

            <main style={{ height: 'calc(100vh - 64px)', overflowY: 'auto' }}>
                {!changed ?(<div>
                <Box
                    sx={{
                        bgcolor: 'background.paper',
                        pt: 8,
                        pb: 6,
                    }}>
                    <div align="right" className="Checkout">
                        <button className="button" onClick={handleCheckoutButtonClick}>Check Out</button>
                    </div>

                    <Container maxWidth="sm">

                        <Typography
                            component="h4"
                            variant="h3"
                            align="center"
                            color="text.primary"
                            gutterBottom
                        >

                            <p> <br/></p>
                            Yours Favourites are here.....
                        </Typography>

                        <link rel="stylesheet" href="search_home.css"/>
                        <div className="search-box">
                            <input type="text" id="searchInput" className="search-input1" placeholder="Enter your search term..." onChange={(e) => searchIt(e.target.value)}/>
                            {/* <button className="search-button" onClick={handleSearchButtonClick}>Search for Products</button> */}
                        </div>


                    </Container>
                </Box>





                <p align='center' h2 = 'text'>
                    <blink>Top Sold products...</blink>
                </p>


                <Container sx={{ py: 8 }} maxWidth="md">
                    {/* End hero unit */}
                    <Grid container spacing={4}>
                        {cardsForTopSoldProducts.map((card) => (
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

                                        image = {card.PICTURE}
                                    />
                                    <CardContent sx={{ flexGrow: 1 }}>
                                        <Typography gutterBottom variant="h5" component="h1">
                                            {card.P_NAME}<br/>
                                            Price: $ {card.PRICE} <br/>
                                            {card.DISCOUNT? <p>Discount: {card.DISCOUNT}%</p>:null}
                                        </Typography>
                                        <Typography>

                                        </Typography>

                                    </CardContent>
                                    <CardActions>
                                        <Button size="small" onClick={()=>handleWishListButtonClick(card.P_ID)}>WishList</Button>
                                        <Button size="small" onClick={()=>handleDetailsButtonClick(card.P_ID)}>Details</Button>
                                        <Button size="small" onClick={()=>handleAddToCartButtonClick(card.P_ID)}>Add to Cart</Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Container>

                <p align='center' h2 = 'text'>
                    <blink>Top rated products....</blink>
                </p>

                <Container sx={{ py: 8 }} maxWidth="md">
                    {/* End hero unit */}
                    <Grid container spacing={4}>
                        {cardsForTopRatedProducts.map((card) => (
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
                                        image = {card.PICTURE}
                                    />
                                    <CardContent sx={{ flexGrow: 1 }}>
                                        <Typography gutterBottom variant="h5" component="h2">
                                            {card.P_NAME}<br/>
                                            Price: ${card.PRICE} <br/>
                                            {card.DISCOUNT? <p>Discount: {card.DISCOUNT}%</p>:null}
                                        </Typography>
                                        <Typography>
                                        </Typography>

                                    </CardContent>
                                    <CardActions>
                                        <Button size="small" onClick={()=>handleWishListButtonClick(card.P_ID)}>WishList</Button>
                                        <Button size="small" onClick={()=>handleDetailsButtonClick(card.P_ID)}>Details</Button>
                                        <Button size="small" onClick={()=>handleAddToCartButtonClick(card.P_ID)}>In Cart</Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Container></div>
                ):(<div>
                    <Box
                    sx={{
                        bgcolor: 'background.paper',
                        pt: 8,
                        pb: 6,
                    }}>
                    <div align="right" className="Checkout">
                        <button className="button" onClick={handleCheckoutButtonClick}>Check Out</button>
                    </div>

                    <Container maxWidth="sm">

                        <Typography
                            component="h4"
                            variant="h3"
                            align="center"
                            color="text.primary"
                            gutterBottom
                        >

                            <p> <br/></p>
                            Yours searched products are here...
                        </Typography>

                        <link rel="stylesheet" href="search_home.css"/>
                        <div className="search-box">
                            <input type="text" id="searchInput" className="search-input1" placeholder="Enter your search term..." onChange={(e) => searchIt(e.target.value)}/>
                        </div>


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
                                        <Typography gutterBottom variant="h5" component="h2">
                                            {card.P_NAME}<br/>
                                            {card.PRICE}<br/>
                                            {card.RATING}
                                        </Typography>
                                        <Typography>
                                        </Typography>

                                    </CardContent>
                                    <CardActions>
                                        <Button size="small" onClick={()=>handleWishListButtonClick(card.P_ID)}>WishList</Button>
                                        <Button size="small" onClick={()=>handleDetailsButtonClick(card.P_ID)}>Details</Button>
                                        <Button size="small" onClick={()=>handleAddToCartButtonClick(card.P_ID)}>Add to Cart</Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                    </Container>
                </div>)}
            </main>



            {/* Footer */}
            <Box sx={{ bgcolor: 'background.paper', p: 6 }} component="footer">
                <Typography variant="h6" align="center" gutterBottom>
                    For any necessary information, please contact us : 01700000000
                </Typography>
                <Typography
                    variant="subtitle1"
                    align="center"
                    color="text.secondary"
                    component="p"
                >
                    Lets start with our products.....
                </Typography>
                <Copyright />
            </Box>


        </ThemeProvider>
    );

}
