// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import App from "./App";
import router from "./router";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import axios from "axios";
// import VueJsonp from "vue-jsonp";
// Vue.prototype.$jsonp = VueJsonp;
Vue.prototype.$axios = axios;
// axios.defaults.baseURL = "/api";
Vue.use(ElementUI);
// Vue.use(VueJsonp);
Vue.config.productionTip = false;
/* eslint-disable no-new */
new Vue({
  el: "#app",
  router,
  components: { App },
  template: "<App/>"
});
