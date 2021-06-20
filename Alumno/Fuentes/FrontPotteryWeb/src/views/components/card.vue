<!--
  Componente que carga unos estilos específicos de maquetación.
  Incluye unos estilos específicos para cargar imágenes
-->
<template>
  <div
    class="min-h-screen flex flex-col sm:justify-center items-center pt-0 bg-blue-100"
  >
    <div>
      <slot name="logo"/>
    </div>

    <div
      class="w-full sm:max-w-md mt-4 px-6 py-4 bg-white shadow-md overflow-hidden sm:rounded-lg"
    >
      <slot/>
    </div>
  </div>
</template>