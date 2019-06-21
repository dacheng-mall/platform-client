import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import _ from 'lodash';
import { Table, Button, Switch, Modal, Icon, Input, Divider } from 'antd';
import Editor from './editor';
import styles from '../index.less';

class QrType extends PureComponent {
  columns = [
    {
      key: 'name',
      title: '类型名称',
      dataIndex: 'name',
    },
    {
      key: 'description',
      title: '描述',
      dataIndex: 'description',
    },
    {
      key: 'fields',
      title: '采集信息',
      dataIndex: 'fields',
      render: (t, { id }) => {
        if(t){
          return _.map(JSON.parse(t), (item, i) => (
            <div key={`${id}_${item.code}`}>
              {item.label}-{item.help}-{item.required ? '必填' : '选填'}
            </div>
          ));
        }
        return '--'
      },
    },
    {
      key: 'status',
      title: '状态',
      dataIndex: 'status',
      render: (t, { id }) => {
        const change = (checked) => {
          this.props.dispatch({
            type: 'qrType/changeStatus',
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
              onClick={this.update.bind(null, r)}
              size="small"
              shape="circle"
              type="primary"
              icon="edit"
            />
          </div>
        );
      },
      align: 'right',
    },
  ];
  showModal = (data) => {
    this.props.dispatch({
      type: 'qrType/upState',
      payload: {
        editor: data,
      },
    });
  };
  search = (value) => {
    this.props.dispatch({
      type: 'qrType/searchByKeywords',
      payload: value,
    });
  };
  reset = () => {
    this.props.dispatch({
      type: 'qrType/searchByKeywords',
      payload: '',
    });
  };
  change = (e) => {
    this.props.dispatch({
      type: 'qrType/upState',
      payload: {
        keywords: _.trim(e.target.value),
      },
    });
  };
  update = (r) => {
    const { id, name, description, fields, status, editable, template } = r;
    this.showModal({
      id,
      name,
      description,
      fields: fields ? JSON.parse(fields) : [],
      status,
      editable,
      template
    });
  };
  render() {
    const initNewItem = {
      name: '',
      description: '',
      fields: [],
      status: 1,
    };
    return (
      <Fragment>
        <div className={styles.tableToolBar}>
          <Button onClick={this.showModal.bind(null, initNewItem)} type="primary">
            <Icon type="plus" />
            添加码类型
          </Button>
          <div className={styles.tableToolBar}>
            <Input.Search
              style={{ width: 320 }}
              onSearch={this.search}
              placeholder="请输入码类型名称关键字查询"
              onChange={this.change}
              value={this.props.keywords}
            />
            <Button onClick={this.reset}>重置</Button>
          </div>
        </div>
        <Table
          rowKey="id"
          columns={this.columns}
          dataSource={this.props.data || []}
          locale={{ emptyText: '暂无数据' }}
          pagination={{
            pageSize: this.props.pagination.pageSize,
            total: this.props.pagination.total,
            current: this.props.pagination.page,
            onChange: (page, pageSize) => {
              this.props.dispatch({
                type: 'qrType/fetch',
                payload: { page, pageSize },
              });
            },
          }}
        />
        <Editor editor={this.props.editor} />
      </Fragment>
    );
  }
}
function mapStateToProps({ qrType }) {
  return qrType;
}
export default connect(mapStateToProps)(QrType);
