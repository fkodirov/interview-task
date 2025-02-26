import styles from "./Dashboard.module.scss";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TestTable from "../TestTable/TestTable";
import FormText from "../UI/form/FormText/FormText";
import { Test, Status } from "../types/types";
import SearchIcon from "../../assets/search.svg?react";
import NoData from "../NoData/NoData";
import { useTestContext } from "../../Context/TestContext";
import Loader from "../Loader/Loader";

const Dashboard = () => {
  const { tests, loading } = useTestContext();
  const [filteredTests, setFilteredTests] = useState<Test[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setFilteredTests(tests);
  }, [tests]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value;
    setSearchTerm(term);
    const filtered = tests.filter((test) =>
      test.name.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredTests(filtered);
  };

  const handleReset = () => {
    setSearchTerm("");
    setFilteredTests(tests);
  };

  const handleSort = (column: keyof Test) => {
    const sorted = [...filteredTests].sort((a, b) => {
      if (column === "status") {
        const order = [
          Status.ONLINE,
          Status.PAUSED,
          Status.STOPPED,
          Status.DRAFT,
        ];
        return order.indexOf(a[column]) - order.indexOf(b[column]);
      }
      return a[column].toString().localeCompare(b[column].toString());
    });
    setFilteredTests(sorted);
  };

  const handleAction = (testId: number, action: "results" | "finalize") => {
    navigate(`/${action}/${testId}`);
  };

  return (
    <div className={styles.dashboard}>
      <h1>Dashboard</h1>
      {loading && <Loader/>}
      {!loading && (
        <>
          <FormText
            className={styles.searchForm}
            onChange={handleSearch}
            value={searchTerm}
            Icon={SearchIcon}
            placeholder="What test are you looking for?"
          />
          {filteredTests.length ? (
            <TestTable
              tests={filteredTests}
              onSort={handleSort}
              onAction={handleAction}
            />
          ) : (
            <NoData onReset={handleReset} />
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;
