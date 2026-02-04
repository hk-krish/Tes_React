import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { Form, Input } from "antd";

export const CustomFormItem = ({
  label,
  name,
  value,
  rules,
  placeholder,
  onChange,
  className,
  type = "text",
  options = [],
  ...rest
}) => {
  return (
    <Form.Item label={label} name={name} rules={rules}>
      {type === "password" ? (
        <Input.Password
          className={className}
          type={type}
          placeholder={placeholder}
          name={name}
          value={value}
          onChange={onChange}
          iconRender={(visible) =>
            visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
          }
          {...rest}
        />
      ) : (
        <Input
          className={className}
          type={type}
          placeholder={placeholder}
          name={name}
          value={value}
          onChange={onChange}
          {...rest}
        />
      )}
    </Form.Item>
  );
};
