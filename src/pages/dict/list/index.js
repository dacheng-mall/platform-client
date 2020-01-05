import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import _ from 'lodash';
import { Button, Switch, Modal, Form, Input, Select, Divider, Row, Col, Popconfirm } from 'antd';
import styles from './styles.less';
import { TableX, FormItem } from '../../../utils/ui';

function List(props) {
  const remove = (id) => {
    props.dispatch({
      type: 'dict/remove',
      id,
    });
  };
  const update = (record) => {
    props.dispatch({
      type: 'dict/editor',
      payload: {
        editor: record,
      },
    });
  };
  const columns = [
    {
      key: 'name',
      title: '机构名称',
      dataIndex: 'name',
    },
    {
      key: 'nameJp',
      title: '拼音码',
      dataIndex: 'nameJp',
    },
    {
      key: 'code',
      title: '编码',
      dataIndex: 'code',
    },
    {
      key: 'id',
      title: 'id',
      dataIndex: 'id',
      align: 'center',
    },
    {
      key: 'pid',
      title: '父id',
      dataIndex: 'pid',
      align: 'center',
    },
    {
      key: 'status',
      title: '状态',
      dataIndex: 'status',
      render: (t, { id }) => {
        const change = (checked) => {
          props.dispatch({
            type: 'dict/changeStatus',
            payload: { id, status: checked ? '1' : '0' },
          });
        };
        return <Switch size="small" checked={t === '1'} onChange={change} />;
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
              onClick={update.bind(null, r)}
              size="small"
              shape="circle"
              type="primary"
              icon="edit"
            />
            <Divider type="vertical" />
            <Popconfirm
              placement="topRight"
              title="删除字典数据"
              onConfirm={remove.bind(null, t, r)}
              okText="删除"
              cancelText="算了"
            >
              <Button size="small" shape="circle" type="danger" icon="delete" />
            </Popconfirm>
          </div>
        );
      },
      align: 'right',
    },
  ];
  const { getFieldDecorator } = props.form;
  let timer;
  const handleSearch = (keyword) => {
    console.log('type, keyword', keyword);
    if (_.trim(keyword)) {
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        props.dispatch({
          type: 'dict/search',
          payload: {
            keyword,
          },
        });
        clearTimeout(timer);
      }, 300);
    }
  };
  const renderOpts = (options, keyName = 'id') =>
    _.map(options, (option) => (
      <Select.Option key={option.id} value={option[keyName]}>
        {option.name}
      </Select.Option>
    ));
  const onCancel = () => {
    const { resetFields } = props.form;
    resetFields();
    props.dispatch({
      type: 'dict/cancel',
    });
  };
  const onOk = () => {
    const { validateFields, resetFields } = props.form;
    validateFields((e, v) => {
      if (!e) {
        props.dispatch({
          type: 'dict/submit',
          payload: { ...v, status: v.status ? '1' : '0', dictType: props.type },
          resetFields,
        });
      }
    });
  };
  const add = () => {
    props.dispatch({
      type: 'dict/upState',
      payload: {
        editor: {},
        visible: true,
      },
    });
  };
  const reset = () => {
    props.dispatch({
      type: 'dict/upState',
      payload: {
        query: {}
      }
    });
  };
  const search = () => {
    props.dispatch({
      type: 'dict/fetch',
      payload: {
        page: 1,
        pageSize: 10
      }
    });
  };
  const searchParents = (keyword) => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      console.log('wokao');
      props.dispatch({
        type: 'dict/searchParents',
        payload: {
          keyword,
        },
      });
      clearTimeout(timer);
    }, 300);
  };
  const change = (type, e) => {
    switch (type) {
      case 'regionId':
      case 'pid':
      case 'status':
      case 'level': {
        props.dispatch({
          type: 'dict/changeQuery',
          payload: {
            [type]: e,
          },
        });
        break;
      }
      default: {
        props.dispatch({
          type: 'dict/changeQuery',
          payload: {
            [type]: _.trim(e.target.value),
          },
        });
      }
    }
  };
  return (
    <div>
      <div className={styles.buttonWrap}>
        <Button icon="plus" type="primary" onClick={add}>
          新增字典数据
        </Button>
        <div>
          <Button className={styles.moBtn} onClick={search} icon="search" type="primary">
            查询
          </Button>
          <Button className={styles.moBtn} onClick={reset}>
            重置
          </Button>
        </div>
      </div>
      <div className={styles.tableToolBar}>
        <Row>
          <Col span={6}>
            <FormItem className={styles.formItem} label="名称">
              <Input
                style={{ width: 200 }}
                placeholder="请输入名称关键字查询"
                onChange={change.bind(null, 'name')}
                value={props.query.name}
              />
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem className={styles.formItem} label="上级">
              <Select
                style={{ width: 200 }}
                placeholder="请输入上级名称关键字查询"
                onChange={change.bind(null, 'pid')}
                value={props.query.pid}
                onSearch={searchParents}
                showSearch
                defaultActiveFirstOption={false}
                showArrow={false}
                filterOption={false}
                allowClear
              >
                {_.map(props.parents, (parent) => (
                  <Select.Option key={parent.id}>{parent.name}</Select.Option>
                ))}
              </Select>
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem className={styles.formItem} label="编码">
              <Input
                style={{ width: 200 }}
                placeholder="请输入数据编码"
                onChange={change.bind(null, 'code')}
                value={props.query.code}
              />
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem className={styles.formItem} label="状态">
              <Select
                style={{ width: 200 }}
                onChange={change.bind(null, 'status')}
                value={props.query.status}
                placeholder="请选择状态"
              >
                <Select.Option key="null" value="null">
                  全部
                </Select.Option>
                <Select.Option key="1" value="1">
                  启用
                </Select.Option>
                <Select.Option key="0" value="0">
                  停用
                </Select.Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
      </div>

      <TableX
        columns={columns}
        dataSource={props.data || []}
        pagination={props.pagination}
        fetchType="dict/fetch"
        dispatch={props.dispatch}
      />
      {props.editor ? (
        <Modal
          visible={props.visible}
          title={props.editor && props.editor.id ? '更新' : '新建'}
          width="640px"
          onCancel={onCancel}
          onOk={onOk}
        >
          <Form layout="horizontal">
            <Row type="flex">
              <Col span={12}>
                <FormItem label="数据名称">
                  {getFieldDecorator('name', {
                    initialValue: props.editor.name,
                    rules: [{ required: true, message: '必填项' }],
                  })(<Input placeholder="请输入数据名称" />)}
                </FormItem>
                <FormItem label="类型">
                  {getFieldDecorator('dictType', {
                    initialValue: props.type,
                  })(
                    <Select showSearch placeholder="选择类型" disabled>
                      {renderOpts(props.sys, 'code')}
                    </Select>,
                  )}
                </FormItem>
                <FormItem label="上级数据">
                  {getFieldDecorator('pid', {
                    initialValue: props.editor.pid || undefined,
                  })(
                    <Select
                      showSearch
                      defaultActiveFirstOption={false}
                      showArrow={false}
                      filterOption={false}
                      allowClear
                      placeholder="选择上级数据"
                      onSearch={handleSearch}
                    >
                      {renderOpts([...props.initOptions, ...props.options])}
                    </Select>,
                  )}
                </FormItem>
                <FormItem label="状态">
                  {getFieldDecorator('status', {
                    valuePropName: 'checked',
                    initialValue: props.editor.status === '1',
                  })(<Switch />)}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="拼音">
                  {getFieldDecorator('nameJp', {
                    initialValue: props.editor.nameJp,
                  })(<Input placeholder="请输入" />)}
                </FormItem>
                <FormItem label="编码">
                  {getFieldDecorator('code', {
                    initialValue: props.editor.code,
                  })(<Input placeholder="请输入机构编码" />)}
                </FormItem>
                <FormItem label="描述">
                  {getFieldDecorator('description')(
                    <Input.TextArea placeholder="请输入描述信息" rows={4} />,
                  )}
                </FormItem>
              </Col>
            </Row>
          </Form>
        </Modal>
      ) : null}
    </div>
  );
}
function mapStateToProps({ dict }) {
  return { ...dict };
}
export default connect(mapStateToProps)(Form.create()(List));
