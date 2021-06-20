<template>
  <!-- Responsive Navigation Menu -->
  <div x-bind:class="{ block: open, hidden: !open }" class="hidden sm:hidden">
    <div class="pt-2 pb-3 space-y-1">
      <!-- Navigation Links -->
      <!--HOME-->
      <nav-link name="Dashboard" @click.native="countMsg()" responsive="true" class="font-bold">
        Home
      </nav-link>

      <!--Usuarios. SOLO SI ES ADMIN-->
      <nav-link
        v-rol:admin="user"
        name="Users"
        @click.native="countMsg()"
        responsive="true"
        class="font-bold"
      >
        Usuarios
      </nav-link>

      <!--Materials-->
      <nav-link
        v-if="user"
        name="Materials"
        @click.native="countMsg()"
        responsive="true"
        class="font-bold"
      >
        Materiales
      </nav-link>

      <!--Pieces-->
      <nav-link name="Pieces" @click.native="countMsg()" responsive="true" class="font-bold">
        Piezas cerámicas
      </nav-link>

      <!--Sales-->
      <nav-link name="Sales" @click.native="countMsg()" responsive="true" class="font-bold">
        Ventas realizadas
      </nav-link>
    </div>

    <!-- Responsive Settings Options -->
    <div class="pt-4 pb-1 border-t border-gray-200">
      <div class="flex items-center px-4">
        <div class="flex-shrink-0">
          <svg
            class="h-10 w-10 fill-current text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </div>

        <div v-if="user" class="ml-3">
          <dropdown align="right">
            <template v-slot:trigger>
              <button
                class="flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300 focus:outline-none focus:text-gray-700 focus:border-gray-300 transition duration-150 ease-in-out"
              >
                <!-- <div>{{ Auth::user()->name }}</div> -->
                <div>
                  <div class="font-medium text-base text-gray-800">
                    {{ user.name }}
                  </div>
                  <div class="font-medium text-sm text-gray-500">
                    {{ user.email }}
                  </div>
                </div>

                <div class="ml-1">
                  <svg
                    class="fill-current h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
              </button>
            </template>
            <template v-slot:content>
              <!-- Mis piezas -->
              <dropdown-link @click.native="myPieces(user.id)">
                Mis piezas cerámicas
              </dropdown-link>

              <!-- Mis ventas -->
              <dropdown-link @click.native="mySales(user.id)">
                Mis ventas realizadas
              </dropdown-link>

              <!-- Edita mi perfil -->
              <dropdown-link @click.native="editProfile(user.id)">
                Editar mi perfil
              </dropdown-link>

              <!-- LOGOUT -->
              <dropdown-link @click.native="logout"> Salir </dropdown-link>
            </template>
          </dropdown>
          <div class="flex justify-center items-center mt-2 w-20 text-purple-100 msg-purple-full rounded mr-4">
            <button-icon
              type="msg"
              @click.native="msg()"
              class="font-bold"
            >
            </button-icon>
            
            <div v-if="this.msgCount != 0" class="mt-1.5 mb-1 mx-1">
                <p  class="mr-1 px-2 text-purple-600 bg-purple-100 rounded-full">{{this.msgCount}}</p>
            </div>
          </div>   
        </div>

        <div v-else>
          <v-button class="mt-4" @click.native="logIn">Log in</v-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

import ApplicationLogo from "../components/application-logo.vue";
import NavLink from "../components/nav-link.vue";
import Dropdown from "../components/dropdown.vue";
import DropdownLink from "../components/dropdown-link.vue";
import VButton from "../components/v-button.vue";
import ButtonIcon from "../components/button-icon";

export default {
  components: {
    ApplicationLogo,
    NavLink,
    Dropdown,
    DropdownLink,
    VButton,
    ButtonIcon
  },

  data: function () {
    return {
      user: null,
      msgCount:0,
    };
  },
  methods: {
    logIn: function () {
      this.$router.push({ name: "Login" });
    },

    logout: function () {
      sessionStorage.clear();
      if (this.$route.name == "Dashboard") {
        this.$router.go(0);
      } else {
        this.$router.push({ name: "Dashboard" });

        this.user = null;
      }
    },
    editProfile: function (id) {
      this.countMsg();
      this.$router.push({ name: "EditProfile", params: { id: id } });
    },
    mySales: function (id) {
      this.countMsg();
      this.$router.push({ name: "MySales", params: { idUser: id } });
    },
    myPieces: function (id) {
      this.countMsg();
      this.$router.push({ name: "MyPieces", params: { idUser: id } });
    },
    msg: function () {
      this.countMsg();
      this.$router.push({ name: "Msg", params: { idUser:this.user.id} });
    },
    countMsg:function(){
      if(!this.user){
        return;
      }
      axios
        .post(
          `${process.env.VUE_APP_API}/messages/count/${this.user.id}`
        )
        .then((result) => {
          this.msgCount = result.data.count;
        })
        .catch((error) => {
          if (error.data.message) {
            Commons.showError(this, "Ha ocurrido un error inesperado");
          }
        });
    },
  },
  mounted() {
    this.user = JSON.parse(sessionStorage.getItem("user"));
    this.$root.$on("refresh-count-msg",this.countMsg);
    this.countMsg();
  },

  beforeDestroy:function(){
    this.$root.$off("refresh-count-msg",this.countMsg);
  },
};
</script>