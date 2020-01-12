import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../components/Home.vue'
import Login from '../components/Login.vue'
import HomeSocio from '../components/HomeSocio.vue'
import HomeBibliotecario from '../components/HomeBibliotecario.vue'

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
    path: '/homeBibliotecario',
    name: 'homeBibliotecario',
    component: HomeBibliotecario
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
