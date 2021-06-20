<!--
  Componente que carga unos estilos específicos de maquetación.
  Carga en concreto los estilos y funciones de la barra desplegable.
-->
<template>
  <div class="relative" x-data="{open : false}" x-on:click.away="open = false" x-on:close.stop="open = false">
    <div x-on:click="open = !open">
      <slot name="trigger" />
    </div>

    <div
      x-show="open"
      x-transition:enter="transition ease-out duration-200"
      x-transition:enter-start="transform opacity-0 scale-95"
      x-transition:enter-end="transform opacity-100 scale-100"
      x-transition:leave="transition ease-in duration-75"
      x-transition:leave-start="transform opacity-100 scale-100"
      x-transition:leave-end="transform opacity-0 scale-95"
      class="absolute z-50 mt-2 w-48 rounded-md shadow-lg"
      :class="alignClass"
      style="display: none"
      x-on:click="open = false"
    >
      <div class="rounded-md ring-1 ring-black ring-opacity-5 py-1 bg-white">
        <slot name="content" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["align"],
  computed: {
    alignClass: function () {
      switch (this.align) {
        case "left":
          return "origin-top-left left-0";
        case "top":
          return "origin-top";
        default:
          return "origin-top-right right-0";
      }
    },
  },
};
</script>