import { Fragment, useState } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import _ from 'lodash';
import {
  Button,
  Row,
  Col,
  Cascader,
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

const { RangePicker } = DatePicker;

function Visited(props) {
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
      render: (t) => {
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
      jump(`/gathering/active/detail/${id}`);
    } else {
      jump('/gathering/active/detail');
    }
  };
  const queryChange = (type, e) => {
    let value;
    switch (type) {
      case 'institution': {
        console.log(e);
        value = { institution: e };
        break;
      }
      case 'range':
      case 'type':
      case 'method': {
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
  const getcsvdata = (isActive) => {
    console.log('isActive', isActive)
    props.dispatch({
      type: 'visited/getcsvdata',
      isActive
    });
  };
  // 活动人力报表
  const addPids = () => {
    props.dispatch({
      type: 'visited/addPids',
    });
  };
  const exportCsv = (type) => {
    props.dispatch({
      type: 'visited/visitedCSV',
      payload: { type },
    });
  };
  return (
    <div>
      <div className={styles.top}>
        <Button icon="download" type="primary" onClick={exportCsv.bind(null, null)}>
          导出全部数据
        </Button>
        <Button icon="download" type="primary" onClick={exportCsv.bind(null, 'today')}>
          导出今日数据
        </Button>
        <Button icon="download" type="primary" onClick={exportCsv.bind(null, 'yesterday')}>
          导出昨日数据
        </Button>
        <Button icon="download" type="primary" onClick={exportCsv.bind(null, 'all')}>
          累计活动人力
        </Button>
        <Button icon="download" type="primary" onClick={addPids}>
          客户信息补全pids
        </Button>
      </div>
      <div className={styles.buttonWrap}>
        <div className={styles.title}>拜访数据筛选器</div>
        <div>
          <Button
            className={styles.moBtn}
            onClick={getcsvdata.bind(null, true)}
            icon="download"
            type="danger"
          >
            活动人力报表
          </Button>
          <Button className={styles.moBtn} onClick={getcsvdata.bind(null, false)} icon="download" type="danger">
            拜访数据报表
          </Button>
        </div>
      </div>
      <div className={styles.tableToolBar}>
        <Row>
          <Col span={12}>
            <FormItem className={styles.formItem} label="机构" required={true}>
              <Select
                showSearch
                value={props.query.institution}
                placeholder="输入名称关键字查询机构"
                style={{ width: 320 }}
                defaultActiveFirstOption={false}
                showArrow={false}
                filterOption={false}
                labelInValue
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
            <FormItem className={styles.formItem} label="时间段" required={true}>
              <RangePicker
                style={{ width: 320 }}
                onChange={queryChange.bind(null, 'range')}
                value={props.query.range}
              />
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem className={styles.formItem} label="访客类型" help="活动人力报表忽略该参数">
              <Select
                style={{ width: 320 }}
                onChange={queryChange.bind(null, 'type')}
                placeholder="请选择访客类型"
                value={props.query.type}
              >
                <Select.Option value="all">不限</Select.Option>
                <Select.Option value="new">新客拜访</Select.Option>
                <Select.Option value="old">老客拜访</Select.Option>
              </Select>
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem className={styles.formItem} label="拜访类型" help="暂不启用">
              <Select
                style={{ width: 320 }}
                disabled
                onChange={queryChange.bind(null, 'method')}
                placeholder="请选择拜访类型"
                value={props.query.method}
              >
                <Select.Option value="all">不限</Select.Option>
                <Select.Option value="online">新客拜访</Select.Option>
                <Select.Option value="offline">老客拜访</Select.Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
      </div>
    </div>
  );
}

function mapStateToProps({ visited }) {
  return visited;
}

export default connect(mapStateToProps)(Visited);
