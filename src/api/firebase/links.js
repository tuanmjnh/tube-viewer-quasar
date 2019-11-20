import db from './index'
const collection = 'links'

export default {
  select(params) {
    return new Promise(async (resolve, reject) => {
      return db.firestore().collection(collection).get().then((querySnapshot) => {
        const items = []
        querySnapshot.forEach(function(doc) {
          items.push({ ...{ id: doc.id }, ...doc.data() })
        })
        resolve(items)
      }).catch((error) => {
        reject(error)
      })
    })
  },
  find(params) {
    return db.firestore().collection(collection).doc(params.id)
  },
  insert(params) {
    return db.firestore().collection(collection).add(params.data)
  },
  update(params) {
    return db.firestore().collection(collection).doc(params.id).update(params.data)
  },
  updateRun(params) {
    return db.firestore().collection(collection).doc(params.id).update({ total_run: params.data + 1 })
  },
  updateView(params) {
    return db.firestore().collection(collection).doc(params.id).update({ total_view: params.data + 1 })
  },
  trash(params) {
    return db.firestore().collection(collection).doc(params.id).update(params.data)
  },
  delete(params) {
    return new Promise(async (resolve, reject) => {
      return db.firestore().collection(collection).doc(params.id).delete().then(() => {
        resolve(true)
      }).catch((error) => {
        reject(error)
      })
    })
  }
}
