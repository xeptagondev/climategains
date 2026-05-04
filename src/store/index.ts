import { defineStore } from 'pinia';
import { supabase } from '@/helpers/api';

const envkey = import.meta.env.VITE_SUPABASE_URL;
const useStore = defineStore('account', {
	state: () => ({
		key: envkey,
		global: {
			users: [] as any[],
			steps: [] as any[],
			media: [] as any[],
			actions: [] as any[],
			programmes: [] as any[],
			projects: [] as any[],
			questions: [] as any[],
			roles: [] as any[],
			profiles: [] as any[]
		},
		user: {
			account: null as any,
			session: null as any
		},
		isAuthenticated: false,
		token: null as any,
		project: { steps: [] as any[] },
		projects: [] as any[],
		role: 'activist',
		isReady: false
	}),
	actions: {
		async initializeApp() {
			await Promise.all([
				this.fetchProgrammes(),
				this.fetchProjects(),
				this.fetchSteps(),
				this.fetchUsers(),
				this.fetchQuestions(),
				this.fetchMedia(),
				this.fetchRoles()
			]);
			this.isReady = true;
		},
		async fetchUsers() {
			const { data: profile } = await supabase.from('profile').select('*');
			this.global.users = profile ?? [];
		},
		async fetchProgrammes() {
			const { data: programme } = await supabase.from('programme').select('*');
			this.global.programmes = programme ?? [];
		},
		async fetchProjects() {
			const { data: project } = await supabase.from('project').select('*');
			this.global.projects = project ?? [];
		},
		async fetchQuestions() {
			const { data: programme_response } = await supabase.from('programme_response').select('*');
			this.global.questions = programme_response ?? [];
		},
		async fetchSteps() {
			const { data: programme_step } = await supabase.from('programme_step').select('*');
			this.global.steps = programme_step ?? [];
		},
		async fetchMedia() {
			const { data: medium } = await supabase.from('medium').select('*');
			this.global.media = medium ?? [];
		},
		async fetchRoles() {
			const { data: role } = await supabase.from('role').select('*');
			this.global.roles = role ?? [];
		},
		async fetchProfiles(id: string) {
			const { data: profile_for_all } = await supabase.from('profile_for_all').select('*').eq('id', id);
			this.global.profiles = profile_for_all ?? [];
		}
	},
	getters: {
		getProgramme: state => (id: any) => {
			return (state.global.programmes ?? []).filter((x: any) => x.id == id)[0];
		},
		getProject: state => (id: any) => {
			return (state.global.projects ?? []).filter((x: any) => x.id == id)[0];
		},
		getMedia(): (id: any) => any[] {
			return (id: any) => (this.global.media ?? []).filter((x: any) => x.programme_id === id);
		},
		getSteps(): (id: any) => any[] {
			return (id: any) => (this.global.steps ?? []).filter((x: any) => x.programme_id === id);
		},
		getQuestion(): (id: any) => any[] {
			return (id: any) => (this.global.questions ?? []).filter((x: any) => x.id === id);
		},
		getProgrammeQuestions(): (id: any) => any[] {
			return (id: any) => (this.global.questions ?? []).filter((x: any) => x.programme_step_id === id);
		},
		getPoster(): (id: any) => any {
			return (id: any) => this.getMedia(id).filter((x: any) => x.role === 'poster')[0];
		},
		getVideo(): (id: any) => any {
			return (id: any) => this.getMedia(id).filter((x: any) => x.role === 'video')[0];
		},
		getGallery(): (id: any) => any[] {
			return (id: any) => this.getMedia(id).filter((x: any) => x.role === 'gallery_picture');
		},
		getUser(): (id: any) => any[] {
			return (id: any) => (this.global.users ?? []).filter((x: any) => x.id === id);
		},
		getUserRoles(): (id: any) => any[] {
			return (id: any) => (this.global.roles ?? []).filter((x: any) => x.user_id === id);
		},
		getIncome(): (id: any) => number {
			return (id: any) => {
				const steps = this.getSteps(id).map((x: any) => x.funding_amount ?? 0);
				if (!steps.length) return 0;
				return steps.reduce((total: number, item: number) => total + item, 0);
			};
		},
		getWorktime(): (id: any) => number {
			return (id: any) => {
				const steps = this.getSteps(id).map((x: any) => x.worktime ?? 0);
				if (!steps.length) return 0;
				return steps.reduce((total: number, item: number) => total + item, 0);
			};
		},
		getCurrency(): (id: any) => any {
			return (id: any) => {
				const steps = this.getSteps(id);
				return steps.length ? steps[0].funding_currency : null;
			};
		}
	}
});

export default useStore;
