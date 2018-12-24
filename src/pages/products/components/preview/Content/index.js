import React from "react";
import _ from 'lodash';
import Text from './Text';
import Img from './Img';
import List from './List';

export default function Content(props){
  const {data = []} = props;
  return _.map(data, (d, i) => {
    switch(d.type){
      case 'text': {
        return (
          <Text key={`${d.type}_${i}`} data={d} />
        )
      }
      case 'image': {
        return (
          <Img key={`${d.type}_${i}`} data={d} />
        )
      }
      case 'list': {
        return (
          <List key={`${d.type}_${i}`} data={d} index={i} />
        )
      }
      default: {
        return null;
      }
    }
  });
}