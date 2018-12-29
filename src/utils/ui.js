import { Form } from 'antd';
import _ from 'lodash';
const createFormField = Form.createFormField;
export const DEFAULT_FORM_COL = {
  labelCol: {
    xs: { span: 6 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 16 },
    sm: { span: 16 },
  },
};

export const FormItem = (props) => {
  return <Form.Item {...props} {...DEFAULT_FORM_COL} />;
};

const EDITOR = 'editor';

export const mapPropsToFields = (props) => {
  const res = {};
  _.forEach(props[EDITOR], (value, key) => {
    switch (key) {
      case 'status': {
        res[key] = createFormField({
          value: value === 1 ? true : false,
        });
        break;
      }
      case 'roles': {
        console.log('roles', value.split(','))
        res[key] = createFormField({
          value: value.split(','),
        });
        break;
      }
      default: {
        res[key] = createFormField({
          value,
        });
        break;
      }
    }
  });
  return res;
};
export const onFieldsChange = (ns) => (props, fields) => {
  props.dispatch({
    type: `${ns}/fieldsChange`,
    payload: fields,
  });
};
export const fieldsChange = (state, { payload }) => {
  _.forEach(payload, ({ name, dirty, value }) => {
    if (!dirty) {
      _.set(state[EDITOR], name, value);
    }
  });
  // console.log('state', state)
  return { ...state };
};
