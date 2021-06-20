/*<!--
  Javascript principal de la web
--> */

import Vue from 'vue';
import App from './App.vue';
import { store } from './store';
import router from './router';
import './assets/css/index.css';
import 'alpinejs';
import VuePaginate from 'vue-paginate';

Vue.config.productionTip = false;
Vue.use(VuePaginate);

Vue.directive('rol', {
  update: function (el, binding, vnode) {
    checkPermission(el, binding, vnode);
  },

  inserted: function (el, binding, vnode) {
    checkPermission(el, binding, vnode);
  },
});

/**
 * Sustituye lo que no tiene permiso para ver por un commentario en el DOM y
 * en el caso de que vuelva a adquirir los permisos sustituye el comentario por
 * la región particular.
 * 
 * @param {*} el 
 * @param {*} binding 
 * @param {*} vnode 
 */
function checkPermission(el, binding, vnode){
  let user =binding.value;

    if(!user || user.type != binding.arg){
      let comment = document.createComment('---');
      vnode.elm.comment=comment;
      el.replaceWith(comment);

      // el.style.display="none";
    }else if(vnode.elm.comment){
      vnode.elm.comment.replaceWith(el);
      // el.style.display=null;
    }
}

new Vue({
  router,
  store, // registramos el store
  render: function (h) { return h(App) },
}).$mount('#app')