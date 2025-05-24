import type { FC } from "react";
import { useContext } from 'react';

import { InventoryProductContext } from '../context/InventoryProductContext';
import { FormInventoryProductInterface } from '../interfaces';
import { InputAmount } from "../../../common/components";

interface Props {
  value: FormInventoryProductInterface;
}

export const InventoryProductSearchTableItem: FC<Props> = ({ value }) => {

  // * hooks
  const context = useContext(InventoryProductContext);
  if (!context) 
    throw new Error("InventoryProductSearchTableItem: InventoryProductContext must be used within an InventoryProductProvider");

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
