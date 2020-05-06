import { useEffect } from 'react';
import { connect } from 'dva';
import _ from 'lodash';
import { Button, Form, Input, InputNumber } from 'antd';
import { FormItem, mapPropsToFields, onFieldsChange } from '../../../utils/ui';
import { goBack } from '../../../utils/index';
import styles from './index.less';

import Images from '../../products/components/form/Images';

function Editor(props) {
  const { getFieldDecorator, validateFields } = props.form;
  const submit = () => {
    validateFields();
    props.dispatch({
      type: 'onlineVisitedShareDetail/submit',
    });
  };
  const parseErrorMessage = (error, help) => {
    if (error) {
      return _.map(error, ({ message }, i) => `${i !== 0 ? ',' : ''}${message}`);
    }
    return help || null;
  };
  const { errors } = props;
  return (
    <div className={styles.wrap}>
      <div className={styles.top}>
        <Button onClick={goBack}>返回</Button>
        <div>编辑分享内容资源</div>
        <Button type="primary" onClick={submit}>
          保存
        </Button>
      </div>
      <div className={styles.content}>
        <div className={styles.info}>
          <Form layout="horizontal">
            <FormItem label="主题图">
              {getFieldDecorator('image', {
                rules: [{ required: true, message: '必填项' }],
              })(<Images max={1} />)}
            </FormItem>
            <FormItem label="海报图">
              {getFieldDecorator('poster', {
                rules: [{ required: true, message: '必填项' }],
              })(<Images max={1} />)}
            </FormItem>
            <FormItem
              label="序号"
              validateStatus={errors.sn ? 'error' : ''}
              help={parseErrorMessage(errors.sn, '会影响资源按天生效的次序')}
            >
              {getFieldDecorator('sn', {
                rules: [{ required: true, message: '必填项' }],
              })(<InputNumber placeholder="请输入" />)}
            </FormItem>
            <FormItem
              label="分享资源名称"
              validateStatus={errors.name ? 'error' : ''}
              help={parseErrorMessage(errors.name, '资源名称, 在列表上显示')}
            >
              {getFieldDecorator('name', {
                rules: [{ required: true, message: '必填项' }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
            <FormItem
              label="内容标题"
              validateStatus={errors.title ? 'error' : ''}
              help={parseErrorMessage(errors.content, '用户分享时可能会显示在链接标题处')}
            >
              {getFieldDecorator('title', {
                rules: [{ required: true, message: '必填项' }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
            <FormItem
              label="内容文案"
              validateStatus={errors.content ? 'error' : ''}
              help={parseErrorMessage(errors.content, '用户分享时可能会显示在链接标题处')}
            >
              {getFieldDecorator('content', {
                rules: [{ required: true, message: '必填项' }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
            <FormItem
              label="分享文案"
              validateStatus={errors.share ? 'error' : ''}
              help={parseErrorMessage(errors.content, '使用-|-换行')}
            >
              {getFieldDecorator('share')(<Input.TextArea placeholder="请输入" rows={4} />)}
            </FormItem>
            <FormItem
              label="提交按钮文字"
              validateStatus={errors.submit ? 'error' : ''}
              help={parseErrorMessage(errors.content, '提交拜访记录的按钮文字')}
            >
              {getFieldDecorator('submit', {
                initialValue: '提交',
              })(<Input placeholder="请输入" rows={4} />)}
            </FormItem>
            <FormItem
              label="业务员文案"
              validateStatus={errors.salesmanDoing ? 'error' : ''}
              help={parseErrorMessage(errors.content, '邀请人(业务员)的正在干...')}
            >
              {getFieldDecorator('salesmanDoing', {
                initialValue: '正在献爱心',
              })(<Input placeholder="请输入" />)}
            </FormItem>
          </Form>
        </div>
      </div>
    </div>
  );
}
function mapStateToProps({ onlineVisitedShareDetail }) {
  return onlineVisitedShareDetail;
}
export default connect(mapStateToProps)(
  Form.create({ mapPropsToFields, onFieldsChange: onFieldsChange('onlineVisitedShareDetail') })(
    Editor,
  ),
);
