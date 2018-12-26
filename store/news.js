export const state = () => ({
  news: []
})

export const mutations = {
  SET_NEWS (state, news) {
    state.news = news
  },
  ADD_NEWS (state, news) {
    state.news.unshift(news)
  },
  EDIT_NEWS (state, news) {
    let index = state.news.findIndex(value => value.id === news.id)
    state.news.splice(index, 1, news)
  },
  DELETE_NEWS (state, id) {
    let index = state.news.findIndex(value => value.id === id)
    state.news.splice(index, 1)
  }
}

export const actions = {
  async init ({ commit }) {
    const data = await this.$axios.get('/news')
    commit('SET_NEWS', data.data.data)
  },
  add ({ commit }, [news, publishedAt]) {
    return this.$axios.post('/news', {
      title: news.title,
      description: news.description,
      published_at: publishedAt
    })
      .then((data) => {
        commit('ADD_NEWS', data.data.data)
      })
  },
  edit ({ commit }, [news, publishedAt]) {
    return this.$axios.put(`/news/${news.id}`, {
      title: news.attributes.title,
      description: news.attributes.description,
      published_at: publishedAt
    })
      .then((data) => {
        commit('EDIT_NEWS', data.data.data)
      })
  },
  delete ({ commit }, id) {
    return this.$axios.delete(`/news/${id}`)
      .then(() => {
        commit('DELETE_NEWS', id)
      })
  }
}

export const getters = {
  count: state => {
    return state.news.length
  },
  by_id: state => id => {
    let news = state.news.find(news => news.id === id)
    if (news) {
      return Promise.resolve(news)
    } else {
      return Promise.reject(new Error('404'))
    }
  }
}
