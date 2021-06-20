<!--
  Vista de detalle de la pieza.
  Muestra los datos de la pieza junto su img y los materiales empleados.
  Puede acceder todos los roles.
-->
<template>
  <div>
    <!-- Información operación -->
    <message :message="message" :type="messageType" />
    <div class="py-8">
      <div class="max-w-7xl m-auto sm:px-6 lg:px-8">
        <div class="bg-white py-4 px-4 rounded border-2 border-gray-100 mb-6">
          <div class="flex pott-dark-full rounded pt-4">
            <h4 class="pb-4 m-auto text-white font-bold text-lg">
              {{ piece.name }}
            </h4>
          </div>
        </div>

        <div>
          <div class="flex justify-center space-y-1">
            <div class="bg-white rounded p-4">
              <image-server
                :params="{
                  class: 'ml-1 rounded h-80 mr-4 shadow-lg',
                  alt: 'imagen pieza',
                }"
                type="img"
                :id="piece.id"
              />
            </div>
          </div>
          <div class="bg-white rounded p-4 mt-4">
            <p>
              <span class="font-bold text-black">·Nombre de la pieza: </span>
              {{ piece.name }}
            </p>
            <p>
              <span class="font-bold text-black">·Descripción: </span>
              {{ piece.description }}
            </p>
            <p>
              <span class="font-bold text-black">·Autor: </span>
              {{ user.name }} (<span class="font-bold text-yellow-500">
                {{ user.email }}</span
              >)
            </p>
            <p>
              <span class="font-bold text-black">·Estado de venta: </span>
              <span v-if="piece.sold == 0">Aún en venta.</span>
              <span v-else class="font-bold text-green-600">Vendida.</span>
            </p>
          </div>
          <div class="flex items-center justify-center mt-4">
            <link-button
              name="Pieces"
              class="inline-flex items-center px-4 py-2 bg-gray-800 border border-transparent rounded-md font-semibold text-xs uppercase tracking-widest hover:bg-gray-700 active:bg-gray-900 focus:outline-none focus:border-gray-900 focus:ring ring-gray-300 disabled:opacity-25 transition ease-in-out duration-150 ml-4 flex float-left text-white font-bold pott-dark-full p-4 rounded p-1.5"
            >
              Volver
            </link-button>
          </div>

          <div
            class="mt-6 bg-white mb-6 overflow-auto shadow-sm sm:rounded-lg border-2 border-gray-400 p-4"
          >
            <div class="flex bg-purple-400 rounded p-4 rounded border-2 w-full">
              <h4 class="m-auto text-white font-bold text-lg">
                Materiales empleados en la pieza
              </h4>
            </div>
            <table class="w-full">
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
                    Toxicidad
                  </th>
                </tr>
              </thead>
              <tbody class="text-gray-500 divide-y divide-gray-200">
                <tr
                  for
                  v-for="material in materials"
                  v-bind:key="material.id"
                  class="text-center"
                >
                  <td class="py-3">{{ material.name }}</td>
                  <td class="py-3">{{ material.type_material }}</td>
                  <td class="py-3">{{ material.temperature }}</td>
                  <td
                    v-if="material.toxic == 1"
                    class="py-3 bg-pink-700 text-white font-bold"
                  >
                    Tóxico
                  </td>
                  <td v-else class="py-3 bg-pink-200 font-bold">No tóxico</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

import Message from "../components/message";
import VLabel from "../components/v-label";
import VInput from "../components/v-input";
import LinkButton from "../components/linkButton.vue";
import VButton from "../components/v-button";
import Validation from "../components/validation.vue";
import CardSinLogo from "../components/card-sin-logo.vue";
import ImageServer from "../components/image-server.vue";

export default {
  components: {
    Message,
    VLabel,
    VInput,
    LinkButton,
    VButton,
    Validation,
    CardSinLogo,
    ImageServer,
  },
  created() {
    this.$store.commit("SET_TITLE"," Pieza vista en detalle");
  },
  data: function () {
    return {
      piece: {},
      user:{},
      materials:{},
      message: null,
      messageType: null,
      id: "",
    };
  },
  mounted() {
    var id = this.$route.params.id;
    axios
      .get(`${process.env.VUE_APP_API}/pieces/detail/${id}`)
      .then((result) => {
        this.piece = result.data.piece;
        this.user = result.data.user;
        this.materials = result.data.materials;
      })
      .catch(() => {
        this.errorTabla = "Ha ocurrido un error inesperado";
      });
  },
};
</script>