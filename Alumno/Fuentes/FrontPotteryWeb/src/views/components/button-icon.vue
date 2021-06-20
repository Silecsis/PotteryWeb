<!--
  Componente que carga iconos de la web.
  Según el tipo que especifique, se carga un icono u otro.
-->
<template>
  <a href="javascript:void(0)">
    <svg
      v-if="type == 'remove'"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      class="h-5 w-5 text-red-500"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
      />
    </svg>

    <svg
      v-if="type == 'removeXL'"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      class="h-11 w-11 text-red-500 pt-4"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
      />
    </svg>

    <svg
      v-if="type == 'edit'"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      class="h-5 w-5 text-indigo-500"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
      />
    </svg>

    <svg
      v-if="type == 'msg'"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      class="h-9 w-9 text-purple-100 px-0.5 msg-purple-full rounded"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    </svg>

    <svg
      v-if="type == 'received'"
      viewBox="0 0 512 512"
      xmlns="http://www.w3.org/2000/svg"
      class="h-12 w-12 text-blue-100 px-0.5 rounded pt-4"
    >
      <title />
      <g data-name="1" id="_1">
        <path
          d="M255.13,385.54a15,15,0,0,1-11.14-5L103.67,224.93a15,15,0,0,1,11.14-25H171V63a15,15,0,0,1,15-15H324.3a15,15,0,0,1,15,15V199.89h56.16a15,15,0,0,1,11.14,25L266.27,380.58A15,15,0,0,1,255.13,385.54ZM148.53,229.89l106.6,118.25L361.74,229.89H324.3a15,15,0,0,1-15-15V78H201V214.89a15,15,0,0,1-15,15Z"
        />
        <path
          d="M390.84,450H119.43a65.37,65.37,0,0,1-65.3-65.29V346.54a15,15,0,0,1,30,0v38.17A35.34,35.34,0,0,0,119.43,420H390.84a35.33,35.33,0,0,0,35.29-35.29V346.54a15,15,0,0,1,30,0v38.17A65.37,65.37,0,0,1,390.84,450Z"
        />
      </g>
    </svg>

    <svg
      v-if="type == 'sended'"
      viewBox="0 0 512 512"
      xmlns="http://www.w3.org/2000/svg"
      class="h-12 w-12 text-blue-100 px-0.5 rounded pt-4"
    >
      <title />
      <g data-name="1" id="_1">
        <path
          d="M324.3,387.69H186a15,15,0,0,1-15-15V235.8H114.81a15,15,0,0,1-11.14-25.05L244,55.1a15,15,0,0,1,22.29,0L406.6,210.75a15,15,0,0,1-11.14,25.05H339.3V372.69A15,15,0,0,1,324.3,387.69ZM201,357.69H309.3V220.8a15,15,0,0,1,15-15h37.44L255.13,87.55,148.53,205.8H186a15,15,0,0,1,15,15Z"
        />
        <path
          d="M390.84,452.15H119.43a65.37,65.37,0,0,1-65.3-65.3V348.68a15,15,0,0,1,30,0v38.17a35.34,35.34,0,0,0,35.3,35.3H390.84a35.33,35.33,0,0,0,35.29-35.3V348.68a15,15,0,1,1,30,0v38.17A65.37,65.37,0,0,1,390.84,452.15Z"
        />
      </g>
    </svg>
  </a>
</template>

<script>
export default {
  props: ["type"],
  computed: {},
};
</script>