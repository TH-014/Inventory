import React, { useContext, useState } from 'react';

import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import ReturnLoginComponents from './ComponentOfClientPages/loginPage';
import ReturnDashBoardComponents from './ComponentOfClientPages/DashBoardPage';
import ReturnRegistrationComponents from './ComponentOfClientPages/RegistrationPage';
import LoginAsSupplierComponents from './ComponentOfClientPages/loginAsSupplier';
import RegistrationAsSupplierComponents from './ComponentOfClientPages/RegistrationPageOfSupplier';
import ProfileOfSupplierComponents from './ComponentOfClientPages/ProfileOfSupplier';
import LoginAsEmployeeComponents from './ComponentOfClientPages/loginAsEmployee';
import ProfileOfEmployeeComponents from './ComponentOfClientPages/ProfileOfEmployee';
import Album from './ComponentOfClientPages/Trial';
import AddProduct from './ComponentOfClientPages/AddProductPage';
import { useScrollTrigger } from '@mui/material';
import supplierIdContext from './Context/supplierContext';
import ProductDetails from './ComponentOfClientPages/productDetails';
import EducationalProducts from './ComponentOfClientPages/Educational';
import EmployeeRegistrationComponents from "./ComponentOfClientPages/RegistrationPageOfEmployee";
import OTP_Validate from "./ComponentOfClientPages/OTP_Validate";
import LoginAsAdminComponents from "./ComponentOfClientPages/loginAsAdmin";
import OTP_Validate_Admin from "./ComponentOfClientPages/OTP_Validate_Admin";
import ProfileOfAdminComponents from "./ComponentOfClientPages/ProfileOfAdmin";
import AddressForm from './ComponentOfClientPages/AddressForm';
import Checkout from './ComponentOfClientPages/Checkout';
import EnhancedTable from './ComponentOfClientPages/TableForEmployeeOfOrder';
import ITProducts from './ComponentOfClientPages/IT_Products';
import ShowReviews from './ComponentOfClientPages/showReviews';
import WishedProducts from './ComponentOfClientPages/myWishList';
import Grocery from "./ComponentOfClientPages/Grocery";
import Toy from "./ComponentOfClientPages/Toy";
import Fashion from "./ComponentOfClientPages/Fashion";
import EditProduct from "./ComponentOfClientPages/EditProduct";

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
          <Route path="/productDetails" element={<ProductDetails />} />
          <Route path="/Educational" element={<EducationalProducts/>} />
          <Route path="/RegisterAsEmployee" element={<EmployeeRegistrationComponents/>} />
          <Route path="/otp_validate" element={<OTP_Validate/>} />
          <Route path="/loginAsAdmin" element={<LoginAsAdminComponents />} />
          <Route path="/otp_validate_admin" element={<OTP_Validate_Admin/>} />
          <Route path="/ProfileOfAdmin" element={<ProfileOfAdminComponents />} />
          <Route path="/IT_Products" element={<ITProducts/>} />
          <Route path="/Grocery" element={<Grocery/>} />
          <Route path="/Toy" element={<Toy/>} />
          <Route path="/Fashion" element={<Fashion/>} />
          <Route path="/AddressForm" element={<AddressForm/>} />
          <Route path="/Checkout" element={<Checkout/>} />
          <Route path="/Table" element={<EnhancedTable />} />
          <Route path="/showReviews" element = {<ShowReviews/>} />
          <Route path="/myWishList" element = {<WishedProducts/>} />
          <Route path="/editProduct" element={<EditProduct />} />
        </Routes>
      </supplierIdContext.Provider>
    </Router>
  );
}

export default App;






