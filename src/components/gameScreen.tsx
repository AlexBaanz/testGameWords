import React, {useEffect, useState} from 'react';
import levels from '../utils/levels.ts';
import WordGrid from './wordGrid.tsx';
import InputCircle from './inputCircle.tsx';
import VictoryScreen from './victoryScreen.tsx';
import Modal from "./modal.tsx";
import DragArea, {Point} from "./dragArea.tsx";

const GameScreen: React.FC = () => {
    const [levelIndex, setLevelIndex] = useState(0);
    const [progress, setProgress] = useState<string[]>([]);
    const [modal, setModal] = useState<boolean>(false);
    const [coordinatesLetters, setCoordinatesLetters] = useState<Point[]>([]);
    const [pointsLetters, setPointsLetters] = useState<Point[]>([]);

    const handleNextLevel = () => {
        setLevelIndex((prevIndex) => (prevIndex + 1) % levels.length);
        setProgress([]);
        localStorage.setItem('progress', JSON.stringify(''));
        localStorage.setItem('level', String(levelIndex+1));
    };

    const currentLevel = levels[levelIndex];

    useEffect(() => {
        setLevelIndex(Number(localStorage.getItem('level')))

        const storage = JSON.parse(localStorage.getItem('progress') || '""') as string[]
        setProgress(storage)

    }, []);

    useEffect(() => {
        const storage = JSON.parse(localStorage.getItem('progress') || '""' ) as string[]
       if(progress.length > storage.length) {
           localStorage.setItem('progress', JSON.stringify(progress));
       }

    }, [progress]);

    useEffect(() => {
        const channel = new BroadcastChannel('tab-channel');
        const handleMessage = (event: MessageEvent) => {
            if (event.data === 'open') {
                setModal(true)
            }
        };

        // Отправляем сообщение при загрузке страницы
        channel.postMessage('open');

        // Обрабатываем получение сообщения
        channel.onmessage = handleMessage;

        // Отправляем сообщение при закрытии вкладки
        window.addEventListener('beforeunload', () => {
            channel.postMessage('close');
        });

        return () => {
            channel.close();
        };
    }, []);
    const onPointsChange = (points: Point[]) => {
        setPointsLetters(points)
    }
    return (
        <div className="game-screen">
            {progress.length === currentLevel.words.length ? (
                <VictoryScreen onNextLevel={handleNextLevel} level={levelIndex+1} />
            ) : (
                <>
                    <div className="header">Уровень {levelIndex+1}</div>
                    <WordGrid words={currentLevel.words.sort((a, b) => a.length - b.length)} progress={progress} levelIndex={levelIndex}/>
                    <InputCircle words={currentLevel.words} setProgress={setProgress} levelIndex={levelIndex} setCoordinatesLetters={setCoordinatesLetters} pointsLetters={pointsLetters}/>
                </>
            )}
            {modal &&
                <Modal/>
            }
            {progress.length !== currentLevel.words.length && coordinatesLetters.length > 1 &&
            <DragArea coordinatesLetters={coordinatesLetters} onPointsChange={onPointsChange}/>
            }
        </div>
    );
};

export default GameScreen;