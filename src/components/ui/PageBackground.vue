<template>
	<div class="page-bg">
		<img class="page-bg-img" src="../../assets/3.jpg" alt="" />
		<div class="page-bg-overlay"></div>
	</div>
</template>

<style scoped>
.page-bg {
	position: absolute;
	inset: 0;
	overflow: hidden;
	pointer-events: none;
	z-index: -1;
}
.page-bg-img {
	width: 100%;
	height: 100%;
	/* object-fit: cover; */
}
.page-bg-overlay {
	position: absolute;
	inset: 0;
	background: rgba(0, 0, 0, 0.3);
}
</style>
