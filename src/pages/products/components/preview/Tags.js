import React from 'react';
import _ from 'lodash';
import { Tag } from "antd";
import styles from './styles.less';

export default function Tags({data}){
  return (
    <div className={styles.tags}>
      {_.map(data, (tag, i) => <Tag className={styles.tag} color="red" key={`tag_${i}`}>{tag}</Tag>)}
    </div>
  );
}