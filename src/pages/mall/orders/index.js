import { connect } from 'dva';
import { useEffect, useState } from 'react';
import moment from 'moment';
import _ from 'lodash';
import {
  Button,
  Row,
  Col,
  Form,
  Input,
  Select,
  Modal,
  DatePicker,
  InputNumber,
  Divider,
  Popconfirm,
  Icon,
  Switch,
} from 'antd';
import { source } from '../../../../setting';
import { jump } from '../../../utils';
import { TableX, FormItem } from '../../../utils/ui';
import styles from './index.less';
const { RangePicker } = DatePicker;

function ProductTitle() {
  return (
    <div className={styles.product}>
      <div className={styles._name}>商品</div>
      <div className={styles.price}>单价(元)</div>
      <div className={styles.carriage}>运费(元/件)</div>
      <div className={styles.count}>数量(件)</div>
      <div className={styles.discount}>优惠</div>
    </div>
  );
}

function MallOrders(props) {
  const [opts, setOpts] = useState(props.options);
  useEffect(
    () => {
      console.log('props.options', props.options);
      setOpts([...props.options]);
    },
    [props.options],
  );
  const columns = [
    {
      key: 'products',
      title: <ProductTitle />,
      render: function(t, r) {
        return (
          <div>
            {_.map(r.products, (p) => {
              return (
                <div className={styles.product} key={p.id}>
                  <img src={`${source}${p.image}?imageView2/2/w/56/h/56`} />
                  <div className={styles.name}>{p.name}</div>
                  <div className={styles.price}>￥{p.price.toFixed(2)}</div>
                  <div className={styles.carriage}>￥{p.carriage.toFixed(2)}</div>
                  <div className={styles.count}>{p.count}</div>
                  <div className={styles.discount}>
                    {p.discounts.length > 0
                      ? _.map(p.discounts, (d) => (
                          <div key={d.type}>
                            {d.name}
                            {/* , {d.cut.toFixed(2)} */}
                          </div>
                        ))
                      : '无'}
                  </div>
                </div>
              );
            })}
          </div>
        );
      },
    },
    {
      key: 'total',
      title: '总价(元)',
      dataIndex: 'total',
      render: function(t) {
        return t.toFixed(2);
      },
    },
    {
      key: 'cut',
      title: '优惠金额(元)',
      dataIndex: 'cut',
      render: function(t) {
        return t.toFixed(2);
      },
    },
    {
      key: 'payable',
      title: '应付(元)',
      dataIndex: 'payable',
      render: function(t) {
        return t.toFixed(2);
      },
    },
    {
      key: 'payment',
      title: '实付(元)',
      dataIndex: 'payment',
      render: function(t) {
        return t.toFixed(2);
      },
    },
    {
      key: 'status',
      title: '状态',
      dataIndex: 'status',
      align: 'center',
      render: function(t, r) {
        switch (t) {
          case 'waiting': {
            return (
              <div className={styles.status}>
                <div>待付款</div>
              </div>
            );
          }
          case 'paid': {
            return (
              <div className={styles.status}>
                <div>待发货</div>
                <Button type="danger" onClick={stockUp.bind(null, r.id)}>
                  备货
                </Button>
                <Button type="primary" onClick={send.bind(null, r)}>
                  发货
                </Button>
                <a onClick={changeDelivery.bind(null, r)}>更新收货信息</a>
              </div>
            );
          }
          case 'stockUp': {
            return (
              <div className={styles.status}>
                <div>备货中</div>
                <Button type="danger" onClick={stockUpCancel.bind(null, r.id)}>
                  取消备货
                </Button>
                <Button type="primary" onClick={send.bind(null, r)}>
                  发货
                </Button>
                <a onClick={changeDelivery.bind(null, r)}>更新收货信息</a>
              </div>
            );
          }
          case 'refunding': {
            return (
              <div className={styles.status}>
                <div>退款中</div>
                <Button type="danger" onClick={refund.bind(null, r.id)}>
                  退款
                </Button>
              </div>
            );
          }
          case 'refunded': {
            return (
              <div className={styles.status}>
                <div>已退款</div>
              </div>
            );
          }
          case 'sending': {
            return (
              <div className={styles.status}>
                <div>待收货</div>
                <Button type="danger" onClick={send.bind(null, r)}>
                  修改物流信息
                </Button>
                <div>{r.logistics.name}</div>
                <div>{r.logistics.sn}</div>
              </div>
            );
          }
          case 'received': {
            return (
              <div className={styles.status}>
                <div>待评价</div>
              </div>
            );
          }
          case 'shut': {
            return (
              <div className={styles.status}>
                <div>已关闭</div>
              </div>
            );
          }
          case 'finish': {
            return (
              <div className={styles.status}>
                <div>完成</div>
              </div>
            );
          }
        }
      },
    },
    {
      key: 'delivery',
      title: '收货信息',
      dataIndex: 'delivery',
      render: function(t) {
        return (
          <div>
            <div>
              {t.userName}, {t.telNumber}
            </div>
            <div>
              {t.provinceName} {t.cityName} {t.countyName} {t.detailInfo}
            </div>
          </div>
        );
      },
    },
    {
      key: 'orderInfo',
      title: '订单信息',
      dataIndex: 'user',
      width: 256,
      render: function(t, r) {
        return (
          <div>
            <div>
              {t.name}, {t.mobile}
            </div>
            <div>{r.code}</div>
            <div>{r.id}</div>
            <div>{moment(r.createTime).format('YYYY-MM-DD HH:mm:ss')}</div>
          </div>
        );
      },
    },
  ];
  const changeDelivery = (order) => {
    if (order) {
      props.dispatch({
        type: 'mallOrders/upState',
        payload: { delivery: { ...order.delivery, id: order.id } },
      });
    } else {
      props.dispatch({
        type: 'mallOrders/upState',
        payload: { delivery: null },
      });
    }
  };
  const updateDelivery = () => {
    props.form.validateFields((err, values) => {
      if (!err) {
        props.dispatch({
          type: 'mallOrders/updateDelivery',
          values,
        });
      }
    });
  };
  const refund = (id) => {
    props.dispatch({
      type: 'mallOrders/refund',
      id,
    });
  };
  const send = (order) => {
    const payload = { sending: order };
    if (order && order.logistics) {
      console.log('order.logistics', order.logistics);
      payload.options = [
        {
          ...order.logistics,
        },
      ];
    }
    props.dispatch({
      type: 'mallOrders/upState',
      payload,
    });
  };
  const stockUp = (id) => {
    props.dispatch({
      type: 'mallOrders/stockUp',
      id,
    });
  };
  const stockUpCancel = (id) => {
    props.dispatch({
      type: 'mallOrders/stockUpCancel',
      id,
    });
  };
  const onOk = () => {
    const { id } = props.sending;
    props.form.validateFields((err, values) => {
      if (!err) {
        props.dispatch({
          type: 'mallOrders/send',
          values: { id, ...values },
        });
      }
    });
  };
  const fetch = (e) => {
    e.preventDefault();
    props.dispatch({
      type: 'mallOrders/fetch',
    });
  };
  const queryChange = (type, e) => {
    let value;
    switch (type) {
      case 'userName':
      case 'deliveryName':
      case 'deliveryTel':
      case 'payable':
      case 'payment': {
        if (e.target.value) {
          value = { [type]: e.target.value };
        } else {
          delete props.query[type];
        }
        break;
      }
      case 'range':
      case 'status': {
        value = { [type]: e };
        break;
      }
    }
    props.dispatch({
      type: 'mallOrders/upState',
      payload: {
        query: {
          ...props.query,
          ...value,
        },
      },
    });
  };
  let timer;
  const search = (e) => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      const keyword = _.trim(e);
      if (keyword) {
        props.dispatch({
          type: 'mallOrders/searchCompanies',
          keyword,
        });
      }
    }, 500);
  };
  return (
    <div>
      <div className={styles.top}>
        {/* <div /> */}
        <div>
          <Button className={styles.moBtn} onClick={fetch} icon="download" type="primary">
            查询
          </Button>
        </div>
      </div>
      <div className={styles.tableToolBar}>
        <Row>
          <Col span={6}>
            <FormItem className={styles.formItem} label="姓名">
              <Input
                style={{ width: 240 }}
                onChange={queryChange.bind(null, 'userName')}
                placeholder="请输入下单者的姓名关键字"
                value={props.query.userName}
              />
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem className={styles.formItem} label="收货人姓名">
              <Input
                style={{ width: 240 }}
                onChange={queryChange.bind(null, 'deliveryName')}
                placeholder="请输入收货人的姓名关键字"
                value={props.query.deliveryName}
              />
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem className={styles.formItem} label="收货人电话">
              <Input
                style={{ width: 240 }}
                onChange={queryChange.bind(null, 'deliveryTel')}
                placeholder="请输入收货人的电话"
                value={props.query.deliveryTel}
              />
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem className={styles.formItem} label="应付区间(元)" help="请使用英文逗号','隔开">
              <Input
                style={{ width: 240 }}
                onChange={queryChange.bind(null, 'payable')}
                placeholder="请输入"
                value={props.query['payable']}
              />
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem className={styles.formItem} label="实付区间(元)" help="请使用英文逗号','隔开">
              <Input
                style={{ width: 240 }}
                onChange={queryChange.bind(null, 'payment')}
                placeholder="请输入"
                value={props.query['payment']}
              />
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem className={styles.formItem} label="下单时间">
              <RangePicker
                style={{ width: 240 }}
                value={props.query['range']}
                onChange={queryChange.bind(null, 'range')}
                showTime
                format="YYYY-MM-DD HH:mm:ss"
              />
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem className={styles.formItem} label="订单状态">
              <Select
                style={{ width: 240 }}
                mode="multiple"
                onChange={queryChange.bind(null, 'status')}
                placeholder="请选择商品状态"
                value={props.query.status}
              >
                <Select.Option value="waiting">待付款</Select.Option>
                <Select.Option value="paid">待发货</Select.Option>
                <Select.Option value="refunding">退款中</Select.Option>
                <Select.Option value="refunded">已退款</Select.Option>
                <Select.Option value="sending">待收货</Select.Option>
                {/* <Select.Option value="received" disabled>待评价</Select.Option> */}
                <Select.Option value="finish">已完成</Select.Option>
                <Select.Option value="shut">已关闭</Select.Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
      </div>
      <TableX
        columns={columns}
        dataSource={props.data || []}
        pagination={props.pagination || {}}
        fetchType="mallOrders/fetch"
        dispatch={props.dispatch}
      />
      {props.sending ? (
        <Modal
          title={props.sending.logistics ? '修改物流信息' : "发货"}
          visible={!!props.sending}
          onCancel={send.bind(null, null)}
          onOk={onOk}
          okText={props.sending.logistics ? '修改物流信息' : "发货"}
        >
          <Form>
            <FormItem label="快递公司">
              {props.form.getFieldDecorator('logistics', {
                initialValue: props.sending.logistics && {
                  key: props.sending.logistics.code,
                  label: props.sending.logistics.name,
                },
              })(
                <Select
                  placeholder="请输入"
                  onSearch={search}
                  labelInValue
                  showSearch
                  filterOption={false}
                >
                  {_.map(opts, (opt) => (
                    <Select.Option key={opt.code} value={opt.code}>
                      {opt.name}
                    </Select.Option>
                  ))}
                </Select>,
              )}
            </FormItem>
            <FormItem label="单号">
              {props.form.getFieldDecorator('sn', {
                rules: [{ required: true, message: '必填项' }],
                initialValue: props.sending.logistics && props.sending.logistics.sn,
              })(<Input placeholder="请输入" />)}
            </FormItem>
          </Form>
        </Modal>
      ) : null}
      {props.delivery ? (
        <Modal
          title="更新收货信息"
          visible={!!props.delivery}
          onCancel={changeDelivery.bind(null, null)}
          onOk={updateDelivery}
          okText="更新"
        >
          <Form>
            <FormItem label="收货人姓名">
              {props.form.getFieldDecorator('userName', {
                rules: [{ required: true, message: '必填项' }],
                initialValue: props.delivery.userName,
              })(<Input placeholder="请输入" />)}
            </FormItem>
            <FormItem label="收货人电话">
              {props.form.getFieldDecorator('telNumber', {
                rules: [{ required: true, message: '必填项' }],
                initialValue: props.delivery.telNumber,
              })(<Input placeholder="请输入" />)}
            </FormItem>
            <FormItem label="省">
              {props.form.getFieldDecorator('provinceName', {
                rules: [{ required: true, message: '必填项' }],
                initialValue: props.delivery.provinceName,
              })(<Input placeholder="请输入" />)}
            </FormItem>
            <FormItem label="市">
              {props.form.getFieldDecorator('cityName', {
                rules: [{ required: true, message: '必填项' }],
                initialValue: props.delivery.cityName,
              })(<Input placeholder="请输入" />)}
            </FormItem>
            <FormItem label="区">
              {props.form.getFieldDecorator('countyName', {
                rules: [{ required: true, message: '必填项' }],
                initialValue: props.delivery.countyName,
              })(<Input placeholder="请输入" />)}
            </FormItem>
            <FormItem label="详细地址">
              {props.form.getFieldDecorator('detailInfo', {
                rules: [{ required: true, message: '必填项' }],
                initialValue: props.delivery.detailInfo,
              })(<Input placeholder="请输入" />)}
            </FormItem>
          </Form>
        </Modal>
      ) : null}
    </div>
  );
}
function mapStateToProps({ mallOrders }) {
  return mallOrders;
}

export default connect(mapStateToProps)(Form.create()(MallOrders));
