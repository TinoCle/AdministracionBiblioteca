<template>
  <v-app id="container">
    <v-container fluid class="mx-auto my-auto">
      <v-row>
        <v-col cols="12">
          <v-row justify="center">
            <div id="background">
              <img alt="App logo" src="../assets/logo-big2.png" width="700rem" />
            </div>
          </v-row>
          <v-row justify="center">
            <v-btn to="/login" class="mt-10" outlined color="white" rounded>Iniciar sesión</v-btn>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<style scoped>
#container {
  background: url("../assets/background.jpg") no-repeat center center fixed;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
}
</style>