<!--
  Componente que carga unos estilos específicos de maquetación.
  Carga los estilos de un botón que se utiliza como enlace.
-->
<template>
  <a
    href="javascript:void(0)"
    @click="$router.push({ name,params })"
  >
    <slot />
  </a>
</template>

<script>
export default {
     props: ["name","params"],
     
}
</script>