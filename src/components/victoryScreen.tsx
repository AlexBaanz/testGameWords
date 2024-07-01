import React from 'react';

interface VictoryScreenProps {
    onNextLevel: () => void;
    level: number
}

const VictoryScreen: React.FC<VictoryScreenProps> = ({onNextLevel, level}) => {
    return (
        <div className="victory-screen">
            <div>
                <h1>Уровень {level} пройден</h1>
                <h2>Изумительно!</h2>
            </div>
            <div  onClick={onNextLevel} className="button">
                Уровень {level+1}
            </div>
        </div>
    );
};

export default VictoryScreen;