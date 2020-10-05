import App from './App.svelte';

const app = new App({
	target: document.querySelector('#root'),
	props: {
		name: 'Svelte App'
	}
});

window.app = app;

export default app;
