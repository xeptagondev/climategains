import { createClient } from '@supabase/supabase-js';
import { toastController } from '@ionic/vue';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('[supabase] URL:', supabaseUrl);
console.log('[supabase] anon key length:', supabaseAnonKey?.length);
console.log('[supabase] window.location.origin:', window.location.origin);

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

/**
 * Sign up flow with clean status reporting.
 * Returns one of:
 *   { status: 'created', user, session }  — brand-new user; session is set if auto-confirmed
 *   { status: 'pending_confirmation' }    — email is already registered but unconfirmed; Supabase auto-resent
 *   { status: 'already_exists' }          — email is already registered and confirmed; user should log in
 *   { status: 'error', error }            — real error to surface
 */
async function apiSignUp(payload) {
	const redirect = `${window.location.origin}/account`;
	console.log('[signup v2] email:', payload.email, 'redirect:', redirect);
	try {
		const { data, error } = await supabase.auth.signUp({
			email: payload.email,
			password: payload.password,
			options: {
				emailRedirectTo: redirect,
				data: {
					fullname: payload.firstname + ' ' + payload.lastname,
					organization: payload.organization,
					ui_language: 'en'
				}
			}
		});
		console.log('[signup v2] data:', JSON.stringify(data));
		console.log('[signup v2] error:', JSON.stringify(error));

		if (error) {
			return { status: 'error', error };
		}
		if (data?.user?.id) {
			// Supabase populates identities=[] when the email already exists.
			const identities = data.user.identities;
			if (Array.isArray(identities) && identities.length === 0) {
				return { status: 'already_exists' };
			}
			return { status: 'created', user: data.user, session: data.session ?? null };
		}
		// Anti-enumeration shape: { user: null, session: null, error: null }
		// Supabase has already auto-resent the confirmation email if the account
		// existed and was unconfirmed. Treat as pending confirmation.
		if (data && data.user === null && data.session === null) {
			return { status: 'pending_confirmation' };
		}
		return {
			status: 'error',
			error: { message: `Unexpected response: ${JSON.stringify(data)}` }
		};
	} catch (error) {
		console.log('[signup v2] thrown:', error);
		return { status: 'error', error };
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
