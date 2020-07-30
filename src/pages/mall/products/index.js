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

function Products(props) {
  const columns = [
    {
      key: 'displayOrder',
      title: '序号',
      dataIndex: 'displayOrder',
    },
    {
      key: 'name',
      title: '名称',
      render: (t, r) => {
        const {
          name,
          subName,
          images: [img],
        } = r;
        return (
          <div className={styles.nameWrap}>
            <img className={styles.img} src={`${source}${img}?imageView2/2/w/160/h/160`} />
            <div className={styles.text}>
              <div className={styles.name}>{name}</div>
              <div className={styles.subName}>{subName}</div>
            </div>
          </div>
        );
      },
      align: 'left',
    },
    {
      key: 'category',
      title: '分类',
      dataIndex: 'category.name',
    },
    {
      key: 'tags',
      title: '标签',
      dataIndex: 'tags',
      render: (t) => {
        if (t !== undefined) {
          return t.join(', ');
        }
      },
    },
    {
      key: 'prices.normal',
      title: '原价(元)',
      dataIndex: 'prices.normal',
      render: (t) => {
        if (t !== undefined) {
          return parseFloat(t).toFixed(2);
        }
      },
    },
    {
      key: 'prices.discount',
      title: '优惠价(元)',
      dataIndex: 'prices.discount',
      render: (t) => {
        if (t !== undefined) {
          return parseFloat(t).toFixed(2);
        }
      },
    },
    {
      key: 'prices.vip',
      title: 'vip价(元)',
      dataIndex: 'prices.vip',
      render: (t) => {
        if (t !== undefined) {
          return parseFloat(t).toFixed(2);
        }
      },
    },
    {
      key: 'prices.vipDiscount',
      title: 'vip优惠价(元)',
      dataIndex: 'prices.vipDiscount',
      render: (t) => {
        if (t !== undefined) {
          return parseFloat(t).toFixed(2);
        }
      },
    },
    {
      key: 'prices.point',
      title: '积分价',
      dataIndex: 'prices.point',
      align: 'center'
    },
    {
      key: 'prices.pointDiscount',
      title: '积分优惠价',
      dataIndex: 'prices.pointDiscount',
      align: 'center'
    },
    {
      key: 'store',
      title: '库存(件)',
      dataIndex: 'store',
      align: 'center'
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
              title="是否要删除商品"
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
  const syncStore = (id) => {
    // 这里同步库存到redis
    props.dispatch({
      type: 'mallProducts/syncStore',
      id,
    });
  };
  const enableChange = (id, checked) => {
    props.dispatch({
      type: 'mallProducts/changeEnable',
      id,
      body: {
        status: checked,
      },
    });
  };
  const edit = (id, e) => {
    e.preventDefault();
    if (id) {
      jump(`/mall/product/${id}`);
    } else {
      jump('/mall/product');
    }
  };
  const clone = (id, e) => {
    console.log('id', id);
    e.preventDefault();
    props.dispatch({
      type: 'mallProducts/clone',
      id,
    });
  };
  const remove = (id, e) => {
    e.preventDefault();
    props.dispatch({
      type: 'mallProducts/remove',
      id,
    });
  };
  const search = (e) => {
    e.preventDefault();
    props.dispatch({
      type: 'mallProducts/search',
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
      type: 'mallProducts/upState',
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
          创建商品
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
        fetchType="mallProducts/fetch"
        dispatch={props.dispatch}
      />
    </div>
  );
}

function mapStateToProps({ mallProducts }) {
  return mallProducts;
}

export default connect(mapStateToProps)(Form.create()(Products));
