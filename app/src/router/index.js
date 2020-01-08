import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import HomeSocio from '../components/HomeSocio.vue'
import ListadoSocio from '../components/ListadoSocio.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/homeSocio',
    name: 'homeSocio',
    component: HomeSocio
  },
  {
    path: '/listadoSocio',
    name: 'listadoSocio',
    component: ListadoSocio
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
