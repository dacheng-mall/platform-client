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
const ERROR = 'errors';

export const mapPropsToFields = (props) => {
  console.log('mapPropsToFields', props)
  const res = {};
  _.forEach(props[EDITOR], (value, key) => {
    switch (key) {
      case 'status': {
        res[key] = createFormField({
          value: value === '1' ? true : false,
        });
        break;
      }
      case 'roles': {
        res[key] = createFormField({
          value: value && value.split(','),
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
export const onFieldsChange = (ns) => (props, field, fields) => {
  const [key, val] = Object.entries(field)[0];
  switch (key) {
    case 'status': {
      field[key].value = val.value ? '1' : '0';
      break;
    }
    case 'roles': {
      field[key].value = typeof val.value === 'object' ? val.value.join(',') : val.value;
      break;
    }
    default: {
      break;
    }
  }
  props.dispatch({
    type: `${ns}/fieldsChange`,
    payload: { field, fields },
  });
};
export const fieldsChange = (state, { payload }) => {
  _.forEach(payload.fields, ({ name, dirty, value, errors }) => {
    if (!name) {
      return;
    }
    if (!dirty) {
      _.set(state[EDITOR], name, value);
    }
    if (errors) {
      _.set(state[ERROR], name, errors);
    } else {
      delete state[ERROR][name];
    }
  });
  return { ...state };
};
export const initEditor = (values) => {
  _.forEach(values, (value, key) => {
    switch (key) {
      case 'status': {
        values[key] = value === '1' ? true : false;
        break;
      }
      case 'roles': {
        values[key] = value && value.split(',');
        break;
      }
      default: {
        break;
      }
    }
  });
  return values;
};
export const parseEditor = (values) => {
  _.forEach(values, (value, key) => {
    switch (key) {
      case 'status': {
        values[key] = value ? '1' : '0';
        break;
      }
      case 'roles': {
        values[key] = value && value.join(',');
        break;
      }
      default: {
        break;
      }
    }
  });
  return values;
};
