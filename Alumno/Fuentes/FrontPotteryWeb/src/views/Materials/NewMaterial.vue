<!--
  Vista de nuevo material.
  Crea un nuevo material a la api.
  Solo puede acceder los usuarios de tipo admin.
-->
<template>
  <div>
    <card-sin-logo>
      <!-- Información operación -->
      <message :message="message" :type="messageType" />
      <h2 class="mt-4 justify-center font-bold text-center text-xl text-white rounded pott-dark-full p-1 mb-2">
        Registrar Material
      </h2>

      <form method="POST" action="">
        <div>
          <v-label for="name">Nombre</v-label>

          <v-input
            id="name"
            class="block mt-1 w-full rounded-md shadow-sm border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            type="text"
            name="name"
            v-model="material.name"
            required
          />

          <validation v-if="error.name" :errors="error.name" />
        </div>

        <!-- Tipo de material -->
        <div div class="mt-4">
          <v-label for="name">Tipo de material</v-label>

          <v-input
            id="name"
            class="block mt-1 w-full rounded-md shadow-sm border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            type="text"
            name="name"
            v-model="material.type_material"
            required
          />
          <validation v-if="error.type_material" :errors="error.type_material" />
        </div>

        <!-- Temperature -->
        <div class="mt-4">
          <!--No es una errata, se escribe cocción. Es una propiedad en los materiales de ceramica-->
          <v-label for="temperatura">Temperatura de cocción</v-label>

          <v-input
            v-model="material.temperature"
            id="temperatura"
            class="block mt-1 w-full"
            type="number"
            name="temperature"
            required
          />
          <validation v-if="error.temperature" :errors="error.temperature" />
        </div>

        <!-- Toxic -->
        <div class="mt-4">
          <v-label for="sold">¿Tóxico?</v-label>
          <select
            v-model="material.toxic"
            name="sold"
            id="sold"
            class="rounded-md shadow-sm border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          >
            <option value="" selected disabled>Seleccione si es tóxico</option>
            <option value="0">No</option>
            <option value="1">Si</option>
          </select>
          <validation v-if="error.toxic" :errors="error.toxic" />
        </div>

        <!-- Boton-->
        <div class="mt-4">
          <link-button
            name="Materials"
            class="md:inline-flex mb-2 items-center px-4 py-2 bg-gray-800 border border-transparent rounded-md font-semibold text-xs uppercase tracking-widest hover:bg-gray-700 active:bg-gray-900 focus:outline-none focus:border-gray-900 focus:ring ring-gray-300 disabled:opacity-25 transition ease-in-out duration-150 ml-4 flex float-left text-white font-bold pott-dark-full p-4 rounded p-1.5"
          >
            Volver
          </link-button>

          <v-button
            class="ml-4 flex mb-2 md:float-right text-white font-bold bg-purple-600 p-4 rounded p-1.5"
            @click.native="save"
          >
            Guardar
          </v-button>
        </div>
      </form>
    </card-sin-logo>
  </div>
</template>

<script>
import cardSinLogo from "../components/card-sin-logo.vue";
import VLabel from "../components/v-label";
import VInput from "../components/v-input";
import VButton from "../components/v-button";
import Validation from "../components/validation.vue";
import LinkButton from "../components/linkButton.vue";
import Message from "../components/message";
import Commons from "../../helpers/commons";

export default {
  components: {
    cardSinLogo,
    Message,
    VLabel,
    VInput,
    LinkButton,
    VButton,
    Validation,
  },
  
  data: function () {
    return {
      material: {toxic:""},
      message: null,
      messageType: null,
      error: {
        name: [],
        type_material: [],
        temperature:[],
        toxic:[],
      },
    };
  },
  created() {
    this.$store.commit("SET_TITLE", "Materiales -> Nuevo Material");
  },
 
  methods: {
    save: function () { 
      Commons.save(this,'create','materials',this.material,"El material ha sido creado correctamente",this.validate,this.clear);
    },
     validate: function () {
      var nameMat = this.material.name;
      var typeMat = this.material.type_material;
      var tempMat = this.material.temperature;
      var toxicMat = this.material.toxic;
      var valid = true;
      this.error = {
        name: [],
        type_material: [],
        temperature: [],
        toxic: [],
      };

      if (!nameMat || nameMat.length < 3 || nameMat.length > 20) {
        this.error.name.push(
          "El campo no puede ser un número, debe tener al menos de 3 carácteres y no más de 20."
        );
        valid = false;
      }

      if (!typeMat || typeMat.length < 3 || typeMat.length > 20) {
        this.error.type_material.push(
          "El campo no puede ser un número, debe tener al menos de 3 carácteres y no más de 20."
        );
        valid = false;
      }

      if (!tempMat ||
        isNaN(tempMat)
      ) {
        this.error.temperature.push(
          "El campo debe ser un número entero válido."
        );
        valid = false;
      }

      if (toxicMat!=0 && toxicMat!=1) {
        this.error.toxic.push("El campo es obligatorio.");
        valid = false;
      }

      return valid;
    },
    clear:function(){
      this.material.name="";
      this.material.type_material="";
      this.material.temperature="";
      this.material.toxic="";
    }
  },
};
</script>