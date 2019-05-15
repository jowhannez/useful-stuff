export default {
	_body                : document.querySelector('body'),
	_activeMenuBodyClass : 'menu-active',
	_config              : null,
	_toggles             : null,
	init(appConfig, reloaded) {
		this._config  = appConfig;
		this._toggles = document.querySelectorAll('[data-toggle]');
		if (!this._toggles.length) {
			return;
		}
		if (!reloaded) {
			Array.prototype.forEach.call(this._toggles, toggle => {
				toggle.addEventListener('click', this._toggle.bind(this, toggle));
			});
		}
	},
	reload() {
		this.init(this._config, true);
	},
	change() {
		this._body.classList.remove(this._activeMenuBodyClass);
		Array.prototype.forEach.call(this._toggles, toggle => {
			const target = toggle.getAttribute('data-toggle');
			if (target === 'menu') {
				const targetElement = document.querySelector(`[data-toggle-target='${target}']`);
				let activeClass     = toggle.getAttribute('data-toggle-class');
				if (!activeClass) {
					activeClass = 'active';
				}
				toggle.classList.remove(activeClass);
				if (targetElement) { targetElement.classList.remove(activeClass); }
			}
		});
	},
	_toggle(toggle) {
		const closeOthers = toggle.getAttribute('data-close-others') === 'true';
		const target      = document.querySelector(`[data-toggle-target='${toggle.getAttribute('data-toggle')}']`);
		if (!target) {
			return;
		}
		let toggleClass = toggle.getAttribute('data-toggle-class');
		let targetClass = target.getAttribute('data-target-class');
		if (!toggleClass) {
			toggleClass = 'active;';
		}
		if (!targetClass) {
			targetClass = toggleClass;
		}
		if (toggle.classList.contains(toggleClass) || target.classList.contains(targetClass)) {
			this._hide(toggle, target);
			return;
		}
		if (closeOthers) {
			this._hideAll();
		}
		this._show(toggle, target);
	},
	_hideAll() {
		Array.prototype.forEach.call(this._toggles, toggle => {
			const target = document.querySelector(`[data-toggle-target='${toggle.getAttribute('data-toggle')}']`);
			if (target) {
				this._hide(toggle, target);
			}
		});
	},
	_show(toggle, target) {
		let toggleClass = toggle.getAttribute('data-toggle-class');
		let targetClass = target.getAttribute('data-target-class');
		if (!toggleClass) {
			toggleClass = 'active;';
		}
		if (!targetClass) {
			targetClass = toggleClass;
		}
		if (toggle.getAttribute('data-toggle') === 'menu') {
			this._body.classList.add(this._activeMenuBodyClass);
		}
		toggle.classList.add(toggleClass);
		target.classList.add(targetClass || toggleClass);
	},
	_hide(toggle, target) {
		let toggleClass = toggle.getAttribute('data-toggle-class');
		let targetClass = target.getAttribute('data-target-class');
		if (!toggleClass) {
			toggleClass = 'active;';
		}
		if (!targetClass) {
			targetClass = toggleClass;
		}
		if (toggle.getAttribute('data-toggle') === 'menu' &&
			this._body.classList.contains(this._activeMenuBodyClass)) {
			this._body.classList.remove(this._activeMenuBodyClass);
		}
		toggle.classList.remove(toggleClass);
		target.classList.remove(targetClass || toggleClass);
	}
};