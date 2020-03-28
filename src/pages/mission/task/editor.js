import { useEffect, Fragment } from 'react';
import { connect } from 'dva';
import _ from 'lodash';
import { Button, Form, Input, Select, DatePicker, Switch, InputNumber } from 'antd';
import { FormItem, mapPropsToFields, onFieldsChange } from '../../../utils/ui';
import { goBack } from '../../../utils/index';

import Images from '../../products/components/form/Images';
import Picker from '../../convert/prizes/Picker/index';
import Tasks from './Tasks';
import Rules from '../../convert/prizes/Rules/index';
import VisitedTotal from './formPlugins/visitedTotal';
import styles from './index.less';

const { RangePicker } = DatePicker;

const AGG_TYPE = [
  {
    label: '累计数据量',
    key: 'total',
  },
  {
    label: '连续记天数',
    key: 'continue',
  },
];

const SOURCE_TYPE = [
  {
    label: '拜访',
    key: 'visited',
  },
  {
    label: '出勤',
    key: 'attendance',
    disabled: true,
  },
  {
    label: '增员',
    key: 'recruiting',
    disabled: true,
  },
];

function Editor(props) {
  const { errors } = props;

  const parseErrorMessage = (error) => {
    if (error) {
      return _.map(error, ({ message }, i) => `${i !== 0 ? ',' : ''}${message}`);
    }
    return null;
  };
  const { getFieldDecorator, validateFields } = props.form;
  const submit = () => {
    validateFields((err, val) => {
      console.log(err, val);
      if (!err) {
        props.dispatch({
          type: 'taskDetail/submit',
        });
      }
    });
  };
  useEffect(() => {
    return () => {
      props.dispatch({
        type: 'taskDetail/clear',
      });
    };
  }, []);
  return (
    <div className={styles.wrap}>
      <div className={styles.top}>
        <Button onClick={goBack}>返回</Button>
        <Button type="primary" onClick={submit}>
          保存
        </Button>
      </div>
      <div className={styles.content}>
        <div className={styles.info}>
          <div className={styles.title}>任务基础信息</div>
          <Form layout="horizontal">
            <FormItem validateStatus={errors.image ? 'error' : ''} label="封面图">
              {getFieldDecorator('image')(<Images max={1} />)}
            </FormItem>
            <FormItem
              label="任务名称"
              validateStatus={errors.name ? 'error' : ''}
              help={parseErrorMessage(errors.name)}
            >
              {getFieldDecorator('name', {
                rules: [{ required: true, message: '必填项' }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
            <FormItem
              label="时间区间"
              validateStatus={errors.range ? 'error' : ''}
              help={parseErrorMessage(errors.range)}
            >
              {getFieldDecorator('range', {
                rules: [{ required: true, message: '必填项' }],
              })(<RangePicker />)}
            </FormItem>
            <FormItem label="关联机构">
              {getFieldDecorator('institution', {
                type: Object,
              })(<Picker type="inst" />)}
            </FormItem>
            {/* <FormItem label="描述">
              {getFieldDecorator('description')(
                <Input.TextArea autosize={{ minRows: 3 }} placeholder="请输入描述" />,
              )}
            </FormItem> */}
            <FormItem label="启用状态">
              {getFieldDecorator('enable', {
                initialValue: false,
                valuePropName: 'checked',
              })(<Switch />)}
            </FormItem>
            <FormItem label="规则描述">
              {getFieldDecorator('rules', {
                type: 'array',
              })(<Rules />)}
            </FormItem>
          </Form>
        </div>
        <div className={styles.info}>
          <div className={styles.title}>任务类型</div>
          <Form layout="horizontal">
            <FormItem label="统计方式">
              {getFieldDecorator('type', {
                initialValue: 'continue',
              })(
                <Select disabled={!!props.id}>
                  {_.map(AGG_TYPE, ({ label, key }) => (
                    <Select.Option key={key} value={key}>
                      {label}
                    </Select.Option>
                  ))}
                </Select>,
              )}
            </FormItem>
            <FormItem label="数据来源">
              {getFieldDecorator('source', {
                initialValue: 'visited',
              })(
                <Select disabled={!!props.id}>
                  {_.map(SOURCE_TYPE, ({ label, key, disabled }) => (
                    <Select.Option key={key} value={key} disabled={disabled}>
                      {label}
                    </Select.Option>
                  ))}
                </Select>,
              )}
            </FormItem>
            {props.editor.source === 'visited' && props.editor.type === 'total' ? (
              <Form.Item label="">
                {getFieldDecorator('restraint', {
                  type: Object,
                })(<VisitedTotal />)}
              </Form.Item>
            ) : null}
          </Form>
        </div>
        <div className={styles.rules}>
          <Form labelCol={{ span: 0 }}>
            <div className={styles.title}>任务规则</div>
            <Form.Item>
              {getFieldDecorator('tasks', {
                type: Array,
              })(<Tasks />)}
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
}
function mapStateToProps({ taskDetail }) {
  return taskDetail;
}
export default connect(mapStateToProps)(
  Form.create({ mapPropsToFields, onFieldsChange: onFieldsChange('taskDetail') })(Editor),
);
