<template>
  <v-app id="container">
    <v-container fluid class="mx-auto my-auto">
      <center>
        <h1 class="white-text" style="padding-top:100px">{{ saludo }}</h1>
      </center>
      <br />
      <br />
      <br />
      <!-- This is to brake the entire world, 3 times -->
      <v-row align="center" justify="center">
        <v-col cols="4" align-self="start">
          <v-card max-width="600" class="mx-auto" shaped>
            <v-toolbar color="blue-grey darken-3" dark>
              <v-toolbar-title>Todos los libros</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn
                icon
                @click="newBookDialog = true; newAuthor = ''; newTitle = ''; newInventory = 1"
              >
                <v-icon>mdi-book-plus</v-icon>
              </v-btn>
            </v-toolbar>
            <v-list two-line subheader elevation="10">
              <v-list-item
                v-for="(book, index) in books"
                :key="`book-${index}`"
                @click="zeroBooks ? selectedBook = null : selectedBook = book"
              >
                <v-list-item-content>
                  <v-list-item-title>📖 {{book.title}}</v-list-item-title>
                  <v-list-item-subtitle>👤 {{book.author}}</v-list-item-subtitle>
                </v-list-item-content>

                <v-list-item-action>
                  <v-btn
                    class="ma-2"
                    elevation="4"
                    rounded
                    dark
                    color="light-blue"
                    v-if="zeroBooks"
                    @click="refreshBooks"
                  >Reintentar</v-btn>
                </v-list-item-action>
              </v-list-item>
            </v-list>
          </v-card>
        </v-col>
        <v-col cols="4" v-if="selectedBook" align-self="start">
          <v-card max-width="600" class="mx-auto" shaped>
            <center>
              <p style="font-size:20px; padding:30px; padding-bottom:0px;">📖 {{selectedBook.title}}</p>
              <p style="font-size:15px;">👤 {{selectedBook.author}}</p>
              <v-divider></v-divider>
            </center>
            <v-row style="padding-bottom:20px;">
              <v-col>
                <p style="font-size:20px; padding-top:20px; padding-left:30px;">📚 Inventario:</p>
                <p
                  style="font-size:15px; padding-left:30px;"
                >🔹 Disponibles: {{selectedBook.inventory}}</p>
                <p style="font-size:15px; padding-left:30px;">🔹 Prestados: {{selectedBook.lent}}</p>
              </v-col>
              <v-col align-self="center" style="padding-top:20px;">
                <div style="padding-left:50px;">
                  <v-btn icon color="green" large @click="addCopy(selectedBook.id)">
                    <v-icon large>mdi-plus-circle</v-icon>
                  </v-btn>
                  <v-btn icon color="red" large @click="removeCopy(selectedBook.id)">
                    <v-icon large>mdi-minus-circle</v-icon>
                  </v-btn>
                </div>
              </v-col>
            </v-row>

            <v-fab-transition>
              <v-btn
                absolute
                dark
                fab
                bottom
                right
                color="light-blue"
                @click="editDialog=true; newAuthor=selectedBook.author; newTitle=selectedBook.title"
              >
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
            </v-fab-transition>
          </v-card>
        </v-col>
      </v-row>
      <v-row align="center" justify="center" style="padding-top:50px">
        <v-col cols="4">
          <v-card max-width="600" class="mx-auto" shaped>
            <v-toolbar color="blue-grey darken-3" dark>
              <v-toolbar-title>Préstamos</v-toolbar-title>
            </v-toolbar>
            <v-list three-line subheader elevation="10">
              <v-list-item v-for="loan in loans" :key="loan.book">
                <v-list-item-content>
                  <v-list-item-title>📖 {{loan.bookTitle}}</v-list-item-title>
                  <v-list-item-subtitle>👤 {{loan.partner}}</v-list-item-subtitle>
                  <v-list-item-subtitle
                    v-if="loan.expired == 'yes'"
                    id="expiredSubtitle"
                  >❗ {{loan.expiration}}</v-list-item-subtitle>
                  <v-list-item-subtitle
                    v-if="loan.expired == 'almost'"
                    id="almostExpiredSubtitle"
                    v-text="loan.expiration"
                  ></v-list-item-subtitle>
                  <v-list-item-subtitle v-if="loan.expired == ''" v-text="loan.expiration"></v-list-item-subtitle>
                </v-list-item-content>

                <v-list-item-action>
                  <v-btn
                    class="ma-2"
                    elevation="4"
                    rounded
                    dark
                    color="light-blue"
                    v-if="loansError"
                    @click="refreshBooks"
                  >Reintentar</v-btn>
                </v-list-item-action>
              </v-list-item>
            </v-list>
          </v-card>
        </v-col>
        <!-- <v-col cols="4"></v-col> -->
      </v-row>
      <v-snackbar v-model="snackbar" :timeout="3000" color="success" bottom>{{ snackText }}</v-snackbar>
      <v-dialog v-model="newBookDialog" width="500">
        <v-card>
          <v-card-title style="color:white;" class="headline light-blue" primary-title>Nuevo libro</v-card-title>

          <v-form v-model="validNewBook">
            <v-text-field
              v-model="newTitle"
              solo
              placeholder="Título"
              style="padding:30px; padding-bottom:0px;"
              prepend-icon="📖"
              :rules="requiredRules"
            ></v-text-field>
            <v-text-field
              v-model="newAuthor"
              solo
              placeholder="Autor"
              style="padding:30px; padding-bottom:0px;"
              prepend-icon="👤"
              :rules="requiredRules"
            ></v-text-field>
            <v-text-field
              v-model="newInventory"
              solo
              placeholder="Inventario"
              style="padding:30px; padding-top:5px; padding-bottom:0px;"
              prepend-icon="📚"
              :rules="inventoryRules"
            ></v-text-field>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="red" text @click="newBookDialog = false">Cancelar</v-btn>
              <v-btn
                :disabled="!validNewBook"
                color="primary"
                text
                @click="newBookDialog = false; addBook()"
              >Agregar</v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-dialog>
      <v-dialog v-model="editDialog" width="500">
        <v-card>
          <v-card-title style="color:white;" class="headline light-blue" primary-title>Editar libro</v-card-title>

          <v-text-field
            v-model="newTitle"
            solo
            placeholder="Título"
            style="padding:30px; padding-bottom:0px;"
          ></v-text-field>
          <v-text-field
            v-model="newAuthor"
            solo
            placeholder="Autor"
            style="padding:30px; padding-top:5px; padding-bottom:0px;"
          ></v-text-field>

          <v-card-actions>
            <v-btn color="red" icon @click="deleteBook(selectedBook.id)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn text @click="editDialog = false">Cancelar</v-btn>
            <v-btn
              color="primary"
              text
              @click="editDialog = false; modifyBook(selectedBook.id);"
            >Guardar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="dialog" width="500">
        <v-card>
          <v-card-title
            style="color:white;"
            class="headline light-blue"
            primary-title
          >{{ dialogTitle }}</v-card-title>

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
    loans: [],
    zeroBooks: false,
    loansError: false,
    snackbar: false,
    snackText: "",
    dialog: false,
    dialogTitle: "",
    dialogText: "",
    userName: "",
    saludo: "Bienvenid@",
    selectedBook: null,
    editDialog: false,
    newTitle: "",
    newAuthor: "",
    newInventory: 1,
    newBookDialog: false,
    validNewBook: false,
    inventoryRules: [
      v => !!v || "Debe ingresar la cantidad de unidades",
      v => /^[1-9]*$/.test(v) || "Ingrese una cantidad válida", // algo@algo.algo
      v => (v || "").indexOf(" ") < 0 || "Esta cantidad no es válida" // sin espacios
    ],
    requiredRules: [v => !!v || "Debe completar este campo"]
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
            if (me.selectedBook != null && me.selectedBook.id == book.id) {
              me.selectedBook = book;
            }
            me.books.push(book);
          });
          // Si no trajo ningún libro
          if (me.books.length == 0) {
            me.books.push({
              title: "No hay libros para mostrar",
              author: "Intente nuevamente más tarde"
            });
            // me.myBooks.push({
            //   title: "No hay libros para mostrar",
            //   author: "Intente nuevamente más tarde"
            // });
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
          // me.myBooks.push({
          //   title: "No hay libros para mostrar",
          //   author: "Intente nuevamente más tarde"
          // });
          me.checkSession(error);
        });
    },
    getLoans() {
      this.loans = [];
      if (!this.zeroBooks) {
        this.received = [];
        let me = this;
        me.loansError = false;
        this.axios
          .get("http://localhost:5555/loans")
          .then(response => {
            me.loansError = false;
            response.data.forEach(loan => {
              me.received.push(loan);
            });
          })
          .catch(error => {
            me.loansError = true;
            me.loans.push({
              bookTitle: "Error al cargar los préstamos",
              partner: "Vuelva a intentar en un momento"
            });
            me.checkSession(error);
          });
        setTimeout(() => {
          this.received.forEach(loan => {
            let title;
            for (let i = 0; i < this.books.length; i++) {
              if (this.books[i].id == loan.book) {
                title = this.books[i].title;
                break;
              }
            }
            let expiration,
              expired = "";
            let difference = this.differenceInDays(loan.expiration_date);
            if (difference < 0) {
              expiration = `Venció hace ${difference * -1} día`;
              expired = "yes";
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
            this.loans.push({
              bookTitle: title,
              partner: loan.partner,
              expiration: expiration,
              expired: expired
            });
            // Si no trajo ningún libro
            if (this.loans.length == 0) {
              this.loans.push({
                title: "No hay libros para mostrar",
                author: ""
              });
              this.zeroMyBooks = true;
            } else {
              this.zeroMyBooks = false;
            }
            this.books.forEach(book => {
              book.lent = 0;
              for (let i = 0; i < this.loans.length; i++) {
                if (book.title == this.loans[i].bookTitle) {
                  book.lent += 1;
                }
              }
            });
            this.getAllNames();
          });
        }, 500);
      } else {
        this.loansError = true;
        this.loans.push({
          bookTitle: "Error al cargar los préstamos",
          partner: "Vuelva a intentar en un momento"
        });
      }
    },
    modifyBook(id) {
      if (this.newTitle != "" || this.newAuthor != "") {
        // Relleno el que falte
        if (this.newTitle == "") {
          this.newTitle = this.selectedBook.title;
        }
        if (this.newAuthor == "") {
          this.newAuthor = this.selectedBook.author;
        }
        if (
          this.newTitle == this.selectedBook.title &&
          this.newAuthor == this.selectedBook.author
        ) {
          return; // no cambia nada
        }
        this.snackbar = false;
        this.editDialog = false;
        let me = this;
        this.axios
          .put(`http://localhost:5555/books/${id}`, {
            title: me.newTitle,
            author: me.newAuthor
          })
          .then(function() {
            me.snackText = "Libro modificado con éxito";
            me.snackbar = true;
            me.refreshBooks();
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
      }
    },
    addCopy(id) {
      this.snackbar = false;
      this.dialog = false;
      let me = this;
      this.axios
        .post(`http://localhost:5555/books/`, {
          id: id
        })
        .then(function() {
          me.refreshBooks();
          me.snackText = "Copia añadida con éxito";
          me.snackbar = true;
        })
        .catch(function(error) {
          if (error.message == "Network Error") {
            me.dialogTitle = "Error Interno";
            me.dialogText =
              "Ocurrió un error, por favor vuelva a intentar en un momento.";
            me.dialog = true;
          }
          me.checkSession(error);
        });
    },
    removeCopy(id) {
      this.snackbar = false;
      this.dialog = false;
      let me = this;
      if (this.selectedBook.inventory == 1) {
        this.deleteBook(id);
      } else {
        this.axios
          .delete(`http://localhost:5555/books/${id}`, {
            id: id
          })
          .then(function() {
            me.refreshBooks();
            me.snackText = "Copia eliminada con éxito";
            me.snackbar = true;
          })
          .catch(function(error) {
            if (error.message == "Network Error") {
              me.dialogTitle = "Error Interno";
              me.dialogText =
                "Ocurrió un error, por favor vuelva a intentar en un momento.";
              me.dialog = true;
            }
            me.checkSession(error);
          });
      }
    },
    deleteBook(id) {
      if (
        (this.selectedBook.title == this.newTitle &&
          this.selectedBook.author == this.newAuthor) ||
        this.selectedBook.inventory == 1
      ) {
        this.snackbar = false;
        this.dialog = false;
        let me = this;
        this.axios
          .delete(`http://localhost:5555/books/${id}`, { all: true })
          .then(function() {
            me.editDialog = false;
            me.selectedBook = null;
            me.snackText = "Libro eliminado con éxito";
            me.snackbar = true;
            me.refreshBooks();
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
              error.response.data.message == "The book has loans."
            ) {
              me.dialogTitle = "No se puede eliminar el libro";
              me.dialogText =
                "Este libro posee préstamos, todas las copias deben ser devueltas antes de eliminarlo del sistema.";
              me.dialog = true;
            }
            me.checkSession(error);
          });
      }
    },
    addBook() {
      this.snackbar = false;
      this.editDialog = false;
      let me = this;
      this.axios
        .post(`http://localhost:5555/books/`, {
          title: me.newTitle,
          author: me.newAuthor,
          inventory: me.newInventory
        })
        .then(function() {
          me.snackText = "Libro agregado con éxito";
          me.snackbar = true;
          me.refreshBooks();
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
    refreshBooks() {
      // Le doy tiempo al backend de actualizar todo
      setTimeout(() => this.getBooks(), 1000);
      setTimeout(() => this.getLoans(), 1500);
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
    getName() {
      let me = this;
      this.axios
        .get(`http://localhost:5555/partners/${me.$session.get("accountID")}`)
        .then(response => {
          // lo guardo para usarlo desde el diálogo emergente
          this.userName = response.data.name;
          this.generateGreeting();
        })
        .catch(error => {
          me.checkSession(error);
        });
    },
    getAllNames() {
      let me = this;
      this.axios
        .get("http://localhost:5555/partners")
        .then(response => {
          response.data.forEach(partner => {
            for (let i = 0; i < me.loans.length; i++) {
              if (me.loans[i].partner == partner.id) {
                me.loans[i].partner = `${partner.name} ${partner.surname}`;
              }
            }
          });
        })
        .catch(error => {
          me.checkSession(error);
        });
    },
    generateGreeting() {
      let hour = new Date().getHours();
      if (hour >= 0 && hour <= 5) {
        this.saludo = `Buenas noches, ${this.userName}`;
      } else if (hour > 5 && hour <= 12) {
        this.saludo = `Buen día, ${this.userName}`;
      } else if (hour >= 13 && hour <= 20) {
        this.saludo = `Buenas tardes, ${this.userName}`;
      } else {
        this.saludo = `Buenas noches, ${this.userName}`;
      }
    }
  },
  beforeMount() {
    this.axios.defaults.headers.common = {
      authorization: this.$session.get("jwt")
    };
    if (this.$session.exists()) {
      this.getName();
      this.refreshBooks();
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
h1 {
  color: white;
  font-size: 60px;
}
</style>
