const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      {path: '/login', component: () => import('pages/LoginPage.vue') },
      {path: '/registracija', component:() => import('pages/RegistracijaPage.vue') },
      {path: '/usluge', component:() =>import('pages/UslugePage.vue') },
      {path: '/pretraga_usluga',component:() =>import('pages/Pretraga_usluga.vue') },
      {path: 'termini', component:() =>import('pages/TerminiPage.vue') },
      {path: '/termini/:uslugaId', component:() =>import('pages/TerminiPage.vue') },
      {path: '/pretraga_termina', component:() =>import('pages/Pretraga_termina.vue') },
      {path: '/moje_rezervacije', component:() =>import('pages/RezervacijePage.vue') },
      {path: '/admin', component:() =>import('pages/AdminPage.vue') }
    ]
  },


  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
