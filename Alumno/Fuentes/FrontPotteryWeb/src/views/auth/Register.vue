<!--
  Vista de Registrarme.
  Pueden acceder todos los usuarios no logados y logados.
  Al pulsar registrar entrada directamente logado a la web .

  También tiene las opciones de: 
    ·Volver a login. 
    ·Volver a dashboard (clicando sobre el logo).
-->
<template>
  <div
    class="w-56 md:w-1/3 mt-4 px-6 py-4 bg-white shadow-md overflow-hidden sm:rounded-lg rounded"
  >
    <!-- Session Status -->
    <message :message="message" :type="messageType" />
    <message :message="message1" :type="messageType1" />

    <form method="POST" action="">
      <div class="md:inline-flex w-full">
        <!-- Name -->
        <div class="md:float-left mr-5 w-1/3">
          <v-label for="name">Nombre</v-label>

          <v-input
            id="name"
            class="block mt-1 w-36 md:w-full"
            type="text"
            name="name"
            v-model="user.name"
            required
          />

          <validation v-if="error.name" :errors="error.name" />
        </div>

        <!-- Nick -->
        <div class="md:float-left mr-5 w-1/3">
          <v-label for="nick">Nick</v-label>

          <v-input
            id="nick"
            class="block mt-1 w-36 md:w-full"
            type="text"
            name="nick"
            v-model="user.nick"
            required
          />

          <validation v-if="error.nick" :errors="error.nick" />
        </div>

        <!-- Email Address -->
        <div class="md:float-left w-1/2">
          <v-label for="email">Email</v-label>

          <v-input
            id="email"
            class="block mt-1 w-36 md:w-full"
            type="email"
            name="email"
            v-model="user.email"
            required
          />

          <validation v-if="error.email" :errors="error.email" />
        </div>
      </div>

      <div class="md:inline-flex mt-4 w-full">
        <!-- Password -->
        <div class="md:float-left mr-5 w-full">
          <v-label for="password">Contraseña</v-label>

          <v-input
            id="password"
            class="block mt-1 w-36 md:w-full"
            type="password"
            name="password"
            v-model="user.password"
            required
          />

          <validation v-if="error.password" :errors="error.password" />
        </div>

        <!-- Confirm Password -->
        <div class="md:float-left w-full">
          <v-label for="password_confirmation">Confirmar contraseña</v-label>

          <v-input
            id="password_confirmation"
            class="block mt-1 w-36 md:w-full"
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
      </div>

      <!-- Boton-->
      <div class="mt-4">
        <link-button
          name="Login"
          class="md:inline-flex items-center px-4 py-2 bg-gray-800 border border-transparent rounded-md font-semibold text-xs uppercase tracking-widest hover:bg-gray-700 active:bg-gray-900 focus:outline-none focus:border-gray-900 focus:ring ring-gray-300 disabled:opacity-25 transition ease-in-out duration-150 flex float-left text-white font-bold bg-purple-600 p-4 rounded p-1.5"
        >
          Volver a "Login"
        </link-button>

        <v-button
          class="md:ml-4 flex md:float-right text-white font-bold p-4 rounded p-1.5"
          @click.native="save"
        >
          Registrar mis datos
        </v-button>
      </div>
    </form>
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
  components: { message, NavLink, VInput, VLabel, VButton, Validation, LinkButton },
  data: function () {
    return {
      user: {},
      message: null,
      messageType: null,
      error: {
        name: [],
        email: [],
        nick: [],
        email: [],
        password: [],
        password_confirmation: [],
      },
    };
  },
  computed: {
    message1: function () {
      var error = this.$route.query.error;
      if (error == "no-log") {
        return "Para poder comprar una pieza debe estar registrado en la web";
      }
    },
    messageType1: function () {
      var error = this.$route.query.error;
      if (error == "no-log") {
        return 'error';//Por si el mensaje trae un success o error
      }
    },
  },
  methods: {
    save: function () {
      if (!this.validate()) {
        return;
      }      

      axios
        .post(
          `${process.env.VUE_APP_API}/register`,this.user)
        .then((result) => {
            this.enter();
        })
        .catch((error) => {
          if (error.response.data) {
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
    validate: function (formData) {
      var nameUser = this.user.name;
      var emailUser = this.user.email;
      var nickUser = this.user.nick;
      var passwordUser = this.user.password;
      var regexEmail = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
      // var regexPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
      var valid = true;

      this.error = {
        name: [],
        email: [],
        nick: [],
        email: [],
        password: [],
        password_confirmation: [],
      };

      if (!nameUser || nameUser.length < 6 || nameUser.length > 255) {
        this.error.name.push(
          "El campo no puede ser un número, debe tener al menos de 6 carácteres y no más de 255."
        );
        valid = false;
      }

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

      if (!passwordUser || passwordUser.length < 8) {
        this.error.password.push("El campo debe tener 8 carácteres.");
        valid = false;
      }

      if (!nickUser || nickUser.length < 4 || nickUser.length > 255) {
        this.error.nick.push(
          "El campo debe tener al menos 4 carácteres y no más de 255."
        );
        valid = false;
      }

      return valid;
    },
    enter: function () {

      axios
        .post(`${process.env.VUE_APP_API}/login`, this.user)
        .then((result) => {
          if (result.status === 200) {
            let userStorage = JSON.stringify(result.data.user);
            sessionStorage.setItem("user", userStorage);
            sessionStorage.setItem("token", result.data.token);
            
            this.$router.push({ name: "Dashboard" });
          } else {
            this.showError(result.data.message);
          }
        })
        .catch((error) => {
          if(error.response){
            if ( error.response.data.error == "Unauthorised") {
            this.showError(
              "Los datos introducidos no residen en nuestra base de datos"
            );}
          } else if (error.response) {
            this.message = error.response.data.message;
          }else {
            this.showError("Ha ocurrido un error inesperado");
          }
        });
    },
  },
};
</script>
