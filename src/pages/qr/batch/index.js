import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import _ from 'lodash';
import {
  Table,
  Button,
  Switch,
  Modal,
  Icon,
  Input,
  Divider,
  InputNumber,
  message,
  Popconfirm,
} from 'antd';
import Editor from './editor';
import { jump } from "../../../utils";
import styles from '../index.less';

class QrBatch extends PureComponent {
  state = {
    plus: '',
    plusNumber: 1,
  };
  columns = [
    {
      key: 'name',
      title: '批次名称',
      dataIndex: 'name',
      render: (t, r) => {
        return <a onClick={this.qrList.bind(null, r.id)}>{t}</a>
      }
    },
    {
      key: 'type',
      title: '码类型',
      dataIndex: 'typeName',
    },
    {
      key: 'total',
      title: '数量',
      dataIndex: 'total',
      render: (t, r) => {
        return (
          <div>
            {t}{' '}
            <Button
              onClick={this.showPlus.bind(null, r.id)}
              title="追加"
              size="small"
              shape="circle"
              icon="plus"
              type="ghost"
            />
          </div>
        );
      },
    },
    {
      key: 'linked',
      title: '关联实体',
      render: (t, r) => {
        const res = [];
        if (r.institutionId && r.institutionName) {
          res.push({ label: '机构', name: r.institutionName });
        }
        if (r.productId && r.productName) {
          res.push({ label: '商品', name: r.productName });
        }
        if (r.activityId && r.activityName) {
          res.push({ label: '活动', name: r.activityName });
        }
        if (res.length > 0) {
          return _.map(res, (item, i) => (
            <div key={`${item.label}_${r.id}`}>
              [{item.label}]{item.name}
            </div>
          ));
        }
      },
    },
    {
      key: 'status',
      title: '状态',
      dataIndex: 'status',
      render: (t, { id }) => {
        const change = (checked) => {
          this.props.dispatch({
            type: 'qrBatch/changeStatus',
            payload: { id, status: checked ? 1 : 0 },
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
              onClick={this.update.bind(null, r)}
              size="small"
              shape="circle"
              type="primary"
              icon="edit"
            />
            <Divider type="vertical" />
            <Button
              onClick={this.generator.bind(null, t)}
              size="small"
              shape="circle"
              type="default"
              icon="qrcode"
            />
            <Divider type="vertical" />
            <Popconfirm
              okText="删除"
              okType="danger"
              icon={<Icon type="delete" />}
              title="是否删除批次数据?"
              onConfirm={this.remove.bind(null, t)}
            >
              <Button
                size="small"
                shape="circle"
                type="danger"
                icon="delete"
              />
            </Popconfirm>
          </div>
        );
      },
      align: 'right',
    },
  ];
  showModal = (payload) => {
    this.props.dispatch({
      type: 'qrBatch/initEditor',
      payload,
    });
  };
  search = (value) => {
    this.props.dispatch({
      type: 'qrBatch/searchByKeywords',
      payload: value,
    });
  };
  reset = () => {
    this.props.dispatch({
      type: 'qrBatch/searchByKeywords',
      payload: '',
    });
  };
  change = (e) => {
    this.props.dispatch({
      type: 'qrBatch/upState',
      payload: {
        keywords: _.trim(e.target.value),
      },
    });
  };
  qrList = (id) => {
    console.log(id);
    jump(`/qr/list/${id}`)
  }
  update = (r) => {
    this.showModal(r);
  };
  remove = (t) => {
    message.error('调删除接口', 3);
  };
  showPlus = (t) => {
    console.log(t);
    this.setState({
      plus: t,
    });
  };
  plus = () => {
    console.log(this.state);
  };
  generator = (id) => {
    message.success('调预生成二维码的接口, 改编该批次的生成状态', 10);
  };
  render() {
    const initNewItem = {
      name: '',
      description: '',
      status: 1,
    };
    return (
      <Fragment>
        <div className={styles.tableToolBar}>
          <Button onClick={this.showModal.bind(null, initNewItem)} type="primary">
            <Icon type="plus" />
            添加批次
          </Button>
          <div className={styles.tableToolBar}>
            <Input.Search
              style={{ width: 320 }}
              onSearch={this.search}
              placeholder="请输入码类型名称关键字查询"
              onChange={this.change}
              value={this.props.keywords}
            />
            <Button onClick={this.reset}>重置</Button>
          </div>
        </div>
        <Table
          rowKey="id"
          columns={this.columns}
          dataSource={this.props.data || []}
          locale={{ emptyText: '暂无数据' }}
          pagination={{
            pageSize: this.props.pagination.pageSize,
            total: this.props.pagination.total,
            current: this.props.pagination.page,
            onChange: (page, pageSize) => {
              this.props.dispatch({
                type: 'qrBatch/fetch',
                payload: { page, pageSize },
              });
            },
          }}
        />
        <Editor editor={this.props.editor} />
        <Modal
          visible={!!this.state.plus}
          onCancel={() => this.setState({ plus: '', plusNumber: 1 })}
          onOk={this.plus}
          title="追加批次码数量"
        >
          <div>
            <div>请输入追加数量</div>
            <InputNumber
              value={this.state.plusNumber}
              min={1}
              onChange={(plusNumber) => this.setState({ plusNumber })}
            />
          </div>
        </Modal>
      </Fragment>
    );
  }
}
function mapStateToProps({ qrBatch }) {
  return qrBatch;
}
export default connect(mapStateToProps)(QrBatch);
