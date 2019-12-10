import { connect } from 'dva';
import moment from 'moment';
import { Button } from 'antd';
import { TableX } from '../../../utils/ui';
import { jump } from '../../../utils';
import styles from './styles.less';

function Logistics(props) {
  const columns = [
    {
      key: 'code',
      title: '订单号',
      dataIndex: 'code',
    },
    {
      key: 'name',
      title: '名称',
      dataIndex: 'name',
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
    },
    {
      key: 'status',
      title: '状态',
      dataIndex: 'status',
      render: (t, r) => {
        switch (t) {
          case 'free': {
            return '无主';
          }
          case 'expired': {
            return '已过期';
          }
          case 'binded': {
            return '已领取';
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
  const edit = () => {
    jump('/trade/logistics-template/editor');
  };
  return (
    <div>
      <div className={styles.top}>
        <Button icon="plus" type="primary" onClick={edit.bind(null, true)}>
          添加物流模板
        </Button>
        <div className={styles.searcher}>
          {/* <Form layout="inline">
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
          </Form> */}
        </div>
      </div>
      <TableX
        columns={columns}
        dataSource={props.data || []}
        pagination={props.pagination || {}}
        fetchType="logistics/fetch"
        dispatch={props.dispatch}
      />
    </div>
  );
}
function mapStateToProps({ logistics }) {
  return logistics;
}
export default connect(mapStateToProps)(Logistics);
