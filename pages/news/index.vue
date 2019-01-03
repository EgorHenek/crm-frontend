<template>
  <v-layout
    align-center
    justify-center
    row
    wrap
  >
    <v-flex>
      <v-list two-line>
        <v-list-tile
          v-for="(item, index) in news"
          :key="index"
          ripple
          @click="startEditDialog(item.id)"
        >
          <v-list-tile-content>
            <v-list-tile-title>{{ item.attributes.title }}</v-list-tile-title>
            <v-list-tile-sub-title v-html="item.attributes.description_html" />
          </v-list-tile-content>

          <v-list-tile-action>
            <v-list-tile-action-text
              v-if="item.attributes.published_at"
              :class="dateTimeColor(item.attributes.published_at)"
            >
              {{ item.attributes.published_at| dateFormat('DD.MM.YYYY HH:mm') }}
            </v-list-tile-action-text>
            <v-icon @click.stop="delete_news(item.id)">
              fas fa-trash
            </v-icon>
          </v-list-tile-action>
        </v-list-tile>
      </v-list>
    </v-flex>

    <v-dialog
      v-if="edit_dialog"
      v-model="edit_dialog"
      fullscreen
      hide-overlay
    >
      <v-card>
        <v-toolbar
          dark
          color="primary"
        >
          <v-btn
            icon
            dark
            @click="edit_dialog = false"
          >
            <v-icon>fas fa-times</v-icon>
          </v-btn>
          <v-toolbar-title>Изменить новость: {{ editable_news.attributes.title }}</v-toolbar-title>
          <v-spacer />
          <v-btn
            icon
            @click="edit"
          >
            <v-icon>fas fa-save</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <news-form
            :news="editable_news.attributes"
            :errors2="edit_errors"
          />
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="dialog"
      fullscreen
      hide-overlay
    >
      <v-card>
        <v-toolbar
          dark
          color="primary"
        >
          <v-btn
            icon
            dark
            @click="dialog = false"
          >
            <v-icon>fas fa-times</v-icon>
          </v-btn>
          <v-toolbar-title>Добавить новость</v-toolbar-title>
          <v-spacer />
          <v-btn
            icon
            @click="add"
          >
            <v-icon>fas fa-save</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <news-form
            :news="new_news"
            :errors2="add_errors"
          />
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-btn
      fab
      dark
      bottom
      right
      fixed
      color="indigo"
      @click="dialog = true"
    >
      <v-icon>fas fa-plus-circle</v-icon>
    </v-btn>
  </v-layout>
</template>

<script>
/* eslint-disable import/no-extraneous-dependencies */
import { mapState } from 'vuex';
import NewsForm from '~/components/NewsForm.vue';

export default {
  computed: {
    ...mapState({
      news: state => state.news.news,
    }),
  },
  methods: {
    published_at(date, time) {
      return this.$options.filters.dateFormat(`${date} ${time}`);
    },
    edit() {
      this.$store.dispatch('news/edit', [this.editable_news, this.published_at(this.editable_news.attributes.date_published_at, this.editable_news.attributes.time_published_at)])
        .then(() => {
          this.edit_dialog = false;
          this.editable_news = {};
        })
        .catch((error) => {
          this.edit_errors = error.response.data;
        });
    },
    startEditDialog(id) {
      this.$store.getters['news/by_id'](id)
        .then((news) => {
          this.edit_dialog = true;
          this.editable_news = news;
          this.editable_news.attributes.date_published_at = this.$options.filters.dateFormat(news.attributes.published_at, 'YYYY-MM-DD');
          this.editable_news.attributes.time_published_at = this.$options.filters.dateFormat(news.attributes.published_at, 'HH:mm');
        });
    },
    delete_news(id) {
      this.$store.dispatch('news/delete', id);
    },
    add() {
      /* eslint-disable max-len */
      const publishedAt = this.new_news.not_published ? null : this.published_at(this.new_news.date_published_at, this.new_news.time_published_at);
      this.$store.dispatch('news/add', [this.new_news, publishedAt])
        .then(() => {
          this.dialog = false;
          this.new_news = {
            title: '',
            description: '',
            date_published_at: new Date().toISOString().substr(0, 10),
            time_published_at: new Date().toLocaleTimeString().substr(0, 5),
          };
        })
        .catch((error) => {
          this.add_errors = error.response.data;
        });
    },
    dateTimeColor(time) {
      return {
        'green--text': new Date(time) < new Date(),
        'red--text': new Date(time) > new Date(),
      };
    },
  },
  components: {
    NewsForm,
  },
  data() {
    return {
      dialog: false,
      edit_dialog: false,
      add_errors: [],
      edit_errors: [],
      new_news: {
        title: '',
        description: '',
        date_published_at: new Date().toISOString().substr(0, 10),
        time_published_at: new Date().toLocaleTimeString().substr(0, 5),
        not_published: false,
      },
      editable_news: {},
    };
  },
};
</script>
