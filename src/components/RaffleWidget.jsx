import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const USER_ID = 123;
const API_BASE_URL = import.meta.env.VITE_API_URL || "";

const RaffleWidget = () => {
  const [expanded, setExpanded] = useState(false);
  const [tickets, setTickets] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [paymentLoading, setPaymentLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch ticket count
  const fetchTickets = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE_URL}/api/raffle-status?userId=${USER_ID}`);
      if (!res.ok) throw new Error("Failed to fetch tickets");
      const data = await res.json();
      setTickets(data.tickets);
    } catch (err) {
      setError("Error, try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (expanded) fetchTickets();
    // eslint-disable-next-line
  }, [expanded]);

  // Join the raffle
  const handleJoin = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE_URL}/api/raffle-entry`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: USER_ID }),
      });
      if (!res.ok) throw new Error("Failed to join raffle");
      await fetchTickets();
    } catch (err) {
      setError("Error, try again.");
    } finally {
      setLoading(false);
    }
  };

  // Mock Payment with redirect to success page
  const handlePayment = async () => {
    setPaymentLoading(true);
    setError("");
    setTimeout(async () => {
      try {
        // Simulate a successful payment by calling your raffle-entry endpoint
        const res = await fetch(`${API_BASE_URL}/api/raffle-entry`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: USER_ID }),
        });
        if (!res.ok) throw new Error("Failed to join raffle");
        await fetchTickets();
        navigate("/payment-success");
      } catch (err) {
        setError("Payment failed. Please try again.");
      } finally {
        setPaymentLoading(false);
      }
    }, 1500); // Simulate 1.5s payment processing
  };

  // Collapsed style
  const collapsedStyle = {
    position: "fixed",
    bottom: "24px",
    right: "24px",
    width: "50px",
    height: "50px",
    borderRadius: "8px",
    background: "var(--accent-color, #FFCC00)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
    cursor: "pointer",
    zIndex: 1000,
    animation: "fadeIn 0.3s",
  };

  // Expanded style
  const expandedStyle = {
    position: "fixed",
    bottom: "24px",
    right: "24px",
    width: "300px",
    height: "350px",
    borderRadius: "16px",
    background: "var(--primary-color, #003366)",
    color: "#fff",
    boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
    padding: "24px",
    zIndex: 1000,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    animation: "fadeIn 0.3s",
  };

  return (
    <>
      {!expanded ? (
        <div style={collapsedStyle} onClick={() => setExpanded(true)} title="Open Raffle">
          {/* Ticket Icon SVG */}
          <svg width="32" height="32" viewBox="0 0 24 24" fill="#003366">
            <rect x="2" y="7" width="20" height="10" rx="4" fill="#FFCC00" stroke="#003366" strokeWidth="2"/>
            <circle cx="7" cy="12" r="1.5" fill="#003366"/>
            <circle cx="12" cy="12" r="1.5" fill="#003366"/>
            <circle cx="17" cy="12" r="1.5" fill="#003366"/>
          </svg>
        </div>
      ) : (
        <div style={expandedStyle}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h3 style={{ color: "#FFCC00", fontFamily: "Montserrat, sans-serif", fontWeight: "bold" }}>
              🎟️ Raffle Tickets
            </h3>
            <button
              onClick={() => setExpanded(false)}
              style={{
                background: "none",
                border: "none",
                color: "#FFCC00",
                fontSize: "1.5rem",
                cursor: "pointer",
              }}
              title="Close"
            >
              ×
            </button>
          </div>
          <div style={{ margin: "32px 0", textAlign: "center" }}>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <p style={{ fontSize: "1.5rem", fontFamily: "Montserrat, sans-serif" }}>
                You have <span style={{ color: "#FFCC00" }}>{tickets}</span> tickets.
              </p>
            )}
            {error && (
              <p style={{ color: "#FFCC00", marginTop: "12px" }}>{error}</p>
            )}
          </div>
          <button
            onClick={handleJoin}
            disabled={loading}
            style={{
              background: "#FFCC00",
              color: "#003366",
              border: "none",
              borderRadius: "8px",
              padding: "12px",
              fontWeight: "bold",
              fontFamily: "Montserrat, sans-serif",
              fontSize: "1rem",
              marginBottom: "16px",
              boxShadow: "0 0 8px #FFCC00",
              transition: "transform 0.1s",
              cursor: "pointer",
            }}
          >
            Join the Raffle
          </button>
          <button
            onClick={handlePayment}
            disabled={paymentLoading}
            style={{
              background: "none",
              color: "#FFCC00",
              border: "2px solid #FFCC00",
              borderRadius: "8px",
              padding: "12px",
              fontWeight: "bold",
              fontFamily: "Montserrat, sans-serif",
              fontSize: "1rem",
              marginBottom: "16px",
              transition: "transform 0.1s",
              cursor: "pointer",
            }}
          >
            {paymentLoading ? "Processing..." : "Proceed to Payment ($1)"}
          </button>
        </div>
      )}
    </>
  );
};

export default RaffleWidget;