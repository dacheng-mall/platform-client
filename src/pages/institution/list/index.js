import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import _ from 'lodash';
import { Table, Button, Switch, Modal, Icon, Input, Divider } from 'antd';
import Editor from './editor';
import styles from './styles.less';

class Institution extends PureComponent {
  state = {
    show: false,
    shwoPassword: false,
  };
  columns = [
    {
      key: 'name',
      title: '机构名称',
      dataIndex: 'name',
    },
    {
      key: 'master',
      title: '联系人',
      dataIndex: 'master',
    },
    {
      key: 'masterPhone',
      title: '联系电话',
      dataIndex: 'masterPhone',
    },
    {
      key: 'address',
      title: '地址',
      render: (t, { address, regionName }) => {
        return (
          <div>
            {regionName}
            <br />
            {address}
          </div>
        );
      },
    },
    {
      key: 'parent',
      title: '上级机构',
      dataIndex: 'pInstitution',
      render: (t) => {
        if (t.id) {
          return <div>{t.name}</div>;
        }
        return '无';
      },
    },
    {
      key: 'status',
      title: '状态',
      dataIndex: 'status',
      render: (t, { id, username }) => {
        const change = (checked) => {
          this.props.dispatch({
            type: 'institution/changeStatus',
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
              onClick={this.update.bind(null, r)}
              size="small"
              shape="circle"
              type="primary"
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
  update = (r) => {
    const {
      id,
      name,
      description,
      regionId,
      regionName,
      address,
      master,
      masterPhone,
      status,
      pInstitution: { id: pid, name: pName },
    } = r;

    this.showModal({
      id,
      name,
      description,
      regionId: (regionId && regionId.split(',')) || [],
      regionName,
      address,
      master,
      masterPhone,
      status,
      pid,
    });
    this.props.dispatch({
      type: 'institution/upState',
      payload: {
        parents: [
          {
            id: pid,
            name: pName,
          },
        ],
      },
    });
  };
  remove = (id, data, e) => {
    e.preventDefault();
    Modal.confirm({
      title: '是否删除机构?',
      onOk: () => {
        this.props.dispatch({
          type: 'institution/remove',
          id,
        });
      },
    });
  };
  showModal = (data) => {
    this.props.dispatch({
      type: 'institution/upState',
      payload: {
        editor: data,
      },
    });
  };
  search = (value) => {
    this.props.dispatch({
      type: 'institution/searchByKeywords',
      payload: value,
    });
  };
  reset = () => {
    this.props.dispatch({
      type: 'institution/searchByKeywords',
      payload: '',
    });
  };
  change = (e) => {
    this.props.dispatch({
      type: 'institution/upState',
      payload: {
        keywords: _.trim(e.target.value),
      },
    });
  };
  render() {
    return (
      <Fragment>
        <div className={styles.tableToolBar}>
          <Button onClick={this.showModal.bind(null, {})} type="primary">
            <Icon type="plus" />
            添加机构
          </Button>
          <div className={styles.tableToolBar}>
            <Input.Search
              style={{ width: 320 }}
              onSearch={this.search}
              placeholder="请输入机构名称关键字查询"
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
                type: 'institution/fetch',
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
function mapStateToProps({ institution }) {
  return institution;
}
export default connect(mapStateToProps)(Institution);
