import React from 'react';
import Layout from '../components/Layout/Layout';
import { useSearch } from '../context/search';

const Search = () => {
  const [values, setValues] = useSearch();

  return (
    <Layout title={'Search results'}>
      <div className="container">
        <h1>search result</h1>
        <h5>
          {values?.results?.length < 1
            ? 'No products found'
            : `found ${values?.results?.length}`}
        </h5>

        {/* Product cards */}
        <div className="row">
          {values?.results?.map((product) => (
            <div className="col-md-4 mb-3" key={product._id}>
              <div className="card">
                <img
                  src={`/api/product/product-photo/${product._id}`}
                  className="card-img-top"
                  alt={product.name}
                />
                <div className="card-body">
                  <h5 className="card-title">{product.name}</h5>
                  <p className="card-text">
                    {product.description.substring(0, 40)}...
                  </p>
                  <p className="card-text">₹ {product.price}</p>
                  <button className="btn btn-primary ms-1">Add to Cart</button>
                  <button className="btn btn-secondary ms-1">More Details</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Search;
