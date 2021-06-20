<template>
  <div class="font-sans text-gray-900 antialiased min-h-full">
    <div
      class="min-h-screen min-w-max flex flex-col sm:justify-center items-center pt-5 pott-ligth pb-5"
    >
      <div>
        <link-button name="Dashboard">
          <application-logo class=" fill-current text-gray-500" />
        </link-button>
        <p class="font-sans md:font-serif text-2xl pl-4 bg-white mt-2 rounded">PotteryWeb</p>
      </div>

      <div
        class="w-full min-h-80 flex flex-col sm:justify-center sm:w-100 items-center "
      >
        <router-view />
      </div>
    </div>
  </div>
</template>


<script>
import LinkButton from "../components/linkButton.vue";
import ApplicationLogo from "../components/application-logo";

export default {
  components:{
    LinkButton,
    ApplicationLogo,
  },
}
</script>