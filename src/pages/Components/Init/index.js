import React from 'react';
import styles from "./styles.less";

export default function(props){
  return <div className={styles.wrap}>{props.title}</div>
}