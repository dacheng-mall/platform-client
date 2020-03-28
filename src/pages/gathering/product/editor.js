import { useEffect } from 'react';
import { connect } from 'dva';
import _ from 'lodash';
import { Button, Form, Input, InputNumber, Switch, Select } from 'antd';
import { FormItem, mapPropsToFields, onFieldsChange } from '../../../utils/ui';
import { goBack } from '../../../utils/index';

import Images from '../../products/components/form/Images';
import styles from './index.less';

function GatheringProductDetail(props) {
  const { errors } = props;

  const { getFieldDecorator, validateFields } = props.form;
  const submit = () => {
    validateFields((err, val) => {
      if (!err) {
        props.dispatch({
          type: 'gatheringProductDetail/submit',
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
        <Button type="primary" disabled={props.submiting} onClick={submit}>
          保存
        </Button>
      </div>
      <div className={styles.content}>
        <div className={styles.info}>
          <Form layout="horizontal" style={{ width: '500px', margin: '32px auto' }}>
            <FormItem validateStatus={errors.coverImg ? 'error' : ''} label="商品图片">
              {getFieldDecorator('image', {
                rules: [{ required: false, message: '必填项' }],
              })(<Images max={1} />)}
            </FormItem>
            <FormItem label="商品名称" validateStatus={errors.name ? 'error' : ''}>
              {getFieldDecorator('name', {
                rules: [{ required: true, message: '必填项' }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
            <FormItem label="单价(元)" validateStatus={errors.price ? 'error' : ''}>
              {getFieldDecorator('price', {
                rules: [{ required: true, message: '必填项' }],
              })(<InputNumber min={0} step={100} placeholder="请输入" />)}
            </FormItem>
            <FormItem label="商品类型" validateStatus={errors.value ? 'error' : ''}>
              {getFieldDecorator('type', {
                rules: [{ required: true, message: '必填项' }],
                initialValue: 'product',
              })(
                <Select placeholder="请选择">
                  <Select.Option value="product">实物</Select.Option>
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

function mapStateToProps({ gatheringProductDetail }) {
  return gatheringProductDetail;
}

export default connect(mapStateToProps)(
  Form.create({ mapPropsToFields, onFieldsChange: onFieldsChange('gatheringProductDetail') })(
    GatheringProductDetail,
  ),
);
