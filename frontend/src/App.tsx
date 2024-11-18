import React from 'react';
import './App.css';  // Import the CSS file for styling
import TaskBoard from './components/TaskBoard';  // Import the TaskBoard component

const App: React.FC = () => {
  return (
    <div className="App">
      <TaskBoard />  {/* Render the TaskBoard component */}
    </div>
  );
};

export default App;
