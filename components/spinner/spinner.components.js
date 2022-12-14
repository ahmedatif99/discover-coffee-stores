import React from "react";
import styles from "./spinner.module.css";

const Spinner = () => {
  return (
    <div className={styles.loader_container}>
      <div className={styles.loader}>Loading...</div>
    </div>
  );
};

export default Spinner;
