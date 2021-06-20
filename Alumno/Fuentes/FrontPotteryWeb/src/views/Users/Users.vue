<!--
  Vista Usuarios.
  Lista los usuarios de la api.
  Filtra los usuarios
  Solo puede acceder los usuarios de tipo admin.
-->
<template>
  <div class="py-8">
    <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
      <message :message="message" :type="messageType" />

      <div v-if="auth == true">
        <nav class="navbar navbar-light py-6 mb-4">
          <div class="bg-white py-4 px-2 rounded border-2 border-yellow-100">
            <div class="flex bg-yellow-500 rounded pt-4">
              <h4 class="pb-4 m-auto text-white font-bold text-lg">
                Cuadro de búsqueda
              </h4>
            </div>
            <form class="form-inline pt-4" method="GET">
              <input
                name="buscaNombre"
                class="form-control mr-sm-2 rounded bg-gray-200 w-40  m-2"
                type="search"
                placeholder="Por nombre"
                aria-label="Search"
                v-model="searchForm.buscaNombre"
              />
              <input
                name="buscaEmail"
                class="form-control ml-2 mr-sm-2 rounded bg-gray-200 m-2"
                type="search"
                placeholder="Por email"
                aria-label="Search"
                v-model="searchForm.buscaEmail"
              />
              <input
                name="buscaNick"
                class="form-control ml-2 mr-sm-2 rounded bg-gray-200 w-40 m-2"
                type="search"
                placeholder="Por nick"
                aria-label="Search"
                v-model="searchForm.buscaNick"
              />
              <input
                name="buscaFechaLogin"
                class="form-control ml-2 mr-sm-2 rounded bg-gray-200 m-2"
                type="date"
                placeholder="Por fecha de creación"
                aria-label="Search"
                v-model="searchForm.buscaFechaLogin"
              />

              <label for="tipo" class="ml-4 mr-2">Tipo de usuario:</label>
              <select
                name="buscaTipo"
                class="form-control mr-sm-2 rounded bg-gray-200 m-2"
                v-model="searchForm.buscaTipo"
              >
                <option value="">Todos</option>
                <option value="admin">Administrador</option>
                <option value="user">Socio</option>
              </select>
              <button
                class=" m-2 btn btn-outline-success bg-yellow-100 border-2 text-yellow-600 font-bold border-yellow-600 rounded p-2 lg:float-right"
                type="button"
                @click="search"
              >
                Buscar
              </button>
            </form>
          </div>
        </nav>

        <link-button
          name="NewUser"
          class=" text-lg text-purple-700 font-bold bg-purple-200 border-4 border-purple-700 p-4 rounded p-1.5"
        >
          Nuevo usuario
        </link-button>

        <!--SELECCION DE PAGINACION-->
        <div class="sm:flex mt-10 mb-1">
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

        <!--TABLA-->
        <div
          class="bg-white overflow-auto shadow-sm sm:rounded-lg border-2 border-gray-100 p-4"
        >
          <!-- PAGINACION CON VUE-PAGINATE -->
          <paginate
            ref="paginator"
            name="users"
            :list="users"
            :per="pageSize"
          />
          <paginate-links
            for="users"
            :limit="2"
            :show-step-links="true"
          ></paginate-links>

          <table
            class="overflow-x-auto overflow-y-auto w-full bg-white divide-y divide-gray-200 mt-4"
          >
            <thead class="bg-purple-200">
              <tr class="divide-x">
                <th
                  class="px-3 py-2 text-xs font-medium text-gray-700 font-bold uppercase"
                >
                  Nombre
                </th>
                <th
                  class="px-3 py-2 text-xs font-medium text-gray-700 font-bold uppercase"
                >
                  Email
                </th>
                <th
                  class="px-3 py-2 text-xs font-medium text-gray-700 font-bold uppercase"
                >
                  Tipo
                </th>
                <th
                  class="px-3 py-2 text-xs font-medium text-gray-700 font-bold uppercase"
                >
                  Nick
                </th>
                <th
                  class="px-3 py-2 text-xs font-medium text-gray-700 font-bold uppercase"
                >
                  Imagen
                </th>
                <th
                  class="px-3 py-2 text-xs font-medium text-gray-700 font-bold uppercase"
                >
                  Fecha creación
                </th>
                <th
                  class="px-3 py-2 text-xs font-medium text-gray-700 font-bold uppercase"
                >
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody
              v-if="users.length != 0"
              class="text-gray-500 text-xs divide-y divide-gray-200"
            >
              <tr
                v-for="user in paginated('users')"
                v-bind:key="user.id"
                class="text-center"
              >
                <td class="py-3">{{ user.name }}</td>
                <td class="py-3">{{ user.email }}</td>
                <td class="py-3">{{ user.type }}</td>
                <td class="py-3">{{ user.nick }}</td>
                <td class="py-3 flex justify-center">
                  <image-server
                    :params="{
                      width: '48',
                      height: '48',
                      class: 'ml-1 rounded-full w-10 h-10 mr-4 shadow-lg',
                      alt: 'imagen defecto',
                    }"
                    type="avatar"
                    :id="user.id"
                  />
                </td>
                <td class="py-3">{{ user.created_at }}</td>
                <td class="py-3">
                  <div
                    class="flex justify-center space-x-1"
                    v-if="user.id != userLog.id"
                  >
                    <button-icon
                      type="edit"
                      @click.native="edit(user.id)"
                      class="font-bold"
                    >
                    </button-icon>

                    <button-icon
                      type="remove"
                      @click.native="destroy(user.id)"
                      class="font-bold"
                    >
                    </button-icon>
                  </div>
                </td>
              </tr>
            </tbody>

            <tbody
              v-else
              class="text-gray-500 text-xs divide-y divide-gray-200"
            >
              <tr class="text-center">
                <td colspan="7" class="py-3 font-bold text-red-600 text-lg">
                  {{ errorTabla }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import LinkButton from "../components/linkButton.vue";
import Dropdown from "../components/dropdown";
import DropdownLink from "../components/dropdown-link";
import NavLink from "../components/nav-link";
import ButtonIcon from "../components/button-icon";
import Message from "../components/message";
import ImageServer from "../components/image-server.vue";
import Commons from "../../helpers/commons";

//Constantes:
const msg = {
  "no-users": "No existen usuarios para este criterio de búsqueda",
};

export default {
  components: {
    LinkButton,
    DropdownLink,
    Dropdown,
    NavLink,
    ButtonIcon,
    Message,
    ImageServer,
  },
  created() {
    this.$store.commit("SET_TITLE", "Usuarios");
  },
  data: function () {
    return {
      users: [],
      paginate: ["users"],
      message: null,
      messageType: null,
      errorTabla: "",
      auth: true,
      pageSize: 4,
      searchForm: {},
      userLog: null,
    };
  },
  mounted() {
    this.searchForm = { buscaTipo: "" };
    this.search();
    this.userLog = JSON.parse(sessionStorage.getItem("user"));
  },
  methods: {
    destroy: function (id) {
      Commons.destroy(this,"users", id, "users", msg["no-users"]);
    },
    edit: function (id) {
      this.$router.push({ name: "EditUser", params: { id: id } });
    },
    search: function () {
      Commons.search(this,"users","users", msg["no-users"], "Usuarios");
    },
  },
};
</script>
