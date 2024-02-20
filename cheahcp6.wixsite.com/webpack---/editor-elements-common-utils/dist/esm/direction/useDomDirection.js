import {
    useState,
    useEffect,
    useRef,
    useCallback
} from 'react';
export const useDomDirection = () => {
    const [direction, setDirection] = useState();
    const ref = useRef(null);
    const updateDirection = useCallback(() => {
        if (!ref.current) {
            return;
        }
        setDirection(window.getComputedStyle(ref.current).direction);
    }, []);
    useEffect(() => {
        updateDirection();
        setTimeout(updateDirection, 100); // in editor styles applied with delay
    }, [updateDirection]);
    return {
        direction,
        directionRef: ref
    };
};
//# sourceMappingURL=useDomDirection.js.map