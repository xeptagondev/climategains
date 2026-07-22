<script setup lang="ts">
import { IonContent, IonButtons, IonBackButton, IonPage, IonHeader, IonTitle, IonToolbar } from '@ionic/vue';

defineProps({
	hideHeader: { type: Boolean, default: false }
});
</script>

<template>
	<ion-page>
		<ion-header class="ion-no-border">
			<ion-toolbar :class="{ 'toolbar-tall': hideHeader }">
				<ion-buttons slot="start">
					<ion-back-button default-href="home" color="white" type="medium"></ion-back-button>
				</ion-buttons>
				<ion-title>
					<slot name="default-view-title"></slot>
				</ion-title>
			</ion-toolbar>
		</ion-header>

		<ion-content fullscreen>
			<div class="page-view-shell">
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
