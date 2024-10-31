import React, { useState } from 'react';
import './Feedback.css';

const Feedback = () => {
  const [feedbackItems, setFeedbackItems] = useState([
    { id: 1, text: 'Add more comments', deduction: 3, applied: false },
    { id: 2, text: 'Poor indentation', deduction: 2, applied: false },
    { id: 3, text: 'Looks good!', deduction: 0, applied: false },
    { id: 4, text: 'No submission.', deduction: 20, applied: false },
  ]);

  const handleCheckboxChange = (id) => {
    setFeedbackItems(feedbackItems.map(item => 
      item.id === id ? { ...item, applied: !item.applied } : item
    ));
  };

  const handleAddFeedback = () => {
    // Implement add feedback functionality
    console.log('Add feedback clicked');
  };

  return (
    <div className="feedback-container">
      <h3>Student Name: student03 student03</h3>
      <div className="action-buttons">
        <button className="save-progress">Save Progress</button>
        <button className="perfect-score">Perfect Score</button>
        <button className="clear-score">Clear Score</button>
      </div>
      <div className="feedback-list">
        <div className="feedback-header">
          <span>Feedback</span>
          <span>Deduction</span>
          <span>Apply</span>
        </div>
        {feedbackItems.map((item) => (
          <div key={item.id} className="feedback-item">
            <span className="feedback-text">
              <i className="icon-trash"></i> {item.text}
            </span>
            <span className="feedback-deduction">{item.deduction}</span>
            <input
              type="checkbox"
              checked={item.applied}
              onChange={() => handleCheckboxChange(item.id)}
            />
          </div>
        ))}
      </div>
      <button className="add-feedback" onClick={handleAddFeedback}>Add Feedback</button>
    </div>
  );
};

export default Feedback;

