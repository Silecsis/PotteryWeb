<!--
  Vista Mensajes.
  Dibuja la bandeja de mensajes del usuario.
  Filtra los mensajes
  Solo pueden acceder los usuarios logados a su propia bandeja de mensajes
-->
<template>
  <div class="py-8">
    <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
      <message :message="message" :type="messageType" />
      <div
        v-if="
          error.msgArr != '' ||
          error.title != '' ||
          error.msg != '' ||
          error.user_id_receiver != ''
        "
        class="px-10 py-4 border-2 rounded border-gray-400 m-auto bg-white"
      >
        <validation v-if="error.msgArr" :errors="error.msgArr" />
        <validation v-if="error.title" :errors="error.title" />
        <validation v-if="error.msg" :errors="error.msg" />
        <validation
          v-if="error.user_id_receiver"
          :errors="error.user_id_receiver"
        />
      </div>

      <!-- Cuadro de mensajes -->
      <div
        class="items-center bg-white rounded p-5 my-2 min-w-min overscroll-auto min-w-max"
      >
        <!-- Lista de opciones -->
        <div
          class="flex justify-center block col-span-2 bg-gray-200 rounded w-full p-2 my-1 pb-4"
        >
          <!--Opciones -->
          <div class="w-1/3">
            <link-button
              @click.native="showNewMsg()"
              class="ml-2 text-lg text-purple-700 font-bold bg-purple-200 border-4 border-purple-700 p-4 rounded p-1.5 mb-3"
            >
              Nuevo mensaje
            </link-button>


            <button-icon
              v-if="this.show == 'received'"
              type="sended"
              class="font-bold inline-flex mx-2"
              @click.native="changeShow('sended')"
            >
            </button-icon>

            <button-icon
              v-if="this.show == 'sended'"
              type="received"
              class="font-bold inline-flex mx-2"
              @click.native="changeShow('received')"
            >
            </button-icon>

            <button-icon
              type="removeXL"
              @click.native="deleteLogic()"
              class="font-bold inline-flex"
            >
            </button-icon>
            
          </div>

          <!-- BUSCADOR  -->
          <div class="w-2/3 mt-5 mb-2">
            <input
              name="buscaTitle"
              class="form-control mr-sm-2 rounded bg-white w-40"
              type="search"
              placeholder="Por asunto"
              aria-label="Search"
              v-model="searchForm.buscaTitle"
              v-on:keyup.enter="search"
            />

            <select
              name="buscaRead"
              class="form-control ml-2 mr-sm-2 rounded bg-white"
              v-model="searchForm.buscaRead"
              @change="search()"
            >
              <option disabled value="">Mostrar</option>
              <option value="">Todos</option>
              <option value="no">Sin leer</option>
              <option value="si">Leidos</option>
            </select>

            <select
              name="buscaUser"
              class="form-control ml-2 mr-sm-2 rounded bg-white"
              v-model="searchForm.buscaUser"
              @change="search()"
            >
              <option disabled value="">Usuario</option>
              <option value="">Todos</option>
              <option v-for="u in users" v-bind:key="u.id" :value="u.id">
                {{ u.email }}
              </option>
            </select>

            <input
              name="buscaFechaLogin"
              class="form-control ml-2 mr-sm-2 rounded bg-white"
              type="date"
              placeholder="Por fecha de creación"
              aria-label="Search"
              v-model="searchForm.buscaFechaLogin"
              @change="search()"
            />
          </div>
        </div>

        <!-- PAGINACION-->
        <div class="pt-1">
          <!--SELECCION DE PAGINACION-->
          <div class="inline-flex w-1/2">
            <dropdown>
              <template v-slot:trigger>
                <button
                  class="flex items-center bg-white mr-sm-2 px-6 rounded text-gray-600 font-bold border-2 border-gray-100"
                >
                  Mostrar {{ pageSize }} por página
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
                <dropdown-link @click.native="pageSize = 4">
                  Paginación de 4
                </dropdown-link>
                <dropdown-link @click.native="pageSize = 6">
                  Paginación de 6
                </dropdown-link>
                <dropdown-link @click.native="pageSize = 8">
                  Paginación de 8
                </dropdown-link>
                <dropdown-link @click.native="pageSize = 10">
                  Paginación de 10
                </dropdown-link>
              </template>
            </dropdown>
          </div>

          <!-- PAGINACION CON VUE-PAGINATE -->
          <div class="inline-flex w-1/2">
            <paginate
              ref="paginator"
              name="msgs"
              :list="msgs"
              :per="pageSize"
            />
            <paginate-links
              for="msgs"
              :limit="4"
              :show-step-links="true"
            ></paginate-links>
          </div>
        </div>

        <!-- Tratamiento de mensajes -->
        <div class="h-80 mt-3 flex justify-center overflow-auto">
          <!-- Lista de mensajes -->
          <div
            class="h-full flex justify-center overflow-auto shadow-sm border-2 border-gray-100 inline-flex rounded msg-purple-full w-80 p-2"
          >
            <ul v-if="msgs.length != 0" class="w-full">
              <li class="flex justify-center">
                <h3 class="text-white font-bold uppercase m-2">
                    Lista de mensajes
                    <span v-if="this.show == 'received'"> recibidos</span>
                    <span v-if="this.show == 'sended'"> enviados</span>
                  </h3>
              </li>
              <li
                v-for="msg in paginated('msgs')"
                v-bind:key="msg.id"
                @click="showId(msg.id)"
                :id="msg.id"
                class="rounded w-full p-2 border-2 border-gray-200 overflow-auto vueMsg"
                :class="{
                  'bg-gray-300': selectMsg == msg.id,
                  'bg-white': selectMsg != msg.id,
                }"
              >
                <input
                  type="checkbox"
                  class="pt-1 rounded form-checkbox h-4 w-4 mr-2 text-orange-600"
                  v-bind:value="msg.id"
                  v-model="msgArr"
                />
                <p v-if="!msg.read" class="inline-flex h-8 font-bold">
                  {{ msg.title }}
                </p>
                <span v-if="!msg.read" class="font-normal pl-2"
                  >({{ msg.emailUser }})</span
                >

                <p v-if="msg.read" class="inline-flex h-8 font-extralight">
                  {{ msg.title }}
                </p>
                <span v-if="msg.read" class="font-extralight pl-2"
                  >({{ msg.emailUser }})</span
                >
              </li>
            </ul>

            <ul v-else class="w-full">
              <li class="flex justify-center">
                <u
                  ><h3 class="text-gray-600 font-bold uppercase m-2">
                    Lista de mensajes
                    <span v-if="this.show == 'received'"> recibidos</span>
                    <span v-if="this.show == 'sended'"> enviados</span>
                  </h3></u
                >
              </li>
              <li class="rounded bg-white w-full p-2 border-2 border-gray-200">
                <p class="inline-flex font-bold text-red-600 text-lg">
                  {{ errorTabla }}
                </p>
              </li>
            </ul>
          </div>

          <!-- Desarrollo de opciones CRUD -->
          <div
            class="h-full flex justify-center overflow-hidden shadow-sm border-2 border-gray-400 inline-flex rounded bg-purple-100 w-120 p-2"
          >
            <div
              v-if="this.hiddenWindowMsg && this.hiddenWindowNewMsg"
              class="flex justify-center bg-purple-100 w-full flex m-2 rounded"
            >
              <!-- Este div es necesario o sino se descuadra la vista -->
              <p class="text-purple-100">hi</p>
            </div>

            <div
              v-if="!this.hiddenWindowMsg && this.hiddenWindowNewMsg"
              class="flex block justify-left bg-white w-full m-2 rounded"
            >
              <ul class="px-2 w-full">
                <li class="text-white">.</li>
                <li
                  v-if="this.show == 'received'"
                  class="justify-center font-bold text-xs pb-2"
                >
                  <u class="text-gray-500">De:</u>
                  <spand class="font-extralight">{{
                    this.msg.emailUser
                  }}</spand>
                </li>
                <li
                  v-if="this.show == 'sended'"
                  class="justify-center font-bold text-xs pb-2"
                >
                  <u class="text-gray-500">De:</u>
                  <spand class="font-extralight">{{
                    this.msg.emailUser
                  }}</spand>
                </li>
                <li
                  class="justify-center font-bold text-center text-xl text-white rounded msg-purple-full p-1 mb-2"
                >
                  {{ this.msg.title }}
                </li>
                <li class="justify-center">{{ this.msg.msg }}</li>
                <li class="text-white">.</li>
              </ul>
            </div>

            <div
              v-if="!this.hiddenWindowNewMsg && this.hiddenWindowMsg"
              class="flex block justify-left bg-white w-full m-2 rounded"
            >
              <ul class="px-6 w-full">
                <li class="text-white">hi</li>
                <li>
                  <form method="POST" action="" ref="form">
                    <v-label for="user_id_receiver">Para: </v-label>
                    <select
                      name="user_id_receiver"
                      class="rounded-md shadow-sm border-gray-300 focus:border-pott-dark-full focus:ring focus:border-pott-dark-full focus:ring-opacity-50"
                      v-model="msgNew.user_id_receiver"
                    >
                      <option disabled selected value="">user@email</option>
                      <option
                        v-for="ur in usersNewMsg"
                        v-bind:key="ur.id"
                        :value="ur.id"
                      >
                        {{ ur.email }}
                      </option>
                    </select>

                    <div class="pt-4">
                      <v-input
                        id="title"
                        placeholder="Asunto del mensaje"
                        class="block mt-1 w-full rounded-md shadow-sm border-gray-300 focus:border-pott-dark-full focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        type="text"
                        name="title"
                        v-model="msgNew.title"
                        required
                      />
                    </div>

                    <div class="pt-4">
                      <textarea
                        placeholder="Escriba aquí el contenido de su mensaje"
                        id="msg"
                        class="block mt-1 w-full rounded-md shadow-sm border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        type="textarea"
                        name="msg"
                        v-model="msgNew.msg"
                        required
                      />
                    </div>

                    <div>
                      <v-button
                        class="ml-4 mt-2 flex float-right text-white font-bold pott-dark-full p-4 rounded p-1.5"
                        @click.native="create"
                      >
                        Enviar
                      </v-button>
                    </div>
                  </form>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

import LinkButton from "../components/linkButton.vue";
import Dropdown from "../components/dropdown";
import DropdownLink from "../components/dropdown-link";
import NavLink from "../components/nav-link";
import ButtonIcon from "../components/button-icon";
import VButton from "../components/v-button";
import VLabel from "../components/v-label";
import VInput from "../components/v-input";
import Message from "../components/message";
import ImageServer from "../components/image-server.vue";
import Commons from "../../helpers/commons";
import Validation from "../components/validation.vue";

export default {
  components: {
    LinkButton,
    DropdownLink,
    Dropdown,
    NavLink,
    ButtonIcon,
    Message,
    ImageServer,
    VButton,
    Validation,
    VLabel,
    VInput,
  },
  created() {
    this.$store.commit("SET_TITLE", "Bandeja de mensajes");
  },
  data: function () {
    return {
      users: [],
      usersNewMsg: [],
      user: null,
      msgs: [],
      msg: null,
      msgNew: {},
      paginate: ["msgs"],
      message: null,
      messageType: null,
      errorTabla: "",
      pageSize: 4,
      searchForm: {},
      show: "received",
      hiddenWindowMsg: true,
      hiddenWindowNewMsg: true,
      selectMsg: "",
      msgArr: [],
      error: {
        msgArr: [],
        msg: [],
        title: [],
        user_id_receiver: [],
      },
    };
  },
  mounted() {
    this.searchForm = { buscaRead: "", buscaUser: "" };
    this.user = JSON.parse(sessionStorage.getItem("user"));
    this.search();
  },
  methods: {
    destroy: function () {
      if (!this.validate("delete")) {
        return;
      }

      var formData = new FormData();
      //GUARDA EL ARRAY EN EL FORMDATA
      for (var i = 0; i < this.msgArr.length; i++) {
        formData.append(`msgArr[${i}]`, this.msgArr[i]);
      }

      axios
        .post(
          `${process.env.VUE_APP_API}/messages/delete/${this.user.id}`,
          formData,
          {
            headers: {
              "content-type": "multipart/form-data",
            },
          }
        )
        .then((result) => {
          Commons.showSuccess(
            this,
            "Se han eliminado los mensajes correctamente"
          );
          this.search();
        })
        .catch((error) => {
          if (error.response.data.messageNotMsg) {
            Commons.showError(this, error.response.data.messageNotMsg);
          } else if (error.response.data.errorNotFound) {
            Commons.showError(this, error.response.data.errorNotFound);
          } else if (error.response.data.errorNotFound) {
            Commons.showError(this, error.response.data.errorNotDelete);
          }
          if (error.response) {
            for (let fieldError in error.response.errors) {
              this.error[fieldError] = error.response.errors[fieldError];
            }
          } else {
            Commons.showError(this, "Ha ocurrido un error inesperado");
          }
        });
    },
    deleteLogic: function () {
      if (!this.validate("delete")) {
        return;
      }

      var formData = new FormData();
      //GUARDA EL ARRAY EN EL FORMDATA
      for (var i = 0; i < this.msgArr.length; i++) {
        formData.append(`msgArr[${i}]`, this.msgArr[i]);
      }

      axios
        .post(
          `${process.env.VUE_APP_API}/messages/delete/${this.show}/${this.user.id}`,
          formData,
          {
            headers: {
              "content-type": "multipart/form-data",
            },
          }
        )
        .then((result) => {
          Commons.showSuccess(
            this,
            "Se han eliminado los mensajes correctamente"
          );
          this.search();
        })
        .catch((error) => {
          if (error.response.data.messageNotMsg) {
            Commons.showError(this, error.response.data.messageNotMsg);
          } else if (error.response.data.errorNotFound) {
            Commons.showError(this, error.response.data.errorNotFound);
          } else if (error.response.data.errorNotFound) {
            Commons.showError(this, error.response.data.errorNotDelete);
          }
          if (error.response) {
            for (let fieldError in error.response.errors) {
              this.error[fieldError] = error.response.errors[fieldError];
            }
          } else {
            Commons.showError(this, "Ha ocurrido un error inesperado");
          }
        });
    },
    create: function () {
      if (!this.validate("create")) {
        return;
      }

      axios
        .post(
          `${process.env.VUE_APP_API}/messages/create/${this.user.id}`,
          this.msgNew
        )
        .then((result) => {
          Commons.showSuccess(
            this,
            "Se ha enviado el mensaje correctamente",
            5
          );
          this.clearMsgNew();
        })
        .catch((error) => {
          if (error.response.data.errors) {
            for (let fieldError in error.response.data.errors) {
              this.error[fieldError] = error.response.data.errors[fieldError];
            }
          } else if (error.response.data.message) {
            Commons.showError(this, error.response.data.message);
          } else {
            Commons.showError(this, "Ha ocurrido un error inesperado");
          }
        });
    },
    search: function () {
      let config = {
        params: this.searchForm,
      };

      axios
        .get(
          `${process.env.VUE_APP_API}/messages/${this.show}/${this.user.id}`,
          config
        )
        .then((result) => {
          if (this.show == "sended") {
            this.msgs.splice(0, this.msgs.length);
            this.msgs.push(
              ...result.data.msgs.filter((msg) => {
                msg.created_at = msg.created_at.substring(0, 10);
                msg.read = true; //Si es de la bandeja de enviados, configuraremos su leido a true para que no lo muestre como no leido
                return true;
              })
            );
            this.$refs.paginator.goToPage(1);
          } else if (this.show == "received") {
            this.msgs.splice(0, this.msgs.length);
            this.msgs.push(
              ...result.data.msgs.filter((msg) => {
                msg.created_at = msg.created_at.substring(0, 10);
                return true;
              })
            );
            this.$refs.paginator.goToPage(1);
          }

          this.users = result.data.users;
          this.usersNewMsg = result.data.usersNewMsg;

          if (this.msgs.length == 0) {
            this.errorTabla = "No existen mensajes";
          }
        })
        .catch((error) => {
          if (error.response.message == "Unauthenticated.") {
            Commons.showError(this, "No estás autorizado para esta vista");
            this.$store.commit("SET_TITLE", "Mensajes --> Error");
            this.auth = false;
          } else {
            this.msgs = [];
            this.errorTabla = "Ha ocurrido un error inesperado";
          }
        });
    },
    editRead: function () {
      axios
        .post(
          `${process.env.VUE_APP_API}/messages/edit-read/${this.user.id}/${this.msg.id}`
        )
        .then((result) => {
          this.search();
          this.showId(this.msg.id);
          this.$root.$emit("refresh-count-msg");
        })
        .catch((error) => {
          if (error.response.data.message) {
            Commons.showError(this, error.response.data.message);
          } else {
            Commons.showError(this, "Ha ocurrido un error inesperado");
          }
        });
    },
    changeShow: function (option) {
      this.show = option;
      this.hiddenWindowMsg = true;
      this.hiddenWindowNewMsg = true;
      this.msg = null;
      this.msgArr=[];
      this.search();
    },
    showId: function (idMsg) {
      if (this.selectMsg == "") {
        this.selectMsg = idMsg;
        this.hiddenWindowMsg = false;
        this.hiddenWindowNewMsg = true;
        this.getMsg(idMsg);
      } else if (this.selectMsg != idMsg && this.selectMsg != "") {
        this.selectMsg = idMsg;
        this.hiddenWindowMsg = false;
        this.hiddenWindowNewMsg = true;
        this.getMsg(idMsg);
      }
    },
    showNewMsg: function () {
      this.hiddenWindowMsg = true;
      this.hiddenWindowNewMsg = false;
    },
    getMsg: function (idMsg) {
      this.msgs.forEach((m) => {
        if (m.id == idMsg) {
          this.msg = m;

          //Solo se editará su condición de read si está desde la bandeja de mensajes recibidos
          if (!m.read && this.show == "received") {
            this.editRead();
            this.search();
          }
        }
      });
    },
    validate: function (option) {
      var msgSelected = this.msgArr.length;
      var msgErr = this.msgNew.msg;
      var titleErr = this.msgNew.title;
      var valid = true;
      this.error = {
        msgArr: [],
        msg: [],
        title: [],
        user_id_receiver:[],
      };

      if (option == "delete" && msgSelected < 1) {
        this.error.msgArr.push(
          "Debes seleccionar, al menos, un mensaje para eliminar."
        );
        valid = false;
      }

      if (
        option == "create" &&
        (!titleErr || titleErr.length < 5 || titleErr.length > 30)
      ) {
        this.error.title.push(
          "El campo 'asunto del mensaje' debe tener al menos de 5 carácteres y no más de 30."
        );
        valid = false;
      }

      if (
        option == "create" &&
        (!msgErr || msgErr.length < 2 || msgErr.length > 255)
      ) {
        this.error.msg.push(
          "El campo 'contenido del mensaje' debe tener al menos de 2 carácteres y no más de 255."
        );
        valid = false;
      }

      return valid;
    },
    clearMsgNew: function () {
      this.msgNew.title = "";
      this.msgNew.msg = "";
      this.msgNew.user_id_receiver = "";
    },
  },
};
</script>
