import classNames from "classnames";
import styles from "./Back.module.scss";
import { useNavigate } from "react-router-dom";
const Back = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(`/`);
  };
  return (
    <div className={styles.back} onClick={handleBack}>
      <i className={classNames(styles.left)}></i>
      Back
    </div>
  );
};

export default Back;
