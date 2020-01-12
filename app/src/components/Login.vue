<template>
  <v-app id="container">
    <v-container fluid class="mx-auto my-auto">
      <v-row>
        <v-col cols="12">
          <v-row justify="center">
            <v-card elevation="10" class="mt-5 px-4" shaped>
              <v-card-title>Iniciar sesión</v-card-title>
              <v-card-text>
                <v-form v-model="valid" @submit="formSubmit" ref="form">
                  <v-text-field
                    v-model="email"
                    :rules="emailRules"
                    label="E-mail"
                    prepend-icon="mdi-account-circle"
                    required
                  ></v-text-field>
                  <v-text-field
                    v-model="password"
                    :rules="[v => !!v || 'Debe ingresar su contraseña']"
                    :append-icon="showPass ? 'mdi-eye-off' : 'mdi-eye'"
                    :type="showPass ? 'password' : 'text'"
                    name="input-10-2"
                    label="Contraseña"
                    class="input-group--focused"
                    prepend-icon="mdi-lock"
                    @click:append="showPass = !showPass"
                    required
                  ></v-text-field>
                  <div class="pt-3">
                    <v-btn
                      :disabled="!valid"
                      block
                      rounded
                      color="info"
                      id="ingresar"
                      type="submit"
                    >Ingresar</v-btn>
                  </div>
                  <center class="pt-4 pb-1">
                    <p style="color:red">{{message}}</p>
                  </center>
                </v-form>
              </v-card-text>
            </v-card>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
export default {
  name: "Login",

  data: () => ({
    email: "",
    password: "",
    showPass: true,
    emailRules: [
      v => !!v || "Debe ingresar su e-mail",
      v => /.+@.+\..+/.test(v) || "Este e-mail no es válido", // algo@algo.algo
      v => (v || "").indexOf(" ") < 0 || "Este e-mail no es válido" // sin espacios
    ],
    message: "",
    valid: false
  }),
  methods: {
    formSubmit(e) {
      e.preventDefault();
      let me = this;
      this.axios
        .post("http://localhost:5555/login", {
          email: this.email,
          password: this.password
        })
        .then(function(response) {
          me.message = "";

          me.$session.start();
          me.$session.set("jwt", response.data.token);
          me.$session.set("accountID", response.data.id);
          me.$session.set("accountRole", response.data.role);
          me.axios.defaults.headers.common = {
            "authorization": me.$session.get("jwt")
          }
          if (response.data.role == 1) {
            me.$router.push("/homeSocio");
          }
          if (response.data.role == 0) {
            me.$router.push("homeBibliotecario");
          }
        })
        .catch(function(error) {
          if (error.response && error.response.status == 404) {
            me.message = "El e-mail y/o la contraseña son incorrectos";
          } else if ((error.response && error.response.status == 500) || error.message) {
            me.message =
              "Hubo un error, por favor vuelva a intentar en un momento.";
          }
        });
    }
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
