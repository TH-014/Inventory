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

const cards = [];  // This defines number of elements
const cards1 = ['a','b','c','d','e','f','g','h','i'];  // This defines number of elements

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function Album() {
  const [errorMessage,setErrorMessage]=useState('');
      
 
  // 

    
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
    const navigate = useNavigate();
    const handleButtonClick = async () => {


      try{
          const resFromServer = await axios.post('http://localhost:8000/Trial');
          console.log('here am i \n\n');
          console.log(resFromServer);
      
           if(resFromServer.status === 200){
            const productData = resFromServer.data;
            console.log(productData);
            // for(let i=0;i<productData.output.length;i++)
            // {
            //   cards.push(productData.output[i]);
              
            // }
            //console.log(userData.S_ID);
            //navigate('/ProfileOfSupplier',{ state : {userData}});
          }
          else {
            
            setErrorMessage(resFromServer.data.message || "Login failed!");
          }
        }catch(error)
        {
          console.log(error);
           setErrorMessage(error.message || "Something went wrong ! ");
        }  
      
      
      //navigate('/ProfileOfSupplier');
      alert('You clicked the third ListButton.');
    };
    const link = "data:image/jpeg;base64,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"   
    
  // useEffect(() => {
  //   async function fetchRootCategories() {
  //     try {
  //       const response = await axios.get("http://localhost:8000/rootCategories");
  //       setRootCategories(response.data);
  //     } catch (err) {
  //       console.error("Error fetching root categories:", err);
  //     }
  //   }

  //   fetchRootCategories();
  // }, []);
    
    // const categories = ['Electronics', 'Clothing', 'Groceries'];
    // setRootCategories(categories);
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
                      {/* {card.productName}
                      {card.productDescription} 
                      {card.productPrice}  */}
                    </Typography>
                    <Typography>
                      
                    </Typography>
                    <p>{}</p>
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
