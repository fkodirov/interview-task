import styles from "./Loader.module.scss";
const Loader = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.loader} data-testid="loader"></div>
    </div>
  );
};

export default Loader;
