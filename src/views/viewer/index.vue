<template>
  <div class="q-pa-md">
    <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
      <div class="q-gutter-md row items-start">
        <div class="col-12 col-md-2">
          <q-input v-model="url" label="Url" lazy-rules
            :rules="[val => val && val.length > 0 || 'Please type something']" />
        </div>
        <div class="col-12 col-md-auto">
          <q-input v-model="proxy" label="Proxy" lazy-rules
            :rules="[val => val && val.length > 0 || 'Please type something']" />
        </div>
        <div class="col-12 col-md-auto">
          <q-btn type="submit" flat label="View" color="primary" />
          <!-- <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" /> -->
        </div>
      </div>
      <!-- <q-toggle v-model="accept" label="I accept the license and terms" /> -->
    </q-form>
  </div>
</template>

<script>
import electron from 'electron'
export default {
  data() {
    return {
      url: 'https://whatismyipaddress.com/',
      proxy: '103.85.16.54:33046',
      urlScheme: 'http',
      accept: false
    }
  },
  methods: {
    onSubmit() {
      const $this = this
      // this.$q.notify({
      //   color: 'green-4',
      //   textColor: 'white',
      //   icon: 'fas fa-check-circle',
      //   message: 'Submitted'
      // })
      // window.open(this.url, '_blank', 'nodeIntegration=no')
      const proxyCheck = [
        'http',
        'https',
        'socks5',
        'socks4',
        'ftp',
        'direct'
      ]
      const BrowserWindow = electron.remote.BrowserWindow
      const childWindow = new BrowserWindow({
        width: 800,
        height: 600
      })
      // const mainWindow = this.$q.electron.remote.BrowserWindow
      childWindow.webContents.session.setProxy({ proxyRules: `${$this.urlScheme}://${$this.proxy}` }, () => {
        childWindow.loadURL($this.url)
      }).catch((err) => {
        console.log(err)
      })
      // console.log(childWindow)
    },
    onReset() {
      this.name = null
      this.age = null
      this.accept = false
    }
  }
}
</script>

<style>
</style>
