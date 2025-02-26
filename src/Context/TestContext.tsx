import React, { createContext, useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { Test, Site } from '../components/types/types'

interface TestContextType {
  tests: Test[]
  sites: Site[]
  loading: boolean
  error: string | null
  getTestById: (id: number) => Test | undefined
  getSiteUrl: (siteId: number) => string
}
const BASE_URL= 'http://localhost:3100';

const TestContext = createContext<TestContextType | undefined>(undefined)

export const TestProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tests, setTests] = useState<Test[]>([])
  const [sites, setSites] = useState<Site[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [testsResponse, sitesResponse] = await Promise.all([
          axios.get<Test[]>(`${BASE_URL}/tests`),
          axios.get<Site[]>(`${BASE_URL}/sites`)
        ])
        setTests(testsResponse.data)
        setSites(sitesResponse.data)
        setLoading(false)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        setError('Failed to fetch data')
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const getTestById = (id: number) => tests.find(test => test.id === id)

  const getSiteUrl = (siteId: number) => {
    const site = sites.find(site => site.id === siteId)
    return site ? site.url : ''
  }

  return (
    <TestContext.Provider value={{ tests, sites, loading, error, getTestById, getSiteUrl }}>
      <section>{children}</section>
    </TestContext.Provider>
  )
}

export const useTestContext = () => {
  const context = useContext(TestContext)
  if (context === undefined) {
    throw new Error('useTestContext must be used within a TestProvider')
  }
  return context
}