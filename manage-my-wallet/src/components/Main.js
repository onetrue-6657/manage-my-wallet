import React, { useEffect, useState, useRef } from "react";
import { NumericFormat } from "react-number-format";
import PieChart from "./PieChart";
import AddExpense from "./AddExpense";
import copyIcon from "../icons/copy.png";
import editIcon from "../icons/edit.png";
import removeIcon from "../icons/remove.png";

const Main = () => {
  const [expensesList, setExpensesList] = useState(() => {
    const storedExpenses = localStorage.getItem("expensesList");
    return storedExpenses ? JSON.parse(storedExpenses) : [];
  });

  const [activeSection, setActiveSection] = useState("add-expense");

  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

  const handleNavClick = (section) => {
    setActiveSection(section);
  };

  const [expense, setExpense] = useState({
    name: "",
    amount: "",
    date: "",
    category: "",
    source: "",
  });

  const [sortOrder, setSortOrder] = useState("asc");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const tableRef = useRef(null);

  const [editingIndex, setEditingIndex] = useState(null);
  const [filteredExpenses, setFilteredExpenses] = useState([]);

  useEffect(() => {
    const storedExpenses = localStorage.getItem("expensesList");
    console.log("Loaded from storage:", storedExpenses);
    if (storedExpenses) {
      setExpensesList(JSON.parse(storedExpenses));
    }
  }, []);

  useEffect(() => {
    console.log("Saving to storage:", expensesList);
    localStorage.setItem("expensesList", JSON.stringify(expensesList));
  }, [expensesList]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setExpense((prevExpense) => ({
      ...prevExpense,
      [name]: value,
    }));
  };

  const handleAmountChange = (values) => {
    const { value } = values;
    setExpense((prevExpense) => ({
      ...prevExpense,
      amount: value,
    }));
  };

  const toggleSortOrder = () => {
    setSortOrder((prevOrder) => {
      const newOrder = prevOrder === "asc" ? "desc" : "asc";
      const sortedList = [...expensesList].sort((a, b) => {
        return newOrder === "asc"
          ? new Date(a.date) - new Date(b.date)
          : new Date(b.date) - new Date(a.date);
      });
      setExpensesList(sortedList);
      return newOrder;
    });
  };
  const [currentExpenses, setCurrentExpenses] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedExpenses =
      editingIndex !== null
        ? expensesList.map((item, index) =>
            index === editingIndex ? expense : item
          )
        : [...expensesList, expense];

    const sortedExpenses = updatedExpenses.sort((a, b) => {
      return sortOrder === "asc"
        ? new Date(a.date) - new Date(b.date)
        : new Date(b.date) - new Date(a.date);
    });

    setExpensesList(sortedExpenses);

    setExpense({
      name: "",
      amount: "",
      category: "",
      source: "",
      date: "",
    });

    setEditingIndex(null);
  };

  const getCurrentYearMonth = (date) => {
    return date.toISOString().slice(0, 7); 
  };

  const handleRemove = (index) => {
    const expenseToRemove = currentExpenses[index];
    const globalIndex = expensesList.findIndex(
      (exp) => exp === expenseToRemove
    );
    if (globalIndex !== -1) {
      setExpensesList((prevList) =>
        prevList.filter((_, i) => i !== globalIndex)
      );
    }
  };

  const handleClear = (index) => {
    setExpense({
      name: "",
      amount: "",
      category: "",
      source: "",
      date: "",
    });
  };

  const handleCopy = (index) => {
    const expenseToCopy = currentExpenses[index];

    if (expenseToCopy) {
      setExpense({
        name: expenseToCopy.name,
        amount: expenseToCopy.amount,
        category: expenseToCopy.category,
        source: expenseToCopy.source,
        date: expenseToCopy.date,
      });
    }
  };

  const totalAmount = expensesList
    .reduce((total, item) => total + parseFloat(item.amount || 0), 0)
    .toFixed(2);
  
  const totalTransactions = expensesList.length;

  useEffect(() => {
    const currentYearMonth = `${new Date().getFullYear()}-${String(selectedMonth).padStart(2, '0')}`;
  
    const filtered = expensesList.filter((expense) => {
      const expenseYearMonth = getCurrentYearMonth(new Date(expense.date));
      return expenseYearMonth === currentYearMonth;
    });
  
    setFilteredExpenses(filtered);
    setCurrentPage(1); 
  }, [expensesList, selectedMonth]);

  useEffect(() => {
    const indexOfLastExpense = currentPage * itemsPerPage;
    const indexOfFirstExpense = indexOfLastExpense - itemsPerPage;
    const current = filteredExpenses.slice(indexOfFirstExpense, indexOfLastExpense);
    setCurrentExpenses(current);
  }, [filteredExpenses, currentPage, itemsPerPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedMonth]);
  
  const totalPages = Math.ceil(
    expensesList.filter((expense) => {
      const expenseMonth = new Date(expense.date).getMonth() + 1;
      return expenseMonth === selectedMonth;
    }).length / itemsPerPage
  );

  const handleEdit = (index) => {
    const expenseToEdit = currentExpenses[index];
    const globalIndex = expensesList.findIndex((exp) => exp === expenseToEdit);
    setExpense(expenseToEdit);
    setEditingIndex(globalIndex);
  };

  const handlePageChange = (direction) => {
    setCurrentPage((prevPage) => {
      const newPage = direction === "next" ? prevPage + 1 : prevPage - 1;
      return Math.min(Math.max(newPage, 1), totalPages);
    });
  };

  return (
    <div className="add">
      <div className="container">
        <div className="left-section">
          <h2>Expense List</h2>
          <div className="total-info">
            <p>Total Amount: ${totalAmount}</p>
            <p>Total Transactions: {totalTransactions}</p>
          </div>
          <div className="month-filter">
            <label htmlFor="month-select">Filter by Month:</label>
            <select
              id="month-select"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
            >
              <option value="1">January</option>
              <option value="2">February</option>
              <option value="3">March</option>
              <option value="4">April</option>
              <option value="5">May</option>
              <option value="6">June</option>
              <option value="7">July</option>
              <option value="8">August</option>
              <option value="9">September</option>
              <option value="10">October</option>
              <option value="11">November</option>
              <option value="12">December</option>
            </select>
          </div>
          <table ref={tableRef}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Category</th>
                <th>Source</th>
                <th>Operation</th>
              </tr>
            </thead>
            <tbody>
            {currentExpenses.length > 0 ? (
              currentExpenses.map((item, index) => (
                <tr key={index}>
                  <td>{item.name}</td>
                  <td>
                    <NumericFormat
                      value={item.amount}
                      displayType="text"
                      thousandSeparator={true}
                      prefix="$"
                      decimalScale={2}
                      fixedDecimalScale={true}
                    />
                  </td>
                  <td>{item.date}</td>
                  <td>{item.category}</td>
                  <td>{item.source}</td>
                  <td className="operation-column">
                    <div className="operation-button">
                      <button onClick={() => handleRemove(index)}>
                        <img src={removeIcon} alt="Remove" />
                      </button>
                      <button onClick={() => handleCopy(index)}>
                        <img src={copyIcon} alt="Copy" />
                      </button>
                      <button onClick={() => handleEdit(index)}>
                        <img src={editIcon} alt="Edit" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No Records.</td>
              </tr>
            )}
            </tbody>
          </table>

          {totalPages === 0 ? (
            <span><p style={{ textAlign: "center" }}>Page 0 of 0</p></span>
          ) : (
            <div className="pagination">
              <button onClick={toggleSortOrder}>
                Sort by Date {sortOrder === "asc" ? "Descending" : "Ascending"}
              </button>
              <button
                onClick={() => handlePageChange("previous")}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span>
                Page {totalPages === 0 ? 0 : currentPage} of {totalPages}
              </span>
              <button
                onClick={() => handlePageChange("next")}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )};
          </div>

        <div className="right-section">
          <nav className="navbar">
            <ul>
              <li>
                <button onClick={() => handleNavClick("add-expense")}>
                  Add an Expense
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick("view-ratio")}>
                  View Expenses Ratio
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick("category")}>
                  Expenses by Category
                </button>
              </li>
            </ul>
          </nav>

          {activeSection === "add-expense" && (
            <AddExpense
              expense={expense}
              handleChange={handleChange}
              handleAmountChange={handleAmountChange}
              handleSubmit={handleSubmit}
              handleClear={handleClear}
            />
          )}
          {activeSection === "view-ratio" && (
            <PieChart expenses={expensesList} />
          )}
          {activeSection === "category" && <div>Expense By Category</div>}
        </div>
      </div>
    </div>
  );
};

export default Main;
