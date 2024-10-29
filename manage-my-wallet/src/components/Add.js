import React, { useEffect, useState } from "react";
import { NumericFormat } from "react-number-format";

const AddExpense = () => {
  const [expensesList, setExpensesList] = useState(() => {
    const storedExpenses = localStorage.getItem("expensesList");
    return storedExpenses ? JSON.parse(storedExpenses) : [];
  });

  const [expense, setExpense] = useState({
    name: "",
    amount: "",
    date: "",
    category: "",
    source: "",
  });

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

  const totalAmount = expensesList
    .reduce((total, item) => total + parseFloat(item.amount || 0), 0)
    .toFixed(2);
  const totalTransactions = expensesList.length;

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
            onValueChange={handleAmountChange}
            value={expense.amount}
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
      <div className="total-info">
        <p>Total Amount: ${totalAmount}</p>
        <p>Total Transactions: {totalTransactions}</p>
      </div>
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
