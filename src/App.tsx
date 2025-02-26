import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { TestProvider } from './Context/TestContext'
import Dashboard from './components/Dashboard/Dashboard'
import Results from './components/Results/Results'
import Finalize from './components/Finalize/Finalize'

function App() {
  return (
    <TestProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/results/:testId" element={<Results />} />
          <Route path="/finalize/:testId" element={<Finalize />} />
        </Routes>
      </Router>
    </TestProvider>
  )
}

export default App