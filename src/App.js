import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import store from './app/store';
import Home from './pages/Home/Home';
import TokenDetails from './pages/TokenDetails/TokenDetails';
import TokenTransferTimeline from './pages/TokenTransferTimeline/TokenTransferTimeline';
import './App.css';


function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path=":address/details" element={<TokenDetails />} />
          <Route path=":address/transfer-timeline" element={<TokenTransferTimeline />} />
        </Routes>
      </Router>
    </Provider>
  )

}

export default App;
