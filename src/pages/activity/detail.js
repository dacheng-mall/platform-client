import React, { Fragment } from 'react';
import { connect } from 'dva';
import _ from 'lodash';
import { Form, Input, Select, Checkbox, DatePicker, Button, InputNumber } from 'antd';
import { FormItem, mapPropsToFields, onFieldsChange } from '../../utils/ui';
import Images from '../products/components/form/Images';
import LinkProducts from './components/LinkProducts';
import styles from './styles.less';

const RangePicker = DatePicker.RangePicker;
const TextArea = Input.TextArea;

function ActivityDetail(props) {
  const handleSearch = (keywords) => {
    if (_.trim(keywords)) {
      props.dispatch({
        type: 'activity/searchInst',
        payload: { name: keywords },
      });
    }
  };
  const { getFieldDecorator } = props.form;
  const renderOpts = (data) =>
    _.map(data, (d) => (
      <Select.Option key={d.id} value={d.id} title={d.name}>
        {d.name}
      </Select.Option>
    ));
  const submit = () => {
    const { validateFields } = props.form;
    try {
      validateFields((err, val) => {
        if (!err) {
          props.dispatch({
            type: 'activity/submit',
            values: val
          })
        }
      });
    } catch (e) {}
  };
  const parseErrorMessage = (error) => {
    if (error) {
      return _.map(error, ({ message }, i) => `${i !== 0 ? ',' : ''}${message}`);
    }
    return null;
  };
  return (
    <Fragment>
      <Form className={styles.form}>
        <FormItem label="活动名称">
          {getFieldDecorator('name', {
            rules: [{ required: true, message: '必填项' }],
          })(<Input placeholder="请输入活动名称" />)}
        </FormItem>
        <FormItem label="所属机构">
          {getFieldDecorator('institutionId', {
            rules: [{ required: true, message: '必填项' }],
          })(
            <Select
              showSearch
              placeholder="请选择所属机构"
              defaultActiveFirstOption={false}
              showArrow={false}
              filterOption={false}
              onSearch={handleSearch}
              allowClear
            >
              {renderOpts(props.inst)}
            </Select>,
          )}
        </FormItem>
        <FormItem label="可用职级">
          {props.grades.length < 1
            ? '请先选择机构'
            : getFieldDecorator('grades', {
                rules: [{ required: true, message: '必填项' }],
              })(
                <Checkbox.Group>
                  {_.map(props.grades, (grade, i) => (
                    <Checkbox value={grade.id} key={`grade_${i}`}>
                      {grade.name}
                    </Checkbox>
                  ))}
                </Checkbox.Group>,
              )}
        </FormItem>
        <FormItem label="周期">
          {getFieldDecorator('range', {
            rules: [{ type: 'array', required: true, message: '请设置活动周期' }],
          })(<RangePicker showTime format="YYYY-MM-DD HH:mm:ss" />)}
        </FormItem>
        <FormItem label="描述">
          {getFieldDecorator('description', {
            rules: [{ required: true, message: '请设输入活动描述' }],
          })(<TextArea rows={6} placeholder="请输入活动描述" />)}
        </FormItem>
        <FormItem
          label="图片"
          validateStatus={props.errors.images ? 'error' : ''}
          help={parseErrorMessage(props.errors.images)}
        >
          {getFieldDecorator('images', {
            rules: [{ required: false, message: '必填项' }],
          })(<Images />)}
        </FormItem>
        <FormItem label="候选礼品">
          {getFieldDecorator('products', {
            initialValue: [],
            rules: [{ type: 'array', required: true, message: '必填项' }],
          })(<LinkProducts />)}
        </FormItem>
        <FormItem label="领取品类上限" help="允许普通客户从礼品列表中领取的品类数量上限">
          {getFieldDecorator('totalCount', {
            initialValue: 1,
            rules: [{ type: 'number', required: true, message: '必填项' }],
          })(
            <InputNumber
              disabled={!props.editor.products || props.editor.products.length < 1}
              min={1}
              max={props.editor.products && props.editor.products.length || 1}
            />,
          )}
        </FormItem>
        <FormItem isTail>
          <Button type="primary" size="large" onClick={submit}>
            {props.id ? '编辑活动' : '新建活动'}
          </Button>
        </FormItem>
      </Form>
    </Fragment>
  );
}

function mapStateToProps({ activity }) {
  return activity;
}
function onValuesChange(props, changeValues, allValues) {
  if (changeValues.institutionId) {
    props.dispatch({
      type: 'activity/getGrades',
      institutionId: changeValues.institutionId,
    });
  }
  if (!allValues.institutionId) {
    props.form.resetFields(['grades']);
    props.dispatch({
      type: 'activity/clearGrades',
    });
  }
}
export default connect(mapStateToProps)(
  Form.create({ mapPropsToFields, onFieldsChange: onFieldsChange('activity'), onValuesChange })(
    ActivityDetail,
  ),
);
