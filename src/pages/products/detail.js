import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Button, Input, InputNumber } from 'antd';
import Preview from './components/preview';
import TagsEditor from './components/form/TagsEditor';
import CateEditor from './components/form/CateEditor';

import styles from './detail.less';
import { goBack } from '../../utils';
import { FormItem, mapPropsToFields, onFieldsChange } from '../../utils/ui';

class Detail extends PureComponent {
  back = () => {
    goBack();
  };
  submit = () => {
    const { validateFields } = this.props.form;
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className={styles.wrap}>
        <div className={styles.header}>
          <Button icon="left" onClick={this.back}>
            返回
          </Button>
          <Button icon="check" type="primary">
            提交
          </Button>
        </div>
        <div className={styles.content}>
          <div className={styles.preview}>
            <Preview data={this.props.editor} />
          </div>
          <div className={styles.form}>
            <Form onSubmit={this.submit} layout="horizontal">
              <FormItem label="商品标题">
                {getFieldDecorator('title', {
                  rules: [{ required: true, message: '必填项' }],
                })(<Input placeholder="请输入商品标题" />)}
              </FormItem>
              <FormItem label="商品单价(元)">
                {getFieldDecorator('price', {
                  rules: [{ required: true, message: '必填项' }],
                })(<InputNumber placeholder="请输入商品单价" />)}
              </FormItem>
              <FormItem label="标签">{getFieldDecorator('attributes')(<TagsEditor />)}</FormItem>
              <FormItem label="分类说明">
                {getFieldDecorator('categories')(<CateEditor />)}
              </FormItem>
            </Form>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps({ detail }) {
  return detail;
}

export default connect(mapStateToProps)(
  Form.create({ mapPropsToFields, onFieldsChange: onFieldsChange('detail') })(Detail),
);
