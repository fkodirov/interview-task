import { useParams } from 'react-router-dom'
import { useTestContext } from '../../Context/TestContext'
import styles from "./Finalize.module.scss"
import Back from '../Back/Back'

const Finalize = () => {
  const { testId } = useParams<{ testId: string }>()
  const { getTestById } = useTestContext()
  const test = getTestById(Number(testId))

  if (!test) return <div>Test not found</div>

  return (
    <div className={styles.finalize}>
      <h1>Finalize</h1>
      <div>{test.name}</div>
      <Back/>
    </div>
  )
}

export default Finalize