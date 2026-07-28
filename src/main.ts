import { createApp } from 'vue';

import { createPinia } from 'pinia';

import { IonicVue } from '@ionic/vue';

import App from './App.vue';

import router from './router';

import './views';

import VueSplide from '@splidejs/vue-splide';

import PageView from './views/PageView.vue';

import TabView from './views/TabView.vue';

import AppHeader from './views/AppHeader.vue';

import PageBackground from './components/ui/PageBackground.vue';

import clickable from './directives/clickable';

const app = createApp(App).use(createPinia()).use(IonicVue).use(VueSplide).use(router);

app.component('PageView', PageView);

app.component('TabView', TabView);

app.component('AppHeader', AppHeader);

app.component('PageBackground', PageBackground);

app.directive('clickable', clickable);

router.isReady().then(() => {
	app.mount('#app');
});
