import { useContext } from "react";
import type { FC } from "react";
import { Navigate, Route, Routes } from "react-router";

import { AuthContext } from "../../auth/context/AuthContext";
import { SiproadPublicRoute } from "./SiproadPublicRoute";
import { SiproadPrivateRoute } from "./SiproadPrivateRoute";

import { LoginPage } from "../../auth/pages/LoginPage";
import { Message } from "../../common/components/Message";

import { ApolloWrapper } from "../graphql/ApolloWrapper";

import { SiproadNavbar } from "../components/SiproadNavbar";
import { SalesNavbar } from "../../sales/components/SalesNavbar";
import { SalesOrderProvider } from "../../sales/context/SalesOrderContext";
import { SalesOrderPage } from "../../sales/pages/SalesOrderPage";
// import { SalesOrderProvider } from "../../sales/context";
// import { SalesOrderPage } from "../../sales/pages/SalesOrderPage";

// import { ProductsNavbar } from "../../products/components/ProductsNavbar";
// import { ProductsProductProvider } from "../../products/context/ProductsProductProvider";
// import { ProductsProductPage } from "../../products/pages/ProductsProductPage";


export const SiproadRouter: FC = () => {
  
  const context = useContext(AuthContext);
  if (!context) 
    throw new Error("AuthContext must be used within an AuthProvider");

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

        {/* <Route path="/sales/customers" element={
          <SiproadPrivateRoute>
            <SiproadNavbar />
            <SalesNavbar />
          </SiproadPrivateRoute>
        } /> */}

        {/* <Route path="/products/*" element={
          <SiproadPrivateRoute>
            <SiproadNavbar />
            <ProductsNavbar />
            <ApolloWrapper>
              <ProductsProductProvider>
                <ProductsProductPage />
              </ProductsProductProvider>
            </ApolloWrapper>
          </SiproadPrivateRoute>
        } /> */}

        {/* <Route path="/products/elements" element={
          <SiproadPrivateRoute>
            <SiproadNavbar />
            <ProductsNavbar />
          </SiproadPrivateRoute>
        } /> */}

      </Routes>

      <Message screenMessage={screenMessage} onResetScreenMessage={resetScreenMessage} />
    </>
  );
};
