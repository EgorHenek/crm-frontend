<template>
  <v-card class="elevation-12">
    <v-toolbar dark color="primary">
      <v-toolbar-title>{{ currentTitle }}</v-toolbar-title>
      <v-spacer/>
      <v-avatar
          color="white"
          class="subheading black--text"
          size="24"
          v-text="step"
      ></v-avatar>
    </v-toolbar>

      <v-window v-model="step">
        <v-window-item :value="1">
          <v-card-text>
            <v-alert
                v-for="(error, index) in errors_summary"
                :key="`${index}-error`"
                :value="true"
                type="error"
                icon="fas fa-exclamation-triangle"
            >
              {{ error }}
            </v-alert>
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-text-field data-vv-as="Email" v-validate="'required|email'" :error-messages="errors.collect('email')"
                            prepend-icon="fas fa-user" name="email" label="Email"
                            type="text" v-model="email" required />
              <v-text-field data-vv-as="Фамилия" v-validate="'required'" :error-messages="errors.collect('last_name')"
                            name="last_name" label="Фамилия"
                            type="text" v-model="last_name" required />
              <v-text-field data-vv-as="Имя" v-validate="'required'" :error-messages="errors.collect('first_name')"
                            name="first_name" label="Имя"
                            type="text" v-model="first_name" required />
              <v-text-field name="second_name" label="Отчество"
                            type="text" v-model="second_name" />
              <v-text-field prepend-icon="fas fa-key" name="password" label="Пароль"
                            data-vv-as="пароль" v-validate="'required|min:8|max:128'" :error-messages="errors.collect('password')"
                            type="password" v-model="password" required ref="password"></v-text-field>
              <v-text-field prepend-icon="fas fa-key" name="password_confirmation" label="Пароль повторно"
                            data-vv-as="пароль повтоно" v-validate="'required|min:8|max:128|confirmed:password'" :error-messages="errors.collect('password_confirmation')"
                            type="password" v-model="password_confirmation" required />
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-btn :to="{name: 'user-login'}" color="info">Вход</v-btn>
            <v-spacer></v-spacer>
            <v-btn color="success" @click="register" :disabled="!valid">Зарегистрироваться</v-btn>
          </v-card-actions>
        </v-window-item>

        <v-window-item :value="2">
          <v-card-text>
            <v-alert type="info" :value="true">Осталось только подтвердить аккаунт. Письмо с инструкцией отправлено на <stron>{{ this.email }}</stron></v-alert>
          </v-card-text>
        </v-window-item>

        <v-window-item :value="3">
          <v-card-text>
            <v-alert
                :value="true"
                :type="success_alert.type"
                :icon="success_alert.icon"
            >
              {{ success_alert.message }}
            </v-alert>
          </v-card-text>
        </v-window-item>
      </v-window>
  </v-card>
</template>

<script>
  export default {
    auth: false,
    head: {
      title: 'Регистрация'
    },
    layout: 'FullScreenForm',
    methods: {
      register () {
        this.$validator.validateAll()
        this.$validator.validate().then(result => {
          if (result) {
            this.$axios.post('/auth', {
              user: {
                email: this.email,
                password: this.password,
                first_name: this.first_name,
                last_name: this.last_name,
                second_name: this.second_name
              }
            })
              .then(() => { this.step = 2 })
              .catch((error) => {
                this.errors_summary = error.response.data.errors
              })
          }
        })
      }
    },
    data () {
      return {
        email: '',
        password: '',
        password_confirmation: '',
        first_name: '',
        last_name: '',
        second_name: '',
        valid: false,
        step: this.$route.name === 'register-success' ? 3 : 1,
        errors_summary: [],
        success_alert: {
          type: 'error',
          message: 'Неверный код подтверждения',
          icon: 'fas fa-exclamation-triangle'
        }
      }
    },
    asyncData ({ route, app }) {
      if (route.name === 'register-success' && route.query.confirmation_token) {
        return app.$axios.get('/auth/confirmation', {
          params: {
            confirmation_token: route.query.confirmation_token
          }
        }).then((res) => {
          return {
            success_alert: {
              type: 'success',
              message: 'Аккаунт подтверждён',
              icon: 'fas fa-check'
            }
          }
        })
          .catch((res) => {
            return {
              success_alert: {
                type: 'error',
                message: 'Неверный код подтверждения',
                icon: 'fas fa-exclamation-triangle'
              }
            }
          })
      }
    },
    computed: {
      currentTitle () {
        switch (this.step) {
          case 1: return 'Регистрация'
          case 2: return 'Подтверждение аккаунта'
          default: return 'Готово'
        }
      }
    }
  }
</script>
