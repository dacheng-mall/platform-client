import React, { PureComponent } from 'react';
import { connect } from 'dva';
import _ from 'lodash';
import { Form, Button, Input, InputNumber } from 'antd';
import Preview from './components/preview';
import TagsEditor from './components/form/TagsEditor';
import CateEditor from './components/form/CateEditor';
import Content from './components/form/Content';
import Video from './components/form/Video';
import Images from './components/form/Images';

import styles from './detail.less';
import { goBack } from '../../utils';
import { FormItem, mapPropsToFields, onFieldsChange } from '../../utils/ui';

class Detail extends PureComponent {
  back = () => {
    goBack();
  };
  submit = () => {
    const { validateFields } = this.props.form;
    validateFields((errors, values) => {
      if (!errors) {
        
      }
    });
    this.props.dispatch({
      type: 'detail/submit'
    });
  };
  parseErrorMessage = (error) => {
    if (error) {
      return _.map(error, ({ message }, i) => `${i !== 0 ? ',' : ''}${message}`);
    }
    return null;
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    const { errors } = this.props;
    return (
      <div className={styles.wrap}>
        <div className={styles.header}>
          <Button icon="left" onClick={this.back}>
            返回
          </Button>
          <Button icon="check" type="primary" onClick={this.submit}>
            提交
          </Button>
        </div>
        <div className={styles.content}>
          <div className={styles.preview}>
            <Preview data={this.props.editor} />
          </div>
          <div className={styles.form}>
            <Form layout="horizontal">
              <FormItem label="视频">{getFieldDecorator('video')(<Video />)}</FormItem>
              <FormItem
                label="图片"
                validateStatus={errors.images ? 'error' : ''}
                help={this.parseErrorMessage(errors.images)}
              >
                {getFieldDecorator('images', {
                  rules: [{ required: true, message: '必填项' }],
                })(<Images />)}
              </FormItem>
              <FormItem
                label="商品标题"
                validateStatus={errors.title ? 'error' : ''}
                help={this.parseErrorMessage(errors.title)}
              >
                {getFieldDecorator('title', {
                  rules: [{ required: true, message: '必填项' }],
                })(<Input placeholder="请输入商品标题" />)}
              </FormItem>
              <FormItem
                label="商品单价(元)"
                validateStatus={errors.price ? 'error' : ''}
                help={this.parseErrorMessage(errors.price)}
              >
                {getFieldDecorator('price', {
                  rules: [{ required: true, message: '必填项' }],
                })(<InputNumber placeholder="请输入商品单价" />)}
              </FormItem>
              <FormItem label="标签">{getFieldDecorator('attributes')(<TagsEditor />)}</FormItem>
              <FormItem label="分类说明">
                {getFieldDecorator('information')(<CateEditor />)}
              </FormItem>
              <FormItem label="图文内容">{getFieldDecorator('content')(<Content />)}</FormItem>
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
