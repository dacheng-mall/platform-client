import { Fragment, useState } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import _ from 'lodash';
import {
  Button,
  Row,
  Col,
  DatePicker,
  Select,
  Form,
  Input,
  InputNumber,
  Cascader,
  Divider,
  Popconfirm,
  Icon,
  Switch,
  Modal,
} from 'antd';
import { TableX, FormItem } from '../../../utils/ui';
import styles from './index.less';

const { RangePicker } = DatePicker;

function Badge(props) {
  const columns = [
    {
      key: 'gSn',
      title: '序号',
      dataIndex: 'gSn',
      align: 'center',
    },
    {
      key: 'name',
      title: '名称',
      dataIndex: 'name',
      align: 'left',
    },
    {
      key: 'code',
      title: '批号',
      dataIndex: 'code',
      align: 'left',
    },
    {
      key: 'sn',
      title: '批序号',
      dataIndex: 'sn',
      align: 'center',
    },
    {
      key: 'made',
      title: '制作状态',
      dataIndex: 'made',
      render: function(t, r) {
        switch (t) {
          case 'waiting': {
            return '待制作';
          }
          case 'making': {
            return '制作中';
          }
          case 'done': {
            return '已制作';
          }
          default: {
            return '未知状态';
          }
        }
      },
    },
    {
      key: 'status',
      title: '绑定状态',
      dataIndex: 'status',
      render: function(t, r) {
        switch (t) {
          case 'free': {
            return '空闲';
          }
          case 'binded': {
            return '已绑定';
          }
          default: {
            return '未知状态';
          }
        }
      },
    },
    {
      key: 'user.name',
      title: '姓名',
      dataIndex: 'user.name',
      align: 'center',
    },
    {
      key: 'user.mobile',
      title: '电话',
      dataIndex: 'user.mobile',
      align: 'center',
    },
    {
      key: 'user.nickName',
      title: '昵称',
      dataIndex: 'user.nickName',
      align: 'center',
    },
    {
      key: 'user.idCard',
      title: '身份证',
      dataIndex: 'user.idCard',
      align: 'center',
    },
    {
      key: 'user.code',
      title: '工号',
      dataIndex: 'user.code',
      align: 'center',
    },
    {
      key: 'user.gradeName',
      title: '职级',
      dataIndex: 'user.gradeName',
      align: 'center',
    },
    {
      key: 'createTime',
      title: '生成时间',
      dataIndex: 'createTime',
      render: function(t) {
        return moment(t).format('YYYY-MM-DD HH:mm:ss');
      },
    },
    {
      key: 'enable',
      title: '可用状态',
      dataIndex: 'enable',
      render: function(t, r) {
        return (
          <div>
            <Switch
              checked={t}
              disabled={props.loading}
              onChange={enableChange.bind(null, r.id)}
              checkedChildren="启"
              unCheckedChildren="停"
            />
          </div>
        );
      },
    },
    {
      key: 'opt',
      title: '操作',
      dataIndex: 'id',
      render: function(t, r) {
        return (
          <div>
            <Button icon="edit" type="primary" onClick={edit.bind(null, 'edit', t)} />
            <Divider type="vertical" />
            {r.status !== 'free' ? (
              <Popconfirm
                placement="top"
                okText="解除绑定"
                okType="danger"
                title="是否解除绑定?"
                content="一旦解除绑定无还原?"
                onConfirm={reset.bind(null, t)}
              >
                <Button title="解除绑定" icon="stop" type="danger" />
              </Popconfirm>
            ) : (
              <Button title="解除绑定" icon="stop" type="danger" disabled />
            )}
          </div>
        );
      },
    },
  ];
  const queryChange = (type, e) => {
    let value;
    switch (type) {
      case 'name':
      case 'userName':
      case 'userCode':
      case 'mobile':
      case 'code':
      case 'sn': {
        value = { [type]: e.target.value };
        break;
      }
      case 'range':
      case 'status':
      case 'made':
      case 'enable': {
        value = { [type]: e };
        break;
      }
    }
    props.dispatch({
      type: 'badge/upState',
      payload: {
        query: {
          ...props.query,
          ...value,
        },
      },
    });
  };
  const enableChange = (id, e) => {
    props.dispatch({
      type: 'badge/update',
      payload: {
        id,
        enable: e,
      },
    });
  };
  const getCsvDetail = () => {
    props.dispatch({
      type: 'badge/getCsvDetail',
    });
  };
  const edit = (visible, id) => {
    props.dispatch({
      type: 'badge/upState',
      payload: {
        visible,
        id,
      },
    });
  };
  const reset = (id) => {
    props.dispatch({
      type: 'badge/update',
      payload: {
        id,
        status: 'free',
        user: null,
      },
    });
  };
  const onOk = (e) => {
    e.persist();
    const { validateFields } = props.form;
    const { visible } = props;
    validateFields((errors, values) => {
      if (!errors) {
        const _values = _.cloneDeep(values);
        if (!_.trim(_values.name)) {
          delete _values.name;
        } else if (_.trim(_values.name) === 'none') {
          _values.name = '';
        }
        if (!_.trim(_values.description)) {
          delete _values.description;
        } else if (_.trim(_values.description) === 'none') {
          _values.description = '';
        }
        if (_values.enable === undefined) {
          delete _values.enable;
        } else if (_values.enable === 'true') {
          _values.enable = true;
        } else {
          _values.enable = false;
        }
        if (_values.made === undefined) {
          delete _values.made;
        }
        props.dispatch({
          type: `badge/${visible}`,
          payload: _values,
          form: props.form,
        });
      }
    });
  };
  const search = () => {
    props.dispatch({
      type: 'badge/fetch',
      payload: {
        page: 1,
        pageSize: 10,
      },
    });
  };
  return (
    <div>
      <div className={styles.buttonWrap}>
        <div className={styles.title}>
          <Button
            className={styles.moBtn}
            onClick={edit.bind(null, 'generator', null)}
            icon="plus"
            type="primary"
          >
            批量生成实体工牌
          </Button>
        </div>
        <div>
          <Button className={styles.moBtn} onClick={getCsvDetail} icon="download" type="danger">
            导出报表
          </Button>
          <Button
            className={styles.moBtn}
            onClick={edit.bind(null, 'batch', null)}
            icon="download"
            type="danger"
          >
            批量更新
          </Button>
          <Button className={styles.moBtn} onClick={search} icon="download" type="primary">
            查询
          </Button>
        </div>
      </div>
      <div className={styles.tableToolBar}>
        <Row>
          <Col span={8}>
            <FormItem className={styles.formItem} label="名称" help="工牌名称">
              <Input
                onChange={queryChange.bind(null, 'name')}
                placeholder="请输入"
                value={props.query.name}
                style={{ width: 300 }}
              />
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem
              className={styles.formItem}
              label="批号"
              help="如果填批号, 批序号则仅在预该批号内查询,否则查询全局批号"
            >
              <Input
                onChange={queryChange.bind(null, 'code')}
                placeholder="请输入批号"
                value={props.query.code}
                style={{ width: 300 }}
              />
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem
              className={styles.formItem}
              label="批序号"
              help="查找单个可直接输入批序号, 也可以使用','隔开查区间"
            >
              <Input
                onChange={queryChange.bind(null, 'sn')}
                placeholder="请输入批序号"
                value={props.query.sn}
                style={{ width: 300 }}
              />
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem className={styles.formItem} label="时间段" help="生成工牌数据的时间区间">
              <RangePicker
                style={{ width: 300 }}
                format="YYYY-MM-DD"
                onChange={queryChange.bind(null, 'range')}
                value={props.query.range}
              />
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem className={styles.formItem} label="启用状态" help="停用后客户端扫描无效">
              <Select
                style={{ width: 300 }}
                onChange={queryChange.bind(null, 'enable')}
                placeholder="请选择启用类型"
                value={props.query.enable}
              >
                <Select.Option value="all">不限</Select.Option>
                <Select.Option value="true">启用</Select.Option>
                <Select.Option value="false">停用</Select.Option>
              </Select>
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem className={styles.formItem} label="绑定状态" help="是否已被业务员用户绑定">
              <Select
                style={{ width: 300 }}
                onChange={queryChange.bind(null, 'status')}
                placeholder="请选择绑定状态"
                value={props.query.status}
              >
                <Select.Option value="all">全部</Select.Option>
                <Select.Option value="free">空闲</Select.Option>
                <Select.Option value="binded">已绑定</Select.Option>
              </Select>
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem className={styles.formItem} label="制作状态" help="实体工牌制作状态">
              <Select
                style={{ width: 300 }}
                onChange={queryChange.bind(null, 'made')}
                placeholder="请选择制作状态"
                value={props.query.made}
              >
                <Select.Option value="all">全部</Select.Option>
                <Select.Option value="waiting">待制作</Select.Option>
                <Select.Option value="making">制作中</Select.Option>
                <Select.Option value="done">已制作</Select.Option>
              </Select>
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem className={styles.formItem} label="姓名" help="绑定用户姓名关键字">
              <Input
                onChange={queryChange.bind(null, 'userName')}
                placeholder="请输入"
                value={props.query.userName}
                style={{ width: 300 }}
              />
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem className={styles.formItem} label="工号" help="绑定用户工号">
              <Input
                onChange={queryChange.bind(null, 'userCode')}
                placeholder="请输入"
                value={props.query.userCode}
                style={{ width: 300 }}
              />
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem className={styles.formItem} label="手机号" help="绑定用户手机号">
              <Input
                onChange={queryChange.bind(null, 'mobile')}
                placeholder="请输入"
                value={props.query.mobile}
                style={{ width: 300 }}
              />
            </FormItem>
          </Col>
        </Row>
      </div>

      <TableX
        columns={columns}
        dataSource={props.data || []}
        pagination={props.pagination || {}}
        fetchType="badge/fetch"
        dispatch={props.dispatch}
      />
      <Modal
        title={
          props.visible === 'generator'
            ? '批量生成实体工牌'
            : props.visible === 'edit'
            ? '更新'
            : props.visible === 'batch'
            ? '批量更新'
            : ''
        }
        visible={!!props.visible}
        onCancel={edit.bind(null, false, null)}
        footer={[
          <Button key="back" onClick={edit.bind(null, false, null)}>
            取消
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={props.loading}
            onClick={onOk}
            disabled={props.loading}
          >
            提交
          </Button>,
        ]}
      >
        <Form>
          <FormItem label="名称">
            {props.form.getFieldDecorator('name', { initialValue: '' })(
              <Input placeholder="请输入" />,
            )}
          </FormItem>
          {props.visible === 'generator' && (
            <FormItem label="批号">
              {props.form.getFieldDecorator('code', { initialValue: '' })(
                <Input placeholder="请输入" />,
              )}
            </FormItem>
          )}
          <FormItem label="启用状态">
            {props.form.getFieldDecorator('enable', {
              initialValue: props.visible === 'generator' ? 'true' : undefined,
            })(
              <Select placeholder="请选择启用状态" allowClear>
                <Select.Option value="true">启用</Select.Option>
                <Select.Option value="false">停用</Select.Option>
              </Select>,
            )}
          </FormItem>
          <FormItem label="制作状态">
            {props.form.getFieldDecorator('made', {
              initialValue: props.visible === 'generator' ? 'waiting' : undefined,
            })(
              <Select placeholder="请选择制作状态" allowClear>
                <Select.Option value="waiting">待制作</Select.Option>
                <Select.Option value="making">制作中</Select.Option>
                <Select.Option value="done">已制作</Select.Option>
              </Select>,
            )}
          </FormItem>
          {props.visible === 'generator' && (
            <FormItem label="数量">
              {props.form.getFieldDecorator('count', { initialValue: 1 })(
                <InputNumber min={1} placeholder="请输入" />,
              )}
            </FormItem>
          )}
          <FormItem label="描述">
            {props.form.getFieldDecorator('description', { initialValue: '' })(
              <Input.TextArea placeholder="请输入" rows={4} />,
            )}
          </FormItem>
        </Form>
      </Modal>
    </div>
  );
}

function mapStateToProps({ badge }) {
  return badge;
}

export default connect(mapStateToProps)(Form.create()(Badge));
