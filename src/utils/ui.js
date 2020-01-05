import { Form, Table } from 'antd';
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
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 6,
      offset: 6,
    },
    sm: {
      span: 16,
      offset: 6,
    },
  },
};

export const checkIdcard = (rule, value, callback) => {
  const reg = /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}$)/;
  if (value && !reg.test(value)) {
    callback('请输入正确格式的身份证号, 15或18位');
  } else {
    callback();
  }
};
export const checkMobile = (rule, value, callback) => {
  const reg = /^1(3|4|5|7|8)\d{9}$/;
  if (value && !reg.test(value)) {
    callback('请输入正确格式的手机号');
  } else {
    callback();
  }
};

export const FormItem = (props) => {
  if (props.isTail) {
    return <Form.Item {...props} {...tailFormItemLayout} />;
  }
  return <Form.Item {...props} {...DEFAULT_FORM_COL} />;
};

const EDITOR = 'editor';
const ERROR = 'errors';

export const mapPropsToFields = (props) => {
  const res = {};
  _.forEach(props[EDITOR], (value, key) => {
    switch (key) {
      case 'status':
      case 'bindSalesman': {
        res[key] = createFormField({
          value: value === 1 || value ? true : false,
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
  // const [key, val] = Object.entries(field)[0];
  // switch (key) {
  //   case 'status': {
  //     field[key].value = val.value ? '1' : '0';
  //     break;
  //   }
  //   case 'roles': {
  //     field[key].value = typeof val.value === 'object' ? val.value.join(',') : val.value;
  //     break;
  //   }
  //   default: {
  //     break;
  //   }
  props.dispatch({
    type: `${ns}/fieldsChange`,
    payload: { fields, field },
  });
};
// 这个再model里使用, 维护store里的表单数据
export const fieldsChange = (state, { payload }) => {
  console.log(payload)
  _.forEach(payload.fields, ({ value, errors }, key) => {
    if (!key) {
      return;
    }
    if (errors) {
      _.set(state[ERROR], key, errors);
    } else {
      _.set(state[EDITOR], key, value);
      delete state[ERROR][key];
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
  const _values = {};
  _.forEach(values, (value, key) => {
    switch (key) {
      case 'status': {
        _values[key] = value ? '1' : '0';
        break;
      }
      case 'roles': {
        _values[key] = value && value.join(',');
        break;
      }
      default: {
        _values[key] = value;
        break;
      }
    }
  });
  return _values;
};

export const TableX = (props) => {
  const originPageSize = props.pagination.pageSize;
  return (
    <Table
      {...props}
      rowKey={props.rowKey || 'id'}
      columns={props.columns}
      dataSource={props.dataSource || []}
      locale={{ emptyText: '暂无数据' }}
      pagination={{
        pageSize: props.pagination.pageSize,
        total: props.pagination.total,
        showTotal: (total, range) => `当前${range[0]}-${range[1]}, 共 ${total} 项`,
        showSizeChanger: true,
        onShowSizeChange: (page, pageSize) => {
          props.dispatch({
            type: props.fetchType,
            payload: { page, pageSize },
          });
        },
        current: props.pagination.page,
        onChange: (page, pageSize) => {
          props.dispatch({
            type: props.fetchType,
            payload: { page, pageSize },
          });
        },
      }}
    />
  );
};
