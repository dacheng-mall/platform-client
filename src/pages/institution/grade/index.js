import React, { PureComponent } from 'react';
import { connect } from 'dva';
import _ from 'lodash';
import { Table, Button, Switch, Modal, Icon, Input, Divider } from 'antd';
import Editor from './editor';
import styles from './styles.less';

class Grade extends PureComponent {
  state = {
    show: false,
    shwoPassword: false,
  };
  columns = () => {
    return [
      {
        key: 'name',
        title: '职级名称',
        dataIndex: 'name',
      },
      {
        key: 'institution',
        title: '所属机构',
        dataIndex: 'institutionName',
      },
      {
        key: 'code',
        title: '职级编码',
        dataIndex: 'code',
      },
      {
        key: 'description',
        title: '描述',
        dataIndex: 'description',
      },
      {
        key: 'status',
        title: '状态',
        dataIndex: 'status',
        render: (t, { id, username }) => {
          const change = (checked) => {
            this.props.dispatch({
              type: 'grade/changeStatus',
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
  };
  update = (r) => {
    const { id, name, description, code, displayOrder, status, institutionId } = r;

    this.showModal({
      id,
      name,
      description,
      code,
      displayOrder,
      status,
      institutionId,
    });
    this.props.dispatch({
      type: 'grade/searchInst',
      payload: {
        id: institutionId
      },
    });
  };
  remove = (id, data, e) => {
    e.preventDefault();
    Modal.confirm({
      title: '是否删除机构?',
      onOk: () => {
        this.props.dispatch({
          type: 'grade/remove',
          id,
        });
      },
    });
  };
  showModal = (data) => {
    this.props.dispatch({
      type: 'grade/upState',
      payload: {
        editor: data,
      },
    });
  };
  search = (value) => {
    this.props.dispatch({
      type: 'grade/searchByKeywords',
      payload: { name: value },
    });
  };
  reset = () => {
    this.props.dispatch({
      type: 'grade/searchByKeywords',
      payload: '',
    });
  };
  change = (e) => {
    this.props.dispatch({
      type: 'grade/upState',
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
            添加职级
          </Button>
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
        </div>
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
                type: 'grade/fetch',
                payload: { page, pageSize },
              });
            },
          }}
        />
        <Editor editor={this.props.editor} />
      </div>
    );
  }
}
function mapStateToProps({ grade }) {
  return grade;
}
export default connect(mapStateToProps)(Grade);
