<template>
  <div class="min-h-screen pott-ligth sm:max-w-300">
    <navigation/>
    <!-- Page Heading -->
    <header class="bg-white shadow pt-14">
      <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">
          {{ title }}
        </h2>
      </div>
    </header>
    <!-- Page Content -->
    <main>
      <router-view />
    </main>
  </div>
</template>

<script>
import { mapState } from "vuex";
import Navigation from "./Navigation.vue";

export default {
  computed: mapState(["title"]),
  components: {
    Navigation
  },
};
</script>