import { connect } from 'dva';
import moment from 'moment';
import { Button } from 'antd';
import { TableX } from '../../../utils/ui';
import styles from './styles.less';

function Companies(props) {
  const columns = [
    {
      key: 'name',
      title: '名称',
      dataIndex: 'name',
    },
    {
      key: 'typeName',
      title: '类型',
      dataIndex: 'typeName',
    },
    {
      key: 'code',
      title: '编码',
      dataIndex: 'code',
    },
    {
      key: 'status',
      title: '状态',
      dataIndex: 'status',
      render: (t) => (t ? '正常' : '停用'),
    },
    {
      key: 'createTime',
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
    // if (_.isString(id)) {
    //   jump(`/trade/logistics-template/editor/${id}`);
    // } else {
    //   jump('/trade/logistics-template/editor');
    // }
  };
  return (
    <div>
      <div className={styles.top}>
        <Button icon="plus" type="primary" onClick={edit}>
          添加物流公司
        </Button>
        <div className={styles.searcher}></div>
      </div>
      <TableX
        columns={columns}
        dataSource={props.data || []}
        pagination={props.pagination || {}}
        fetchType="logisticCompanies/fetch"
        dispatch={props.dispatch}
      />
    </div>
  );
}
function mapStateToProps({ logisticCompanies }) {
  return logisticCompanies;
}
export default connect(mapStateToProps)(Companies);
