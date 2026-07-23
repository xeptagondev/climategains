<template>
	<div class="icon" :class="glyphName">
		<component :is="svgIcon" />
	</div>
</template>

<script setup>
const props = defineProps(['type']);
import { computed, defineAsyncComponent } from 'vue';

const KNOWN_GLYPHS = ['energy', 'gas', 'leaf', 'sun', 'tree'];
const DEFAULT_GLYPH = 'leaf';

// Falls back to a default glyph when `type` is missing or unrecognized (e.g. programme.default_sector
// is not set), since a dynamic import for an unknown glyph name would otherwise throw.
const glyphName = computed(() => (KNOWN_GLYPHS.includes(props.type) ? props.type : DEFAULT_GLYPH));
const svgIcon = defineAsyncComponent(() => import(`./glyphs/${glyphName.value}.vue`));
</script>

<style scoped>
.icon {
	@apply bg-black rounded-full flex justify-center shrink-0 mr-4 items-center w-10 h-10;
}
.tree,
.leaf {
	@apply bg-green-600;
}
.sun {
	@apply bg-yellow-600;
}
.energy {
	@apply bg-green-600;
}
.gas {
	@apply bg-blue-600;
}
</style>
