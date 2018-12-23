import React from "react";
import _ from 'lodash';
import Text from './Text';

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
          <Text key={`${d.type}_${i}`} data={d} />
        )
      }
      default: {
        return null;
      }
    }
  });
}