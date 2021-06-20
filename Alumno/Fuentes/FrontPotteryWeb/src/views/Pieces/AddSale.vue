<!--
  Vista de nuevo añadir venta.
  Crea una nueva venta a la api y modifica el estado de venta de la pieza a vendido.
  Solo puede acceder los usuarios de tipo admin.
-->
<template>
  <div>
    <card-sin-logo>
      <!-- Información operación -->
      <message :message="message" :type="messageType" />
      <h2 class="mt-4 justify-center font-bold text-center text-xl text-white rounded pott-dark-full p-1 mb-2">
        Registrar Venta
      </h2>
      <div class="flex justify-center space-x-1">
        <div class="bg-white rounded p-4">
          <image-server
            :params="{
              class: 'rounded h-50 shadow-lg',
              alt: 'imagen pieza',
            }"
            type="img"
            :id="piece.id"
          />
        </div>
      </div>

      <div class="flex justify-center space-x-1">
        <h4>
          ¡Un usuario más que vende algo! La web empieza a crecer. Ahora solo
          falta registrar su precio de venta y el nombre de la venta.
        </h4>
      </div>

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
          <v-label for="name">Nombre</v-label>

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
            name="Pieces"
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
import axios from "axios";

import CardSinLogo from "../components/card-sin-logo";
import Message from "../components/message";
import VLabel from "../components/v-label";
import VInput from "../components/v-input";
import LinkButton from "../components/linkButton.vue";
import VButton from "../components/v-button";
import Validation from "../components/validation.vue";
import ImageServer from "../components/image-server.vue";
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
    ImageServer,
  },
  created() {
    this.$store.commit("SET_TITLE", "Piezas cerámicas -> Añadir venta");
  },
  data: function () {
    return {
      piece: {},
      sale: {},
      message: null,
      messageType: null,
      idPiece: "",
      error: {
        name: [],
        price: [],
      },
      image: "",
    };
  },
  mounted() {
    var id = this.$route.params.id;
    axios
      .get(`${process.env.VUE_APP_API}/pieces/${id}`)
      .then((result) => {
        this.piece = result.data.data;
        this.idPiece = this.piece.id;
      })
      .catch(() => {
        this.errorTabla = "Ha ocurrido un error inesperado";
      });
  },
  methods: {
    //No se puede coger el commons porque en los result es diferente
    save: function () {
      var id = this.piece.id;

      if (!this.validate()) {
        return;
      }

      axios
        .post(`${process.env.VUE_APP_API}/addsale/${id}`,this.sale)
        .then((result) => {
            this.clear(); 
            
             //MANDAR A VISTA PIEZAS CON PARAMETRO DE TODO OK     
             this.$router.push({ name: "Pieces", query: { success: "addSale", id:this.piece.id } });
        })
        .catch((error) => {
          if (error.response.data.errors) {
            for (let fieldError in error.response.data.errors) {
              this.error[fieldError] = error.response.data.errors[fieldError];
            }
          } else if (error.response) {
            Commons.showError(this,error.response.data.message);
          } else {
            Commons.showError(this,"Ha ocurrido un error inesperado");
          }
        });
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
    clear:function(){
      this.sale.name="";
      this.sale.price=""; 
    }
  },
};
</script>