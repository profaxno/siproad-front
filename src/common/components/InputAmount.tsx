import { NumericFormat } from "react-number-format";
import type { FC, ChangeEvent } from "react";

interface Props {
  name?: string;
  className?: string;
  defaultValue?: number;
  value?: number;
  readOnly?: boolean;
  placeholder?: string;
  max?: number;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
}

export const InputAmount: FC<Props> = ({
  name,
  className,
  defaultValue,
  value,
  readOnly,
  onChange,
  placeholder,
  max,
}) => {
  return (
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
      readOnly={readOnly}
      placeholder={placeholder}
      isAllowed={(values) =>
        !values.floatValue || values.floatValue <= (max ?? 999999999)
      }
      onValueChange={({ formattedValue }) => {
        const cleaned = formattedValue.replace(/\./g, "").replace(",", ".");
        const floatValue = parseFloat(cleaned);

        const event = {
          target: {
            name: name ?? '',
            value: floatValue,
          },
        } as unknown as ChangeEvent<HTMLInputElement>;

        if (onChange) {
          onChange(event);
        }
      }}
    />
  );
};
