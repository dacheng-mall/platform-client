import React, { PureComponent, Fragment } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import _ from 'lodash';
import {
  Button,
  Alert,
  Select,
  Icon,
  InputNumber,
  Divider,
  Popover,
  Popconfirm,
  DatePicker,
  Col,
  Row,
} from 'antd';
import { goBack } from '../../../utils';
import { FormItem, TableX } from '../../../utils/ui';
// import styles from '../index.less';
import styles from './styles.less';
import BatchInfo from './batchInfo';
const { RangePicker } = DatePicker;

class QrList extends PureComponent {
  componentWillUnmount() {
    this.props.dispatch({
      type: 'clear',
    });
  }
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
              {moment(r.userBindTime).format('YYYY-MM-DD HH:mm:ss')}
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
      title: '采集信息',
      dataIndex: 'fields',
      render: (t, r) => {
        if (t) {
          const res = JSON.parse(t);
          let txt = [];
          for (let key in res) {
            const value = res[key];
            switch (key) {
              case 'name': {
                txt.push(<div key={key}>姓名: {value}</div>);
                break;
              }
              case 'mobile': {
                txt.push(<div key={key}>手机: {value}</div>);
                break;
              }
              default: {
                txt.push(
                  <div key={key}>
                    {key}: {value}
                  </div>,
                );
                break;
              }
            }
          }
          return txt;
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
  exportCsv = () => {
    this.props.dispatch({
      type: 'qrList/fetch',
      payload: 'exportCsv',
    });
  };
  search = () => {
    this.props.dispatch({
      type: 'qrList/fetch',
    });
  };
  reset = () => {
    this.props.dispatch({
      type: 'qrList/reset',
    });
  };
  change = (type, number) => {
    console.log(number, type);
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
  changeRange = (value) => {
    this.props.dispatch({
      type: 'qrList/upState',
      payload: {
        range: value,
      },
    });
  };
  changeGetRange = (value) => {
    console.log(value);
    this.props.dispatch({
      type: 'qrList/upState',
      payload: {
        getRange: value,
      },
    });
  };
  typeChange = (value) => {
    console.log(value);
    this.props.dispatch({
      type: 'qrList/upState',
      payload: {
        typeId: value,
      },
    });
  };
  fetchTimer = null;
  fetchInst = (value) => {
    console.log(value);
    if (!_.trim(value)) {
      return;
    }
    if (this.fetchTimer) {
      clearTimeout(this.fetchTimer);
    }
    this.fetchTimer = setTimeout(() => {
      this.props.dispatch({
        type: 'qrList/fetchInst',
        payload: { name: value },
      });
    }, 300);
  };
  instChange = (value) => {
    this.props.dispatch({
      type: 'qrList/upState',
      payload: {
        institutionId: value,
      },
    });
  };
  render() {
    return (
      <Fragment>
        <div className={styles.buttonWrap}>
          <div>
            {this.props.isRoot && this.props.batchId ? (
              <Button onClick={goBack} type="default">
                <Icon type="arrow-left" />
                返回
              </Button>
            ) : null}
          </div>
          <div>
            <Button className={styles.moBtn} onClick={this.exportCsv} icon="download" type="danger">
              导出EXCEL
            </Button>
            <Button className={styles.moBtn} onClick={this.search} icon="search" type="primary">
              查询
            </Button>
            <Button className={styles.moBtn} onClick={this.reset}>
              重置
            </Button>
          </div>
        </div>
        <div className={styles.tableToolBar}>
          <Row gutter={24} style={{ width: '100%' }}>
            <Col span={8}>
              <FormItem className={styles.formItem} label="生成时间段">
                <RangePicker
                  style={{ width: '260px' }}
                  onChange={this.changeRange}
                  value={this.props.range}
                />
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem className={styles.formItem} label="领取时间段">
                <RangePicker
                  style={{ width: '260px' }}
                  onChange={this.changeGetRange}
                  value={this.props.getRange}
                />
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem className={styles.formItem} label="发放状态">
                <Select
                  style={{ width: '260px' }}
                  placeholder="请选择绑定状态"
                  allowClear
                  onChange={this.changeBindStatus}
                  value={this.props.bindStatus}
                >
                  <Select.Option key="salesman">已绑定业务员</Select.Option>
                  <Select.Option key="user">客户已领取</Select.Option>
                </Select>
              </FormItem>
            </Col>
            {this.props.isRoot && this.props.batchId ? (
              <Col span={8}>
                <FormItem className={styles.formItem} label="序号区间">
                  <InputNumber
                    style={{ width: 100 }}
                    placeholder="起始序号"
                    min={1}
                    max={(this.props.batch && this.props.batch.total) || 1}
                    onChange={this.change.bind(null, 'from')}
                    value={this.props.from}
                  />
                  <span>到</span>
                  <InputNumber
                    style={{ width: 100 }}
                    placeholder="结束序号"
                    min={this.props.from}
                    max={(this.props.batch && this.props.batch.total) || 1}
                    onChange={this.change.bind(null, 'to')}
                    value={this.props.to}
                  />
                </FormItem>
              </Col>
            ) : null}
            {!this.props.isRoot || !this.props.batchId ? (
              <Col span={8}>
                <FormItem className={styles.formItem} label="码类型">
                  <Select
                    placeholder="请选择码类型"
                    onChange={this.typeChange}
                    allowClear
                    style={{ width: '260px' }}
                  >
                    {_.map(this.props.types, (type, i) => (
                      <Select.Option value={type.id} key={type.id}>
                        {type.name}
                      </Select.Option>
                    ))}
                  </Select>
                </FormItem>
              </Col>
            ) : null}
            <Col span={8}>
              <FormItem className={styles.formItem} label="机构">
                <Select
                  showSearch
                  allowClear
                  placeholder="请选择机构"
                  style={{ width: '260px' }}
                  value={this.props.institutionId}
                  showArrow={false}
                  filterOption={false}
                  onSearch={this.fetchInst}
                  onChange={this.instChange}
                >
                  {_.map(this.props.institutions, (inst, i) => (
                    <Select.Option value={inst.id} key={inst.id}>
                      {inst.name}
                    </Select.Option>
                  ))}
                </Select>
              </FormItem>
            </Col>
          </Row>
        </div>
        {this.props.isRoot && this.props.batchId ? (
          <div>
            <Alert
              message="批次信息"
              description={<BatchInfo batch={this.props.batch} type={this.props.type} />}
              type="success"
            />
          </div>
        ) : null}
        <TableX
          columns={this.columns}
          dataSource={this.props.data || []}
          pagination={this.props.pagination}
          fetchType="qrList/fetch"
          dispatch={this.props.dispatch}
        />
        {/* <Table
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
        /> */}
      </Fragment>
    );
  }
}
function mapStateToProps({ qrList }) {
  return qrList;
}
export default connect(mapStateToProps)(QrList);
