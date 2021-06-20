<template>
  <nav x-data="{ open: false }" class="z-50 pott-grey border-b border-gray-100 fixed w-full sm:max-w-300">
    <navigation-normal/>
    <navigation-responsive/>
  </nav>
</template>

<script>
import NavigationNormal from "./Navigation-Normal";
import NavigationResponsive from "./Navigation-Responsive";

export default {
  components: {
    NavigationNormal,
    NavigationResponsive,
  },
};
</script>