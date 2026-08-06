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

import { logError } from './helpers/errorLog.js';

const app = createApp(App).use(createPinia()).use(IonicVue).use(VueSplide).use(router);

// No app-level crash guard existed before this: an uncaught error thrown during a component's
// render/setup (e.g. the unguarded store-getter crashes fixed elsewhere) had nowhere to go and
// could take the whole app down with it. This won't save a genuine native-layer crash (that
// happens below the JS engine), but it catches JS-level exceptions/rejections that would
// otherwise be silent or fatal, and leaves a trail in app-error-log.txt (see helpers/errorLog.js)
// since there's no remote crash reporting wired up for this app.
app.config.errorHandler = (err, instance, info) => {
	logError('vue-error-handler', err, info);
};

window.addEventListener('error', event => {
	logError('window-error', event.error || event.message);
});

window.addEventListener('unhandledrejection', event => {
	logError('unhandledrejection', event.reason);
});

app.component('PageView', PageView);

app.component('TabView', TabView);

app.component('AppHeader', AppHeader);

app.component('PageBackground', PageBackground);

app.directive('clickable', clickable);

router.isReady().then(() => {
	app.mount('#app');
});
