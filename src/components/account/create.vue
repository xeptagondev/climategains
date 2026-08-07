<script setup lang="ts">
import { ref, reactive } from 'vue';
import { alertController } from '@ionic/vue';
import { apiSignUp } from '@/helpers/api';
import { useRouter } from 'vue-router';

const props = defineProps(['callback']);
const emit = defineEmits(['signed-up']);
const router = useRouter();

const isSubmitting = ref(false);
const submitted = ref(false);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_RE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

async function presentAlert(values: string, header = 'We are missing some information') {
	const alert = await alertController.create({
		header,
		message: values,
		buttons: ['OK']
	});

	await alert.present();
}

const state = reactive({
	organization: '',
	firstname: '',
	lastname: '',
	email: '',
	password: ''
});

function validate(): string | null {
	const firstname = (state.firstname ?? '').trim();
	const lastname = (state.lastname ?? '').trim();
	const email = (state.email ?? '').trim();
	const password = state.password ?? '';

	const missing: string[] = [];
	if (!firstname) missing.push('First Name');
	if (!lastname) missing.push('Last Name');
	if (!email) missing.push('Email');
	if (!password) missing.push('Password');
	if (missing.length > 0) {
		return `Please fill in: ${missing.join(', ')}`;
	}
	if (!EMAIL_RE.test(email)) {
		return 'Please enter a valid email address';
	}
	if (!PASSWORD_RE.test(password)) {
		return 'Password must be at least 8 characters and contain uppercase, lowercase, and a number';
	}
	return null;
}

async function submit() {
	const validationError = validate();
	if (validationError) {
		await presentAlert(validationError);
		return;
	}

	isSubmitting.value = true;
	try {
		const user = JSON.parse(JSON.stringify(state));
		user.firstname = user.firstname.trim();
		user.lastname = user.lastname.trim();
		user.email = user.email.trim();

		const result = await apiSignUp(user);

		switch (result?.status) {
			case 'created':
				if (result.session) {
					document.querySelectorAll('ion-modal').forEach(m => m.dismiss?.());
					router.push(props.callback ? `${props.callback}` : '/account');
					emit('signed-up');
				} else {
					submitted.value = true;
				}
				break;
			case 'pending_confirmation':
				submitted.value = true;
				break;
			case 'already_exists':
				await presentAlert(
					'An account with this email already exists. Please log in instead.',
					'Account already exists'
				);
				break;
			case 'error': {
				const err = result.error;
				const message = err?.message || JSON.stringify(err);
				const status = err?.status ? ` (status ${err.status})` : '';
				await presentAlert(`${message}${status}`, 'Sign up failed');
				break;
			}
			default:
				await presentAlert(
					`Unexpected result: ${JSON.stringify(result)}`,
					'Sign up failed'
				);
		}
	} finally {
		isSubmitting.value = false;
	}
}
</script>

<template>
	<div class="account_create">
		<h1 class="mb-2">Create your account</h1>
		<div v-if="!submitted" class="flex flex-col">
			<input
				placeholder="Your First Name"
				v-model="state.firstname"
				autocomplete="given-name"
				@keyup.enter="submit()" />
			<input
				placeholder="Your Last Name"
				v-model="state.lastname"
				autocomplete="family-name"
				@keyup.enter="submit()" />

			<input
				placeholder="Your Email"
				v-model="state.email"
				type="email"
				autocomplete="email"
				@keyup.enter="submit()" />
			<div class="w-full text-left">
				<input
					class="w-full"
					id="password"
					v-model="state.password"
					placeholder="Your Password"
					type="password"
					autocomplete="new-password"
					@keyup.enter="submit()" />
				<label for="password" class="text-xs text-left text-white/60">
					Your password must be at least 8 characters and contain uppercase, lowercase, and a number.
				</label>
			</div>
			<input
				v-model="state.organization"
				placeholder="Your Organization / Company"
				@keyup.enter="submit()" />

			<button
				type="button"
				:disabled="isSubmitting"
				@click="submit()"
				class="pill-button mt-3 disabled:opacity-60">
				{{ isSubmitting ? 'Signing up…' : 'Sign Up' }}
			</button>
		</div>
		<div v-else>
			<h1 class="text-xl font-bold bg-green-500/20 p-4 rounded-xl">Welcome onboard!</h1>
			<p class="text-xl">In order to use your account you must check your inbox for a confirmation email.</p>
			<p class="text-xl">Once confirmed you can log in to the application.</p>
		</div>
	</div>
</template>
<style scoped>
input {
	@apply py-3  text-lg text-white border-none;
	outline: none;
	background: none;
	border-bottom: 1px solid rgba(255, 255, 255, 0.3);
}
input::placeholder {
	color: rgba(255, 255, 255, 0.65);
}
.account_create {
	@apply mb-10;
}
button:disabled {
	cursor: not-allowed;
}
</style>
