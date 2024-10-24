import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import FlashCards from './components/FlashCards';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/cards" element={<FlashCards />} />
      </Routes>
    </Router>
  );
}
export default App