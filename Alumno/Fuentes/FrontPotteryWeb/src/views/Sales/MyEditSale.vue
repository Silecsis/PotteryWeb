<!--
  Vista de edición de venta del usuario logado.
  Muestra la venta de la api que ha realizado el usuario logado.
  Solo puede acceder y editarla el usuario logado. 
-->
<template>
  <div>
    <card-sin-logo>
      <!-- Información operación -->
      <message :message="message" :type="messageType" />

      <h2 class="mt-4 justify-center font-bold text-center text-xl text-white rounded pott-dark-full p-1 mb-2">
        Mi venta: {{sale.name}}
      </h2>

      <form method="POST">
        <!-- Price -->
        <div class="mt-4">
          <v-label for="price">Precio</v-label>

          <v-input
            id="price"
            class="block mt-1 w-full"
            type="number"
            name="price"
            v-model="sale.price"
            required
          />

          <validation v-if="error.price" :errors="error.price" />
        </div>

        <!-- Name -->
        <div>
          <v-label for="name">Nombre de venta</v-label>

          <v-input
            id="name"
            class="block mt-1 w-full rounded-md shadow-sm border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            type="text"
            name="name"
            v-model="sale.name"
            required
          />

          <validation v-if="error.name" :errors="error.name" />
        </div>

        <!-- Boton-->
        <div class="mt-4">
          <link-button
            name="MySales"
            :params="{ id: userLog.id }"
            class="md:inline-flex mb-2 items-center px-4 py-2 bg-gray-800 border border-transparent rounded-md font-semibold text-xs uppercase tracking-widest hover:bg-gray-700 active:bg-gray-900 focus:outline-none focus:border-gray-900 focus:ring ring-gray-300 disabled:opacity-25 transition ease-in-out duration-150 ml-4 flex float-left text-white font-bold pott-dark-full p-4 rounded p-1.5"
          >
            Volver
          </link-button>

          <v-button
            class="ml-4 flex md:float-right mb-2 text-white font-bold bg-purple-600 p-4 rounded p-1.5"
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
import CardSinLogo from "../components/card-sin-logo";
import Message from "../components/message";
import VLabel from "../components/v-label";
import VInput from "../components/v-input";
import LinkButton from "../components/linkButton.vue";
import VButton from "../components/v-button";
import Validation from "../components/validation.vue";
import Commons from '../../helpers/commons';

export default {
  components: {
    CardSinLogo,
    Message,
    VLabel,
    VInput,
    LinkButton,
    VButton,
    Validation,
  },
  created() {
    this.$store.commit("SET_TITLE", "Mis ventas realizadas -> Editar venta");
    this.userLog = JSON.parse(sessionStorage.getItem("user"));
  },
  data: function () {
    return {
      sale: {},
      message: null,
      messageType: null,
      id: "",
      error: {
        name: [],
        price: [],
      },
      userLog: null,
    };
  },
  mounted() {
    Commons.loadForm(this,`mysales/${this.userLog.id}`,"sale",'Mis ventas realizadas --> Editar venta');
  },
  methods: {
    save: function () {
      Commons.save(this,'edit',`mysales/${this.userLog.id}`,this.sale,"La venta ha sido modificada correctamente",this.validate);
    },
    validate: function () {
      var nameSale = this.sale.name;
      var priceSale = this.sale.price;
      var valid = true;
      this.error = {
        name: [],
        price: [],
      };

      if (!nameSale || nameSale.length < 3 || nameSale.length > 20) {
        this.error.name.push(
          "El campo no puede ser un número, debe tener al menos de 3 carácteres y no más de 20."
        );
        valid = false;
      }

      if (!priceSale || isNaN(priceSale)) {
        this.error.price.push("El campo debe ser un número entero válido.");
        valid = false;
      }

      return valid;
    },
  },
};
</script>
