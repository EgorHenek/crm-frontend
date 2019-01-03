<template>
  <v-layout>
    <v-flex>
      <v-list>
        <v-list-tile>
          <v-list-tile-action>
            <v-switch
              :input-value="fa"
              @click="onSwitch"
            />
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Двуфакторная авторизация</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
      <v-dialog
        v-model="totp.dialog"
        max-width="500px"
        persistent
      >
        <v-card>
          <v-card-title class="title font-weight-regular justify-space-between">
            Остался всего 1 шаг
          </v-card-title>
          <v-card-text>
            <v-window v-model="totp.step">
              <v-window-item :value="1">
                <span class="font-weight-bold">
                  Получение кодов с помощью приложения Google Authenticator
                </span>
                Выберите тип телефона
                <v-radio-group v-model="totp.phone">
                  <v-radio
                    v-for="(phone, index) in phones"
                    :key="index"
                    :label="phone.label"
                    :value="phone"
                  />
                </v-radio-group>
              </v-window-item>
              <v-window-item :value="2">
                <span class="font-weight-black">
                  Настройте приложение Authenticator
                </span>
                <li>
                  Скачайте Google Authenticator в <a
                    :href="totp.phone.url"
                    target="_blank"
                  >
                    {{ totp.phone.store }}
                  </a>.
                </li>
                <li>Откройте приложение и выберите Настроить аккаунт.</li>
                <li>Нажмите Сканировать штрихкод.</li>
                <qriously
                  :value="totp.url"
                  :size="200"
                />
                или добавьте код вручную <kbd>{{ totp.secret }}</kbd>
              </v-window-item>
              <v-window-item :value="3">
                Введите 6-значный код из приложения.
                <v-alert
                  :value="error"
                  type="error"
                >
                  {{ error }}
                </v-alert>
                <v-form
                  ref="form"
                  v-model="valid"
                  lazy-validation
                >
                  <v-text-field
                    v-model="totp.code"
                    v-validate="'required|length:6|numeric'"
                    data-vv-as="Код"
                    :error-messages="errors.collect('code')"
                    label="6-значный код"
                    counter="6"
                    type="number"
                    name="code"
                  />
                </v-form>
              </v-window-item>
            </v-window>
          </v-card-text>
          <v-card-actions>
            <v-btn
              color="red"
              class="white--text"
              @click="close"
            >
              Отмена
            </v-btn>
            <v-spacer />
            <v-btn
              v-show="totp.step < 3"
              color="success"
              :disabled="totp.phone === ''"
              @click="totp.step += 1"
            >
              Далее
            </v-btn>
            <v-btn
              v-show="totp.step === 3"
              :loading="loading"
              color="success"
              :disabled="!valid"
              @click="activation"
            >
              Отправить
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog
        v-model="dialog_deactivation"
        max-width="500px"
        persistent
      >
        <v-card>
          <v-card-title class="title font-weight-regular justify-space-between">
            Отключение
          </v-card-title>
          <v-card-text>
            Введите 6-значный код из приложения.
            <v-alert
              :value="error"
              type="error"
            >
              {{ error }}
            </v-alert>
            <v-form
              ref="form"
              v-model="valid"
              lazy-validation
            >
              <v-text-field
                v-model="totp.code"
                v-validate="'required|length:6|numeric'"
                data-vv-as="Код"
                :error-messages="errors.collect('code')"
                label="6-значный код"
                counter="6"
                type="number"
                name="code"
              />
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-btn
              color="red"
              class="white--text"
              @click="dialog_deactivation = false"
            >
              Отмена
            </v-btn>
            <v-spacer />
            <v-btn @click="send_email">
              Отправить код на email
            </v-btn>
            <v-btn
              :loading="loading"
              color="success"
              :disabled="!valid"
              @click="deactivation"
            >
              Отправить
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-snackbar
        v-model="snackbar"
        :timeout="6000"
        top
      >
        Отправлено
        <v-btn
          color="pink"
          flat
          @click="snackbar = false"
        >
          Закрыть
        </v-btn>
      </v-snackbar>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  data() {
    return {
      dialog_deactivation: false,
      valid: false,
      loading: false,
      error: '',
      snackbar: false,
      totp: {
        secret: '',
        url: '',
        dialog: false,
        step: 1,
        phone: '',
        code: '',
      },
      phones: [
        { label: 'Android', url: 'https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2', store: 'Google Play' },
        { label: 'iPhone', url: 'https://itunes.apple.com/us/app/google-authenticator/id388497605', store: 'App Store' },
      ],
    };
  },
  computed: {
    fa() {
      return this.$auth.user.otp_required_for_login;
    },
  },
  methods: {
    close() {
      this.totp.dialog = false;
      this.totp.phone = '';
      this.totp.step = 1;
      this.fa = this.$auth.user.otp_required_for_login;
    },
    send_email() {
      this.$axios.post('/auth/send_code', {
        email: this.$auth.user.email,
      })
        .then(() => {
          this.snackbar = true;
        });
    },
    onSwitch() {
      if (this.$auth.user.otp_required_for_login === false) {
        this.$axios.post('/auth/totp')
          .then((data) => {
            this.totp.secret = data.data.code;
            this.totp.url = data.data.url;
            this.totp.dialog = true;
          });
      } else {
        this.dialog_deactivation = true;
      }
    },
    activation() {
      this.$validator.validateAll();
      this.$validator.validate().then((result) => {
        if (result) {
          this.loading = true;
          this.$axios.post('/auth/totp', {
            code: this.totp.code,
          })
            .then(() => {
              this.loading = false;
              this.totp.dialog = false;
              this.totp.phone = '';
              this.totp.step = 1;
              this.$auth.fetchUser();
            })
            .catch((error) => {
              this.error = error.response.data.error;
              this.loading = false;
            });
        }
      });
    },
    deactivation() {
      this.$validator.validateAll();
      this.$validator.validate().then((result) => {
        if (result) {
          this.loading = false;
          this.$axios.delete('/auth/totp', {
            params: {
              code: this.totp.code,
            },
          })
            .then(() => {
              this.loading = false;
              this.$auth.fetchUser();
              this.dialog_deactivation = false;
            })
            .catch((error) => {
              this.error = error.response.data.error;
              this.loading = false;
            });
        }
      });
    },
  },
  head() {
    return {
      title: 'Настройки',
    };
  },
};
</script>
