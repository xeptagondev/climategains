<script lang="ts">
import { IonRouterOutlet, IonPage, IonTabBar, IonTabButton, IonTabs, IonContent, IonToolbar } from '@ionic/vue';

import { personCircleSharp, earthOutline, search, homeOutline } from 'ionicons/icons';
import { IonIcon } from '@ionic/vue';
import { defineComponent, computed } from 'vue';
import { useRoute } from 'vue-router';

export default defineComponent({
	components: { IonIcon, IonRouterOutlet, IonPage, IonTabBar, IonTabButton, IonTabs, IonContent, IonToolbar },
	setup() {
		const route = useRoute();

		// Every top-level page (Home/List/Account) mounts its own TabView instance, each with
		// its own IonTabs/IonRouterOutlet — the outlet never actually carries routed content
		// (pages render into the default-view-body slot instead), so Ionic's automatic
		// selected-tab detection has nothing real to match against and doesn't reliably update
		// on navigation. Deriving the active tab straight from the current route instead.
		const activeTab = computed(() => {
			if (route.path.startsWith('/list')) return 'list';
			if (route.path.startsWith('/account')) return 'account';
			return 'home';
		});

		return {
			personCircleSharp,
			earthOutline,
			search,
			homeOutline,
			activeTab
		};
	}
});
</script>
<template>
	<IonPage>
		<IonContent>
			<div class="tab-view-shell">
				<PageBackground />
				<AppHeader />
				<slot name="default-view-body"></slot>
			</div>
		</IonContent>
		<IonToolbar>
			<IonTabs>
				<IonRouterOutlet></IonRouterOutlet>
				<IonTabBar slot="bottom">
					<IonTabButton tab="home" href="/" :class="{ 'tab-is-active': activeTab === 'home' }">
						<IonIcon :icon="homeOutline"></IonIcon>
					</IonTabButton>

					<IonTabButton tab="list" href="/list" :class="{ 'tab-is-active': activeTab === 'list' }">
						<IonIcon :icon="earthOutline"></IonIcon>
					</IonTabButton>

					<IonTabButton tab="account" href="/account" :class="{ 'tab-is-active': activeTab === 'account' }">
						<IonIcon :icon="personCircleSharp"></IonIcon>
					</IonTabButton>

					<!-- Search page not implemented yet — hidden until built out
					<IonTabButton tab="search" href="/search">
						<IonIcon :icon="search"></IonIcon>
					</IonTabButton>
					-->

				</IonTabBar>
				</IonTabs>
			</IonToolbar>
		</IonPage>
</template>

<style scoped>
.tab-view-shell {
	position: relative;
	min-height: 100%;
	display: flow-root;
}

/* Ionic's built-in --color-selected (default theme blue) would otherwise light up whichever
   tab it thinks is selected; force pure white for that path too, alongside the explicit
   .tab-is-active class driven by the real current route above. */
ion-tab-button {
	--color-selected: #69b1df;
}

ion-tab-button.tab-is-active {
	color: #69b1df;
	--color: #69b1df;
}
</style>
