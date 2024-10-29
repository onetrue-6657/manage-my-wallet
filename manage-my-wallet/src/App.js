import React from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Add from "./components/Add";
import "./styles/App.css";

function App() {
  return (
    <div>
      <Header />
      <main>
        <div className="intro">
          <h2>Welcome to Manage My Wallet!</h2>
          <p>
            This is a simple application for managing your personal finances.
            You can add, update, and delete transactions, as well as calculate
            your net worth.
          </p>
        </div>
        <Add />
      </main>
      <Footer />
    </div>
  );
}

export default App;
