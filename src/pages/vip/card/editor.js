import { connect } from 'dva';
import { Form, Button, Input, InputNumber, Switch, Select } from 'antd';
import moment from 'moment';
import _ from 'lodash';
import { goBack } from '../../../utils';
import Images from '../../products/components/form/Images';
import { FormItem, mapPropsToFields, onFieldsChange } from '../../../utils/ui';
import styles from './editor.less';

function Editor(props) {
  const { getFieldDecorator, validateFields } = props.form;
  const submit = () => {
    validateFields((errors, values) => {
      if (!errors) {
        props.dispatch({
          type: 'vipEditor/submit',
          payload: values,
        });
      }
    });
  };
  return (
    <div className={styles.wrap}>
      <div className={styles.top}>
        <Button icon="left" type="default" onClick={goBack}>
          返回
        </Button>
        <Button icon="plus" type="primary" onClick={submit}>
          保存
        </Button>
      </div>
      <div className={styles.row}>
        <div className={styles.col}>
          <div className={styles.title}>VIP卡基础信息</div>
          <div className={styles.cont}>
            <Form>
              <FormItem label="卡面">{getFieldDecorator('image')(<Images max={1} />)}</FormItem>
              <FormItem label="名称">
                {getFieldDecorator('name', {
                  rules: [{ required: true, message: '必填项' }],
                })(<Input style={{ width: '320px' }} placeholder="请输入名称" />)}
              </FormItem>
              <FormItem label="推荐语">
                {getFieldDecorator('recommend')(
                  <Input style={{ width: '320px' }} placeholder="请输入推荐语" />,
                )}
              </FormItem>
              <FormItem label="排序权重" help="越小越靠前">
                {getFieldDecorator('displayOrder', {
                  rules: [{ required: true, message: '必填项' }],
                })(<InputNumber style={{ width: '100px' }} placeholder="请输入" />)}
              </FormItem>
              <FormItem label="启用状态">
                {getFieldDecorator('status', {
                  initialValue: true,
                  valuePropName: 'checked',
                })(<Switch />)}
              </FormItem>
              <FormItem label="描述">
                {getFieldDecorator('description')(
                  <Input.TextArea style={{ width: '320px' }} rows={4} placeholder="请输入描述" />,
                )}
              </FormItem>
            </Form>
          </div>
        </div>
        <div className={styles.col}>
          <div className={styles.title}>VIP卡价格及时长</div>
          <div className={styles.cont}>
            <Form>
              <FormItem label="价格(元)">
                {getFieldDecorator('price', {
                  rules: [{ required: true, message: '必填项' }],
                })(<InputNumber style={{ width: '100px' }} placeholder="请输入" />)}
              </FormItem>
              <FormItem label="优惠价(元)">
                {getFieldDecorator('discount', {
                  rules: [{ required: true, message: '必填项' }],
                })(<InputNumber style={{ width: '100px' }} placeholder="请输入" />)}
              </FormItem>
              <FormItem label="时长">
                {getFieldDecorator('times', {
                  rules: [{ required: true, message: '必填项' }],
                })(<InputNumber style={{ width: '100px' }} placeholder="请输入" />)}
              </FormItem>
              <FormItem label="时长单位">
                {getFieldDecorator('unit', {
                  rules: [{ required: true, message: '必填项' }],
                })(
                  <Select placeholder="请选择" style={{ width: '100px' }}>
                    <Select.Option key="day" value="day">
                      天
                    </Select.Option>
                    <Select.Option key="week" value="week">
                      周
                    </Select.Option>
                    <Select.Option key="month" value="month">
                      月
                    </Select.Option>
                  </Select>,
                )}
              </FormItem>
              <FormItem label="邀请奖励金(元)">
                {getFieldDecorator('commission', {
                  rules: [{ required: true, message: '必填项' }],
                })(<InputNumber style={{ width: '100px' }} placeholder="请输入" />)}
              </FormItem>
              <FormItem label="限购时间区间">
                {getFieldDecorator('maxUnit', {
                  rules: [{ required: true, message: '必填项' }],
                })(
                  <Select placeholder="请选择" style={{ width: '100px' }}>
                    <Select.Option key="null" value="null">
                      不限购
                    </Select.Option>
                    <Select.Option key="day" value="day">
                      日限购
                    </Select.Option>
                    <Select.Option key="week" value="week">
                      周限购
                    </Select.Option>
                    <Select.Option key="month" value="month">
                      月限购
                    </Select.Option>
                    <Select.Option key="year" value="year">
                      年限购
                    </Select.Option>
                    <Select.Option key="forever" value="forever">
                      永久限购
                    </Select.Option>
                  </Select>,
                )}
              </FormItem>
              <FormItem label="单客限购">
                {getFieldDecorator('max', {
                  rules: [{ required: true, message: '必填项' }],
                })(<InputNumber style={{ width: '100px' }} placeholder="请输入" />)}
              </FormItem>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}

function mapStateToProps({ vipEditor }) {
  return vipEditor;
}
export default connect(mapStateToProps)(
  Form.create({ mapPropsToFields, onFieldsChange: onFieldsChange('vipEditor') })(Editor),
);
