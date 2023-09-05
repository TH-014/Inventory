import {useRoutes, useNavigate} from 'react-router-dom';
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
import { styled, useTheme } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import List from '@mui/material/List';
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
import * as search_home from "@emotion/react";

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

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function Album() {
    const [errorMessage,setErrorMessage]=useState('');
    const navigate = useNavigate();



    const [rootCategories, setRootCategories] = useState([]);
    const [selectedRootCategory, setSelectedRootCategory] = useState(null);
    const [productionDate, setProductionDate] = useState("");
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

        // try{
        //   const resFromServer = await axios.post('http://localhost:8000/Trial');
        //   console.log('here am i \n\n');
        //   //console.log(resFromServer.output);

        //    if(resFromServer.status === 200){
        //     const productData = resFromServer.data;
        //     console.log(productData.data.rows[0]);
        //     // for(let i=0;i<productData.output.length;i++)
        //     // {
        //     //   //cards.push(productData.output[i]);

        //     // }
        //     // //console.log(userData.S_ID);
        //     //navigate('/ProfileOfSupplier',{ state : {userData}});
        //   }
        //   else {

        //     setErrorMessage(resFromServer.data.message || "Login failed!");
        //   }
        // }catch(error)
        // {
        //   console.log(error);
        //    setErrorMessage(error.message || "Something went wrong ! ");
        // }


        //navigate('/ProfileOfSupplier');
        alert('You clicked the third ListButton.');
    };
    const link = "https://firebasestorage.googleapis.com/v0/b/inventory-b0b4e.appspot.com/o/extras%2Fgift-box.jpg?alt=media&token=6ecb85a3-938f-407b-a0ce-95fd67a25f93"

    useEffect(() => {
        async function fetchRootCategories() {
            try {


                const resFromServer = await axios.get('http://localhost:8000/Trial',{ headers: { Authorization: `${localStorage.getItem('token')}`}});
                setRootCategories(resFromServer.data);
                console.log('here am i \n\n');
                //console.log(resFromServer.output);

                if(resFromServer.status === 200){
                    const productData = resFromServer.data;

                    console.log(productData.data.rows[0]);
                    console.log(productData.data.rows.length);
                    cards = productData.data.rows;
                    // for(let i=0;i<productData.data.rows.length;i++)
                    // {
                    //     cards.push(productData.data.rows[i]);
                    //     console.log(productData.data.rows[i]);
                    //     console.log('products in the cards is :',cards[i]);
                    //
                    // }
                    // //console.log(userData.S_ID);
                    //navigate('/ProfileOfSupplier',{ state : {userData}});
                }
                else {

                    setErrorMessage(resFromServer.data.message || "Login failed!");
                }






                // const response = await axios.get("http://localhost:8000/Trial");
                // setRootCategories(response.data);
            } catch (err) {
                console.error("Error fetching root categories:", err);
            }
        }

        fetchRootCategories();
    }, []);

    // const categories = ['Electronics', 'Clothing', 'Groceries'];
    let searchBoxInput = '';
    async function handleSearchButtonClick() {
        searchBoxInput = document.getElementById('searchInput').value;
        // alert(`Searching for ${searchBoxInput}...`);
        console.log(`Searching for ${searchBoxInput}...`);
        const resFromServer = await axios.post('http://localhost:8000/search',{searchBoxInput});
        // console.log(resFromServer);
        const productData = resFromServer.data;
         navigate('/searchedProduct',{ state : {productData}});
    }

    // setRootCategories(categories);
    return(

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

            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <AppBar1 position="fixed" open={open}>
                    <Toolbar>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            onClick={handleDrawerOpen}
                            edge="start"
                            sx={{
                                marginRight: 5,
                                ...(open && { display: 'none' }),
                            }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" noWrap component="div">
                            Mini variant drawer
                        </Typography>
                    </Toolbar>
                </AppBar1>
                <Drawer variant="permanent" open={open}>
                    <DrawerHeader>
                        <IconButton onClick={handleDrawerClose}>
                            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                        </IconButton>
                    </DrawerHeader>
                    <Divider />
                    <List>
                        {['Login', 'My Profile', 'About Us', 'Discounts','newitem'].map((text, index) => (
                            <ListItem key={text} disablePadding sx={{ display: 'block' }}>
                                <ListItemButton
                                    sx={{
                                        minHeight: 48,
                                        justifyContent: open ? 'initial' : 'center',
                                        px: 2.5,
                                    }}
                                >
                                    <ListItemIcon
                                        sx={{
                                            minWidth: 0,
                                            mr: open ? 3 : 'auto',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                                    </ListItemIcon>
                                    <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                    <Divider />
                    <List>
                        {['All mail', 'Trash', 'Spam'].map((text, index) => (
                            <ListItem key={text} disablePadding sx={{ display: 'block' }}>
                                <ListItemButton
                                    sx={{
                                        minHeight: 48,
                                        justifyContent: open ? 'initial' : 'center',
                                        px: 2.5,
                                    }}
                                >
                                    <ListItemIcon
                                        sx={{
                                            minWidth: 0,
                                            mr: open ? 3 : 'auto',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                                    </ListItemIcon>
                                    <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </Drawer>
            </Box>
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
                            variant="h2"
                            align="center"
                            color="text.primary"
                            gutterBottom
                        >
                            Album layout
                        </Typography>
                        <link rel="stylesheet" href="search_home.css"/>
                        <div className="search-box">
                            <input type="text" id="searchInput" className="search-input" placeholder="Enter your search term..."/>
                                <button className="search-button" onClick={handleSearchButtonClick}>Search</button>
                        </div>
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
                            <Button variant="contained">Main call to action</Button>
                            <Button variant="outlined">Secondary action</Button>
                        </Stack>
                    </Container>
                </Box>
                <Container sx={{ py: 8 }} maxWidth="md">
                    {/* End hero unit */}
                    <Grid container spacing={4}>
                        {cards.map((card) => (
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
                                        image = {link}
                                    />
                                    <CardContent sx={{ flexGrow: 1 }}>
                                        <Typography gutterBottom variant="h5" component="h2">
                                            {/* {cards[0][0]}
                      {card.productDescription}
                      {card.productPrice}  */}
                                        </Typography>
                                        <Typography>
                                            <p>Price: 1000</p>
                                        </Typography>

                                    </CardContent>
                                    <CardActions>
                                        <Button size="small" onClick={handleButtonClick}>View</Button>
                                        <Button size="small">Edit</Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
                <p align='center' h2 = 'text'>
                    Top rated products....
                </p>
                <Container sx={{ py: 8 }} maxWidth="md">
                    {/* End hero unit */}
                    <Grid container spacing={4}>
                        {cards1.map((card) => (
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
                                        image="https://source.unsplash.com/photos?wallpapers=5"
                                        //image = {link}
                                    />
                                    <CardContent sx={{ flexGrow: 1 }}>
                                        <Typography gutterBottom variant="h5" component="h2">
                                            Heading
                                        </Typography>
                                        <Typography>
                                            This is a media card. You can use this section to describe the
                                            content.
                                        </Typography>
                                        <p>Price: 1000</p>
                                    </CardContent>
                                    <CardActions>
                                        <Button size="small" onClick={handleButtonClick}>View</Button>
                                        <Button size="small">Edit</Button>
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
}