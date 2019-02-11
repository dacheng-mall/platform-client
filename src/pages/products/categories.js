import React, { PureComponent } from 'react';
import { connect } from 'dva';
import _ from 'lodash';
import { Table, Switch, Button, Modal, Input, Form, Spin, Select, Divider } from 'antd';
import { FormItem, mapPropsToFields } from '../../utils/ui';
// import styles from './categories.less';

let timer = '';

const normalize = (d) => {
  const data = _.cloneDeep(d);
  const index = [];
  const _data = [];
  while (data.length > 0) {
    let current = [];
    if (index.length < 1) {
      // 如果索引不存在, 就取根分类
      current = _.remove(data, ({ pid }) => !pid);
    } else {
      // 否则, 从index里取第一个值
      const parentKeys = index[0];
      current = _.remove(data, ({ pid }) => _.includes(parentKeys, pid));
    }
    const keys = _.map(current, ({ id }) => id);
    index.unshift(keys);
    _data.unshift(current);
  }
  _.forEach(_data, (d, i) => {
    const children = d;
    const parent = _data[i + 1];
    _.forEach(children, (child, i) => {
      const pid = child.pid;
      const currentParent = _.find(parent, ['id', pid]);
      if (currentParent && !currentParent.children) {
        currentParent.children = [child];
      } else if (!currentParent) {
        // currentParent.children.push(child)
      } else {
        currentParent.children.push(child);
      }
    });
  });
  return _.last(_data);
};

class Categories extends PureComponent {
  state = {
    visible: false,
    fetching: false,
    data: [],
  };
  static getDerivedStateFromProps(props, state) {
    // 列表数据更新后, 重新渲染页面, 否则不再执行序列化
    if (props.needUpdate || !state.data || state.data.length < 1) {
      const data = normalize(props.data);
      props.dispatch({
        type: 'categories/upState',
        payload: {
          needUpdate: false,
        },
      });
      return { ...state, data };
    }
    return null;
  }
  close = () => {
    this.props.form.resetFields();
    this.props.dispatch({
      type: 'categories/upState',
      payload: { editor: null },
    });
  };
  submit = () => {
    const { validateFields } = this.props.form;
    validateFields((err, value) => {
      if (!err) {
        this.props.dispatch({
          type: 'categories/submit',
          value,
        });
      }
    });
  };
  fetch = (e) => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      this.props.dispatch({
        type: 'categories/fetchCate',
        payload: { name: e },
      });
      clearTimeout(timer);
      timer = null;
    }, 300);
  };
  changeStatus = (data, value) => {
    data.status = value;
    this.props.dispatch({
      type: 'categories/submit',
      value: data,
    });
  };
  edit = (data) => {
    this.props.dispatch({
      type: 'categories/edit',
      payload: data,
    });
  };
  
  remove = (id, data, e) => {
    e.preventDefault();
    Modal.confirm({
      title: '是否删除商品分类?',
      content: `分类名称-${data.name}`,
      onOk: () => {
        this.props.dispatch({
          type: 'categories/remove',
          id,
        });
      },
    });
  };
  columns = [
    {
      key: 'name',
      dataIndex: 'name',
      title: '名称',
    },
    {
      key: 'description',
      dataIndex: 'description',
      title: '描述',
    },
    {
      key: 'status',
      dataIndex: 'status',
      render: (text, record) => {
        return <Switch checked={text === 1} onChange={this.changeStatus.bind(null, record)} />;
      },
      align: 'center',
      title: '状态',
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
      },
    },
  ];
  render() {
    const { getFieldDecorator } = this.props.form;
    const { fetching } = this.state;
    if (this.props.editor) {
      getFieldDecorator('id', {
        initialValue: this.props.editor.id,
      });
    }
    return (
      <div>
        <Button icon="plus" type="primary" onClick={this.edit.bind(null, {})}>
          添加商品分类
        </Button>
        <Table
          columns={this.columns}
          dataSource={this.state.data}
          rowKey="id"
          onExpand={this.onExpand}
        />
        <Modal
          title={this.state.id ? '编辑分类' : '新建分类'}
          visible={!!this.props.editor}
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
                  {this.props.parentCategories.length > 0
                    ? _.map(this.props.parentCategories, (cate, index) => {
                        return (
                          <Select.Option key={`option_${index}`} value={cate.id}>
                            {cate.name}
                          </Select.Option>
                        );
                      })
                    : null}
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

function mapStateToProps({ categories }) {
  return categories;
}

export default connect(mapStateToProps)(Form.create({ mapPropsToFields })(Categories));
