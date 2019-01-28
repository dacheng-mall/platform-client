import React from 'react';
import { Button } from 'antd';
import styles from './styles.less';

export default class Mask extends React.PureComponent {
  edit = () => {
    this.props.onPress('edit');
  };
  move = (direct) => {
    this.props.onPress('move', direct);
  };
  remove = () => {
    this.props.onPress('del');
  };
  render() {
    const { isHead, isTail } = this.props;
    return (
      <div className={styles.operator}>
        <div>
          <Button onClick={this.edit} type="primary" shape="circle" icon="edit" />
          <Button onClick={this.remove} type="danger" shape="circle" icon="delete" />
        </div>
        <div>
          {isHead ? null : (
            <Button onClick={this.move.bind(null, 'up')} shape="circle" icon="arrow-up" />
          )}
          {isTail ? null : (
            <Button onClick={this.move.bind(null, 'down')} shape="circle" icon="arrow-down" />
          )}
        </div>
      </div>
    );
  }
}
