import { connect } from 'dva';
import moment from 'moment';
import _ from 'lodash';
import {
  Button,
  Row,
  Col,
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
import { source } from '../../../../setting';
import { jump } from '../../../utils';
import { TableX, FormItem } from '../../../utils/ui';
import styles from './index.less';
const { RangePicker } = DatePicker;

function Commission(props) {
  const columns = [
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
      key: 'product',
      title: 'vip商品',
      dataIndex: 'product',
      width: 180,
      render: (t) => {
        if (t !== undefined) {
          return (
            <div>
              <div>{t.name}</div>
              <div>原价: ￥{parseFloat(t.price).toFixed(2)}</div>
              <div>优惠: ￥{parseFloat(t.discount).toFixed(2)}</div>
            </div>
          );
        }
      },
    },
    {
      key: 'inviter',
      title: '奖励对象',
      dataIndex: 'inviter',
      render: (t) => {
        if (t !== undefined) {
          return (
            <div>
              <div>{t.name}</div>
              <div>{t.mobile}</div>
              <div>openId: {t.openId}</div>
            </div>
          );
        }
      },
    },
    {
      key: 'amount',
      title: '奖励(元)',
      dataIndex: 'amount',
      render: (t) => {
        if (t !== undefined) {
          return parseFloat(t).toFixed(2);
        }
      },
    },
    {
      key: 'status',
      title: '状态',
      dataIndex: 'status',
      render: function(t) {
        switch (t) {
          case 'waiting': {
            return '待奖励';
          }
          case 'done': {
            return '已奖励';
          }
          case 'close': {
            return '驳回';
          }
        }
      },
    },
    {
      key: 'operator',
      title: '操作',
      dataIndex: 'id',
      render: function(t, r) {
        return (
          <div>
            {/* <Button
              shape="circle"
              type="primary"
              icon="eye"
              title="详情"
              onClick={edit.bind(null, t)}
            />
            <Divider type="vertical" /> */}
            {r.status === 'waiting' ? (
              <Popconfirm
                title="是否改为已返现"
                onConfirm={operate.bind(null, t, 'done')}
                placement="topRight"
                icon={<Icon type="question-circle-o" style={{ color: 'red' }} />}
                okText="返现"
                cancelText="算了, 我再考虑下"
              >
                <Button shape="circle" type="danger" icon="check" title="返现" />
              </Popconfirm>
            ) : r.status === 'done' ? (
              <Popconfirm
                title="是否改为待返现"
                onConfirm={operate.bind(null, t, 'waiting')}
                placement="topRight"
                icon={<Icon type="question-circle-o" style={{ color: 'red' }} />}
                okText="退回"
                cancelText="算了, 我再考虑下"
              >
                <Button shape="circle" type="primary" icon="left" title="退回" />
              </Popconfirm>
            ) : null}
          </div>
        );
      },
    },
  ];
  const operate = (id, type) => {
    props.dispatch({
      type: 'commission/operate',
      payload: {
        id,
        type,
      },
    });
  };
  const enableChange = (id, checked) => {
    props.dispatch({
      type: 'commission/changeEnable',
      id,
      body: {
        status: checked,
      },
    });
  };
  const edit = (id, e) => {
    e.preventDefault();
    // if (id) {
    //   jump(`/vip/editor/${id}`);
    // } else {
    //   jump('/vip/editor');
    // }
  };
  const search = (e) => {
    e.preventDefault();
    props.dispatch({
      type: 'commission/search',
    });
  };

  const queryChange = (type, e) => {
    let value;
    switch (type) {
      case 'product.name':
      case 'user.name':
      case 'inviter.name':
      case 'amount': {
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
      type: 'commission/upState',
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
                <Select.Option value="done">已发放奖励</Select.Option>
                <Select.Option value="close">驳回</Select.Option>
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
                onChange={queryChange.bind(null, 'amount')}
                placeholder="请输入"
                value={props.query.amount}
              />
            </FormItem>
          </Col>
        </Row>
      </div>

      <TableX
        columns={columns}
        dataSource={props.data || []}
        pagination={props.pagination || {}}
        fetchType="commission/fetch"
        dispatch={props.dispatch}
      />
    </div>
  );
}

function mapStateToProps({ commission }) {
  return commission;
}

export default connect(mapStateToProps)(Form.create()(Commission));
