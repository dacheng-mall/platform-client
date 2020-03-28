import { useEffect } from 'react';
import { connect } from 'dva';
import _ from 'lodash';
import { Button, Form, Input, InputNumber } from 'antd';
import { FormItem, mapPropsToFields, onFieldsChange } from '../../../utils/ui';
import { goBack } from '../../../utils/index';

import Images from '../../products/components/form/Images';
import Picker from './Picker/index';
import Products from './Products';
import Rules from './Rules/index';
import styles from './index.less';

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
    validateFields();
    props.dispatch({
      type: 'prize/submit',
    });
  };
  useEffect(() => {
    return () => {
      props.dispatch({
        type: 'prize/clear',
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
          <div className={styles.title}>礼包图片</div>
          <Form layout="inline">
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <FormItem validateStatus={errors.coverImg ? 'error' : ''} help="封面图">
                {getFieldDecorator('coverImg', {
                  rules: [{ required: false, message: '必填项' }],
                })(<Images max={1} />)}
              </FormItem>
              <FormItem validateStatus={errors.contentImg ? 'error' : ''} help="内容图">
                {getFieldDecorator('contentImg', {
                  rules: [{ required: false, message: '必填项' }],
                })(<Images max={1} />)}
              </FormItem>
              <FormItem validateStatus={errors.posterImg ? 'error' : ''} help="海报图">
                {getFieldDecorator('posterImg', {
                  rules: [{ required: false, message: '必填项' }],
                })(<Images max={1} />)}
              </FormItem>
            </div>
          </Form>
          <div className={styles.title}>礼包基础信息</div>
          <Form layout="horizontal">
            <FormItem
              label="礼包名称"
              validateStatus={errors.name ? 'error' : ''}
              help={parseErrorMessage(errors.name)}
            >
              {getFieldDecorator('name', {
                rules: [{ required: true, message: '必填项' }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
            <FormItem
              label="礼包面值(元)"
              validateStatus={errors.value ? 'error' : ''}
              help={parseErrorMessage(errors.name)}
            >
              {getFieldDecorator('value', {
                rules: [{ required: true, message: '必填项' }],
              })(<InputNumber min={0} step={100} placeholder="请输入" />)}
            </FormItem>
            <FormItem label="描述">
              {getFieldDecorator('description')(
                <Input.TextArea autosize={{ minRows: 3 }} placeholder="请输入描述" />,
              )}
            </FormItem>
            <FormItem label="关联机构">
              {getFieldDecorator('institution', {
                type: Object,
              })(<Picker type="inst" />)}
            </FormItem>
            <FormItem
              label="限选数量(件)"
              validateStatus={errors.maxCount ? 'error' : ''}
              help="0件为不限制, 必须是整数"
            >
              {getFieldDecorator('maxCount', {
                rules: [{ required: false, message: '必填项' }],
                initialValue: 1,
              })(<InputNumber step={1} min={0} />)}
            </FormItem>
            <FormItem
              label="限选总金额(元)"
              validateStatus={errors.maxCount ? 'error' : ''}
              help="0元为不限制, 精确到百分位"
            >
              {getFieldDecorator('sumPrice', {
                rules: [{ required: false, message: '必填项' }],
                initialValue: 0.0,
                decimalSeparator: '2',
              })(<InputNumber step={100} min={0} />)}
            </FormItem>
            {/* <FormItem label="启用状态">
              {getFieldDecorator('status', {
                initialValue: false,
              })(<Switch />)}
            </FormItem> */}
            <FormItem label="规则">
              {getFieldDecorator('rules', {
                type: 'array',
                rules: [{ required: true, message: '必填项' }],
              })(<Rules />)}
            </FormItem>
          </Form>
        </div>
        <div className={styles.products}>
          <Form labelCol={{ span: 0 }}>
            <div className={styles.title}>编辑礼包商品</div>
            <Form.Item>
              {getFieldDecorator('products', {
                type: Array,
              })(<Products />)}
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
}
function mapStateToProps({ prize }) {
  return prize;
}
export default connect(mapStateToProps)(
  Form.create({ mapPropsToFields, onFieldsChange: onFieldsChange('prize') })(Editor),
);
