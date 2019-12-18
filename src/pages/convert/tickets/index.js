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
} from 'antd';
import { TableX, FormItem } from '../../../utils/ui';
import Picker from '../prizes/Picker';
import styles from './index.less';

function Tickets(props) {
  const [prefix, setPrefix] = useState('');
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
      key: 'prize.value',
      title: '面值(元)',
      dataIndex: 'prize.value',
      render: function(t) {
        return t ? t.toFixed(2) : '无';
      },
    },
    {
      key: 'prize.name',
      title: '关联礼包',
      dataIndex: 'prize.name',
      render: function(t) {
        return t || '无';
      },
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
        return '无';
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
              title="是否要删除兑换券数据"
              onConfirm={deleteTicket.bind(null, t)}
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
  const deleteTicket = (id) => {
    props.dispatch({
      type: 'tickets/remove',
      id,
    });
  };
  const edit = (visible, id) => {
    props.dispatch({
      type: 'tickets/upState',
      payload: {
        visible,
        id,
      },
    });
  };
  const onOk = () => {
    const { validateFields } = props.form;
    const { visible } = props;
    validateFields((errors, values) => {
      if (!errors) {
        let type = 'tickets/';
        switch (visible) {
          case 'generator': {
            type += 'generateTickets';
            break;
          }
          default: {
            type += visible;
            break;
          }
        }
        props.dispatch({
          type,
          payload: values,
          form: props.form,
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
      prefix,
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
      case 'lte':
      case 'status': {
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
  const visibleCSV = (csvShow) => {
    props.dispatch({
      type: 'tickets/upState',
      payload: {
        csvShow,
      },
    });
  };
  const changeExportPrefix = (e) => {
    setPrefix(e.target.value);
  };
  return (
    <div>
      <div className={styles.top}>
        <Button icon="plus" type="primary" onClick={edit.bind(null, 'generator')}>
          批量生成电子券
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
              <Button onClick={edit.bind(null, 'batch')} type="danger" className={styles.btn}>
                批量操作
              </Button>
              <Button onClick={visibleCSV.bind(null, true)} type="danger" className={styles.btn}>
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
        title="导出CSV"
        visible={props.csvShow}
        onCancel={visibleCSV.bind(null, false)}
        onOk={exportCSV}
      >
        <div className={styles.batchQuery}>
          <div className={styles.title}>查询条件</div>
          {`范围: ${props.query.code ? `批号为(${props.query.code})的数据` : '全部数据'}`}
          {props.query.status ? <div>{`状态: ${props.query.status}`}</div> : null}
          {props.query.gte ? <div>{`起始: ${props.query.gte}`}</div> : null}
          {props.query.lte ? <div>{`结束: ${props.query.lte}`}</div> : null}
        </div>
        <Input
          onChange={changeExportPrefix}
          value={prefix}
          placeholder="请输入二维码源字符串的前缀"
        />
      </Modal>
      <Modal
        title={
          props.visible === 'generator'
            ? '批量生成电子券'
            : props.visible === 'batch'
            ? '批处理'
            : props.visible === 'edit'
            ? '更新'
            : ''
        }
        visible={!!props.visible}
        onCancel={edit.bind(null, false)}
        footer={[
          <Button key="back" onClick={edit.bind(null, false)}>
            取消
          </Button>,
          <Button key="submit" type="primary" loading={props.loading} onClick={onOk}>
            提交
          </Button>,
        ]}
      >
        {props.visible === 'batch' ? (
          <div className={styles.batchQuery}>
            <div className={styles.title}>更新条件</div>
            {`范围: ${props.query.code ? `批号为(${props.query.code})的数据` : '全部数据'}`}
            {props.query.status ? <div>{`状态: ${props.query.status}`}</div> : null}
            {props.query.gte ? <div>{`起始: ${props.query.gte}`}</div> : null}
            {props.query.lte ? <div>{`结束: ${props.query.lte}`}</div> : null}
          </div>
        ) : null}
        <Form>
          <FormItem label="关联礼包">
            {props.form.getFieldDecorator('prize', {
              type: Object,
            })(<Picker type="prize" />)}
          </FormItem>
          <FormItem label="批号">
            {props.form.getFieldDecorator('code', { initialValue: '' })(
              <Input placeholder="请输入批号" />,
            )}
          </FormItem>
          <FormItem label="失效日期">
            {props.form.getFieldDecorator('expiredTime', {
              rules: [{ required: props.visible === 'generator', message: '必填项' }],
            })(
              <DatePicker
                disabledDate={(m) => m.valueOf() < moment().valueOf()}
                placeholder="请输入"
              />,
            )}
          </FormItem>
          {props.visible === 'generator' && (
            <Fragment>
              <FormItem label="数量">
                {props.form.getFieldDecorator('count', { initialValue: 1 })(
                  <InputNumber min={1} placeholder="请输入" />,
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
            </Fragment>
          )}
        </Form>
      </Modal>
    </div>
  );
}
function mapStateToProps({ app, tickets }) {
  return { app, ...tickets };
}
export default connect(mapStateToProps)(Form.create()(Tickets));
