import Vue from 'vue'
import App from './App.vue'
import router from "@/router/router";
import $ from 'jquery'
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import axios from "axios";
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import VueCookies from 'vue-cookies';
import store from "@/store/store";
import i18n from "@/i18n";

Vue.use(Antd)
Vue.use(VueCookies)


Vue.prototype.$ = $;
Vue.prototype.$axios = axios;
Vue.prototype.$cookies = VueCookies;

// axios.defaults.baseURL = "http://localhost:8810";
axios.defaults.baseURL = "";


axios.interceptors.request.use(config => {
  var token = VueCookies.get("token");
  if (token){
    config.headers['token'] = token;
  }
  return config;
},error => {
  console.log(error);
  return Promise.reject(error);
});

import {message as $message} from "ant-design-vue";
axios.interceptors.response.use(response =>{
  return response;
},error => {
  console.log(error);
  if (error.response){
    switch (error.response.status) {
      case 401:
        VueCookies.remove("token");
        router.replace({
          path : "/login",
          query : {redirect : router.currentRoute.fullPath}
        });
        $message.error(i18n.t("logintimeover"));
        return Promise.reject("转到登录啦！");
      default:
        break;
    }
  }
  router.replace({
    path : "/error",
    query : {redirect : router.currentRoute.fullPath}
  });
});

/*路由监听*/
router.beforeEach((to, from, next) => {
  if (to.path === "/register") {
    next();
  }else if(to.path === '/login' || to.path === '/'){
    let token = VueCookies.get("token");
    if (token != 'null' && token != '' && token != null){
      next('/home');
    }else {
      next();
    }
  }
  else {
    let token = VueCookies.get("token");
    if (token === 'null' || token === '' || token === null) {
      next('/login');
    } else {
      next();
    }
  }
});

new Vue({
  i18n,
  store,
  router,
  render: h => h(App),
}).$mount('#app')
