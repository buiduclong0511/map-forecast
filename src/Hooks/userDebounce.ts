import { useCallback, useEffect } from "react";

export const useDebounce = (callback: any, delay: number, deps: Array<any>) => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const _callback = useCallback(callback, deps);

    useEffect(() => {
        const timerId = setTimeout(() => {
            _callback();
        }, delay);

        return () => {
            clearTimeout(timerId);
        };
    }, [_callback, delay]);
};
