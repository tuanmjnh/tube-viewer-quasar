import { Notify } from 'quasar'

Notify.setDefaults({
  position: 'top',
  timeout: 3600,
  color: 'teal-10',
  textColor: 'white',
  actions: [{ icon: 'close', color: 'white' }]
})
