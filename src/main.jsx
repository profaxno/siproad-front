import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// import App from './App.jsx'
// import { SalesOrderForm } from './sales/components/sales-order-form'
// import { SalesOrderTemplateForm  } from './sales/components/sales-order-template-form'
// import { SalesOrder } from './sales/components/SalesOrder'
import { SalesOrder } from './sales/components/SalesOrder'

createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <SalesOrder/>
  // </StrictMode>,
)
