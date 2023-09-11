// import React from 'react';
// import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
// import logo from './logo.svg';
// import './App.css';
// import ReturnLoginComponents from './ComponentsOfClientPages/loginPage'; // equivalent to -> import Login from './pages/loginPage';
// //import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
// import ReturnDashBoardComponents from './ComponentsOfClientPages/DashBoardPage';
// import ReturnRegistrationComponents from './ComponentsOfClientPages/RegistrationPage';


// function App() {
//   return (
//     <div className="App">
//       <ReturnLoginComponents/>
//       {/* <ReturnRegistrationComponents/> */}
//     </div>
//   );
// }

// export default App;


////////////////////////////////////////// 

// import React from 'react';


import React, { useContext, useState } from 'react';

import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import ReturnDashBoardComponents from './ComponentOfClientPages/DashBoardPage';
import ReturnRegistrationComponents from './ComponentOfClientPages/RegistrationPage';
import ReturnLoginComponents from './ComponentOfClientPages/loginPage';
import LoginAsSupplierComponents from './ComponentOfClientPages/loginAsSupplier';
import RegistrationAsSupplierComponents from './ComponentOfClientPages/RegistrationPageOfSupplier';
import ProfileOfSupplierComponents from './ComponentOfClientPages/ProfileOfSupplier';
import LoginAsEmployeeComponents from './ComponentOfClientPages/loginAsEmployee';
import ProfileOfEmployeeComponents from './ComponentOfClientPages/ProfileOfEmployee';
import Album from './ComponentOfClientPages/Trial';
import AddProduct from './ComponentOfClientPages/AddProductPage';
import { useScrollTrigger } from '@mui/material';
import supplierIdContext from './Context/supplierContext';
import SearchedProductData from "./ComponentOfClientPages/searchedProduct";
import ProductDetails from './ComponentOfClientPages/productDetails';
import EducationalProducts from './ComponentOfClientPages/Educational';
import AddressForm from './ComponentOfClientPages/AddressForm';
import Checkout from './ComponentOfClientPages/Checkout';
import EnhancedTable from './ComponentOfClientPages/TableForEmployeeOfOrder';
import ITProducts from './ComponentOfClientPages/IT_Products';
import ShowReviews from './ComponentOfClientPages/showReviews';
import WishedProducts from './ComponentOfClientPages/myWishList';


function App() {
  const currentSupplierId = 0;
  const [status, setStatus] = useState(currentSupplierId);
  const changeId = (sid) => setStatus(sid);
  
  return (
    <Router>
      <supplierIdContext.Provider value={{ status, changeId }}> {/* Corrected provider name */}
        <Routes>
          <Route path="/login" element={<ReturnLoginComponents />} />
          <Route path="/Register" element={<ReturnRegistrationComponents />} />
          <Route path="/dashboard" element={<ReturnDashBoardComponents />} />
          <Route path="/loginAsSupplier" element={<LoginAsSupplierComponents />} />
          <Route path="/ProfileOfSupplier" element={<ProfileOfSupplierComponents />} />
          <Route path="/RegisterAsSupplier" element={<RegistrationAsSupplierComponents />} />
          <Route path="/loginAsEmployee" element={<LoginAsEmployeeComponents />} />
          <Route path="/ProfileOfEmployee" element={<ProfileOfEmployeeComponents />} />
          <Route path="/AddProduct" element={<AddProduct />} />
          <Route path="/" element={<Album />} />
          <Route path="/searchedProduct" element={<SearchedProductData />} />
          <Route path="/productDetails" element={<ProductDetails />} />
          <Route path="/Educational" element={<EducationalProducts/>} />
          <Route path="/IT_Products" element={<ITProducts/>} />
          <Route path="/AddressForm" element={<AddressForm/>} />
          <Route path="/Checkout" element={<Checkout/>} />
          <Route path="/Table" element={<EnhancedTable />} />
          <Route path = "/showReviews" element = {<ShowReviews/>} />
          <Route path = "/myWishList" element = {<WishedProducts/>} />
        </Routes>
      </supplierIdContext.Provider>
    </Router>
  );
}

export default App;


// export default App;

// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import ReturnDashBoardComponents from './ComponentsOfClientPages/DashBoardPage';
// import ReturnRegistrationComponents from './ComponentsOfClientPages/RegistrationPage';
// import ReturnLoginComponents from './ComponentsOfClientPages/loginPage';

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/login" element={<ReturnLoginComponents />} />
//         <Route path="/Register" element={<ReturnRegistrationComponents />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;


////////////////////////////////////////////////////////// MOYEN /////////////////////////////////
// import React from 'react';
// import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
// import Login from './ComponentOfClientPages/loginPage';

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/login" element={<Login />} />
//       </Routes>
//     </Router>
//   );
// }

//export default App;






