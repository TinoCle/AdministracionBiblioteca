<template>
  <v-app id="container">
    <v-container fluid class="mx-auto my-auto">
      <v-row align="center" justify="center">
        <v-col cols="4">
          <v-card max-width="600" class="mx-auto" shaped>
            <v-toolbar color="blue-grey darken-3" dark>
              <v-toolbar-title>Todos los libros</v-toolbar-title>
            </v-toolbar>
            <v-list two-line subheader>
              <v-list-item v-for="book in books" :key="book.id">
                <v-list-item-content>
                  <v-list-item-title v-text="book.title"></v-list-item-title>
                  <v-list-item-subtitle v-text="book.author"></v-list-item-subtitle>
                </v-list-item-content>

                <v-list-item-action>
                  <v-btn
                    class="ma-2"
                    elevation="4"
                    rounded
                    dark
                    color="light-blue"
                    v-if="!zeroBooks"
                    @click="lentBook(book.id)"
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
            <v-list two-line subheader>
              <v-list-item v-for="book in myBooks" :key="book.title">
                <v-list-item-content>
                  <v-list-item-title v-text="book.title"></v-list-item-title>
                  <v-list-item-subtitle v-text="book.author"></v-list-item-subtitle>
                  <v-list-item-subtitle v-text="book.expiration"></v-list-item-subtitle>
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
      <v-snackbar v-model="snackbar" timeout="3000" color="success" bottom>{{ snackText }}</v-snackbar>
      <v-dialog v-model="dialog" width="500">
        <v-card>
          <v-card-title color="white" class="headline light-blue" primary-title>{{ dialogTitle }}</v-card-title>

          <p class="mx-4 my-4">{{ dialogText }}</p>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="dialog = false">Cerrar</v-btn>
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
    snackbar: false,
    snackText: "",
    dialog: false,
    dialogTitle: "",
    dialogText: ""
  }),
  methods: {
    checkLogin() {
      this.$store.state.accountId == 77 && this.$router.push("/login");
    },
    getBooks() {
      var me = this;
      this.books = [];
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
        .catch(() => {
          me.zeroBooks = true;
          me.books.push({
            title: "Error al cargar los libros",
            author: "Vuelva a intentar en un momento"
          });
          me.myBooks.push({
            title: "No hay libros para mostrar",
            author: "Intente nuevamente más tarde"
          });
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
              if (loan.partner == me.$store.state.accountId) {
                me.books.forEach(book => {
                  if (book.id == loan.book) {
                    me.myBooks.push({
                      title: book.title,
                      author: book.author,
                      expiration: `Vencimiento: ${loan.expiration_date.slice(
                        0,
                        10
                      )}`,
                      id: book.id
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
          .catch(() => {
            me.myBooksError = true;
            me.myBooks.push({
              title: "Error al cargar los libros",
              author: "Vuelva a intentar en un momento"
            });
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
          Pid: me.$store.state.accountId
        })
        .then(function() {
          me.snackbar = true;
          me.snackText = "Libro pedido con éxito";
          me.refreshMyBooks();
        })
        .catch(function(error) {
          if (error.message == "Network Error") {
            me.dialogTitle = "Error Interno";
            me.dialogText = "Ocurrió un error, por favor vuelva a intentar en un momento.";
            me.dialog = true;
          }
          if (
            error.response &&
            error.response.data.message ==
              "The partner has already lent that book."
          ) {
            me.dialogTitle = "Libro ya pedido";
            me.dialogText = "Este libro ya fue pedido, puede volver a pedirlo luego de devolverlo y así extender su periodo de préstamo.";
            me.dialog = true;
          }
        });
    },
    returnBook(id) {
      this.snackbar = false;
      this.snackText = "";
      let me = this;
      this.axios
        .post("http://localhost:5555/loans/return", {
          Bid: id,
          Pid: me.$store.state.accountId
        })
        .then(function() {
          me.snackbar = true;
          me.snackText = "Libro devuelto con éxito";
        })
        .catch(function(error) {
          if (error.message == "Network Error") {
            me.dialogTitle = "Error Interno";
            me.dialogText = "Ocurrió un error, por favor vuelva a intentar en un momento.";
            me.dialog = true;
          }
        });
    },
    refreshMyBooks() {
      // Le doy tiempo al backend de actualizar todo
      setTimeout(() => this.getMyBooks(), 1000);
    }
  },
  beforeMount() {
    this.checkLogin();
    this.getBooks();
    this.getMyBooks();
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
