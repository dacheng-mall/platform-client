import { connect } from 'dva';
import _ from 'lodash';
import moment from 'moment';
import { Button } from 'antd';
import { TableX } from '../../../utils/ui';
import { jump } from '../../../utils';
import styles from './styles.less';

function Logistics(props) {
  const columns = [
    {
      key: 'name',
      title: '名称',
      dataIndex: 'name',
    },
    {
      key: 'respond',
      title: '发货时间',
      dataIndex: 'respond.name',
    },
    {
      key: 'origin',
      title: '发货地',
      dataIndex: 'origin.name',
    },
    {
      key: 'isFree',
      title: '包邮',
      dataIndex: 'isFree',
      render: (t) => (t ? '是' : '否'),
    },
    {
      key: 'billingType',
      title: '计价方式',
      dataIndex: 'billingType',
      render: (t) => {
        switch (t) {
          case 'count': {
            return '按件数';
          }
          case 'weight': {
            return '按重量';
          }
          case 'volume': {
            return '按体积';
          }
          default: {
            return '未知';
          }
        }
      },
    },
    {
      key: 'expiredTime',
      title: '创建时间',
      dataIndex: 'createTime',
      render: (t) => moment(t).format('YYYY-MM-DD'),
    },
    {
      key: 'operator',
      title: '操作',
      render: (t, r) => {
        return (
          <div>
            <Button
              icon="edit"
              type="primary"
              shape="circle"
              size="small"
              onClick={edit.bind(null, r.id)}
            />
          </div>
        );
      },
    },
  ];
  const edit = (id) => {
    if (_.isString(id)) {
      jump(`/trade/logistics-template/editor/${id}`);
    } else {
      jump('/trade/logistics-template/editor');
    }
  };
  return (
    <div>
      <div className={styles.top}>
        <Button icon="plus" type="primary" onClick={edit}>
          添加物流模板
        </Button>
        <div className={styles.searcher}></div>
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
