import React, { Fragment, useState } from 'react';
import _ from 'lodash';
import { connect } from 'dva';
import { Switch, Modal, Select, Row, Col, Form, Input, InputNumber } from 'antd';
import { FormItem, mapPropsToFields, onFieldsChange as ofc } from '../../../utils/ui';
import LinkOther from './linkOther';
import Images from "../../products/components/form/Images";

function Editor(props) {
  const handleOk = () => {
    const { dispatch, form } = props;
    form.validateFields((e, v) => {
      if (!e) {
        dispatch({
          type: 'qrBatch/edit',
          payload: v,
        });
      }
    });
  };
  const handleCancel = () => {
    props.dispatch({
      type: 'qrBatch/upState',
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
        type: 'qrBatch/searchInst',
        payload: keywords,
      });
    }
  };
  const renderTypesOption = (data) =>
    _.map(data, (d) => (
      <Select.Option key={d.id} value={d.id} title={d.name}>
        {d.name}
      </Select.Option>
    ));
  return (
    <Modal
      visible={props.editor !== null}
      title={isNew ? '新建二维码批次' : '编辑二维码批次'}
      onOk={handleOk}
      onCancel={handleCancel}
      cancelText="取消"
      okText="确定"
      width={1024}
    >
      <Form layout="horizontal">
        <Row type="flex">
          <Col span={10}>
            <FormItem label="批次名称">
              {getFieldDecorator('name', {
                rules: [{ required: true, message: '必填项' }],
              })(<Input placeholder="请输入二维码批次名称" />)}
            </FormItem>
            <FormItem label="数量">
              {getFieldDecorator('total', {
                rules: [{ required: true, message: '必填项' }],
              })(<InputNumber disabled={!isNew} placeholder="请输入数量" min={1} />)}
            </FormItem>
            <FormItem label="码类型">
              {getFieldDecorator('typeId', {
                rules: [{ required: true, message: '必填项' }],
              })(
                <Select allowClear disabled={!isNew} placeholder="请选择码类型">
                  {renderTypesOption(props.types)}
                </Select>,
              )}
            </FormItem>
            <FormItem label="描述">
              {getFieldDecorator('description')(
                <Input.TextArea placeholder="请输入描述信息" rows={4} />,
              )}
            </FormItem>
            <FormItem label="状态">
              {getFieldDecorator('status', { valuePropName: 'checked' })(<Switch />)}
            </FormItem>
          </Col>
          <Col span={14}>
            <FormItem
              label="图片"
              validateStatus={props.errors.images ? 'error' : ''}
            >
              {getFieldDecorator('images')(<Images max={1} />)}
            </FormItem>
            <FormItem label="关联实体">
              {props.editor ? getFieldDecorator('linked')(<LinkOther />) : null}
            </FormItem>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}
function mapStateToProps({ qrBatch }) {
  return qrBatch;
}

export default connect(mapStateToProps)(
  Form.create({ mapPropsToFields, onFieldsChange: ofc('qrBatch') })(Editor),
);
