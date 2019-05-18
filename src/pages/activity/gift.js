import React, { Fragment, useState } from 'react';
import { connect } from 'dva';
import _ from 'lodash';
import moment from 'moment';
import { Table, Button, Modal, Select } from 'antd';
import styles from './styles.less';

const source = window.config.source;

function Gift(props) {
  const showGifts = (gift) => {
    Modal.info({
      title: `${gift && gift.custom.name}领取的的礼品`,
      content: (
        <div>
          领取时间: {moment(gift.createTime).format('YYYY-MM-DD HH:mm:ss')}
          {_.map(gift.giftProducts, ({ product }) => {
            return (
              <div>
                <img src={`${source}${product.mainImageUrl}?imageView2/2/w/96/h/96`} />
                <div>{product.title}</div>
                <div>¥{product.price}</div>
              </div>
            );
          })}
        </div>
      ),
    });
  };
  const columns = () => {
    return [
      {
        key: 'user',
        title: '客户',
        render: (t, r) => {
          return (
            <div style={{ display: 'flex' }}>
              <div>
                {r.custom.avatar ? (
                  <img style={{ width: '48px' }} src={r.custom.avatar} alt={r.custom.name} />
                ) : (
                  <div className={styles.defaultAvatar} />
                )}
              </div>
              <div>
                <div>{r.custom.name}</div>
                <div>{r.custom.mobile}</div>
              </div>
            </div>
          );
        },
      },
      {
        key: 'salesman',
        title: '业务员',
        render: (t, r) => {
          return (
            <div style={{ display: 'flex' }}>
              <div>
                {r.salesman.avatar ? (
                  <img style={{ width: '48px' }} src={r.salesman.avatar} alt={r.salesman.name} />
                ) : (
                  <div className={styles.defaultAvatar} />
                )}{' '}
              </div>
              <div>
                <div>{r.salesman.name}</div>
                <div>{r.salesman.mobile}</div>
              </div>
            </div>
          );
        },
      },
      {
        key: 'institution',
        title: '所属机构',
        render: (t, r) => {
          return (
            <div>
              <div>{r.salesman.institution.name}</div>
              <div>{r.salesman.gradeName}</div>
              <div>{r.salesman.code}</div>
            </div>
          );
        },
      },
      {
        key: 'gift',
        title: '领取礼品',
        render: (t, r) => {
          return (
            <Button onClick={showGifts.bind(null, r)} type="primary" icon="gift">
              查看
            </Button>
          );
        },
      },
    ];
  };
  const search = (value) => {
    if (_.trim(value)) {
      props.dispatch({
        type: 'activityGift/searchInst',
        payload: value,
      });
    }
  };
  const changeInst = (institutionId) => {
    props.dispatch({
      type: 'activityGift/upState',
      payload: {
        institutionId,
      },
    });
  };
  const reset = () => {
    props.dispatch({
      type: 'activityGift/reset',
    });
  };
  const reFetch = () => {
    props.dispatch({
      type: 'activityGift/fetch',
      payload: {},
    });
  };
  return (
    <Fragment>
      <div className={styles.tableToolBar}>
        <div className={styles.title}>客户领取记录</div>
        <div className={styles.filter}>
          <Select
            showSearch
            value={props.institutionId}
            placeholder="请输入机构名称关键字查询"
            style={{ width: 240, marginRight: '10px' }}
            defaultActiveFirstOption={false}
            filterOption={false}
            onSearch={search}
            onChange={changeInst}
            notFoundContent={null}
          >
            {_.map(props.inst, (inst) => {
              return (
                <Select.Option key={inst.id} value={inst.id}>
                  {inst.name}
                </Select.Option>
              );
            })}
          </Select>
          <Button onClick={reFetch} type="primary" style={{ marginRight: '10px' }}>
            查询
          </Button>
          <Button onClick={reset}>重置</Button>
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
              type: 'activityGift/fetch',
              payload: { page, pageSize },
            });
          },
        }}
      />
    </Fragment>
  );
}
function mapStateToProps({ activityGift }) {
  return activityGift;
}

export default connect(mapStateToProps)(Gift);
