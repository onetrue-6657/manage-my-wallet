import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";
import { NumericFormat } from "react-number-format";

ChartJS.register(ArcElement, Tooltip, Legend, Title);

const PieChart = ({ expenses }) => {
  if (!expenses.length) {
    return <div>No expenses available</div>;
  }

  const categoryMap = new Map();
  expenses.forEach((expense) => {
    const category = expense.category;
    const amount = parseFloat(expense.amount) || 0;

    if (categoryMap.has(category)) {
      categoryMap.set(category, categoryMap.get(category) + amount);
    } else {
      categoryMap.set(category, amount);
    }
  });

  const categories = Array.from(categoryMap.keys());
  const amounts = Array.from(categoryMap.values());

  const data = {
    labels: categories,
    datasets: [
      {
        data: amounts,
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)", // Red
          "rgba(54, 162, 235, 0.2)", // Blue
          "rgba(255, 206, 86, 0.2)", // Yellow
          "rgba(75, 192, 192, 0.2)", // Green
          "rgba(153, 102, 255, 0.2)", // Purple
          "rgba(255, 159, 64, 0.2)", // Orange
          "rgba(255, 204, 204, 0.2)", // Light Red
          "rgba(204, 255, 204, 0.2)", // Light Green
          "rgba(204, 204, 255, 0.2)", // Light Blue
          "rgba(255, 204, 102, 0.2)", // Light Yellow
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
          "rgba(255, 204, 204, 1)", // Light Red
          "rgba(204, 255, 204, 1)", // Light Green
          "rgba(204, 204, 255, 1)", // Light Blue
          "rgba(255, 204, 102, 1)", // Light Yellow
        ],
        borderWidth: 1,
      },
    ],
  };

  const categoryData = expenses.reduce((acc, expense) => {
    acc[expense.category] =
      (acc[expense.category] || 0) + parseFloat(expense.amount);
    return acc;
  }, {});

  const options = {
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => {
            const category = context.label;
            const amount = categoryData[category];
            return `${category}: $${amount.toFixed(2)}`;
          },
        },
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        marginTop: "5%",
        height: "100%",
        width: "100%",
      }}
    >
      <div style={{ width: "500px", height: "500px" }}>
        <Pie data={data} options={options} />
      </div>
    </div>
  );
};

export default PieChart;
