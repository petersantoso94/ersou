import { IActionContextBasic } from '@/store/index';
import * as Model from '@/models/interfaces/User';

export interface IState {
    User: { loggedIn: boolean, data: firebase.User }
}

const SET_USER = 'set_user';
const SET_LOGGED_IN = 'set_logged_in';

const initState: IState = {
    User: {
        loggedIn: false,
        data: {} as firebase.User
    }
}

const getters = {
    User: (state: IState) => state.User
}

const actions = {
    fetchUser(context: IActionContextBasic, payload: firebase.User) {
        context.commit(SET_LOGGED_IN, payload !== null)
        if (payload) {
            context.commit(SET_USER, payload)
        } else {

            context.commit(SET_USER, payload)
        }
    },
}

const mutations = {
    [SET_USER](state: IState, payload: firebase.User) {
        state.User.data = payload
    },
    [SET_LOGGED_IN](state: IState, payload: boolean) {
        state.User.loggedIn = payload;
    }
}

export default {
    namespaced: true,
    state: initState,
    getters,
    actions,
    mutations,
};