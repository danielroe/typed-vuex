export const state = () => ({
  name: '',
})

type SubmoduleState = ReturnType<typeof state>

export const getters = {
  name: (state: SubmoduleState) => state.name,
}

export const mutations = {
  setName(state: SubmoduleState, newValue: string) {
    state.name = newValue
  },
}
