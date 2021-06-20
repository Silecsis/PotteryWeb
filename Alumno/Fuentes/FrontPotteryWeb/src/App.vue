<!--
  Vista de principal que genera la web.
  Desde aquí parte el resto de la web.
-->

<template>
  <!-- <div> -->
    <!--Para cuando la vista está cargando-->
    <!-- <div id="overlay" onclick="off()"></div> -->
    
    <!-- <div v-if="loading">HOLA</div> -->
    <!-- <div v-if="loading">
    <div>CARGANDO</div></div>
    <component :is="layout"></component>
  </div> -->
  <div >
    <transition v-if="loading" name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">

          <div class="modal-header">
            <h3>
              CARGANDO
            </h3>
          </div>

          <div class="modal-body">
            <!-- <slot name="body">
              img
            </slot> -->
            <img src="./assets/img/loading-42.gif"/>
          </div>

          <!-- <div class="modal-footer">
            <slot name="footer">
              default footer
              <button class="modal-default-button" @click="$emit('close')">
                OK
              </button>
            </slot>
          </div> -->
        </div>
      </div>
    </div>
  </transition>
  <component :is="layout"></component>
  </div>
</template>
<script>
import { mapState } from "vuex";
import axios from "axios";

import LoginLayout from "./views/layouts/Login";
import PrincipalLayout from "./views/layouts/Principal";

export default {
  components: { LoginLayout, PrincipalLayout },
  computed: mapState(["layout"]),
  data:function(){
    return{loading:false,};
  },
  created: function () {
    let $this=this;

    axios.interceptors.request.use(function (config) {
      $this.loading=true;
      const token = sessionStorage.getItem("token");
      if (token) {
        if (!config.data) {
          config.data = {};
        }

        config.data.user_id = JSON.parse(sessionStorage.getItem("user")).id;
        config.headers.Authorization = "Bearer " + token;
      }

      return config;
    });

    axios.interceptors.response.use((response) => {
      console.log("Recibi respesta");
      $this.loading=false;
      return response;
    },(error) => {
      console.log("Recibi respesta");
      $this.loading=false;
      return new Promise((resolve,reject)=>{
        reject(error);
      });
    });
  },
};
</script>