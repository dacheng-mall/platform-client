import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import _ from 'lodash';
import { Table, Button, Select, Modal, Input, Form } from 'antd';
import styles from './styles.less';

class Team extends PureComponent {
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
        title: '所属机构',
        render: (t, r) => {
          if (r.institution) {
            return r.institution.name;
          }
          return '未知机构';
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
    ];
  };
  search = (value) => {
    if (_.trim(value)) {
      this.props.dispatch({
        type: 'activityTeam/searchInst',
        payload: value,
      });
    }
  };
  reset = () => {
    this.props.dispatch({
      type: 'activityTeam/reset',
    });
  };
  reFetch = () => {
    this.props.dispatch({
      type: 'activityTeam/fetch',
      payload: {},
    });
  };
  change = (e) => {
    this.props.dispatch({
      type: 'activityTeam/upState',
      payload: {
        keywords: _.trim(e.target.value),
      },
    });
  };
  changeInst = (institutionId) => {
    this.props.dispatch({
      type: 'activityTeam/upState',
      payload: {
        institutionId,
      },
    });
  };
  changeGrade = (gradeId) => {
    this.props.dispatch({
      type: 'activityTeam/upState',
      payload: {
        gradeId,
      },
    });
  };
  render() {
    return (
      <Fragment>
        <div className={styles.tableToolBar}>
          <div className={styles.title}>报名人员列表</div>
          <div className={styles.filter}>
            <Select
              value={this.props.gradeId}
              placeholder="请选择职级"
              formTitle    style={{ width: 180, marginRight: '10px' }}
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
                type: 'activityTeam/fetch',
                payload: { page, pageSize },
              });
            },
          }}
        />
      </Fragment>
    );
  }
}
function mapStateToProps({ activityTeam }) {
  return activityTeam;
}
export default connect(mapStateToProps)(Form.create()(Team));
