import React from 'react';
import _ from 'lodash';
import { connect } from 'dva';
import { Switch, Modal, Select, Row, Col, Form, Input, Cascader, InputNumber } from 'antd';
import { FormItem, mapPropsToFields, onFieldsChange as ofc } from '../../../utils/ui';

function Editor(props) {
  const handleOk = () => {
    const { dispatch, form } = props;
    form.validateFields((e, v) => {
      if (!e) {
        dispatch({
          type: 'institution/edit',
          payload: v,
        });
      }
    });
  };
  const handleCancel = () => {
    props.dispatch({
      type: 'institution/upState',
      payload: {
        editor: null,
      },
    });
  };
  const changeArea = (path, vo) => {
    const regionName = _.map(vo, ({ name }) => name).join(' ');
    props.form.setFields({ regionName: { value: regionName } });
  };
  const { getFieldDecorator } = props.form;
  const isNew = !props.editor || !props.editor.id;
  const handleSearch = (keywords) => {
    if (_.trim(keywords)) {
      props.dispatch({
        type: 'institution/searchInst',
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
      title={isNew ? '新建机构' : '编辑机构'}
      onOk={handleOk}
      onCancel={handleCancel}
      cancelText="取消"
      okText="确定"
      width={720}
    >
      <Form layout="horizontal">
        <Row type="flex">
          <Col span={12}>
            <FormItem label="机构名称">
              {getFieldDecorator('name', {
                rules: [{ required: true, message: '必填项' }],
              })(<Input placeholder="请输入机构名称" />)}
            </FormItem>
            <FormItem label="机构简称">
              {getFieldDecorator('shortName', {
                rules: [{ required: true, message: '必填项' }],
              })(<Input placeholder="请输入机构简称" />)}
            </FormItem>
            <FormItem label="机构等级">
              {getFieldDecorator('level')(
                <Select
                  placeholder="请选择"
                >
                  <Select.Option value={0}>总公司</Select.Option>
                  <Select.Option value={1}>分公司</Select.Option>
                  <Select.Option value={2}>中心支公司</Select.Option>
                  <Select.Option value={3}>营业区</Select.Option>
                </Select>,
              )}
            </FormItem>
            <FormItem label="编码">
              {getFieldDecorator('code')(<Input placeholder="请输入机构编码" />)}
            </FormItem>
            <FormItem label="上级机构">
              {getFieldDecorator('pid')(
                <Select
                  showSearch
                  placeholder="名称关键字查询上级机构, 顶层机构请忽略"
                  defaultActiveFirstOption={false}
                  showArrow={false}
                  filterOption={false}
                  onSearch={handleSearch}
                  allowClear
                >
                  {renderOpts(props.parents)}
                </Select>,
              )}
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
            <FormItem label="总称" help="比如'天安人寿', '富德生命'等">
              {getFieldDecorator('rootName', {
                rules: [{ required: true, message: '必填项' }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
            <FormItem label="显示权重" help="数字越小越靠前">
              {getFieldDecorator('displayOrder', {
                rules: [{ required: true, message: '必填项' }],
              })(<InputNumber placeholder="数字" />)}
            </FormItem>
            <FormItem label="区域">
              {getFieldDecorator('regionId')(
                <Cascader
                  fieldNames={{ label: 'name', value: 'id', children: 'children' }}
                  options={props.region}
                  placeholder="请选择区域"
                  onChange={changeArea}
                  changeOnSelect
                  showSearch
                />,
              )}
            </FormItem>
            <FormItem label="序列号">
              {getFieldDecorator('sn')(<Input placeholder="请输入数字" />)}
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
function mapStateToProps({ institution, app }) {
  return { ...institution, region: app.region };
}

export default connect(mapStateToProps)(
  Form.create({ mapPropsToFields, onFieldsChange: ofc('institution') })(Editor),
);
