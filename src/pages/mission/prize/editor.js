import { useEffect } from 'react';
import { connect } from 'dva';
import _ from 'lodash';
import { Button, Form, Input, InputNumber, Switch, Select } from 'antd';
import { FormItem, mapPropsToFields, onFieldsChange } from '../../../utils/ui';
import { goBack } from '../../../utils/index';

import Images from '../../products/components/form/Images';
import styles from './index.less';

function TaskPrizeEditor(props) {
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
      if (!err) {
        props.dispatch({
          type: 'taskPrizeDetail/submit',
        });
      }
    });
  };
  // useEffect(() => {
  //   return () => {
  //     props.dispatch({
  //       type: 'taskPrizeDetail/clear',
  //     });
  //   };
  // }, []);
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
          <Form layout="horizontal" style={{ width: '500px', margin: '32px auto' }}>
            <FormItem validateStatus={errors.coverImg ? 'error' : ''} label="奖励图片">
              {getFieldDecorator('image', {
                rules: [{ required: false, message: '必填项' }],
              })(<Images max={1} />)}
            </FormItem>
            <FormItem label="奖励名称" validateStatus={errors.name ? 'error' : ''}>
              {getFieldDecorator('name', {
                rules: [{ required: true, message: '必填项' }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
            <FormItem label="奖励价值(元)" validateStatus={errors.value ? 'error' : ''}>
              {getFieldDecorator('value', {
                rules: [{ required: true, message: '必填项' }],
              })(<InputNumber min={0} step={100} placeholder="请输入" />)}
            </FormItem>
            <FormItem label="奖励类型" validateStatus={errors.value ? 'error' : ''}>
              {getFieldDecorator('type', {
                rules: [{ required: true, message: '必填项' }],
                initialValue: 'product',
              })(
                <Select placeholder="请选择">
                  <Select.Option value="product">商品</Select.Option>
                  <Select.Option value="point" disabled>
                    积分
                  </Select.Option>
                  <Select.Option value="lotto" disabled>
                    抽奖机会
                  </Select.Option>
                </Select>,
              )}
            </FormItem>
            <FormItem label="状态">
              {getFieldDecorator('status', {
                valuePropName: 'checked',
                initialValue: true,
              })(<Switch />)}
            </FormItem>
            <FormItem label="描述">
              {getFieldDecorator('description')(
                <Input.TextArea autosize={{ minRows: 3 }} placeholder="请输入描述" />,
              )}
            </FormItem>
          </Form>
        </div>
      </div>
    </div>
  );
}

function mapStateToProps({ taskPrizeDetail }) {
  return taskPrizeDetail;
}

export default connect(mapStateToProps)(
  Form.create({ mapPropsToFields, onFieldsChange: onFieldsChange('taskPrizeDetail') })(
    TaskPrizeEditor,
  ),
);
