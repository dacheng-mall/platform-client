import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Table, Button, Icon, Switch, Modal, Form, Input, Radio, Checkbox } from 'antd';
import { FormItem, mapPropsToFields, onFieldsChange } from '../../../utils/ui';
class Admin extends PureComponent {
  state = {
    show: false,
  };
  columns = () => {
    return [
      {
        key: 'name',
        title: '姓名',
        dataIndex: 'name',
      },
      {
        key: 'username',
        title: '用户名',
        dataIndex: 'username',
      },
      {
        key: 'mobile',
        title: '手机号',
        dataIndex: 'mobile',
      },
      {
        key: 'roles',
        title: '角色',
        dataIndex: 'roles',
        render(t) {
          return t.join(',');
        },
      },
      {
        key: 'status',
        title: '状态',
        dataIndex: 'status',
        render(t) {
          const change = checked => {
            console.log(checked);
          };
          return <Switch size="small" defaultChecked={t === 1} onChange={change} />;
        },
        align: 'center',
      },
      {
        key: 'operator',
        title: '操作',
        dataIndex: 'id',
        render: (t, r) => {
          return (
            <div>
              <Button onClick={this.edit.bind(null, r)} size="small" shape="circle" type="ghost" icon="edit" />
              <Button onClick={this.remove.bind(null, t)} size="small" shape="circle" type="danger" icon="delete" />
            </div>
          );
        },
        align: 'right',
      },
    ];
  };
  edit = (record, e) => {
    e.preventDefault();
    this.showModal(record)
  }
  remove = (id, e) => {
    e.preventDefault();
    console.log(id)
  }
  showModal = data => {
    this.props.dispatch({
      type: 'admin/upState',
      payload: {
        editor: data,
      },
    });
  };
  handleOk = () => {};
  handleCancel = () => {
    this.props.dispatch({
      type: 'admin/upState',
      payload: {
        editor: null,
      },
    });
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <Button onClick={this.showModal.bind(null, {})} type="primary">
          <Icon type="plus" />
          添加管理员
        </Button>
        <br />
        <Table
          rowKey="id"
          columns={this.columns()}
          dataSource={this.props.list}
          locale={{ emptyText: '暂无数据' }}
        />
        <Modal
          visible={this.props.editor !== null}
          title={this.props.editor && this.props.editor.id ? '编辑' : '新建'}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          cancelText="取消"
          okText="确定"
        >
          <Form layout="horizontal">
            <FormItem label="姓名">
              {getFieldDecorator('name', {
                rules: [{ required: true }],
              })(<Input placeholder="请输入姓名" />)}
            </FormItem>
            <FormItem label="用户名">
              {getFieldDecorator('username', {
                rules: [{ required: true }],
              })(<Input placeholder="请输入用户名" />)}
            </FormItem>
            <FormItem label="性别">
              {getFieldDecorator('gender', {
                rules: [{ required: true }],
              })(
                <Radio.Group buttonStyle="solid">
                  <Radio.Button value="male">男</Radio.Button>
                  <Radio.Button value="female">女</Radio.Button>
                  <Radio.Button value="secret">保密</Radio.Button>
                </Radio.Group>
              )}
            </FormItem>
            <FormItem label="角色">
              {getFieldDecorator('roles', {
                rules: [{ required: true }],
              })(<Checkbox.Group style={{width: '100%', marginTop: '0.1rem'}}>
                <Row>
                  <Col span={8}><Checkbox value="admin">管理员</Checkbox></Col>
                  <Col span={8}><Checkbox disabled value="cfo">财务</Checkbox></Col>
                  <Col span={8}><Checkbox disabled value="servicer">客服</Checkbox></Col>
                </Row>
              </Checkbox.Group>)}
            </FormItem>
            <FormItem label="手机号">
              {getFieldDecorator('mobile', {
                rules: [{ required: true }],
              })(<Input placeholder="请输入是手机号" />)}
            </FormItem>
            <FormItem label="身份证号">
              {getFieldDecorator('idcard', {
                rules: [{ required: true }],
              })(<Input placeholder="请输入是身份证号" />)}
            </FormItem>
            <FormItem label="状态">
              {getFieldDecorator('status', {
                valuePropName: 'checked',
              })(<Switch />)}
            </FormItem>
          </Form>
        </Modal>
      </div>
    );
  }
}
function mapStateToProps({ admin }) {
  return admin;
}
export default connect(mapStateToProps)(Form.create({mapPropsToFields, onFieldsChange: onFieldsChange('admin')})(Admin));