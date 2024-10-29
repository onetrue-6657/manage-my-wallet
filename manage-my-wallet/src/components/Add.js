import React, { useState } from "react";
import { NumericFormat } from "react-number-format";

const AddExpense = () => {
  const [expense, setExpense] = useState({
    name: "",
    amount: "",
    date: "",
    category: "",
    source: "",
  });

  const [expensesList, setExpensesList] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setExpense((prevExpense) => ({
      ...prevExpense,
      [name]: value,
    }));
  };

  const handleSumbit = (e) => {
    e.preventDefault();
    setExpensesList((prevList) => [...prevList, expense]);

    setExpense({
      name: "",
      amount: "",
      category: "",
      source: "",
      date: "",
    });
  };

  const handleRemove = (index) => {
    setExpensesList((prevList) => prevList.filter((_, i) => i !== index));
  };

  return (
    <div className="add">
      <h2>Add an expense</h2>
      <form onSubmit={handleSumbit}>
        <div className="form-group">
          <label>Name: </label>
          <input
            type="text"
            name="name"
            value={expense.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Amount: </label>
          <NumericFormat
            id="amount"
            name="amount"
            className="amount-input"
            prefix="$"
            thousandSeparator={true}
            decimalScale={2}
            fixedDecimalScale={true}
            allowNegative={false}
            placeholder="$0.00"
          />
        </div>
        <div className="form-group">
          <label>Date: </label>
          <input
            type="date"
            name="date"
            value={expense.date}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Category: </label>
          <input
            type="text"
            name="category"
            value={expense.category}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Source: </label>
          <input
            type="text"
            name="source"
            value={expense.source}
            onChange={handleChange}
            required
          />
        </div>
        <div className="submit-button">
          <button type="submit">Submit</button>
        </div>
      </form>

      <h3>Expense List</h3>
      <table>
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
          {expensesList.map((item, index) => (
            <tr key={index}>
              <td>{item.name}</td>
              <td>{item.amount}</td>
              <td>{item.date}</td>
              <td>{item.category}</td>
              <td>{item.source}</td>
              <td>
                <button onClick={() => handleRemove(index)}>Remove</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {expensesList.length === 0 && <p>No Records.</p>}
    </div>
  );
};

export default AddExpense;
