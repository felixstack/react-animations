import { useCallback } from 'react';
import { useSharedValue } from 'react-native-reanimated';

export const useLayout = () => {
    const itemY = useSharedValue(0);
    const itemX = useSharedValue(0);
    const itemWidth = useSharedValue(0);
    const itemHeight = useSharedValue(0);

    const onLayout = useCallback((e) => {
        const {
            nativeEvent: {
                layout: { height, width, x, y },
            },
        } = e;

        console.log(y)
        itemY.value = y;
        itemX.value = x;
        itemWidth.value = width;
        itemHeight.value = height;
    }, []);

    return {
        itemX,
        itemY,
        itemWidth,
        itemHeight,
        onLayout,
    };
};