# MERN Retail Storefront & Admin Portal

**Assignment for AXIS Solutions — MERN Stack Internship**

---

## Project Overview

This is a full-stack retail system with two platforms:  

1. **Customer Storefront**: Browse products, manage cart, and place orders.  
2. **Admin Portal**: Manage products and orders (protected, only accessible by admin).

---

## Default Credentials

### Admin
- Email: `admin@admin.com`
- Password: `admin`

### Normal User
- Email: `k@k.com`
- Password: `nawaz`

---

## Features

### Customer Storefront
- Home / Catalog: view products in a grid with search.  
- Product Detail: image, name, price, description, quantity selector.  
- Cart: add, update, remove items; shows subtotal, tax, and total.  
- Checkout: capture customer info, place orders, and show success screen with order ID.  

### Admin Portal
- Auth: admin login and logout; protected routes.  
- Product Management: list, create, edit, activate/deactivate; upload single product image.  
- Orders Management: list with filters (status/date), view order details, update status.  
- Dashboard: cards for today’s orders, revenue, low stock.

---

## Technologies Used

- **Frontend:** React, Tailwind CSS  
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB  
- **Auth:** JWT, Google OAuth (optional)  
- **Payment:** Braintree sandboxxxx
- **Other:** Axios, React Router, React Toastify, Concurrently

---

## Setup Instructions

1. **Clone the repository**  
```bash
git clone https://github.com/KhanNawazShariff/MERN-stack-CRUD-operation.git
cd MERN-stack-CRUD-operation
