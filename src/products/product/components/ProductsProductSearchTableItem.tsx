import type { FC } from "react";
import { useContext } from 'react';

import { ProductsProductContext } from '../context/ProductsProductContext';
import { FormProductsProductInterface } from '../interfaces';
import { InputAmount } from "../../../common/components";

interface Props {
  value: FormProductsProductInterface;
}

export const ProductsProductSearchTableItem: FC<Props> = ({ value }) => {

  // * hooks
  const context = useContext(ProductsProductContext);
  if (!context) 
    throw new Error("ProductsProductSearchTableItem: ProductsProductContext must be used within an ProductsProductProvider");

  const { form, updateForm, calculateProfitMargin } = context;
  
  // * handles
  const handleClick = () => updateForm(value);
  
  return (
    <tr 
      key={value.id} 
      onClick={() => handleClick()}
      className={form.id === value.id ? "custom-table-select" : ""} 
      style={ value.status ? { cursor: "pointer" } : { textDecoration: "line-through 1px red ", cursor: "pointer" } }
    >
    {/* <td >
      { item.active
        ? <ButtonWithConfirm className={"btn btn-outline-danger btn-sm"} actionName={"x"} title={"Confirmación"} message={"Eliminar la Orden ¿Desea Continuar?"} onExecute={handleButtonDelete}/>
        : <div/>
      }
    </td> */}

    <td>
      {value.code}
    </td>

    <td className="text-capitalize">
      {value.name?.toLowerCase()}
    </td>

    <td>
      <InputAmount className="form-control form-control-sm" value={value.cost} readOnly={true}/>
    </td>

    <td>
      <InputAmount className="form-control form-control-sm" value={value.price} readOnly={true}/>
    </td>

    <td>
      <div className="d-flex align-items-center gap-1">
        <InputAmount className="form-control form-control-sm" value={calculateProfitMargin(value)} readOnly={true}/>
        %
      </div>
    </td>
  </tr>
  );
};
