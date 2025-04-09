import React from 'react'

const customerList = [
  { id: 1, name: "Jhossymer Maita" },
  { id: 2, name: "Ivan Perez" },
  { id: 3, name: "Carlos García" },
];

export const SalesOrderCmbCustomers = () => {

  // TODO: crear hook personalizado para manejar estado del combo clientes

  return (
      <select
        className="form-select"
        name="customer"
      >
        <option value="">Selecciona un cliente</option>
        {
          customerList.map( (customer) => (
            <option key={customer.id} value={customer.name}>{customer.name}</option>
          ))
        }
      </select>
  )
}
