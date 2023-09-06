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
          <Route path="/Trial" element={<Album />} />
          <Route path="/searchedProduct" element={<SearchedProductData />} />
          <Route path="/productDetails" element={<ProductDetails />} />
          <Route path="/Educational" element={<EducationalProducts/>} />
        </Routes>
      </supplierIdContext.Provider>
    </Router>
  );
}

export default App;






