import { Fragment, useState } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import _ from 'lodash';
import { Button, Divider, Popconfirm, Icon, Switch } from 'antd';
import { jump } from '../../../utils';
import { TableX } from '../../../utils/ui';
import styles from './index.less';

const source = window.config.source;

function OnlineVisitedShare(props) {
  const enableChange = (id, checked) => {
    props.dispatch({
      type: 'onlineVisitedShare/changeEnable',
      payload: {
        id,
        enable: checked,
      },
    });
  };
  const deleteItem = (id) => {
    props.dispatch({
      type: 'onlineVisitedShare/deleteItem',
      id,
    });
  };
  const columns = [
    {
      key: 'sn',
      title: '序号',
      dataIndex: 'sn',
    },
    {
      key: 'image',
      title: '主题图',
      dataIndex: 'image',
      align: 'left',
      render: function(t) {
        return <img src={`${source}${t}?imageView2/2/w/96/h/96`} title={t} alt="图片" />;
      },
    },
    {
      key: 'poster',
      title: '海报',
      dataIndex: 'poster',
      align: 'left',
      render: function(t) {
        return <img src={`${source}${t}?imageView2/2/w/96/h/96`} title={t} alt="图片" />;
      },
    },
    {
      key: 'name',
      title: '名称',
      dataIndex: 'name',
    },
    {
      key: 'createTime',
      title: '创建时间',
      dataIndex: 'createTime',
      render: function(t) {
        return moment(t).format('YYYY-MM-DD');
      },
    },
    {
      key: 'content',
      title: '内容文案',
      dataIndex: 'content',
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
              disabled={props._switch}
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
              icon="edit"
              title="编辑"
              onClick={edit.bind(null, t)}
            />
            <Divider type="vertical" />
            <Popconfirm
              title="是否要删除内容"
              onConfirm={deleteItem.bind(null, t)}
              confirmText="删除"
              placement="topRight"
              icon={<Icon type="question-circle-o" style={{ color: 'red' }} />}
              okText="删除"
              cancelText="算了, 我再考虑下"
              disabled={props._delete}
            >
              <Button
                shape="circle"
                type="danger"
                icon="delete"
                title="删除"
                disabled={props._delete}
              />
            </Popconfirm>
          </div>
        );
      },
    },
  ];
  const edit = (id) => {
    if (id) {
      jump(`/baseManage/onlineVisitedShareDetail/${id}`);
    } else {
      jump('/baseManage/onlineVisitedShareDetail');
    }
  };
  const queryChange = (type, e) => {
    let value;
    switch (type) {
      case 'institution': {
        console.log(e);
        value = { institution: e };
        break;
      }
      case 'range':
      case 'type':
      case 'method': {
        console.log(type, e);
        value = { [type]: e };
        break;
      }
    }
    props.dispatch({
      type: 'visited/upState',
      payload: {
        query: {
          ...props.query,
          ...value,
        },
      },
    });
  };
  let timer = null;
  const searchInst = (name) => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      props.dispatch({
        type: 'visited/searchInst',
        name,
      });
    }, 500);
  };
  // 拜访数据报表
  const getcsvdata = (isActive) => {
    console.log('isActive', isActive);
    props.dispatch({
      type: 'visited/getcsvdata',
      isActive,
    });
  };
  // 活动人力报表
  const addPids = () => {
    props.dispatch({
      type: 'visited/addPids',
    });
  };
  const exportCsv = (type) => {
    props.dispatch({
      type: 'visited/visitedCSV',
      payload: { type },
    });
  };
  return (
    <div>
      <div className={styles.top}>
        <Button icon="plus" type="primary" onClick={edit.bind(null, null)}>
          创建在线拜访分享内容
        </Button>
      </div>
      <TableX
        columns={columns}
        dataSource={props.data || []}
        pagination={props.pagination || {}}
        fetchType="onlineVisitedShare/fetch"
        dispatch={props.dispatch}
      />
    </div>
  );
}

function mapStateToProps({ onlineVisitedShare }) {
  return onlineVisitedShare;
}

export default connect(mapStateToProps)(OnlineVisitedShare);
