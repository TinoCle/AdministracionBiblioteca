<template>
  <v-app id="container">
    <v-container fluid class="mx-auto my-auto">
      <v-row align="center" justify="center">
        <v-col cols="4">
          <v-card max-width="600" class="mx-auto" shaped>
            <v-toolbar color="blue-grey darken-3" dark>
              <v-toolbar-title>Todos los libros</v-toolbar-title>
            </v-toolbar>
            <v-list three-line subheader elevation="10">
              <v-list-item v-for="book in books" :key="book.id">
                <v-list-item-content>
                  <v-list-item-title v-text="book.title"></v-list-item-title>
                  <v-list-item-subtitle v-text="book.author"></v-list-item-subtitle>
                  <v-list-item-subtitle v-if="book.inventory == 0" id="noStockSubtitle">Sin stock</v-list-item-subtitle>
                </v-list-item-content>

                <v-list-item-action>
                  <v-btn
                    class="ma-2"
                    elevation="4"
                    rounded
                    dark
                    color="light-blue"
                    v-if="!zeroBooks && book.inventory>0"
                    @click="lentBook(book.id)"
                  >Pedir</v-btn>
                  <v-btn
                    class="ma-2"
                    elevation="4"
                    rounded
                    dark
                    color="grey"
                    v-if="!zeroBooks && book.inventory == 0"
                  >Pedir</v-btn>
                  <v-btn
                    class="ma-2"
                    elevation="4"
                    rounded
                    dark
                    color="light-blue"
                    v-if="zeroBooks"
                    @click="getBooks"
                  >Reintentar</v-btn>
                </v-list-item-action>
              </v-list-item>
            </v-list>
          </v-card>
        </v-col>
        <v-col cols="4">
          <v-card max-width="600" class="mx-auto" shaped>
            <v-toolbar color="blue-grey darken-3" dark>
              <v-toolbar-title>Mis libros</v-toolbar-title>
            </v-toolbar>
            <v-list three-line subheader elevation="10">
              <v-list-item v-for="book in myBooks" :key="book.title">
                <v-list-item-content>
                  <v-list-item-title v-text="book.title" multiline></v-list-item-title>
                  <v-list-item-subtitle v-text="book.author"></v-list-item-subtitle>
                  <v-list-item-subtitle
                    v-if="book.expired == 'yes'"
                    id="expiredSubtitle"
                    v-text="book.expiration"
                  ></v-list-item-subtitle>
                  <v-list-item-subtitle
                    v-if="book.expired == 'almost'"
                    id="almostExpiredSubtitle"
                    v-text="book.expiration"
                  ></v-list-item-subtitle>
                  <v-list-item-subtitle v-if="book.expired == ''" v-text="book.expiration"></v-list-item-subtitle>
                </v-list-item-content>

                <v-list-item-action>
                  <v-btn
                    class="ma-2"
                    elevation="4"
                    rounded
                    dark
                    color="red"
                    v-if="!zeroMyBooks && !myBooksError"
                    @click="returnBook(book.id); refreshMyBooks();"
                  >Devolver</v-btn>
                  <v-btn
                    class="ma-2"
                    elevation="4"
                    rounded
                    dark
                    color="light-blue"
                    v-if="myBooksError"
                    @click="getMyBooks"
                  >Reintentar</v-btn>
                </v-list-item-action>
              </v-list-item>
            </v-list>
          </v-card>
        </v-col>
      </v-row>
      <v-snackbar v-model="snackbar" :timeout="3000" color="success" bottom>{{ snackText }}</v-snackbar>
      <v-dialog v-model="dialog" width="500">
        <v-card>
          <v-card-title color="white" class="headline light-blue" primary-title>{{ dialogTitle }}</v-card-title>

          <p class="mx-4 my-4">{{ dialogText }}</p>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn v-if="this.$session.exists()" color="primary" text @click="dialog = false">Cerrar</v-btn>
            <v-btn
              v-if="!this.$session.exists()"
              color="primary"
              text
              @click="goToLogin"
            >Iniciar sesión</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </v-app>
</template>

<script>
export default {
  name: "Login",

  data: () => ({
    books: [],
    myBooks: [],
    zeroBooks: false,
    zeroMyBooks: false,
    myBooksError: false,
    snackbar: false, snackText: "",
    dialog: false, dialogTitle: "", dialogText: "",
    expirationMessage: true,
    partnerName: ''
  }),
  methods: {
    getBooks() {
      var me = this;
      this.books = [];
      this.myBooks = [];
      this.axios
        .get("http://localhost:5555/books")
        .then(response => {
          response.data.forEach(book => {
            me.books.push(book);
          });
          // Si no trajo ningún libro
          if (me.books.length == 0) {
            me.books.push({
              title: "No hay libros para mostrar",
              author: "Intente nuevamente más tarde"
            });
            me.myBooks.push({
              title: "No hay libros para mostrar",
              author: "Intente nuevamente más tarde"
            });
            me.zeroBooks = true;
          } else {
            me.zeroBooks = false;
          }
        })
        .catch(error => {
          me.zeroBooks = true;
          me.books.push({
            title: "Error al cargar los libros",
            author: "Vuelva a intentar en un momento"
          });
          me.myBooks.push({
            title: "No hay libros para mostrar",
            author: "Intente nuevamente más tarde"
          });
          me.checkSession(error);
        });
    },
    getMyBooks() {
      if (!this.zeroBooks) {
        this.myBooks = [];
        let me = this;
        this.axios
          .get("http://localhost:5555/loans")
          .then(response => {
            me.myBooksError = false;
            response.data.forEach(loan => {
              // Si corresponde a este usuario
              if (loan.partner == me.$session.get("accountID")) {
                me.books.forEach(book => {
                  let expiration,
                    expired = "";
                  if (book.id == loan.book) {
                    let difference = me.differenceInDays(loan.expiration_date);
                    if (difference < 0) {
                      expiration = `Venció hace ${difference * -1} día`;
                      expired = "yes";
                      this.showExpirationMessage();
                    } else {
                      expiration = `Vence en ${difference} día`;
                      if (difference <= 3) {
                        expired = "almost";
                      }
                    }
                    if (difference > 1 || difference < -1) {
                      expiration = expiration + "s";
                    }
                    if (difference == 0) {
                      expiration = "Vence hoy";
                    }
                    me.myBooks.push({
                      title: book.title,
                      author: book.author,
                      expiration: expiration,
                      id: book.id,
                      expired: expired
                    });
                  }
                });
              }
            });
            // Si no trajo ningún libro
            if (me.myBooks.length == 0) {
              me.myBooks.push({
                title: "No hay libros para mostrar",
                author: ""
              });
              me.zeroMyBooks = true;
            } else {
              me.zeroMyBooks = false;
            }
          })
          .catch(error => {
            me.myBooksError = true;
            me.myBooks.push({
              title: "Error al cargar los libros",
              author: "Vuelva a intentar en un momento"
            });
            me.checkSession(error);
          });
      }
    },
    lentBook(id) {
      this.snackbar = false;
      this.snackText = "";
      let me = this;
      this.axios
        .post("http://localhost:5555/loans/lent", {
          Bid: id,
          Pid: me.$session.get("accountID")
        })
        .then(function() {
          me.snackbar = true;
          me.snackText = "Libro pedido con éxito";
          me.refreshMyBooks();
        })
        .catch(function(error) {
          if (error.message == "Network Error") {
            me.dialogTitle = "Error Interno";
            me.dialogText =
              "Ocurrió un error, por favor vuelva a intentar en un momento.";
            me.dialog = true;
          }
          if (
            error.response &&
            error.response.data.message ==
              "The partner has already lent that book."
          ) {
            me.dialogTitle = "Libro ya pedido";
            me.dialogText =
              "Este libro ya fue pedido, puede volver a pedirlo luego de devolverlo y así extender su periodo de préstamo.";
            me.dialog = true;
          }
          if (
            error.response &&
            error.response.data.message == "The partner has overdue debts."
          ) {
            me.dialogTitle = "Préstamos expirados";
            me.dialogText =
              "Para pedir libros primero debe devolver los libros cuyo préstamo haya expirado.";
            me.dialog = true;
          }
          me.checkSession(error);
        });
    },
    returnBook(id) {
      this.snackbar = false;
      this.snackText = "";
      let me = this;
      this.axios
        .post("http://localhost:5555/loans/return", {
          Bid: id,
          Pid: me.$session.get("accountID")
        })
        .then(() => {
          me.snackbar = true;
          me.snackText = "Libro devuelto con éxito";
          me.getBooks();
        })
        .catch(error => {
          if (error.message == "Network Error") {
            me.dialogTitle = "Error Interno";
            me.dialogText =
              "Ocurrió un error, por favor vuelva a intentar en un momento.";
            me.dialog = true;
          }
          me.checkSession(error);
        });
    },
    refreshMyBooks() {
      // Le doy tiempo al backend de actualizar todo
      setTimeout(() => this.getMyBooks(), 1000);
    },
    checkSession(error) {
      if (error.response) {
        if (error.response.data.message == "Invalid token") {
          this.dialogTitle = "Sesión expirada";
          this.dialogText =
            "Por favor, vuelva a iniciar sesión con sus credenciales.";
          this.dialog = true;
          this.$session.destroy();
        } else if (error.response.data.message == "No token provided.") {
          this.$session.destroy();
          this.$router.push("/login");
        }
      }
    },
    goToLogin() {
      this.dialog = false;
      this.$router.push("/login");
    },
    differenceInDays(date) {
      let now = new Date().toISOString();
      let d1 = Date.parse(now);
      let d2 = Date.parse(date);
      return Math.round((d2 - d1) / 1000 / 86400);
    },
    showExpirationMessage() {
      if (this.expirationMessage) {
        this.expirationMessage = false;
        this.dialogTitle = "Préstamos vencidos";
        this.dialogText = `
        Hola ${this.partnerName}, usted posee préstamos vencidos.
        Para poder pedir más libros deberá devolver aquellos cuya fecha de devolución ya haya pasado.
        `;
        this.dialog = true;
      }
    },
    getPartnerName() {
      let me = this;
      this.axios
        .get(`http://localhost:5555/partners/${this.$session.get("accountID")}`)
        .then(response => {
          this.partnerName = response.data.name;
        })
        .catch(error => {
          me.checkSession(error);
        });
    }
  },
  beforeMount() {
    this.axios.defaults.headers.common = {
      authorization: this.$session.get("jwt")
    };
    if (this.$session.exists()) {
      this.getBooks();
      this.getPartnerName();
      this.refreshMyBooks();
    } else {
      this.$router.push("/login");
    }
  }
};
</script>

<style>
#container {
  background: url("../assets/background2.jpg") no-repeat center center fixed;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
}
#almostExpiredSubtitle {
  color: rgb(255, 166, 0);
  font-weight: bold;
}
#expiredSubtitle {
  color: red;
  font-weight: bold;
}
#noStockSubtitle {
  color: red;
  font-weight: bold;
}
</style>
