<!--
  Componente que carga las imágenes desde el backend.
-->
<template>
  <div>
    <img
      v-if="url"
      @load="urlOk"
      @error="urlError"
      v-bind="params"
      :src="url"
      ref="imagen"
    />
    <img v-bind="params" ref="default" src="../../assets/img/default-img.png" />
  </div>
</template>

<script>
export default {
  props: ["type", "id", "params"],
  data: function(){
    return {
      now:Date.now(),

    }
  },
  computed: {
    url: function () {
      if (this.type && this.id) {
        return `${process.env.VUE_APP_API}/${this.type}/${this.id}?${this.now}`;
      }else{
        return `../../assets/img/default-img.png`;
      }
    },
  },
  methods: {
    urlError: function () {
      this.$refs.imagen.style.display = "none";
      this.$refs.default.style.display = null;
    },
    urlOk: function () {
      this.$refs.imagen.style.display = null;
      this.$refs.default.style.display = "none";
    },
    refresh: function(){
      this.now = Date.now();
    },
  },
};
</script>