import React from 'react';

export default function useLongPress({
  onLongPress,
  elementRef
}: {
  onLongPress?: () => void;
  elementRef?: HTMLDivElement | null;
}) {
  //TODO why not using setAction?
  const [action] = React.useState<string | undefined>();

  const timerRef = React.useRef<any>();
  const isLongPress = React.useRef<boolean>();
  let startingOffset = 0;

  // function handleOnClick() {
  //   if (isLongPress.current) {
  //     console.log("Is long press - not continuing.");
  //     return;
  //   }
  //   setAction("click");
  // }

  function startPressTimer(yOffset?: number) {
    isLongPress.current = false;
    timerRef.current = setTimeout(() => {
      startingOffset = yOffset ?? 0;

      const currentOffset = elementRef?.scrollTop ?? 0;
      // if user is scrolling - offset is either increasing or decreasing
      if (Math.abs(currentOffset - startingOffset) > 5) {
        return;
      }
      isLongPress.current = true;
      onLongPress?.();
    }, 500);
  }

  function handleOnMouseDown() {
    startPressTimer();
  }

  function handleOnMouseUp() {
    clearTimeout(timerRef.current);
  }

  function handleOnTouchStart() {
    const yOffset = elementRef?.scrollTop;
    startPressTimer(yOffset);
  }

  function handleOnTouchEnd() {
    if (action === 'longpress') return;
    clearTimeout(timerRef.current);
  }

  return {
    action,
    handlers: {
      // onClick: handleOnClick,
      onMouseDown: handleOnMouseDown,
      onMouseUp: handleOnMouseUp,
      onTouchStart: handleOnTouchStart,
      onTouchEnd: handleOnTouchEnd
    }
  };
}
