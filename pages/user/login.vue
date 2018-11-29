<template>
  <v-card class="elevation-12">
    <v-toolbar dark color="primary">
      <v-toolbar-title>Вход</v-toolbar-title>
    </v-toolbar>
    <v-card-text>
      <v-alert
          :value="error.message"
          :type="error.type"
          :icon="error.icon"
      >
        {{ error.message }}
      </v-alert>
      <v-form ref="form" v-model="valid" lazy-validation>
        <v-text-field prepend-icon="fas fa-user" name="login" label="Email"
                      data-vv-as="Email" v-validate="'required|email'" :error-messages="errors.collect('email')"
                      type="text" v-model="email" required></v-text-field>
        <v-text-field prepend-icon="fas fa-key" name="password" label="Пароль"
                      data-vv-as="пароль" v-validate="'required|min:8|max:128'" :error-messages="errors.collect('password')"
                      type="password" v-model="password" required></v-text-field>
        <v-text-field name="code" label="Код"
                      data-vv-as="код" v-validate="'required|length:6|numeric'" :error-messages="errors.collect('code')"
                      type="number" v-model="code" required v-if="error.message === 'Неправильный Email, пароль или токен.' || error.message === 'У вас осталась последняя попытка ввода пароля до блокировки учетной записи.'"></v-text-field>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-btn :to="{name: 'user-register'}" color="info">Регистрация</v-btn>
      <v-spacer></v-spacer>
      <v-btn v-if="error.message === 'Неправильный Email, пароль или токен.' || error.message === 'У вас осталась последняя попытка ввода пароля до блокировки учетной записи.'" @click="send_email">Отправить код на email</v-btn>
      <v-btn color="success" @click="login" :disable="!valid">Войти</v-btn>
    </v-card-actions>
    <v-snackbar v-model="snackbar" :timeout="6000" top>
      Отправлено
      <v-btn color="pink" flat @click="snackbar = false">
        Закрыть
      </v-btn>
    </v-snackbar>
  </v-card>
</template>

<script>
  export default {
    head: {
      title: 'Авторизация'
    },
    layout: 'FullScreenForm',
    asyncData ({ route, app }) {
      if (route.query.unlock_token) {
        return app.$axios.get('/auth/unlock', {
          params: {
            unlock_token: route.query.unlock_token
          }
        }).then(() => {
          return {
            error: {
              type: 'success',
              message: 'Аккаунт разблокирован',
              icon: 'fas fa-check'
            }
          }
        })
          .catch(() => {
            return {
              error: {
                type: 'error',
                message: 'Неверный код разблокировки',
                icon: 'fas fa-exclamation-triangle'
              }
            }
          })
      }
    },
    methods: {
      login () {
        this.$validator.validateAll()
        this.$validator.validate().then(result => {
          if (result) {
            this.$auth.loginWith('local', {
              data: {
                user: {
                  email: this.email,
                  password: this.password,
                  otp_attempt: this.code
                }
              }
            })
              .catch((error) => {
                this.error.message = error.response.data.message
                this.error.type = 'error'
                this.error.icon = 'fas fa-exclamation-triangle'
              })
          }
        })
      },
      send_email () {
        this.$axios.post('/auth/send_code', {
          email: this.email
        })
          .then(() => {
            this.snackbar = true
          })
      }
    },
    data () {
      return {
        email: '',
        password: '',
        code: '',
        error: {
          message: '',
          type: '',
          icon: ''
        },
        valid: false,
        snackbar: false
      }
    }
  }
</script>
