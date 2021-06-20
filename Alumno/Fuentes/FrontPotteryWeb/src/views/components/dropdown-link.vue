<!--
  Componente que carga unos estilos específicos de maquetación.
  Carga en concreto los estilos y funciones de la barra desplegable.
  Tienen los estilos de un enlace.
-->
<template>
  <a
    href="javascript:void(0)"
    @click="navigate"
    class="block px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 transition duration-150 ease-in-out"
  >
    <slot />
  </a>
</template>

<script>
export default {
 props: ["name"],
 methods:{
   navigate:function(){
     if(this.name){
       this.$router.push({name: this.name});
     }
   }
 }
}
</script>