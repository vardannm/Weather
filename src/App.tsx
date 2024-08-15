import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux'; 
import { store } from './store/store.ts'; 
import Weather from './weather.tsx'; 

const App: React.FC = () => {
  return (
    <Provider store={store}> 
      <Router>
        <Routes>
          <Route path="/" element={<Weather />} />
        </Routes>
      </Router>
    </Provider>
  );
};

export default App;
