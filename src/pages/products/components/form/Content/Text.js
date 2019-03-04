import React, { PureComponent } from 'react';
import { Input, Menu, Dropdown, Button, Slider } from 'antd';
import { BlockPicker } from 'react-color';

const ButtonGroup = Button.Group;
const { TextArea } = Input;
const MenuItem = Menu.Item;

export default class Text extends PureComponent {
  static getDerivedStateFromProps(props, state) {
    return { ...state, ...props.value };
  }

  state = {
    visible: '',
  };
  changeHandler = (type, value) => {
    const _value = (function(v) {
      switch (typeof v) {
        case 'string':
        case 'number':
        case 'boolean': {
          return v;
        }
        case 'object': {
          if (v.target) {
            return v.target.value;
          }
          return '';
        }
        default: {
          return '';
        }
      }
    })(value);
    this.props.onChange(_value, `[${this.props.index}].${type}`);
    switch(type){
      case 'align':
      case 'color': {
        this.changeVisible(null);
        break;
      }
      default:
        break;
    }
  };
  changeVisible = (visible) => {
    if(this.state.visible) {
      this.setState({ visible: null });
    } else {
      this.setState({ visible });
    }
  };
  menu = (
    <Menu>
      <MenuItem>
        <Button onClick={this.changeHandler.bind(null, 'align', 'left')} icon="align-left" />
      </MenuItem>
      <MenuItem>
        <Button onClick={this.changeHandler.bind(null, 'align', 'center')} icon="align-center" />
      </MenuItem>
      <MenuItem>
        <Button onClick={this.changeHandler.bind(null, 'align', 'right')} icon="align-right" />
      </MenuItem>
    </Menu>
  );
  handleChangeComplete = (color) => {
    this.changeHandler('color', color.hex)
  };
  render() {
    const { align, size, padding, italic, weight, value, underline, throughline, color } = this.state;
    return (
      <div>
        <ButtonGroup>
          <Dropdown
            visible={this.state.visible === 'align'}
            overlay={this.menu}
            placement="bottomLeft"
          >
            <Button
              onClick={this.changeVisible.bind(null, 'align')}
              type="primary"
              icon={`align-${align}`}
            />
          </Dropdown>
          <Dropdown
            overlay={
              <div style={{ width: '200px' }}>
                <Slider
                  min={12}
                  max={256}
                  defaultValue={size}
                  onAfterChange={this.changeHandler.bind(null, 'size')}
                />
              </div>
            }
            placement="bottomLeft"
            trigger={['click']}
            overlayStyle={{
              backgroundColor: '#ddd',
            }}
          >
            <Button type="primary" icon="font-size">
              {' '}
              {size}
            </Button>
          </Dropdown>
          <Dropdown
            overlay={
              <div style={{ width: '200px' }}>
                <Slider
                  min={0}
                  max={64}
                  defaultValue={padding}
                  onAfterChange={this.changeHandler.bind(null, 'padding')}
                />
              </div>
            }
            placement="bottomLeft"
            trigger={['click']}
            overlayStyle={{
              backgroundColor: '#ddd',
            }}
          >
            <Button type="primary" icon="border">
              {' '}
              {padding}
            </Button>
          </Dropdown>
          <Dropdown
            overlay={
              <div>
                <BlockPicker color={color || '#333'} onChangeComplete={this.handleChangeComplete} />
              </div>
            }
            placement="bottomCenter"
            trigger={['click']}
            overlayStyle={{
              backgroundColor: color,
            }}
            visible={this.state.visible === 'color'}
          >
            <Button
              type="primary"
              icon="bg-colors"
              onClick={this.changeVisible.bind(null, 'color')}
            >
              {' '}
              <div
                style={{ float: 'right', width: '20px', height: '20px', backgroundColor: color || '#333' }}
              />
            </Button>
          </Dropdown>
          <Button
            onClick={this.changeHandler.bind(null, 'weight', !weight)}
            type={`${weight ? 'primary' : ''}`}
            icon="bold"
          />
          <Button
            onClick={this.changeHandler.bind(null, 'italic', !italic)}
            type={`${italic ? 'primary' : ''}`}
            icon="italic"
          />
          <Button
            onClick={this.changeHandler.bind(null, 'underline', !underline)}
            type={`${underline ? 'primary' : ''}`}
            icon="underline"
          />
          <Button
            onClick={this.changeHandler.bind(null, 'throughline', !throughline)}
            type={`${throughline ? 'primary' : ''}`}
            icon="strikethrough"
          />
        </ButtonGroup>
        <TextArea
          placeholder="请输入文本内容"
          defaultValue={value}
          onChange={this.changeHandler.bind(null, 'value')}
        />
      </div>
    );
  }
}
