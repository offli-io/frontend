import { LayoutContext } from "app/layout";
import React from "react";

export default function useLongPress({
  onLongPress,
}: {
  onLongPress?: () => void;
}) {
  const [action, setAction] = React.useState<string | undefined>();
  const { isScrolling } = React.useContext(LayoutContext);

  const timerRef = React.useRef<any>();
  const isLongPress = React.useRef<boolean>();

  function startPressTimer() {
    isLongPress.current = false;
    timerRef.current = setTimeout(() => {
      isLongPress.current = true;
      console.log(isScrolling);

      onLongPress?.();
      // setAction("longpress");
    }, 500);
  }

  function handleOnClick() {
    if (isLongPress.current) {
      console.log("Is long press - not continuing.");
      return;
    }
    setAction("click");
  }

  function handleOnMouseDown() {
    console.log(isScrolling);
    startPressTimer();
  }

  function handleOnMouseUp() {
    clearTimeout(timerRef.current);
  }

  function handleOnTouchStart() {
    console.log("handleOnTouchStart");
    startPressTimer();
  }

  function handleOnTouchEnd() {
    if (action === "longpress") return;
    console.log("handleOnTouchEnd");
    clearTimeout(timerRef.current);
  }

  return {
    action,
    handlers: {
      // onClick: handleOnClick,
      onMouseDown: handleOnMouseDown,
      onMouseUp: handleOnMouseUp,
      onTouchStart: handleOnTouchStart,
      onTouchEnd: handleOnTouchEnd,
    },
  };
}
