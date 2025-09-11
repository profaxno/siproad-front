import { useContext } from "react";
import type { FC } from "react";
import { Navigate, Route, Routes } from "react-router";

import { Message } from "../../common/components/Message";

import { SiproadNavbar } from "../components/SiproadNavbar";
import { SiproadPublicRoute } from "./SiproadPublicRoute";
import { SiproadPrivateRoute } from "./SiproadPrivateRoute";
import { ApolloWrapper } from "../graphql/ApolloWrapper";

import { AuthContext } from "../../auth/context/AuthContext";
import { LoginPage } from "../../auth/pages/LoginPage";

import { ProductsNavbar } from "../../products/common/components/ProductsNavbar";
import { ProductsProductProvider } from "../../products/product/context/ProductsProductProvider";
import { ProductsProductPage } from "../../products/product/pages/ProductsProductPage";

import { SalesNavbar } from "../../sales/common/components/SalesNavbar";
import { SalesOrderProvider } from "../../sales/order/context/SalesOrderProvider";
import { SalesOrderPage } from "../../sales/order/pages/SalesOrderPage";

export const SiproadRouter: FC = () => {
  
  const context = useContext(AuthContext);
  if (!context) 
    throw new Error("SiproadRouter: AuthContext must be used within an AuthProvider");

  const { screenMessage, resetScreenMessage } = context;

  return (
    <>
      <Routes>

        <Route path="/login" element={
          <SiproadPublicRoute>
            <LoginPage />
          </SiproadPublicRoute>
        } />

        <Route path="/*" element={
          <SiproadPrivateRoute>
            <Navigate to="/sales" />
          </SiproadPrivateRoute>
        } />

        <Route path="/sales/*" element={
          <SiproadPrivateRoute>
            <SiproadNavbar />
            <SalesNavbar />
            <ApolloWrapper>
              <SalesOrderProvider>
                <SalesOrderPage />
              </SalesOrderProvider>
            </ApolloWrapper>
          </SiproadPrivateRoute>
        } />

        <Route path="/products/*" element={
          <SiproadPrivateRoute>
            <SiproadNavbar />
            <ProductsNavbar />
            <ApolloWrapper>
              <ProductsProductProvider>
                <ProductsProductPage />
              </ProductsProductProvider>
            </ApolloWrapper>
          </SiproadPrivateRoute>
        } />

        {/* <Route path="/sales/customers" element={
          <SiproadPrivateRoute>
            <SiproadNavbar />
            <SalesNavbar />
          </SiproadPrivateRoute>
        } /> */}

      </Routes>

      <Message screenMessage={screenMessage} onResetScreenMessage={resetScreenMessage} />
    </>
  );
};
