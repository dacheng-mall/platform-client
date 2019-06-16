import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import _ from 'lodash';
import { Table, Button, Switch, Modal, Icon, Input, Divider, Popover, Popconfirm } from 'antd';
import Editor from './editor';
import { goBack } from '../../../utils';
import styles from '../index.less';

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
      key: 'sn',
      title: '序号',
      dataIndex: 'sn',
    },
    {
      key: 'type',
      title: '类型',
      dataIndex: 'type.name',
    },
    {
      key: 'customer',
      title: '客户',
      dataIndex: 'user',
      render: (t) => {
        if (t.id) {
          return (
            <div>
              {t.name}
              <br />
              {t.bindTime}
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
      render: (t) => {
        return (
          <div>
            <Popover content={<img src="" />} placement="left" title="" trigger="click">
              <Button
                onClick={this.previewQr.bind(null, t)}
                size="small"
                shape="circle"
                type="primary"
                icon="qrcode"
                title="预览二维码"
              />
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
  search = (value) => {
    this.props.dispatch({
      type: 'qrList/searchByKeywords',
      payload: value,
    });
  };
  reset = () => {
    this.props.dispatch({
      type: 'qrList/searchByKeywords',
      payload: '',
    });
  };
  change = (e) => {
    this.props.dispatch({
      type: 'qrList/upState',
      payload: {
        keywords: _.trim(e.target.value),
      },
    });
  };
  previewQr = (id) => {
    console.log('预览二维码', id);
  };
  clearQr = (id) => {
    console.log('还原', id)
  }
  render() {
    return (
      <Fragment>
        <div className={styles.tableToolBar}>
          <Button onClick={goBack} type="default">
            <Icon type="arrow-left" />
            返回
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
                type: 'qrType/fetch',
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
