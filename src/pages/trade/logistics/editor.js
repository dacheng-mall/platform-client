import { useEffect, useState } from 'react';
import { connect } from 'dva';
import _ from 'lodash';
import { Button, Form, Input, InputNumber, Switch, Radio, Cascader, Select, Checkbox } from 'antd';
import { FormItem, mapPropsToFields, onFieldsChange } from '../../../utils/ui';
import { goBack } from '../../../utils/index';
import SendingTypeEditor from "./sendingTypeEditor";

import styles from './editor.less';

const RESPOND = [
  { name: '4小时内', code: '4-h' },
  { name: '8小时内', code: '8-h' },
  { name: '12小时内', code: '12-h' },
  { name: '16小时内', code: '16-h' },
  { name: '20小时内', code: '20-h' },
  { name: '1天内', code: '1-d' },
  { name: '2天内', code: '2-d' },
  { name: '3天内', code: '3-d' },
  { name: '5天内', code: '5-d' },
  { name: '10天内', code: '10-d' },
  { name: '15天内', code: '15-d' },
  { name: '20天内', code: '20-d' },
  { name: '30天内', code: '30-d' },
  { name: '45天内', code: '45-d' },
];
const areaDataOrigin = require('../../../assets/area.json');

function Editor(props) {
  const { errors, editors, form } = props;
  const [respOpts, setResOpts] = useState([...RESPOND]);
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
      type: 'logistics/submit',
    });
  };
  useEffect(() => {
    return () => {
      props.dispatch({
        type: 'logistics/clear',
      });
    };
  }, []);
  const changeArea = (v, vo) => {
    const regionName = _.map(vo, ({ label }) => label).join(' ');
    props.dispatch({
      type: 'logistic/fieldsChange',
      payload: {
        fields: {
          regionName: {
            value: regionName,
            name: 'regionName',
          },
        },
      },
    });
  };
  const filterOptions = (inputValue) => {
    const res = RESPOND.filter((resp) => resp.name.includes(inputValue));
    setResOpts(res);
  };
  const checkRespond = () => {
    setResOpts([...RESPOND]);
  };
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
          <div className={styles.title}>基础信息</div>
          <Form>
            <FormItem label="模板名称">
              {getFieldDecorator('name', {
                rules: [{ required: true, message: '必填项' }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
            <FormItem label="发货地区">
              {getFieldDecorator('origin', {
                rules: [{ required: true, message: '必填项' }],
              })(
                <Cascader
                  options={areaDataOrigin}
                  onChange={changeArea}
                  changeOnSelect
                  showSearch
                  placeholder="请选择区域"
                />,
              )}
            </FormItem>
            <FormItem label="发货时间">
              {getFieldDecorator('respond')(
                <Select
                  labelInValue
                  placeholder="请选择发货响应时间"
                  filterOption={false}
                  showSearch
                  showArrow={false}
                  defaultActiveFirstOption={false}
                  onSearch={filterOptions}
                  notFoundContent={null}
                  onSelect={checkRespond}
                >
                  {_.map(respOpts, (resp, i) => (
                    <Select.Option key={`respond_${i}`} value={resp.code}>
                      {resp.name}
                    </Select.Option>
                  ))}
                </Select>,
              )}
            </FormItem>
            <FormItem label="是否包邮">
              {getFieldDecorator('isFree', {
                initialValue: false,
                rules: [{ required: true, message: '必填项' }],
              })(
                <Radio.Group buttonStyle="solid">
                  <Radio.Button value={false}>自定义运费</Radio.Button>
                  <Radio.Button value={true}>卖家承担运费</Radio.Button>
                </Radio.Group>,
              )}
            </FormItem>
            <FormItem label="计价方式">
              {getFieldDecorator('billingType', {
                initialValue: 'count',
                rules: [{ required: true, message: '必填项' }],
              })(
                <Radio.Group buttonStyle="solid">
                  <Radio.Button value="count">按件数</Radio.Button>
                  <Radio.Button value="weight">按重量</Radio.Button>
                  <Radio.Button value="volume">按体积</Radio.Button>
                </Radio.Group>,
              )}
            </FormItem>
          </Form>
        </div>
        <div className={styles.products}>
          <Form labelCol={{ span: 0 }}>
            <div className={styles.title}>编辑运送方式</div>
            <Form.Item>
              {getFieldDecorator('sendingType')(
                <SendingTypeEditor unit={props.editor.billingType} />,
              )}
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
}
function mapStateToProps({ logistic }) {
  return logistic;
}
export default connect(mapStateToProps)(
  Form.create({ mapPropsToFields, onFieldsChange: onFieldsChange('logistic') })(Editor),
);
