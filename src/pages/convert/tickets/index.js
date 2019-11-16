import { connect } from 'dva';
import moment from 'moment';
import _ from 'lodash';
import { Button, Modal, Form, Input, InputNumber, DatePicker } from 'antd';
import { TableX, FormItem } from '../../../utils/ui';
import Picker from '../prizes/Picker';

function Tickets(props) {
  const columns = [
    {
      key: 'code',
      title: '批号',
      dataIndex: 'code',
    },
    {
      key: 'showSN',
      title: '展现编号',
      dataIndex: 'showSN',
      align: "center"
    },
    {
      key: 'sn',
      title: '序列号',
      dataIndex: 'sn',
      align: "center"
    },
    {
      key: 'name',
      title: '名称',
      dataIndex: 'name',
    },
    {
      key: 'prize.name',
      title: '关联礼包',
      dataIndex: 'prize.name',
    },
    {
      key: 'status',
      title: '状态',
      dataIndex: 'status',
      render: (t) => {
        switch (t) {
          case 'free': {
            return '无主';
          }
          case 'expired': {
            return '已过期'
          }
        }
      },
    },
    {
      key: 'expiredTime',
      title: '到期时间',
      dataIndex: 'expiredTime',
      render: (t) => moment(t).format('YYYY-MM-DD')
    },
  ];
  const edit = (visible) => {
    props.dispatch({
      type: 'tickets/upState',
      payload: {
        visible,
      },
    });
  };
  const onOk = () => {
    const { validateFields } = props.form;
    validateFields((errors, values) => {
      if (!errors) {
        props.dispatch({
          type: 'tickets/generateTickets',
          payload: values,
        });
      }
    });
  };
  return (
    <div>
      <Button icon="plus" type="primary" onClick={edit.bind(null, true)}>
        批量生成电子券
      </Button>
      <TableX
        columns={columns}
        dataSource={props.data || []}
        pagination={props.pagination || {}}
        fetchType="tickets/fetch"
        dispatch={props.dispatch}
      />
      <Modal
        title="批量生成电子券"
        visible={props.visible}
        onCancel={edit.bind(null, false)}
        onOk={onOk}
      >
        <Form>
          <FormItem label="关联礼包">
            {props.form.getFieldDecorator('prize', {
              type: Object,
              rules: [{ required: true, message: '必填想' }],
            })(<Picker type="prize" />)}
          </FormItem>
          <FormItem label="失效日期">
            {props.form.getFieldDecorator('expiredTime', {
              rules: [{ required: true }],
            })(
              <DatePicker
                disabledDate={(m) => m.valueOf() < moment().valueOf()}
                placeholder="请输入"
              />,
            )}
          </FormItem>
          <FormItem label="数量">
            {props.form.getFieldDecorator('count', { initialValue: 1 })(
              <InputNumber min={1} placeholder="请输入" />,
            )}
          </FormItem>
          <FormItem label="批号">
            {props.form.getFieldDecorator('code', { initialValue: '' })(
              <Input placeholder="请输入批号" />,
            )}
          </FormItem>
          <FormItem label="起始编号">
            {props.form.getFieldDecorator('beginNum', { initialValue: 0 })(
              <InputNumber min={0} placeholder="请输入" />,
            )}
          </FormItem>
          <FormItem label="编号位数">
            {props.form.getFieldDecorator('numberCount', {
              initialValue: 5,
            })(<InputNumber min={0} placeholder="请输入" />)}
          </FormItem>
        </Form>
      </Modal>
    </div>
  );
}
function mapStateToProps({ app, tickets }) {
  return { app, ...tickets };
}
export default connect(mapStateToProps)(Form.create()(Tickets));
