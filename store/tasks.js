export const state = () => ({
  tasks: []
})

export const mutations = {
  SET_TASKS (state, tasks) {
    state.tasks = tasks
  },
  ADD_TASK (state, task) {
    state.tasks.unshift(task)
  }
  // ADD_CHANNEL (state, channel) {
  //   state.channels.push(channel)
  // },
  // REMOVE_CHANNEL (state, channel) {
  //   state.channels = state.channels.filter(function(array) {
  //     return array.attributes.slug !== channel
  //   })
  // }
}

export const actions = {
  async init ({ commit }) {
    const data = await this.$axios.$get('/tasks')
    commit('SET_TASKS', data.data)
  },
  add ({ commit }, task) {
    return this.$axios.post('/tasks', {
      task: {
        title: task.title,
        description: task.description,
        start_time: `${task.date_start} ${task.time_start}`,
        end_time: `${task.date_end} ${task.date_end}`,
        color: task.color.hex
      }
    })
      .then((data) => {
        commit('ADD_TASK', data.data.data)
      })
  }
  // async removeChannel ({commit}, slug) {
  //   const data = await this.$axios.delete(`/channels/${slug}`)
  //   await commit('REMOVE_CHANNEL', slug)
  //   this.$router.push({path: '/'})
  // }
}

export const getters = {
  count: state => {
    return state.tasks.length
  },
  by_id: state => id => {
    let task = state.tasks.find(task => task.id === id)
    if (task) {
      return Promise.resolve(task)
    } else {
      return Promise.reject(new Error('404'))
    }
  }
// getChannelBySlug: state => slug => {
//   return state.channels.find(channel => channel.attributes.slug === slug)
// }
}
