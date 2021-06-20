<!--
  Vista de edición de perfil.
  Edita al usuario que está logado.
  Accederá el usuario logado con sus datos.
-->
<template>
  <div>
    <card-sin-logo>
      <!-- Información operación -->
      <message :message="message" :type="messageType" />
      <h2 class="mt-4 justify-center font-bold text-center text-xl text-white rounded pott-dark-full p-1 mb-2">
        Perfil
      </h2>

      <div v-if="auth">
        <form method="POST" action="" ref="form">
          <!-- Name -->
          <div>
            <v-label for="name">Nombre</v-label>

            <v-input
              id="name"
              class="block mt-1 w-full rounded-md shadow-sm border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              type="text"
              name="name"
              v-model="user.name"
              required
            />

            <validation v-if="error.name" :errors="error.name" />
          </div>

          <!-- Email Address -->
          <div class="mt-4">
            <v-label for="email">Email</v-label>

            <v-input
              id="email"
              class="block mt-1 w-full"
              type="email"
              name="email"
              v-model="user.email"
              required
            />

            <validation v-if="error.email" :errors="error.email" />
          </div>

          <!-- Password -->
          <div class="mt-4">
            <v-label for="password">Contraseña</v-label>

            <v-input
              id="password"
              class="block mt-1 w-full"
              type="password"
              name="password"
              v-model="user.password"
              required
            />

            <validation v-if="error.password" :errors="error.password" />
          </div>

          <!-- Confirm Password -->
          <div class="mt-4">
            <v-label for="password_confirmation">Confirmar contraseña</v-label>

            <v-input
              id="password_confirmation"
              class="block mt-1 w-full"
              type="password"
              name="password_confirmation"
              v-model="user.password_confirmation"
              required
            />
            <validation
              v-if="error.password_confirmation"
              :errors="error.password_confirmation"
            />
          </div>

          <!-- Nick -->
          <div class="mt-4">
            <v-label for="nick">Nick</v-label>

            <v-input
              id="nick"
              class="block mt-1 w-full"
              type="text"
              name="nick"
              v-model="user.nick"
              required
            />

            <validation v-if="error.nick" :errors="error.nick" />
          </div>

          <!-- Imagen Actual-->
          <div class="mt-4">
            <v-label for="imgAct" class="font-bold">Imagen actual</v-label>

            <div class="flex flex-wrap justify-center mt-2">
              <div class="w-6/12 sm:w-4/12 px-4">
                <image-server
                  type="avatar"
                  :id="user.id"
                  :params="{
                    alt: 'Imagen de perfil',
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

          <!-- Boton-->
          <div class="mt-4">
            <v-button
              class="ml-4 flex float-right text-white font-bold bg-purple-600 p-4 rounded p-1.5"
              @click.native="save"
            >
              Guardar
            </v-button>
          </div>
        </form>
      </div>
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
import Commons from "../../helpers/commons";

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
    this.$store.commit("SET_TITLE", "Editar mi perfil");
  },
  data: function () {
    return {
      user: {},
      message: null,
      messageType: null,
      id: "",
      auth: true,
      error: {
        name: [],
        email: [],
        password: [],
        password_confirmation: [],
        nick: [],
      },
      image: "",
    };
  },
  mounted() {
    Commons.loadForm(this, "users/profile", "user", "Editar perfil");
  },
  methods: {
    //Al ser un guardado con img, se realiza de forma diferente que en commons.
    save: function () {
      var id = this.$route.params.id;

      if (!this.validate()) {
        return;
      }

      //PARA ENVIAR IMG, NECESARIO USAR EL FORMDATA
      var formData = new FormData();

      //EL BUCLE RELLENA EL FORMDATA CON LOS DATOS DEL MODELO
      for (const property in this.user) {
        const value = this.user[property];
        formData.append(property, value);
      }

      //GUARDA LA IMAGEN EN EL FORM DATA
      formData.append("image", this.image);

      axios
        .post(`${process.env.VUE_APP_API}/users/profile/${id}`, formData, {
          headers: {
            "content-type": "multipart/form-data",
          },
        })
        .then((result) => {
          //Actualizamos la caché del registro
          let userStorage = JSON.stringify(this.user);
          sessionStorage.setItem("user", userStorage);

          //Mandamos el mensaje de éxito
          Commons.showSuccess(this,"Se han guardado los cambios de su perfil.Se va a refrescar los datos en 5 segundos.");

          //Recargamos página de edit perfil para que aparezcan los nuevos cambios
          setTimeout(function () {
            location.reload()
          }, 5000);
        })
        .catch((error) => {
          this.messageType = "error";
          if (error.response.data.errors) {
            for (let fieldError in error.response.data.errors) {
              this.error[fieldError] = error.response.data.errors[fieldError];
            }
          } else if (error.response) {
            this.message = error.response.data.message;
          } else {
            this.message = "Ha ocurrido un error inesperado";
          }
        });
    },
    validate: function () {
      var nameUser = this.user.name;
      var emailUser = this.user.email;
      var nickUser = this.user.nick;
      var passwordUser = this.user.password;
      var regexEmail = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
      var valid = true;
      this.error = {
        name: [],
        email: [],
        password: [],
        nick: [],
      };

      if (nameUser.length < 6 || nameUser.length > 255 || !nameUser) {
        this.error.name.push(
          "El campo no puede ser un número, debe tener al menos de 6 carácteres y no más de 255."
        );
        valid = false;
      }

      if (
        emailUser.length < 6 ||
        emailUser.length > 255 ||
        !emailUser ||
        !regexEmail.test(emailUser)
      ) {
        this.error.email.push(
          "El campo debe ser un email válido de al menos de 6 carácteres y máximo 255."
        );
        valid = false;
      }

      if (!passwordUser || passwordUser.length < 8) {
        this.error.password.push("El campo debe tener 8 carácteres.");
        valid = false;
      }

      if (nickUser.length < 4 || nickUser.length > 255 || !nickUser) {
        this.error.nick.push(
          "El campo debe tener al menos 4 carácteres y no más de 255."
        );
        valid = false;
      }

      return valid;
    },
    //Para previsualizar la img seleccionada.
    uploadImg: function () {
      let $this = this;
      this.image = this.$refs.image.$el.files[0];//Actualiza el modelo con la img del server.

      if (FileReader && this.image) {
        var fr = new FileReader();
        fr.onload = function () {
          //Asigan a la variable el componente image-serve que se ha referenciado como preview.
          let previewComponent= $this.$refs.preview; 

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
