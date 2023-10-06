export function isIOS() {
  return /iPhone|iPad|iPod/i.test(navigator.userAgent);
}

export function isSafari() {
  return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
}

export const detectSafariBottomBarHeight = () => {
  const viewportHeight = window.innerHeight;
  const windowHeight = window.outerHeight;

  const bottomBarHeight = windowHeight - viewportHeight;

  return bottomBarHeight;
};
