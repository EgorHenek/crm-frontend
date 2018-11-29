<template>
  <v-app>
    <v-navigation-drawer
      :mini-variant.sync="miniVariant"
      clipped
      v-model="drawer"
      app
    >
      <v-list>
        <v-list-tile
          router
          :to="item.to"
          :key="i"
          v-for="(item, i) in items"
          exact
        >
          <v-list-tile-action>
            <v-icon v-html="item.icon"></v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="item.title"></v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar fixed app clipped-left>
      <v-toolbar-side-icon @click="drawer = !drawer"></v-toolbar-side-icon>
      <v-btn
        icon
        @click.stop="miniVariant = !miniVariant"
      >
        <v-icon v-html="miniVariant ? 'fas fa-chevron-right' : 'fas fa-chevron-left'"></v-icon>
      </v-btn>
      <v-toolbar-title v-text="title"></v-toolbar-title>
      <v-spacer/>
      <v-menu bottom>
        <v-avatar color="red" slot="activator">
          <span class="white--text headline">{{ this.$auth.user.first_name.charAt(0) }}</span>
        </v-avatar>
        <v-list>
          <v-list-tile :to="{ name: 'user-settings'} ">
            <v-list-tile-action>
              <v-icon>fas fa-cogs</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>Настройки</v-list-tile-content>
          </v-list-tile>
          <v-list-tile @click="sign_out">
            <v-list-tile-action>
              <v-icon>fas fa-sign-out-alt</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>Выход</v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-menu>
    </v-toolbar>
    <v-content>
      <v-container>
        <nuxt />
      </v-container>
    </v-content>
    <v-footer app>
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
  export default {
    data () {
      return {
        drawer: true,
        items: [
          { icon: 'fas fa-tasks', title: 'Задачи', to: '/tasks' }
        ],
        miniVariant: false,
        title: 'CRM'
      }
    },
    methods: {
      sign_out () {
        this.$auth.logout()
      }
    }
  }
</script>
