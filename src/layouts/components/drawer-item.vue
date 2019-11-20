<template>
  <q-list padding>
    <template v-for="(item,index) in items">
      <!-- <router-link :key="index" :to="item.path"> -->
      <q-item v-if="!item.meta.hidden" :key="index" clickable v-ripple @click="onRouterLink(item)">
        <q-item-section avatar>
          <q-icon :name="item.meta.icon" />
        </q-item-section>
        <q-item-section>{{ item.meta.title }}</q-item-section>
      </q-item>
      <!-- </router-link> -->
    </template>
  </q-list>
</template>
<script>
import { openURL } from 'quasar'
import { isExternal } from '@/utils/validate'

export default {
  props: {
    items: { type: Array, default: () => [] }
  },
  data() {
    return {
    }
  },
  methods: {
    onRouterLink(item) {
      if (isExternal(item.path)) {
        openURL(item.path)
      } else {
        this.$router.push(item.path)
      }
    }
  }
}
</script>
