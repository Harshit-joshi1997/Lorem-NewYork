import React, { useEffect, useState } from "react";

const USER_ID = 123;
const API_BASE_URL = import.meta.env.VITE_API_URL || "";

const PaymentSuccess = () => {
  const [tickets, setTickets] = useState(null);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/raffle-status?userId=${USER_ID}`);
        const data = await res.json();
        setTickets(data.tickets);
      } catch {
        setTickets("?");
      }
    };
    fetchTickets();
  }, []);

  return (
    <div style={{
      minHeight: "80vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      color: "#003366",
      fontFamily: "Montserrat, sans-serif"
    }}>
      <h1 style={{ color: "#FFCC00" }}>🎉 Payment Successful!</h1>
      <p style={{ fontSize: "1.5rem" }}>
        You have <span style={{ color: "#FFCC00" }}>{tickets !== null ? tickets : "..."}</span> tickets.
      </p>
      <a href="/" style={{
        marginTop: "2rem",
        color: "#FFCC00",
        textDecoration: "underline",
        fontWeight: "bold"
      }}>Back to Home</a>
    </div>
  );
};

export default PaymentSuccess;