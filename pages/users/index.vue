<template>
  <v-layout>
    <v-flex>
      <v-toolbar
        flat
        color="white"
      >
        <v-toolbar-title>Пользователи</v-toolbar-title>
        <v-divider
          class="mx-2"
          inset
          vertical
        />
        <v-text-field
          v-model="search"
          append-icon="fas fa-search"
          label="Поиск"
          single-line
          hide-details
        />

        <v-spacer />

        <v-dialog
          v-if="deleteItem"
          v-model="delete_dialog"
          persistent
          max-width="290"
        >
          <v-card>
            <v-card-title class="headline">
              Вы действительно хотите {{ deleteItem.attributes.blocked | deleteStatus }}
              <b>{{ deleteItem.attributes.full_name }}</b>?
            </v-card-title>
            <v-card-actions>
              <v-spacer />
              <v-btn
                color="green darken-1"
                flat
                @click="delete_dialog = false"
              >
                Нет
              </v-btn>
              <v-btn
                color="red darken-1 white--text"
                @click="blockUser(deleteItem)"
              >
                Да
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-dialog
          v-model="dialog"
          max-width="500px"
        >
          <v-btn
            slot="activator"
            color="primary"
            dark
            class="mb-2"
          >
            Добавить
          </v-btn>
          <v-card>
            <v-card-title>
              <span class="headline">
                {{ formTitle }}
              </span>
            </v-card-title>

            <v-card-text>
              <v-container grid-list-md>
                <v-layout wrap>
                  <v-form
                    ref="form"
                  >
                    <v-flex
                      xs12
                      md6
                    >
                      <v-text-field
                        v-model="editedItem.email"
                        v-validate="'email'"
                        name="email"
                        label="Email"
                        data-vv-as="email"
                        :error-messages="errors.collect('email')"
                        type="text"
                        required
                      />
                    </v-flex>
                    <v-flex xs12>
                      <v-text-field
                        v-model="editedItem.first_name"
                        v-validate="'required'"
                        name="first_name"
                        label="Имя"
                        data-vv-as="имя"
                        :error-messages="errors.collect('first_name')"
                        type="text"
                        required
                      />
                    </v-flex>
                    <v-flex xs12>
                      <v-text-field
                        v-model="editedItem.second_name"
                        v-validate="'required'"
                        name="second_name"
                        label="Фамилия"
                        data-vv-as="фамилия"
                        :error-messages="errors.collect('second_name')"
                        type="text"
                        required
                      />
                    </v-flex>
                    <v-flex xs12>
                      <v-text-field
                        v-model="editedItem.last_name"
                        v-validate="'required'"
                        name="last_name"
                        label="Отчество"
                        data-vv-as="отчество"
                        :error-messages="errors.collect('last_name')"
                        type="text"
                        required
                      />
                    </v-flex>
                    <v-flex xs12>
                      <v-select
                        v-model="editedItem.role"
                        :items="roles"
                        label="Роль"
                      />
                    </v-flex>
                  </v-form>
                </v-layout>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer />
              <v-btn
                color="red darken-1"
                flat
                @click="close"
              >
                Отмена
              </v-btn>
              <v-btn
                color="green darken-1"
                flat
                @click="save"
              >
                Сохранить
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>

      <v-data-table
        :headers="headers"
        :items="users.data"
        :search="search"
        class="elevation-1"
      >
        <template
          slot="items"
          slot-scope="props"
        >
          <td>{{ props.item.id }}</td>
          <td>{{ props.item.attributes.full_name }}</td>
          <td class="text-xs-center">
            {{ props.item.attributes.email }}
          </td>
          <td class="text-xs-center">
            {{ props.item.attributes.role }}
          </td>
          <td class="text-xs-center">
            <v-icon
              v-if="props.item.attributes.blocked"
              color="red"
            >
              fas fa-lock
            </v-icon>
            <v-icon
              v-else
              color="green"
            >
              fas fa-lock-open
            </v-icon>
          </td>
          <td class="text-xs-center">
            {{ props.item.attributes.last_sign_in_at }}
          </td>
          <td>
            <v-checkbox
              value="props.item.attributes.otp_required_for_login"
              readonly
              hide-details
            />
          </td>
          <td class="justify-center">
            <v-icon
              small
              class="mr-2"
              @click="editItem(props.item)"
            >
              fas fa-edit
            </v-icon>
            <v-icon
              v-if="props.item.attributes.role !== 'admin'"
              small
              @click="delete_dialog = true; deleteItem = props.item"
            >
              fas fa-trash
            </v-icon>
          </td>
        </template>
        <v-alert
          slot="no-results"
          :value="true"
          color="error"
          icon="fas fa-exclamation"
        >
          Для "{{ search }}" нет результатов.
        </v-alert>
      </v-data-table>
      <v-snackbar
        v-model="snackbar"
        top
        :timeout="5000"
      >
        {{ error[0] }}
      </v-snackbar>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  async asyncData({ $axios }) {
    const users = await $axios.$get('/users');
    return { users };
  },
  head() {
    return {
      title: 'Пользователи',
    };
  },
  filters: {
    deleteStatus: (blocked) => {
      if (blocked) return 'разблокировать';
      return 'заблокировать';
    },
  },
  data: () => ({
    dialog: false,
    delete_dialog: false,
    editedIndex: -1,
    deleteItem: '',
    search: '',
    headers: [
      { text: 'ID', value: 'id', align: 'center' },
      {
        text: 'ФИО',
        value: 'attributes.full_name',
        align: 'left',
      },
      { text: 'email', value: 'attributes.email', align: 'center' },
      { text: 'Роль', value: 'attributes.role', align: 'center' },
      { text: 'Блокировка', value: 'attributes.blocked', align: 'center' },
      { text: 'Последний вход', value: 'attributes.last_sign_in_at', align: 'center' },
      { text: 'Двухфакторная авторизация', value: 'attributes.otp_required_for_login', align: 'center' },
      { text: 'Действия', value: 'actions', sortable: false },
    ],
    editedItem: {
      first_name: '',
      second_name: '',
      last_name: '',
      email: '',
      role: 'master',
    },
    defaultItem: {
      first_name: '',
      second_name: '',
      last_name: '',
      email: '',
      role: 'master',
    },
    error: [],
    snackbar: false,
    roles: ['manager', 'master', 'advertising'],
  }),
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'Добавление' : 'Изменение';
    },
  },
  methods: {
    blockUser(item) {
      this.$axios.delete(`/users/${item.id}`)
        .then(() => {
          this.delete_dialog = false;
          this.deleteItem.attributes.blocked = !item.attributes.blocked;
        });
    },

    editItem(item) {
      this.editedIndex = this.users.data.indexOf(item);
      this.editedItem = Object.assign({}, item.attributes);
      this.dialog = true;
    },

    close() {
      this.dialog = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    },

    save() {
      if (this.editedIndex === -1) {
        this.$axios.post('/users', this.editedItem)
          .then((client) => {
            this.users.data.push(client.data.data);
            this.dialog = false;
            this.editedItem = Object.assign({}, this.defaultItem);
            this.editedIndex = -1;
          })
          .catch((error) => {
            this.error = error.response.data;
            this.snackbar = true;
          });
      } else {
        this.$axios.put(`/users/${this.users.data[this.editedIndex].id}`, this.editedItem)
          .then((client) => {
            Object.assign(this.users.data[this.editedIndex], client.data.data);
            this.dialog = false;
            this.editedItem = Object.assign({}, this.defaultItem);
            this.editedIndex = -1;
          })
          .catch((error) => {
            this.error = error.response.data;
            this.snackbar = true;
          });
      }
      return 0;
    },
  },
};
</script>
