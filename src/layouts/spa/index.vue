<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round @click="drawer = !drawer" aria-label="Menu">
          <q-icon name="menu" />
        </q-btn>
        <q-toolbar-title>
          {{ title }}
        </q-toolbar-title>
        <div>Quasar v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="drawer" bordered content-class="bg-grey-2">
      <drawer-item :items="this.$router.options.routes"></drawer-item>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import drawerItem from '@/layouts/components/drawer-item'
export default {
  components: { drawerItem },
  data() {
    return {
      title: process.env.APP_NAME,
      drawer: this.$q.platform.is.desktop
    }
  },
  methods: {
  }
}
</script>

<style scoped>
</style>
