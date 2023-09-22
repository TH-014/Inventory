import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate} from "react-router-dom";
import {
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { storage } from "../firebaseConfig";
import { v4 } from "uuid";
import styled from 'styled-components';

let imageurl = "default";

function EditProduct() {
  let callAuth = false;
  const location = useLocation();
  const productDetailsData = location.state && location.state.productData; // Check for undefined
  const editToken = location.state && location.state.editToken;
  const navigate = useNavigate();
  const [imageUpload, setImageUpload] = useState(null);


  // common for all types of products
  const [rootCategories, setRootCategories] = useState([]);
  const [selectedRootCategory, setSelectedRootCategory] = useState(productDetailsData?.TYPE);
  const [productId, setProductId] = useState(productDetailsData?.P_ID);
  const [productName, setProductName] = useState(productDetailsData?.P_NAME);
  // const [productSize, setProductSize] = useState("");
  // const [productWeight, setProductWeight] = useState("");
  // const [productTemp, setProductTemp] = useState("");
  // const [productQuantity, setProductQuantity] = useState("");
  const [productPrice, setProductPrice] = useState(productDetailsData?.PRICE);
  const [productDiscount, setProductDiscount] = useState(productDetailsData?.DISCOUNT);

  const [productImage, setProductImage] = useState(productDetailsData?.PICTURE);

  const [productDescription, setProductDescription] = useState(productDetailsData?.DESCRIPTION);
  // specialfeature
  const [educationalLevel, setEducationalLevel] = useState(productDetailsData?.LEVEL);
  const [fashionMadeOf, setFashionMadeOf] = useState(productDetailsData?.MADE_OF);
  const [fashionColor, setFashionColor] = useState(productDetailsData?.COLOR);
  const [fashionSize, setFashionSize] = useState(productDetailsData?.SIZE);
  const [productionDate, setProductionDate] = useState(productDetailsData?.PRODUCTION_DATE);
  const [ExpiaryDate, setExpiaryDate] = useState(productDetailsData?.EXPIARY_DATE);
  const [IT_ram, setIT_ram] = useState(productDetailsData?.["RAM(GB)"]);
  const [IT_storage, setIT_storage] = useState(productDetailsData?.["STORAGE(GB)"]);
  const [IT_processor, setIT_processor] = useState(productDetailsData?.["PROCESSOR(GHZ)"]);
  const [Toy_color, setToy_color] = useState(productDetailsData?.COLOR);
  const [Toy_level, setToy_level] = useState(productDetailsData?.LEVEL);
  const [s_id, setS_id] = useState("");

  const ButtonWrapper = styled.div`
  display: flex;
    justify-content: space-between;
`;

  const HomeButton = styled.button`
  background-color: #3498db;
  color: #fff;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
    width: 140px;
  cursor: pointer;
  font-size: 16px;
  margin: 10px;
    float: left;
  &:hover {
    background-color: #2980b9;
  }
`;

  useEffect(() => {
    async function fetchRootCategories() {
      try {
        const response = await axios.get("http://localhost:8000/rootCategories");
        setRootCategories(response.data);
      } catch (err) {
        console.error("Error fetching root categories:", err);
      }
    }
    fetchRootCategories();
    if(callAuth)
      return;
    console.log('Inside useEffect of profile of supplier.');
    async function checkLoginStatus() {
      try {
        const authRes = await axios.get('http://localhost:8000/auth/supplier', {headers: {Authorization: `${localStorage.getItem('token')}`}});
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
        callAuth = false;
        console.log('Authorized.', res.data.id);
        setS_id(res.data.id);
        // navigate('/ProfileOfSupplier');
      }
    });
  }, []);

  ref(storage, "product/");
  const uploadFile = (newImg) => {
    // if (imageUpload == null) return;
    return new Promise((resolve, reject) => {
      const imageRef = ref(storage, `product/${newImg.name + v4()}`);
      uploadBytes(imageRef, newImg).then((snapshot) => {
        getDownloadURL(snapshot.ref).then((url) => {
          console.log(url); // this is the url of the uploaded image
          // setProductImage(url);
          imageurl = url;
          // console.log(typeof url);
          console.log('this is the url string', imageurl);
          resolve(url);
        }).catch((err) => {
          imageurl = "error";
          reject("Error while getting download url:", err);
        });
      });
    });
  };

  const imageUploadHandler = async (newImg) => {
      
      try {
        setImageUpload(newImg);
        if (newImg) { // Check if newImg is truthy (i.e., not null or undefined)
          const req_url = await uploadFile(newImg);
          console.log(req_url);
          setProductImage(req_url);
        }
        else{
          alert("No image selected");
        }
      } catch (error) {
        alert("Error while uploading image. Please try again.");
        console.error("Error while uploading image:", error);
      }
  }

  if(editToken?.edit !== true)
  {
      return (
        <div align="center" className="error">
          <h2>Access Denied!</h2><hr/>
          <p>Go back to
            <a href="/"> Home page.</a></p>
        </div>
    );
  }

  const handleSubmit = async () => {
    try {
         console.log('Sending request to edit product');
      // const req_url = await uploadFile();
      // console.log(req_url);
      console.log('Sending request to add product', imageurl);
      const response = await axios.post("http://localhost:8000/editProduct", { //server side code needs to be wriiten
      productImage,
      productId,
      productName,
      // productSize,
      // productWeight,
      // productQuantity,
      productPrice,
      productDiscount,
      // productTemp,
      productDescription,
      selectedRootCategory,
      educationalLevel,
      fashionMadeOf,
      fashionSize,
      fashionColor,
      productionDate,
      ExpiaryDate,
      IT_ram,
      IT_storage,
      IT_processor,
      Toy_color,
      Toy_level
      });
      console.log(response);
      if (response.status === 200) {
        console.log("Details saved Successfully!");
        navigate('/');
      }
      else
        {
            console.log("Response status: ",response.status);
        }
    } catch (error) {
      console.error("Error while adding product:", error);
    }
  };

  function handleHome() {
    // callAuth = false;
    // accessGranted = false;
    navigate('/');
  }

  return (
    <div className="add-product-container" style={{ height: 'calc(100vh - 64px)', overflowY: 'auto' }}>
      <ButtonWrapper>
        <HomeButton onClick={handleHome}>Back to Home</HomeButton>
      </ButtonWrapper>
      <h2 align="center">Edit Product<hr/></h2><br/>
      <div align="right">Product Name . . . . . . . . . . . . . . . . . . . . .:
      <input
      className="form-control"
      type="text"
      placeholder="Product Name"
      value={productName}
      onChange={(e) => setProductName(e.target.value)}
      style={{
        width: '80%',     // Set the width to 80% of the container
        marginLeft: 'auto',  // Auto margin on the left side to push it to the right
        marginRight: '0'    // No margin on the right side
      }}
    /></div>
    {/* <input
      className="form-control"
      type="text"
      placeholder="Product Size(in CC)"
      value={productSize}
      onChange={(e) => setProductSize(e.target.value)}
    />
     <input
      className="form-control"
      type="text"
      placeholder="Product Weight(in KG)"
      value={productWeight}
      onChange={(e) => setProductWeight(e.target.value)}
    />
    <input
      className="form-control"
      type="text"
      placeholder="Quantity"
      value={productQuantity}
      onChange={(e) => setProductQuantity(e.target.value)}
    /> */}
    <div align="right">Price . . . . . . . . . . . . . . . . . . . . . . . . . . . . :
    <input
      className="form-control"
      type="text"
      placeholder="Price"
      value={productPrice}
      onChange={(e) => setProductPrice(e.target.value)}
      style={{
        width: '80%',     // Set the width to 80% of the container
        marginLeft: 'auto',  // Auto margin on the left side to push it to the right
        marginRight: '0'    // No margin on the right side
      }}
    /></div>
    <div align="right">Discount . . . . . . . . . . . . . . . . . . . . . . . . . .:
    <input
      className="form-control"
      type="text"
      placeholder="Discount"
      value={productDiscount}
      onChange={(e) => setProductDiscount(e.target.value)}
      style={{
        width: '80%',     // Set the width to 80% of the container
        marginLeft: 'auto',  // Auto margin on the left side to push it to the right
        marginRight: '0'    // No margin on the right side
      }}
    /></div>
    {/* <input
      className="form-control"
      type="text"
      placeholder="Preferred Temperature"
      value={productTemp}
      onChange={(e) => setProductTemp(e.target.value)}
    /> */}
      <select onChange={(e) => setSelectedRootCategory(e.target.value)} disabled={selectedRootCategory.length>0}> 
        <option value={selectedRootCategory}>{selectedRootCategory}</option>
        {rootCategories.map((category) => (
          <option key={category.TYPE} value={category.TYPE}>
            {category.TYPE}
          </option>
        ))}
      </select>
      {selectedRootCategory==='EDUCATIONAL'?
        <div align="right">Level . . . . . . . . . . . . . . . . . . . . . . . . . . . . :
        <input
        className="form-control"
        type="text"
        placeholder="Level"
        value={educationalLevel}
        onChange={(e) => setEducationalLevel(e.target.value)}
        style={{
          width: '80%',     // Set the width to 80% of the container
          marginLeft: 'auto',  // Auto margin on the left side to push it to the right
          marginRight: '0'    // No margin on the right side
        }}
      /></div>
      :null}
      {selectedRootCategory==='GROCERY'?(
      <>
        <div align="right">Production Date . . . . . . . . . . . . . . . . . . . .:
        <input
        className="form-control"
         type="text"
         placeholder="Production Date"
         value={productionDate}
         onChange={(e) => setProductionDate(e.target.value)}
         style={{
          width: '80%',     // Set the width to 80% of the container
          marginLeft: 'auto',  // Auto margin on the left side to push it to the right
          marginRight: '0'    // No margin on the right side
        }}
      /></div>
      <div align="right">Expiary Date . . . . . . . . . . . . . . . . . . . . . . :
      <input
      className="form-control"
      type="text"
      placeholder="Expiary Date"
      value={ExpiaryDate}
      onChange={(e) => setExpiaryDate(e.target.value)}
      style={{
        width: '80%',     // Set the width to 80% of the container
        marginLeft: 'auto',  // Auto margin on the left side to push it to the right
        marginRight: '0'    // No margin on the right side
      }}
     /></div>
     </> 
      )
      :null}
      {selectedRootCategory==='FASHION'?(
      <>
       <div align="right">Made Of . . . . . . . . . . . . . . . . . . . . . . . . . .:
       <input
      className="form-control"
      type="text"
      placeholder="Made Of"
      value={fashionMadeOf}
      onChange={(e) => setFashionMadeOf(e.target.value)}
      style={{
        width: '80%',     // Set the width to 80% of the container
        marginLeft: 'auto',  // Auto margin on the left side to push it to the right
        marginRight: '0'    // No margin on the right side
      }}
    /></div>
    <div align="right">Color . . . . . . . . . . . . . . . . . . . . . . . . . . . . :
    <input
      className="form-control"
      type="text"
      placeholder="Color"
      value={fashionColor}
      onChange={(e) => setFashionColor(e.target.value)}
      style={{
        width: '80%',     // Set the width to 80% of the container
        marginLeft: 'auto',  // Auto margin on the left side to push it to the right
        marginRight: '0'    // No margin on the right side
      }}
    /></div>
    <div align="right">Size . . . . . . . . . . . . . . . . . . . . . . . . . . . . . :
    <input
      className="form-control"
      type="text"
      placeholder="Size"
      value={fashionSize}
      onChange={(e) => setFashionSize(e.target.value)}
      style={{
        width: '80%',     // Set the width to 80% of the container
        marginLeft: 'auto',  // Auto margin on the left side to push it to the right
        marginRight: '0'    // No margin on the right side
      }}
    /> </div>
     </> 
      )
      :null}

     {selectedRootCategory==='IT_PRODUCTS'?(
     <>
     <div align="right">Ram (GB) . . . . . . . . . . . . . . . . . . . . . . . . :
     <input
        className="form-control"
         type="text"
         placeholder="RAM"
         value={IT_ram}
         onChange={(e) => setIT_ram(e.target.value)}
         style={{
          width: '80%',     // Set the width to 80% of the container
          marginLeft: 'auto',  // Auto margin on the left side to push it to the right
          marginRight: '0'    // No margin on the right side
        }}
      /></div>
      <div align="right">Storage (GB) . . . . . . . . . . . . . . . . . . . . . .:
      <input
        className="form-control"
         type="text"
         placeholder="Storage"
         value={IT_storage}
         onChange={(e) => setIT_storage(e.target.value)}
         style={{
          width: '80%',     // Set the width to 80% of the container
          marginLeft: 'auto',  // Auto margin on the left side to push it to the right
          marginRight: '0'    // No margin on the right side
        }}
      /></div>
      <div align="right">Processor . . . . . . . . . . . . . . . . . . . . . . . . :
      <input
        className="form-control"
         type="text"
         placeholder="Processor"
         value={IT_processor}
         onChange={(e) => setIT_processor(e.target.value)}
         style={{
          width: '80%',     // Set the width to 80% of the container
          marginLeft: 'auto',  // Auto margin on the left side to push it to the right
          marginRight: '0'    // No margin on the right side
        }}
      /></div>
     </>)
       
      :null}

     {selectedRootCategory==='TOY'?(
      <>
        <div align="right">Color . . . . . . . . . . . . . . . . . . . . . . . . . . . . :
        <input
        className="form-control"
         type="text"
         placeholder="Color"
         value={Toy_color}
         onChange={(e) => setToy_color(e.target.value)}
         style={{
          width: '80%',     // Set the width to 80% of the container
          marginLeft: 'auto',  // Auto margin on the left side to push it to the right
          marginRight: '0'    // No margin on the right side
        }}
      /></div>
      <div align="right">Level . . . . . . . . . . . . . . . . . . . . . . . . . . . . :
      <input
      className="form-control"
      type="text"
      placeholder="Level"
      value={Toy_level}
      onChange={(e) => setToy_level(e.target.value)}
      style={{
        width: '80%',     // Set the width to 80% of the container
        marginLeft: 'auto',  // Auto margin on the left side to push it to the right
        marginRight: '0'    // No margin on the right side
      }}
     /></div>
     </> 
      )
      :null}
      <input
          type="file"
          onChange={(event) => {
            setImageUpload(event.target.files[0]);
          }}
      />
      <div align="right">Description . . . . . . . . . . . . . . . . . . . . . . .:
      <textarea placeholder="Enter product description..." value={productDescription} onChange={(e) => setProductDescription(e.target.value)} style={{
        width: '80%',     // Set the width to 80% of the container
        marginLeft: 'auto',  // Auto margin on the left side to push it to the right
        marginRight: '0'    // No margin on the right side
      }}></textarea></div><br/>
        <div style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ marginLeft: '200px', marginRight: '200px', marginTop: '20px'}}>
          <img
            src={productImage}
            alt="Uploaded"
            style={{ maxWidth: '100%', maxHeight: '500px' }}
          />
        </div>
        <div>
          <input
            type="file"
            onChange={(event) => {
              imageUploadHandler(event.target.files[0]);
            }}
          />
        </div>
      </div>
      <div align="center">
      <button onClick={handleSubmit} style={{
        width: '10%',     // Set the width to 80% of the container
        marginLeft: 'auto',  // Auto margin on the left side to push it to the right
        marginRight: '0'    // No margin on the right side
      }}>Save Details</button></div>
    </div>
  );
}

export default EditProduct;
