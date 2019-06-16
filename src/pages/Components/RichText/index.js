import React, { PureComponent } from 'react';
import 'braft-editor/dist/index.css';
import BraftEditor from 'braft-editor';

export default class RichText extends PureComponent {
  constructor(props){
    super(props)
    this.state = {
      editorState: BraftEditor.createEditorState(props.value)
    }
  }
  // static getDerivedStateFromProps = (props, state) => {
  //   console.log(props.value)
  //   if(props.value) {
  //     return {
  //       editorState: BraftEditor.createEditorState(props.value),
  //       init: true
  //     }
  //   }
  //   return state
  // };                                                                                                                                                                                                                                                                                                                                                                                                                 
  render() {
    return (
      <BraftEditor
        style={{ border: '1px solid #ddd' }}
        placeholder={this.props.placeholder || '请输入'}
        value={this.state.editorState}
        onChange={this.handleChange}
      />
    );
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
