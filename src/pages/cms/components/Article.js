import React, { PureComponent } from 'react';
// import _ from 'lodash';
import { Form, Input } from 'antd';
import Editor from '../../products/components/form/Content';
import EditorPreview from '../../products/components/preview/Content';
import { onFieldsChange, mapPropsToFields } from '../../../utils/ui';
import styles from './styles.less';

class Article extends PureComponent {
  static getDerivedStateFromProps = (props, state) => {
    return state;
  };
  state = {};
  change = (type, e) => {
    // 表单值的变更仅影响组件内的state, 用于最终subimt方法使用, 提交给上层状态容器
    switch (type) {
      case 'title': {
        this.props.onEdit(type, e.target.value);
        break;
      }
      default: {
        return false;
      }
    }
  };
  render() {
    const wrapCol = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    const { getFieldDecorator } = this.props.form;
    const { content = [] } = this.props.editor;
    return (
      <div className={styles.wrap}>
        <div className={styles.preview}>
          <div className={styles.listWrap} id="_listWrap">
            {content.length > 0 ? (
              <EditorPreview data={content} />
            ) : (
              <div
                style={{
                  textAlign: 'center',
                  padding: '0.3rem 0',
                  fontSize: '0.16rem',
                  color: '#aaa',
                  width: '100%',
                }}
              >
                暂无元素, 请点击右侧按钮添加图文内容
              </div>
            )}
          </div>
        </div>
        <div className={styles.editor}>
          <h2>编辑基础属性</h2>
          <Form layout="horizontal">
            <Form.Item label="元素组名称" {...wrapCol}>
              <Input
                value={this.props.name}
                placeholder="请输入列表名称"
                onChange={this.change.bind(null, 'title')}
              />
            </Form.Item>
          </Form>
          <h2>编辑素材内容</h2>
          <Form layout="horizontal">
            <Form.Item>
              {getFieldDecorator('content', {
                rules: [{ required: true, message: '必填项' }],
              })(<Editor />)}
            </Form.Item>
          </Form>
        </div>
      </div>
    );
  }
}
export default Form.create({ mapPropsToFields, onFieldsChange: onFieldsChange('elementEditor') })(Article);
