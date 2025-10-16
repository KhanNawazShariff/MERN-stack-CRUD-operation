import React, { useState, useEffect } from "react";
import AdminMenu from "../../components/Layout/AdminMenu";
import Layout from "../../components/Layout/Layout";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const perPage = 15;

  const getProducts = async (pageNumber = 1) => {
    try {
      // Assuming your backend has /product-list/:page for paginated products
      const { data } = await axios.get(`/api/product/product-list/${pageNumber}`);
      if (data?.success) {
        setProducts(data.products);
        // Also fetch total count for pagination
        const countRes = await axios.get("/api/product/product-count");
        if (countRes.data?.success) {
          setTotalProducts(countRes.data.total);
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while fetching products");
    }
  };

  useEffect(() => {
    getProducts(page);
  }, [page]);

  // Delete product
  const handleDelete = async (pid) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      const { data } = await axios.delete(`/api/product/delete-product/${pid}`);
      if (data.success) {
        toast.success("Product deleted successfully");
        // Reload products on current page
        getProducts(page);
      } else {
        toast.error(data.message || "Failed to delete product");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error deleting product");
    }
  };

  // Calculate total pages for pagination
  const totalPages = Math.ceil(totalProducts / perPage);

  return (
    <Layout>
      <div className="row">
        <div className="col-md-3">
          <AdminMenu />
        </div>
        <div className="col-md-9">
          <h1 className="text-center mb-4">All Products</h1>
          <table className="table table-striped table-bordered">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Description</th>
                <th>Price (₹)</th>
                <th style={{ width: "180px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center">No products found.</td>
                </tr>
              ) : (
                products.map((p, index) => (
                  <tr key={p._id}>
                    <td>{(page - 1) * perPage + index + 1}</td>
                    <td>{p.name}</td>
                    <td>{p.description?.substring(0, 50)}{p.description && p.description.length > 50 ? "..." : ""}</td>
                    <td>{p.price}</td>
                    <td>
                      <Link
                        to={`/dashboard/admin/product/${p.slug}`}
                        className="btn btn-sm btn-primary me-2"
                      >
                        Update
                      </Link>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(p._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Pagination */}
          <nav>
            <ul className="pagination justify-content-center">
              <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                <button
                  className="page-link"
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                >
                  Prev
                </button>
              </li>

              {[...Array(totalPages).keys()].map((num) => (
                <li
                  key={num + 1}
                  className={`page-item ${page === num + 1 ? "active" : ""}`}
                >
                  <button
                    className="page-link"
                    onClick={() => setPage(num + 1)}
                  >
                    {num + 1}
                  </button>
                </li>
              ))}

              <li className={`page-item ${page === totalPages ? "disabled" : ""}`}>
                <button
                  className="page-link"
                  onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                >
                  Next
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </Layout>
  );
};

export default Products;
