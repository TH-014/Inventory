import axios from "axios";
import React, { useEffect, useState } from "react";
import supplierIdContext from "../Context/supplierContext";
import { useContext } from "react";

function AddProduct() {

  const {status,changeId} = useContext(supplierIdContext);
  

  // common for all types of products
  const [rootCategories, setRootCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

  const [selectedRootCategory, setSelectedRootCategory] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [productName, setProductName] = useState("");
  const [productSize, setProductSize] = useState("");
  const [productWeight, setProductWeight] = useState("");
  const [productTemp, setProductTemp] = useState("");
  const [productQuantity, setProductQuantity] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productDiscount, setProductDiscount] = useState("");
  const [productImage, setProductImage] = useState(null);
  const [productDescription, setProductDescription] = useState("");

  // specialfeature
  const [educationalLevel, setEducationalLevel] = useState("");
  const [fashionMadeOf, setFashionMadeOf] = useState("");
  const [fashionColor, setFashionColor] = useState("");
  const [fashionSize, setFashionSize] = useState("");
  //const [groceryProductionDate, setgroceryProductionDate] = useState("");
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

  // useEffect(() => {
  //   if (selectedRootCategory) {
  //     async function fetchSubCategories() {
  //       try {
  //         const response = await axios.get(
  //           `http://localhost:8000/subCategories?rootCategoryID=${selectedRootCategory}`
  //         );
  //         setSubCategories(response.data);
  //       } catch (err) {
  //         console.error("Error fetching subcategories:", err);
  //       }
  //     }

  //     fetchSubCategories();
  //   }
  // }, [selectedRootCategory]);

  const handleSubmit = async () => {
    try {
      changeId(43);
      console.log(status);
       
      const formData = new FormData();


      formData.append('PICTURE', productImage);


      formData.append('P_NAME', productName);
      formData.append('P_SIZE(CC)', productSize);
      formData.append('P_WEIGHT(KG)', productWeight);
      formData.append('QUANTITY', productQuantity);
      formData.append('PRICE', productPrice);
      formData.append('DISCOUNT', productDiscount);
      formData.append('PREFERRED_TEMP', productTemp);

      formData.append('DESCRIPTION', productDescription);

      formData.append('TYPE', selectedRootCategory);


      formData.append('LEVEL',educationalLevel );
      formData.append('MADE_OF', fashionMadeOf);
      formData.append('SIZE',fashionSize );
      formData.append('COLOR',fashionColor );
      formData.append('PRODUCTION_DATE',productionDate );
      formData.append('EXPIARY_DATE', ExpiaryDate);
      formData.append('RAM(GB)',IT_ram );
      formData.append('STORAGE(GB)',IT_storage );
      formData.append('PROCESSOR(GHZ)',IT_processor );
      formData.append('COLOR',Toy_color );
      formData.append('LEVEL',Toy_level );

      //formData.append('subCategory', selectedSubCategory);
      for (const entry of formData.entries()) {
        console.log(entry);
      }
      console.log(productImage,
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
        //s_id
        );

      //const response = await axios.post("http://localhost:8000/addProduct", formData);
      const response = await axios.post("http://localhost:8000/addProduct", {
        productImage,
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
        status
        //s_id
      });
      
      if (response.status === 200) {
        console.log("Product Added Successfully!");
      }
    } catch (error) {
      console.error("Error while adding product:", error);
    }
  };

  return (
    <div className="add-product-container">
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
    {/* <input
      className="form-control"
      type="text"
      placeholder="Level"
      value={educationalLevel}
      onChange={(e) => setEducationalLevel(e.target.value)}
    /> */}
    
    

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


      {/* {selectedRootCategory && (
        <select onChange={(e) => setSelectedSubCategory(e.target.value)}>
          <option value="">Select a subcategory</option>
          {subCategories.map((sub) => (
            <option key={sub.subCategoryID} value={sub.subCategoryID}>
              {sub.name}
            </option>
          ))}
        </select>
      )} */}

      <input type="file" onChange={(e) => setProductImage(e.target.files[0])} />
      <textarea placeholder="Enter product description..." onChange={(e) => setProductDescription(e.target.value)}></textarea>
      {/* <input
      className="form-control"
      type="text"
      placeholder="Your Supplier ID"
      value={s_id}
      onChange={(e) => setS_id(e.target.value)}
    /> */}
      <button onClick={handleSubmit}>Add Product</button>
    </div>
  );
}

export default AddProduct;
