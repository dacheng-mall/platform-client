import React, { PureComponent, Fragment } from 'react';
import _ from 'lodash';
import { Button, Input, Icon } from 'antd';
import styles from './styles.less';

export default class TagsEditor extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      inputVisible: false,
    };
  }
  remove = (val) => {
    const newVal = _.filter(this.props.value, (v) => {
      return v !== val;
    });
    this.props.onChange([...newVal]);
  };
  showInput = () => {
    this.setState({
      inputVisible: true,
    });
  };
  clear = (e) => {
    e.preventDefault();
    this.setState({
      inputVisible: false,
    });
  };
  press = (e) => {
    e.preventDefault();
    this.props.onChange([...this.props.value, e.target.value]);
    this.setState({
      inputVisible: false,
    });
  };
  render() {
    return (
      <Fragment>
        <div className={styles.tags}>
          {_.map(this.props.value, (val, i) => (
            <div className={styles.tagItem} key={`tag_${i}`}>
              {val}
              {<Icon className={styles.remove} type="cross" onClick={this.remove.bind(null, val)} />}
            </div>
          ))}
        </div>
        {this.state.inputVisible ? (
          <Input
            className={styles.newTagInput}
            onPressEnter={this.press}
            placeholder="请输入行标签"
            onBlur={this.clear}
          />
        ) : (
          <Button
            icon="plus"
            onClick={this.showInput}
          >
            新标签
          </Button>
        )}
      </Fragment>
    );
  }
}
