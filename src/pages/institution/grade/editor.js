import React, { Fragment, useState } from 'react';
import _ from 'lodash';
import { connect } from 'dva';
import { InputNumber, Switch, Modal, Select, Row, Col, Form, Input, Cascader } from 'antd';
import { FormItem, mapPropsToFields, onFieldsChange } from '../../../utils/ui';

function Editor(props) {
  const handleOk = () => {
    const { dispatch, form } = props;
    form.validateFields((e, v) => {
      if (!e) {
        dispatch({
          type: 'grade/edit',
          payload: v,
        });
      }
    });
  };
  const handleCancel = () => {
    props.dispatch({
      type: 'grade/upState',
      payload: {
        editor: null,
      },
    });
  };
  const { getFieldDecorator } = props.form;
  const isNew = !props.editor || !props.editor.id;
  const handleSearch = (keywords) => {
    if (_.trim(keywords)) {
      props.dispatch({
        type: 'grade/searchInst',
        payload: { name: keywords },
      });
    }
  };
  const renderOpts = (data) =>
    _.map(data, (d) => (
      <Select.Option key={d.id} value={d.id} title={d.name}>
        {d.name}
      </Select.Option>
    ));
  return (
    <Modal
      visible={props.editor !== null}
      title={isNew ? '新建职级' : '编辑职级'}
      onOk={handleOk}
      onCancel={handleCancel}
      cancelText="取消"
      okText="确定"
      width={720}
    >
      <Form layout="horizontal">
        <Row type="flex">
          <Col span={12}>
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
            <FormItem label="职级名称">
              {getFieldDecorator('name', {
                rules: [{ required: true, message: '必填项' }],
              })(<Input placeholder="请输入职级名称" />)}
            </FormItem>
            <FormItem label="编码">
              {getFieldDecorator('code')(<Input placeholder="请输入职级编码" />)}
            </FormItem>
            <FormItem label="状态">
              {getFieldDecorator('status', { valuePropName: 'checked' })(<Switch />)}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="排序权重" help="数值越大越靠前">
              {getFieldDecorator('displayOrder', {
                initialValue: 0
              })(<InputNumber style={{minWidth: '200px'}} min={0} max={9999} placeholder="数字越大越靠前" />)}
            </FormItem>
            <FormItem label="描述">
              {getFieldDecorator('description')(
                <Input.TextArea placeholder="请输入描述信息" rows={4} />,
              )}
            </FormItem>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}
function mapStateToProps({ grade }) {
  return grade;
}
export default connect(mapStateToProps)(
  Form.create({ mapPropsToFields, onFieldsChange: onFieldsChange('grade') })(Editor),
);
