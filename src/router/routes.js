const routes = [
  {
    path: '/',
    name: 'dashboard',
    component: () => import('@/views/dashboard/index'),
    meta: { title: 'Main', icon: 'ion-podium' }
  },
  {
    path: '/viewer',
    name: 'viewer',
    component: () => import('@/views/viewer/index'),
    meta: { title: 'Viewer', icon: 'ion-globe' }
  },
  {
    path: '/links',
    name: 'links',
    component: () => import('@/views/links/index'),
    meta: { title: 'Links', icon: 'ion-wifi' }
  },
  {
    path: 'https://www.youtube.com/',
    name: 'youtube',
    meta: { title: 'Youtube', icon: 'ion-logo-youtube' }
  }
  // path: '/',
  // component: () => import('layouts/MyLayout.vue'),
  // children: [
  //   { path: '', component: () => import('pages/Index.vue') }
  // ]
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('@/views/error/404'),
    meta: { hidden: true }
  })
}

export default routes
