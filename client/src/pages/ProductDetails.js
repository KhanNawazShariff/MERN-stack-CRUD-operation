// src/pages/ProductDetails.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import axios from 'axios';

const ProductDetails = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);

  const getProduct = async () => {
    try {
      const { data } = await axios.get(`/api/product/get-product/${slug}`);
      setProduct(data?.product);
    } catch (error) {
      console.log("Error fetching product details:", error);
    }
  };

  useEffect(() => {
    if (slug) getProduct();
  }, [slug]);

  return (
    <Layout title={product?.name}>
      <div className="container mt-4">
        {product ? (
          <div className="row">
            <div className="col-md-6">
              <img
                src={`/api/product/product-photo/${product._id}`}
                alt={product.name}
                className="img-fluid"
              />
            </div>
            <div className="col-md-6">
              <h2>{product.name}</h2>
              <p>{product.description}</p>
              <h4>₹ {product.price}</h4>
              <button className="btn btn-primary mt-2">Add to Cart</button>
            </div>
          </div>
        ) : (
          <h3>Loading...</h3>
        )}
      </div>
    </Layout>
  );
};

export default ProductDetails;
