/*Fichero necesario para cargar vue */

'use strict'

import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export const store = new Vuex.Store({
    state: {
        layout: '',
        title: '',
    },
    mutations: {
        SET_LAYOUT(state, newValue) {
            state.layout = newValue
        },
        SET_TITLE(state, newValue) {
            state.title = newValue
        },
    }
});