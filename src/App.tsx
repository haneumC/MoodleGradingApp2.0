import React from 'react';
import './App.css'; // Import the CSS file
import Feedback from './components/ui/Feedback';
import StudentList from './components/ui/StudentList';

const App: React.FC = () => {
  return (
    <div className="grading-assistant">
      <header>
        <h1>Grading Assistant</h1>
        <p>Assignment Name: Assignment 1</p>
        <p>Max Points: 20.00</p>
      </header>
      <main>
        <div className="left">
          <div className="controls">
            <button>Prev Student</button>
            <button>Next Student</button>
            <button>Show Stats</button>
            <button>Import Table</button>
            <button>Export Table</button>
          </div>
          <Feedback />
          <div className="grading-table">
            {/* Grading table will go here */}
          </div>
        </div>
        <div className="right">
          <StudentList />
        </div>
      </main>
    </div>
  );
}

export default App;
