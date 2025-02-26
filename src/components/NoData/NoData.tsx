import styles from "./NoData.module.scss"

interface INoData{
  onReset: ()=>void
}
const NoData = ({onReset}:INoData) => {
  return (
    <div className={styles.notFound}>
      <h3>Your search did not match any results.</h3>
      <button className={styles.btnReset} onClick={onReset}>Reset</button>
    </div>
  );
};

export default NoData;