import React, { Fragment, useState } from 'react';
import _ from 'lodash';
import { connect } from 'dva';
import { Switch, Radio, Modal, Select, Icon, Row, Col, Form, Input } from 'antd';
import {
  FormItem,
  mapPropsToFields,
  checkMobile,
  checkIdcard,
  onFieldsChange,
} from '../../../utils/ui';

function Editor(props) {
  const [showPW, setShowPW] = useState(false);
  const handleOk = () => {
    const { dispatch, form } = props;
    form.validateFields((e, v) => {
      if (!e) {
        dispatch({
          type: 'instAdmin/edit',
          payload: v,
        });
      }
    });
  };
  const handleCancel = () => {
    props.dispatch({
      type: 'instAdmin/upState',
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
        type: 'instAdmin/searchInst',
        payload: {name: keywords},
      });
    }
  };
  const renderOpts = (data) =>
    _.map(data, (d) => (
      <Select.Option key={d.id} value={d.id} title={d.name}>
        {d.name}
      </Select.Option>
    ));
  const switchType = () => {
    setShowPW(!showPW);
  };
  return (
    <Modal
      visible={props.editor !== null}
      title={isNew ? '新建机构管理员' : '编辑机构管理员'}
      onOk={handleOk}
      onCancel={handleCancel}
      cancelText="取消"
      okText="确定"
      width={720}
    >
      <Form layout="horizontal">
        <Row type="flex">
          <Col span={12}>
            <FormItem label="姓名">
              {getFieldDecorator('name', {
                rules: [{ required: true, message: '必填项' }],
              })(<Input placeholder="请输入姓名" />)}
            </FormItem>
            <FormItem label="用户名">
              {getFieldDecorator('username', {
                rules: [{ required: true, message: '必填项' }],
              })(<Input placeholder="请输入用户名" />)}
            </FormItem>
            {isNew ? (
              <FormItem label="密码">
                {getFieldDecorator('password', {
                  rules: [{ required: true, message: '必填项' }],
                })(
                  <Input
                    addonAfter={
                      <Icon onClick={switchType} type={showPW ? 'eye-invisible' : 'eye'} />
                    }
                    type={showPW ? '' : 'password'}
                    placeholder="请输入密码"
                  />,
                )}
              </FormItem>
            ) : null}
            <FormItem label="状态">
              {getFieldDecorator('status', { valuePropName: 'checked' })(<Switch />)}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="所属机构">
              {getFieldDecorator('institutionId', {
                rules: [{ required: true, message: '必填项' }],
              })(
                <Select
                  showSearch
                  placeholder="按名称关键字机构"
                  defaultActiveFirstOption={false}
                  showArrow={false}
                  filterOption={false}
                  allowClear
                  onSearch={handleSearch}
                >
                  {renderOpts(props.inst)}
                </Select>,
              )}
            </FormItem>
            <FormItem label="手机号">
              {getFieldDecorator('mobile', {
                rules: [{ validator: checkMobile }],
              })(<Input placeholder="请输入手机号" />)}
            </FormItem>
            <FormItem label="身份证号">
              {getFieldDecorator('idcard', {
                rules: [{ validator: checkIdcard }],
              })(<Input placeholder="请输入身份证号" />)}
            </FormItem>
            <FormItem label="性别">
              {getFieldDecorator('gender')(
                <Radio.Group buttonStyle="solid">
                  <Radio.Button value="male">男</Radio.Button>
                  <Radio.Button value="female">女</Radio.Button>
                  <Radio.Button value="secret">保密</Radio.Button>
                </Radio.Group>,
              )}
            </FormItem>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}
function mapStateToProps({ instAdmin }) {
  return instAdmin;
}
// function onFieldsChange({ dispatch }, changedFields) {
//   dispatch({
//     type: 'instAdmin/upEditors',
//     payload: changedFields,
//   });
// }
export default connect(mapStateToProps)(
  Form.create({ mapPropsToFields, onFieldsChange: onFieldsChange('instAdmin') })(Editor),
);
