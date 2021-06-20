<!--
  Vista Ventas realizadas del usuario logado.
  Lista las ventas de la api que ha realizado el usuario logado.
  Filtra las ventas
  Solo puede acceder el usuario logado a sus ventas. 
  No puede acceder a las ventas de otro usuario logado.
-->
<template>
  <div class="py-8">
    <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
      <message :message="message" :type="messageType" />

      <nav class="navbar navbar-light py-6 mb-4">
        <div class="bg-white py-4 px-2 rounded border-2 border-yellow-100">
          <div class="flex bg-yellow-500 rounded pt-4">
            <h4 class="pb-4 m-auto text-white font-bold text-lg">
              Cuadro de búsqueda
            </h4>
          </div>
          <form class="form-inline pt-4" method="GET"></form>

          <!--Lista todas piezas que ha vendido el usuario logado:-->
          <label for="buscaPiece" class="ml-4 my-2 ml-2">Buscar por pieza:</label>
          <select
            name="buscaPiece"
            class="form-control ml-2 mr-sm-2 rounded bg-gray-200 m-2"
            v-model="searchForm.buscaPiece"
          >
            <option value="">Todos</option>
            <option
              v-for="sale in sales"
              v-bind:key="sale.id"
              :value="sale.piece_id"
            >
              {{ sale.namePiece }}
            </option>
          </select>

          <input
            name="buscaNombre"
            class="form-control ml-2 mr-sm-2 rounded bg-gray-200 w-40 m-2"
            type="search"
            placeholder="Por venta"
            aria-label="Search"
            v-model="searchForm.buscaNombre"
          />
          <input
            name="buscaPrecio"
            class="form-control ml-2 mr-sm-2 rounded bg-gray-200 w-40 m-2"
            type="search"
            placeholder="Por precio "
            aria-label="Search"
            v-model="searchForm.buscaPrecio"
          />
          <input
            name="buscaFechaLogin"
            class="form-control ml-2 mr-sm-2 rounded bg-gray-200 m-2"
            type="date"
            placeholder="Por fecha de creación"
            aria-label="Search"
            v-model="searchForm.buscaFechaLogin"
          />
          <button
            class=" m-2 btn btn-outline-success bg-yellow-100 border-2 text-yellow-600 font-bold border-yellow-600 rounded p-2 lg:float-right"
            type="button"
            @click="search"
          >
            Buscar
          </button>
        </div>
      </nav>

      <!--SELECCION DE PAGINACION-->
      <div class="sm:flex mt-8 mb-1">
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
        <paginate ref="paginator" name="sales" :list="sales" :per="pageSize" />
        <paginate-links
          for="sales"
          :limit="4"
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
                Nombre de venta
              </th>
              <th
                class="px-3 py-2 text-xs font-medium text-gray-700 font-bold uppercase"
              >
                Nombre de pieza
              </th>
              <th
                class="px-3 py-2 text-xs font-medium text-gray-700 font-bold uppercase"
              >
                Precio de venta
              </th>

              <th
                class="px-3 py-2 text-xs font-medium text-gray-700 font-bold uppercase"
              >
                Fecha de venta
              </th>
              <th
                class="px-3 py-2 text-xs font-medium text-gray-700 font-bold uppercase"
              >
                Acciones
              </th>
            </tr>
          </thead>
          <tbody
            v-if="sales.length != 0"
            class="text-gray-500 text-xs divide-y divide-gray-200"
          >
            <tr
              v-for="sale in paginated('sales')"
              v-bind:key="sale.id"
              class="text-center"
            >
              <td class="py-3">{{ sale.name }}</td>
              <td class="py-3">{{ sale.namePiece }}</td>
              <td class="py-3">{{ sale.price }}</td>
              <td class="py-3">{{ sale.created_at }}</td>
              <td class="py-3">
                <div class="flex justify-center space-x-1">
                  <button-icon
                    type="edit"
                    @click.native="edit(userLog.id,sale.id)"
                    class="font-bold"
                  >
                  </button-icon>
                </div>
              </td>
            </tr>
          </tbody>

          <tbody v-else class="text-gray-500 text-xs divide-y divide-gray-200">
            <tr class="text-center">
              <td colspan="5" class="py-3 font-bold text-red-600 text-lg">
                {{ errorTabla }}
              </td>
            </tr>
          </tbody>
        </table>
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
import Commons from "../../helpers/commons";

export default {
  components: {
    LinkButton,
    DropdownLink,
    Dropdown,
    NavLink,
    ButtonIcon,
    Message,
  },
  created() {
    this.$store.commit("SET_TITLE", "Mis ventas realizadas");
  },
  data: function () {
    return {
      sales: [],
      paginate: ["sales"],
      message: null,
      messageType: null,
      errorTabla: "",
      pageSize: 4,
      searchForm: {},
      userLog: null,
    };
  },
  mounted() {
    this.userLog = JSON.parse(sessionStorage.getItem("user"));
    this.searchForm = { buscaPiece:""};
    this.search();
  },
  methods: {
    edit: function (idUser,id) {
      this.$router.push({ name: "EditMySale", params: { idUser: idUser,id: id } });
    },
    search: function () {
      Commons.search(this,`mysales/${this.userLog.id}`,"sales", "No existen ventas para este usuario y criterio de búsqueda", "Mis ventas realizadas");
    },
  },
};
</script>