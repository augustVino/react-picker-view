import React, { memo, useRef, useLayoutEffect, useState } from 'react';
import classnames from 'classnames';
import { useSpring, animated } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';
import isEqual from 'lodash/isEqual';
import { PREFIX_CLS, bound, rubberbandIfOutOfBounds } from './util';
const ITEM_HEIGHT = 50;
const List = memo(({ prefix = PREFIX_CLS, list, current, listItemHeight = ITEM_HEIGHT, listClass = '', onChange }) => {
    const [itemHeight, setItemHeight] = useState(listItemHeight);
    function handleChange(index) {
        onChange(index);
    }
    const [{ y }, api] = useSpring(() => ({
        from: { y: 0 },
        config: {
            tension: 400,
            mass: 0.8
        }
    }));
    const draggingRef = useRef(false);
    useLayoutEffect(() => {
        if (draggingRef.current)
            return;
        if (current < 0)
            return;
        const finalPosition = current * -itemHeight;
        api.start({ y: finalPosition, immediate: y.goal !== finalPosition });
    }, [current, list]);
    useLayoutEffect(() => {
        if (!list[current]) {
            handleChange(0);
        }
    }, [list, current]);
    useLayoutEffect(() => {
        listItemHeight && setItemHeight(listItemHeight);
    }, [listItemHeight, setItemHeight]);
    function scrollSelect(index) {
        const finalPosition = index * -itemHeight;
        api.start({ y: finalPosition });
        handleChange(index);
    }
    const bind = useDrag((state) => {
        draggingRef.current = true;
        const min = -((list.length - 1) * itemHeight);
        const max = 0;
        if (state.last) {
            draggingRef.current = false;
            const position = state.offset[1] + state.velocity[1] * state.direction[1] * 50;
            const targetIndex = -Math.round(bound(position, min, max) / itemHeight);
            scrollSelect(targetIndex);
        }
        else {
            const position = state.offset[1];
            api.start({
                y: rubberbandIfOutOfBounds(position, min, max, itemHeight * 50, 0.2)
            });
        }
    }, {
        axis: 'y',
        from: () => [0, y.get()],
        filterTaps: true,
        pointer: { touch: true }
    });
    return (React.createElement("div", { className: classnames(`${prefix}-column`, listClass) },
        React.createElement(animated.div, Object.assign({ className: `${prefix}-column-wheel` }, bind(), { style: { y }, "aria-hidden": true }), list.map((item, k) => {
            const selected = current === k;
            function handleClick() {
                draggingRef.current = false;
                scrollSelect(k);
            }
            return (React.createElement("div", { key: `list-item-${k}-${item.value}`, className: classnames(`${prefix}-column-item`, {
                    [`${prefix}-column-item-active`]: k === current,
                    [`${prefix}-column-item-prev`]: k === current - 1,
                    [`${prefix}-column-item-next`]: k === current + 1
                }), onClick: handleClick, "aria-hidden": !selected, "aria-label": selected ? 'active' : '' }, item.label));
        }))));
}, (prev, next) => {
    if (prev.current !== next.current)
        return false;
    if (prev.listItemHeight !== next.listItemHeight)
        return false;
    if (prev.onChange !== next.onChange)
        return false;
    if (!isEqual(prev.list, next.list)) {
        return false;
    }
    return true;
});
export default List;
