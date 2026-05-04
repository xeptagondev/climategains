import { createClient } from '@supabase/supabase-js';
import { toastController } from '@ionic/vue';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function showError(message) {
	const toast = await toastController.create({
		message: message || 'Something went wrong',
		duration: 3000,
		color: 'danger',
		position: 'top'
	});
	await toast.present();
}

async function apiSelect(table, filter, query) {
	try {
		let result;
		if (filter !== undefined) {
			result = await supabase.from(table).select('*').eq(filter, query);
		} else {
			result = await supabase.from(table).select('*');
		}
		const { data, error, status } = result;
		if (error && status !== 406) throw error;
		return data ?? [];
	} catch (error) {
		await showError(error.message);
		return [];
	}
}

async function apiSignUp(payload) {
	try {
		const { data: user, error } = await supabase.auth.signUp({
			email: payload.email,
			password: payload.password,
			options: {
				emailRedirectTo: `${window.location.origin}/account`,
				data: {
					fullname: payload.firstname + ' ' + payload.lastname,
					organization: payload.organization,
					ui_language: 'en'
				}
			}
		});
		if (error) {
			await showError(error.message);
			return { error };
		}
		return user;
	} catch (error) {
		await showError(error.message);
		return { error };
	}
}

async function getResponse(id) {
	return apiSelect('response', 'step_id', id);
}

async function getStep(id) {
	return apiSelect('step', 'id', id);
}

async function getStepsFromProjectId(id) {
	return apiSelect('step', 'project_id', id);
}

export { supabase, apiSignUp, getResponse, getStep, getStepsFromProjectId, showError };
