import { NumericFormat } from "react-number-format";

export const InputAmount = ({name, className, defaultValue, value, readOnly, onChange, placeholder, max}) => {
  return (
    // <NumericFormat
    //   name={name}
    //   className={className}
    //   style={{ textAlign: 'right' }}
    //   defaultValue={defaultValue}
    //   value={value}
    //   thousandSeparator="."
    //   decimalSeparator=","
    //   decimalScale={2}
    //   fixedDecimalScale
    //   // allowNegative={false}
    //   // prefix="€ "
    //   readOnly={readOnly}
    //   onChange={onChange}
    //   placeholder={placeholder}
    //   isAllowed={(values) => !values.floatValue || values.floatValue <= (max ? max : 999999999)}
    // />
         
    <NumericFormat
      name={name}
      className={className}
      style={{ textAlign: 'right' }}
      defaultValue={defaultValue}
      value={value}
      thousandSeparator="."
      decimalSeparator=","
      decimalScale={2}
      fixedDecimalScale
      // allowNegative={false}
      // prefix="€ "
      readOnly={readOnly}
      // onChange={onChange}
      placeholder={placeholder}
      isAllowed={(values) =>
        !values.floatValue || values.floatValue <= (max ? max : 999999999)
      }
      onValueChange={({ formattedValue }) => {
        const cleaned = formattedValue.replace(/\./g, "").replace(",", ".");
        const floatValue = parseFloat(cleaned);

        const event = {
          target: {
            name: name,
            value: floatValue,
          },
        };

        if (onChange) {
          onChange(event);
        }
      }}
    />
  )
}
