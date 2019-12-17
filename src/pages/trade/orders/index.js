import { connect } from 'dva';
import { useEffect, useState } from 'react';
import moment from 'moment';
import _ from 'lodash';
import { Select, Modal, Form, Input, Popconfirm, Row, Col, Button, Icon } from 'antd';
import { TableX, FormItem } from '../../../utils/ui';
import styles from './styles.less';
const source = window.config.source;

function Orders(props) {
  const [opts, setOpts] = useState(props.options);
  const [expand, setExpand] = useState(false);
  useEffect(() => {
    setOpts([...props.options]);
  }, [props.options]);
  const columns = [
    {
      key: 'products',
      title: '商品',
      dataIndex: 'code',
      render: (t, r) => {
        return (
          <div className={styles.products}>
            {_.map(r.products, (p) => {
              return (
                <div key={p.id} className={styles.product}>
                  <img src={`${source}${p.image}?imageView2/2/w/64`} alt="商品图片" />
                  <div className={styles.info}>
                    <div className={styles.name}>{p.showName}</div>
                    <div className={styles.price}>￥{p.price}</div>
                    <div className={styles.count}>{p.count}件</div>
                  </div>
                </div>
              );
            })}
          </div>
        );
      },
    },
    {
      key: 'totalPrice',
      title: '总额(元)',
      dataIndex: 'totalPrice',
      align: 'center',
      render: (t, r) => {
        return (
          <div>
            <div className={styles.total}>{t.toFixed(2)}</div>
            <div>含运费{r.freight.toFixed(2)}</div>
          </div>
        );
      },
    },
    {
      key: 'payable',
      title: '实付款(元)',
      dataIndex: 'payable',
      align: 'center',
      render: (t) => <div className={styles.total}>{t.toFixed(2)}</div>,
    },
    {
      key: 'discounts',
      title: '优惠',
      dataIndex: 'discounts',
      render: (t) => {
        return _.map(t, (d) => d.name).join(',');
      },
    },
    {
      key: 'user.name',
      title: '客户',
      dataIndex: 'user.name',
    },
    {
      key: 'status',
      title: '状态',
      dataIndex: 'status',
      align: 'center',
      render: (t, r) => {
        switch (t) {
          case 'paying': {
            return '待付款';
          }
          case 'sending': {
            return (
              <div>
                <div>待发货</div>
                <a onClick={send.bind(null, r)}>发货</a>
              </div>
            );
          }
          case 'receiving': {
            return (
              <div>
                <div>待收货</div>
                <Popconfirm
                  title={`${r.logistics.name}, ${r.logistics.sn}`}
                  okText="知道了"
                >
                  <a href="#">物流信息</a>
                </Popconfirm>
              </div>
            );
          }
          case 'finishing': {
            return '待评价';
          }
          case 'finish': {
            return '已完成';
          }
          case 'break': {
            return '已关闭';
          }
          default: {
            return '未知状态';
          }
        }
      },
    },
    {
      key: 'delivery',
      title: '收货信息',
      render: (t, r) => {
        return (
          <div>
            <div>收货人: {r.delivery.name}</div>
            <div>联系电话: {r.delivery.mobile}</div>
            <div>详细地址: {r.delivery.address}</div>
          </div>
        );
      },
    },
    {
      key: 'info',
      title: '订单信息',
      render: (t, r) => {
        return (
          <div>
            <div>来自 {r.source.name}</div>
            <div>{moment(t).format('YYYY-MM-DD HH:mm:ss')}</div>
            <div>{r.code}</div>
          </div>
        );
      },
    },
    {
      key: 'opts',
      title: '操作',
      render: (t, r) => {
        return <a onClick={send.bind(null, r)}>详情</a>;
      },
    },
  ];
  const send = (record) => {
    if (record) {
      props.dispatch({
        type: 'orders/upState',
        payload: {
          visible: true,
          sending: record,
        },
      });
    } else {
      props.dispatch({
        type: 'orders/upState',
        payload: {
          visible: false,
          sending: null,
        },
      });
    }
  };
  const onOk = () => {
    props.form.validateFields((err, values) => {
      if (!err) {
        props.dispatch({
          type: 'orders/send',
          values,
        });
      }
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
          type: 'orders/searchCompanies',
          keyword,
        });
      }
    }, 500);
  };
  const handleSearch = () => {}
  const handleReset = () => {}
  const toggle = () => {}
  return (
    <div>
      <Form className="ant-advanced-search-form" onSubmit={handleSearch}>
        <Row gutter={24}></Row>
        <Row>
          <Col span={24} style={{ textAlign: 'right' }}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={handleReset}>
              重置查询条件
            </Button>
            <a style={{ marginLeft: 8, fontSize: 12 }} onClick={toggle}>
              Collapse <Icon type={expand ? 'up' : 'down'} />
            </a>
          </Col>
        </Row>
      </Form>
      <TableX
        columns={columns}
        dataSource={props.data || []}
        pagination={props.pagination || {}}
        fetchType="orders/fetch"
        dispatch={props.dispatch}
      />
      {props.visible ? (
        <Modal
          title="发货"
          visible={props.visible}
          onCancel={send.bind(null, null)}
          onOk={onOk}
          okText="发货"
        >
          <Form>
            <FormItem label="快递公司">
              {props.form.getFieldDecorator('logistics')(
                <Select
                  placeholder="请输入"
                  onSearch={search}
                  labelInValue
                  showSearch
                  filterOption={false}
                >
                  {_.map(opts, (opt) => (
                    <Select.Option key={opt.id} value={opt.id}>
                      {opt.name}
                    </Select.Option>
                  ))}
                </Select>,
              )}
            </FormItem>
            <FormItem label="单号">
              {props.form.getFieldDecorator('sn', {
                rules: [{ required: true, message: '必填项' }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
            <FormItem label="收货人">
              {props.form.getFieldDecorator('name', { initialValue: props.sending.delivery.name })(
                <Input placeholder="请输入" />,
              )}
            </FormItem>
            <FormItem label="收货手机">
              {props.form.getFieldDecorator('mobile', {
                initialValue: props.sending.delivery.mobile,
              })(<Input placeholder="请输入" />)}
            </FormItem>
            <FormItem label="详细地址">
              {props.form.getFieldDecorator('address', {
                initialValue: props.sending.delivery.address,
              })(<Input.TextArea placeholder="请输入" />)}
            </FormItem>
          </Form>
        </Modal>
      ) : null}
    </div>
  );
}
function mapStateToProps({ app, orders }) {
  return { app, ...orders };
}
export default connect(mapStateToProps)(Form.create()(Orders));
