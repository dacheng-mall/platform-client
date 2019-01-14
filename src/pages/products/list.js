import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Table, Switch, Button, Divider } from 'antd';
import { jump } from '../../utils';
import styles from './list.less';

const { source } = require('../../../setting');

class List extends PureComponent {
  columns = [
    {
      key: 'title',
      title: '名称',
      dataIndex: 'title',
      render: (t, r) => {
        return (
          <div className={styles.title}>
            <img src={`${source}${r.mainImageUrl}`} title={t} alt="" className={styles.mainImage} />
            <div className={styles.text}>
              <div className={styles.name}>{t}</div>
            </div>
          </div>
        );
      },
    },
    {
      key: 'category',
      title: '分类',
      dataIndex: 'category.name',
      align: 'center',
    },
    {
      key: 'price',
      title: '单价(元)',
      dataIndex: 'price',
      align: 'center',
      render: (t) => <div className={styles.price}>{t.toFixed(2)}</div>,
    },
    {
      key: 'status',
      title: '状态',
      dataIndex: 'status',
      render(t) {
        const change = (checked) => {
          console.log(checked);
        };
        return <Switch size="small" defaultChecked={t === 1} onChange={change} />;
      },
      align: 'center',
    },
    {
      key: 'operator',
      title: '操作',
      dataIndex: 'id',
      render: (t) => {
        return (
          <div>
            <Button
              onClick={this.edit.bind(null, t)}
              size="small"
              shape="circle"
              type="ghost"
              icon="edit"
            />
            <Divider type="vertical" />
            <Button
              onClick={this.remove.bind(null, t)}
              size="small"
              shape="circle"
              type="danger"
              icon="delete"
            />
          </div>
        );
      },
      align: 'right',
    },
  ];
  edit = (id) => {
    if (id) {
      jump(`/products/detail/${id}`);
    } else {
      jump(`/products/detail`);
    }
  };
  remove = () => {};
  render() {
    return (
      <div className={styles.wrap}>
        <Button type="primary" onClick={this.edit.bind(null, false)} icon="plus">
          添加商品
        </Button>
        <Table
          rowKey="id"
          size="small"
          columns={this.columns}
          dataSource={this.props.data}
          locale={{ emptyText: '暂无数据' }}
        />
      </div>
    );
  }
}

function mapStateToProps({ products }) {
  return products;
}

export default connect(mapStateToProps)(List);
