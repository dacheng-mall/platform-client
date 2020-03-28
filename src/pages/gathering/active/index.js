import { Fragment, useState } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import _ from 'lodash';
import { Button, Form, Divider, Popconfirm, Icon, Switch, Modal, InputNumber } from 'antd';
import { jump } from '../../../utils';
import { TableX, FormItem } from '../../../utils/ui';
import styles from './index.less';
import { setStore } from './services';

function Gathering(props) {
  const enableChange = (id, checked) => {
    props.dispatch({
      type: 'gathering/changeEnable',
      id,
      body: {
        enable: checked,
      },
    });
  };
  const deleteActive = (id) => {
    props.dispatch({
      type: 'gathering/delete',
      id,
    });
  };
  const columns = [
    {
      key: 'name',
      title: '名称',
      dataIndex: 'name',
      align: 'left',
    },
    {
      key: 'from',
      title: '开始时间',
      dataIndex: 'from',
      render: function(t) {
        return moment(t).format('YYYY-MM-DD');
      },
    },
    {
      key: 'to',
      title: '结束时间',
      dataIndex: 'to',
      render: function(t) {
        return moment(t).format('YYYY-MM-DD');
      },
    },
    {
      key: 'institution',
      title: '机构',
      dataIndex: 'institution.name',
    },
    {
      key: 'store',
      title: '库存',
      dataIndex: 'id',
      render: (id) => {
        function store() {
          props.dispatch({
            type: 'gathering/store',
            id,
          });
        }
        return (
          <Button type="primary" onClick={store}>
            管理库存
          </Button>
        );
      },
    },
    {
      key: 'type',
      title: '核销方式',
      dataIndex: 'type',
      render: function(t, r) {
        switch (t) {
          case 'offline': {
            return '线下核销';
          }
          case 'online': {
            return '线上发货';
          }
          default: {
            return '未知核销方式';
          }
        }
      },
    },
    {
      key: 'enable',
      title: '启用状态',
      dataIndex: 'enable',
      render: function(t, r) {
        return (
          <div>
            <Switch
              checked={t}
              onChange={enableChange.bind(null, r.id)}
              checkedChildren="启"
              unCheckedChildren="停"
            />
          </div>
        );
      },
    },
    {
      key: 'operator',
      title: '操作',
      dataIndex: 'id',
      align: 'right',
      render: (t) => {
        return (
          <div>
            <Button
              shape="circle"
              type="primary"
              icon="copy"
              title="克隆"
              onClick={clone.bind(null, t)}
            />
            <Divider type="vertical" />
            <Button
              shape="circle"
              type="primary"
              icon="edit"
              title="编辑"
              onClick={edit.bind(null, t)}
            />
            <Divider type="vertical" />
            <Popconfirm
              title="是否要删除活动"
              onConfirm={deleteActive.bind(null, t)}
              confirmText="删除"
              placement="topRight"
              icon={<Icon type="question-circle-o" style={{ color: 'red' }} />}
              okText="删除"
              cancelText="算了, 我再考虑下"
            >
              <Button shape="circle" type="danger" icon="delete" title="删除" />
            </Popconfirm>
          </div>
        );
      },
    },
  ];
  const clone = (id) => {
    props.dispatch({
      type: 'gathering/clone',
      payload: { id },
    });
  };
  const edit = (id) => {
    if (id) {
      jump(`/gathering/active/detail/${id}`);
    } else {
      jump('/gathering/active/detail');
    }
  };
  const queryChange = () => {};
  const exportCsv = (type) => {
    props.dispatch({
      type: 'task/visitedCSV',
      payload: { type },
    });
  };
  const handleSetStore = () => {
    props.dispatch({
      type: 'gathering/setStore',
    });
  };
  const handleCancel = () => {
    props.dispatch({
      type: 'gathering/upState',
      payload: {
        editingStore: null,
      },
    });
  };
  const changeStore = (value) => {
    props.dispatch({
      type: 'gathering/changeStore',
      value,
    });
  };
  return (
    <div>
      <div className={styles.top}>
        <Button icon="plus" type="primary" onClick={edit}>
          创建集会活动
        </Button>
      </div>
      <TableX
        columns={columns}
        dataSource={props.data || []}
        pagination={props.pagination || {}}
        fetchType="task/fetch"
        dispatch={props.dispatch}
      />
      <Modal
        visible={!!props.editingStore}
        title="编辑库存"
        onOk={handleSetStore}
        onCancel={handleCancel}
      >
        <Form>
          <FormItem label="库存总量" style={{ marginBottom: '5px' }}>
            <div>{props.editingStore && props.editingStore.current}</div>
          </FormItem>
          <FormItem label="已售出" style={{ marginBottom: '5px' }}>
            <div>{props.editingStore && props.editingStore.total}</div>
          </FormItem>
          <FormItem label="剩余库存" style={{ marginBottom: '5px' }}>
            <div>{props.editingStore && props.editingStore.current - props.editingStore.total}</div>
          </FormItem>
          <FormItem label="新库存" style={{ marginBottom: '5px' }}>
            <InputNumber
              onChange={changeStore}
              value={props.editingStore && props.editingStore.value}
              placeholder="请输入"
            />
          </FormItem>
        </Form>
      </Modal>
    </div>
  );
}

function mapStateToProps({ gathering }) {
  return gathering;
}

export default connect(mapStateToProps)(Gathering);
