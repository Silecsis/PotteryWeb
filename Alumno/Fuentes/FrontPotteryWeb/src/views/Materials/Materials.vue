<!--
  Vista Materiales.
  Lista los materiales de la api.
  Filtra los materiales
  Pueden acceder los usuarios logados
  A los usuarios de rol user solo se les permitirá listar (READ)
  A los usuarios de rol admin se les permitirán todas las acciones (CRUD).
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
          <form class="form-inline pt-4" method="GET">
            <input
              name="buscaNombre"
              class="form-control mr-sm-2 rounded bg-gray-200 w-40 m-2"
              type="search"
              placeholder="Por nombre"
              aria-label="Search"
              v-model="searchForm.buscaNombre"
            />
            <input
              name="buscaTipo"
              class="form-control ml-2 mr-sm-2 rounded bg-gray-200 m-2"
              type="search"
              placeholder="Por tipo de material"
              aria-label="Search"
              v-model="searchForm.buscaTipo"
            />
            <input
              name="buscaTemperatura"
              class="form-control ml-2 mr-sm-2 rounded bg-gray-200 w-40 m-2"
              type="number"
              placeholder="900"
              aria-label="Search"
              v-model="searchForm.buscaTemperatura"
            />
            <input
              name="buscaFechaCreac"
              class="form-control ml-2 mr-sm-2 rounded bg-gray-200 m-2"
              type="date"
              placeholder="Por fecha de creación"
              aria-label="Search"
              v-model="searchForm.buscaFechaCreac"
            />
            <select
              name="buscaToxico"
              class="form-control mr-sm-2 rounded bg-gray-200 m-2"
              v-model="searchForm.buscaToxico"
            >
              <option disabled value="">¿Toxicidad?</option>
              <option value="">Todos</option>
              <option value="no">No tóxico</option>
              <option value="si">Tóxico</option>
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
       v-rol:admin="userLog"
        name="NewMaterial"
        class="text-lg text-purple-700 font-bold bg-purple-200 border-4 border-purple-700 p-4 rounded p-1.5"
      >
        Nuevo material
      </link-button>

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
        <paginate
          ref="paginator"
          name="materials"
          :list="materials"
          :per="pageSize"
        />
        <paginate-links
          for="materials"
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
                Tipo de material
              </th>
              <th
                class="px-3 py-2 text-xs font-medium text-gray-700 font-bold uppercase"
              >
                Temperatura
              </th>
              <th
                class="px-3 py-2 text-xs font-medium text-gray-700 font-bold uppercase"
              >
                ¿Toxicidad?
              </th>
              <th
                class="px-3 py-2 text-xs font-medium text-gray-700 font-bold uppercase"
              >
                Fecha creación
              </th>
              <th
                v-rol:admin="userLog"
                class="px-3 py-2 text-xs font-medium text-gray-700 font-bold uppercase"
              >
                Acciones
              </th>
            </tr>
          </thead>
          <tbody
            v-if="materials.length != 0"
            class="text-gray-500 text-xs divide-y divide-gray-200"
          >
            <tr
              v-for="material in paginated('materials')"
              v-bind:key="material.id"
              class="text-center"
            >
              <td class="py-3">{{ material.name }}</td>
              <td class="py-3">{{ material.type_material }}</td>
              <td class="py-3">{{ material.temperature }}</td>
              <td v-if="material.toxic==1" class="py-3 bg-pink-700 text-white font-bold">Tóxico</td>
              <td v-else class="py-3 bg-pink-200 font-bold">No tóxico</td>
              <td class="py-3">{{ material.created_at }}</td>
              <td class="py-3" v-rol:admin="userLog">
                <div class="flex justify-center space-x-1">
                  <button-icon
                    type="edit"
                    @click.native="edit(material.id)"
                    class="font-bold"
                  >
                  </button-icon>

                  <button-icon
                    type="remove"
                    @click.native="destroy(material.id)"
                    class="font-bold"
                  >
                  </button-icon>
                </div>
              </td>
            </tr>
          </tbody>

          <tbody v-else class="text-gray-500 text-xs divide-y divide-gray-200">
            <tr v-rol:admin="userLog" class="text-center">
              <td colspan="6" class="py-3 font-bold text-red-600 text-lg">
                {{ errorTabla }}
              </td>
            </tr>

            <tr
              v-if="!userLog || (userLog != null && userLog.type != 'admin') "
              class="text-center"
            >
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

//Constantes:
const msg={
  'no-materials': "No existen materiales para este criterio de búsqueda",
};

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
    this.$store.commit("SET_TITLE", "Materiales");
  },
  data: function () {
    return {
      materials: [],
      paginate: ["materials"],
      message: null,
      messageType: null,
      errorTabla: "",
      userLog: null,
      pageSize: 4,
      searchForm: {},
    };
  },
  mounted() {
    this.searchForm = { buscaToxico: "" };
    this.search();
    this.userLog = JSON.parse(sessionStorage.getItem("user"));
  },
  methods: {
    destroy: function (id) {
      Commons.destroy(this,"materials", id, "materials", msg["no-materials"]);
    },
    edit: function (id) {
      this.$router.push({ name: "EditMaterial", params: { id: id } });
    },
    search: function () {
      
      Commons.search(this,"materials","materials", msg["no-materials"], "Materiales");
      
    },
  },
};
</script>
