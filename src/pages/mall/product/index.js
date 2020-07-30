import { connect } from 'dva';
import moment from 'moment';
import _ from 'lodash';
import { Button, Form, Input, Icon, Select, Switch, InputNumber } from 'antd';
import { goBack } from '../../../utils/index';
import Tags from './tags';
import Rules from '../../convert/prizes/Rules/index';
import Images from '../../products/components/form/Images';
import { FormItem, mapPropsToFields, onFieldsChange } from '../../../utils/ui';
import styles from './index.less';
import itemDOM from './itemDOM.less';
import Prices from './Prices';
import Cost from './Cost';
import Discounts from './Discounts';
import MOQ from './MOQ';

function ListItem(props) {
  const { i, file, len, operator } = props;
  return (
    <div className={itemDOM.img}>
      <img src={file.url} />
      <div className={itemDOM.opt}>
        <Icon
          type="up"
          style={{ color: i === 0 ? '#ddd' : '#4cb0b2' }}
          onClick={operator.bind(null, i, 'left')}
        />
        <Icon
          type="down"
          style={{ color: i === len - 1 ? '#ddd' : '#4cb0b2' }}
          onClick={operator.bind(null, i, 'right')}
        />
      </div>
      <div className={itemDOM.del}>
        <Icon onClick={operator.bind(null, i, 'delete')} type="delete-fill" />
      </div>
    </div>
  );
}
function ProductEditor(props) {
  const { getFieldDecorator, validateFields } = props.form;
  const submit = () => {
    validateFields((errors, values) => {
      if (!errors) {
        props.dispatch({
          type: 'mallProduct/submit',
          payload: values,
        });
      }
    });
  };
  return (
    <div className={styles.wrap}>
      <div className={styles.top}>
        <Button icon="left" type="default" onClick={goBack}>
          返回
        </Button>
        <Button icon="plus" type="primary" onClick={submit}>
          保存
        </Button>
      </div>
      <div className={styles.row}>
        <div className={styles.col}>
          <div className={styles.title}>活动基础信息</div>
          <div className={styles.cont}>
            <Form>
              <FormItem label="图片组" help="最多上传5张">
                {getFieldDecorator('images', {
                  rules: [{ required: true, message: '必填项' }],
                })(<Images listType="text" dbType="es" showList={false} max={5} />)}
              </FormItem>
              <FormItem label="列表图" help="最多上传1张">
                {getFieldDecorator('listImage', {
                  rules: [{ required: true, message: '必填项' }],
                })(<Images max={1} />)}
              </FormItem>
              <FormItem label="标题">
                {getFieldDecorator('name', {
                  rules: [{ required: true, message: '必填项' }],
                })(<Input placeholder="请输入标题" />)}
              </FormItem>
              <FormItem label="副标题">
                {getFieldDecorator('subName')(<Input placeholder="请输入副标题" />)}
              </FormItem>
              <FormItem label="描述">
                {getFieldDecorator('description')(
                  <Input.TextArea rows={4} placeholder="请输入描述" />,
                )}
              </FormItem>
              <FormItem label="序号" help="数值越大越靠前">
                {getFieldDecorator('displayOrder')(
                  <InputNumber placeholder="请输入" />,
                )}
              </FormItem>
              <FormItem label="分类">
                {getFieldDecorator('category')(<Select placeholder="请选择分类" />)}
              </FormItem>
              <FormItem label="启用状态">
                {getFieldDecorator('status', {
                  initialValue: true,
                  valuePropName: 'checked',
                })(<Switch />)}
              </FormItem>
              <FormItem label="标签">
                {getFieldDecorator('tags', {
                  type: 'array',
                })(<Tags />)}
              </FormItem>
              <FormItem label="规则描述" help="客户端展现得规则说明">
                {getFieldDecorator('rules', {
                  type: 'array',
                })(<Rules />)}
              </FormItem>
            </Form>
          </div>
        </div>
        <div className={styles.col}>
          <div className={styles.title}>内容图组</div>
          <div className={styles.cont}>
            <Form layout="inline">
              <Form.Item help="最多上传20张">
                {getFieldDecorator('content', {
                  rules: [{ required: true, message: '必填项' }],
                })(
                  <Images
                    listMode="column"
                    showList={false}
                    listType="text"
                    max={20}
                    dbType="es"
                    itemDOM={ListItem}
                  />,
                )}
              </Form.Item>
            </Form>
          </div>
        </div>
        <div className={styles.col}>
          <div className={styles.title}>价格费用和库存</div>
          <div className={styles.cont}>
            <Form>
              <FormItem label="库存(件)">
                {getFieldDecorator('store', {
                  initialValue: 1000,
                })(<InputNumber />)}
              </FormItem>
              <FormItem label="邮费(元)">
                {getFieldDecorator('carriage', {
                  initialValue: 0,
                })(<InputNumber />)}
              </FormItem>
              <Form.Item>
                {getFieldDecorator('MOQ', {
                  rules: [{ required: true, message: '必填项' }],
                })(<MOQ />)}
              </Form.Item>
              <Form.Item style={{ margin: 0 }}>
                {getFieldDecorator('prices', {
                  rules: [{ required: true, message: '必填项' }],
                })(<Prices />)}
              </Form.Item>
              <Form.Item style={{ margin: 0 }}>
                {getFieldDecorator('cost', {
                  rules: [{ required: true, message: '必填项' }],
                })(<Cost />)}
              </Form.Item>
            </Form>
          </div>
        </div>
        <div className={styles.col}>
          <div className={styles.title}>优惠</div>
          <div className={styles.cont}>
            <Form>
              <Form.Item style={{ margin: 0 }}>
                {getFieldDecorator('discount')(<Discounts />)}
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}

function mapStateToProps({ mallProduct }) {
  return mallProduct;
}

export default connect(mapStateToProps)(
  Form.create({ mapPropsToFields, onFieldsChange: onFieldsChange('mallProduct') })(ProductEditor),
);
