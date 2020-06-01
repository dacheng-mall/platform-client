import { useEffect, Fragment } from 'react';
import { connect } from 'dva';
import _ from 'lodash';
import { Button, Form, Input, Select, DatePicker, Switch, InputNumber } from 'antd';
import { FormItem, mapPropsToFields, onFieldsChange } from '../../../utils/ui';
import { goBack } from '../../../utils/index';

import Images from '../../products/components/form/Images';
import Picker from '../../convert/prizes/Picker/index';
import Products from './products';
import Rules from '../../convert/prizes/Rules/index';
import ActiveDiscount from './formPlugins/activeDiscount';
import styles from './index.less';

const { RangePicker } = DatePicker;

function Editor(props) {
  const { getFieldDecorator, validateFields } = props.form;
  const submit = () => {
    validateFields((err, val) => {
      if (!err) {
        props.dispatch({
          type: 'gatheringDetail/submit',
        });
      }
    });
  };
  useEffect(() => {
    return () => {
      props.dispatch({
        type: 'gatheringDetail/clear',
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
          <div className={styles.title}>活动图片</div>
          <Form layout="inline">
            <FormItem help="列表图">{getFieldDecorator('listImage')(<Images max={1} />)}</FormItem>
            <FormItem help="主题图">
              {getFieldDecorator('detailImage')(<Images max={1} />)}
            </FormItem>
          </Form>
          <div className={styles.title}>海报</div>
          <Form>
            <FormItem label="海报背景图">
              {getFieldDecorator('substituteImage')(<Images max={1} />)}
            </FormItem>
            <FormItem label="海报文案" help="使用-|-换行">
              {getFieldDecorator('posterMsg', {
                initialValue: '好运常在-|-幸福安康',
              })(<Input.TextArea placeholder="请输入" rows={4} />)}
            </FormItem>
          </Form>
          <div className={styles.title}>活动局部样式</div>
          <Form layout="horizontal">
            <FormItem label="主按钮文0" help="活动开始前的文案">
              {getFieldDecorator('mainBtnText0', {
                initialValue: '立即预约',
              })(<Input placeholder="请输入" />)}
            </FormItem>
            <FormItem label="主按钮文1" help="活动开始后的文案">
              {getFieldDecorator('mainBtnText1', {
                initialValue: '立即抢购',
              })(<Input placeholder="请输入" />)}
            </FormItem>
            <FormItem label="主按钮文2" help="活动结束后的文案">
              {getFieldDecorator('mainBtnText2', {
                initialValue: '已结束',
              })(<Input placeholder="请输入" />)}
            </FormItem>
            <FormItem label="主按钮文3" help="无库存后的文案">
              {getFieldDecorator('mainBtnText3', {
                initialValue: '暂无库存',
              })(<Input placeholder="请输入" />)}
            </FormItem>
            <FormItem label="主按钮颜色">
              {getFieldDecorator('mainBtnColor', {
                initialValue: '#f33',
              })(<Input placeholder="请输入" />)}
            </FormItem>
            <FormItem label="主文字颜色">
              {getFieldDecorator('mainTextColor', {
                initialValue: '#fff',
              })(<Input placeholder="请输入" />)}
            </FormItem>
            <FormItem label="主按钮填充">
              {getFieldDecorator('mainBtnFill', {
                initialValue: true,
                valuePropName: 'checked',
              })(<Switch />)}
            </FormItem>
            <FormItem label="副按钮文字">
              {getFieldDecorator('subBtnText', {
                initialValue: '分享',
              })(<Input placeholder="请输入" />)}
            </FormItem>
            <FormItem label="副按钮颜色">
              {getFieldDecorator('subBtnColor', {
                initialValue: '#f33',
              })(<Input placeholder="请输入" />)}
            </FormItem>
            <FormItem label="副文字颜色">
              {getFieldDecorator('subTextColor', {
                initialValue: '#fff',
              })(<Input placeholder="请输入" />)}
            </FormItem>
            <FormItem label="副按钮填充">
              {getFieldDecorator('subBtnFill', {
                initialValue: true,
                valuePropName: 'checked',
              })(<Switch />)}
            </FormItem>
          </Form>
        </div>
        <div className={styles.info}>
          <div className={styles.title}>活动基础信息</div>
          <Form layout="horizontal">
            <FormItem label="主标题">
              {getFieldDecorator('name', {
                rules: [{ required: true, message: '必填项' }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
            <FormItem label="副标题">
              {getFieldDecorator('subName', {
                rules: [{ required: true, message: '必填项' }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
            <FormItem label="时间区间" help="活动开始和结束时间">
              {getFieldDecorator('range', {
                rules: [{ required: true, message: '必填项' }],
              })(<RangePicker showTime />)}
            </FormItem>
            <FormItem label="关联机构" help="可参与活动的业务员范围">
              {getFieldDecorator('institution', {
                type: Object,
              })(<Picker type="inst" />)}
            </FormItem>
            {/* <FormItem label="兑付类型" help="兑付活动商品的方式">
              {getFieldDecorator('type', {
                initialValue: 'offline',
              })(
                <Select>
                  <Select.Option key="offline">线下核销</Select.Option>
                  <Select.Option key="online">线上发货</Select.Option>
                </Select>,
              )}
            </FormItem> */}
            <FormItem label="邀请上限" help="单个业务员可邀请客户数量上限">
              {getFieldDecorator('inviteMax', {
                type: Number,
                initialValue: 0,
              })(<InputNumber min={0} placeholder="请输入" />)}
            </FormItem>
            <FormItem label="强制报名" help="是否要求业务员报名">
              {getFieldDecorator('mustSign', {
                initialValue: false,
                valuePropName: 'checked',
              })(<Switch />)}
            </FormItem>
            <FormItem label="自动报名" help="活动开始后忽略强制报名">
              {getFieldDecorator('autoSign', {
                initialValue: false,
                valuePropName: 'checked',
              })(<Switch />)}
            </FormItem>
            <FormItem label="转介绍" help="是否允许客户转发活动">
              {getFieldDecorator('customerShare', {
                initialValue: false,
                valuePropName: 'checked',
              })(<Switch />)}
            </FormItem>
            <FormItem label="邀请即拜访" help="客户受邀请参与活动后生成拜访记录">
              {getFieldDecorator('inviteIsVisited', {
                initialValue: false,
                valuePropName: 'checked',
              })(<Switch />)}
            </FormItem>
            <FormItem label="生成新客" help="客户接受邀请参与活动后生成客户记录">
              {getFieldDecorator('newCustomerCreate', {
                initialValue: false,
                valuePropName: 'checked',
              })(<Switch />)}
            </FormItem>
            <FormItem label="需要库存" help="是否需要库存">
              {getFieldDecorator('store', {
                initialValue: false,
                valuePropName: 'checked',
              })(<Switch />)}
            </FormItem>
            <FormItem
              label="优惠统计"
              help="若开启, 统计订单或件数时则仅统计优惠覆盖用户角色产生的数量, 影响平台售出数优惠和订单优惠"
            >
              {getFieldDecorator('discountAggs', {
                initialValue: false,
                valuePropName: 'checked',
              })(<Switch checkedChildren="分" unCheckedChildren="统" />)}
            </FormItem>
            <FormItem label="原价" help="展现的原始单价(元)">
              {getFieldDecorator('defPrice', {
                type: Number,
                initialValue: 0,
              })(<InputNumber min={0} placeholder="请输入" />)}
            </FormItem>
            <FormItem label="内购价" help="业务员购买单价(元)">
              {getFieldDecorator('innerPrice', {
                type: Number,
                initialValue: 0,
              })(<InputNumber min={0} placeholder="请输入" />)}
            </FormItem>
            <FormItem label="内购上限" help="业务员购买数量上限">
              {getFieldDecorator('innerBuyCountMax', {
                type: Number,
                initialValue: 0,
              })(<InputNumber min={0} placeholder="请输入" />)}
            </FormItem>
            <FormItem label="内购起订数" help="业务员单次最少购买数量上限">
              {getFieldDecorator('innerBuyCountMin', {
                type: Number,
                initialValue: 0,
              })(<InputNumber min={0} placeholder="请输入" />)}
            </FormItem>
            <FormItem label="外购价" help="客户购买单价(元)">
              {getFieldDecorator('outerPrice', {
                type: Number,
                initialValue: 0,
              })(<InputNumber min={0} placeholder="请输入" />)}
            </FormItem>
            <FormItem label="外购上限" help="客户购买数量上限">
              {getFieldDecorator('outerBuyCountMax', {
                type: Number,
                initialValue: 0,
              })(<InputNumber min={0} placeholder="请输入" />)}
            </FormItem>
            <FormItem label="外购起订数" help="客户单次最少购买数量上限">
              {getFieldDecorator('outerBuyCountMin', {
                type: Number,
                initialValue: 0,
              })(<InputNumber min={0} placeholder="请输入" />)}
            </FormItem>
            <FormItem label="启用状态" help="客户端是否可见">
              {getFieldDecorator('enable', {
                initialValue: false,
                valuePropName: 'checked',
              })(<Switch />)}
            </FormItem>
            <FormItem label="规则描述" help="客户端展现得规则说明">
              {getFieldDecorator('rules', {
                type: 'array',
              })(<Rules />)}
            </FormItem>
          </Form>
        </div>
        <div className={styles.info}>
          <div className={styles.title}>活动优惠规则</div>
          <Form layout="horizontal">
            <Form.Item label="">
              {getFieldDecorator('discount', {
                type: Array,
              })(<ActiveDiscount />)}
            </Form.Item>
          </Form>
        </div>
        <div className={styles.info}>
          <Form labelCol={{ span: 0 }}>
            <div className={styles.title}>活动商品</div>
            <Form.Item>
              {getFieldDecorator('products', {
                type: Array,
                initialValue: [],
              })(<Products />)}
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
}
function mapStateToProps({ gatheringDetail }) {
  return gatheringDetail;
}
export default connect(mapStateToProps)(
  Form.create({ mapPropsToFields, onFieldsChange: onFieldsChange('gatheringDetail') })(Editor),
);
