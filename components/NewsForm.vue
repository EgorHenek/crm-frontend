<template>
  <div>
    <v-alert v-for="(error, index) in errors2" :key="index" type="error" value="error">{{ error }}</v-alert>
    <v-form ref="form" v-model="valid" lazy-validation>
      <v-container grid-list-md>
        <v-layout wrap>
          <v-flex xs12>
            <v-text-field name="title" label="Название"
                          data-vv-as="название" v-validate="'required'" :error-messages="errors.collect('title')"
                          type="text" v-model="news.title" reqiored></v-text-field>
          </v-flex>
          <v-flex xs12>
            <no-ssr>
              <mavon-editor v-model="news.description" language="ru" :toolbars="toolbar"/>
            </no-ssr>
          </v-flex>
          <v-flex xs12>
            <v-subheader>Дата публикации</v-subheader>
          </v-flex>
          <v-flex xs12 md6>
            <v-menu :close-on-content-click="false"
                    v-model="menu.date_published_at"
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
              ></v-text-field>
              <v-date-picker
                  v-model="news.date_published_at"
                  @input="menu.date_published_at = false"
                  locale="ru"
                  :first-day-of-week="1"
                  :min="new Date().toISOString().substr(0, 10)"></v-date-picker>
            </v-menu>
          </v-flex>
          <v-flex xs12 md6>
            <v-menu
                ref="menu"
                :close-on-content-click="false"
                v-model="menu.time_published_at"
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
              ></v-text-field>
              <v-time-picker
                  v-if="menu.time_published_at"
                  v-model="news.time_published_at"
                  format="24hr"
                  full-width
                  @change="$refs.menu.save(news.time_published_at)"
              ></v-time-picker>
            </v-menu>
          </v-flex>
          <v-flex xs12>
            <v-text-field v-model="news.slug" disabled label="Slug" v-if="news.slug"></v-text-field>
          </v-flex>
          <v-flex xs12>
            <v-text-field disabled label="Создан" v-if="news.created_at" :value="news.created_at | dateFormat('dddd, Do MMMM YY, HH:MM')"></v-text-field>
          </v-flex>
          <v-flex xs12>
            <v-text-field disabled label="Последнее изменение" v-if="news.updated_at" :value="news.updated_at | dateFormat('dddd, Do MMMM YY, HH:MM')"></v-text-field>
          </v-flex>
          <v-flex xs12>
            <v-switch label="Не публиковать новость" v-model="news.not_published"></v-switch>
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
    data () {
      return {
        menu: {
          date_published_at: false,
          time_published_at: false
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
          preview: true
        }
      }
    }
  }
</script>
