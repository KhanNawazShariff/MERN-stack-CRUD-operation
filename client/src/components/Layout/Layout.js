import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { Helmet } from "react-helmet";
import { Toaster } from "react-hot-toast"; // ✅ Corrected import

const Layout = ({ children, title, description, keywords, author }) => {
  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <meta
          name="description"
          content={description || Layout.defaultProps.description}
        />
        <meta
          name="keywords"
          content={keywords || Layout.defaultProps.keywords}
        />
        <meta name="author" content={author || Layout.defaultProps.author} />
        <title>{title || Layout.defaultProps.title}</title>
      </Helmet>

      <Header />
      <main style={{ minHeight: "70vh" }}>
        <Toaster /> {/* ✅ Hot-toast component for toast notifications */}
        {children}
      </main>
      <Footer />
    </div>
  );
};

Layout.defaultProps = {
  title: "Ecommerce App - Shop Now",
  description: "MERN stack project",
  keywords: "mern, react, node, mongodb",
  author: "nawaz",
};

export default Layout;
