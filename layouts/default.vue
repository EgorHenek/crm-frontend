<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant.sync="miniVariant"
      clipped
      app
    >
      <v-list>
        <v-list-tile
          v-for="(item, i) in items"
          v-show="item.roles || item.roles.includes($auth.user.roles[0])"
          :key="i"
          router
          :to="item.to"
          exact
        >
          <v-list-tile-action>
            <v-badge
              color="orange"
              left
              overlap
            >
              <span
                v-if="$store.getters[item.count]"
                slot="badge"
              >
                {{ $store.getters[item.count] }}
              </span>
              <v-icon v-html="item.icon" />
            </v-badge>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="item.title" />
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar
      fixed
      app
      clipped-left
    >
      <v-toolbar-side-icon @click="drawer = !drawer" />
      <v-btn
        icon
        @click.stop="miniVariant = !miniVariant"
      >
        <v-icon v-html="miniVariant ? 'fas fa-chevron-right' : 'fas fa-chevron-left'" />
      </v-btn>
      <v-toolbar-title v-text="title" />
      <v-spacer />
      <v-menu bottom>
        <v-avatar
          slot="activator"
          color="red"
        >
          <span class="white--text headline">
            {{ this.$auth.user.first_name.charAt(0) }}
          </span>
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
  data() {
    return {
      drawer: true,
      items: [
        {
          icon: 'fas fa-tasks', title: 'Задачи', to: '/tasks', count: 'tasks/count', roles: true,
        },
        {
          icon: 'far fa-newspaper', title: 'Новости', to: '/news', count: 'news/count', roles: ['admin', 'manager'],
        },
        {
          icon: 'fas fa-users', title: 'Клиенты', to: '/clients', roles: true,
        },
        {
          icon: 'fas fa-user-tie', title: 'Пользователи', to: '/users', roles: ['admin'],
        },
      ],
      miniVariant: false,
      title: 'CRM',
    };
  },
  methods: {
    sign_out() {
      this.$auth.logout();
    },
  },
};
</script>
