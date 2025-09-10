import type { FC } from "react";
import { useEffect, useContext, useState, ChangeEvent } from 'react';

import { InputAmount, ButtonWithConfirm } from '../../../common/components';
import { ActiveStatusEnum, ActionEnum, TableActionEnum } from "../../../common/enums";

import { productsProductContext } from '../context/products-product.context';
import { FormProductsProductElementDto } from '../dto';

interface Props {
  value: FormProductsProductElementDto;
  selectedRow: string;
  onNotifyClick: (formProductElement: FormProductsProductElementDto) => void;
}

export const ProductsProductElementTableItem: FC<Props> = ({
  value,
  selectedRow,
  onNotifyClick,
}) => {

  // * hooks
  const context = useContext(productsProductContext);
  if (!context) 
    throw new Error("ProductsProductElementTableItem: productsProductContext must be used within an ProductsProductProvider");
  
  const { actionList, form, updateTableProductElement } = context;
  const [formProductElement, setFormProductElement] = useState<FormProductsProductElementDto>({ ...value });

  useEffect(() => {
    setFormProductElement({ ...value });
  }, [value]);

  useEffect(() => {
    updateTableProductElement(TableActionEnum.UPDATE, formProductElement);
  }, [formProductElement.qty]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const formProductElementAux = { ...formProductElement, [name]: parseFloat(value) };
    setFormProductElement(formProductElementAux);
  };

  const handleButtonDelete = () => {
    const formProductElementAux = { 
      ...formProductElement, 
      status: ActiveStatusEnum.DELETED
    };
    setFormProductElement(formProductElementAux);
    updateTableProductElement(TableActionEnum.DELETE, formProductElementAux);
  };

  const handleClick = () => onNotifyClick(formProductElement);

  return (
    <tr 
      key={formProductElement.key} 
      onClick={() => handleClick()}
      className={selectedRow === formProductElement.key ? "custom-table-select" : ""}
      style={ formProductElement.status == ActiveStatusEnum.ACTIVE ?  { cursor: "pointer" } : { textDecoration: "line-through solid 1px red", color: "gray", opacity: 0.5, cursor: "pointer" } }
    >
      <td>
        {
          (actionList.includes(ActionEnum.SAVE) && form.status == ActiveStatusEnum.ACTIVE && formProductElement.status == ActiveStatusEnum.ACTIVE)
          ? <ButtonWithConfirm className={"custom-btn-outline-danger-delete-sm"}  title={"Confirmación"} message={"Eliminar formProductElement de la lista ¿Desea Continuar?"} onExecute={handleButtonDelete} />
          : <div/>
        }
      </td>

      <td className="text-capitalize">
        {formProductElement.element?.name.toLowerCase()}
      </td>

      <td>
        <InputAmount 
          name={"qty"} 
          className={"form-control form-control-sm"} 
          value={formProductElement.qty}
          onChange={handleChange}
          readOnly={form.status == ActiveStatusEnum.DELETED || formProductElement.status == ActiveStatusEnum.DELETED}
        />
      </td>

      <td className="text-center">
        {formProductElement.element?.unit}
      </td>

    </tr>
  );
};
