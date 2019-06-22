import React, { Fragment, useState } from 'react';
import _ from 'lodash';
import { connect } from 'dva';
import { Switch, Modal, Select, Row, Col, Form, Input, Cascader } from 'antd';
import { FormItem, mapPropsToFields, onFieldsChange as ofc } from '../../../utils/ui';
import FieldsGroup from './fieldsInput';

function Editor(props) {
  const handleOk = () => {
    const { dispatch, form } = props;
    form.validateFields((e, v) => {
      if (!e) {
        dispatch({
          type: 'qrType/edit',
          payload: v,
        });
      }
    });
  };
  const handleCancel = () => {
    props.dispatch({
      type: 'qrType/upState',
      payload: {
        editor: null,
      },
    });
  };
  const { getFieldDecorator } = props.form;
  const isNew = !props.editor || !props.editor.id;
  return (
    <Modal
      visible={props.editor !== null}
      title={isNew ? '新建码类型' : '编辑码类型'}
      onOk={handleOk}
      onCancel={handleCancel}
      cancelText="取消"
      okText="确定"
      width={1024}
    >
      <Form layout="horizontal">
        <Row type="flex">
          <Col span={8}>
            <FormItem label="类型名称">
              {getFieldDecorator('name', {
                rules: [{ required: true, message: '必填项' }],
              })(<Input placeholder="请输入二维码类型名称" />)}
            </FormItem>
            <FormItem label="描述">
              {getFieldDecorator('description')(
                <Input.TextArea placeholder="请输入描述信息" rows={4} />,
              )}
            </FormItem>
            <FormItem label="状态">
              {getFieldDecorator('status', { valuePropName: 'checked' })(<Switch />)}
            </FormItem>
            <FormItem label="强绑业务员">
              {getFieldDecorator('bindSalesman', { valuePropName: 'checked' })(<Switch />)}
            </FormItem>
          </Col>
          <Col span={16}>
            <FormItem label="渲染模板">
              {getFieldDecorator('template')(
                <Input.TextArea placeholder="请输入html代码" rows={4} />,
              )}
            </FormItem>
            <FormItem label="采集数据">
              {getFieldDecorator('fields')(
                <FieldsGroup />,
              )}
            </FormItem>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}
function mapStateToProps({ qrType }) {
  return qrType;
}

export default connect(mapStateToProps)(
  Form.create({ mapPropsToFields, onFieldsChange: ofc('qrType') })(Editor),
);
