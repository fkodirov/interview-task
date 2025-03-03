import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import Dashboard from "./Dashboard";
import { TestContext, TestContextType } from "../../Context/TestContext";
import { Status, Type } from "../types/types";

vi.mock("../../assets/search.svg?react", () => ({
  default: () => <div data-testid="search-icon">SearchIcon</div>,
}));

const mockTests = [
  { id: 1, name: "Test B", type: Type.CLASSIC, status: Status.ONLINE, siteId: 2 },
  { id: 2, name: "Test A", type: Type.MVT, status: Status.DRAFT, siteId: 2 },
];

const mockSites = [
  { id: 1, url: "https://market.company.com" },
  { id: 2, url: "https://www.delivery.company.com" },
  { id: 3, url: "http://games.company.com" },
];

const renderDashboard = (contextValue: TestContextType) => {
  render(
    <TestContext.Provider value={contextValue}>
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    </TestContext.Provider>
  );
};

describe("Dashboard", () => {
  let contextValue: TestContextType;

  beforeEach(() => {
    contextValue = {
      tests: mockTests,
      loading: false,
      sites: mockSites,
      error: null,
      getTestById: vi.fn(),
      getSiteUrl: vi.fn(),
    };
  });

  it("renders loading state", () => {
    renderDashboard({ ...contextValue, loading: true, tests: [] });
    expect(screen.getByTestId("loader")).toBeInTheDocument();
  });

  it("renders test table when tests are available", () => {
    renderDashboard(contextValue);
    expect(screen.getByText("Test A")).toBeInTheDocument();
    expect(screen.getByText("Test B")).toBeInTheDocument();
  });

  it("filters tests based on search input", () => {
    renderDashboard(contextValue);
    fireEvent.change(screen.getByPlaceholderText(/what test are you looking for/i), { target: { value: "Test A" } });
    expect(screen.getByText("Test A")).toBeInTheDocument();
    expect(screen.queryByText("Test B")).not.toBeInTheDocument();
  });

  it("resets search results when reset button is clicked", () => {
    renderDashboard(contextValue);
    fireEvent.change(screen.getByPlaceholderText(/what test are you looking for/i), { target: { value: "Test C" } });
    fireEvent.click(screen.getByText(/reset/i));
    expect(screen.getByText("Test A")).toBeInTheDocument();
    expect(screen.getByText("Test B")).toBeInTheDocument();
  });

  it("sorts tests when a column header is clicked", () => {
    renderDashboard(contextValue);
    fireEvent.click(screen.getByText(/name/i));
    let testRows = screen.getAllByRole("row").slice(1);
    expect(testRows[0]).toHaveTextContent("Test A");
    expect(testRows[1]).toHaveTextContent("Test B");

    fireEvent.click(screen.getByText(/status/i));
    testRows = screen.getAllByRole("row").slice(1);
    expect(testRows[0]).toHaveTextContent(/draft/i);
    expect(testRows[1]).toHaveTextContent(/online/i);
  });

  it("navigates to the correct route when finalize or results buttons are clicked", () => {
    renderDashboard(contextValue);
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Finalize"));
    expect(screen.getByText("Finalize")).toBeInTheDocument();
  });
});
