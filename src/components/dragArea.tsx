import React, {useState, useRef, useEffect} from 'react';

export interface Point {
    x: number;
    y: number;
    index?: string;
    letter?: string;
}
interface Props{
    coordinatesLetters: Point[]
    onPointsChange: (points: Point[]) => void;
}





const DragArea: React.FC<Props> = ({ coordinatesLetters ,onPointsChange}) => {
    const [points, setPoints] = useState<Point[]>([]);
    const [currentPoint, setCurrentPoint] = useState<Point | null>(null);
    const [isDrawing, setIsDrawing] = useState<boolean>(false);
    const svgRef = useRef<SVGSVGElement | null>(null);
    const [circlePoints, setCirclePoints] = useState<Point[]>([]);
    const [hitPoints, setHitPoints] = useState<Set<number>>(new Set());
    const stroke = '#638EC4';
    const strokeWidth = 21;
    const cornerRadius = 10;
    const pointRadius = 30;

    useEffect(() => {
        setCirclePoints(coordinatesLetters);
    }, [coordinatesLetters]);

    useEffect(() => {
        onPointsChange(points);
    }, [points, onPointsChange]);


    useEffect(() => {
        const handleMouseDown = (event: MouseEvent | TouchEvent) => {
            const target = event.target as Node;
            if (svgRef.current && svgRef.current.contains(target)) {
                const startPoint = getMousePosition(event);
                const startPointIndex = circlePoints.findIndex((point) =>
                    isPointWithinRadius(startPoint, point, pointRadius)
                );

                if (startPointIndex !== -1) {
                    setIsDrawing(true);
                    const centerPoint = circlePoints[startPointIndex];
                    setHitPoints((prev) => new Set(prev).add(startPointIndex));
                    setPoints([centerPoint]);
                    setCurrentPoint(centerPoint);
                }
            }
        };

        const handleMouseMove = (event: MouseEvent | TouchEvent) => {
            if (!isDrawing) return;

            const newPoint = getMousePosition(event);
            setCurrentPoint(newPoint);

            if (points.length >= 2) {
                const lastPoint = points[points.length - 2];
                if (lastPoint && isPointWithinRadius(newPoint, lastPoint, pointRadius)) {
                    setPoints((prevPoints) => prevPoints.slice(0, -1));
                    setHitPoints((prev) => {
                        const newHitPoints = new Set(prev);
                        newHitPoints.delete(Array.from(prev)[prev.size - 1]);
                        return newHitPoints;
                    });
                    return;
                }
            }

            circlePoints.forEach((point, index) => {
                if (!hitPoints.has(index) && isPointWithinRadius(newPoint, point, pointRadius)) {
                    setHitPoints((prev) => new Set(prev).add(index));
                    setPoints((prevPoints) => [...prevPoints, point]);
                    setCurrentPoint(point);
                }
            });
        };

        const handleMouseUp = () => {
            setIsDrawing(false);
            setCurrentPoint(null);
            setPoints([]);
            setHitPoints(new Set());
        };

        document.addEventListener('mousedown', handleMouseDown);
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        document.addEventListener('touchstart', handleMouseDown);
        document.addEventListener('touchmove', handleMouseMove);
        document.addEventListener('touchend', handleMouseUp);

        return () => {
            document.removeEventListener('mousedown', handleMouseDown);
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            document.removeEventListener('touchstart', handleMouseDown);
            document.removeEventListener('touchmove', handleMouseMove);
            document.removeEventListener('touchend', handleMouseUp);
        };
    }, [isDrawing, circlePoints, hitPoints, points]);

    const getMousePosition = (event: MouseEvent | TouchEvent): Point => {
        const rect = svgRef.current!.getBoundingClientRect();
        let clientX: number, clientY: number;
        if (event instanceof MouseEvent) {
            clientX = event.clientX;
            clientY = event.clientY;
        } else {
            clientX = event.touches[0].clientX;
            clientY = event.touches[0].clientY;
        }
        return { x: clientX - rect.left, y: clientY - rect.top };
    };

    const isPointWithinRadius = (point: Point, target: Point, radius: number) => {
        const dx = point.x - target.x;
        const dy = point.y - target.y;
        return dx * dx + dy * dy <= radius * radius;
    };

    const getPathData = (points: Point[], cornerRadius: number) => {
        if (points.length < 2) return '';

        let pathData = `M${points[0].x},${points[0].y}`;
        for (let i = 1; i < points.length - 1; i++) {
            const p0 = points[i - 1];
            const p1 = points[i];
            const p2 = points[i + 1];

            const dx1 = p1.x - p0.x;
            const dy1 = p1.y - p0.y;
            const dx2 = p2.x - p1.x;
            const dy2 = p2.y - p1.y;

            const angle1 = Math.atan2(dy1, dx1);
            const angle2 = Math.atan2(dy2, dx2);

            const sin1 = Math.sin(angle1);
            const cos1 = Math.cos(angle1);
            const sin2 = Math.sin(angle2);
            const cos2 = Math.cos(angle2);

            const x1 = p1.x - cos1 * cornerRadius;
            const y1 = p1.y - sin1 * cornerRadius;
            const x2 = p1.x + cos2 * cornerRadius;
            const y2 = p1.y + sin2 * cornerRadius;

            pathData += ` L${x1},${y1} Q${p1.x},${p1.y} ${x2},${y2}`;
        }
        pathData += ` L${points[points.length - 1].x},${points[points.length - 1].y}`;

        return pathData;
    };

    const combinedPoints = currentPoint ? [...points, currentPoint] : points;

    return (
        <>
            <svg
                ref={svgRef}
                width="100%"
                height="100%"
                style={{
                    touchAction: 'none',
                    width: '100vw',
                    height: '100vh',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    pointerEvents: 'auto',
                    zIndex: 1,
                }}
            >
                <path d={getPathData(combinedPoints, cornerRadius)} stroke={stroke} strokeLinecap="round" strokeWidth={strokeWidth} fill="none" />
                {circlePoints.map((point, index) => (
                    <circle
                        key={index}
                        cx={point.x}
                        cy={point.y}
                        r={pointRadius}
                        fill="rgba(0, 0, 0, 0)"
                    />
                ))}
            </svg>
            <div
                style={{
                    width: '100vw',
                    height: '100vh',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    pointerEvents: 'none',
                    zIndex: 2,
                }}
            />
        </>
    );
};

export default DragArea;