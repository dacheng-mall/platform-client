import React from 'react';

export default function Img(props) {
  const {value, name = ''} = props.data;
  return <img style={{width: '100%', margin: '0.04rem 0 0'}} src={value} alt={name} />
}