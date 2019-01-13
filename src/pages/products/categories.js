import React, { PureComponent } from 'react';
import { connect } from 'dva';
import _ from 'lodash';
import { Table, Switch, Button, Modal, Input, Form, Spin, Select, Divider } from 'antd';
import { FormItem, mapPropsToFields } from '../../utils/ui';
// import styles from './categories.less';

let timer = '';

class Categories extends PureComponent {
  state = {
    visible: false,
    result: [],
    fetching: false,
  };
  onChange = (e) => {
    console.log(e);
  };
  showModal = () => {
    this.setState({
      visible: true,
    });
  };
  close = () => {
    this.setState({
      visible: false,
    });
    this.props.dispatch({
      type: 'categories/upState',
      payload: {editor: {}}
    })
    this.props.form.resetFields()
  };
  submit = () => {
    const { validateFields } = this.props.form;
    validateFields((err, value) => {
      console.log(value)
      if(!err) {
        this.props.dispatch({
          type: 'categories/submit',
          value,
        });
      }
    })
  };
  fetch = (e) => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      this.props.dispatch({
        type: 'categories/fetchCate',
        payload: { name:e} ,
      });
      clearTimeout(timer);
      timer = null;
    }, 300);
  };
  changeStatus = (id, value) => {
    console.log(id, value)
  }
  edit = (data) => {
    this.props.dispatch({
      type: 'categories/edit',
      payload: data
    })
    this.showModal()
  }
  remove = () => {}
  columns = [
    {
      key: 'name',
      dataIndex: 'name',
      title: '名称'
    },
    {
      key: 'description',
      dataIndex: 'description',
      title: '描述'
    },
    {
      key: 'status',
      dataIndex: 'status',
      render: (text, record) => {
        return <Switch checked={text === 1} onChange={this.changeStatus.bind(null, record.id)} />
      },
      align: 'center',
      title: '状态'
    },
    {
      key: 'operator',
      dataIndex: 'id',
      title: '操作',
      align: 'right',
      render: (id, r) => {
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
            <Button
              onClick={this.remove.bind(null, id, r)}
              size="small"
              shape="circle"
              type="danger"
              icon="delete"
            />
          </div>
        );
      }
    }
  ]
  onExpand = (expanded, record) => {
    if(expanded) {
      this.props.dispatch({
        type: 'categories/fetchData',
        pid: record.id,
        path: record.path
      })
    }
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { fetching } = this.state;
    getFieldDecorator('id', {
      initialValue: this.props.editor.id
    })
    return (
      <div>
        <Button icon="plus" type="primary" onClick={this.showModal}>
          添加商品分类
        </Button>
        <Table
          columns={this.columns}
          dataSource={this.props.data}
          rowKey="id"
          onExpand={this.onExpand}
        />
        <Modal
          title={this.state.id ? '编辑分类' : '新建分类'}
          visible={this.state.visible}
          onCancel={this.close}
          onOk={this.submit}
        >
          <Form>
            <FormItem label="父分类">
              {getFieldDecorator('pid')(
                <Select
                  showSearch
                  notFoundContent={fetching ? <Spin size="small" /> : null}
                  placeholder="请选择父分类"
                  filterOption={false}
                  onSearch={this.fetch}
                >
                  {this.props.parentCategories.length > 0 ? _.map(this.props.parentCategories, (cate, index) => {
                    return <Select.Option key={`option_${index}`} value={cate.id}>{cate.name}</Select.Option>
                  }) : null}
                </Select>,
              )}
            </FormItem>
            <FormItem label="分类名称">
              {getFieldDecorator('name', {
                rules: [{ required: true, message: '必填项' }],
              })(<Input placeholder="请输入分类名称" />)}
            </FormItem>
            <FormItem label="分类描述">
              {getFieldDecorator('description')(<Input.TextArea placeholder="请输入分类描述" />)}
            </FormItem>
            <FormItem label="状态">{getFieldDecorator('status', {
              valuePropName: 'checked'
            })(<Switch />)}</FormItem>
          </Form>
        </Modal>
      </div>
    );
  }
}

function mapStateToProps({ categories }) {
  return categories;
}

export default connect(mapStateToProps)(Form.create({ mapPropsToFields })(Categories));
