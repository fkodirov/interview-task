import styles from "./TestTable.module.scss";
import { useState } from "react";
import { Test, Status } from "../types/types";
import classNames from "classnames";
import { useTestContext } from "../../Context/TestContext";

interface TestTableProps {
  tests: Test[];
  onSort: (column: keyof Test, direction: "asc" | "desc") => void;
  onAction: (testId: number, action: "results" | "finalize") => void;
}

const TestTable: React.FC<TestTableProps> = ({ tests, onSort, onAction }) => {
  const { getSiteUrl } = useTestContext();
  const [sortColumn, setSortColumn] = useState<keyof Test | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const handleSort = (column: keyof Test) => {
    let direction: "asc" | "desc" = "asc";

    if (sortColumn === column) {
      direction = sortDirection === "asc" ? "desc" : "asc";
    }

    setSortColumn(column);
    setSortDirection(direction);

    onSort(column, direction);
  };

  const formatSite = (url: string) => {
    return url.replace(/^(https?:\/\/)?(www\.)?/, "");
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLTableRowElement>,
    testId: number
  ) => {
    if (e.key === "Enter") {
      onAction(testId, "results");
    } else if (e.key === " ") {
      e.preventDefault();
      onAction(testId, "finalize");
    }
  };

  const sortedTests = [...tests].sort((a, b) => {
    if (!sortColumn) return 0;

    const valueA = a[sortColumn];
    const valueB = b[sortColumn];

    if (valueA < valueB) return sortDirection === "asc" ? -1 : 1;
    if (valueA > valueB) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.tableTest}>
        <thead>
          <tr>
            <th onClick={() => handleSort("name")}>
              <div>
                Name
                {sortColumn === "name" && (
                  <i
                    className={classNames("arrow", {
                      [styles.up]: sortDirection === "asc",
                      [styles.down]: sortDirection === "desc",
                    })}
                  ></i>
                )}
              </div>
            </th>
            <th onClick={() => handleSort("type")}>
              <div>
                Type
                {sortColumn === "type" && (
                  <i
                    className={classNames("arrow", {
                      [styles.up]: sortDirection === "asc",
                      [styles.down]: sortDirection === "desc",
                    })}
                  ></i>
                )}
              </div>
            </th>
            <th onClick={() => handleSort("status")}>
              <div>
                Status
                {sortColumn === "status" && (
                  <i
                    className={classNames("arrow", {
                      [styles.up]: sortDirection === "asc",
                      [styles.down]: sortDirection === "desc",
                    })}
                  ></i>
                )}
              </div>
            </th>
            <th onClick={() => handleSort("siteId")}>
              <div>
                Site
                {sortColumn === "siteId" && (
                  <i
                    className={classNames("arrow", {
                      [styles.up]: sortDirection === "asc",
                      [styles.down]: sortDirection === "desc",
                    })}
                  ></i>
                )}
              </div>
            </th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {sortedTests.map((test) => (
            <tr
              key={test.id}
              tabIndex={0}
              onKeyDown={(e) => handleKeyDown(e, test.id)}
            >
              <td className={styles.name}>{test.name}</td>
              <td className={classNames(styles.type, styles[test.type])}>
                {test.type.replace(/_/g, "-")}
              </td>
              <td className={classNames(styles.status, styles[test.status])}>
                {test.status}
              </td>
              <td className={styles.site}>
                {formatSite(getSiteUrl(test.siteId))}
              </td>
              <td>
                {test.status === Status.DRAFT ? (
                  <button
                    className={styles.btnFinalize}
                    onClick={() => onAction(test.id, "finalize")}
                  >
                    Finalize
                  </button>
                ) : (
                  <button
                    className={styles.btnResult}
                    onClick={() => onAction(test.id, "results")}
                  >
                    Results
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TestTable;
