import React, {useEffect, useRef, useState} from 'react';


interface WordGridProps {
    words: string[];
    progress: string[];
    levelIndex: number
}


const WordGrid: React.FC<WordGridProps> = ({words, progress,levelIndex}) => {
    const wordGridRef = useRef<HTMLDivElement>(null);
    const [wightAndHeight, setWightAndHeight] = useState(0);
    const [margin, setMagrin] = useState(0);
    const [fontSize, setFontSize] = useState(0);
    useEffect(() => {
        const dataLenght = words.length
        if(wordGridRef.current) {
            const heightWordGrid = wordGridRef.current.offsetHeight
            const oneHeightFull = heightWordGrid / dataLenght
            const marginNum = oneHeightFull * 0.06
            setFontSize((oneHeightFull - marginNum) * 0.55)
            setMagrin(marginNum)
            setWightAndHeight(oneHeightFull - marginNum)
        }
    }, [levelIndex]);

    return (
        <div className="word-grid" ref={wordGridRef}>
            {words.map((word, index) => (
                <div key={index} className="word" style={{marginBottom: margin+'px'}}>
                    {word.split('').map((letter, letterIndex) => (
                        <div key={letterIndex} style={{width: wightAndHeight+'px',height: wightAndHeight+'px', margin:'0 '+(margin/2)+'px', fontSize: fontSize+'px'}} className={progress.includes(word) ? 'found' : ''}>
                            <span>{progress.includes(word) ? letter : ''}</span>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default WordGrid;