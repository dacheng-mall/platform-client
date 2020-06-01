import React, { PureComponent } from 'react';
import { connect } from 'dva';
import _ from 'lodash';
import { Button, Switch, Modal, Icon, Input, Divider } from 'antd';
import Editor from './editor';
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
        key: 'username',
        title: '用户名',
        dataIndex: 'username',
      },
      {
        key: 'name',
        title: '姓名',
        dataIndex: 'name',
      },
      {
        key: 'mobile',
        title: '联系电话',
        dataIndex: 'mobile',
      },
      {
        key: 'institution',
        title: '所属机构',
        dataIndex: 'institution',
        render: (t) => t.name,
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
                onClick={this.resetPW.bind(null, r)}
                size="small"
                shape="circle"
                type="ghost"
                icon="sync"
              />
              <Divider type="vertical" />
              <Button
                onClick={this.edit.bind(null, r)}
                size="small"
                shape="circle"
                type="ghost"
                icon="edit"
              />
              <Divider type="vertical" />
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
  resetPW = ({ id, username }, e) => {
    e.preventDefault();
    Modal.confirm({
      title: '是否重置该用户密码?',
      content: '密码将被重置为“111111”',
      onOk: () => {
        this.props.dispatch({
          type: 'instAdmin/resetPW',
          payload: { id, username },
        });
      },
    });
  };
  remove = (id, data, e) => {
    e.preventDefault();
    Modal.confirm({
      title: '是否删除机构管理员?',
      onOk: () => {
        this.props.dispatch({
          type: 'instAdmin/remove',
          id,
        });
      },
    });
  };
  initInst = (id) => {
    this.props.dispatch({
      type: 'instAdmin/searchInst',
      payload: { id },
    });
  };
  edit = (data, e) => {
    e.preventDefault();
    this.showModal(data);
    this.props.dispatch({
      type: 'instAdmin/upState',
      payload: {
        inst: [
          {
            id: data.institution.id,
            name: data.institution.name,
          },
        ],
      },
    });
  };
  showModal = (data) => {
    this.props.dispatch({
      type: 'instAdmin/upState',
      payload: {
        editor: data,
      },
    });
  };
  search = (value) => {
    this.props.dispatch({
      type: 'instAdmin/searchByKeywords',
      payload: value,
    });
  };
  reset = () => {
    this.props.dispatch({
      type: 'instAdmin/searchByKeywords',
      payload: '',
    });
  };
  change = (e) => {
    this.props.dispatch({
      type: 'instAdmin/upState',
      payload: {
        keywords: _.trim(e.target.value),
      },
    });
  };
  render() {
    return (
      <div>
        <div className={styles.tableToolBar}>
          <Button onClick={this.showModal.bind(null, {})} type="primary">
            <Icon type="plus" />
            添加机构管理员
          </Button>
          <div className={styles.tableToolBar}>
            <Input.Search
              style={{ width: 320 }}
              onSearch={this.search}
              placeholder="请输入关键字查询"
              onChange={this.change}
              value={this.props.keywords}
            />
            <Button onClick={this.reset}>重置</Button>
          </div>
        </div>
        <TableX
          columns={this.columns()}
          dataSource={this.props.data || []}
          pagination={this.props.pagination}
          fetchType="instAdmin/fetch"
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
                type: 'instAdmin/fetch',
                payload: { page, pageSize, userType: 3 },
              });
            },
          }}
        /> */}
        <Editor editor={this.props.editor} />
      </div>
    );
  }
}
function mapStateToProps({ instAdmin }) {
  return instAdmin;
}
export default connect(mapStateToProps)(InstAdmin);
