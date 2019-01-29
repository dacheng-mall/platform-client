import React, { PureComponent, Fragment } from 'react';
import _ from 'lodash';
import { Input, Form, Button, Divider, Select } from 'antd';
import PagePreview from './PagePreview';
import styles from './styles.less';
import { getCmsElementsWithoutPage } from '../services';

let timer;
export default class PageEditor extends PureComponent {
  state = {
    visible: false,
    editor: this.props.data || {},
    editing: null,
    height: 0,
    options: [],
  };
  onSearch = (name) => {
    if (timer) {
      clearTimeout(timer);
    }
    const _this = this;
    timer = setTimeout(() => {
      getCmsElementsWithoutPage({ name }).then(({ data }) => {
        _this.setState({
          options: data,
        });
      });
      clearTimeout(timer);
      timer = null;
    }, 300);
  };
  chooseElement = (key) => {
    const { options } = this.state;
    const target = _.find(options, ['id', key]);
    this.props.onEdit('add', target);
    this.setState({
      options: [],
    });
  };
  move = (value, i) => {
    this.props.onEdit('move', value, i);
  };
  remove = (type, i) => {
    this.props.onEdit(type, null, i);
  };

  changeText = (type, e) => {
    this.props.onEdit(type, e.target.value);
  };
  componentDidMount() {
    const width = document.getElementById('_listWrap').clientWidth - 20;
    this.setState({ height: width * 0.48 + 'px', width});
  }
  submit = () => {
    // 编辑元素信息的行为在这里交给状态容器处理
    this.props.onEdit(
      'edit',
      { ...this.state.editor, fileList: this.state.fileList },
      this.state.editing,
    );
  };
  render() {
    const wrapCol = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    return (
      <div className={styles.wrap}>
        <div className={styles.preview}>
          <div id="_listWrap">
            <PagePreview data={this.props.editor.elements} height={this.state.height} width={this.state.width} />
          </div>
        </div>
        <div className={styles.pageEditor}>
          <h2>编辑页面</h2>
          <Form layout="horizontal">
            <Form.Item label="页面名称" {...wrapCol}>
              <Input
                value={this.props.editor.name}
                onChange={this.changeText.bind(null, 'title')}
                placeholder="请输入页面名称"
              />
            </Form.Item>
            <Form.Item label="页面code" {...wrapCol}>
              <Input
                value={this.props.editor.code}
                onChange={this.changeText.bind(null, 'code')}
                placeholder="请输入页面名称"
              />
            </Form.Item>
            <Form.Item label="描述" {...wrapCol}>
              <Input.TextArea
                value={this.props.editor.description}
                onChange={this.changeText.bind(null, 'description')}
                placeholder="请输入页面名称"
              />
            </Form.Item>
            <Form.Item label="选择元素" {...wrapCol}>
              <Select
                onSearch={this.onSearch}
                onChange={this.chooseElement}
                placeholder="请输入关键字搜索元素"
                showSearch
                filterOption={false}
                value={undefined}
              >
                {_.map(this.state.options, (opt, i) => (
                  <Select.Option key={`productOpt_${i}`} value={opt.id}>
                    {opt.name}-{opt.type}
                  </Select.Option>
                ))}
              </Select>
              <ul className={styles.elementsEditor}>
                {_.map(this.props.editor.elements, (elem, i) => (
                  <li key={`elem_list_${i}`}>
                    {elem.name}
                    <div className={styles.elemItem}>
                      {i === 0 ? null : (
                        <Fragment>
                          <Button
                            icon="up"
                            size="small"
                            shape="circle"
                            onClick={this.move.bind(null, 'up', i)}
                          />
                          <Divider type="vertical" />
                        </Fragment>
                      )}
                      {i === this.props.editor.elements.length - 1 ? null : (
                        <Fragment>
                          <Button
                            icon="down"
                            size="small"
                            shape="circle"
                            onClick={this.move.bind(null, 'down', i)}
                          />
                          <Divider type="vertical" />
                        </Fragment>
                      )}
                      <Button
                        icon="cross"
                        type="danger"
                        size="small"
                        shape="circle"
                        onClick={this.remove.bind(null, 'del', i)}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </Form.Item>
          </Form>
        </div>
      </div>
    );
  }
}
