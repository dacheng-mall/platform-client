import { Fragment, useState } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import _ from 'lodash';
import {
  Button,
  Form,
  Divider,
  Popconfirm,
  Icon,
  Switch,
  Modal,
  InputNumber,
  Row,
  Col,
  Select,
  DatePicker,
  Input,
} from 'antd';

import { jump } from '../../../utils';
import { TableX, FormItem } from '../../../utils/ui';
import styles from './index.less';
const { RangePicker } = DatePicker;
let timer;

function Gathering(props) {
  const enableChange = (id, checked) => {
    props.dispatch({
      type: 'gathering/changeEnable',
      id,
      body: {
        enable: checked,
      },
    });
  };
  const deleteActive = (id) => {
    props.dispatch({
      type: 'gathering/delete',
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
      key: 'range',
      title: '周期',
      render: function(t, r) {
        return (
          <div>
            {moment(r.from).format('YYYY-MM-DD HH:mm:ss')} 开始
            <br />
            {moment(r.to).format('YYYY-MM-DD HH:mm:ss')} 结束
          </div>
        );
      },
    },
    {
      key: 'institution',
      title: '机构',
      dataIndex: 'institution.name',
    },
    {
      key: 'store',
      title: '库存',
      dataIndex: 'id',
      render: (id) => {
        function store() {
          props.dispatch({
            type: 'gathering/store',
            id,
          });
        }
        return (
          <Button type="primary" onClick={store}>
            管理库存
          </Button>
        );
      },
    },
    {
      key: 'type',
      title: '核销方式',
      dataIndex: 'type',
      render: function(t, r) {
        switch (t) {
          case 'offline': {
            return '线下核销';
          }
          case 'online': {
            return '线上发货';
          }
          default: {
            return '未知核销方式';
          }
        }
      },
    },
    {
      key: 'enable',
      title: '启用状态',
      dataIndex: 'enable',
      render: function(t, r) {
        if (props.userType === 1) {
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
        } else {
          if (t) {
            return '启用';
          }
          return '停用';
        }
      },
    },
    {
      key: 'export',
      title: '导出数据',
      dataIndex: 'id',
      render: function(t, r) {
        return (
          <div>
            <Button type="danger" onClick={exportCSV.bind(null, 'order', r)}>
              订单
            </Button>
            <Divider type="vertical" />
            <Button type="danger" onClick={exportCSV.bind(null, 'sign', r)}>
              报名
            </Button>
            <Divider type="vertical" />
            <Button type="danger" onClick={exportCSV.bind(null, 'tickets', r)}>
              送达
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
        if (props.userType === 1) {
          return (
            <div>
              <Button
                shape="circle"
                type="primary"
                icon="copy"
                title="克隆"
                onClick={clone.bind(null, t)}
              />
              <Divider type="vertical" />
              <Button
                shape="circle"
                type="primary"
                icon="edit"
                title="编辑"
                onClick={edit.bind(null, t)}
              />
              <Divider type="vertical" />
              <Popconfirm
                title="是否要删除活动"
                onConfirm={deleteActive.bind(null, t)}
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
        } else if (props.userType === 3) {
          return (
            <Button
              shape="circle"
              icon="eye"
              type="primary"
              title="查看"
              onClick={show.bind(null, r)}
            />
          );
        }
      },
    },
  ];
  const show = (detail) => {
    console.log(detail);
    props.dispatch({
      type: 'gathering/upState',
      payload: {
        detail,
      },
    });
  };
  const hideDetail = () => {
    props.dispatch({
      type: 'gathering/upState',
      payload: {
        detail: null,
      },
    });
  };

  const exportCSV = (type, record) => {
    props.dispatch({
      type: 'gathering/exportCSV',
      payload: {
        type,
        id: record.id,
        name: record.name,
        institutionId: record.institution.id,
        institutionCode: record.institution.code,
      },
    });
  };
  const clone = (id) => {
    props.dispatch({
      type: 'gathering/clone',
      payload: { id },
    });
  };
  const edit = (id) => {
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
        value = { institution: e };
        break;
      }
      case 'name': {
        value = { name: e.target.value };
        break;
      }
      case 'range':
      case 'enable': {
        console.log(type, e);
        value = { [type]: e };
        break;
      }
    }
    props.dispatch({
      type: 'gathering/upState',
      payload: {
        query: {
          ...props.query,
          ...value,
        },
      },
    });
  };
  const exportCsv = (type) => {
    props.dispatch({
      type: 'gathering/exportCSV',
      payload: { type },
    });
  };
  const handleSetStore = () => {
    if (props.userType === 1) {
      props.dispatch({
        type: 'gathering/setStore',
      });
    } else {
      handleCancel();
    }
  };
  const handleCancel = () => {
    props.dispatch({
      type: 'gathering/upState',
      payload: {
        editingStore: null,
      },
    });
  };
  const changeStore = (value) => {
    props.dispatch({
      type: 'gathering/changeStore',
      value,
    });
  };
  const syncStore = (value) => {
    props.dispatch({
      type: 'gathering/syncStore',
      value,
    });
  };
  const searchInst = (name) => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      props.dispatch({
        type: 'gathering/searchInst',
        name,
      });
    }, 500);
  };
  const search = () => {
    props.dispatch({
      type: 'gathering/fetch',
      payload: {
        page: 1,
        pageSize: 8,
      },
    });
  };
  return (
    <div>
      <div className={styles.buttonWrap}>
        <div className={styles.title}>
          {props.userType === 1 ? (
            <Button icon="plus" type="primary" onClick={edit}>
              创建抢购活动
            </Button>
          ) : (
            '抢购活动列表'
          )}
        </div>
        <div>
          <Button className={styles.moBtn} onClick={search} icon="download" type="primary">
            查询
          </Button>
        </div>
      </div>
      <div className={styles.tableToolBar}>
        <Row>
          <Col span={12}>
            <FormItem className={styles.formItem} label="机构">
              <Select
                showSearch
                value={props.query.institution}
                placeholder="输入名称关键字查询机构"
                style={{ width: 240 }}
                defaultActiveFirstOption={false}
                showArrow={false}
                filterOption={false}
                labelInValue
                disabled={props.level > 1}
                allowClear={props.userType !== 3}
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
            <FormItem className={styles.formItem} label="时间段">
              <RangePicker
                style={{ width: 240 }}
                ranges={{
                  昨日: [
                    moment()
                      .subtract(1, 'day')
                      .startOf('day'),
                    moment()
                      .subtract(1, 'day')
                      .endOf('day'),
                  ],
                  今日: [moment(), moment()],
                  上周: [
                    moment()
                      .subtract(1, 'week')
                      .startOf('week'),
                    moment()
                      .subtract(1, 'week')
                      .endOf('week'),
                  ],
                  本周: [moment().startOf('week'), moment().endOf('week')],
                  上月: [
                    moment()
                      .subtract(1, 'month')
                      .startOf('month'),
                    moment()
                      .subtract(1, 'month')
                      .endOf('month'),
                  ],
                  本月: [moment().startOf('month'), moment().endOf('month')],
                  上季度: [
                    moment()
                      .subtract(1, 'quarter')
                      .startOf('quarter'),
                    moment()
                      .subtract(1, 'quarter')
                      .endOf('quarter'),
                  ],
                  本季度: [moment().startOf('quarter'), moment().endOf('quarter')],
                }}
                format="YYYY-MM-DD"
                onChange={queryChange.bind(null, 'range')}
                value={props.query.range}
              />
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem className={styles.formItem} label="活动名称">
              <Input
                style={{ width: 240 }}
                onChange={queryChange.bind(null, 'name')}
                placeholder="请输入活动那个名称关键字"
                value={props.query.name}
              />
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem className={styles.formItem} label="活动状态">
              <Select
                style={{ width: 240 }}
                onChange={queryChange.bind(null, 'enable')}
                placeholder="请选择活动状态"
                value={props.query.enable}
              >
                <Select.Option value="all">不限</Select.Option>
                <Select.Option value="true">激活</Select.Option>
                <Select.Option value="false">停止</Select.Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
      </div>

      <TableX
        columns={columns}
        dataSource={props.data || []}
        pagination={props.pagination || {}}
        fetchType="gathering/fetch"
        dispatch={props.dispatch}
      />
      <Modal
        visible={!!props.editingStore}
        title="编辑库存"
        onOk={handleSetStore}
        onCancel={handleCancel}
      >
        <Form>
          <FormItem label="库存总量" style={{ marginBottom: '5px' }}>
            <div>{props.editingStore && props.editingStore.current}</div>
          </FormItem>
          <FormItem label="已售出" style={{ marginBottom: '5px' }}>
            <div>{props.editingStore && props.editingStore.total}</div>
          </FormItem>
          <FormItem label="剩余库存" style={{ marginBottom: '5px' }}>
            <div>{props.editingStore && props.editingStore.current - props.editingStore.total}</div>
          </FormItem>
          {props.userType === 1 ? (
            <FormItem label="新库存" style={{ marginBottom: '5px' }}>
              <InputNumber
                onChange={changeStore}
                value={props.editingStore && props.editingStore.value}
                placeholder="请输入"
              />
            </FormItem>
          ) : null}
          {props.userType === 1 ? (
            <Button onClick={syncStore} type="danger">
              同步库存
            </Button>
          ) : null}
        </Form>
      </Modal>
      {props.detail ? (
        <Modal
          visible={!!props.detail}
          title="活动详情"
          width="720px"
          footer={null}
          onCancel={hideDetail}
        >
          <Row>
            <Col span={12}>
              <FormItem label="标题" style={{ marginBottom: '5px' }}>
                <div>{props.detail.name}</div>
              </FormItem>
              <FormItem label="副标题" style={{ marginBottom: '5px' }}>
                <div>{props.detail.subName}</div>
              </FormItem>
              <FormItem label="邀请上限" style={{ marginBottom: '5px' }}>
                <div>{props.detail.inviteMax}位</div>
              </FormItem>
              <FormItem label="内购上限" style={{ marginBottom: '5px' }}>
                <div>{props.detail.innerBuyCountMax}件</div>
              </FormItem>
              <FormItem label="内购起订" style={{ marginBottom: '5px' }}>
                <div>{props.detail.innerBuyCountMin}件</div>
              </FormItem>
              <FormItem label="内购价格" style={{ marginBottom: '5px' }}>
                <div>{props.detail.innerPrice}元</div>
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="关联商品" style={{ marginBottom: '5px' }}>
                <div style={{ lineHeight: '1.5em', paddingTop: '8px' }}>
                  {_.map(props.detail.products, (product) => (
                    <div key={product.id}>
                      {product.showName} x{product.count} ￥{product.price.toFixed(2)}
                    </div>
                  ))}
                </div>
              </FormItem>
              <FormItem label="优惠规则" style={{ marginBottom: '5px' }}>
                {props.detail.discount.length < 1 ? (
                  '无'
                ) : (
                  <div style={{ lineHeight: '1.5em', paddingTop: '8px' }}>
                    {_.map(props.detail.discount, (disc, i) => (
                      <div key={`discount-${i}`}>{disc.name}</div>
                    ))}
                  </div>
                )}
              </FormItem>
              <FormItem label="客购上限" style={{ marginBottom: '5px' }}>
                <div>{props.detail.outerBuyCountMax}件</div>
              </FormItem>
              <FormItem label="客购起订" style={{ marginBottom: '5px' }}>
                <div>{props.detail.outerBuyCountMin}件</div>
              </FormItem>
              <FormItem label="客购价格" style={{ marginBottom: '5px' }}>
                <div>{props.detail.outerPrice}元</div>
              </FormItem>
            </Col>
          </Row>
        </Modal>
      ) : null}
    </div>
  );
}

function mapStateToProps({ gathering }) {
  return gathering;
}

export default connect(mapStateToProps)(Gathering);
