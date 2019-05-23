import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import _ from 'lodash';
import { Table, Button, Switch, Select, Modal, Input, Form } from 'antd';
import styles from './styles.less';
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
        render: (t, r) => {
          return (
            <div>
              <div>{t}</div>
              <div>{r.mobile}</div>
            </div>
          );
        },
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
        key: 'code',
        title: '工号',
        dataIndex: 'code',
      },
      {
        key: 'idcard',
        title: '身份证号',
        dataIndex: 'idCard',
      },
      {
        key: 'status',
        title: '状态',
        dataIndex: 'status',
        render: (t, { id, username }) => {
          const change = (checked) => {
            this.props.dispatch({
              type: 'instSeller/changeStatus',
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
      title: '是否删除业务员?',
      onOk: () => {
        this.props.dispatch({
          type: 'instSeller/remove',
          id,
        });
      },
    });
  };
  search = (value) => {
    if (_.trim(value)) {
      this.props.dispatch({
        type: 'instSeller/searchInst',
        payload: value,
      });
    }
  };
  reset = () => {
    this.props.dispatch({
      type: 'instSeller/reset',
    });
  };
  reFetch = () => {
    this.props.dispatch({
      type: 'instSeller/fetch',
      payload: {},
    });
  };
  change = (e) => {
    this.props.dispatch({
      type: 'instSeller/upState',
      payload: {
        keywords: _.trim(e.target.value),
      },
    });
  };
  changeInst = (institutionId) => {
    this.props.dispatch({
      type: 'instSeller/upState',
      payload: {
        institutionId,
      },
    });
  };
  changeGrade = (gradeId) => {
    this.props.dispatch({
      type: 'instSeller/upState',
      payload: {
        gradeId,
      },
    });
  };
  exportCSV = () => {
    this.props.dispatch({
      type: 'instSeller/exportCSV',
    });
  };
  render() {
    return (
      <Fragment>
        <div className={styles.tableToolBar}>
          <Select
            value={this.props.gradeId}
            placeholder="请选择职级"
            style={{ width: 180, marginRight: '10px' }}
            onChange={this.changeGrade}
            notFoundContent={null}
          >
            {_.map(this.props.grades, (grade) => {
              return (
                <Select.Option key={grade.id} value={grade.id}>
                  {grade.name}
                </Select.Option>
              );
            })}
          </Select>
          <Select
            showSearch
            value={this.props.institutionId}
            placeholder="请输入机构名称关键字查询"
            style={{ width: 240, marginRight: '10px' }}
            defaultActiveFirstOption={false}
            filterOption={false}
            onSearch={this.search}
            onChange={this.changeInst}
            notFoundContent={null}
          >
            {_.map(this.props.inst, (inst) => {
              return (
                <Select.Option key={inst.id} value={inst.id}>
                  {inst.name}
                </Select.Option>
              );
            })}
          </Select>
          <Input
            style={{ width: 240, marginRight: '10px' }}
            placeholder="请输入业务员姓名关键字查询"
            onChange={this.change}
            value={this.props.keywords}
          />
          <Button onClick={this.reFetch} type="primary" style={{ marginRight: '10px' }}>
            查询
          </Button>
          <Button
            onClick={this.exportCSV}
            icon="save"
            type="danger"
            style={{ marginRight: '10px' }}
          >
            导出数据
          </Button>
          <Button onClick={this.reset}>重置</Button>
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
                type: 'instSeller/fetch',
                payload: { page, pageSize, userType: 2 },
              });
            },
          }}
        />
      </Fragment>
    );
  }
}
function mapStateToProps({ instSeller }) {
  return instSeller;
}
export default connect(mapStateToProps)(Form.create()(Seller));
