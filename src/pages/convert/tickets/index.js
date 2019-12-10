import { connect } from 'dva';
import moment from 'moment';
import _ from 'lodash';
import { Button, Modal, Form, Input, InputNumber, DatePicker } from 'antd';
import { TableX, FormItem } from '../../../utils/ui';
import Picker from '../prizes/Picker';
import styles from './index.less';

function Tickets(props) {
  const columns = [
    {
      key: 'sn',
      title: '序号',
      dataIndex: 'sn',
      align: 'center',
    },
    {
      key: 'code',
      title: '批号',
      dataIndex: 'code',
    },
    {
      key: 'codeSN',
      title: '批序号',
      dataIndex: 'codeSN',
      align: 'center',
    },
    {
      key: 'showSN',
      title: '展现编号',
      dataIndex: 'showSN',
      align: 'center',
    },
    {
      key: 'name',
      title: '名称',
      dataIndex: 'name',
    },
    {
      key: 'prize.value',
      title: '面值(元)',
      dataIndex: 'prize.value',
      render: function(t) {
        return t.toFixed(2);
      },
    },
    {
      key: 'prize.name',
      title: '关联礼包',
      dataIndex: 'prize.name',
    },
    {
      key: 'user.name',
      title: '领取者',
      dataIndex: 'user.name',
      render: function(t, r) {
        if (t) {
          return (
            <div>
              <div>{r.user.name}</div>
              <div>{r.user.mobile}</div>
            </div>
          );
        }
        return '--';
      },
    },
    {
      key: 'status',
      title: '状态',
      dataIndex: 'status',
      render: (t, r) => {
        switch (t) {
          case 'free': {
            return '待领取';
          }
          case 'expired': {
            return '已过期';
          }
          case 'binded': {
            <div>
              <div>已领取</div>
              <div>{moment(r.bindedTime).format('YYYY-MM-DD')}</div>
            </div>;
          }
          case 'expended': {
            return (
              <div>
                <div>已兑换</div>
                <div>{moment(r.expendedTime).format('YYYY-MM-DD')}</div>
              </div>
            );
          }
          default: {
            return '未知状态';
          }
        }
      },
    },
    {
      key: 'expiredTime',
      title: '到期时间',
      dataIndex: 'expiredTime',
      render: (t) => moment(t).format('YYYY-MM-DD'),
    },
  ];
  const edit = (visible) => {
    props.dispatch({
      type: 'tickets/upState',
      payload: {
        visible,
      },
    });
  };
  const onOk = () => {
    const { validateFields } = props.form;
    validateFields((errors, values) => {
      if (!errors) {
        props.dispatch({
          type: 'tickets/generateTickets',
          payload: values,
        });
      }
    });
  };
  const fetch = () => {
    props.dispatch({
      type: 'tickets/fetch',
      payload: {
        page: 1,
        pageSize: 8,
      },
    });
  };
  const exportCSV = () => {
    props.dispatch({
      type: 'tickets/exportCSV',
    });
  };
  const queryChange = (type, e) => {
    let value;
    switch (type) {
      case 'code': {
        value = { code: e.target.value };
        break;
      }
      case 'gte':
      case 'lte': {
        value = { [type]: e };
        break;
      }
    }
    props.dispatch({
      type: 'tickets/upState',
      payload: {
        query: {
          ...props.query,
          ...value,
        },
      },
    });
  };
  return (
    <div>
      <div className={styles.top}>
        <Button icon="plus" type="primary" onClick={edit.bind(null, true)}>
          批量生成电子券
        </Button>
        <div className={styles.searcher}>
          <Form layout="inline">
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
              <Button onClick={fetch} type="primary">
                查询
              </Button>
              <Button disabled>批量操作</Button>
              <Button onClick={exportCSV} type="danger">
                导出CSV
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
      <TableX
        columns={columns}
        dataSource={props.data || []}
        pagination={props.pagination || {}}
        fetchType="tickets/fetch"
        dispatch={props.dispatch}
      />
      <Modal
        title="批量生成电子券"
        visible={props.visible}
        onCancel={edit.bind(null, false)}
        onOk={onOk}
      >
        <Form>
          <FormItem label="关联礼包">
            {props.form.getFieldDecorator('prize', {
              type: Object,
              rules: [{ required: true, message: '必填想' }],
            })(<Picker type="prize" />)}
          </FormItem>
          <FormItem label="失效日期">
            {props.form.getFieldDecorator('expiredTime', {
              rules: [{ required: true }],
            })(
              <DatePicker
                disabledDate={(m) => m.valueOf() < moment().valueOf()}
                placeholder="请输入"
              />,
            )}
          </FormItem>
          <FormItem label="数量">
            {props.form.getFieldDecorator('count', { initialValue: 1 })(
              <InputNumber min={1} placeholder="请输入" />,
            )}
          </FormItem>
          <FormItem label="批号">
            {props.form.getFieldDecorator('code', { initialValue: '' })(
              <Input placeholder="请输入批号" />,
            )}
          </FormItem>
          <FormItem label="起始编号">
            {props.form.getFieldDecorator('beginNum', { initialValue: 0 })(
              <InputNumber min={0} placeholder="请输入" />,
            )}
          </FormItem>
          <FormItem label="编号位数">
            {props.form.getFieldDecorator('numberCount', {
              initialValue: 5,
            })(<InputNumber min={0} placeholder="请输入" />)}
          </FormItem>
        </Form>
      </Modal>
    </div>
  );
}
function mapStateToProps({ app, tickets }) {
  return { app, ...tickets };
}
export default connect(mapStateToProps)(Form.create()(Tickets));
