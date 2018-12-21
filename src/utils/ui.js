import { Form } from 'antd';

export const DEFAULT_FORM_COL = {
  labelCol: {
    xs: { span: 12 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 12 },
    sm: { span: 16 },
  },
};

export const FormItem = props => {
  return (
    <Form.Item {...props} {...DEFAULT_FORM_COL} />
  );
};
