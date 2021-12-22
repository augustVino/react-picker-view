import React, { memo, useRef, useLayoutEffect, useState } from 'react';
import classnames from 'classnames';
import { useSpring, animated } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';
import isEqual from 'lodash.isEqual';
import { PREFIX_CLS, bound, rubberbandIfOutOfBounds } from './util';

export interface Item {
  label: string;
  value: any;
}

export interface IListPraviteProps {
  prefix?: string;
  // 条目高度
  listItemHeight?: number;
  // 自定义class
  listClass?: string;
}

interface IProps extends IListPraviteProps {
  // 当前列数据
  list: Item[];
  // 当前选中项的index
  current: number;
  onChange: Function;
}

const ITEM_HEIGHT = 50;

const List = memo<IProps>(
  ({
    prefix = PREFIX_CLS,
    list,
    current,
    listItemHeight = ITEM_HEIGHT,
    listClass = '',
    onChange,
  }) => {
    const [itemHeight, setItemHeight] = useState<number>(listItemHeight);

    function handleChange(index: number) {
      onChange(index);
    }

    const [{ y }, api] = useSpring(() => ({
      from: { y: 0 },
      config: {
        tension: 400,
        mass: 0.8,
      },
    }));
    // 记录拖拽状态
    const draggingRef = useRef(false);

    useLayoutEffect(() => {
      if (draggingRef.current) return;
      if (current < 0) return;
      const finalPosition = current * -itemHeight;
      api.start({ y: finalPosition, immediate: y.goal !== finalPosition });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [current, list]);

    useLayoutEffect(() => {
      if (!list[current]) {
        handleChange(0);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [list, current]);

    useLayoutEffect(() => {
      listItemHeight && setItemHeight(listItemHeight);
    }, [listItemHeight, setItemHeight]);

    function scrollSelect(index: number) {
      const finalPosition = index * -itemHeight;
      api.start({ y: finalPosition });
      handleChange(index);
    }

    const bind = useDrag(
      (state) => {
        draggingRef.current = true;
        const min = -((list.length - 1) * itemHeight);
        const max = 0;
        if (state.last) {
          draggingRef.current = false;
          const position =
            state.offset[1] + state.velocity[1] * state.direction[1] * 50;
          const targetIndex = -Math.round(
            bound(position, min, max) / itemHeight
          );
          scrollSelect(targetIndex);
        } else {
          const position = state.offset[1];
          api.start({
            y: rubberbandIfOutOfBounds(
              position,
              min,
              max,
              itemHeight * 50,
              0.2
            ),
          });
        }
      },
      {
        axis: 'y',
        from: () => [0, y.get()],
        filterTaps: true,
        pointer: { touch: true },
      }
    );

    return (
      <div className={classnames(`${prefix}-column`, listClass)}>
        <animated.div
          className={`${prefix}-column-wheel`}
          {...bind()}
          style={{ y }}
          aria-hidden
        >
          {list.map((item, k) => {
            const selected = current === k;
            function handleClick() {
              draggingRef.current = false;
              scrollSelect(k);
            }
            return (
              <div
                key={`list-item-${k}-${item.value}`}
                className={classnames(`${prefix}-column-item`, {
                  [`${prefix}-column-item-active`]: k === current,
                  [`${prefix}-column-item-prev`]: k === current - 1,
                  [`${prefix}-column-item-next`]: k === current + 1,
                })}
                onClick={handleClick}
                aria-hidden={!selected}
                aria-label={selected ? 'active' : ''}
              >
                {item.label}
              </div>
            );
          })}
        </animated.div>
      </div>
    );
  },
  (prev, next) => {
    if (prev.current !== next.current) return false;
    if (prev.listItemHeight !== next.listItemHeight) return false;
    if (prev.onChange !== next.onChange) return false;
    if (!isEqual(prev.list, next.list)) {
      return false;
    }
    return true;
  }
);
export default List;
