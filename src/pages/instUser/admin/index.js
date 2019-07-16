import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Button, Input } from 'antd';
import styles from './styles.less';
import { TableX } from '../../../utils/ui';

class InstAdmin extends PureComponent {
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
      // {
      //   key: 'roles',
      //   title: '角色',
      //   dataIndex: 'roles',
      // },
      // {
      //   key: 'status',
      //   title: '状态',
      //   dataIndex: 'status',
      //   render: (t, { id, username }) => {
      //     const change = (checked) => {
      //       this.props.dispatch({
      //         type: 'admin/changeStatus',
      //         payload: { id, username, status: checked ? 1 : 0 },
      //       });
      //     };
      //     return <Switch size="small" checked={t === 1} onChange={change} />;
      //   },
      //   align: 'center',
      // },
      // {
      //   // key: 'operator',
      //   // title: '操作',
      //   // dataIndex: 'id',
      //   // render: (t, r) => {
      //   //   return (
      //   //     <Button
      //   //       onClick={this.resetPW.bind(null, r)}
      //   //       size="small"
      //   //       shape="circle"
      //   //       type="ghost"
      //   //       icon="sync"
      //   //     />
      //   //   );
      //   // },
      //   align: 'right',
      // },
    ];
  };
  switchType = () => {
    this.setState({
      shwoPassword: !this.state.shwoPassword,
    });
  };
  render() {
    return (
      <div>
        <div className={styles.tableToolBar}>
          <Input.Search
            style={{ width: 200 }}
            onSearch={this.search}
            placeholder="请输入职级名称关键字查询"
            onChange={this.change}
            value={this.props.keywords}
          />
          <Button onClick={this.reset}>重置</Button>
        </div>
        <TableX
          columns={this.columns()}
          dataSource={this.props.data || []}
          pagination={this.props.pagination}
          fetchType="admin/fetch"
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
                type: 'admin/fetch',
                payload: { page, pageSize, userType: 1 },
              });
            },
          }}
        /> */}
      </div>
    );
  }
}
function mapStateToProps({ instAdminForinst }) {
  return instAdminForinst;
}
export default connect(mapStateToProps)(InstAdmin);
