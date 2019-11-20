import electron from 'electron'
import { random, randomSendInput } from '@/utils/random-input-event'
import { userAgents } from '@/utils/user-agent'
import store from '@/store'
// import ks from 'node-key-sender'
// import { app, BrowserWindow, ipcMain } from 'electron'
export const proxyCheck = [
  'http',
  'https',
  'socks5',
  'socks4',
  'ftp',
  'direct'
]
// let mainWindow = electron.remote.BrowserWindow.getFocusedWindow()
export const newBrowserWindow = function({ url, urlScheme, proxy, width, height, duration }) {
  // mainWindow = electron.remote.BrowserWindow
  return new Promise((resolve, reject) => {
    // console.log(BrowserWindow)
    const BrowserWindow = electron.remote.BrowserWindow
    const childWindow = new BrowserWindow({
      width: width | 800,
      height: height | 600
    })
    // const mainWindow = this.$q.electron.remote.BrowserWindow
    // const defaultSession = electron.remote.session.defaultSession
    // const session = childWindow.webContents.session
    // session.clearStorageData()
    // session.clearCache()
    // session.clearAuthCache()
    // session.clearHostResolverCache()
    childWindow.on('closed', function() {
      resetProxy()
    })
    // Set User Agent
    // const random = Math.floor((Math.random() * userAgents.length))
    // console.log(userAgents[random])
    childWindow.webContents.setUserAgent(userAgents[random(0, userAgents.length)])
    // Set Proxy
    childWindow.webContents.session.setProxy({ proxyRules: `${urlScheme || 'http'}://${proxy}` }, () => {
      // console.log(`${urlScheme || 'http'}://${proxy}`)
      childWindow.loadURL(url).then(() => {
        // console.log(childWindow.webContents.getUserAgent())
        randomSendInput({ window: childWindow, rdLast: duration, times: random(1, 3) })
        // sendInput({ window: childWindow, keyCode: 'l' })
        // }, 3000)
        // setTimeout(() => {
        //   childWindow.webContents.sendInputEvent({ type: 'keyDown', keyCode: 'k' })
        // }, 1000)
        // setTimeout(() => {
        //   childWindow.webContents.sendInputEvent({ type: 'keyDown', keyCode: 'k' })
        // }, 10000)
        resolve(childWindow)
      }).catch(error => {
        // console.log(error)
        childWindow.close()
        reject(error)
      })
    }).catch(error => {
      // console.log(error)
      childWindow.close()
      reject(error)
    })
  })
}

export const resetProxy = function() {
  // console.log(electron.remote.BrowserWindow)
  electron.remote.BrowserWindow.getFocusedWindow().webContents.session.setProxy({ proxyRules: 'direct://' }, () => { })
  electron.remote.BrowserWindow.getFocusedWindow().webContents.session.clearStorageData()
  electron.remote.BrowserWindow.getFocusedWindow().webContents.session.clearCache()
  electron.remote.BrowserWindow.getFocusedWindow().webContents.session.clearAuthCache()
  electron.remote.BrowserWindow.getFocusedWindow().webContents.session.clearHostResolverCache()
}

export const test = function() {
  console.log('a')
}

export const browerSchedule = function(data, timeout) {
  console.log(data)
}
