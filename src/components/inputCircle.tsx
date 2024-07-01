import React, {useEffect, useRef, useState} from 'react';
import {Point} from "./dragArea.tsx";

interface InputCircleProps {
    words: string[];
    setProgress: React.Dispatch<React.SetStateAction<string[]>>;
    levelIndex: number
    setCoordinatesLetters: React.Dispatch<React.SetStateAction<Point[]>>
    pointsLetters: Point[]
}

function getCoords(elem: HTMLDivElement) {
    let box = elem.getBoundingClientRect();
    return {
        y: Math.round(box.y+box.height/2),
        x: Math.round(box.x+box.width/2),
        index: elem.dataset.index,
        letter: elem.dataset.letter
    };
}


function getLetters(words: string[]): string[] {
    const letterCounts: { [key: string]: number } = {};
    const repeatedLetters = new Set<string>();

    for (const word of words) {
        const uniqueLettersInWord = new Set<string>();
        const letterCountsInWord: { [key: string]: number } = {};

        for (const letter of word) {
            // Обновляем общий счетчик букв
            if (!letterCounts[letter]) {
                letterCounts[letter] = 0;
            }
            letterCounts[letter]++;
            uniqueLettersInWord.add(letter);

            // Подсчитываем буквы в текущем слове
            if (!letterCountsInWord[letter]) {
                letterCountsInWord[letter] = 0;
            }
            letterCountsInWord[letter]++;
            if (letterCountsInWord[letter] > 1) {
                repeatedLetters.add(letter);
            }
        }
    }

    const result: string[] = [];

    // Добавляем уникальные буквы
    for (const letter in letterCounts) {
        result.push(letter);
    }

    // Добавляем повторяющиеся буквы
    for (const letter of repeatedLetters) {
        result.push(letter);
    }

    return result;
}


const InputCircle: React.FC<InputCircleProps> = ({words, setProgress, levelIndex, setCoordinatesLetters,pointsLetters}) => {
    const [input, setInput] = useState<string>('');
    const [flagDown, setFlagDown] = useState(false)
    const [sizeLetters, setSizeLetters] = useState<number>(0);
    const [currentInput, setCurrentInput] = useState<{ index: number, letter: string }[]>([]);
    let letters = useRef<(HTMLDivElement | null)[]>([])
    const lettersRef = useRef<HTMLDivElement>(null)
    const bgRef = useRef<HTMLDivElement>(null)


    const flagDownFunc = () => {
        handleSubmit()
        setCurrentInput([])
        setFlagDown(!flagDown)
    };

    const handleInput = (points:{ index: number, letter: string }[]) => {
        setCurrentInput(points)
        const inputPoint = points.map((points)=>points.letter).join('')
        setInput(inputPoint);
    };


    const handleSubmit = () => {
        if (words.includes(input)) {
            setProgress((prev) => [...new Set([...prev, input])]);
        }
        setCurrentInput([])
        setFlagDown(false)
        setInput('');
    };

    useEffect(() => {
        document.addEventListener('mouseup', flagDownFunc)
        document.addEventListener('touchend', flagDownFunc)

        return () => {
            document.removeEventListener('mouseup', flagDownFunc);
            document.removeEventListener('touchend', flagDownFunc);
        }
    }, [flagDown, words, input]);

    useEffect(() => {
        if (lettersRef.current && bgRef.current) {
            const lettersHeight = lettersRef.current.offsetHeight
            bgRef.current.style.height = lettersHeight * 0.85 + 'px'
            bgRef.current.style.width = lettersHeight * 0.85 + 'px'
            bgRef.current.style.borderWidth = lettersHeight * 0.09 + 'px'
            setSizeLetters(lettersHeight)
        }
    }, [levelIndex]);

    useEffect(() => {
        if(sizeLetters!==0) {
            const coordinates = letters.current?.map((elem) => {
                return getCoords(elem as  HTMLDivElement)
            })
            setCoordinatesLetters(coordinates)
        }
    }, [sizeLetters]);

    useEffect(() => {
        const newArray = pointsLetters.map((point)=> ({letter:point.letter ?? '', index: Number(point.index) ?? 0}))
        handleInput(newArray)
    }, [pointsLetters]);
    return (
        <div className="input-circle">
            <div className="preview">
                {input.split('').map((letter, index) => (
                    <div key={letter + index} className="found"><span>{letter}</span></div>
                ))
                }
            </div>
            <div ref={lettersRef} className='containerLetters'>
                <div className="letters">
                    <div ref={bgRef} className='bg'></div>
                    {getLetters(words).map((letter, index, array) => {
                        const active = currentInput.find(value => value.index === index && value.letter === letter)

                        return (
                            <div key={index}
                                 ref={el => (letters.current[index] = el)}
                                 data-index={index}
                                 data-letter={letter}
                                 style={{
                                     fontSize: sizeLetters * 0.2 + 'px',
                                     width: sizeLetters * 0.29 + 'px',
                                     height: sizeLetters * 0.29 + 'px',
                                     transform: 'rotate(' + 360 / array.length * (index + 1) + 'deg) translateY(' + sizeLetters * 0.38 + 'px)'
                                 }}>
                            <span
                                className={active ? 'active' : ''}
                                style={{
                                    boxShadow: '0 ' + sizeLetters * 0.015 + 'px 0 0 ' + (active ? '#AF638C' : '#A6A8AB'),
                                    transform: 'rotate(' + -360 / array.length * (index + 1) + 'deg)'
                                }}>{letter}</span>
                            </div>
                        )
                    })
                    }
                </div>
            </div>
        </div>
    );
};

export default InputCircle;
