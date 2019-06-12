import React, { Fragment, useState } from 'react';
import _ from 'lodash';
import { connect } from 'dva';
import { Switch, Modal, Select, Row, Col, Form, Input, Cascader } from 'antd';
import { FormItem, mapPropsToFields, onFieldsChange as ofc } from '../../../utils/ui';

const areaDataOrigin = require('../../../assets/area.json');

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
  const changeArea = (v, vo) => {
    const regionName = _.map(vo, ({ label }) => label).join(' ');
    props.dispatch({
      type: 'qrType/fieldsChange',
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
  const { getFieldDecorator } = props.form;
  const isNew = !props.editor || !props.editor.id;
  const handleSearch = (keywords) => {
    if (_.trim(keywords)) {
      props.dispatch({
        type: 'qrType/searchInst',
        payload: keywords,
      });
    }
  };
  const renderOpts = (data) =>
    _.map(data, (d) => (
      <Select.Option key={d.id} value={d.id} title={d.name}>
        {d.name}
      </Select.Option>
    ));
  getFieldDecorator('regionName');
  return (
    <Modal
      visible={props.editor !== null}
      title={isNew ? '新建码类型' : '编辑码类型'}
      onOk={handleOk}
      onCancel={handleCancel}
      cancelText="取消"
      okText="确定"
      width={720}
    >
      <Form layout="horizontal">
        <Row type="flex">
          <Col span={12}>
            <FormItem label="类型名称">
              {getFieldDecorator('name', {
                rules: [{ required: true, message: '必填项' }],
              })(<Input placeholder="请输入二维码类型名称" />)}
            </FormItem>
            <FormItem label="联系人">
              {getFieldDecorator('master')(<Input placeholder="请输入联系人姓名" />)}
            </FormItem>
            <FormItem label="联系电话">
              {getFieldDecorator('masterPhone')(<Input placeholder="请输入是手机号" />)}
            </FormItem>
            <FormItem label="状态">
              {getFieldDecorator('status', { valuePropName: 'checked' })(<Switch />)}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="区域">
              {getFieldDecorator('regionId')(
                <Cascader
                  options={areaDataOrigin}
                  onChange={changeArea}
                  changeOnSelect
                  showSearch
                  placeholder="请选择区域"
                />,
              )}
            </FormItem>
            <FormItem label="详细地址">
              {getFieldDecorator('address')(
                <Input.TextArea placeholder="请输入街道门牌号等详细地址信息" rows={4} />,
              )}
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
function mapStateToProps({ qrType }) {
  return qrType;
}

export default connect(mapStateToProps)(
  Form.create({ mapPropsToFields, onFieldsChange: ofc('qrType') })(Editor),
);
