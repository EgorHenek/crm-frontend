<template>
  <div>
    <v-alert
      v-for="(error, index) in errors2"
      :key="index"
      type="error"
      value="error"
    >
      {{ error }}
    </v-alert>
    <v-form
      ref="form"
      v-model="valid"
      lazy-validation
    >
      <v-container grid-list-md>
        <v-layout wrap>
          <v-flex xs12>
            <v-text-field
              v-model="news.title"
              v-validate="'required'"
              name="title"
              label="Название"
              data-vv-as="название"
              :error-messages="errors.collect('title')"
              type="text"
              reqiored
            />
          </v-flex>
          <v-flex xs12>
            <no-ssr>
              <mavon-editor
                v-model="news.description"
                language="ru"
                :toolbars="toolbar"
              />
            </no-ssr>
          </v-flex>
          <v-flex xs12>
            <v-subheader>Дата публикации</v-subheader>
          </v-flex>
          <v-flex
            xs12
            md6
          >
            <v-menu
              v-model="menu.date_published_at"
              :close-on-content-click="false"
              :nudge-right="40"
              lazy
              transition="scale-transition"
              offset-y
              full-width
              min-width="290px"
            >
              <v-text-field
                slot="activator"
                :value="news.date_published_at | dateFormat('dddd, Do MMMM YY')"
                label="Дата"
                clerable
                prepend-icon="far fa-calendar"
                readonly
              />
              <v-date-picker
                v-model="news.date_published_at"
                locale="ru"
                :first-day-of-week="1"
                :min="new Date().toISOString().substr(0, 10)"
                @input="menu.date_published_at = false"
              />
            </v-menu>
          </v-flex>
          <v-flex
            xs12
            md6
          >
            <v-menu
              ref="menu"
              v-model="menu.time_published_at"
              :close-on-content-click="false"
              :nudge-right="40"
              :return-value.sync="news.time_published_at"
              lazy
              transition="scale-transition"
              offset-y
              full-width
              max-width="290px"
              min-width="290px"
            >
              <v-text-field
                slot="activator"
                v-model="news.time_published_at"
                label="Время"
                prepend-icon="far fa-clock"
                readonly
              />
              <v-time-picker
                v-if="menu.time_published_at"
                v-model="news.time_published_at"
                format="24hr"
                full-width
                @change="$refs.menu.save(news.time_published_at)"
              />
            </v-menu>
          </v-flex>
          <v-flex xs12>
            <v-text-field
              v-if="news.slug"
              v-model="news.slug"
              disabled
              label="Slug"
            />
          </v-flex>
          <v-flex xs12>
            <v-text-field
              v-if="news.created_at"
              disabled
              label="Создан"
              :value="news.created_at | dateFormat('dddd, Do MMMM YY, HH:MM')"
            />
          </v-flex>
          <v-flex xs12>
            <v-text-field
              v-if="news.updated_at"
              disabled
              label="Последнее изменение"
              :value="news.updated_at | dateFormat('dddd, Do MMMM YY, HH:MM')"
            />
          </v-flex>
          <v-flex xs12>
            <v-switch
              v-model="news.not_published"
              label="Не публиковать новость"
            />
          </v-flex>
        </v-layout>
      </v-container>
    </v-form>
  </div>
</template>

<script>
export default {
  name: 'NewsForm',
  props: ['news', 'errors2'],
  data() {
    return {
      menu: {
        date_published_at: false,
        time_published_at: false,
      },
      valid: false,
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
        imagelink: true,
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
    };
  },
};
</script>
