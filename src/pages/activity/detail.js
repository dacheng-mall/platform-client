import React from 'react';
import { connect } from 'dva';
import _ from 'lodash';
import { Form, Input, Select, Checkbox, DatePicker, Button, InputNumber } from 'antd';
import { FormItem, mapPropsToFields, onFieldsChange } from '../../utils/ui';
import { goBack } from '../../utils';
import Images from '../products/components/form/Images';
import Swiper from '../products/components/preview/Swiper';
import Content from '../products/components/form/Content';
import ContentP from '../products/components/preview/Content';
import LinkProducts from './components/LinkProducts';
import styles from './detail.less';

const RangePicker = DatePicker.RangePicker;

function ActivityDetail(props) {
  const handleSearch = (keywords) => {
    if (_.trim(keywords)) {
      props.dispatch({
        type: 'activity/searchInst',
        payload: { name: keywords },
      });
    }
  };
  const { getFieldDecorator } = props.form;
  const renderOpts = (data) =>
    _.map(data, (d) => (
      <Select.Option key={d.id} value={d.id} title={d.name}>
        {d.name}
      </Select.Option>
    ));
  const renderTypes = (data) =>
    _.map(data, (d) => (
      <Select.Option key={d.id} value={d.code} title={d.name}>
        {d.name}
      </Select.Option>
    ));
  const submit = () => {
    const { validateFields } = props.form;
    try {
      validateFields((err, val) => {
        if (!err) {
          props.dispatch({
            type: 'activity/submit',
            values: val,
          });
        }
      });
    } catch (e) {}
  };
  const parseErrorMessage = (error) => {
    if (error) {
      return _.map(error, ({ message }, i) => `${i !== 0 ? ',' : ''}${message}`);
    }
    return null;
  };
  const back = () => {
    goBack();
    props.dispatch({
      type: 'activity/newActivity',
    });
  };
  const { editor } = props;
  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <Button onClick={back} icon="arrow-left" size="large">
          取消
        </Button>
        <div className={styles.title}>{editor.id ? '编辑活动' : '新建活动'}</div>
        <Button type="primary" size="large" icon="check" onClick={submit}>
          提交
        </Button>
      </div>
      <div className={styles.main}>
        <div className={`${styles.col} ${styles.preview}`}>
          {editor.images && editor.images.length > 0 ? (
            <Swiper images={editor.images.slice(0, editor.images.length - 1)} />
          ) : null}
          <div className={styles.preview_wrap}>
            <div className={styles.preview_title}>{editor.name || '未填写活动标题'}</div>
            {editor.products && editor.products.length > 0 ? (
              <div
                style={{
                  padding: '10px',
                  textAlign: 'center',
                  backgroundColor: '#eee',
                  margin: '10px 0',
                }}
              >
                待选商品列表, 平台自用暂不演示渲染
              </div>
            ) : null}
            <div
              style={{
                padding: '10px',
                textAlign: 'center',
                backgroundColor: '#eee',
                margin: '10px 0',
              }}
            >
              活动其他属性, 暂不演示渲染
            </div>
            <ContentP data={editor.description} />
          </div>
        </div>
        <div className={`${styles.col} ${styles.formWrap}`}>
          <Form className={styles.form}>
            <FormItem
              label="图片"
              validateStatus={props.errors.images ? 'error' : ''}
              help="最后一张图是小程序端生成海报时的背景图, 不在滚动图里显示"
            >
              {getFieldDecorator('images', {
                rules: [{ required: false, message: '必填项' }],
              })(<Images />)}
            </FormItem>
            <FormItem label="活动类型">
              {getFieldDecorator('activityType', {
                rules: [{ required: true, message: '必填项' }],
              })(
                <Select
                  placeholder="请选择类型"
                  allowClear
                  style={{ width: '350px' }}
                >
                  {renderTypes(props.types)}
                </Select>)}
            </FormItem>
            <FormItem label="所属机构">
              {getFieldDecorator('institutionId', {
                rules: [{ required: true, message: '必填项' }],
              })(
                <Select
                  showSearch
                  placeholder="请选择所属机构"
                  defaultActiveFirstOption={false}
                  showArrow={false}
                  filterOption={false}
                  onSearch={handleSearch}
                  allowClear
                  style={{ width: '350px' }}
                >
                  {renderOpts(props.inst)}
                </Select>,
              )}
            </FormItem>
            <FormItem label="可用职级" help="被选中的职级的业务员可以报名参加活动">
              {props.grades.length < 1
                ? '请先选择机构'
                : getFieldDecorator('grades', {
                    rules: [{ required: true, message: '必填项' }],
                  })(
                    <Checkbox.Group>
                      {_.map(props.grades, (grade, i) => (
                        <Checkbox value={grade.id} key={`grade_${i}`}>
                          {grade.name}
                        </Checkbox>
                      ))}
                    </Checkbox.Group>,
                  )}
            </FormItem>
            <FormItem label="周期">
              {getFieldDecorator('range', {
                rules: [{ type: 'array', required: true, message: '请设置活动周期' }],
              })(<RangePicker showTime format="YYYY-MM-DD HH:mm:ss" />)}
            </FormItem>
            <FormItem label="候选礼品">
              {getFieldDecorator('products', {
                initialValue: [],
                rules: [{ type: 'array', required: true, message: '必填项' }],
              })(<LinkProducts />)}
            </FormItem>
            <FormItem label="领取品类上限" help="允许普通客户从礼品列表中领取的品类数量上限">
              {getFieldDecorator('totalCount', {
                initialValue: 1,
                rules: [{ type: 'number', required: true, message: '必填项' }],
              })(
                <InputNumber
                  disabled={!editor.products || editor.products.length < 1}
                  min={1}
                  max={(editor.products && editor.products.length) || 1}
                />,
              )}
            </FormItem>
            <FormItem label="图文内容">
              {getFieldDecorator('description', {
                rules: [{ required: true, message: '必填项' }],
              })(<Content />)}
            </FormItem>
          </Form>
        </div>
      </div>
    </div>
  );
}

function mapStateToProps({ activity }) {
  return activity;
}
function onValuesChange(props, changeValues, allValues) {
  if (changeValues.institutionId) {
    props.dispatch({
      type: 'activity/getGrades',
      institutionId: changeValues.institutionId,
    });
  }
  if (!allValues.institutionId) {
    props.form.resetFields(['grades']);
    props.dispatch({
      type: 'activity/clearGrades',
    });
  }
}
export default connect(mapStateToProps)(
  Form.create({ mapPropsToFields, onFieldsChange: onFieldsChange('activity'), onValuesChange })(
    ActivityDetail,
  ),
);
