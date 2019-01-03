<template>
  <v-layout>
    <v-flex>
      <v-card
        color="grey lighten-4"
        flat
      >
        <v-toolbar
          color="grey darken-1"
          dark
        >
          <v-toolbar-title>{{ task.attributes.title }}</v-toolbar-title>
          <v-spacer />
          <v-btn
            v-if="!task.attributes.started && !task.attributes.ended"
            flat
            icon
          >
            <v-icon>fas fa-play</v-icon>
          </v-btn>
          <v-btn
            v-if="task.attributes.started && !task.attributes.ended"
            flat
            icon
          >
            <v-icon>fas fa-stop</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <p>{{ task.attributes.description }}</p>
        </v-card-text>
      </v-card>
      <v-container
        fluid
        grid-list-md
      >
        <v-data-iterator
          :items="task.attributes.history"
          content-tag="v-layout"
          row
          wrap
        >
          <v-flex
            slot="item"
            slot-scope="props"
          >
            <v-card>
              <v-card-title><h4>{{ props.item.action }}</h4></v-card-title>
              <v-divider />
              <v-card-text>{{ props.item.changes }}</v-card-text>
              <v-card-text>Комментарий: {{ props.item.comment }}</v-card-text>
              <v-card-text>
                Создан: {{ props.item.created_at | dateFormat('dddd, Do MMMM YYYY, HH:mm') }}
              </v-card-text>
            </v-card>
          </v-flex>
        </v-data-iterator>
      </v-container>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  asyncData({ route, store, error }) {
    return store.getters['tasks/by_id'](route.params.id)
      .then(task => ({
        task,
      }))
      .catch(() => {
        error({ statusCode: 404, message: 'Задание не найдено' });
      });
  },
};
</script>
