import { Fragment, useState } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import _ from 'lodash';
import {
  Button,
  Row,
  Col,
  Input,
  DatePicker,
  Select,
} from 'antd';
import { TableX, FormItem } from '../../../utils/ui';
import styles from './index.less';

const { RangePicker } = DatePicker;

function Attendance(props) {
  const columns = [
    {
      key: 'level0.shortName',
      title: '总公司',
      dataIndex: 'level0.shortName',
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
      key: 'userCode',
      title: '打卡人工号',
      dataIndex: 'user.code',
      align: 'center',
    },
    {
      key: 'userName',
      title: '打卡人',
      dataIndex: 'user.name',
      align: 'center',
    },
    {
      key: 'masterCode',
      title: '内勤工号',
      dataIndex: 'master.code',
      align: 'center',
    },
    {
      key: 'masterName',
      title: '内勤',
      dataIndex: 'master.name',
      align: 'center',
    },
    {
      key: 'createTime',
      title: '打卡时间',
      dataIndex: 'createTime',
      render: function(t) {
        return moment(t).format('YYYY-MM-DD HH:mm:ss');
      },
    },
    {
      key: 'type',
      title: '扫码类型',
      dataIndex: 'type',
      render: function(t, r) {
        switch (t) {
          case 'wx': {
            return '内勤码';
          }
          case 'badge': {
            return '工牌码';
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
        value = { institution: e };
        break;
      }
      case 'userCode': 
      case 'userName': 
      case 'masterCode': {
        value = { [type]: e.target.value };
        break;
      }
      case 'type':
      case 'range': {
        value = { [type]: e };
        break;
      }
    }
    props.dispatch({
      type: 'hello/upState',
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
        type: 'hello/searchInst',
        name,
      });
    }, 500);
  };
  // 签到数据报表
  const getCsvDetail = () => {
    props.dispatch({
      type: 'hello/getCsvDetail',
    });
  };
  const search = () => {
    props.dispatch({
      type: 'hello/fetch',
    });
  };
  return (
    <div>
      <div className={styles.buttonWrap}>
        <div className={styles.title}>拜访数据筛选器</div>
        <div>
          <Button className={styles.moBtn} onClick={getCsvDetail} icon="download" type="danger">
            打卡详细数据报表
          </Button>
          <Button className={styles.moBtn} onClick={search} icon="download" type="primary">
            查询
          </Button>
        </div>
      </div>
      <div className={styles.tableToolBar}>
        <Row>
          <Col span={8}>
            <FormItem className={styles.formItem} label="机构">
              <Select
                showSearch
                value={props.query && props.query.institution}
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
          <Col span={8}>
            <FormItem className={styles.formItem} label="时间段">
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
                value={props.query && props.query.range}
              />
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem className={styles.formItem} label="扫码类型">
              <Select
                style={{ width: 240 }}
                onChange={queryChange.bind(null, 'type')}
                placeholder="请选择扫码类型"
                value={props.query && props.query.type}
              >
                <Select.Option value="all">全部</Select.Option>
                <Select.Option value="wx">内勤码</Select.Option>
                <Select.Option value="badge">工牌码</Select.Option>
              </Select>
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem className={styles.formItem} label="打卡人工号">
              <Input
                value={props.query && props.query.userCode}
                style={{ width: 240 }}
                placeholder="请输入完整工号"
                onChange={queryChange.bind(null, 'userCode')}
              />
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem className={styles.formItem} label="打卡人姓名">
              <Input
                value={props.query && props.query.userName}
                style={{ width: 240 }}
                placeholder="请输入完整姓名"
                onChange={queryChange.bind(null, 'userName')}
              />
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem className={styles.formItem} label="内勤人工号">
              <Input
                value={props.query && props.query.masterCode}
                style={{ width: 240 }}
                placeholder="请输入完整工号"
                onChange={queryChange.bind(null, 'masterCode')}
              />
            </FormItem>
          </Col>
        </Row>
      </div>

      <TableX
        columns={columns}
        dataSource={props.data || []}
        pagination={props.pagination || {}}
        fetchType="hello/fetch"
        dispatch={props.dispatch}
      />
    </div>
  );
}

function mapStateToProps(status) {
  return status.hello;
}

export default connect(mapStateToProps)(Attendance);
