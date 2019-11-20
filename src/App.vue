<template>
  <div id="q-app" :class="`app-${layout}`">
    <!-- <router-view /> -->
    <component :is="layout" />
  </div>
</template>

<script>
import { Platform } from 'quasar'
import spa from './layouts/spa'
import electron from './layouts/electron'
export default {
  name: 'App',
  components: { spa, electron },
  data: () => ({
    layout: 'spa'
  }),
  created() {
    if (Platform.is.electron) this.layout = 'electron'
    // console.log('electron', Platform.is.electron)
    // console.log('mobile', Platform.is.mobile)
    // console.log('desktop', Platform.is.desktop)
  }
}
</script>

<style>
</style>
