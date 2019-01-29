<template>
  <v-layout>
    <v-flex>
      <v-toolbar
        flat
        color="white"
      >
        <v-toolbar-title>Рассылки</v-toolbar-title>
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
          max-width="1000px"
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
                        v-model="editedItem.title"
                        v-validate="'required'"
                        name="title"
                        label="Заголовок"
                        data-vv-as="title"
                        :error-messages="errors.collect('title')"
                        type="text"
                        required
                      />
                    </v-flex>
                    <v-flex xs12>
                      <no-ssr>
                        <mavon-editor
                          v-model="editedItem.text"
                          language="ru"
                          :toolbars="toolbar"
                        />
                      </no-ssr>
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
        :items="promotes.data"
        :search="search"
        class="elevation-1"
      >
        <template
          slot="items"
          slot-scope="props"
        >
          <td>{{ props.item.id }}</td>
          <td>{{ props.item.attributes.title }}</td>
          <td>
            <v-icon v-if="props.item.attributes.status == 'process'">
              fas fa-hourglass-start
            </v-icon>
            <v-icon v-if="props.item.attributes.status == 'finish'">
              fas fa-hourglass-end
            </v-icon>
            <v-icon v-if="props.item.attributes.status == 'not started'">
              fas fa-stop
            </v-icon>
          </td>
          <td>
            {{ $options.filters.dateFormat(props.item.attributes.started_at, 'YYYY-MM-DD HH:mm') }}
          </td>
          <td>
            {{ $options.filters.dateFormat(props.item.attributes.complete_at, 'YYYY-MM-DD HH:mm') }}
          </td>
          <td>
            {{ $options.filters.dateFormat(props.item.attributes.created_at, 'YYYY-MM-DD HH:mm') }}
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
              class="mr-2"
              @click="delete_dialog = true"
            >
              fas fa-trash
            </v-icon>
            <v-icon
              small
              color="green"
              @click="startItem(props.item)"
              v-if="props.item.attributes.status == 'not started'"
            >
              fas fa-play
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
    const promotes = await $axios.$get('/promotes');
    return { promotes };
  },
  data: () => ({
    dialog: false,
    delete_dialog: false,
    editedIndex: -1,
    search: '',
    headers: [
      { text: 'ID', value: 'id' },
      { text: 'Заголовок', value: 'attributes.title' },
      { text: 'Статус', value: 'attributes.status' },
      { text: 'Началась', value: 'attributes.started_at' },
      { text: 'Закончена', value: 'attributes.complete_at' },
      { text: 'Создана', value: 'attributes.created_at' },
      { text: 'Действия', value: 'actions', sortable: false },
    ],
    editedItem: {
      title: '',
      text: '',
    },
    defaultItem: {
      title: '',
      text: '',
    },
    error: [],
    snackbar: false,
    toolbar: {
      bold: true,
      italic: true,
      header: true,
      underline: true,
      strikethrough: true,
      mark: true,
      superscript: true,
      subscript: true,
      quote: true,
      ol: true,
      ul: true,
      link: true,
      imagelink: false,
      code: true,
      table: true,
      fullscreen: true,
      readmodel: true,
      htmlcode: true,
      help: true,
      undo: true,
      redo: true,
      trash: true,
      save: false,
      navigation: false,
      alignleft: true,
      aligncenter: true,
      alignright: true,
      subfield: true,
      preview: true,
    },
  }),
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'Добавление' : 'Изменение';
    },
  },
  mounted() {
    setInterval(() => {
      this.$axios.$get('/promotes')
        .then((promote) => {
          this.promotes.data = promote.data;
        });
    }, 3000);
  },
  head() {
    return {
      title: 'Рассылки',
    };
  },
  methods: {
    deleteItem(item) {
      const index = this.promotes.data.indexOf(item);
      this.$axios.delete(`/promotes/${item.id}`)
        .then(() => {
          this.delete_dialog = false;
          this.promotes.data.splice(index, 1);
        });
    },

    editItem(item) {
      this.editedIndex = this.promotes.data.indexOf(item);
      this.editedItem = Object.assign({}, item.attributes);
      this.dialog = true;
    },

    startItem(item) {
      const index = this.promotes.data.indexOf(item);
      this.$axios.post(`/promotes/${item.id}/start`)
        .then(() => {
          this.item[index].attributes.status = 'process';
        });
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
        this.$axios.post('/promotes', this.editedItem)
          .then((promote) => {
            this.promotes.data.push(promote.data.data);
            this.dialog = false;
            this.editedItem = Object.assign({}, this.defaultItem);
            this.editedIndex = -1;
          })
          .catch((error) => {
            this.error = error.response.data;
            this.snackbar = true;
          });
      } else {
        this.$axios.put(`/promotes/${this.promotes.data[this.editedIndex].id}`, this.editedItem)
          .then((promote) => {
            Object.assign(this.promotes.data[this.editedIndex], promote.data.data);
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
