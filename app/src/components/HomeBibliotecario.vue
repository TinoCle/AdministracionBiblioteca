<template>
  <v-app id="container">
    <v-container fluid class="mx-auto my-auto">
      <center>
        <h1 class="white-text" style="padding-top:100px">{{ saludo }}</h1>
      </center>
      <!-- This is to brake the entire world, 3 times -->
      <br />
      <br />
      <br />
      <v-row align="center" justify="center">
        <v-col cols="4" align-self="start">
          <v-card max-width="600" class="mx-auto" shaped>
            <v-toolbar color="blue-grey darken-3" dark>
              <v-toolbar-title>Todos los libros</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn
                icon
                @click="newBookDialog = true; newAuthor = ''; newTitle = ''; newInventory = null"
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
        <v-col cols="4" align-self="start">
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
        <v-col cols="4" align-self="start">
          <v-card max-width="600" class="mx-auto" shaped>
            <v-toolbar color="blue-grey darken-3" dark>
              <v-toolbar-title>Cuentas de usuario</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn
                icon
                @click="newAccount.dialog = true; clearNewAccount();"
              >
                <v-icon>mdi-account-plus</v-icon>
              </v-btn>
            </v-toolbar>
            <v-list two-line subheader elevation="10">
              <v-list-item v-for="account in accounts" :key="account.id">
                <v-list-item-content>
                  <v-list-item-title>👤 {{account.name}}</v-list-item-title>
                  <v-list-item-subtitle>🔰 {{account.role}}</v-list-item-subtitle>
                </v-list-item-content>

                <v-list-item-action v-if="account.id != $session.get('accountID')">
                  <v-btn icon color="red" @click="deleteAccount(account.id)">
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </v-list-item-action>

                <v-list-item-action>
                  <v-btn
                    class="ma-2"
                    elevation="4"
                    rounded
                    dark
                    color="light-blue"
                    v-if="accountsError"
                    @click="getAccounts"
                  >Reintentar</v-btn>
                </v-list-item-action>
              </v-list-item>
            </v-list>
          </v-card>
        </v-col>
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
              style="padding:30px; padding-bottom:0px; padding-top:0px;"
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
      <v-dialog v-model="newAccount.dialog" width="500">
        <v-card>
          <v-card-title
            style="color:white;"
            class="headline light-blue"
            primary-title
          >Nueva cuenta de usuario</v-card-title>

          <v-form v-model="newAccount.valid">
            <p style="font-size:20px; padding-top:30px; padding-left:30px;">📝 Datos personales:</p>
            <v-text-field
              v-model="newAccount.name"
              solo
              placeholder="Nombre"
              style="padding:30px; padding-bottom:0px; padding-top:10px;"
              prepend-icon="👤"
              :rules="newAccount.namingRules"
            ></v-text-field>
            <v-text-field
              v-model="newAccount.surname"
              solo
              placeholder="Apellido"
              style="padding:30px; padding-bottom:0px; padding-top:0px;"
              prepend-icon="👤"
              :rules="newAccount.namingRules"
            ></v-text-field>

            <p style="font-size:20px; padding-left:30px; padding-top:10px;">🔰 Rol:</p>
            <v-radio-group v-model="newAccount.role" style="padding-left:30px;">
              <v-radio label="Bibliotecario" :value="0" color="light-blue" style="padding-top:5px;"></v-radio>
              <v-radio label="Socio" :value="1" color="light-blue" style="padding-top:10px;"></v-radio>
            </v-radio-group>

            <p style="font-size:20px; padding-top:10px; padding-left:30px;">📝 Datos de la cuenta:</p>
            <v-text-field
              v-model="newAccount.email"
              solo
              placeholder="Email"
              style="padding:30px; padding-bottom:0px; padding-top:10px;"
              prepend-icon="mdi-account-circle"
              :rules="newAccount.emailRules"
            ></v-text-field>
            <v-text-field
              v-model="newAccount.password"
              solo
              placeholder="Contraseña"
              style="padding:30px; padding-bottom:0px; padding-top:0px;"
              prepend-icon="mdi-lock"
              :append-icon="!newAccount.showPass ? 'mdi-eye-off' : 'mdi-eye'"
              @click:append="newAccount.showPass = !newAccount.showPass"
              :rules="requiredRules"
              :type="!newAccount.showPass ? 'password' : 'text'"
            ></v-text-field>
            <v-text-field
              v-model="newAccount.password2"
              solo
              placeholder="Confirmación de contraseña"
              style="padding:30px; padding-bottom:0px; padding-top:0px;"
              prepend-icon="mdi-lock"
              :append-icon="!newAccount.showPass2 ? 'mdi-eye-off' : 'mdi-eye'"
              @click:append="newAccount.showPass2 = !newAccount.showPass2"
              :rules="newAccount.pwdConfirm"
              :type="!newAccount.showPass2 ? 'password' : 'text'"
            ></v-text-field>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="red" text @click="newAccount.dialog = false; clearNewAccount();">Cancelar</v-btn>
              <v-btn
                :disabled="!newAccount.valid"
                color="primary"
                text
                @click="addAccount()"
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

  data: function() {
    return {
      books: [],
      loans: [],
      accounts: [],
      zeroBooks: false,
      loansError: false,
      accountsError: false,
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
      newInventory: null,
      newBookDialog: false,
      newAccount: {
        valid: false,
        dialog: false,
        role: 0,
        name: null,
        surname: null,
        email: null,
        password: null,
        password2: null,
        showPass: false,
        showPass2: false,
        validNewBook: false,
        namingRules: [
          v => !!v || "Debe completar este campo",
          v =>
            /^[A-Za-z]+$/.test(v) ||
            "No se permiten números y/o caracteres especiales"
        ],
        emailRules: [
          v => !!v || "Debe ingresar su e-mail",
          v => /.+@.+\..+/.test(v) || "Este e-mail no es válido", // algo@algo.algo
          v => (v || "").indexOf(" ") < 0 || "Este e-mail no es válido" // sin espacios
        ],
        pwdConfirm: [
          v => !!v || "Confirme la contraseña",
          v => v === this.newAccount.password || "Las contraseñas no coinciden"
        ]
      },
      inventoryRules: [
        v => !!v || "Debe ingresar la cantidad de unidades",
        v => /^[1-9]*$/.test(v) || "Ingrese una cantidad válida", // algo@algo.algo
        v => (v || "").indexOf(" ") < 0 || "Esta cantidad no es válida" // sin espacios
      ],
      requiredRules: [v => !!v || "Debe completar este campo"]
    };
  },
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
            me.zeroBooks = true;
          } else {
            me.zeroBooks = false;
          }
          //ordeno el array
          me.books.sort(function(a, b) {
            if (a.title < b.title) {
              return -1;
            } else {
              return 1;
            }
          });
        })
        .catch(error => {
          me.zeroBooks = true;
          me.books.push({
            title: "Error al cargar los libros",
            author: "Vuelva a intentar en un momento"
          });
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
              expired: expired,
              severity: difference, // para ordenar el array
              id: loan.partner
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
            //ordeno el array segun vencimiento más severo
            me.loans.sort(function(a, b) {
              if (a.severity < b.severity) {
                return -1;
              } else {
                return 1;
              }
            });
            this.books.forEach(book => {
              book.lent = 0;
              for (let i = 0; i < this.loans.length; i++) {
                if (book.title == this.loans[i].bookTitle) {
                  book.lent += 1;
                }
              }
            });
            this.getAccounts();
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
    getAccounts() {
      var me = this;
      this.axios
        .get("http://localhost:5555/partners")
        .then(response => {
          me.accountsError = false;
          me.accounts = [];
          for (let i = 0; i < response.data.length; i++) {
            for (let x = 0; x < me.loans.length; x++) {
              if (me.loans[x].partner == response.data[i].id) {
                me.loans[
                  x
                ].partner = `${response.data[i].name} ${response.data[i].surname}`;
                break;
              }
            }
            let role = response.data[i].role == 1 ? "Socio" : "Bibliotecario";
            me.accounts.push({
              id: response.data[i].id,
              name: `${response.data[i].name} ${response.data[i].surname}`,
              role: role
            });
          }
          //ordeno el array
          me.accounts.sort(function(a, b) {
            if (a.role < b.role) {
              return -1;
            } else {
              return 1;
            }
          });
        })
        .catch(error => {
          me.accounts = [];
          me.accountsError = true;
          me.accounts.push({
            name: "Error al cargar las cuentas",
            role: "Vuelva a intentar en un momento"
          });
          me.checkSession(error);
        });
    },
    addAccount() {
      this.snackbar = false;
      this.editDialog = false;
      let me = this;
      this.axios
        .post(`http://localhost:5555/partners/`, {
          name: me.newAccount.name,
          surname: me.newAccount.surname,
          email: me.newAccount.email,
          password: me.newAccount.password,
          role: me.newAccount.role
        })
        .then(function() {
          me.newAccount.dialog = false;
          me.snackText = "Cuenta de usuario agregada con éxito";
          me.snackbar = true;
          me.getAccounts();
        })
        .catch(function(error) {
          if (error.message == "Network Error" || error.message == "Request failed with status code 500") {
            me.dialogTitle = "Error Interno";
            me.dialogText =
              "Ocurrió un error, por favor vuelva a intentar en un momento.";
            me.dialog = true;
          }
          if (
              error.response &&
              error.response.data.message ==
                "Email on use."
            ) {
              me.dialogTitle = "Email rechazado";
              me.dialogText =
                "El email elegido ya está en uso, por favor, intente nuevamente con otro.";
              me.dialog = true;
            }
          me.checkSession(error);
        });
    },
    clearNewAccount() {
      this.newAccount.valid = false;
      this.newAccount.role = 0;
      this.newAccount.name = null;
      this.newAccount.surname = null;
      this.newAccount.email = null;
      this.newAccount.password = null;
      this.newAccount.password2 = null;
      this.newAccount.showPass = false;
      this.newAccount.showPass2 = false;
      this.newAccount.validNewBook = false;
      this.$refs.form.resetValidation();
    },
    deleteAccount(id) {
      let IDs = this.loans.map(a => a.id);
      if (IDs.includes(id)) {
        this.dialogTitle = "No se puede eliminar la cuenta";
        this.dialogText =
          "Esta cuenta posee préstamos activos, para eliminarla debe haber devuelto todos los libros.";
        this.dialog = true;
      } else {
        this.snackbar = false;
        this.dialog = false;
        let me = this;
        this.axios
          .delete(`http://localhost:5555/partners/${id}`, { all: true })
          .then(function() {
            me.snackText = "Cuenta eliminada con éxito";
            me.snackbar = true;
            me.getAccounts();
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
        this.dialogTitle = "No hay más copias";
        this.dialogText =
          "Ya no quedan copias por remover. Si desea eliminar el libro por completo diríjase al panel de edición del mismo.";
        this.dialog = true;
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
          .delete(`http://localhost:5555/books/${id}`, { data: { all: true } }) // con este método hay que enviar el body así
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
      this.getAccounts();
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
