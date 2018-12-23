import React, { PureComponent } from "react";
import { connect } from "dva";
import { Table, Switch, Button } from "antd";
import { jump } from "../../utils";
import styles from "./list.less";

class List extends PureComponent {
  columns = [
    {
      key: 'name',
      title: '名称',
      dataIndex: 'name',
      render: (t, r) => {
        return (
          <div className={styles.title}>
            <img src={r.mainImage} title={t} />
            <div className={styles.text}>
              <div className={styles.name}>{t}</div>
              {r.category}
            </div>
          </div>
        );
      }
    },
    {
      key: 'price',
      title: '单价(元)',
      dataIndex: 'price',
      align: 'center',
    },
    {
      key: 'status',
      title: '状态',
      dataIndex: 'status',
      render(t) {
        const change = checked => {
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
            <Button onClick={this.edit.bind(null, t)} size="small" shape="circle" type="ghost" icon="edit" />
            <Button onClick={this.remove.bind(null, t)} size="small" shape="circle" type="danger" icon="delete" />
          </div>
        );
      },
      align: 'right',
    },
  ]
  edit = (id) => {
    console.log(id);
    jump(`/products/detail/${id}`);
  }
  remove = () => {}
  render() {
    return (
      <div className={styles.wrap}>
        <Table
          rowKey="id"
          columns={this.columns}
          dataSource={this.props.list}
          locale={{ emptyText: '暂无数据' }}
        />
      </div>
    )
  }
}

function mapStateToProps({products}){
  return products;
}

export default connect(mapStateToProps)(List);
