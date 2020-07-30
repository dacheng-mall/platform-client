import { connect } from 'dva';
import moment from 'moment';
import _ from 'lodash';
import {
  Button,
  Row,
  Col,
  Form,
  Input,
  DatePicker,
  InputNumber,
  Divider,
  Popconfirm,
  Icon,
  Switch,
  Select,
} from 'antd';
import { TableX, FormItem } from '../../../utils/ui';
import styles from './index.less';
const { RangePicker } = DatePicker;

function vipOrders(props) {
  const columns = [
    {
      key: 'createTime',
      title: '下单时间',
      dataIndex: 'createTime',
      render: (t) => {
        if (t !== undefined) {
          return moment(t).format('YYYY-MM-DD HH:mm:ss');
        }
      },
    },
    {
      key: 'user',
      title: '客户姓名',
      dataIndex: 'user',
      align: 'left',
      render: (t) => {
        if (t !== undefined) {
          return (
            <div>
              <div>{t.name}</div>
              <div>{t.mobile}</div>
            </div>
          );
        }
      },
    },
    {
      key: 'productName',
      title: '会员卡商品',
      dataIndex: 'product.name',
      width: 180,
      render: (t) => {
        if (t !== undefined) {
          return <div style={{ fontSize: '16px' }}>{t}</div>;
        }
      },
    },
    {
      key: 'product',
      title: '价格(元)',
      dataIndex: 'product',
      width: 180,
      render: (t) => {
        if (t !== undefined) {
          return (
            <div>
              <div>优惠: ￥{parseFloat(t.discount).toFixed(2)}</div>
              <div style={{ textDecoration: 'line-through' }}>
                原价: ￥{parseFloat(t.price).toFixed(2)}
              </div>
            </div>
          );
        }
      },
    },
    {
      key: 'inviter',
      title: '邀请人',
      dataIndex: 'inviter',
      render: (t) => {
        if (t !== undefined) {
          return (
            <div>
              <div>{t.name}</div>
              <div>{t.mobile}</div>
            </div>
          );
        }
        return '--';
      },
    },
    {
      key: 'commission',
      title: '邀请奖励(元)',
      dataIndex: 'product.commission',
      render: (t, r) => {
        if (t !== undefined) {
          if (r.inviter) {
            return parseFloat(t).toFixed(2);
          }
          return '--';
        }
      },
    },
    {
      key: 'time',
      title: '周期',
      render: (t, r) => {
        if (r.status === 'paid') {
          return `${moment(r.startTime).format('YYYY-MM-DD')}至${moment(r.endTime).format(
            'YYYY-MM-DD',
          )}`;
        }
        return '--';
      },
    },
    {
      key: 'status',
      title: '状态',
      dataIndex: 'status',
      render: function(t) {
        switch (t) {
          case 'paid': {
            return <div style={{ color: '#11a74d' }}>支付成功</div>;
          }
          case 'shut': {
            return <div style={{ color: '#f66' }}>关闭</div>;
          }
        }
      },
    },
    // {
    //   key: 'operator',
    //   title: '操作',
    //   dataIndex: 'id',
    //   render: function(t, r) {
    //     return (
    //       <div>
    //         <Button
    //           shape="circle"
    //           type="primary"
    //           icon="eye"
    //           title="详情"
    //           onClick={edit.bind(null, t)}
    //         />
    //         <Divider type="vertical" />
    //         {r.status === 'waiting' ? (
    //           <Popconfirm
    //             title="是否改为已返现"
    //             onConfirm={operate.bind(null, t, 'done')}
    //             placement="topRight"
    //             icon={<Icon type="question-circle-o" style={{ color: 'red' }} />}
    //             okText="返现"
    //             cancelText="算了, 我再考虑下"
    //           >
    //             <Button shape="circle" type="danger" icon="edit" title="返现" />
    //           </Popconfirm>
    //         ) : r.status === 'done' ? (
    //           <Popconfirm
    //             title="是否改为待返现"
    //             onConfirm={operate.bind(null, t, 'waiting')}
    //             placement="topRight"
    //             icon={<Icon type="question-circle-o" style={{ color: 'red' }} />}
    //             okText="退回"
    //             cancelText="算了, 我再考虑下"
    //           >
    //             <Button shape="circle" type="primary" icon="edit" title="退回" />
    //           </Popconfirm>
    //         ) : null}
    //       </div>
    //     );
    //   },
    // },
  ];
  const search = (e) => {
    e.preventDefault();
    props.dispatch({
      type: 'vipOrders/search',
    });
  };
  const queryChange = (type, e) => {
    let value;
    switch (type) {
      case 'product.name':
      case 'user.name':
      case 'inviter.name':
      case 'total': {
        if (e.target.value) {
          value = { [type]: e.target.value };
        } else {
          delete props.query[type];
        }
        break;
      }
      case 'range':
      case 'status': {
        console.log(type, e);
        value = { [type]: e };
        break;
      }
    }
    props.dispatch({
      type: 'vipOrders/upState',
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
        <div>
          <Button className={styles.moBtn} onClick={search} icon="download" type="primary">
            查询
          </Button>
        </div>
      </div>
      <div className={styles.tableToolBar}>
        <Row>
          <Col span={8}>
            <FormItem className={styles.formItem} label="会员卡名称">
              <Input
                style={{ width: 320 }}
                onChange={queryChange.bind(null, 'product.name')}
                placeholder="请输入会员卡名称关键字"
                value={props.query['product.name']}
              />
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem className={styles.formItem} label="客户姓名">
              <Input
                style={{ width: 320 }}
                onChange={queryChange.bind(null, 'user.name')}
                placeholder="请输入客户姓名关键字"
                value={props.query['user.name']}
              />
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem className={styles.formItem} label="邀请人姓名">
              <Input
                style={{ width: 320 }}
                onChange={queryChange.bind(null, 'inviter.name')}
                placeholder="请输入邀请人姓名关键字"
                value={props.query['inviter.name']}
              />
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem className={styles.formItem} label="订单状态">
              <Select
                style={{ width: 320 }}
                onChange={queryChange.bind(null, 'status')}
                placeholder="请选择订单状态状态"
                value={props.query.status}
              >
                <Select.Option value="all">不限</Select.Option>
                <Select.Option value="paid">支付成功</Select.Option>
                <Select.Option value="shut">关闭</Select.Option>
              </Select>
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem className={styles.formItem} label="下单时间">
              <RangePicker
                style={{ width: 320 }}
                onChange={queryChange.bind(null, 'range')}
                value={props.query.range}
              />
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem className={styles.formItem} label="订单金额(元)" help="请使用英文逗号隔开 ,">
              <Input
                style={{ width: 320 }}
                onChange={queryChange.bind(null, 'total')}
                placeholder="请输入"
                value={props.query.total}
              />
            </FormItem>
          </Col>
        </Row>
      </div>

      <TableX
        columns={columns}
        dataSource={props.data || []}
        pagination={props.pagination || {}}
        fetchType="vipOrders/fetch"
        dispatch={props.dispatch}
      />
    </div>
  );
}

function mapStateToProps({ vipOrders }) {
  return vipOrders;
}

export default connect(mapStateToProps)(Form.create()(vipOrders));
