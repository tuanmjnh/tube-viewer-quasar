<template>
  <div class="q-pa-md">
    <q-card class="my-card">
      <q-card-section>
        <!-- <div class="text-h6">Run</div> -->
        <!-- <div class="text-subtitle2">by John Doe</div> -->
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat :label="loadingRuning?'Stop':'Runing'" :color="loadingRuning?'negative':'primary'"
          :icon="loadingRuning?'cancel':'update'" @click="onRuning" />
        <!-- <q-btn flat label="test" color="primary" icon="cancel" @click="test" /> -->
      </q-card-actions>
      <q-separator />
      <q-card-section>
      </q-card-section>
      <!-- <q-card-actions align="right">
        <q-btn flat :label="item.id?'Update':'Create'" color="primary" @click="onSubmit" />
        <q-btn flat label="Cancel" v-close-popup />
      </q-card-actions> -->
    </q-card>
    <q-table title="View list" :data="items" :columns="columns" row-key="id" :loading="loadingGet"
      :pagination.sync="pagination" :filter="pagination.filter" selection="multiple" :selected.sync="selected"
      :dense="$q.screen.lt.md">
      <template v-slot:top-right>
        <q-input borderless dense debounce="300" v-model="pagination.filter" placeholder="Search">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
        <q-btn flat icon="add" size="sm" color="primary" @click="dialog_edit=true" />
      </template>
      <q-td slot="body-cell-cmd" slot-scope="props" :props="props">
        <q-btn flat dense icon="edit" size="xs" color="secondary" @click="onEdit(props.row)" />
        <q-btn flat dense icon="delete" size="xs" color="negative" @click="onDelete(props.row)" />
      </q-td>
    </q-table>
    <q-dialog v-model="dialog_edit" full-width persistent>
      <q-inner-loading v-if="loadingVideo" :showing="loadingVideo">
        <q-spinner-oval align="center" color="primary" size="5em" />
        <!-- <q-spinner-gears size="50px" color="primary" /> -->
      </q-inner-loading>
      <q-card v-else>
        <q-card-section class="items-center">
          <q-form ref="form">
            <div class="row q-gutter-md">
              <div class="col-sm-12 col-md-6">
                <q-input v-model="item.url" label="Channel/Link" lazy-rules @blur="getVideoData(item.url)"
                  :rules="[val => val && val.length > 0 || 'Please type something']" />
                <q-input v-model="item.duration" label="Duration (Milliseconds)" lazy-rules
                  :rules="[val => val || 'Please type something']" />
                <q-input v-model="txtProxy" label="Proxy list" type="textarea" rows="16" lazy-rules
                  :rules="[val => val && val.length > 0 || 'Please type something']" />
              </div>
              <div class="col-sm-12 col-md-5">
                <q-card v-if="videoData.length>0">
                  <q-card-section>Video details</q-card-section>
                  <q-separator />
                  <q-list dense>
                    <q-item v-for="col in videoData" :key="col.name">
                      <q-item-section>
                        <q-item-label>{{ col.text }}</q-item-label>
                      </q-item-section>
                      <q-item-section side>
                        <q-item-label v-if="col.text==='Duration'" caption>
                          {{ $moment.utc(col.value).format('HH:mm:ss') }}</q-item-label>
                        <q-item-label v-else caption>{{ col.value }}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-card>
              </div>
            </div>
          </q-form>
        </q-card-section>
        <!-- <q-separator v-if="item.url" />
        <q-card-section v-if="item.url">
          <q-table title="Details of Video" :data="videoData" :pagination="{rowsPerPage:0}" hide-header hide-bottom
            :columns="[{label:'Title',name:'title',field:'title',align:'left'},{label:'Value',name:'value',field:'value',align:'left'}]" />
        </q-card-section> -->
        <q-separator v-if="videoId" />
        <q-card-section v-if="videoId" align="center">
          <!-- <you-tube-player :video-id="getVideoId(item.url)" player-width="360" player-height="215" /> -->
          <iframe ref="iframeEmbed" id="iframeEmbed" width="360" height="215"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            :src="`https://www.youtube.com/embed/${videoId}`" frameborder="0" allowfullscreen />
        </q-card-section>
        <q-separator />
        <q-card-actions align="right">
          <!-- <q-btn flat label="getCurrentTime" color="primary" @click="getVideoData()" /> -->
          <q-btn flat :label="item.id?'Update':'Create'" :loading="loadingCommit" color="primary" @click="onSubmit" />
          <q-btn flat label="Cancel" :disable="loadingCommit" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <comfirm :dialog.sync="dialog_comfirm" @onAccept="onConfirmAccept" @onCancel="onConfirmCancel" />
  </div>
</template>

<script>
import { Platform } from 'quasar'
import api from '@/api/firebase/links'
import * as youtube from '@/api/youtube'
import comfirm from '@/components/confirm'
import { remove, update, getUrlParams, delay } from '@/utils'
import { newBrowserWindow, browerSchedule, resetProxy } from '@/utils/browser-window'
// import VueYouTubeEmbed, { YouTubePlayer, getIdFromURL, getTimeFromURL } from 'vue-youtube-embed'
// import Vue from 'vue'
// Vue.use(VueYouTubeEmbed, { global: false })
export default {
  components: { comfirm }, // , YouTubePlayer
  data() {
    return {
      loadingGet: false,
      loadingCommit: false,
      loadingVideo: false,
      loadingRuning: false,
      dialog_edit: false,
      dialog_comfirm: false,
      txtProxy: '',
      selected: [],
      item: {},
      item_def: {
        url: '',
        proxy: [],
        duration: 0,
        total_run: 0,
        total_view: 0
      },
      items: [],
      columns: [
        {
          label: 'Channel/Link',
          name: 'url',
          align: 'left',
          field: 'url',
          sortable: true
        },
        {
          label: 'Total run',
          name: 'total_run',
          align: 'left',
          field: row => row.total_run ? row.total_run : 0,
          sortable: true
        },
        {
          label: 'Total view',
          name: 'total_view',
          align: 'left',
          field: row => row.total_view ? row.total_view : 0,
          sortable: true
        },
        {
          label: '#',
          name: 'cmd',
          align: 'center',
          field: 'cmd'
        }
      ],
      pagination: {
        filter: '',
        sortBy: 'name',
        descending: false,
        page: 1,
        rowsPerPage: 10
        // rowsNumber: 10
      },
      videoId: '',
      videoData: []
    }
  },
  created() {
    this.onReset()
    this.initData()
  },
  watch: {
    dialog_edit(val) {
      if (!val) this.onReset()
      // if (this.item.url) {
      //   const arr = this.item.url.split('?')
      //   let url = []
      //   if (arr.length > 1) url = arr[1].split('&')
      //   // ?autoplay=1
      //   url['autoplay']
      //   console.log(url)
      // }
    }
  },
  methods: {
    initData() {
      this.loadingGet = true
      api.select().then((x) => {
        this.items = x
        this.loadingGet = false
      }).catch((error) => {
        this.$q.notify(error.message)
      })
    },
    onEdit(row) {
      this.dialog_edit = true
      this.item = { ...row }
      this.txtProxy = this.item.proxy.join('\n')
      this.getVideoData(this.item.url)
    },
    onDelete(row) {
      this.item = row
      this.dialog_comfirm = true
    },
    onConfirmAccept() {
      api.delete({ id: this.item.id }).then(() => {
        remove(this.items, this.item)
        this.$q.notify('Delete success!')
        this.onReset()
      }).catch((error) => {
        this.$q.notify(error.message)
      })
    },
    onConfirmCancel() {
      this.onReset()
    },
    onSubmit() {
      this.$refs.form.validate().then(success => {
        if (success) {
          this.loadingCommit = true
          this.item.proxy = this.txtProxy.trim().split('\n')
          // const duration = this.videoData.filter((x) => x.text === 'Duration')
          // this.item.duration = duration.length > 0 ? duration[0].value : 0
          console.log(this.item)
          if (this.item.id) {
            const data = { ...this.item }
            delete data.id
            api.update({ id: this.item.id, data: data }).then(() => {
              // this.items.push({ ...{ id: x.id }, ...this.item })
              update(this.items, this.item, 'id')
              this.$q.notify('Update success!')
            }).finally(() => {
              this.loadingCommit = false
            })
          } else {
            api.insert({ data: this.item }).then((x) => {
              if (x.id) {
                this.items.push({ ...{ id: x.id }, ...this.item })
                this.dialog_edit = false
                this.$q.notify('Add new success!')
                this.onReset()
              }
            }).finally(() => {
              this.loadingCommit = false
            })
          }
        }
      })
    },
    getVideoId(url) {
      const params = getUrlParams(url)
      return params.v ? params.v : ''
    },
    getVideoData(url) {
      if (!url) return
      this.loadingVideo = true
      this.videoId = this.getVideoId(url)

      const params = {
        part: 'snippet,contentDetails,statistics,status',
        id: this.videoId,
        key: youtube.config.key
      }
      // console.log(youtube.config.key)
      this.$axios.get('https://www.googleapis.com/youtube/v3/videos', { params: params }).then((x) => {
        const items = x.data.items
        if (items.length > 0) {
          const milliseconds = this.$moment.duration(items[0].contentDetails.duration).asMilliseconds()
          this.item.duration = milliseconds || 0
          this.videoData = [
            { text: 'Channel title', value: items[0].snippet.channelTitle },
            { text: 'Description', value: items[0].snippet.description },
            { text: 'Title', value: items[0].snippet.title },
            { text: 'Tags', value: items[0].snippet.tags ? items[0].snippet.tags.join(', ') : '' },
            { text: 'Published at', value: this.$moment(items[0].snippet.publishedAt).format('DD/MM/YYYY hh:mm:ss') },
            { text: 'Duration', value: milliseconds },
            { text: 'Comment count', value: items[0].statistics.commentCount },
            { text: 'Dislike count', value: items[0].statistics.dislikeCount },
            { text: 'Favorite count', value: items[0].statistics.favoriteCount },
            { text: 'Like count', value: items[0].statistics.likeCount },
            { text: 'View count', value: items[0].statistics.viewCount }
          ]
        }
      }).finally(() => {
        this.loadingVideo = false
      })
    },
    async onRuning() {
      if (this.selected.length < 1) return
      if (this.loadingRuning) this.loadingRuning = false
      else {
        // loading
        this.loadingRuning = true
        // Update Run
        // this.selected[0].total_run = this.selected[0].total_run + 1
        // api.updateRun({ id: this.selected[0].id, data: this.selected[0].total_run })
        // .then(() => { update(this.items, this.selected[0], 'id') })
        // Loop run
        for await (let e of this.selected[0].proxy) {
          if (!this.loadingRuning) return
          const data = {
            url: this.selected[0].url, // + '&autoplay=1t=0s',
            urlScheme: 'http',
            proxy: e, // this.selected[0].proxy[0],
            width: 800,
            height: 600,
            duration: this.selected[0].duration
          }
          await newBrowserWindow(data).then(async (x) => {
            // Update viewed
            // this.selected[0].total_view = this.selected[0].total_view + 1
            // api.updateView({ id: this.selected[0].id, data: this.selected[0].total_view })
            // Delay time
            await delay(this.selected[0].duration)
            x.close()
          }).catch((error) => {
            this.$q.notify(`Error open: ${data.url} with proxy: ${data.proxy}`)
            console.log(error)
          })
        }
      }
      // this.selected[0].proxy.forEach(e => {
      //   newBrowserWindow(data).then((x) => {
      //     console.log(x)
      //   }).catch(() => {
      //     this.$q.notify(`Error open: ${data.url} with proxy: ${data.proxy}`)
      //     // console.log(error)
      //   })
      // })
    },
    test() {
      // var random = Math.floor((Math.random() * userAgents.length))
      // console.log(userAgents[random])
    },
    onReset() {
      this.item = { ...this.item_def }
      this.txtProxy = ''
      this.videoData = []
      this.videoId = ''
      if (this.$refs.form) this.$refs.form.resetValidation()
    }
  }
}
</script>

<style>
</style>
