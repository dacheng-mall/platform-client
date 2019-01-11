import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Table, Switch, Button, Modal, Input, Form, Spin, Select } from 'antd';
import { FormItem, mapPropsToFields } from '../../utils/ui';
import styles from './categories.less';

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
  willAdd = (e) => {
    e.preventDefault();
    this.setState({
      visible: true,
    });
  };
  close = () => {
    this.setState({
      visible: false,
    });
  };
  submit = () => {
    const { id, editor } = this.state;
    const { validateFields } = this.props.form;
    this.props.dispatch({
      type: 'catefories/submit',
      paylaod: { id, editor },
    });
  };
  fetch = (e) => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      this.props.dispatch({
        type: 'catefories/fetchWithName',
        payload: e,
      });
      clearTimeout(timer);
      timer = null;
    }, 300);
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    const { fetching } = this.state;
    return (
      <div>
        <Button icon="plus" type="primary" onClick={this.willAdd}>
          添加商品分类
        </Button>
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
                  labelInValue
                  notFoundContent={fetching ? <Spin size="small" /> : null}
                  placeholder="请选择父分类"
                  filterOption={false}
                  onSearch={this.fetch}
                />,
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
            <FormItem label="状态">{getFieldDecorator('status')(<Switch />)}</FormItem>
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
