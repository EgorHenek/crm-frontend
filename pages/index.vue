<template>
  <span>Панель сотрудника ООО УРАЛТРЕЙД</span>
</template>

<script>
export default {
  async fetch({ store }) {
    await store.dispatch('tasks/init');
    await store.dispatch('news/init');
  },
};
</script>
