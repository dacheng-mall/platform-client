import React, { PureComponent, Fragment } from 'react';
import _ from 'lodash';
import { connect } from 'dva';
import {
  Row,
  Col,
  Table,
  Button,
  Icon,
  Switch,
  Modal,
  Form,
  Input,
  Radio,
  Checkbox,
  Divider,
} from 'antd';
import { FormItem, mapPropsToFields } from '../../../utils/ui';
class Admin extends PureComponent {
  state = {
    show: false,
    shwoPassword: false,
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
      },
      {
        key: 'status',
        title: '状态',
        dataIndex: 'status',
        render: (t, { id, username }) => {
          const change = (checked) => {
            this.props.dispatch({
              type: 'admin/changeStatus',
              payload: { id, username, status: checked ? 1 : 0 },
            });
          };
          return <Switch size="small" checked={t === 1} onChange={change} />;
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
              <Button
                onClick={this.resetPW.bind(null, r)}
                size="small"
                shape="circle"
                type="ghost"
                icon="sync"
              />
              <Divider type="vertical" />
              <Button
                onClick={this.edit.bind(null, r)}
                size="small"
                shape="circle"
                type="ghost"
                icon="edit"
              />
              {r.username !== 'adm' ? (
                <Fragment>
                  <Divider type="vertical" />
                  <Button
                    onClick={this.remove.bind(null, t, r)}
                    size="small"
                    shape="circle"
                    type="danger"
                    icon="delete"
                  />
                </Fragment>
              ) : null}
            </div>
          );
        },
        align: 'right',
      },
    ];
  };
  resetPW = ({ id, username }, e) => {
    e.preventDefault();
    Modal.confirm({
      title: '是否重置该用户密码?',
      content: '密码将被重置为“111111”',
      onOk: () => {
        this.props.dispatch({
          type: 'admin/resetPW',
          payload: { id, username },
        });
      },
    });
  };
  edit = (record, e) => {
    e.preventDefault();
    this.showModal(record);
  };
  remove = (id, data, e) => {
    e.preventDefault();
    Modal.confirm({
      title: '是否删除用户?',
      onOk: () => {
        this.props.dispatch({
          type: 'admin/remove',
          id,
        });
      },
    });
  };
  showModal = (data) => {
    let _data = data
    if(data && !_.isEmpty(data)) {
      _data = _.cloneDeep(_data);
      console.log(data);
      delete _data.createTime;
      delete _data.institution;
    }
    this.props.dispatch({
      type: 'admin/upState',
      payload: {
        editor: _data,
      },
    });
  };
  handleOk = () => {
    const { dispatch, form } = this.props;
    form.validateFields((e, v) => {
      if (!e) {
        dispatch({
          type: 'admin/editUser',
          payload: v,
        });
      }
    });
  };
  handleCancel = () => {
    this.props.dispatch({
      type: 'admin/upState',
      payload: {
        editor: null,
      },
    });
  };
  switchType = () => {
    this.setState({
      shwoPassword: !this.state.shwoPassword,
    });
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    const isNew = !this.props.editor || !this.props.editor.id;
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
          dataSource={this.props.data || []}
          locale={{ emptyText: '暂无数据' }}
          pagination={{
            pageSize: this.props.pagination.pageSize,
            total: this.props.pagination.total,
            current: this.props.pagination.page,
            onChange: (page, pageSize) => {
              this.props.dispatch({
                type: 'admin/fetch',
                payload: { page, pageSize, userType: 1 },
              });
            },
          }}
        />
        <Modal
          visible={this.props.editor !== null}
          title={isNew ? '新建' : '编辑'}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          cancelText="取消"
          okText="确定"
        >
          <Form layout="horizontal">
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
                      <Icon
                        onClick={this.switchType}
                        type={this.state.shwoPassword ? 'eye-invisible' : 'eye'}
                      />
                    }
                    type={this.state.shwoPassword ? '' : 'password'}
                    placeholder="请输入密码"
                  />,
                )}
              </FormItem>
            ) : null}
            <FormItem label="性别">
              {getFieldDecorator('gender', {
                rules: [{ required: true, message: '必填项' }],
              })(
                <Radio.Group buttonStyle="solid">
                  <Radio.Button value="male">男</Radio.Button>
                  <Radio.Button value="female">女</Radio.Button>
                  <Radio.Button value="secret">保密</Radio.Button>
                </Radio.Group>,
              )}
            </FormItem>
            <FormItem label="角色">
              {getFieldDecorator('roles', {
                rules: [{ required: true }],
              })(
                <Checkbox.Group style={{ width: '100%', marginTop: '0.1rem' }}>
                  <Row>
                    <Col span={8}>
                      <Checkbox value="admin">管理员</Checkbox>
                    </Col>
                    <Col span={8}>
                      <Checkbox value="financial">财务</Checkbox>
                    </Col>
                    <Col span={8}>
                      <Checkbox disabled value="servicer">
                        客服
                      </Checkbox>
                    </Col>
                  </Row>
                </Checkbox.Group>,
              )}
            </FormItem>
            <FormItem label="手机号">
              {getFieldDecorator('mobile', {
                rules: [{ required: true }],
              })(<Input placeholder="请输入是手机号" />)}
            </FormItem>
            <FormItem label="身份证号">
              {getFieldDecorator('idCard', {
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
export default connect(mapStateToProps)(Form.create({ mapPropsToFields })(Admin));
