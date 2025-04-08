import React from 'react'

import { Navigate, Route, Routes } from 'react-router'

import { AuthProvider } from '../../auth/context/AuthProvider'
import { SiproadPublicRoute } from './SiproadPublicRoute'
import { SiproadPrivateRoute } from './SiproadPrivateRoute'
import { LoginPage } from '../../auth/pages/LoginPage'
import { SiproadNavbar } from '../components/SiproadNavbar'
// import { SalesRoutes } from '../../sales/routes/SalesRoutes'
// import { ProductsRoutes } from '../../products/routes/ProductsRoutes'
import { SalesNavbar } from '../../sales/components/SalesNavbar'

import { SalesOrderPage } from '../../sales/pages/SalesOrderPage'

import { ApolloProvider } from '@apollo/client'
import client from "../../apolloClient";
import { ApolloWrapper } from '../../graphql/components/ApolloWrapper'
import { ProductsProductPage } from '../../products/pages/ProductsProductPage'
import { ProductsProductProvider } from '../../products/context/ProductsProductProvider'
import { ProductsNavbar } from '../../products/components/product/ProductsNavbar'

export const SiproadRouter = () => {
  return (
    <>
      <AuthProvider>
        <Routes>

          <Route path="/login" element={
            <SiproadPublicRoute>
              <LoginPage/>
            </SiproadPublicRoute>
          }/>
          
          <Route path="/*" element={
            <SiproadPrivateRoute>
              <Navigate to="/sales" />  
            </SiproadPrivateRoute>
          }/>
          
          {/* <Route path="/sales" element={
            <SiproadPrivateRoute>
              <SiproadNavbar/>
              <SalesNavbar/>
            </SiproadPrivateRoute>
          }/> */}

          <Route path="/sales/*" element={
            <SiproadPrivateRoute>
                <SiproadNavbar/>
                <SalesNavbar/>
                <ApolloWrapper>  
                  <SalesOrderPage/>
                </ApolloWrapper>
            </SiproadPrivateRoute>
          }/>

          <Route path="/sales/customers" element={
            <SiproadPrivateRoute>
              <ApolloProvider client={client}>
                <SiproadNavbar/>
                <SalesNavbar/>
                {/* <div>Clientes en construccion</div> */}
              </ApolloProvider>
            </SiproadPrivateRoute>
          }/>

          <Route path="/products/*" element={
            <SiproadPrivateRoute>
              <SiproadNavbar/>
              <ProductsNavbar/>
              {/* <div>Productos en construccion</div> */}
              <ApolloWrapper>
                <ProductsProductProvider>
                  <ProductsProductPage/>
                </ProductsProductProvider>
              </ApolloWrapper>
            </SiproadPrivateRoute>
          }/>
          
          <Route path="/products/elements" element={
            <SiproadPrivateRoute>
              <SiproadNavbar/>
              <ProductsNavbar/>
              <div>Ingredientes en construccion</div>
            </SiproadPrivateRoute>
          }/>

        </Routes>
      </AuthProvider>
    </>
  )
}
