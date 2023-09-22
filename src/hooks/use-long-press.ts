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

  function handleOnClick() {
    if (isLongPress.current) {
      console.log("Is long press - not continuing.");
      return;
    }
    setAction("click");
  }

  function startPressTimer() {
    isLongPress.current = false;
    timerRef.current = setTimeout(() => {
      isLongPress.current = true;
      console.log(isScrolling);
      onLongPress?.();
    }, 500);
  }

  function handleOnMouseDown(e: any) {
    // console.log(e);
    // console.log(e?.clientY);
    startPressTimer();
  }

  function handleOnMouseUp(e: any) {
    // console.log(e?.clientY);

    clearTimeout(timerRef.current);
  }

  function handleOnTouchStart(e: any) {
    // console.log(e);
    // console.log(e?.clientY);
    //compare e?.changedTouches?.[0]?.clientY alebo pageY
    // console.log("handleOnTouchStart");
    startPressTimer();
  }

  function handleOnTouchEnd(e: any) {
    // console.log(e);
    // console.log(e?.clientY);
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
