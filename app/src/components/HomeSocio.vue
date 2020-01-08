<template>
  <v-app id="container">
    <v-container fluid class="mx-auto my-auto">
      <v-row align="center" justify="center">
        <v-col cols="2">
          <router-link to="/listadoSocio">
            <v-img
              src="../assets/btn-lista.png"
              class="white--text align-end"
              text="hola"
            >
            </v-img>
          </router-link>
          <center><h2 class="white--text">Todos los libros</h2></center>
        </v-col>
        <v-col cols="2">
          <router-link to="/listadoSocio">
            <v-img
              src="../assets/btn-libros.png"
              class="white--text align-end"
              text="hola"
            >
            </v-img>
          </router-link>
          <center><h2 class="white--text">Mis libros</h2></center>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
export default {
  name: "Login",

  data: () => ({

  }),
  methods: {
  }
};
</script>

<style scoped>
#container {
  background: url("../assets/background2.jpg") no-repeat center center fixed;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
}
#ingresar {
  color: white;
}
#crear {
  text-transform: inherit;
}
</style>
