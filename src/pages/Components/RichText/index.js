import React, { PureComponent } from 'react';
import 'braft-editor/dist/index.css';
import BraftEditor from 'braft-editor';

export default class RichText extends PureComponent {
  state = {
    editorState: BraftEditor.createEditorState(this.props.value || null),
  };

  render() {
    return <BraftEditor style={{border: '1px solid #ddd'}} placeholder={this.props.placeholder || '请输入'} value={this.state.editorState} onChange={this.handleChange} />;
  }

  handleChange = (editorState) => {
    this.setState({
      editorState,
    });
    if (this.props.onChange) {
      this.props.onChange(editorState.toHTML());
    }
  };
}
