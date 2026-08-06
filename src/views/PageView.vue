<script setup lang="ts">
import { IonContent, IonButtons, IonBackButton, IonPage, IonHeader, IonTitle, IonToolbar } from '@ionic/vue';

defineProps({
	hideHeader: { type: Boolean, default: false },
	hideBackground: { type: Boolean, default: false }
});
</script>

<template>
	<ion-page>
		<ion-header class="ion-no-border">
			<ion-toolbar :class="{ 'toolbar-tall': hideHeader }">
				<ion-buttons slot="start">
					<!-- "home" (no leading slash) isn't a route — file-based routing puts the homepage at
					     "/". A bare relative href resolves against the current path, not the site root,
					     so whenever there's no in-app history to fall back on (a direct link, a reload,
					     a deep link) the back button pushed to a path that doesn't match any route. -->
					<ion-back-button default-href="/" color="white"></ion-back-button>
				</ion-buttons>
				<ion-title>
					<slot name="default-view-title"></slot>
				</ion-title>
			</ion-toolbar>
		</ion-header>

		<ion-content fullscreen>
			<div class="page-view-shell">
				<PageBackground v-if="!hideBackground" />
				<AppHeader v-if="!hideHeader" />
				<slot name="default-view-body"></slot>
			</div>
		</ion-content>
	</ion-page>
</template>

<style>
ion-toolbar {
	--box-shadow: none !important;
}
.toolbar-tall {
	--min-height: 70px;
}
.page-view-shell {
	position: relative;
	min-height: 100%;
	display: flow-root;
}
</style>
