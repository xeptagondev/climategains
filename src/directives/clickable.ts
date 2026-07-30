import type { Directive } from 'vue';

// Makes a clickable non-interactive element (div/li/etc used as a button) reachable and
// operable by keyboard: focusable via Tab, and Enter/Space trigger the same click handler.
const clickable: Directive = {
	mounted(el: HTMLElement) {
		if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '0');
		if (!el.hasAttribute('role')) el.setAttribute('role', 'button');

		const handler = (event: KeyboardEvent) => {
			if (event.key === 'Enter' || event.key === ' ') {
				event.preventDefault();
				el.click();
			}
		};
		(el as any).__clickableKeyHandler = handler;
		el.addEventListener('keydown', handler);
	},
	unmounted(el: HTMLElement) {
		const handler = (el as any).__clickableKeyHandler;
		if (handler) {
			el.removeEventListener('keydown', handler);
			delete (el as any).__clickableKeyHandler;
		}
	}
};

export default clickable;
