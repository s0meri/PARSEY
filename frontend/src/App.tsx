
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Generator from './pages/Generator';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/generator" element={<Generator />} />
      </Routes>
    </Router>
  );
}

export default App;
