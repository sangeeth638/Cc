import React, { useState, useEffect } from "react";
import "./App.css";

const App = () => {
  const [meals, setMeals] = useState([]);
  const [mealName, setMealName] = useState("");
  const [calories, setCalories] = useState("");
  const [animate, setAnimate] = useState(false);
  const [dailyGoal, setDailyGoal] = useState(2000);
  const [showGoalInput, setShowGoalInput] = useState(false);
  const [tempGoal, setTempGoal] = useState(dailyGoal);
  const [congratsVisible, setCongratsVisible] = useState(false);

  // Animation trigger for total calories
  useEffect(() => {
    if (meals.length > 0) {
      setAnimate(true);
      const timer = setTimeout(() => setAnimate(false), 500);
      return () => clearTimeout(timer);
    }
  }, [meals]);

  // Check if goal is met for celebration animation
  useEffect(() => {
    const previousTotal = meals.length > 1 
      ? meals.slice(0, -1).reduce((sum, meal) => sum + meal.calories, 0)
      : 0;
    
    const currentTotal = meals.reduce((sum, meal) => sum + meal.calories, 0);
    
    if (previousTotal < dailyGoal && currentTotal >= dailyGoal && meals.length > 0) {
      setCongratsVisible(true);
      const timer = setTimeout(() => setCongratsVisible(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [meals, dailyGoal]);

  // Get food emoji based on meal name
  const getFoodEmoji = (name) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes("pizza")) return "🍕";
    if (lowerName.includes("burger") || lowerName.includes("hamburger")) return "🍔";
    if (lowerName.includes("salad")) return "🥗";
    if (lowerName.includes("chicken")) return "🍗";
    if (lowerName.includes("rice")) return "🍚";
    if (lowerName.includes("pasta") || lowerName.includes("spaghetti")) return "🍝";
    if (lowerName.includes("taco")) return "🌮";
    if (lowerName.includes("sandwich")) return "🥪";
    if (lowerName.includes("bread")) return "🍞";
    if (lowerName.includes("egg")) return "🥚";
    if (lowerName.includes("fruit") || lowerName.includes("apple")) return "🍎";
    if (lowerName.includes("banana")) return "🍌";
    if (lowerName.includes("cookie") || lowerName.includes("dessert")) return "🍪";
    if (lowerName.includes("cake")) return "🍰";
    if (lowerName.includes("ice cream")) return "🍦";
    if (lowerName.includes("coffee")) return "☕";
    if (lowerName.includes("beer")) return "🍺";
    if (lowerName.includes("wine")) return "🍷";
    if (lowerName.includes("milk")) return "🥛";
    if (lowerName.includes("juice")) return "🧃";
    // Default food emoji
    return "🍽";
  };

  const addMeal = () => {
    if (mealName && calories && parseInt(calories) > 0) {
      setMeals([...meals, { 
        name: mealName, 
        calories: parseInt(calories),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        emoji: getFoodEmoji(mealName)
      }]);
      setMealName("");
      setCalories("");
    }
  };

  const removeMeal = (index) => {
    setMeals(meals.filter((_, i) => i !== index));
  };

  const totalCalories = meals.reduce((sum, meal) => sum + meal.calories, 0);
  
  const caloriesPercentage = Math.min(100, Math.round((totalCalories / dailyGoal) * 100));
  
  const handleGoalSave = () => {
    if (tempGoal > 0) {
      setDailyGoal(tempGoal);
      setShowGoalInput(false);
    }
  };

  // Get mood emoji based on calories percentage
  const getMoodEmoji = () => {
    if (caloriesPercentage < 20) return "😋";
    if (caloriesPercentage < 50) return "😊";
    if (caloriesPercentage < 80) return "🙂";
    if (caloriesPercentage < 100) return "😐";
    return "😬";
  };

  return (
    <div className="app-container">
      {congratsVisible && (
        <div className="confetti-container">
          <div className="congrats-message">
            <span>Goal reached! 🎉</span>
          </div>
          {[...Array(50)].map((_, i) => (
            <div 
              key={i} 
              className="confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                backgroundColor: `hsl(${Math.random() * 360}, 80%, 60%)`
              }}
            ></div>
          ))}
        </div>
      )}
      
      <div className="counter-card">
        <div className="header">
          <span className="header-icon floating">🍽</span>
          <h1 className="app-title">Calorie Tracker</h1>
          <span className="mood-emoji">{getMoodEmoji()}</span>
        </div>
        
        <div className="goal-section">
          {showGoalInput ? (
            <div className="goal-input-container">
              <input
                type="number"
                value={tempGoal}
                onChange={(e) => setTempGoal(parseInt(e.target.value) || 0)}
                className="goal-input"
                min="1"
              />
              <button className="goal-save-btn" onClick={handleGoalSave}>Save</button>
            </div>
          ) : (
            <div className="goal-display" onClick={() => setShowGoalInput(true)}>
              <span>Daily Goal: {dailyGoal} kcal <span className="goal-emoji">🎯</span></span>
              <small>(click to change)</small>
            </div>
          )}
        </div>
        
        <div className="progress-container">
          <div 
            className="progress-bar" 
            style={{ width: `${caloriesPercentage}%`, 
              backgroundColor: caloriesPercentage > 100 ? '#e74c3c' : 
                              caloriesPercentage > 80 ? '#f39c12' : '#2ecc71' 
            }}
          ></div>
        </div>
        
        <div className="input-group">
          <div className="input-container">
            <input
              type="text"
              placeholder="What did you eat? 🍕 🍎 🍗"
              value={mealName}
              onChange={(e) => setMealName(e.target.value)}
              className="meal-input"
            />
            <input
              type="number"
              placeholder="Calories 🔢"
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
              className="calorie-input"
              min="1"
            />
          </div>
          <button
            onClick={addMeal}
            className="add-button"
            disabled={!mealName || !calories || parseInt(calories) <= 0}
          >
            <span className="plus-icon">➕</span>
            Add
          </button>
        </div>
        
        {meals.length > 0 ? (
          <ul className="meal-list">
            {meals.map((meal, index) => (
              <li
                key={index}
                className="meal-item fade-in"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <div className="meal-emoji wiggle">{meal.emoji}</div>
                <div className="meal-info">
                  <span className="meal-name">{meal.name}</span>
                  <div className="meal-details">
                    <span className="meal-calories">{meal.calories} kcal</span>
                    <span className="meal-time">⏰ {meal.time}</span>
                  </div>
                </div>
                <button
                  onClick={() => removeMeal(index)}
                  className="remove-button"
                  aria-label="Remove meal"
                >
                  ❌
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="empty-state">
            <div className="empty-emoji bounce">🍽</div>
            <p>No meals added yet. Start tracking your food intake!</p>
          </div>
        )}
        
        <div className={`total-section ${animate ? 'pulse' : ''}`}>
          <div className="total-calories">
            <span>Total Calories:</span>
            <span className="calorie-count">{totalCalories} kcal</span>
          </div>
          <div className="calories-summary">
            <span>
              {totalCalories <= dailyGoal ? (
                <>
                  {Math.round((dailyGoal - totalCalories) * 10) / 10} kcal remaining ⬇
                </>
              ) : (
                <>
                  {Math.round((totalCalories - dailyGoal) * 10) / 10} kcal over limit ⬆
                </>
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
