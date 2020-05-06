import { Fragment, useState } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import _ from 'lodash';
import {
  Button,
  Row,
  Col,
  Form,
  Input,
  DatePicker,
  Select,
  Modal,
  Divider,
  Popconfirm,
} from 'antd';
import { TableX, FormItem, mapPropsToFields } from '../../../utils/ui';
import styles from './index.less';

const { RangePicker } = DatePicker;

function InstSeller(props) {
  const _columns = [];
  if (props.root_lv > -1) {
    let i = 0;
    while (i < 4 - props.root_lv) {
      _columns.push({
        key: `tree[${i + 1}].shortName`,
        title: `机构${i + 1}`,
        dataIndex: `tree[${i}].shortName`,
        align: 'left',
      });
      i++;
    }
  } else {
    _columns.push({
      key: 'inst',
      title: '机构',
      dataIndex: 'institutionName',
      align: 'center',
    });
  }
  const columns = [
    ..._columns,
    {
      key: 'name',
      title: '姓名',
      dataIndex: 'name',
      align: 'center',
    },
    {
      key: 'nickName',
      title: '微信昵称',
      dataIndex: 'nickName',
      align: 'center',
    },
    {
      key: 'code',
      title: '工号',
      dataIndex: 'code',
      align: 'center',
    },
    {
      key: 'mobile',
      title: '手机号',
      dataIndex: 'mobile',
      align: 'center',
    },
    {
      key: 'idCard',
      title: '身份证',
      dataIndex: 'idCard',
      align: 'center',
    },
    {
      key: 'gradeName',
      title: '职级',
      dataIndex: 'gradeName',
      align: 'center',
    },
    {
      key: 'staff',
      title: '内勤',
      dataIndex: 'roles',
      render: function(t) {
        return t && t.includes('staff') ? '是' : '--';
      },
      align: 'center',
    },
    {
      key: 'createTime',
      title: '注册时间',
      dataIndex: 'createTime',
      render: function(t) {
        return moment(t).format('YYYY-MM-DD HH:mm:ss');
      },
    },
    {
      key: 'operator',
      title: '操作',
      dataIndex: 'id',
      width: 128,
      render: function(t, r) {
        return (
          <div>
            <Popconfirm
              title={`你确定将 ${r.name} 清理出机构吗?`}
              onConfirm={confirm.bind(null, { id: t, name: r.name })}
              okText="清理"
              cancelText="算了, 先不清理了"
            >
              <Button icon="delete" shape="circle" type="danger" disabled={props.removing} />
            </Popconfirm>
            <Divider type="vertical" />
            <Button icon="edit" shape="circle" type="primary" onClick={edit.bind(null, r)} />
          </div>
        );
      },
    },
  ];
  const confirm = (payload) => {
    props.dispatch({
      type: 'instSeller/remove',
      payload,
    });
  };
  const queryChange = (type, e) => {
    let value, instCode;
    switch (type) {
      case 'institution': {
        console.log(e);
        if (e) {
          const target = _.find(props.inst, ['key', e.key]);
          value = { institution: e };
          instCode = target && target.code;
        } else {
          value = { institution: undefined };
          instCode = undefined;
        }
        break;
      }
      case 'name':
      case 'code':
      case 'mobile': {
        console.log(type, e.target.value);
        value = { [type]: e.target.value };
        break;
      }
      case 'isStaff':
      case 'range':
      case 'gradeId': {
        value = { [type]: e };
        break;
      }
    }
    if (type === 'institution' && instCode !== props.instCode) {
      console.log('instCode', instCode);
      props.dispatch({
        type: 'instSeller/fetchGrade',
        code: instCode,
      });
    }
    props.dispatch({
      type: 'instSeller/upState',
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
        type: 'instSeller/searchInst',
        name,
      });
    }, 500);
  };
  // 拜访数据报表
  const getCsvDetail = () => {
    props.dispatch({
      type: 'instSeller/getCsvDetail',
    });
  };
  const search = () => {
    props.dispatch({
      type: 'instSeller/fetch',
    });
  };
  const { getFieldDecorator } = props.form;
  const edit = (payload) => {
    props.dispatch({
      type: 'instSeller/edit',
      payload,
    });
  };
  const handleOk = () => {
    props.form.validateFields((err, val) => {
      props.dispatch({
        type: 'instSeller/submit',
        payload: val,
      });
    });
  };
  const handleCancel = () => {
    props.dispatch({
      type: 'instSeller/upState',
      payload: {
        editor: {},
      },
    });
  };
  return (
    <div>
      <div className={styles.buttonWrap}>
        <div className={styles.title}>营销人力数据</div>
        <div>
          <Button className={styles.moBtn} onClick={getCsvDetail} icon="download" type="danger">
            导出人力数据报表
          </Button>
          <Button className={styles.moBtn} onClick={search} icon="download" type="primary">
            查询
          </Button>
        </div>
      </div>
      <div className={styles.tableToolBar}>
        <Row>
          <Col span={8}>
            <FormItem className={styles.formItem} label="机构">
              <Select
                showSearch
                value={props.query.institution}
                placeholder="输入名称关键字查询机构"
                style={{ width: 240 }}
                defaultActiveFirstOption={false}
                showArrow={false}
                filterOption={false}
                labelInValue
                allowClear={props.userType !== 3}
                onSearch={searchInst}
                onChange={queryChange.bind(null, 'institution')}
                notFoundContent="暂无选项"
              >
                {_.map(props.inst, (inst) => {
                  return <Select.Option key={inst.key}>{inst.label}</Select.Option>;
                })}
              </Select>
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem className={styles.formItem} label="职级类型">
              <Select
                style={{ width: 240 }}
                onChange={queryChange.bind(null, 'gradeId')}
                placeholder="请选择职级"
                disabled={props.grades.length < 1}
                value={props.query.gradeId}
              >
                <Select.Option value="all">全部</Select.Option>
                {_.map(props.grades, (grade) => (
                  <Select.Option key={grade.id} value={grade.id}>
                    {grade.name}
                  </Select.Option>
                ))}
              </Select>
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem className={styles.formItem} label="内勤">
              <Select
                style={{ width: 240 }}
                onChange={queryChange.bind(null, 'isStaff')}
                placeholder="请选择是否为内勤"
                value={props.query.isStaff}
              >
                <Select.Option value="all">不限</Select.Option>
                <Select.Option value="yes">是</Select.Option>
              </Select>
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem className={styles.formItem} label="姓名">
              <Input
                style={{ width: 240 }}
                value={props.query.name}
                onChange={queryChange.bind(null, 'name')}
                placeholder="输入姓名关键字"
              />
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem className={styles.formItem} label="工号">
              <Input
                style={{ width: 240 }}
                value={props.query.code}
                onChange={queryChange.bind(null, 'code')}
                placeholder="输入工号"
              />
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem className={styles.formItem} label="手机号">
              <Input
                style={{ width: 240 }}
                value={props.query.mobile}
                onChange={queryChange.bind(null, 'mobile')}
                placeholder="输入手机号"
              />
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem className={styles.formItem} label="注册时间">
              <RangePicker
                style={{ width: 240 }}
                ranges={{
                  昨日: [
                    moment()
                      .subtract(1, 'day')
                      .startOf('day'),
                    moment()
                      .subtract(1, 'day')
                      .endOf('day'),
                  ],
                  今日: [moment(), moment()],
                  上周: [
                    moment()
                      .subtract(1, 'week')
                      .startOf('week'),
                    moment()
                      .subtract(1, 'week')
                      .endOf('week'),
                  ],
                  本周: [moment().startOf('week'), moment().endOf('week')],
                  上月: [
                    moment()
                      .subtract(1, 'month')
                      .startOf('month'),
                    moment()
                      .subtract(1, 'month')
                      .endOf('month'),
                  ],
                  本月: [moment().startOf('month'), moment().endOf('month')],
                  上季度: [
                    moment()
                      .subtract(1, 'quarter')
                      .startOf('quarter'),
                    moment()
                      .subtract(1, 'quarter')
                      .endOf('quarter'),
                  ],
                  本季度: [moment().startOf('quarter'), moment().endOf('quarter')],
                }}
                format="YYYY-MM-DD"
                onChange={queryChange.bind(null, 'range')}
                value={props.query.range}
              />
            </FormItem>
          </Col>
        </Row>
      </div>

      <TableX
        columns={columns}
        dataSource={props.data || []}
        pagination={props.pagination || {}}
        fetchType="instSeller/fetch"
        dispatch={props.dispatch}
      />
      <Modal
        visible={!!props.editor.id}
        title="修改营销员资料"
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form layout="horizontal">
          <FormItem label="姓名">
            {getFieldDecorator('name', {
              initialValue: props.editor.name,
            })(<Input placeholder="请输入姓名" />)}
          </FormItem>
          <FormItem label="工号">
            {getFieldDecorator('code', {
              initialValue: props.editor.code,
            })(<Input placeholder="请输入工号" />)}
          </FormItem>
          <FormItem label="身份证号">
            {getFieldDecorator('idCard', {
              initialValue: props.editor.idCard,
            })(<Input placeholder="请输入身份证号" />)}
          </FormItem>
          <FormItem label="职级">
            {getFieldDecorator('grade', {
              initialValue: props.editor.gradeId
                ? {
                    key: props.editor.gradeId,
                    label: props.editor.gradeName,
                  }
                : undefined,
            })(
              <Select
                placeholder="请选择职级"
                style={{ width: 240 }}
                labelInValue
                notFoundContent="暂无选项"
                disabled={props.grades.length < 1}
              >
                {_.map(props.grades, (grade) => (
                  <Select.Option key={grade.id}>{grade.name}</Select.Option>
                ))}
              </Select>,
            )}
          </FormItem>
        </Form>
      </Modal>
    </div>
  );
}

function mapStateToProps({ instSeller }) {
  return instSeller;
}

export default connect(mapStateToProps)(Form.create({ mapPropsToFields })(InstSeller));
