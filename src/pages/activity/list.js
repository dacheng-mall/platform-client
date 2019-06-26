import React, { Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Table, Input, Button, Icon, Switch, Divider } from 'antd';
import styles from './styles.less';
import { jump } from '../../utils';

function ActivityList(props) {
  const edit = (id) => {
    if (id) {
      jump(`/activity/${id}`);
    } else {
      jump(`/activity`);
    }
  };
  const reset = () => {};
  const search = () => {};
  const change = () => {};
  const remove = () => {};
  const team = (id) => {
    jump(`/activity/${id}/team`);
  };
  const gift = (id) => {
    jump(`/activity/${id}/gift`);
  };
  const columns = () => {
    return [
      {
        key: 'name',
        title: '活动名称',
        dataIndex: 'name',
      },
      {
        key: 'institution',
        title: '所属机构',
        render: function(t, r) {
          const {
            institution: { name },
          } = r;
          return name;
        },
      },
      {
        key: 'range',
        title: '周期',
        render: function(t, { dateStart, dateEnd }) {
          return (
            <div>
              开始: {moment(dateStart).format('YYYY-MM-DD HH:mm:ss')}
              <br />
              结束: {moment(dateEnd).format('YYYY-MM-DD HH:mm:ss')}
            </div>
          );
        },
      },
      {
        key: 'createTime',
        title: '创建时间',
        dataIndex: 'createTime',
        render: function(t) {
          return moment(t).format('YYYY-MM-DD HH:mm:ss');
        },
      },
      {
        key: 'totalCount',
        title: '先选数量(件)',
        dataIndex: 'totalCount',
      },
      {
        key: 'status',
        title: '状态',
        dataIndex: 'status',
        render: (t, { id }) => {
          const change = (checked) => {
            props.dispatch({
              type: 'activities/changeStatus',
              payload: { id, status: checked ? 1 : 0 },
            });
          };
          if (props.isInstitutionAdmin) {
            return t === 1 ? '正常' : '失效';
          }
          return <Switch size="small" checked={t === 1} onChange={change} />;
        },
        align: 'center',
      },
      {
        key: 'operator',
        title: '操作',
        dataIndex: 'id',
        render: (t, r) => {
          const btns = [
            <Button
              onClick={team.bind(null, t)}
              size="small"
              icon="team"
              title="参与人员"
              key="btn0"
            >报名人员</Button>,
            <Divider type="vertical" key="btn1" />,
            <Button
              onClick={gift.bind(null, t, r)}
              size="small"
              icon="gift"
              title="领取记录"
              key="btn2"
            >领取记录</Button>,
          ];

          if (!props.isInstitutionAdmin) {
            btns.push(
              <Divider type="vertical" key="btn3" />,
              <Button
                onClick={edit.bind(null, t)}
                size="small"
                type="primary"
                icon="edit"
                key="btn4"
              >编辑</Button>,
              <Divider type="vertical" key="btn5" />,
              <Button
                onClick={remove.bind(null, t, r)}
                size="small"
                type="danger"
                icon="delete"
                key="btn6"
              >删除</Button>,
            );
          }
          return btns;
        },
        align: 'right',
      },
    ];
  };
  return (
    <Fragment>
      <div className={styles.tableToolBar}>
        {props.isInstitutionAdmin ? (
          <div className={styles.title}>活动列表</div>
        ) : (
          <Button onClick={edit.bind(null, '')} type="primary">
            <Icon type="plus" />
            添加活动
          </Button>
        )}
        <div className={styles.filter}>
          <div className={styles.tableToolBar}>
            <Input.Search
              style={{ width: 320 }}
              onSearch={search}
              onChange={change}
              placeholder="请输入活动名称关键字查询"
              value={props.keywords}
            />
            <Button onClick={reset}>重置</Button>
          </div>
        </div>
      </div>
      <Table
        rowKey="id"
        columns={columns()}
        dataSource={props.data || []}
        locale={{ emptyText: '暂无数据' }}
        pagination={{
          pageSize: props.pagination.pageSize,
          total: props.pagination.total,
          current: props.pagination.page,
          onChange: (page, pageSize) => {
            props.dispatch({
              type: 'activities/fetch',
              payload: { page, pageSize },
            });
          },
        }}
      />
    </Fragment>
  );
}

function mapStateToProps({ activities }) {
  return activities;
}

export default connect(mapStateToProps)(ActivityList);
