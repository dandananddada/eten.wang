export default function (width, height) {
  const _width = (width / 375) * 100
  if (height) {
    return `
      width: ${_width}vw;
      height: ${(_width * height) /width}vw;
    `
  } else {
    return `${_width}vw`
  }
}