import { Fragment, useState } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import _ from 'lodash';
import {
  Button,
  Row,
  Col,
  DatePicker,
  Select,
  Cascader,
  Form,
  Input,
  InputNumber,
  Divider,
  Popconfirm,
  Icon,
  Switch,
} from 'antd';
import { TableX, FormItem } from '../../../utils/ui';
import styles from './index.less';

const { RangePicker } = DatePicker;

function Visited(props) {
  const columns = [
    {
      key: 'level0.shortName',
      title: '总公司',
      dataIndex: 'level0.shortName',
      render: (t, r) => {
        return `${r.level0 && r.level0.rootName}`
      },
      align: 'left',
    },
    {
      key: 'level1.shortName',
      title: '分公司',
      dataIndex: 'level1.shortName',
      align: 'left',
    },
    {
      key: 'level2.shortName',
      title: '中支',
      dataIndex: 'level2.shortName',
      align: 'left',
    },
    {
      key: 'level3.shortName',
      title: '营业区',
      dataIndex: 'level3.shortName',
      align: 'left',
    },
    {
      key: 'salesmanName',
      title: '营销员',
      dataIndex: 'salesmanName',
      align: 'center',
    },
    {
      key: 'salesmanCode',
      title: '工号',
      dataIndex: 'salesmanCode',
      align: 'center',
    },
    {
      key: 'gradeName',
      title: '职级',
      dataIndex: 'gradeName',
      align: 'center',
    },
    {
      key: 'salesmanMobile',
      title: '营销员手机号',
      dataIndex: 'salesmanMobile',
      align: 'center',
    },
    {
      key: 'salesmanIdCard',
      title: '营销员身份证',
      dataIndex: 'salesmanIdCard',
      align: 'center',
    },
    {
      key: 'isNewCustomer',
      title: '新客',
      dataIndex: 'isNewCustomer',
      render: function(t) {
        return t ? '新' : '--';
      },
      align: 'center',
    },
    {
      key: 'customerName',
      title: '客户',
      dataIndex: 'name',
      render: (t,r) => t || r.customerName,
      align: 'center',
    },
    {
      key: 'mobile',
      title: '客户电话',
      dataIndex: 'mobile',
      align: 'center',
    },
    {
      key: 'createTime',
      title: '拜访时间',
      dataIndex: 'createTime',
      render: function(t) {
        return moment(t).format('YYYY-MM-DD HH:mm:ss');
      },
    },
    {
      key: 'category',
      title: '拜访类型',
      dataIndex: 'category',
      render: function(t, r) {
        switch (t) {
          case 'badge': {
            return '见面';
          }
          case 'online': {
            return '云拜访';
          }
          case 'active': {
            return '活动';
          }
          case 'gift': {
            return '送达';
          }
          default: {
            return '未知类型';
          }
        }
      },
    },
  ];
  const queryChange = (type, e) => {
    let value;
    switch (type) {
      case 'institution': {
        console.log(e);
        value = { institution: e };
        break;
      }
      case 'range':
      case 'isNewCustomer':
      case 'category': {
        console.log(type, e);
        value = { [type]: e };
        break;
      }
    }
    props.dispatch({
      type: 'visited/upState',
      payload: {
        query: {
          ...props.query,
          ...value,
        },
      },
    });
  };
  let timer = null;
  const searchInst = (name) => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      props.dispatch({
        type: 'visited/searchInst',
        name,
      });
    }, 500);
  };
  // 拜访数据报表
  const getCsvDetail = () => {
    props.dispatch({
      type: 'visited/getCsvDetail',
    });
  };
  // 活动人力报表
  // const addPids = () => {
  //   props.dispatch({
  //     type: 'visited/addPids',
  //   });
  // };
  // const exportCsv = (type) => {
  //   props.dispatch({
  //     type: 'visited/visitedCSV',
  //     payload: { type },
  //   });
  // };
  const search = () => {
    props.dispatch({
      type: 'visited/fetch',
    });
  };
  return (
    <div>
      <div className={styles.buttonWrap}>
        <div className={styles.title}>拜访数据筛选器</div>
        <div>
          <Button className={styles.moBtn} onClick={getCsvDetail} icon="download" type="danger">
            拜访详细数据报表
          </Button>
          <Button className={styles.moBtn} onClick={search} icon="download" type="primary">
            查询
          </Button>
        </div>
      </div>
      <div className={styles.tableToolBar}>
        <Row>
          <Col span={12}>
            <FormItem className={styles.formItem} label="机构">
              <Select
                showSearch
                value={props.query.institution}
                placeholder="输入名称关键字查询机构"
                style={{ width: 240 }}
                defaultActiveFirstOption={false}
                showArrow={false}
                filterOption={false}
                labelInValue
                allowClear={props.userType !== 3}
                onSearch={searchInst}
                onChange={queryChange.bind(null, 'institution')}
                notFoundContent="暂无选项"
              >
                {_.map(props.inst, (inst) => {
                  return <Select.Option key={inst.key}>{inst.label}</Select.Option>;
                })}
              </Select>
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem className={styles.formItem} label="时间段" >
              <RangePicker
                style={{ width: 240 }}
                ranges={{
                  '昨日': [moment().subtract(1, 'day').startOf('day'), moment().subtract(1, 'day').endOf('day')],
                  '今日': [moment(), moment()],
                  '上周': [moment().subtract(1, 'week').startOf('week'), moment().subtract(1, 'week').endOf('week')],
                  '本周': [moment().startOf('week'), moment().endOf('week')],
                  '上月': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
                  '本月': [moment().startOf('month'), moment().endOf('month')],
                  '上季度': [moment().subtract(1, 'quarter').startOf('quarter'), moment().subtract(1, 'quarter').endOf('quarter')],
                  '本季度': [moment().startOf('quarter'), moment().endOf('quarter')],
                }}
                format="YYYY-MM-DD"
                onChange={queryChange.bind(null, 'range')}
                value={props.query.range}
              />
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem className={styles.formItem} label="访客类型">
              <Select
                style={{ width: 240 }}
                onChange={queryChange.bind(null, 'isNewCustomer')}
                placeholder="请选择访客类型"
                value={props.query.isNewCustomer}
              >
                <Select.Option value="all">不限</Select.Option>
                <Select.Option value="new">新客拜访</Select.Option>
                <Select.Option value="old">老客拜访</Select.Option>
              </Select>
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem className={styles.formItem} label="拜访类型">
              <Select
                style={{ width: 240 }}
                onChange={queryChange.bind(null, 'category')}
                placeholder="请选择拜访类型"
                value={props.query.category}
              >
                <Select.Option value="all">全部</Select.Option>
                <Select.Option value="online">云拜访</Select.Option>
                <Select.Option value="badge">见面</Select.Option>
                <Select.Option value="active">活动</Select.Option>
                <Select.Option value="gift">送达</Select.Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
      </div>

      <TableX
        columns={columns}
        dataSource={props.data || []}
        pagination={props.pagination || {}}
        fetchType="visited/fetch"
        dispatch={props.dispatch}
      />
    </div>
  );
}

function mapStateToProps({ visited }) {
  return visited;
}

export default connect(mapStateToProps)(Visited);
