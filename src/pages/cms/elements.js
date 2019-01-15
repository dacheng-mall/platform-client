import React, { PureComponent } from 'react';
import _ from 'lodash';
import { Table, Button, Switch } from 'antd';
import { connect } from 'dva';
import { jump } from '../../utils';

class CmsElements extends PureComponent {
  columns = [
    {
      key: 'name',
      title: '名称',
      dataIndex: 'name',
    },
    {
      key: 'type',
      title: '元素类型',
      dataIndex: 'type',
      render: (t) => {
        const target = _.find(this.props.dict.elementsTypes, ['code', t]);
        if (target) {
          return target.name;
        }
        return '未知类型';
      },
    },
    {
      key: 'count',
      title: '包含商品数',
      dataIndex: 'count',
      align: 'center',
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
      render: (t, r) => {
        return (
          <div>
            <Button
              onClick={this.edit.bind(null, r)}
              size="small"
              shape="circle"
              type="ghost"
              icon="edit"
            />
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
  edit = (record) => {
    if(record) {
      jump(`/cms/element/${record.id}`);
    } else {
      jump(`/cms/element`);
    }
  };
  remove = (id) => {
    console.log(id);
  };
  render() {
    return (
      <div>
        <Button icon="plus" type="primary" onClick={this.edit.bind(null, null)}>
          新建新的内容元素
        </Button>
        <Table
          rowKey="id"
          size="small"
          columns={this.columns}
          dataSource={this.props.list}
          locale={{ emptyText: '暂无数据' }}
        />
      </div>
    );
  }
}

function mapStateToProps({ elements, app: { dict } }) {
  return { dict, ...elements };
}

export default connect(mapStateToProps)(CmsElements);
