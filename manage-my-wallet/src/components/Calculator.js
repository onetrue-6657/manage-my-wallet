import React, { useState } from "react";
import ReactSlider from "react-slider";

const Calculator = ({ expenses }) => {
  const [filter, setFilter] = useState({
    category: "",
    source: "",
    amountRange: [0, 10000],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilter((prevFilter) => ({
      ...prevFilter,
      [name]: value,
    }));
  };

  const handleRangeChange = (value) => {
    setFilter((prevFilter) => ({
      ...prevFilter,
      amountRange: value,
    }));
  };

  const sources = [...new Set(expenses.map((expense) => expense.source))];

  const categories = [...new Set(expenses.map((expense) => expense.category))];

  const filteredExpenses = expenses.filter((expense) => {
    const matchesCategory = filter.category
      ? expense.category === filter.category
      : true;
    const matchesSource = filter.source
      ? expense.source === filter.source
      : true;
    const matchesAmountRange =
      expense.amount >= filter.amountRange[0] &&
      expense.amount <= filter.amountRange[1];

    return matchesCategory && matchesSource && matchesAmountRange;
  });

  const totalAmount = filteredExpenses
    .reduce((total, expense) => total + parseFloat(expense.amount), 0)
    .toFixed(2);

  const totalTransactions = filteredExpenses.length;
  return (
    <div className="calculator">
      <div className="filter-section">
        <h2>Filter</h2>
        <div className="filter-group">
          <label htmlFor="category">Category:</label>
          <select
            id="category"
            name="category"
            value={filter.category}
            onChange={handleChange}
          >
            <option value="">All</option>
            {categories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <label htmlFor="source">Source:</label>
          <select
            id="source"
            name="source"
            value={filter.source}
            onChange={handleChange}
          >
            <option value="">All</option>
            {sources.map((source, index) => (
              <option key={index} value={source}>
                {source}
              </option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <label htmlFor="minAmount">Amount Range:</label>
          <ReactSlider
            className="horizontal-slider"
            thumbClassName="thumb"
            trackClassName="track"
            min={0}
            max={1000}
            value={filter.amountRange}
            onChange={handleRangeChange}
            ariaLabel={["Lower thumb", "Upper thumb"]}
            ariaValuetext={(state) => `Thumb value ${state.valueNow}`}
          />
          <div>
            <span>Min: ${filter.amountRange[0]} </span>
            <span>Max: ${filter.amountRange[1]}</span>
          </div>
        </div>
        <div className="total-amount">
          <h3>Total Amount: ${totalAmount}</h3>
        </div>
        <div className="total-transactions">
          <h3>Total Transactions: {totalTransactions}</h3>
        </div>
        <div className="result-section">
          <h2>Results</h2>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Category</th>
                <th>Source</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.length > 0 ? (
                filteredExpenses.map((expense, index) => (
                  <tr key={index}>
                    <td>{expense.name}</td>
                    <td>${expense.amount}</td>
                    <td>{expense.date}</td>
                    <td>{expense.category}</td>
                    <td>{expense.source}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">No Records.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Calculator;
