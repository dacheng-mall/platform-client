import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import _ from 'lodash';
import {
  Table,
  Button,
  Alert,
  Select,
  Icon,
  InputNumber,
  Divider,
  Popover,
  Popconfirm,
} from 'antd';
import Editor from './editor';
import { goBack } from '../../../utils';
import styles from '../index.less';
import BatchInfo from './batchInfo';

/* 

{
  pagination: {
    page,
    pageSize,
    total,
    pageCount,
  },
  data: [
    {
      id,
      sn,
      autoId,
      batchId,
      typeId,     // 
      type: { // 根据码类型id获取码类型数据
        id,
        name,
        fields,
        template,
      },
      user: {
        id: '',
        name: '',
        avatarUrl: '',
        bandTime: '',
      },
      salesman: {
        id: '',
        name: '',
        institutionId: '',
        institutionName: '',
        gradeId: '',
        gradeName: '',
        bandTime: '', 
      },
      fields,
      createTime,
      lastmodifyTime,
      url,
      status
    }
  ]
}
*/
class QrList extends PureComponent {
  columns = [
    {
      key: 'autoId',
      title: '序号',
      dataIndex: 'autoId',
    },
    {
      key: 'customer',
      title: '客户',
      dataIndex: 'custom',
      render: (t, r) => {
        if (t.id) {
          return (
            <div>
              {t.name}
              <br />
              {r.userBindTime}
            </div>
          );
        }
        return '未被领取';
      },
    },
    {
      key: 'buyer',
      title: '业务员',
      dataIndex: 'salesman',
      render: (t) => {
        if (t.id) {
          return (
            <div>
              {t.name}[{t.gradeName}]
              <br />
              {t.institutionName}
            </div>
          );
        }
        return '未绑定业务员';
      },
    },
    {
      key: 'fields',
      title: '绑定信息',
      dataIndex: 'fields',
      render: (t, r) => {
        if (t) {
          return '--';
        }
        return '未采集信息';
      },
    },
    {
      key: 'operator',
      title: '操作',
      dataIndex: 'id',
      render: (t, r) => {
        return (
          <div>
            <Popover
              content={<img style={{ width: '280px' }} src={`${this.props.imgPrefix}${r.url}`} />}
              placement="left"
              title=""
              trigger="click"
            >
              <Button size="small" shape="circle" type="primary" icon="qrcode" title="预览二维码" />
            </Popover>
            <Divider type="vertical" />
            <Popconfirm
              placement="top"
              okText="还原"
              okType="danger"
              title="是否还原二维码?"
              content="是否还原二维码?"
              onConfirm={this.clearQr.bind(null, t)}
            >
              <Button size="small" shape="circle" type="danger" icon="reload" title="还原二维码" />
            </Popconfirm>
          </div>
        );
      },
      align: 'right',
    },
  ];
  search = () => {
    this.props.dispatch({
      type: 'qrList/fetch'
    });
  };
  reset = () => {
    this.props.dispatch({
      type: 'qrList/reset'
    });
  };
  change = (type, number) => {
    console.log(number, type)
    this.props.dispatch({
      type: 'qrList/upState',
      payload: {
        [type]: number,
      },
    });
  };
  clearQr = (id) => {
    this.props.dispatch({
      type: 'qrList/clearQr',
      id,
    });
  };
  changeBindStatus = (value) => {
    this.props.dispatch({
      type: 'qrList/upState',
      payload: {
        bindStatus: value,
      },
    });
  };
  render() {
    return (
      <Fragment>
        <div className={styles.tableToolBar}>
          <Button onClick={goBack} type="default">
            <Icon type="arrow-left" />
            返回
          </Button>
          <div className={styles.tableToolBar}>
            <Select
              style={{ width: '200px', marginRight: '10px' }}
              placeholder="请选择绑定状态"
              allowClear
              onChange={this.changeBindStatus}
              value={this.props.bindStatus}
            >
              <Select.Option key="none">未绑定任何数据</Select.Option>
              <Select.Option key="salesman">已绑定业务员</Select.Option>
              <Select.Option key="user">已绑定客户</Select.Option>
              <Select.Option key="both">全部绑定</Select.Option>
            </Select>

            <InputNumber
              style={{ width: 100 }}
              placeholder="起始序号"
              min={1}
              max={this.props.batch && this.props.batch.total || 1}
              onChange={this.change.bind(null, 'from')}
              value={this.props.from}
            />
            <span>到</span>
            <InputNumber
              style={{ width: 100 }}
              placeholder="结束序号"
              min={this.props.from}
              max={this.props.batch && this.props.batch.total || 1}
              onChange={this.change.bind(null, 'to')}
              value={this.props.to}
            />
            <Button onClick={this.search} icon="search" type="primary">
              查询
            </Button>
            <Button onClick={this.reset}>重置</Button>
          </div>
        </div>
        <div style={{ marginTop: '10px' }}>
          <Alert
            message="批次信息"
            description={<BatchInfo batch={this.props.batch} type={this.props.type} />}
            type="success"
          />
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
                type: 'qrList/fetch',
                payload: { page, pageSize },
              });
            },
          }}
        />
      </Fragment>
    );
  }
}
function mapStateToProps({ qrList }) {
  return qrList;
}
export default connect(mapStateToProps)(QrList);
