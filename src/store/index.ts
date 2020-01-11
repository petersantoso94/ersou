import Vue from 'vue';
import Vuex, { Commit, Dispatch } from 'vuex';
import User from '@/store/user'

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        User,
    },
});

export interface IActionContextBasic {
    commit: Commit;
    dispatch: Dispatch;
}
