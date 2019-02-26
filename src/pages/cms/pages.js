import React, { PureComponent } from 'react';
import { Table, Button, Switch, Divider, Modal } from 'antd';
import { connect } from 'dva';
import { jump } from '../../utils';

class CmsHome extends PureComponent {
  columns = [
    {
      key: 'name',
      dataIndex: 'name',
      title: '名称',
      width: 128
    },
    {
      key: 'code',
      dataIndex: 'code',
      title: 'code',
      width: 128,
      align: 'center',
    },
    {
      key: 'count',
      dataIndex: 'count',
      title: '元素数',
      align: 'center',
      width: 128
    },
    {
      key: 'description',
      dataIndex: 'description',
      title: '描述',
    },
    {
      key: 'status',
      dataIndex: 'status',
      title: '状态',
      render: (t, r) => {
        return (
          <Switch size="small" checked={t === 1} onChange={this.changeStatus.bind(null, r.id)} />
        );
      },
      width: 128,
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
            <Button
              onClick={this.remove.bind(null, t)}
              size="small"
              shape="circle"
              type="danger"
              icon="delete"
            />
          </div>
        );
      },
      align: 'right',
      width: 128
    },
  ];
  changeStatus = (id, status) => {
    this.props.dispatch({
      type: 'pages/setStatus',
      id,
      status,
    });
  };
  edit = (record) => {
    if (record) {
      jump(`/cms/page/${record.id}`);
    } else {
      jump(`/cms/page`);
    }
  };
  remove = (id) => {
    Modal.confirm({
      title: '删除此页面?',
      onOk: () => {
        this.props.dispatch({
          type: 'pages/remove',
          id
        })
      }
    })
  };
  render() {
    return (
      <div>
        <Button icon="plus" type="primary" onClick={this.edit.bind(null, null)}>
          新建页面
        </Button>
        <Table
          rowKey="id"
          size="small"
          columns={this.columns}
          dataSource={this.props.data}
          locale={{ emptyText: '暂无数据' }}
          pagination={{
            pageSize: this.props.pagination.pageSize,
            total: this.props.pagination.total,
            current: this.props.pagination.page,
            onChange: (page, pageSize) => {
              this.props.dispatch({
                type: 'pages/fetch',
                payload: {page, pageSize}
              })
            }
          }}

        />
      </div>
    );
  }
}

function mapStateToProps({ pages }) {
  return pages;
}

export default connect(mapStateToProps)(CmsHome);
