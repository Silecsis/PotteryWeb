<!--
  Vista Mis Piezas realizadas.
  Lista las piezas de la api que posee el usuario logado.
  Filtra las piezas
  Solo accederán los usuarios logados a sus propias piezas.
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
            <!--Lista todas piezas que dispone el usurio logado:-->
            <label for="buscaPiece" class="ml-4  m-2">Buscar por nombre:</label>
            <select
              name="buscaNombre"
              class="form-control ml-2 mr-sm-2 rounded bg-gray-200 my-2 ml-2 "
              v-model="searchForm.buscaNombre"
            >
              <option value="">Todos</option>
              <option
                v-for="piece in pieces"
                v-bind:key="piece.id"
                :value="piece.name"
              >
                {{ piece.name }}
              </option>
            </select>

            <select
              name="buscaVendido"
              class="form-control ml-2 mr-sm-2 rounded bg-gray-200 m-2"
              v-model="searchForm.buscaVendido"
            >
              <option disabled value="">¿Vendido?</option>
              <option value="">Todos</option>
              <option value="no">No vendido</option>
              <option value="si">Vendido</option>
            </select>

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
          </form>
        </div>
      </nav>

      <link-button
        name="NewMyPiece"
        :params="{ idUser: user.id }"
        class="text-lg text-purple-700 font-bold bg-purple-100 border-4 border-purple-700 p-4 rounded p-1.5"
      >
        Nueva pieza
      </link-button>

      <!--SELECCION DE PAGINACION-->
      <div class="sm:flex mt-8 mb-1" v-if="pieces.length != 0">
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
            <dropdown-link @click.native="pageSize = 3">
              Paginación de 3
            </dropdown-link>
            <dropdown-link @click.native="pageSize = 6">
              Paginación de 6
            </dropdown-link>
            <dropdown-link @click.native="pageSize = 9">
              Paginación de 9
            </dropdown-link>
            <dropdown-link @click.native="pageSize = 12">
              Paginación de 12
            </dropdown-link>
          </template>
        </dropdown>
      </div>

      <!--TABLA-->
      <div class="bg-white pt-2 rounded container my-6 mx-auto px-4 md:px-12">
        <!-- Paginación -->
        <div 
          v-if="pieces.length != 0">
          <paginate
            ref="paginator"
            name="pieces"
            :list="pieces"
            :per="pageSize"
          />
          <paginate-links
            for="pieces"
            :limit="4"
            :show-step-links="true"
          ></paginate-links>
        </div>

        <div
          v-if="pieces.length != 0"
          class="py-4 flex flex-wrap -mx-1 lg:-mx-2"
        >
          <!-- Piezas -->
          <div
            v-for="piece in paginated('pieces')"
            v-bind:key="piece.id"
            class="my-1 px-1 pt-2 w-full md:w-1/2 lg:my-4 lg:px-4 lg:w-1/3"
          >
            <!-- Piece -->
            <div
              class="border border-4 border-gray-700 h-120 overflow-auto rounded-lg shadow-lg"
            >
              <!-- IMG -->
              <div class="flex h-72 inline-block pott-grey-med">
                <span class="mb-auto mt-auto"
                  ><image-server
                    :params="{
                      class: 'object-scale-down w-full max-h-72',
                      alt: 'imagen pieza',
                    }"
                    type="img"
                    :id="piece.id"
                  />
                </span>
              </div>

              <!-- Nombre pieza -->
              <header
                class="flex items-center justify-between leading-tight p-2 md:p-3"
              >
                <h1
                  class="msg-purple-full text-white font-bold py-1 w-full rounded text-lg text-center"
                >
                  {{ piece.name }}
                </h1>
              </header>
              <!-- Descripción -->
              <div
                class="flex items-center justify-between leading-none p-2 md:p-3"
              >
                <p class="ml-2 text-base">
                  {{ piece.description }}
                </p>
              </div>
              <!--fecha de la pieza-->
              <div
                class="flex items-center justify-between leading-none p-2 md:p-2"
              >
                <p class="ml-2 text-sm">
                  {{ piece.created_at }}
                </p>
              </div>

              <!-- campo sold y acción comprar y acción ver en detalle -->
              <div
                class="flex items-center justify-between leading-none p-2 md:p-2"
              >
                <p
                  v-if="piece.sold == 1"
                  class="text-center rounded border border-2 border-green-500 p-3 bg-green-500 text-white font-bold"
                >
                  Vendida
                </p>
                <p
                  v-else
                  class="text-center rounded border border-2 border-green-500 p-3 bg-green-100 font-bold"
                >
                  No vendida
                </p>

                <link-button
                  @click.native="detail(piece.id)"
                  class="text-center text-base text-white font-bold bg-purple-500 ml-4 p-4 rounded p-1.5"
                >
                  Ver en detalle
                </link-button>
              </div>

              <!-- Acciones admin -->
              <div
                class="border-t-2 border-gray-500 flex items-center justify-between leading-none p-2 md:p-2"
              >
                <div class="flex justify-center space-x-1">
                  <button-icon
                    type="edit"
                    @click.native="edit(piece.id)"
                    class="font-bold"
                  >
                  </button-icon>

                  <button-icon
                    type="remove"
                    @click.native="destroy(piece.id)"
                    class="font-bold"
                  >
                  </button-icon>
                </div>
                <div class="flex justify-center space-x-1">
                  <button
                    v-if="piece.sold"
                    v-rol:admin="user"
                    @click="delSale(piece.id)"
                    class="text-base text-white font-bold bg-gray-500 ml-4 p-4 rounded p-1.5"
                  >
                    Quitar venta
                  </button>
                  <link-button
                    v-else
                    v-rol:admin="user"
                    name="AddMySale"
                    :params="{ id: piece.id }"
                    class="text-base text-white font-bold bg-green-500 ml-4 p-4 rounded p-1.5"
                  >
                    Añadir venta
                  </link-button>
                </div>
              </div>
            </div>
            <!-- END Article -->
          </div>
        </div>

        <div v-if="pieces.length == 0" class="flex flex-wrap -mx-1 lg:-mx-2">
          <p class="pt-2 pb-4 font-bold text-red-600 text-lg">
            {{ errorTabla }}
          </p>
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
import Message from "../components/message";
import ImageServer from "../components/image-server.vue";
import Commons from "../../helpers/commons";

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
    this.$store.commit("SET_TITLE", "Mis piezas cerámicas");
  },
  data: function () {
    return {
      pieces: [],
      paginate: ["pieces"],
      message: null,
      messageType: null,
      errorTabla: "",
      user: {},
      pageSize: 3,
      searchForm: {},
    };
  },
  mounted() {
    this.searchForm = { buscaNombre: "", buscaVendido: "" };

    var success = this.$route.query.success;
    if (success && success == "addSale") {
      Commons.showSuccess(
        this,
        "La pieza ha sido actualizada a vendida correctamente",
        5
      );
    }
    this.user = JSON.parse(sessionStorage.getItem("user"));
    this.search();
  },
  methods: {
    destroy: function (id) {
      Commons.destroy(
        this,
        `mypieces/${this.user.id}`,
        id,
        "pieces",
        "No existen piezas para este criterio de búsqueda"
      );
    },
    //No se puede utilizar el del commun porque no es el mismo
    delSale: function (id) {
      axios
        .delete(`${process.env.VUE_APP_API}/mysales/${this.user.id}/${id}`)
        .then((result) => {
          if (result.data.success) {
            this.search();
            Commons.showSuccess(this, result.data.message, 5);

            if (this.pieces.length == 0) {
              this.errorTabla =
                "No existen piezas para este criterio de búsqueda";
            }
          } else {
            Commons.showError(this, result.data.message);
          }
        })
        .catch((error) => {
          if (error.response) {
            Commons.showError(this, error.response.data.message);
          } else {
            Commons.showError(this, "Ha ocurrido un error inesperado");
          }
        });
    },
    edit: function (id) {
      this.$router.push({
        name: "EditMyPiece",
        params: { idUser: this.user.id, id: id },
      });
    },
    detail: function (id) {
      this.$router.push({ name: "DetailPiece", params: { id: id } });
    },
    search: function () {
      Commons.search(
        this,
        `mypieces/${this.user.id}`,
        "pieces",
        "No existen piezas para este criterio de búsqueda",
        "Mis piezas realizadas"
      );
    },
  },
};
</script>
