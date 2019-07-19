import React, { PureComponent } from 'react';
import _ from 'lodash';
import { connect } from 'dva';
import moment from 'moment';
import { Button, Icon, Switch, Modal, Form, Input, Divider, Popconfirm } from 'antd';
import { FormItem, mapPropsToFields, onFieldsChange, TableX } from '../../utils/ui';

class ActivityType extends PureComponent {
  state = {
    show: false,
    shwoPassword: false,
  };
  columns = () => {
    return [
      {
        key: 'name',
        title: '类型名称',
        dataIndex: 'name',
      },
      {
        key: 'code',
        title: '编码',
        dataIndex: 'code',
      },
      {
        key: 'description',
        title: '描述',
        dataIndex: 'description',
      },
      {
        key: 'createTime',
        title: '创建时间',
        dataIndex: 'createTime',
        render: (t) => moment(t).format('YYYY-MM-DD HH:mm:ss'),
      },
      {
        key: 'status',
        title: '状态',
        dataIndex: 'status',
        render: (t, { id }) => {
          const change = (checked) => {
            this.props.dispatch({
              type: 'activityType/changeStatus',
              payload: { id, status: checked ? 1 : 0 },
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
                onClick={this.edit.bind(null, r)}
                size="small"
                shape="circle"
                type="ghost"
                icon="edit"
              />
              <Divider type="vertical" />

              <Popconfirm
                placement="top"
                okText="删除"
                okType="danger"
                title="是否删除活动类型?"
                content="一旦删除无还原?"
                onConfirm={this.remove.bind(null, t)}
              >
                <Button size="small" shape="circle" type="danger" icon="delete" />
              </Popconfirm>
            </div>
          );
        },
        align: 'right',
      },
    ];
  };
  edit = (record, e) => {
    e.preventDefault();
    this.showModal(record);
  };
  remove = (id, e) => {
    e.preventDefault();
    // Modal.confirm({
    //   title: '是否删除类型?',
    //   onOk: () => {
    //     this.props.dispatch({
    //       type: 'activityType/remove',
    //       id,
    //     });
    //   },
    // });
    this.props.dispatch({
      type: 'activityType/remove',
      id,
    });
  };
  showModal = (data) => {
    let _data = data;
    if (data && !_.isEmpty(data)) {
      _data = _.cloneDeep(_data);
      delete _data.createTime;
      delete _data.institution;
    }
    this.props.dispatch({
      type: 'activityType/upState',
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
          type: 'activityType/edit',
          payload: v,
        });
      }
    });
  };
  handleCancel = () => {
    this.props.dispatch({
      type: 'activityType/upState',
      payload: {
        editor: null,
      },
    });
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    const isNew = !this.props.editor || !this.props.editor.id;
    return (
      <div>
        <Button onClick={this.showModal.bind(null, {})} type="primary">
          <Icon type="plus" />
          添加活动类型
        </Button>
        <TableX
          columns={this.columns()}
          dataSource={this.props.data || []}
          pagination={this.props.pagination}
          fetchType="activityType/fetch"
          dispatch={this.props.dispatch}
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
            <FormItem label="类型名称">
              {getFieldDecorator('name', {
                rules: [{ required: true, message: '必填项' }],
              })(<Input placeholder="请输入类型名称" />)}
            </FormItem>
            <FormItem label="编码">
              {getFieldDecorator('code', {
                rules: [{ required: true, message: '必填项' }],
              })(<Input placeholder="请输入类型编码" />)}
            </FormItem>
            <FormItem label="描述">
              {getFieldDecorator('description')(
                <Input.TextArea
                  autosize={{ minRows: 2, maxRows: 6 }}
                  placeholder="请输入类型描述"
                />,
              )}
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
function mapStateToProps({ activityType }) {
  return activityType;
}
export default connect(mapStateToProps)(
  Form.create({ mapPropsToFields, onFieldsChange: onFieldsChange('activityType') })(ActivityType),
);
