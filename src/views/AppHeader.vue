<script setup lang="ts">
import { IonIcon } from '@ionic/vue';
import { personCircleSharp } from 'ionicons/icons';
import { useRouter } from 'vue-router';
import useStore from '@/store';

const store = useStore();
const router = useRouter();
</script>

<template>
	<div class="app-header w-full mt-4 flex items-center justify-between" @click="() => router.push('/account')">
		<img class="ml-4" style="height: 31px" src="../assets/logo_white_alt.png" />
		<div v-if="!store.isAuthenticated" class="flex text-lg font-bold items-center mr-6 text-white">
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6 mr-2">
				<path
					fill-rule="evenodd"
					d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
					clip-rule="evenodd" />
			</svg>
			Sign In
		</div>
		<div v-else class="flex items-center mr-4 text-white">
			<ion-icon :icon="personCircleSharp" style="font-size: 32px"></ion-icon>
		</div>
	</div>
</template>

<style scoped>
.app-header {
	position: absolute;
	top: 0;
	left: 0;
	z-index: 2;
}
</style>
