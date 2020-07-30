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

function VipCard(props) {
  const columns = [
    {
      key: 'displayOrder',
      title: '排序权重',
      dataIndex: 'displayOrder'
    },
    {
      key: 'name',
      title: '名称',
      dataIndex: 'name',
      align: 'left',
    },
    {
      key: 'price',
      title: '原价(元)',
      dataIndex: 'price',
      render: (t) => {
        if (t !== undefined) {
          return parseFloat(t).toFixed(2);
        }
      },
    },
    {
      key: 'discount',
      title: '优惠价(元)',
      dataIndex: 'discount',
      render: (t) => {
        if (t !== undefined) {
          return parseFloat(t).toFixed(2);
        }
      },
    },
    {
      key: 'privilege',
      title: '奖励金(元)',
      dataIndex: 'privilege',
      render: (t) => {
        if (t !== undefined) {
          return parseFloat(t).toFixed(2);
        }
      },
    },
    {
      key: 'times',
      title: '时长',
      render: (t, r) => {
        const { times, unit } = r;
        switch (unit) {
          case 'day': {
            return `${times}天`;
          }
          case 'week': {
            return `${times}周`;
          }
          case 'month': {
            return `${times}个月`;
          }
          case 'year': {
            return `${times}年`;
          }
          default: {
            return '--'
          }
        }
      },
    },
    {
      key: 'status',
      title: '状态',
      dataIndex: 'status',
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
      key: 'operator',
      title: '操作',
      dataIndex: 'id',
      render: function(t) {
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
              title="是否要删除"
              onConfirm={remove.bind(null, t)}
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

  const enableChange = (id, checked) => {
    props.dispatch({
      type: 'vipCard/changeEnable',
      id,
      body: {
        status: checked,
      },
    });
  };
  const edit = (id, e) => {
    e.preventDefault();
    if (id) {
      jump(`/vip/editor/${id}`);
    } else {
      jump('/vip/editor');
    }
  };
  const clone = (id, e) => {
    console.log('id', id);
    e.preventDefault();
    props.dispatch({
      type: 'vipCard/clone',
      id,
    });
  };
  const remove = (id, e) => {
    e.preventDefault();
    props.dispatch({
      type: 'vipCard/remove',
      id,
    });
  };
  const search = (e) => {
    e.preventDefault();
    props.dispatch({
      type: 'vipCard/search',
    });
  };
  const queryChange = (type, e) => {
    let value;
    switch (type) {
      case 'name':
      case 'subName':
      case 'tags':
      case 'prices.normal':
      case 'prices.vip':
      case 'prices.point': {
        if (e.target.value) {
          value = { [type]: e.target.value };
        } else {
          delete props.query[type];
        }
        break;
      }
      case 'status': {
        value = { [type]: e };
        break;
      }
    }
    props.dispatch({
      type: 'vipCard/upState',
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
        <Button icon="plus" type="primary" onClick={edit.bind(null, null)}>
          创建VIP商品
        </Button>
        <div>
          <Button className={styles.moBtn} onClick={search} icon="download" type="primary">
            查询
          </Button>
        </div>
      </div>
      <div className={styles.tableToolBar}>
        <Row>
          <Col span={6}>
            <FormItem className={styles.formItem} label="标题关键字">
              <Input
                style={{ width: 240 }}
                onChange={queryChange.bind(null, 'name')}
                placeholder="请输入标题关键字"
                value={props.query.name}
              />
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem className={styles.formItem} label="副标题关键字">
              <Input
                style={{ width: 240 }}
                onChange={queryChange.bind(null, 'subName')}
                placeholder="请输入副标题关键字"
                value={props.query.subName}
              />
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem className={styles.formItem} label="类型">
              <Input
                style={{ width: 240 }}
                onChange={queryChange.bind(null, 'category')}
                placeholder="请输入类型名称关键字"
                value={props.query.category}
                disabled
              />
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem
              className={styles.formItem}
              label="标签"
              help="如果有多个标签请使用英文逗号隔开','"
            >
              <Input
                style={{ width: 240 }}
                onChange={queryChange.bind(null, 'tags')}
                placeholder="请输入标签"
                value={props.query.tags}
              />
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem className={styles.formItem} label="活动状态">
              <Select
                style={{ width: 240 }}
                onChange={queryChange.bind(null, 'status')}
                placeholder="请选择商品状态"
                value={props.query.status}
              >
                <Select.Option value="all">不限</Select.Option>
                <Select.Option value="true">启用</Select.Option>
                <Select.Option value="false">停用</Select.Option>
              </Select>
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem className={styles.formItem} label="原价区间" help="请使用英文逗号隔开 ,">
              <Input
                style={{ width: 240 }}
                onChange={queryChange.bind(null, 'prices.normal')}
                placeholder="请输入"
                value={props.query['prices.normal']}
              />
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem className={styles.formItem} label="vip价区间" help="请使用英文逗号隔开 ,">
              <Input
                style={{ width: 240 }}
                onChange={queryChange.bind(null, 'prices.vip')}
                placeholder="请输入"
                value={props.query['prices.vip']}
              />
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem className={styles.formItem} label="积分价区间" help="请使用英文逗号隔开 ,">
              <Input
                style={{ width: 240 }}
                onChange={queryChange.bind(null, 'prices.point')}
                placeholder="请输入"
                value={props.query['prices.point']}
              />
            </FormItem>
          </Col>
        </Row>
      </div>

      <TableX
        columns={columns}
        dataSource={props.data || []}
        pagination={props.pagination || {}}
        fetchType="vipCard/fetch"
        dispatch={props.dispatch}
      />
    </div>
  );
}

function mapStateToProps({ vipCard }) {
  return vipCard;
}

export default connect(mapStateToProps)(Form.create()(VipCard));
