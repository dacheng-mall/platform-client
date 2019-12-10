import { connect } from 'dva';
import moment from 'moment';
import { TableX } from '../../../utils/ui';

function Orders(props) {
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
      key: 'status',
      title: '状态',
      dataIndex: 'status',
      render: (t) => {
        switch (t) {
          case 'free': {
            return '无主';
          }
          case 'expired': {
            return '已过期';
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
  return (
    <div>
      <TableX
        columns={columns}
        dataSource={props.data || []}
        pagination={props.pagination || {}}
        fetchType="tickets/fetch"
        dispatch={props.dispatch}
      />
    </div>
  );
}
function mapStateToProps({ app, orders }) {
  return { app, ...orders };
}
export default connect(mapStateToProps)(Orders);
