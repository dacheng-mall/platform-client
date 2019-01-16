import React, { PureComponent } from 'react';
import { Table, Button, Switch, Divider } from 'antd';
import { connect } from 'dva';
import { jump } from '../../utils';

class CmsHome extends PureComponent {
  columns = [
    {
      key: 'name',
      dataIndex: 'name',
      title: '名称',
    },
    {
      key: 'code',
      dataIndex: 'code',
      title: 'code',
    },
    {
      key: 'elements',
      dataIndex: 'elements',
      title: '元素数',
      render: (t) => t.length,
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
      align: 'center',
    },
    {
      key: 'operator',
      title: '操作',
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
    },
  ];
  changeStatus = () => {};
  edit = (record) => {
    if (record) {
      jump(`/cms/page/${record.id}`);
    } else {
      jump(`/cms/page`);
    }
  };
  remove = () => {};
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
        />
      </div>
    );
  }
}

function mapStateToProps({ pages }) {
  return pages;
}

export default connect(mapStateToProps)(CmsHome);
