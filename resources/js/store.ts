import { InjectionKey } from "vue";
import { createStore, useStore as baseUseStore, Store } from "vuex";
import axios from "axios";

// define your typings for the store state
export interface State {
  metrikaId: number,
  title: string,
  stats: {
    groups: Array<{
      slug: string;
      icon: string;
      title: string;
      description: string;
      id: number;
    }>;
  };
}

// define injection key
export const key: InjectionKey<Store<State>> = Symbol("key");

export const store = createStore<State>({
  state: {
    title: '',
    metrikaId: 86667607,
    stats: {
      groups: [],
    },
  },
  mutations: {
    setGroups(state: State, groups: State["stats"]["groups"]) {
      state.stats.groups = groups;
    },
  },
  actions: {
    getGroups({ commit }) {
      axios.get("/api/stats/groups").then(({ data }) => {
        commit("setGroups", data.data);
      });
    },
  },
});

export function useStore() {
  return baseUseStore(key);
}
