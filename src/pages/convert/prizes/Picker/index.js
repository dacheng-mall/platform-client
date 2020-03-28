import { PureComponent } from 'react';
import _ from 'lodash';
import { Input, Icon } from 'antd';
import {
  findInst,
  findProducts,
  findPrizes,
  findMissionPrize,
  findGatheringProducts,
} from './services';

const source = window.config.source;
const Search = Input.Search;

export default class InstPicker extends PureComponent {
  state = {
    data: [],
  };
  fetchInst = async (name) => {
    const { data } = await findInst({ name });
    this.setState({
      data,
    });
  };
  fetchProducts = async (title) => {
    const { data } = await findProducts({ title });
    this.setState({
      data,
    });
  };
  findMissionPrize = async (name) => {
    const { data } = await findMissionPrize({ name });
    this.setState({
      data,
    });
  };
  findGatheringProducts = async (name) => {
    const { data } = await findGatheringProducts({ name });
    this.setState({
      data,
    });
  };
  fetchPeizes = async (name) => {
    const { data } = await findPrizes({
      name,
    });
    this.setState({
      data,
    });
  };
  onSearch = (val) => {
    const _val = _.trim(val);
    console.log('val', this.props.type);
    if (_val) {
      switch (this.props.type) {
        case 'inst': {
          this.fetchInst(_val);
          break;
        }
        case 'product': {
          this.fetchProducts(_val);
          break;
        }
        case 'prize': {
          this.fetchPeizes(_val);
          break;
        }
        case 'missionPrize': {
          this.findMissionPrize(_val);
          break;
        }
        case 'gatheringProducts': {
          console.log('------');
          this.findGatheringProducts(_val);
          break;
        }
      }
    }
  };
  onCheck = (val) => {
    switch (this.props.type) {
      case 'inst': {
        const { name, id, level, shortName, autoId, code } = val;
        this.props.onChange({ name, id, level, shortName, autoId, code });
        break;
      }
      case 'product': {
        const {
          title,
          id,
          price,
          mainImageUrl: image,
          autoId,
          category: { id: cateId, name: cateName },
        } = val;
        this.props.onChange({ name: title, id, price, image, autoId, cateId, cateName });
        break;
      }
      case 'prize':
      case 'missionPrize': {
        this.props.onChange(val);
        break;
      }
      default: {
        this.props.onChange(val);
        break;
      }
    }
  };
  clear = () => {
    this.props.onChange(null);
  };
  render() {
    if (this.props.value) {
      const { name, image } = this.props.value;
      return (
        <div
          onClick={this.clear}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            border: '1px solid #ddd',
            borderRadius: '5px',
            backgroundColor: '#fff',
            padding: '0 10px',
          }}
        >
          <div>
            {image && (
              <img
                style={{ width: '44px', marginLeft: '-10px', marginRight: '10px' }}
                src={`${source}${image}`}
              />
            )}
            {name}
          </div>
          <div>
            <Icon type="close-circle" theme="twoTone" twoToneColor="#52c41a" /> 清除
          </div>
        </div>
      );
    }
    return (
      <div>
        <Search onSearch={this.onSearch} placeholder="根据名称关键字查询" />
        <div style={{ maxHeight: `${this.props.maxHeight || '200px'}`, overflow: 'auto' }}>
          {this.state.data.length > 0
            ? _.map(this.state.data, (d) => {
                return (
                  <div
                    key={d.id}
                    onClick={this.onCheck.bind(null, d)}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      border: '1px solid #ddd',
                      borderRadius: '5px',
                      backgroundColor: '#fff',
                      padding: '0 10px',
                      margin: '10px 0',
                    }}
                  >
                    <div>{d.name || d.title}</div>
                    <Icon type="check-circle" theme="twoTone" twoToneColor="#52c41a" />
                  </div>
                );
              })
            : null}
        </div>
      </div>
    );
  }
}
