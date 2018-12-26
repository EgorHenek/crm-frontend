<template>
  <v-layout align-center justify-center row wrap>
    <v-flex xs12 md6 xl3 v-for="task in tasks" :key="task.id">
      <v-card :color="task.attributes.color" nuxt :to="{name: 'tasks-id', params: { id: task.id }}">
        <v-card-title primary-title>
          <div>
            <div class="headline">{{ task.attributes.title }}</div>
            <span>{{ task.attributes.description }}</span>
            <div>
              <v-tooltip bottom v-if="task.attributes.start_time">
                <v-chip color="indigo" text-color="white" slot="activator">
                  <v-avatar>
                    <v-icon>far fa-calendar</v-icon>
                  </v-avatar>
                  {{ task.attributes.start_time | dateFormat('D MMM, HH:mm') }}
                </v-chip>
                <span>Время начала выполнения</span>
              </v-tooltip>
              <v-tooltip bottom v-if="task.attributes.end_time">
                <v-chip color="indigo" text-color="white" slot="activator">
                  <v-avatar>
                    <v-icon>far fa-calendar-times</v-icon>
                  </v-avatar>
                  {{ task.attributes.end_time | dateFormat('D MMM, HH:mm') }}
                </v-chip>
                <span>Время окончания выполнения</span>
              </v-tooltip>
            </div>
          </div>
        </v-card-title>
        <v-card-actions>
          <v-btn flat @click="" icon v-if="!task.attributes.started && !task.attributes.ended">
            <v-icon>fas fa-play</v-icon>
          </v-btn>
          <v-btn flat @click="" icon v-if="task.attributes.started && !task.attributes.ended">
            <v-icon>fas fa-stop</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Добавление задания</span>
        </v-card-title>
        <v-card-text>
          <v-alert v-for="(error, index) in errors2" :key="index" type="error" value="error">{{ error }}</v-alert>
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12>
                  <v-text-field name="title" label="Название"
                                data-vv-as="название" v-validate="'required'" :error-messages="errors.collect('title')"
                                type="text" v-model="task.title" required></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-textarea name="description" label="Описание" auto-grow box counter
                                data-vv-as="описание" v-validate="'required'" :error-messages="errors.collect('description')"
                                type="text" v-model="task.description" required></v-textarea>
                </v-flex>
                <v-flex xs12>
                  <v-subheader>Начало</v-subheader>
                </v-flex>
                <v-flex xs12 md6>
                  <v-menu :close-on-content-click="false"
                          v-model="menu.date_start"
                          :nudge-right="40"
                          lazy
                          transition="scale-transition"
                          offset-y
                          full-width
                          min-width="290px"
                  >
                    <v-text-field
                        slot="activator"
                        :value="task.date_start | dateFormat('dddd, Do MMMM YY')"
                        label="Дата"
                        clearable
                        prepend-icon="far fa-calendar"
                        readonly
                    ></v-text-field>
                    <v-date-picker v-model="task.date_start" @input="menu.date_start = false" locale="ru" :first-day-of-week="1" :min="new Date().toISOString().substr(0, 10)"></v-date-picker>
                  </v-menu>
                </v-flex>
                <v-flex xs12 md6>
                  <v-menu
                      ref="menu"
                      :close-on-content-click="false"
                      v-model="menu.time_start"
                      :nudge-right="40"
                      :return-value.sync="task.time_start"
                      lazy
                      transition="scale-transition"
                      offset-y
                      full-width
                      max-width="290px"
                      min-width="290px"
                  >
                    <v-text-field
                        slot="activator"
                        v-model="task.time_start"
                        label="Время"
                        prepend-icon="far fa-clock"
                        readonly
                    ></v-text-field>
                    <v-time-picker
                        v-if="menu.time_start"
                        v-model="task.time_start"
                        format="24hr"
                        min="08:00"
                        max="22:00"
                        full-width
                        @change="$refs.menu.save(task.time_start)"
                    ></v-time-picker>
                  </v-menu>
                </v-flex>
                <v-flex xs12>
                  <v-subheader>Конец</v-subheader>
                </v-flex>
                <v-flex xs12 md6>
                  <v-menu :close-on-content-click="false"
                          v-model="menu.date_end"
                          :nudge-right="40"
                          lazy
                          transition="scale-transition"
                          offset-y
                          full-width
                          min-width="290px"
                  >
                    <v-text-field
                        slot="activator"
                        :value="task.date_end | dateFormat('dddd, Do MMMM YY')"
                        label="Дата"
                        clearable
                        prepend-icon="far fa-calendar"
                        readonly
                    ></v-text-field>
                    <v-date-picker v-model="task.date_end" @input="menu.date_end = false" locale="ru" :first-day-of-week="1" :min="new Date().toISOString().substr(0, 10)"></v-date-picker>
                  </v-menu>
                </v-flex>
                <v-flex xs12 md6>
                  <v-menu
                      ref="menu"
                      :close-on-content-click="false"
                      v-model="menu.time_end"
                      :nudge-right="40"
                      :return-value.sync="task.time_end"
                      lazy
                      transition="scale-transition"
                      offset-y
                      full-width
                      max-width="290px"
                      min-width="290px"
                  >
                    <v-text-field
                        slot="activator"
                        v-model="task.time_end"
                        label="Время"
                        prepend-icon="far fa-clock"
                        readonly
                    ></v-text-field>
                    <v-time-picker
                        v-if="menu.time_end"
                        v-model="task.time_end"
                        format="24hr"
                        min="08:00"
                        max="22:00"
                        full-width
                        @change="$refs.menu.save(task.time_end)"
                    ></v-time-picker>
                  </v-menu>
                </v-flex>
                <no-ssr>
                  <v-flex xs12>
                    <v-subheader>Цвет</v-subheader>
                  </v-flex>
                  <v-flex xs12>
                    <color-picker v-model="task.color" />
                  </v-flex>
                </no-ssr>
              </v-layout>
            </v-container>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="dialog = false" color="red" dark>Отмена</v-btn>
          <v-spacer/>
          <v-btn color="success" :disabled="!valid" @click="add">Добавить</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-btn fab dark bottom right fixed color="indigo" @click="dialog = true">
      <v-icon>fas fa-plus-circle</v-icon>
    </v-btn>
  </v-layout>
</template>

<script>
  import { Compact } from 'vue-color'
  import { mapState } from 'vuex'

  export default {
    data () {
      return {
        dialog: false,
        valid: false,
        errors2: [],
        task: {
          title: '',
          description: '',
          date_start: new Date().toISOString().substr(0, 10),
          time_start: new Date().toLocaleTimeString().substr(0, 5),
          date_end: '',
          time_end: '',
          color: ''
        },
        menu: {
          date_start: false,
          time_start: false,
          date_end: false,
          time_end: false
        }
      }
    },
    components: {
      'color-picker': Compact
    },
    methods: {
      add () {
        this.$store.dispatch('tasks/add', this.task)
          .then(() => {
            this.dialog = false
          })
          .catch((error) => {
            this.errors2 = error.response.data
          })
      }
    },
    computed: {
      ...mapState({
        tasks: state => state.tasks.tasks
      })
    }
  }
</script>
