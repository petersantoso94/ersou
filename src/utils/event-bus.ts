import Vue from 'vue';

export const SystemAlert = (message: string) => {
    EventBus.$emit('system-alert', message);
};

const EventBus = new Vue();
export default EventBus;