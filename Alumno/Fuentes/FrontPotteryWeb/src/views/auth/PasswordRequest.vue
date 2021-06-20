<!--
  Vista de Olvidé mi contraseña.
  Pueden acceder todos los usuarios no logados y logados.
  Al colocar un correo y darle a enviar, se enviará un 
  email a su cuenta de gmail por el sistema de envios de
  email que tiene laravel.

  También tiene las opciones de: 
    ·Volver a login. 
    ·Volver a dashboard (clicando sobre el logo)
-->
<template>
  <div
    class="w-56 md:w-1/4 mt-4 px-6 py-4 bg-white shadow-md overflow-hidden sm:rounded-lg"
  >
    <!-- Session Status -->
    <message :message="message" :type="messageType" />

    <div class="mb-4 text-sm text-gray-600">
      <p>  ¿Olvidaste la contraseña? Sin problemas. Danos tu dirección email y y te enviaremos un enlace para resetear tu contraseña que te permitirá elegir una nueva. </p>
    </div>

    <form method="POST" class="w-full sm:max-w-md">
      <!-- Email Address -->
      <div>
        <v-label for="email">Email</v-label>

        <v-input
          id="email"
          class="block mt-1 w-full"
          type="email"
          name="email"
          v-model="user.email"
          required
          autofocus
          @keyup.enter.native="enter"
        />
      </div>
    </form>
    <div class="mt-4">
      <link-button
        name="Login"
        class="md:inline-flex items-center px-4 py-2 bg-gray-800 border border-transparent rounded-md font-semibold text-xs uppercase tracking-widest hover:bg-gray-700 active:bg-gray-900 focus:outline-none focus:border-gray-900 focus:ring ring-gray-300 disabled:opacity-25 transition ease-in-out duration-150 flex float-left text-white font-bold bg-purple-600 p-4 rounded p-1.5"
      >
        Volver a "Login"
      </link-button>

      <v-button
        class="md:ml-4 flex md:float-right text-white font-bold p-4 rounded p-1.5"
        @click.native="request"
      >
        Solicitar cambio
      </v-button>
    </div>
  </div>
</template>

<script>
import axios from "axios";

import message from "../components/message.vue";
import NavLink from "../components/nav-link.vue";
import VInput from "../components/v-input";
import VLabel from "../components/v-label";
import VButton from "../components/v-button";
import Commons from "../../helpers/commons";
import Validation from "../components/validation.vue";
import LinkButton from "../components/linkButton.vue";

export default {
  components: {
    message,
    NavLink,
    VInput,
    VLabel,
    VButton,
    Validation,
    LinkButton,
  },
  data: function () {
    return {
      user: {},
      message: null,
      messageType: null,
      error: {
        email: [],
      },
    };
  },
  methods: {
    request: function () {
      if (!this.validate()) {
        return;
      }

      axios
        .post(`${process.env.VUE_APP_API}/password`, this.user)
        .then((result) => {
          Commons.showSuccess(this,"Correo enviado. Revise la bandeja de entrada del email introducido");
        })
        .catch((error) => {
          if (error.response.data.errors) {
            for (let fieldError in error.response.data.errors) {
              this.error[fieldError] = error.response.data.errors[fieldError];
            }
          } else if (error.response.data) {
            Commons.showError(this, error.response.data.message);
          } else {
            Commons.showError(this, "Ha ocurrido un error inesperado");
          }
        });
    },
    validate: function (formData) {
      var emailUser = this.user.email;
      var regexEmail = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
      // var regexPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
      var valid = true;

      this.error = {
        email: [],
      };

      if (
        !emailUser ||
        emailUser.length < 6 ||
        emailUser.length > 255 ||
        !regexEmail.test(emailUser)
      ) {
        this.error.email.push(
          "El campo debe ser un email válido de al menos de 6 carácteres y máximo 255."
        );
        valid = false;
      }

      return valid;
    },
  },
};
</script>
