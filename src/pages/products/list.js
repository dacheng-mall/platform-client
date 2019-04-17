import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Table, Switch, Button, Divider, Modal } from 'antd';
import { jump } from '../../utils';
import styles from './list.less';

const source = window.config.source;

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
      render: (t) => <div className={styles.price}>{t ? t.toFixed(2) : '未知'}</div>,
    },
    {
      key: 'status',
      title: '状态',
      dataIndex: 'status',
      render: (t, r) => {
        return (
          <Switch size="small" checked={t === 1} onChange={this.changeStatus.bind(null, r.id)} />
        );
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
  changeStatus = (id, status) => {
    this.props.dispatch({
      type: 'products/setStatus',
      id,
      status,
    });
  };
  remove = (id, e) => {
    e.preventDefault();
    Modal.confirm({
      title: '是否删除商品?',
      onOk: () => {
        this.props.dispatch({
          type: 'products/remove',
          id,
        });
      },
    });
  };
  render() {
    const showAddBtn = ((type, institutionId) => {
      if(type === 'self' && !institutionId) {
        return true;
      }
      if(type === 'third' && institutionId) {
        return true;
      }
      return false;
    })(this.props.institutionId, this.props.user.institutionId)
    return (
      <div className={styles.wrap}>
        {showAddBtn ? <Button type="primary" onClick={this.edit.bind(null, false)} icon="plus">
          添加商品
        </Button> : null}
        <Table
          rowKey="id"
          size="small"
          columns={this.columns}
          dataSource={this.props.data}
          locale={{ emptyText: '暂无数据' }}
          pagination={{
            pageSize: this.props.pagination.pageSize,
            total: this.props.pagination.total,
            current: this.props.pagination.page,
            onChange: (page, pageSize) => {
              this.props.dispatch({
                type: 'products/fetch',
                payload: {page, pageSize}
              })
            }
          }}
        />
      </div>
    );
  }
}

function mapStateToProps({ products, app }) {
  return {...products, user: app.user};
}

export default connect(mapStateToProps)(List);
