<script setup lang="ts">
import { IonApp, IonRouterOutlet, IonSpinner } from '@ionic/vue';
import '@splidejs/vue-splide/css/core';
import useStore from './store';
import { supabase } from './helpers/api';

const store = useStore();

store.initializeApp();

supabase.auth.onAuthStateChange((_event, session) => {
	if (session?.user) {
		store.user.account = session.user;
		store.user.session = session;
		store.isAuthenticated = true;
	} else {
		store.user.account = null;
		store.user.session = null;
		store.isAuthenticated = false;
	}
});
</script>

<template>
	<ion-app>
		<div v-if="!store.isReady" class="app-loading">
			<ion-spinner name="crescent" />
		</div>
		<ion-router-outlet v-else />
	</ion-app>
</template>
<style>
body {
	background: rgba(40, 40, 40, 0.9) !important;
}
#app {
	position: relative;
	display: block;
	height: 100vh;
	box-sizing: border-box;
	/* Android 15+ enforces edge-to-edge with no opt-out from Android 16 onward, so the
	   WebView draws under the system status/nav bars. Pad the root shell by the real
	   device insets (populated because index.html sets viewport-fit=cover) so content
	   stays inside the visible/safe area instead of clipping behind system bars. */
	padding: env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom)
		env(safe-area-inset-left);
}
/* Desktop-only "phone in browser" preview frame — real mobile builds must stay full-bleed. */
@media (min-width: 768px) {
	#app {
		height: 90vh;
		border-radius: 20px;
		max-width: 450px;
		margin: 50px auto;
	}
}
.app-loading {
	display: flex;
	align-items: center;
	justify-content: center;
	height: 100%;
	width: 100%;
}
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
input:-webkit-autofill:active,
textarea:-webkit-autofill,
textarea:-webkit-autofill:hover,
textarea:-webkit-autofill:focus,
select:-webkit-autofill,
select:-webkit-autofill:hover,
select:-webkit-autofill:focus {
	-webkit-text-fill-color: #ffffff !important;
	-webkit-box-shadow: 0 0 0 1000px transparent inset !important;
	box-shadow: 0 0 0 1000px transparent inset !important;
	transition: background-color 5000s ease-in-out 0s;
	caret-color: #ffffff;
	background-clip: content-box !important;
}
</style>
