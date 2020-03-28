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
import { source } from '../../../../setting';

function PrizeList(props) {
  const edit = (id) => {
    if (id) {
      jump(`/mission/prize/detail/${id}`);
    } else {
      jump('/mission/prize/detail');
    }
  };
  const queryChange = () => {};
  const columns = [
    {
      key: 'name',
      title: '名称',
      dataIndex: 'name',
      render: function(t, r) {
        return (
          <div className={styles.prizeName}>
            <img src={`${source}${r.image}`} alt="img" />
            {r.name}
          </div>
        );
      },
    },
    {
      key: 'value',
      title: '价值(元)',
      dataIndex: 'value',
    },
    {
      key: 'type',
      title: '类型',
      dataIndex: 'type',
      render: (t) => {
        switch (t) {
          case 'product': {
            return '商品';
          }
          case 'point': {
            return '积分';
          }
          case 'lotto': {
            return '抽奖';
          }
        }
      },
    },
    {
      key: 'status',
      title: '状态',
      dataIndex: 'status',
      render: (t, r) => {
        const edit = (e) => {
          props.dispatch({
            type: 'taskPrize/update',
            payload: {
              status: e,
              id: r.id,
            },
          });
        };
        return <Switch checked={t} size="small" onChange={edit} />;
      },
    },
    {
      key: 'opt',
      title: '操作',
      render: (t, r) => {
        return (
          <div>
            <Button
              icon="edit"
              type="primary"
              shape="circle"
              size="small"
              onClick={edit.bind(null, r.id)}
            />
          </div>
        );
      },
    },
  ];
  return (
    <div>
      <div className={styles.top}>
        <Button icon="plus" type="primary" onClick={edit.bind(null, null)}>
          创建任务奖励
        </Button>
        <div className={styles.searcher}>
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
              {/* <Button onClick={visibleCSV.bind(null, true)} type="danger" className={styles.btn}>
                导出CSV
              </Button> */}
            </Form.Item>
          </Form>
        </div>
      </div>
      <TableX
        columns={columns}
        dataSource={props.data || []}
        pagination={props.pagination || {}}
        fetchType="taskPrize/fetch"
        dispatch={props.dispatch}
      />
    </div>
  );
}

function mapStateToProps({ taskPrize }) {
  return taskPrize;
}

export default connect(mapStateToProps)(PrizeList);
