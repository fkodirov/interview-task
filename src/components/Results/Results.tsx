import { useParams } from 'react-router-dom'
import { useTestContext } from '../../Context/TestContext'
import Back from '../Back/Back'

const Results = () => {
  const { testId } = useParams<{ testId: string }>()
  const { getTestById } = useTestContext()
  const test = getTestById(Number(testId))

  if (!test) return <div>Test not found</div>

  return (
    <div>
      <h1>Results</h1>
      <div>{test.name}</div>
      <Back/>
    </div>
  )
}

export default Results