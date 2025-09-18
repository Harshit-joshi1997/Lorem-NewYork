// --- Styling ---
const style = document.createElement('style');
style.textContent = `
.raffle-widget-collapsed {
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 50px;
  height: 50px;
  border-radius: 8px;
  background: #FFCC00;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  cursor: pointer;
  z-index: 1000;
  animation: fadeIn 0.3s;
}
.raffle-widget-expanded {
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 300px;
  height: 350px;
  border-radius: 16px;
  background: #003366;
  color: #fff;
  box-shadow: 0 4px 24px rgba(0,0,0,0.3);
  padding: 24px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  animation: fadeIn 0.3s;
  font-family: 'Montserrat', 'Open Sans', sans-serif;
}
.raffle-widget-btn {
  background: #FFCC00;
  color: #003366;
  border: none;
  border-radius: 8px;
  padding: 12px;
  font-weight: bold;
  font-family: 'Montserrat', sans-serif;
  font-size: 1rem;
  margin-bottom: 16px;
  box-shadow: 0 0 8px #FFCC00;
  transition: transform 0.1s;
  cursor: pointer;
}
.raffle-widget-btn-outline {
  background: none;
  color: #FFCC00;
  border: 2px solid #FFCC00;
  border-radius: 8px;
  padding: 12px;
  font-weight: bold;
  font-family: 'Montserrat', sans-serif;
  font-size: 1rem;
  margin-bottom: 16px;
  transition: transform 0.1s;
  cursor: pointer;
}
@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.95);}
  to { opacity: 1; transform: scale(1);}
}
`;
document.head.appendChild(style);

// --- Widget State ---
let tickets = 0;
let loading = false;
let paymentLoading = false;
let error = "";

// --- Helper Functions ---
function renderWidget() {
  // Remove existing widget if any
  const old = document.getElementById('raffle-widget-root');
  if (old) old.remove();

  // Create root
  const root = document.createElement('div');
  root.id = 'raffle-widget-root';

  // Collapsed state
  if (!window.raffleWidgetExpanded) {
    const collapsed = document.createElement('div');
    collapsed.className = 'raffle-widget-collapsed';
    collapsed.title = "Open Raffle";
    collapsed.innerHTML = `
      <svg width="32" height="32" viewBox="0 0 24 24" fill="#003366">
        <rect x="2" y="7" width="20" height="10" rx="4" fill="#FFCC00" stroke="#003366" stroke-width="2"/>
        <circle cx="7" cy="12" r="1.5" fill="#003366"/>
        <circle cx="12" cy="12" r="1.5" fill="#003366"/>
        <circle cx="17" cy="12" r="1.5" fill="#003366"/>
      </svg>
    `;
    collapsed.onclick = () => {
      window.raffleWidgetExpanded = true;
      renderWidget();
    };
    root.appendChild(collapsed);
    document.body.appendChild(root);
    return;
  }

  // Expanded state
  const expanded = document.createElement('div');
  expanded.className = 'raffle-widget-expanded';

  // Header
  const header = document.createElement('div');
  header.style.display = "flex";
  header.style.justifyContent = "space-between";
  header.innerHTML = `
    <h3 style="color:#FFCC00;font-family:Montserrat,sans-serif;font-weight:bold;margin:0;">🎟️ Raffle Tickets</h3>
    <button style="background:none;border:none;color:#FFCC00;font-size:1.5rem;cursor:pointer;" title="Close">&times;</button>
  `;
  header.querySelector('button').onclick = () => {
    window.raffleWidgetExpanded = false;
    renderWidget();
  };
  expanded.appendChild(header);

  // Ticket count and error
  const center = document.createElement('div');
  center.style.margin = "32px 0";
  center.style.textAlign = "center";
  if (loading) {
    center.innerHTML = `<p>Loading...</p>`;
  } else {
    center.innerHTML = `<p style="font-size:1.5rem;font-family:Montserrat,sans-serif;">You have <span style="color:#FFCC00">${tickets}</span> tickets.</p>`;
  }
  if (error) {
    const err = document.createElement('p');
    err.style.color = "#FFCC00";
    err.style.marginTop = "12px";
    err.textContent = error;
    center.appendChild(err);
  }
  expanded.appendChild(center);

  // Join the Raffle button
  const joinBtn = document.createElement('button');
  joinBtn.className = 'raffle-widget-btn';
  joinBtn.textContent = "Join the Raffle";
  joinBtn.disabled = loading;
  joinBtn.onclick = () => {
    loading = true;
    error = "";
    renderWidget();
    setTimeout(() => {
      tickets += 1;
      loading = false;
      renderWidget();
    }, 700);
  };
  expanded.appendChild(joinBtn);

  // Proceed to Payment button
  const payBtn = document.createElement('button');
  payBtn.className = 'raffle-widget-btn-outline';
  payBtn.textContent = paymentLoading ? "Processing..." : "Proceed to Payment ($1)";
  payBtn.disabled = paymentLoading;
  payBtn.onclick = () => {
    paymentLoading = true;
    error = "";
    renderWidget();
    setTimeout(() => {
      tickets += 1;
      paymentLoading = false;
      window.alert("Payment simulated! Ticket added.");
      renderWidget();
    }, 1500);
  };
  expanded.appendChild(payBtn);

  document.body.appendChild(root);
  root.appendChild(expanded);
}

// --- Initial State ---
window.raffleWidgetExpanded = false;
renderWidget();