<template>
  <v-layout>
    <v-flex>
      <v-toolbar
        flat
        color="white"
      >
        <v-toolbar-title>Клиенты</v-toolbar-title>
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
                    <v-flex xs12>
                      <v-text-field
                        v-model="editedItem.name"
                        v-validate="'required'"
                        name="name"
                        label="Имя"
                        data-vv-as="Name"
                        :error-messages="errors.collect('name')"
                        type="text"
                        required
                      />
                    </v-flex>
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
                    <v-flex
                      xs12
                      md6
                    >
                      <v-text-field
                        v-model="editedItem.phone"
                        v-validate="'length:10'"
                        mask="phone"
                        name="phone"
                        prefix="+7"
                        label="Телефон"
                        data-vv-as="phone"
                        :error-messages="errors.collect('phone')"
                        type="text"
                        required
                      />
                    </v-flex>
                    <v-flex
                      xs12
                    >
                      <v-switch
                        v-model="editedItem.promotion"
                        label="Подписка на рассылку"
                      />
                    </v-flex>
                    <v-flex xs12>
                      <v-switch
                        v-model="editedItem.first_contact"
                        label="Первый контакт"
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
        :items="clients.data"
        :search="search"
        class="elevation-1"
      >
        <template
          slot="items"
          slot-scope="props"
        >
          <td>{{ props.item.id }}</td>
          <td>{{ props.item.attributes.name }}</td>
          <td class="text-xs-right">
            {{ props.item.attributes.email }}
          </td>
          <td class="text-xs-right">
            {{ props.item.attributes.phone }}
          </td>
          <td class="text-xs-right">
            {{ props.item.attributes.address }}
          </td>
          <td class="justify-center">
            <v-icon
              v-if="props.item.attributes.promotion"
              class="green--text"
            >
              fas fa-check
            </v-icon>
            <v-icon
              v-if="!props.item.attributes.promotion"
              class="red--text"
            >
              fas fa-times
            </v-icon>
          </td>
          <td class="justify-center">
            <v-icon
              v-if="props.item.attributes.first_contact"
              class="green--text"
            >
              fas fa-check
            </v-icon>
            <v-icon
              v-if="!props.item.attributes.first_contact"
              class="red--text"
            >
              fas fa-times
            </v-icon>
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
              small
              @click="delete_dialog = true"
            >
              fas fa-trash
            </v-icon>

            <v-dialog
              v-model="delete_dialog"
              persistent
              max-width="290"
            >
              <v-card>
                <v-card-title class="headline">
                  Вы действительно хотите удалить {{ props.item.attributes.name }}?
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
                    @click="deleteItem(props.item)"
                  >
                    Да
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
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
    const clients = await $axios.$get('/clients');
    return { clients };
  },
  head() {
    return {
      title: 'Клиенты',
    };
  },
  data: () => ({
    dialog: false,
    delete_dialog: false,
    editedIndex: -1,
    search: '',
    headers: [
      { text: 'ID', value: 'id' },
      {
        text: 'Имя',
        value: 'attributes.name',
        align: 'left',
      },
      { text: 'email', value: 'attributes.email' },
      { text: 'Телефон', value: 'attributes.phone', sortable: false },
      { text: 'Адрес', value: 'attributes.address', sortable: false },
      { text: 'Подписка на рассылку', value: 'attributes.promotion' },
      { text: 'Первая связь', value: 'attributes.first_connect' },
      { text: 'Действия', value: 'actions', sortable: false },
    ],
    editedItem: {
      name: '',
      email: '',
      phone: '',
      address: '',
      promotion: true,
      first_contact: true,
    },
    defaultItem: {
      name: '',
      email: '',
      phone: '',
      address: '',
      promotion: true,
      first_contact: true,
    },
    error: [],
    snackbar: false,
  }),
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'Добавление' : 'Изменение';
    },
  },
  methods: {
    deleteItem(item) {
      const index = this.clients.data.indexOf(item);
      this.$axios.delete(`/clients/${item.id}`)
        .then(() => {
          this.delete_dialog = false;
          this.clients.data.splice(index, 1);
        });
    },

    editItem(item) {
      this.editedIndex = this.clients.data.indexOf(item);
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
        this.$axios.post('/clients', this.editedItem)
          .then((client) => {
            this.clients.data.push(client.data.data);
          })
          .catch((error) => {
            this.error = error.response.data;
            this.snackbar = true;
          });
      } else {
        this.$axios.put(`/clients/${this.clients.data[this.editedIndex].id}`, this.editedItem)
          .then((client) => {
            Object.assign(this.clients.data[this.editedIndex], client.data.data);
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
