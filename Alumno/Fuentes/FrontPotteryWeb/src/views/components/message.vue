<!--
  Componente que carga unos estilos específicos de maquetación.
  Carga los estilos de interacción con el usuario, es decir, 
  toda aquella información que queremos que el usuario sepa.

  Estos pueden ser de error o exito.
--><template>
  <div class="py-3" v-if="message">
    <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
      <div
        class="flex items-center overflow-hidden shadow-sm sm:rounded-lg m-auto"
      >
        <div
          class="px-10 py-4 border-2 rounded border-gray-100 m-auto"
          :class="[type == 'error' ? 'bg-red-100' : 'bg-green-100']"
        >
          <h2
            class="font-bold text-xl"
            :class="[type == 'error' ? 'text-red-600' : 'text-green-600']"
          >
            {{ message }}
          </h2>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["message", "type"],
};
</script>