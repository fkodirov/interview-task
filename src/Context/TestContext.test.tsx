import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import axios from 'axios';
import { TestProvider, useTestContext } from './TestContext';
import React from 'react';

vi.mock('axios');

describe('TestContext', () => {
  test('fetches and provides test and site data', async () => {
    const testsMock = [
      { id: 19, name: 'A/B Test Example', type: 'A/B', status: 'RUNNING', siteId: 5 },
      { id: 56, name: 'UI Experiment', type: 'MVT', status: 'PAUSED', siteId: 7 },
    ];
    const sitesMock = [
      { id: 5, url: 'https://example.com' },
      { id: 7, url: 'https://anotherexample.com' },
    ];

    vi.mocked(axios.get).mockImplementation((url) => {
      if (url.includes('/tests')) return Promise.resolve({ data: testsMock });
      if (url.includes('/sites')) return Promise.resolve({ data: sitesMock });
      return Promise.reject(new Error('Not found'));
    });

    const TestComponent = () => {
      const { tests, sites, getTestById, getSiteUrl } = useTestContext();
      return (
        <div>
          <p data-testid="test-name">{getTestById(19)?.name}</p>
          <p data-testid="test-site">{getSiteUrl(7)}</p>
        </div>
      );
    };

    render(
      <TestProvider>
        <TestComponent />
      </TestProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('test-name')).toHaveTextContent('A/B Test Example');
      expect(screen.getByTestId('test-site')).toHaveTextContent('https://anotherexample.com');
    });
  });

  test('handles errors when fetching data', async () => {
    vi.mocked(axios.get).mockRejectedValue(new Error('Network Error'));

    const TestComponent = () => {
      const { error } = useTestContext();
      return <p data-testid="error">{error}</p>;
    };

    render(
      <TestProvider>
        <TestComponent />
      </TestProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('error')).toHaveTextContent('Failed to fetch data');
    });
  });

  test('useTestContext throws error when used outside TestProvider', () => {
    const TestComponent = () => {
      useTestContext(); 
      return <p>Should not render</p>;
    };

    expect(() => render(<TestComponent />)).toThrowError(
      'useTestContext must be used within a TestProvider'
    );
  });
});
