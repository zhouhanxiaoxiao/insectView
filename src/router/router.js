import Vue from 'vue'
import VueRouter from 'vue-router'
import login from "@/components/login";
import home from "@/components/home";
import errorPage from "@/components/public/errorPage";
Vue.use(VueRouter)

/*配置路由*/
const routes=[
    {path: '', redirect : "/home"},
    {path: '/', redirect : "/home"},
    {path:'/login',component: login, meta:{index:0}},
    {path:'/home',component: home, meta:{index:1}},
    {path: '/error', component: errorPage, meta: {index: 2}}
]

/*实例化路由*/
const router = new VueRouter({
    routes:routes, // （简写）相当于 routes: routes
});

/*导出路由模块*/
export default router