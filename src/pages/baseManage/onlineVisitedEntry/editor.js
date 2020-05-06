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
      type: 'onlineVisitedEntryDetail/submit',
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
        <div>编辑入口内容资源</div>
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
            <FormItem
              label="入口资源名称"
              validateStatus={errors.name ? 'error' : ''}
              help={parseErrorMessage(errors.name)}
            >
              {getFieldDecorator('name', {
                rules: [{ required: true, message: '必填项' }],
                initialValue: '测试入口名称',
              })(<Input placeholder="请输入" />)}
            </FormItem>
            <FormItem
              label="动态数据索引名称"
              validateStatus={errors.dynamic ? 'error' : ''}
              help={parseErrorMessage(
                errors.dynamic,
                '小写英文 数字 _ -, 如果没有动态来源, 所有标题可以不设置动态数据占位符',
              )}
            >
              {getFieldDecorator('dynamic', {
                initialValue: 'compassion',
              })(<Input placeholder="请输入" />)}
            </FormItem>
            <FormItem
              label="主标题"
              validateStatus={errors.dynamic_total ? 'error' : ''}
              help={parseErrorMessage(errors.dynamic_total, '动态数据来源的总量, 使用$var$占位')}
            >
              {getFieldDecorator('dynamic_total', {
                rules: [{ required: true, message: '必填项' }],
                initialValue: '累计获得$var$个爱心',
              })(<Input placeholder="请输入" />)}
            </FormItem>
            <FormItem
              label="主标题(无数据)"
              validateStatus={errors.dynamic_total_none ? 'error' : ''}
              help={parseErrorMessage(
                errors.dynamic_total_none,
                '动态数据来源的总量为0时显示的文案',
              )}
            >
              {getFieldDecorator('dynamic_total_none', {
                rules: [{ required: true, message: '必填项' }],
                initialValue: '快去分享点亮爱心',
              })(<Input placeholder="请输入" />)}
            </FormItem>
            <FormItem
              label="副标题"
              validateStatus={errors.dynamic_current ? 'error' : ''}
              help={parseErrorMessage(
                errors.dynamic_current,
                '动态数据来源的当日数量, 使用$var$占位',
              )}
            >
              {getFieldDecorator('dynamic_current', {
                rules: [{ required: true, message: '必填项' }],
                initialValue: '今天获得$var$个爱心',
              })(<Input placeholder="请输入" />)}
            </FormItem>
          </Form>
        </div>
      </div>
    </div>
  );
}
function mapStateToProps({ onlineVisitedEntryDetail }) {
  return onlineVisitedEntryDetail;
}
export default connect(mapStateToProps)(
  Form.create({ mapPropsToFields, onFieldsChange: onFieldsChange('onlineVisitedEntryDetail') })(
    Editor,
  ),
);
