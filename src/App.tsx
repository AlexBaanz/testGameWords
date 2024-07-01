import React from 'react';
import './App.css';
import GameScreen from "./components/gameScreen.tsx";

const App: React.FC = () => {
    return (
        <div className="App">
            <GameScreen/>
        </div>
    );
};

export default App;