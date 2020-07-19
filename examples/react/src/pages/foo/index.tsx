import React from 'react';
import styles from './index.less';

const FooPage: React.FC = () => {
  return (
    <h1 className={styles['foo-title']}>Foo Route in React.js App</h1>
  );
};

export default FooPage;
