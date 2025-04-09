import React from 'react'

import { Route, Routes, Navigate } from 'react-router'

import { SalesNavbar } from '../components/SalesNavbar'
import { SalesOrderPage } from '../pages/SalesOrderPage'

import { ApolloProvider } from "@apollo/client";
import client from "../../apolloClient";
import { SalesPage } from '../pages/SalesPage';

export const SalesRoutes = () => {
  return (
    <>
      
      <div className="container">
        <Routes>

          <Route path="/sales/orders" element={
            <ApolloProvider client={client}>
              <SalesOrderPage/>
            </ApolloProvider>
          } />

          {/* <Route path="/customer" element={ <CustomerPage/> } /> */}
          {/* <Route path="/" element={ <Navigate to="/orders" /> } /> */}
        </Routes>
      </div>
    </>
  )
}
