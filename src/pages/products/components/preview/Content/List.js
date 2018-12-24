import React from 'react';
import _ from 'lodash';
import styles from "./styles.less";

export default function List({ data, index }) {
  const { value } = data;
  return (
    <ul className={styles.list}>
      {_.map(value, ({ label, content }, i) => {
        return <li key={`list_${index}_${i}`} style={{backgroundColor: i%2 === 0 ? '#eee' : '#fff'}}><span>{label}</span><div>{content}</div></li>;
      })}
    </ul>
  );
}
