<script lang="ts">
import { IonRouterOutlet, IonPage, IonTabBar, IonTabButton, IonTabs, IonContent, IonToolbar } from '@ionic/vue';

import { personCircleSharp, earthOutline, search, homeOutline } from 'ionicons/icons';
import { IonIcon } from '@ionic/vue';
import { defineComponent } from 'vue';
export default defineComponent({
	components: { IonIcon, IonRouterOutlet, IonPage, IonTabBar, IonTabButton, IonTabs, IonContent, IonToolbar },
	setup() {
		return {
			personCircleSharp,
			earthOutline,
			search,
			homeOutline
		};
	}
});
</script>
<template>
	<IonPage>
		<IonContent>
			<div class="tab-view-shell">
				<div class="tab-view-bg">
					<img class="tab-view-bg-img" src="../assets/3.jpg" />
					<div class="tab-view-bg-overlay"></div>
				</div>
				<AppHeader />
				<slot name="default-view-body"></slot>
			</div>
		</IonContent>
		<IonToolbar>
			<IonTabs>
				<IonRouterOutlet></IonRouterOutlet>
				<IonTabBar slot="bottom">
					<IonTabButton tab="home" href="./">
						<IonIcon :icon="homeOutline"></IonIcon>
					</IonTabButton>

					<IonTabButton tab="list" href="/list">
						<IonIcon :icon="earthOutline"></IonIcon>
					</IonTabButton>

					<IonTabButton tab="account" href="/account">
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
.tab-view-bg {
	position: absolute;
	inset: 0;
	overflow: hidden;
	pointer-events: none;
	z-index: -1;
}
.tab-view-bg-img {
	width: 100%;
	height: 100%;
	/* object-fit: cover; */
}
.tab-view-bg-overlay {
	position: absolute;
	inset: 0;
	background: rgba(0, 0, 0, 0.3);
}
</style>
