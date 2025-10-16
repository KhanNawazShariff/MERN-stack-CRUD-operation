import React from "react";
import Layout from "./../components/Layout/Layout";
import { BiMailSend, BiPhoneCall, BiSupport } from "react-icons/bi";

const Contact = () => {
  return (
    <Layout >
      <div className="row contactus d-flex justify-content-center align-items-center">
        <div className="col-md-6">
          <img
            src="/images/contactus.jpeg"
            alt="contactus"
            className="img-fluid"
            style={{ width: "100%" }}
          />
        </div>
        <div className="col-md-4">
          <h1 className="bg-dark p-2 text-white text-center">CONTACT US</h1>
          <p className="text-justify mt-2 text-center">
            Any query or info about the product? Feel free to call anytime — we
            are available 24x7.
          </p>
          <p className="mt-3 text-center">
            <BiMailSend /> <span>: www.help@ecommerceapp.com</span>
          </p>
          <p className="mt-3 text-center">
            <BiPhoneCall /> <span>: 012-3456789</span>
          </p>
          <p className="mt-3 text-center">
            <BiSupport /> <span>: 1800-0000-0000 (toll free)</span>
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
