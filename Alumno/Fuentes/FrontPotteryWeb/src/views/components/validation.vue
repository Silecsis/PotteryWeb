<!--
  Componente que carga unos estilos específicos de maquetación.
  Carga en concreto los estilos y funciones de las validaciones
-->
<template>
  <ul class="text-red-600 mt-2">
    <li v-for="error in errors" v-bind:key="error">{{ error }}</li>
  </ul>
</template>

<script>
export default {
  props: ["errors"],
};
</script>