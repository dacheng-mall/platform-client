import { Fragment, useState } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import _ from 'lodash';
import {
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  DatePicker,
  Divider,
  Popconfirm,
  Icon,
  Select,
  Switch,
} from 'antd';
import { jump } from '../../../utils';
import { TableX, FormItem } from '../../../utils/ui';
import styles from './index.less';

function Task(props) {
  const enableChange = (id, checked) => {
    props.dispatch({
      type: 'task/changeEnable',
      id,
      body: {
        enable: checked,
      },
    });
  };
  const deleteMission = () => {};
  const columns = [
    {
      key: 'name',
      title: '名称',
      dataIndex: 'name',
      align: 'left',
    },
    {
      key: 'from',
      title: '开始时间',
      dataIndex: 'from',
      render: function(t) {
        return moment(t).format('YYYY-MM-DD');
      },
    },
    {
      key: 'to',
      title: '结束时间',
      dataIndex: 'to',
      render: function(t) {
        return moment(t).format('YYYY-MM-DD');
      },
    },
    {
      key: 'institution',
      title: '机构',
      dataIndex: 'institution.name',
    },
    {
      key: 'source',
      title: '数据来源',
      dataIndex: 'source',
      render: function(t, r) {
        switch (t) {
          case 'visited': {
            return '拜访';
          }
          case 'attendance': {
            return '出勤';
          }
          case 'recruiting': {
            return '增员';
          }
          default: {
            return '未知来源';
          }
        }
      },
    },
    {
      key: 'type',
      title: '统计方式',
      dataIndex: 'type',
      render: function(t, r) {
        switch (t) {
          case 'continue': {
            return '连续统计天数';
          }
          case 'total': {
            return '累计统计数据';
          }
          default: {
            return '未知统计方式';
          }
        }
      },
    },
    {
      key: 'enable',
      title: '启用状态',
      dataIndex: 'enable',
      render: function(t, r) {
        return (
          <div>
            <Switch
              checked={t}
              onChange={enableChange.bind(null, r.id)}
              checkedChildren="启"
              unCheckedChildren="停"
            />
          </div>
        );
      },
    },
    {
      key: 'status',
      title: '状态',
      dataIndex: 'status',
      render: (t, r) => {
        switch (t) {
          case 1: {
            return '进行中';
          }
          case 0: {
            return '未启动';
          }
          case 2: {
            return '已结束';
          }
          default: {
            return '未知状态';
          }
        }
      },
    },
    {
      key: 'operator',
      title: '操作',
      dataIndex: 'id',
      align: 'right',
      render: (t, r) => {
        return (
          <div>
            <Button
              shape="circle"
              type="primary"
              icon="edit"
              title="编辑"
              onClick={edit.bind(null, 'edit', t)}
            />
            <Divider type="vertical" />
            <Button
              shape="circle"
              type="danger"
              onClick={exportCsv.bind(null, {
                id: t,
                type: 'result',
                institutionAutoId: r.institution && r.institution.autoId,
              })}
              icon="bar-chart"
              title="导出"
            />
            <Button
              shape="circle"
              type="warning"
              onClick={translate.bind(null, {
                id: t,
              })}
              icon="retweet"
              title="转换"
            />
            <Button
              shape="circle"
              type="danger"
              onClick={exportCsv.bind(null, {
                id: t,
                type: 'order',
                institutionAutoId: r.institution && r.institution.autoId,
              })}
              icon="pie-chart"
              title="导出"
            />
            <Divider type="vertical" />
            <Popconfirm
              title="是否要删除任务"
              onConfirm={deleteMission.bind(null, t)}
              confirmText="删除"
              placement="topRight"
              icon={<Icon type="question-circle-o" style={{ color: 'red' }} />}
              okText="删除"
              cancelText="算了, 我再考虑下"
            >
              <Button shape="circle" type="danger" icon="delete" title="删除" />
            </Popconfirm>
          </div>
        );
      },
    },
  ];
  const edit = (e, id) => {
    if (id) {
      jump(`/mission/task/detail/${id}`);
    } else {
      jump('/mission/task/detail');
    }
  };
  const queryChange = () => {};
  const exportCsv = (payload) => {
    props.dispatch({
      type: 'task/visitedCSV',
      payload,
    });
  };
  const translate = (payload) => {
    props.dispatch({
      type: 'task/translate',
      payload,
    });
  };
  return (
    <div>
      <div className={styles.top}>
        <Button icon="plus" type="primary" onClick={edit.bind(null)}>
          创建任务
        </Button>

        {/* <div className={styles.searcher}>
          <Form layout="inline">
            <Form.Item label="状态">
              <Select
                placeholder="请选择"
                onChange={queryChange.bind(null, 'status')}
                value={props.query.status}
                style={{ width: '100px' }}
                allowClear
              >
                <Select.Option value="free">待领取</Select.Option>
                <Select.Option value="binded">待兑换</Select.Option>
                <Select.Option value="expended">已兑换</Select.Option>
                <Select.Option value="expired">已过期</Select.Option>
                <Select.Option value="removed">已删除</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item label="批号编码">
              <Input
                placeholder="批号编码"
                onChange={queryChange.bind(null, 'code')}
                value={props.query.code}
              />
            </Form.Item>
            <Form.Item label="序号区间">
              <InputNumber
                placeholder="开始"
                min={1}
                onChange={queryChange.bind(null, 'gte')}
                value={props.query.gte}
              />
            </Form.Item>
            <Form.Item>-</Form.Item>
            <Form.Item>
              <InputNumber
                placeholder="结束"
                min={1}
                onChange={queryChange.bind(null, 'lte')}
                value={props.query.lte}
              />
            </Form.Item>
            <Form.Item>
              <Button onClick={fetch} type="primary" className={styles.btn}>
                查询
              </Button>
              <Button onClick={edit.bind(null, 'batch')} type="danger" className={styles.btn}>
                批量操作
              </Button>
              <Button onClick={visibleCSV.bind(null, true)} type="danger" className={styles.btn}>
                导出CSV
              </Button>
            </Form.Item>
          </Form>
        </div> */}
      </div>
      <TableX
        columns={columns}
        dataSource={props.data || []}
        pagination={props.pagination || {}}
        fetchType="task/fetch"
        dispatch={props.dispatch}
      />
    </div>
  );
}

function mapStateToProps({ task }) {
  return task;
}

export default connect(mapStateToProps)(Form.create()(Task));
