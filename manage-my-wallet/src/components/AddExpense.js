import React from "react";
import { NumericFormat } from "react-number-format";

const AddExpense = ({
  expense,
  handleChange,
  handleAmountChange,
  handleSubmit,
}) => {
  return (
    <div className="add-expense">
      <h2>Add an expense</h2>
      <form onSubmit={handleSubmit}>
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
    </div>
  );
};

export default AddExpense;
