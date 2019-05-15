//noinspection JSFileReferences
import * as components from './components/*.js';

const app = {
	_config         : null,
	_metaDescription: null,
	_ogTitle        : null,
	_ogType         : null,
	_ogUrl          : null,
	_ogImage        : null,
	sync() {
		this._config = document.querySelector('[data-config]');
		this._config = JSON.parse(this._config.getAttribute('data-config'));
		window.scrollTo(0, 0);
		if (this._config.title) {
			document.title = this._config.title;
			if (this._ogTitle) {
				this._ogTitle.setAttribute('content', this._config.title);
			}
		}
		if (this._metaDescription && this._config.seoDescription) {
			this._metaDescription.setAttribute('content', this._config.seoDescription);
		}
		if (this._ogType && this._config.type) {
			this._ogType.setAttribute('content', this._config.type);
		}
		if (this._ogUrl && this._config.url) {
			this._ogUrl.setAttribute('content', this._config.url);
		}
		if (this._ogImage && this._config.seoImage) {
			this._ogImage.setAttribute('content', this._config.seoImage);
		}
	},
	init() {
		this._metaDescription = document.querySelector('[data-meta-description]');
		this._ogTitle         = document.querySelector('[data-og-title]');
		this._ogType          = document.querySelector('[data-og-type]');
		this._ogUrl           = document.querySelector('[data-og-url]');
		this._ogImage         = document.querySelector('[data-og-image]');
		this.sync();
		this._components = {
			canReload: {},
			canChange: {}
		};

		for (let component in components) {
			if (!components.hasOwnProperty(component) ||
					!components[component] ||
					(typeof components[component] !== 'object')) {
				continue;
			}

			let componentName = component;
			component         = components[componentName];
			if (component.hasOwnProperty('init')) {
				component.init(this._config);
			}
			if (component.hasOwnProperty('change')) {
				this._components.canChange[componentName] = component;
			}
			if (component.hasOwnProperty('reload')) {
				this._components.canReload[componentName] = component;
			}
		}

		setTimeout(() => {
			this._initialized = true;
		});
	},
	reload() {
		this.sync();
		for (let component in this._components.canReload) {
			//noinspection JSUnfilteredForInLoop
			this._components.canReload[component].reload(this._config);
		}
	},
	change() {
		if (!this._initialized) {
			return;
		}
		for (let component in this._components.canChange) {
			//noinspection JSUnfilteredForInLoop
			this._components.canChange[component].change();
		}
	}
};

app.init();