<!--
  Vista de edición de pieza.
  Edita a las piezas de la api.
  Solo puede acceder los usuarios de tipo admin.
-->
<template>
  <div>
    <card-sin-logo>
      <!-- Información operación -->
      <message :message="message" :type="messageType" />
      <h2 class="mt-4 justify-center font-bold text-center text-xl text-white rounded pott-dark-full p-1 mb-2">
        Pieza: {{piece.name}}
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
            ref="imageSer"
          />
        </div>
      </div>

      <form method="POST" action="" ref="form">
        <!-- Name -->
        <div>
          <v-label for="name">Nombre</v-label>

          <v-input
            id="name"
            class="block mt-1 w-full rounded-md shadow-sm border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            type="text"
            name="name"
            v-model="piece.name"
            required
          />

          <validation v-if="error.name" :errors="error.name" />
        </div>

        <!-- Description -->
        <div div class="mt-4">
          <v-label for="description">Descripción</v-label>

          <v-input
            id="description"
            class="block mt-1 w-full"
            type="text"
            name="description"
            v-model="piece.description"
            required
          />

          <validation v-if="error.description" :errors="error.description" />
        </div>

        <!-- Visualización cambio img-->
        <div class="mt-4">
          <v-label for="imgAct" class="font-bold"
            >Visualización en pequeño</v-label
          >

          <div class="flex flex-wrap justify-center mt-2">
            <div class="w-6/12 sm:w-4/12 px-4">
              <image-server
                type="img"
                :id="piece.id"
                :params="{
                  alt: 'Imagen de pieza',
                  class:
                    'shadow rounded max-w-full h-auto align-middle border-none',
                }"
                ref="preview"
              />
            </div>
          </div>
        </div>

        <!-- Imagen Nueva-->
        <div class="mt-4">
          <v-label for="image" class="font-bold">Imagen nueva:</v-label>
          <v-input
            id="image"
            class="block mt-1 w-full"
            type="file"
            @change.native="uploadImg"
            name="image"
            ref="image"
          />
        </div>

        <div class="mt-4">
          <link-button
            name="Pieces"
            class="md:inline-flex mb-2 items-center px-4 py-2 bg-gray-800 border border-transparent rounded-md font-semibold text-xs uppercase tracking-widest hover:bg-gray-700 active:bg-gray-900 focus:outline-none focus:border-gray-900 focus:ring ring-gray-300 disabled:opacity-25 transition ease-in-out duration-150 ml-4 flex float-left text-white font-bold pott-dark-full p-4 rounded p-1.5"
          >
            Volver a "Piezas cerámicas"
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

import Message from "../components/message";
import VLabel from "../components/v-label";
import VInput from "../components/v-input";
import LinkButton from "../components/linkButton.vue";
import VButton from "../components/v-button";
import Validation from "../components/validation.vue";
import CardSinLogo from "../components/card-sin-logo.vue";
import ImageServer from "../components/image-server.vue";
import Commons from "../../helpers/commons";

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
    this.$store.commit("SET_TITLE", "Piezas cerámicas -> Editar pieza");
  },
  data: function () {
    return {
      piece: {},
      message: null,
      messageType: null,
      id: "",
      error: {
        name: [],
        description: [],
        sold: [],
      },
      image: "",
    };
  },
  mounted() {
    
    Commons.loadForm(this,'pieces','piece','Piezas realizadas --> Editar pieza');
  },
  methods: {
    //No se utiliza el del commons porque guarda imgs y es diferente.
    save: function () {
      var id = this.$route.params.id;

      if (!this.validate()) {
        return;
      }

      //PARA ENVIAR IMG, NECESARIO USAR EL FORMDATA
      var formData = new FormData();

      //EL BUCLE RELLENA EL FORMDATA CON LOS DATOS DEL MODELO
      for (const property in this.piece) {
        const value = this.piece[property];
        formData.append(property, value);
      }

      //GUARDA LA IMAGEN EN EL FORM DATA
      formData.append("image", this.image);

      axios
        .post(`${process.env.VUE_APP_API}/pieces/${id}`, formData, {
          headers: {
            "content-type": "multipart/form-data",
          },
        })
        .then((result) => {
          Commons.showSuccess(this,"La pieza ha sido modificada correctamente");
          this.$refs.imageSer.refresh();
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
      var namePiec = this.piece.name;
      var descPiec = this.piece.description;
      var soldpiec = this.piece.sold;
      var valid = true;
      this.error = {
        name: [],
        description: [],
        sold: [],
      };

      if (!namePiec || namePiec.length < 3 || namePiec.length > 20) {
        this.error.name.push(
          "El campo no puede ser un número, debe tener al menos de 3 carácteres y no más de 20."
        );
        valid = false;
      }

      if (!descPiec || descPiec.length < 5 || descPiec.length > 255) {
        this.error.description.push(
          "El campo no puede ser un número, debe tener al menos de 5 carácteres y no más de 20."
        );
        valid = false;
      }

      if (soldpiec != 0 && soldpiec != 1) {
        this.error.sold.push("El campo es obligatorio.");
        valid = false;
      }

      return valid;
    },
    //Para previsualizar la img seleccionada.
    uploadImg: function () {
      let $this = this;
      this.image = this.$refs.image.$el.files[0]; //Actualiza el modelo con la img del server.

      if (FileReader && this.image) {
        var fr = new FileReader();
        fr.onload = function () {
          //Asigan a la variable el componente image-serve que se ha referenciado como preview.
          let previewComponent = $this.$refs.preview;

          //Accede a la referencia imagen del componente de previsualización, para modificar su src.
          previewComponent.$refs.imagen.src = fr.result;

          //Como previewcomponent es una instancia a image-serve, puede acceder a todos sus datos.
          previewComponent.urlOk();
        };
        fr.readAsDataURL(this.image);
      }
    },
  },
};
</script>
