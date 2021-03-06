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
  const deleteMission = (id) => {
    props.dispatch({
      type: 'task/remove',
      id,
    });
  };
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
        let source = '';
        switch (t) {
          case 'visited': {
            source = '拜访';
            break;
          }
          case 'attendance': {
            source = '出勤';
            break;
          }
          case 'recruiting': {
            source = '增员';
            break;
          }
          default: {
            source = '未知来源';
            break;
          }
        }
        let type = '';
        if (r.type) {
          for (const category of r.type) {
            switch (category) {
              case 'badge': {
                type += '见面, ';
                break;
              }
              case 'online': {
                type += '云访, ';
                break;
              }
              case 'gift': {
                type += '送达, ';
                break;
              }
              case 'meeting': {
                type += '集会, ';
                break;
              }
              default: {
                type = `${category}, `;
                break;
              }
            }
          }
        }
        return `${source}-${type}`.replace(/\,\s$/, '');
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
      title: '报表',
      dataIndex: 'id',
      render: (t) => {
        return (
          <div>
            {/* <Button type="danger" size="small" title="编辑" onClick={csv.bind(null, 'person', t)}>
              个人统计
            </Button>
            <Divider type="vertical" /> */}
            <Button type="danger" size="small" title="明细" onClick={csv.bind(null, 'logs', t)}>
              明细
            </Button>
            <Divider type="vertical" />
            <Button type="danger" size="small" title="订单" onClick={csv.bind(null, 'orders', t)}>
              订单
            </Button>
          </div>
        );
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
            {/* <Divider type="vertical" />
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
            /> */}
            {/* <Button
              shape="circle"
              type="warning"
              onClick={translate.bind(null, {
                id: t,
              })}
              icon="retweet"
              title="转换"
            /> */}
            {/* <Button
              shape="circle"
              type="danger"
              onClick={exportCsv.bind(null, {
                id: t,
                type: 'order',
                institutionAutoId: r.institution && r.institution.autoId,
              })}
              icon="pie-chart"
              title="导出"
            /> */}
            {props.userType === 3 ? null : <Divider type="vertical" />}
            {props.userType === 3 ? null : (
              <Popconfirm
                title="是否要删除任务"
                onConfirm={deleteMission.bind(null, t)}
                confirmText="删除"
                placement="topRight"
                icon={<Icon type="question-circle-o" style={{ color: 'red' }} />}
                okText="删除"
                cancelText="算了, 我再考虑下"
              >
                <Button
                  shape="circle"
                  type="danger"
                  icon="delete"
                  title="删除"
                  disabled={props.userType === 3}
                />
              </Popconfirm>
            )}
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
  const csv = (type, id) => {
    console.log(type, id);
    props.dispatch({
      type: 'task/csv',
      payload: { type, id },
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
