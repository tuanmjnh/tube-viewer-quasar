import db from './index'
const collection = 'template'

export default {
  select(params) {
    return db.firestore().collection(collection).orderBy('created_at', 'asc').get()
  },
  insert(params) {
    return db.firestore().collection(collection).add(params.item)
  },
  update(params) {
    return db.firestore().collection(collection).doc(params.id).update(params.data)
  },
  trash(params) {
    return db.firestore().collection(collection).doc(params.id).update(params.data)
  },
  delete(params) {
    return db.firestore().collection(collection).doc(params.id).delete()
  }
}
