export function stopPop(e) {
  if (e.stopPropagation) {
    e.stopPropagation();
  } else {
    e.cancelable = true;
  }
}
