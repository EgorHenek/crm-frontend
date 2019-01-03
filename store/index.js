export const actions = {
  async nuxtServerInit({ dispatch }) {
    if (this.$auth.user) {
      if (this.$auth.user) await dispatch('tasks/init');
      if (this.$auth.user) await dispatch('news/init');
    }
  },
};
export const strict = false;
