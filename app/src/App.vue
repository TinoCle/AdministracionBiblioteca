<template>
  <v-app>
    <v-app-bar color="blue-grey darken-3" dark app>
      <v-btn icon to="/" class="ml-1" color="blue-grey darken-3">
        <img alt="Vue logo" src="./assets/logo.png" width="40rem" />
      </v-btn>
      <v-toolbar-title>Biblioteca Online</v-toolbar-title>
      <v-spacer></v-spacer>
    </v-app-bar>
    <router-view></router-view>
  </v-app>
</template>

<script>

export default {
  name: "App",

  data: () => ({
    
  }),
  methods() {

  }
};
</script>
