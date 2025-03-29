import React from 'react'

import { Route, Routes, Navigate } from 'react-router'

import { ProductsNavbar } from '../components/ProductsNavbar'
import { ProductsProductPage } from '../pages/ProductsProductPage'

import { ApolloProvider } from "@apollo/client";
import client from "../../apolloClient";

export const ProductsRoutes = () => {
  return (
    <>
     <ProductsNavbar/>
     <div className="container">
        <Routes>
          <Route path="/products" element={ 

              <ProductsProductPage/>            
            
            // <SalesOrderPage/> 
          } />

          {/* <Route path="/customer" element={ <CustomerPage/> } /> */}
          <Route path="/" element={ <Navigate to="/products" /> } />
        </Routes>
      </div>
    </>
  )
}
