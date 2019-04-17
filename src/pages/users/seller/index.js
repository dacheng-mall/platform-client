import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import _ from 'lodash';
import { Table, Button, Switch, Modal } from 'antd';
class Seller extends PureComponent {
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
        render: (t, r) => {
          return <img style={{ width: '48px' }} src={t} alt={r.name} />;
        },
      },
      {
        key: 'name',
        title: '姓名',
        dataIndex: 'name',
      },
      {
        key: 'institution',
        title: '机构',
        dataIndex: 'institution',
        render(t) {
          return <div>{t.name}</div>;
        },
      },
      {
        key: 'grade',
        title: '职级',
        dataIndex: 'gradeName',
      },
      {
        key: 'mobile',
        title: '手机号',
        dataIndex: 'mobile',
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
      title: '是否删除用户?',
      onOk: () => {
        this.props.dispatch({
          type: 'seller/remove',
          id,
        });
      },
    });
  };
  search = (value) => {
    this.props.dispatch({
      type: 'seller/searchByKeywords',
      payload: value,
    });
  };
  reset = () => {
    this.props.dispatch({
      type: 'seller/searchByKeywords',
      payload: '',
    });
  };
  change = (e) => {
    this.props.dispatch({
      type: 'seller/upState',
      payload: {
        keywords: _.trim(e.target.value),
      },
    });
  };
  render() {
    return (
      <Fragment>
        {/* <div>
          <Input.Search
            style={{ width: 320 }}
            onSearch={this.search}
            placeholder="请输入机构名称关键字查询"
            onChange={this.change}
            value={this.props.keywords}
          />
          <Button onClick={this.reset}>重置</Button>
        </div> */}
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
                type: 'seller/fetch',
                payload: { page, pageSize, userType: 2 },
              });
            },
          }}
        />
      </Fragment>
    );
  }
}
function mapStateToProps({ seller }) {
  return seller;
}
export default connect(mapStateToProps)(Seller);
