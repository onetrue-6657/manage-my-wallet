import React, { useEffect, useState, useRef } from "react";
import { NumericFormat } from "react-number-format";
import PieChart from "./PieChart";
import AddExpense from "./AddExpense";
import copyIcon from "../icons/copy.png";
import editIcon from "../icons/edit.png";
import removeIcon from "../icons/remove.png";

const Add = () => {
  const [expensesList, setExpensesList] = useState(() => {
    const storedExpenses = localStorage.getItem("expensesList");
    return storedExpenses ? JSON.parse(storedExpenses) : [];
  });

  const [activeSection, setActiveSection] = useState("add-expense");

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

    setEditingIndex(null); // 结束编辑状态
  };

  const handleRemove = (index) => {
    setExpensesList((prevList) => prevList.filter((_, i) => i !== index));
  };

  const handleCopy = (index) => {
    setExpense({
      name: expensesList[index].name,
      amount: expensesList[index].amount,
      category: expensesList[index].category,
      source: expensesList[index].source,
      date: expensesList[index].date,
    });
  };

  const handleEdit = (index) => {
    const expenseToEdit = expensesList[index];
    setExpense(expenseToEdit);
    setEditingIndex(index);
  };

  const totalAmount = expensesList
    .reduce((total, item) => total + parseFloat(item.amount || 0), 0)
    .toFixed(2);
  const totalTransactions = expensesList.length;

  const indexOfLastExpense = currentPage * itemsPerPage;
  const indexOfFirstExpense = indexOfLastExpense - itemsPerPage;
  const currentExpenses = expensesList.slice(
    indexOfFirstExpense,
    indexOfLastExpense
  );

  const totalPages = Math.ceil(expensesList.length / itemsPerPage);

  const handlePageChange = (direction) => {
    const scrollY = tableRef.current.scrollTop;
    setCurrentPage((prevPage) => {
      const newPage = direction === "next" ? prevPage + 1 : prevPage - 1;
      return Math.min(Math.max(newPage, 1), totalPages);
    });

    tableRef.current.scrollTop = scrollY;
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
              {currentExpenses.map((item, index) => (
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
              ))}
            </tbody>
          </table>

          {expensesList.length === 0 && <p>No Records.</p>}

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
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange("next")}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
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

export default Add;
