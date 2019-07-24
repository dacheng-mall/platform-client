import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import _ from 'lodash';
import { Button, Switch, Modal, Row, Col, Input, Popconfirm, DatePicker, Select } from 'antd';
import { TableX, FormItem } from '../../../utils/ui';
import styles from '../../qr/list/styles.less';
const { RangePicker } = DatePicker;
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
        render: (t, r) => (
          <div>{t}<br />{r.code}</div>
        )
      },
      {
        key: 'createTime',
        title: '注册日期',
        dataIndex: 'createTime',
        render: (t) => moment(t).format('YYYY-MM-DD HH:mm:ss'),
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
      type: 'seller/fetch',
      payload: value,
    });
  };
  reset = () => {
    this.props.dispatch({
      type: 'seller/reset',
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
  changeRange = (value) => {
    this.props.dispatch({
      type: 'seller/upState',
      payload: {
        range: value,
      },
    });
  };
  fetchTimer = null;
  fetchInst = (value) => {
    console.log(value);
    if (!_.trim(value)) {
      return;
    }
    if (this.fetchTimer) {
      clearTimeout(this.fetchTimer);
    }
    this.fetchTimer = setTimeout(() => {
      this.props.dispatch({
        type: 'seller/fetchInst',
        payload: { name: value },
      });
    }, 300);
  };
  instChange = (value) => {
    this.props.dispatch({
      type: 'seller/upState',
      payload: {
        institutionId: value,
      },
    });
  };
  queryChange = (type, e) => {
    e.preventDefault();
    console.log(type, e.target.value)
    this.props.dispatch({
      type: 'seller/upState',
      payload: {[type]: e.target.value}
    })
  }
  render() {
    return (
      <Fragment>
        <div className={styles.buttonWrap}>
          <div></div>
          <div>
            <Button className={styles.moBtn} onClick={this.search} icon="search" type="primary">
              查询
            </Button>
            <Button className={styles.moBtn} onClick={this.reset}>
              重置
            </Button>
          </div>
        </div>
        <div className={styles.tableToolBar}>
          <Row gutter={24} style={{ width: '100%' }}>
            <Col span={8}>
              <FormItem className={styles.formItem} label="姓名">
                <Input style={{ width: '260px' }} placeholder="请输入姓名关键字" onChange={this.queryChange.bind(null, 'name')} />
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem className={styles.formItem} label="工号">
                <Input style={{ width: '260px' }} placeholder="请输入工号" onChange={this.queryChange.bind(null, 'code')} />
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem className={styles.formItem} label="手机号">
                <Input style={{ width: '260px' }} placeholder="请输入手机号" onChange={this.queryChange.bind(null, 'mobile')} />
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem className={styles.formItem} label="注册时间段">
                <RangePicker
                  style={{ width: '260px' }}
                  onChange={this.changeRange}
                  value={this.props.range}
                />
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem className={styles.formItem} label="机构">
                <Select
                  showSearch
                  allowClear
                  placeholder="请选择机构"
                  style={{ width: '260px' }}
                  value={this.props.institutionId}
                  showArrow={false}
                  filterOption={false}
                  onSearch={this.fetchInst}
                  onChange={this.instChange}
                >
                  {_.map(this.props.institutions, (inst, i) => (
                    <Select.Option value={inst.id} key={inst.id}>
                      {inst.name}
                    </Select.Option>
                  ))}
                </Select>
              </FormItem>
            </Col>
          </Row>
        </div>

        <TableX
          columns={this.columns()}
          dataSource={this.props.data || []}
          pagination={this.props.pagination}
          fetchType="seller/fetch"
          dispatch={this.props.dispatch}
        />
      </Fragment>
    );
  }
}
function mapStateToProps({ seller }) {
  return seller;
}
export default connect(mapStateToProps)(Seller);
