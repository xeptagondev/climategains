<script setup lang="ts">
import { useRouter } from 'vue-router';
import useStore from '@/store/index.js';
import icon from '@/components/ui/icon.vue';

const store = useStore();
const router = useRouter();

store.fetchProgrammes();
store.fetchProjects();

const programme = id => {
	return store.getProgramme(id);
};

function changeRole(value) {
	store.role = value;
}

function getIcon(value) {
	if (value === 'Solar Energy') {
		return 'sun';
	}
	if (value === 'Energy Demand') {
		return 'energy';
	}
}

function getCountry(value) {
	const regionNames = new Intl.DisplayNames(['en'], { type: 'region' });
	return regionNames.of(value);
}

function formatLocation(loc) {
	if (!loc) return '';
	let obj = loc;
	if (typeof loc === 'string') {
		try {
			obj = JSON.parse(loc);
		} catch {
			// Not JSON — show the plain string as-is
			return loc;
		}
	}
	if (typeof obj !== 'object' || obj === null) return String(obj);
	return Object.values(obj)
		.filter(value => value !== null && value !== undefined && value !== '')
		.join(', ');
}
</script>
<template>
	<!-- eslint-disable vuejs-accessibility/click-events-have-key-events -- keyboard support added via the v-clickable directive, which ESLint's static check can't see -->
	<tab-view>
		<template #default-view-body>
			<div v-if="store.role == 'validator'">
				<div
					v-if="store.isAuthenticated"
					class="inline-block bg-gray-900 text-md rounded-full font-bold px-4 fixed z-20 right-5 bottom-20 py-2 shadow-lg"
					v-clickable
					@click="changeRole('activist')">
					Switch to Activist
				</div>

				<div class="mx-4 mt-24">
					<h1 class="mb-0 p-0">Climate Actions</h1>
					<h3 class="mt-1 mb-4 font-light text-2xl">Projects Index</h3>
				</div>
				<ul v-if="store.global.projects" class="items">
					<li
						v-for="(item, index) in store.global.projects"
						:key="index"
						v-clickable
						@click="() => router.push(`list/projects/${item.id}`)">
						<div class="flex items-start">
							<icon :type="getIcon(programme(item.programme_id)?.default_sector)" />
							<div>
								<b class="my-0">{{ item.name }}</b>
								<p class="mt-1">{{ formatLocation(item.location_name) }}</p>
							</div>
						</div>
						<!-- <div class="rounded-lg ml-2 px-3 border border-white/30 text-white py-2 font-bold text-xs">
							<span v-if="item.metadata.currentStage == 0">Application Phase</span>
							<span v-else>Stage {{ item.metadata.currentStage }}</span>
						</div> -->
					</li>
				</ul>
			</div>

			<div v-else>
				<div
					v-if="store.isAuthenticated"
					class="inline-block bg-gray-900 text-md rounded-full font-bold px-4 fixed z-20 right-5 bottom-20 py-2"
					v-clickable
					@click="changeRole('validator')">
					Switch to Validator
				</div>

				<div class="mx-4 mt-24">
					<h1 class="mb-0 p-0">Climate Opportunities</h1>
					<h3 class="mt-1 mb-4 font-light text-2xl">Programmes Index</h3>
				</div>

				<ul v-if="store.global.programmes" class="items">
					<li
						v-for="(item, index) in store.global.programmes"
						:key="index"
						v-clickable
						@click="() => router.push(`list/programmes/${item.id}`)">
						<div class="flex items-start">
							<icon :type="getIcon(item.default_sector)" />

							<div>
								<b class="my-0">{{ item.name }}</b>
								<p class="mt-1">{{ getCountry(item.country_code) }} · {{ item.emissions_avoided }}kg CO2/year</p>
							</div>
						</div>
					</li>
				</ul>
			</div>
		</template>
	</tab-view>
</template>
<style scoped>
.items {
}

.items li {
	@apply flex items-center px-6 py-5 border-white/10 border-b justify-between;
}

.items li p {
	margin: 0;
}

li img {
	width: 40px;
	height: 40px;
	object-fit: cover;
	@apply rounded mr-3;
}

.list_item h4 {
	@apply pb-1 mb-0 m-0 border-b border-white/40;
}
.list_item p {
	@apply m-0 p-0;
}
</style>
