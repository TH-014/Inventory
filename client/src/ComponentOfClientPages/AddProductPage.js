import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { storage } from "../firebaseConfig";
import { v4 } from "uuid";

let imageurl = "default";

const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function AddProduct() {
  const [imageUpload, setImageUpload] = useState(null);


  // common for all types of products
  const [rootCategories, setRootCategories] = useState([]);
  const [selectedRootCategory, setSelectedRootCategory] = useState(null);
  const [productName, setProductName] = useState("");
  const [productSize, setProductSize] = useState("");
  const [productWeight, setProductWeight] = useState("");
  const [productTemp, setProductTemp] = useState("");
  const [productQuantity, setProductQuantity] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productDiscount, setProductDiscount] = useState("");

  const [productImage, setProductImage] = useState("");

  const [productDescription, setProductDescription] = useState("");
  // specialfeature
  const [educationalLevel, setEducationalLevel] = useState("");
  const [fashionMadeOf, setFashionMadeOf] = useState("");
  const [fashionColor, setFashionColor] = useState("");
  const [fashionSize, setFashionSize] = useState("");
  const [productionDate, setProductionDate] = useState("");
  const [ExpiaryDate, setExpiaryDate] = useState("");
  const [IT_ram, setIT_ram] = useState("");
  const [IT_storage, setIT_storage] = useState("");
  const [IT_processor, setIT_processor] = useState("");
  const [Toy_color, setToy_color] = useState("");
  const [Toy_level, setToy_level] = useState("");
  const [s_id, setS_id] = useState("");

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
  }, []);

  ref(storage, "product/");
  const uploadFile = () => {
    // if (imageUpload == null) return;
    return new Promise((resolve, reject) => {
      const imageRef = ref(storage, `product/${imageUpload.name + v4()}`);
      uploadBytes(imageRef, imageUpload).then((snapshot) => {
        getDownloadURL(snapshot.ref).then((url) => {
          console.log(url); // this is the url of the uploaded image
          // setProductImage(url);
          imageurl = url;
          console.log(typeof url);
          console.log('this is the url string', imageurl);
          resolve(url);
        }).catch((err) => {
          imageurl = "error";
          reject("Error while getting download url:", err);
        });
      });
    });
  };

  const handleSubmit = async () => {
    try {
      const req_url = await uploadFile();
      // console.log(req_url);
      console.log('Sending request to add product', imageurl);
      const response = await axios.post("http://localhost:8000/addProduct", {
        // productImage,
        imageurl,
        productName,
        productSize,
        productWeight,
        productQuantity,
        productPrice,
        productDiscount,
        productTemp,
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
        Toy_level,
        s_id
      });

      if (response.status === 200) {
        console.log("Product Added Successfully!");
      }
      else
        {
            console.log("Response status: ",response.status);
        }
    } catch (error) {
      console.error("Error while adding product:", error);
    }
  };

  return (
    <div className="add-product-container" style={{ height: 'calc(100vh - 64px)', overflowY: 'auto' }}>
      <h2>Add Product</h2>
      <input
      className="form-control"
      type="text"
      placeholder="Product Name"
      value={productName}
      onChange={(e) => setProductName(e.target.value)}
    />
    <input
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
    />
    <input
      className="form-control"
      type="text"
      placeholder="Price"
      value={productPrice}
      onChange={(e) => setProductPrice(e.target.value)}
    />
    <input
      className="form-control"
      type="text"
      placeholder="Discount"
      value={productDiscount}
      onChange={(e) => setProductDiscount(e.target.value)}
    />
    <input
      className="form-control"
      type="text"
      placeholder="Preferred Temperature"
      value={productTemp}
      onChange={(e) => setProductTemp(e.target.value)}
    />
      <select onChange={(e) => setSelectedRootCategory(e.target.value)}>
        <option value="">Select a root category</option>
        {rootCategories.map((category) => (
          <option key={category.TYPE} value={category.TYPE}>
            {category.TYPE}
          </option>
        ))}
      </select>
      {selectedRootCategory==='EDUCATIONAL'?
        <input
        className="form-control"
        type="text"
        placeholder="Level"
        value={educationalLevel}
        onChange={(e) => setEducationalLevel(e.target.value)}
      />
      :null}
      {selectedRootCategory==='GROCERY'?(
      <>
        <input
        className="form-control"
         type="text"
         placeholder="Production Date"
         value={productionDate}
         onChange={(e) => setProductionDate(e.target.value)}
      />
      <input
      className="form-control"
      type="text"
      placeholder="Expiary Date"
      value={ExpiaryDate}
      onChange={(e) => setExpiaryDate(e.target.value)}
     />
     </> 
      )
      :null}
      {selectedRootCategory==='FASHION'?(
      <>
       <input
      className="form-control"
      type="text"
      placeholder="Made Of"
      value={fashionMadeOf}
      onChange={(e) => setFashionMadeOf(e.target.value)}
    />
    <input
      className="form-control"
      type="text"
      placeholder="Color"
      value={fashionColor}
      onChange={(e) => setFashionColor(e.target.value)}
    />
    <input
      className="form-control"
      type="text"
      placeholder="Size"
      value={fashionSize}
      onChange={(e) => setFashionSize(e.target.value)}
    /> 
     </> 
      )
      :null}

     {selectedRootCategory==='IT_PRODUCTS'?(
     <>
     <input
        className="form-control"
         type="text"
         placeholder="RAM"
         value={IT_ram}
         onChange={(e) => setIT_ram(e.target.value)}
      />
      <input
        className="form-control"
         type="text"
         placeholder="Storage"
         value={IT_storage}
         onChange={(e) => setIT_storage(e.target.value)}
      />
      <input
        className="form-control"
         type="text"
         placeholder="Processor"
         value={IT_processor}
         onChange={(e) => setIT_processor(e.target.value)}
      />
     </>)
       
      :null}

     {selectedRootCategory==='TOY'?(
      <>
        <input
        className="form-control"
         type="text"
         placeholder="Color"
         value={Toy_color}
         onChange={(e) => setToy_color(e.target.value)}
      />
      <input
      className="form-control"
      type="text"
      placeholder="Level"
      value={Toy_level}
      onChange={(e) => setToy_level(e.target.value)}
     />
     </> 
      )
      :null}
      <input
          type="file"
          onChange={(event) => {
            setImageUpload(event.target.files[0]);
          }}
      />
      <textarea placeholder="Enter product description..." onChange={(e) => setProductDescription(e.target.value)}></textarea>
      <input
      className="form-control"
      type="text"
      placeholder="Your Supplier ID"
      value={s_id}
      onChange={(e) => setS_id(e.target.value)}
      />
      <button onClick={handleSubmit}>Add Product</button>
    </div>
  );
}

export default AddProduct;
