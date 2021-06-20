<!--
  Componente que carga unos estilos específicos de maquetación.
  Son los estilos y funcionalidad específicos de los enlaces
  de la barra de navegacion (navigation, navigation-normal,navigation-responsive)
-->

<template>
  <a
    href="javascript:void(0)"
    @click="$router.push({ name })"
    :class="classes"
  >
    <slot />
  </a>
</template>

<script>
export default {
  props: ["name", "responsive"],
  computed: {
    isActive: function () {
      return this.$route.name == this.name;
    },

    classes: function () {

      if (this.responsive) {
          var comunes =
          "block pl-3 pr-4 py-2 border-l-4 text-base font-medium focus:outline-none transition duration-150 ease-in-out";
        if (this.isActive) {
          return (
            comunes + " border-pott-dark-full  text-indigo-700 bg-indigo-50 focus:text-indigo-800 focus:bg-indigo-100 focus:border-pott-dark-full "
          );
        } else {
          return (
            comunes +
            " border-transparent  text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300  focus:text-gray-800 focus:bg-gray-50 focus:border-gray-300"
          );
        }

      } else {
        var comunes =
          "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium leading-5 focus:outline-none transition duration-150 ease-in-out";
        if (this.isActive) {
          return (
            comunes + " border-pott-dark-full text-gray-900 focus:border-pott-dark-full"
          );
        } else {
          return (
            comunes +
            " border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 focus:text-gray-700 focus:border-gray-300"
          );
        }
      }
    },
  },
};
</script>