import { connect } from 'dva';
import _ from 'lodash';
import { Button, Switch } from 'antd';
import { TableX } from '../../../utils/ui';
import { jump } from '../../../utils/index';
import styles from './index.less';

const source = window.config.source;

function Prizes(props) {
  const columns = [
    {
      key: 'title',
      title: '名称',
      dataIndex: 'name',
      render: (t, r) => {
        return (
          <div className={styles.title}>
            <div className={styles.text}>
              <div className={styles.name}>{t}</div>
            </div>
          </div>
        );
      },
    },
    {
      key: 'value',
      title: '面值(元)',
      dataIndex: 'value',
      render: (t) => t ? t.toFixed(2) : '--',
    },
    {
      key: 'institution.name',
      title: '关联机构',
      dataIndex: 'institution.name',
      render: (t) => t || '--',
    },
    {
      key: 'maxCount',
      title: '数量上限(件)',
      dataIndex: 'maxCount',
      render: (t) => (t === 0 ? '不限' : t),
      align: 'center',
    },
    {
      key: 'sumPrice',
      title: '金额上限(元)',
      dataIndex: 'sumPrice',
      render: (t) => (t === 0 ? '不限' : t.toFixed(2)),
      align: 'center',
    },
    {
      key: 'products',
      title: '关联商品',
      render: (t, r) => {
        return (
          <div className={styles.products}>
            {_.map(r.products, (product, i) => {
              return (
                <div className={styles.listProduct} key={`${r.id}_${i}`}>
                  <img src={`${source}${product.image}`} />
                  <div>{product.showName}</div>
                  <div>￥{product.showPrice}</div>
                </div>
              );
            })}
          </div>
        );
      },
    },
    {
      key: 'status',
      title: '状态',
      dataIndex: 'status',
      render: (t) => {
        return <Switch checked={t} size="small" />;
      },
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
    if (id) {
      jump(`/convert/prize/${id}`);
    } else {
      jump('/convert/prize');
    }
  };
  return (
    <div>
      <Button icon="plus" type="primary" onClick={edit.bind(null, null)}>
        新建礼包
      </Button>
      <TableX
        columns={columns}
        dataSource={props.data || []}
        pagination={props.pagination || {}}
        fetchType="prizes/fetch"
        dispatch={props.dispatch}
      />
    </div>
  );
}
function mapStateToProps({ prizes }) {
  return prizes;
}
export default connect(mapStateToProps)(Prizes);
