import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Button, Switch, Modal } from 'antd';
import { TableX } from '../../../utils/ui';

class Customer extends PureComponent {
  state = {
    show: false,
    shwoPassword: false,
  };
  columns = () => {
    return [
      {
        key: 'avatar',
        title: '头像',
        dataIndex: 'avatar',
        render: (t) => {
          if (t) {
            return <img style={{ width: '48px' }} src={t} />;
          }
          return <div className="nonAvatar" />;
        },
      },
      {
        key: 'name',
        title: '姓名',
        dataIndex: 'name',
      },
      {
        key: 'createTime',
        title: '注册日期',
        dataIndex: 'createTime',
        render: (t) => moment(t).format('YYYY-MM-DD HH:mm:ss'),
      },
      {
        key: 'status',
        title: '状态',
        dataIndex: 'status',
        render: (t, { id, username }) => {
          const change = (checked) => {
            this.props.dispatch({
              type: 'customer/changeStatus',
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
                onClick={this.remove.bind(null, t, r)}
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
  };
  remove = (id, data, e) => {
    e.preventDefault();
    Modal.confirm({
      title: '是否删除客户?',
      onOk: () => {
        this.props.dispatch({
          type: 'customer/remove',
          id,
        });
      },
    });
  };
  render() {
    return (
      <div>
        <TableX
          columns={this.columns()}
          dataSource={this.props.data || []}
          pagination={this.props.pagination}
          fetchType="customer/fetch"
          dispatch={this.props.dispatch}
        />

        {/* <Table
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
                type: 'customer/fetch',
                payload: { page, pageSize, userType: 2 },
              });
            },
          }}
        /> */}
      </div>
    );
  }
}
function mapStateToProps({ customer }) {
  return customer;
}
export default connect(mapStateToProps)(Customer);
