import React from 'react'

import { Navigate, Route, Routes } from 'react-router'

import { SiproadPublicRoute } from './SiproadPublicRoute'
import { SiproadPrivateRoute } from './SiproadPrivateRoute'

import { AuthProvider } from '../../auth/context/AuthProvider'
import { ApolloWrapper } from '../../graphql/components/ApolloWrapper'

import { LoginPage } from '../../auth/pages/LoginPage'

import { SiproadNavbar } from '../components/SiproadNavbar'
import { SalesNavbar } from '../../sales/components/SalesNavbar'
import { SalesOrderProvider } from '../../sales/context'
import { SalesOrderPage } from '../../sales/pages/SalesOrderPage'

import { ProductsNavbar } from '../../products/components/ProductsNavbar'
import { ProductsProductProvider } from '../../products/context/ProductsProductProvider'
import { ProductsProductPage } from '../../products/pages/ProductsProductPage'

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
                <SalesOrderProvider>
                  <SalesOrderPage/>
                </SalesOrderProvider>
              </ApolloWrapper>

            </SiproadPrivateRoute>
          }/>

          <Route path="/sales/customers" element={
            <SiproadPrivateRoute>
              <SiproadNavbar/>
              <SalesNavbar/>
              {/* <div>Clientes en construccion</div> */}
            </SiproadPrivateRoute>
          }/>

          <Route path="/products/*" element={
            <SiproadPrivateRoute>
              
              <SiproadNavbar/>
              <ProductsNavbar/>

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
