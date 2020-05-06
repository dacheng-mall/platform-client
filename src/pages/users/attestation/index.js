import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import _ from 'lodash';
import {
  Button,
  Switch,
  Modal,
  Row,
  Col,
  Input,
  DatePicker,
  Select,
  Divider,
  Form,
  Popconfirm,
} from 'antd';
import { TableX, FormItem, mapPropsToFields } from '../../../utils/ui';
import styles from '../../qr/list/styles.less';
import styles2 from './index.less';
const { RangePicker } = DatePicker;
class Attestation extends PureComponent {
  state = {
    show: false,
    shwoPassword: false,
    edit: null,
  };
  columns = () => {
    return [
      {
        key: 'name',
        title: '姓名',
        dataIndex: 'apply.name',
      },
      {
        key: 'code',
        title: '工号',
        dataIndex: 'apply.code',
      },
      {
        key: 'institution',
        title: '机构',
        dataIndex: 'apply.institutionName',
      },
      {
        key: 'grade',
        title: '职级',
        dataIndex: 'apply.gradeName',
      },
      {
        key: 'role',
        title: '角色',
        dataIndex: 'apply.role.name',
      },
      {
        key: 'mobile',
        title: '手机号',
        dataIndex: 'apply.mobile',
      },
      {
        key: 'createTime',
        title: '申请日期',
        dataIndex: 'createTime',
        render: (t) => moment(t).format('YYYY-MM-DD HH:mm:ss'),
      },
      {
        key: 'status',
        title: '状态',
        dataIndex: 'status',
        render: (t) => {
          switch (t) {
            case '0': {
              return '待审核';
            }
            case '1': {
              return '审核通过';
            }
            case '2': {
              return '驳回';
            }
            case '3': {
              return '作废';
            }
          }
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
                onClick={this.logs.bind(null, r)}
                size="small"
                shape="circle"
                type="warning"
                icon="file"
                title="审核日志"
              />
              <Divider type="vertical" />
              <Button
                onClick={this.showModal.bind(null, r)}
                size="small"
                shape="circle"
                type="danger"
                icon="edit"
              />
            </div>
          );
        },
        align: 'right',
      },
    ];
  };
  logs = () => {};
  showModal = (data) => {
    let _data = data;
    if (data && !_.isEmpty(data)) {
      _data = _.cloneDeep(_data);
    }
    this.props.dispatch({
      type: 'attestation/upState',
      payload: {
        editor: _data,
      },
    });
  };
  handleOk = () => {
    const { dispatch, form } = this.props;
    form.validateFields((e, v) => {
      if (!e) {
        dispatch({
          type: 'attestation/editUser',
          payload: v,
        });
      }
    });
  };
  handleCancel = () => {
    this.props.dispatch({
      type: 'attestation/upState',
      payload: {
        editor: null,
      },
    });
  };

  excute = (type) => {
    this.props.dispatch({
      type: 'attestation/excute',
      payload: {
        type,
      },
    });
  };
  search = () => {
    this.props.dispatch({
      type: 'attestation/fetch',
    });
  };
  reset = () => {
    this.props.dispatch({
      type: 'attestation/reset',
    });
  };
  change = (e) => {
    this.props.dispatch({
      type: 'attestation/upState',
      payload: {
        keywords: _.trim(e.target.value),
      },
    });
  };
  changeRange = (value) => {
    this.props.dispatch({
      type: 'attestation/upState',
      payload: {
        range: value,
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
        type: 'attestation/fetchInst',
        payload: { name: value },
      });
    }, 300);
  };
  instChange = (value) => {
    this.props.dispatch({
      type: 'attestation/upState',
      payload: {
        institutionId: value,
      },
    });
  };
  queryChange = (type, e) => {
    switch (type) {
      case 'isStaff':
      case 'status': {
        this.props.dispatch({
          type: 'attestation/upState',
          payload: { [type]: e },
        });
        break;
      }
      default: {
        e.preventDefault();
        this.props.dispatch({
          type: 'attestation/upState',
          payload: { [type]: e.target.value },
        });
        break;
      }
    }
  };
  changeReason = (e) => {
    if (e.target.value.trim()) {
      this.props.dispatch({
        type: 'attestation/changeReason',
        payload: {
          reason: e.target.value.trim(),
        },
      });
    }
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Fragment>
        <div className={styles.buttonWrap}>
          <div />
          <div>
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
              <FormItem className={styles.formItem} label="申请人姓名">
                <Input
                  style={{ width: '260px' }}
                  placeholder="请输入姓名关键字"
                  value={this.props.name}
                  onChange={this.queryChange.bind(null, 'name')}
                />
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem className={styles.formItem} label="申请人手机">
                <Input
                  style={{ width: '260px' }}
                  placeholder="请输入手机号"
                  value={this.props.mobile}
                  onChange={this.queryChange.bind(null, 'mobile')}
                />
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem className={styles.formItem} label="审核状态">
                <Select
                  style={{ width: '260px' }}
                  placeholder="请选择状态"
                  value={this.props.status}
                  onChange={this.queryChange.bind(null, 'status')}
                >
                  <Select.Option key={null} value={null}>
                    全部
                  </Select.Option>
                  <Select.Option key="0" value="0">
                    待审核
                  </Select.Option>
                  <Select.Option key="1" value="1">
                    审核通过
                  </Select.Option>
                  <Select.Option key="2" value="2">
                    驳回
                  </Select.Option>
                  <Select.Option key="3" value="3">
                    作废
                  </Select.Option>
                </Select>
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem className={styles.formItem} label="申请时间">
                <RangePicker
                  style={{ width: '260px' }}
                  onChange={this.changeRange}
                  value={this.props.range}
                />
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem className={styles.formItem} label="目标机构">
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
            <Col span={8}>
              <FormItem className={styles.formItem} label="申请内勤">
                <Switch
                  onChange={this.queryChange.bind(null, 'isStaff')}
                  checked={this.props.isStaff}
                />
              </FormItem>
            </Col>
          </Row>
        </div>

        <TableX
          columns={this.columns()}
          dataSource={this.props.data || []}
          pagination={this.props.pagination}
          fetchType="attestation/fetch"
          dispatch={this.props.dispatch}
        />
        <Modal
          visible={!!this.props.editor}
          title="处理认证申请单"
          onCancel={this.handleCancel}
          footer={
            this.props.editor &&
            (this.props.editor.status === '0' ? (
              <div>
                <Button onClick={this.handleCancel}>取消</Button>
                <Button type="danger" onClick={this.excute.bind(null, 'refuse')}>
                  驳回
                </Button>
                <Button type="primary" onClick={this.excute.bind(null, 'accept')}>
                  审核通过
                </Button>
              </div>
            ) : this.props.editor.status === '1' ? (
              <div>
                <Button onClick={this.handleCancel}>取消</Button>
                <Popconfirm
                  title="作废后该经理人的认证状态将被还原"
                  onConfirm={this.excute.bind(null, 'invalid')}
                  okText="作废"
                  cancelText="算了"
                >
                  <Button type="danger">作废</Button>
                </Popconfirm>
                {this.props.editor.apply.isStaff ? (
                  <Button type="primary" onClick={this.excute.bind(null, 'onStaff')}>
                    开启内勤
                  </Button>
                ) : null}
                <Button type="primary" onClick={this.excute.bind(null, 'onStaff')}>
                  开启内勤
                </Button>
              </div>
            ) : this.props.editor.status === '2' ? (
              <div>
                <Button onClick={this.handleCancel}>取消</Button>
                <Button disabled>作废</Button>
                <Button type="primary" onClick={this.excute.bind(null, 'reExcute')}>
                  重审
                </Button>
              </div>
            ) : null)
          }
        >
          {this.props.editor ? (
            <div>
              <div className={styles2['editor-item']}>
                <span>状态:</span>{' '}
                {this.props.editor.status === '0'
                  ? '待审核'
                  : this.props.editor.status === '1'
                  ? '审核通过'
                  : this.props.editor.status === '2'
                  ? '驳回'
                  : this.props.editor.status === '3'
                  ? '作废'
                  : '未知状态'}
              </div>
              <div className={styles2['editor-item']}>
                <span>姓名:</span> {this.props.editor.apply.name}
              </div>
              <div className={styles2['editor-item']}>
                <span>工号:</span> {this.props.editor.apply.code}
              </div>
              <div className={styles2['editor-item']}>
                <span>机构:</span> {this.props.editor.apply.institutionName}
              </div>
              <div className={styles2['editor-item']}>
                <span>职级:</span> {this.props.editor.apply.gradeName}
              </div>
              <div className={styles2['editor-item']}>
                <span>是否内勤:</span> {this.props.editor.apply.gradeName === '内勤' ? '是' : '否'}
              </div>
              <div className={styles2['editor-item']}>
                <span>首次申请时间:</span>
                {moment(this.props.editor.createTime).format('YYYY-MM-DD HH:mm')}
              </div>
              {this.props.editor.status === '0' ? (
                <div className={styles2.reason}>
                  <Input.TextArea
                    placeholder="请输入处理备注, 如果是驳回操作, 尽量写明原因"
                    onChange={this.changeReason}
                    value={this.props.editor.reason}
                  />
                </div>
              ) : null}
            </div>
          ) : null}
        </Modal>
      </Fragment>
    );
  }
}
function mapStateToProps({ attestation }) {
  return attestation;
}
export default connect(mapStateToProps)(Form.create({ mapPropsToFields })(Attestation));
