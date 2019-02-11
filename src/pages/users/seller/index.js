import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Table,
  Button,
  Icon,
  Switch,
  Modal,
  Form,
  Input,
  Radio,
  Checkbox,
  Divider,
} from 'antd';
import { FormItem, mapPropsToFields } from '../../../utils/ui';
class Seller extends PureComponent {
  state = {
    show: false,
    shwoPassword: false,
  };
  columns = () => {
    return [
      {
        key: 'avatar',
        title: '头像',
        dataIndex: 'avatar',
        render: (t) => {
          return <img style={{width: '48px'}} src={t} />
        }
      },
      {
        key: 'name',
        title: '姓名',
        dataIndex: 'name',
      },
      {
        key: 'status',
        title: '状态',
        dataIndex: 'status',
        render: (t, {id, username}) => {
          const change = (checked) => {
            this.props.dispatch({
              type: 'admin/changeStatus',
              payload: { id, username, status: checked ? 1 : 0 },
            });
          };
          return <Switch size="small" checked={t === 1} onChange={change} />;
        },
        align: 'center',
      },
      {
        key: 'operator',
        title: '操作',
        dataIndex: 'id',
        render: (t, r) => {
          return (
            <div>
              <Button
                onClick={this.remove.bind(null, t, r)}
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
  };
  remove = (id, data, e) => {
    e.preventDefault();
    Modal.confirm({
      title: '是否删除用户?',
      onOk: () => {
        this.props.dispatch({
          type: 'seller/remove',
          id,
        });
      },
    });
  };
  render() {
    return (
      <div>
        <Table
          rowKey="id"
          columns={this.columns()}
          dataSource={this.props.data || []}
          locale={{ emptyText: '暂无数据' }}
        />
      </div>
    );
  }
}
function mapStateToProps({ seller }) {
  return seller;
}
export default connect(mapStateToProps)(Seller);
