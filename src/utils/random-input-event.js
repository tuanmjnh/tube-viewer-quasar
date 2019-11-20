const types = ['mouseDown', 'mouseUp', 'mouseEnter', 'mouseLeave', 'contextMenu', 'mouseWheel', 'mouseMove', 'keyDown', 'keyUp']
const modifiers = ['shift', 'control', 'alt', 'meta', 'isKeypad', 'isAutoRepeat', 'leftButtonDown', 'middleButtonDown', 'rightButtonDown', 'capsLock', 'numLock', 'left', 'right']
const Keys = [
  'k', // pause
  'm', // must
  't', // mode
  'f', // full screen
  'j', // back 10s
  'l' // next 10s
  // 'shift+n' // next
]

export function random(first, last) {
  const random = Math.floor((Math.random() * last) + first)
  return random
}

export function sendInput({ window, keyCode, type, rdFirst, rdLast }) {
  type = type ? type : 'keyDown'
  rdFirst = rdFirst ? rdFirst : 3000
  rdLast = rdLast ? rdLast : 50000
  if (rdLast < rdFirst) rdFirst = rdLast
  keyCode = keyCode ? keyCode : 'l'
  setTimeout(() => {
    console.log(keyCode, type)
    window.webContents.sendInputEvent({ type: type, keyCode: keyCode })
  }, random(rdFirst, rdLast))
}

export function sendInputEvent({ window, keyCode, type }) {
  sendInput({ window: window, keyCode: keyCode, type: type })
}

export function sendInputRandom({ window, type, rdFirst, rdLast }) {
  const keyCode = Keys[random(0, 5)]
  if (keyCode === 'k') sendInput({ window: window, keyCode: keyCode, type: type, rdFirst: rdFirst, rdLast: rdLast })
  sendInput({ window: window, keyCode: keyCode, type: type })
}

export function randomSendInput({ window, type, times, rdFirst, rdLast }) {
  if (!times) times = random(1, 9)
  // times = random(1, times)
  // console.log(times)
  for (let i = 0; i < times; i++) {
    sendInputRandom({ window: window, type: type, rdFirst: rdFirst, rdLast: rdLast })
  }
}
