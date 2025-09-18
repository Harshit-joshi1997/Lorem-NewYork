import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import StoryDetails from "./pages/StoryDetails";
import StoriesForm from "./components/Form";
import Stories from "./pages/Stories";
import Footer from "./components/Footer";
import RaffleWidget from "./components/RaffleWidget";
import PaymentSuccess from "./pages/PaymentSuccess";


function RaffleWidgetWrapper() {
  const location = useLocation();
  if (location.pathname === "/" || location.pathname === "/stories") {
    return <RaffleWidget />;
  }
  return null;
}

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/stories/:id" element={<StoryDetails />} />
        <Route path="/stories" element={<Stories />} />
        <Route path="/submit" element={<StoriesForm />} />
        <Route path="/editstories/:id" element={<StoriesForm />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
      </Routes>
      <RaffleWidgetWrapper />
      <Footer />
    </BrowserRouter>
  );
}

export default App;