import inView from 'in-view';

export default {
	_selector          : '[data-animated]',
	_activeClass       : 'animated-images__container--active',
	_loopDuration      : 6000,
	_transitionDuration: 1500,
	_intervals         : {},
	_timeouts          : {
		containers: {},
		captions  : {}
	},
	init() {
		inView(this._selector).on('enter', el => {
			this._start(el);
		}).on('exit', el => {
			this._stop(el);
		});
	},
	reload() {
		this.init();
	},
	_start(el) {
		const containers = el.querySelectorAll('[data-animated-container]');
		const amount     = containers.length;
		if (!amount) {
			return;
		}
		this._activate(containers[0]);
		if (amount === 1) {
			return;
		}
		Array.prototype.forEach.call(containers, (container, ind) => {
			const guid = container.getAttribute('data-guid');
			let next   = ind + 1;
			if (next >= amount) {
				next = 0;
			}
			if (this._timeouts.containers.hasOwnProperty(guid)) {
				clearTimeout(this._timeouts.containers[guid]);
			}
			this._timeouts.containers[guid] = setTimeout(() => {
				this._switch(container, containers[next]);
				this._intervals[guid] = setInterval(() => {
					this._switch(container, containers[next]);
				}, (this._loopDuration * amount));
			}, (this._loopDuration * (ind + 1)));
		});
	},
	_stop(el) {
		const containers = el.querySelectorAll('[data-animated-container]');
		if (!containers.length) {
			return;
		}
		Array.prototype.forEach.call(containers, container => {
			const guid = container.getAttribute('data-guid');
			if (this._timeouts.containers.hasOwnProperty(guid)) {
				clearTimeout(this._timeouts.containers[guid]);
			}
			if (this._intervals.hasOwnProperty(guid)) {
				clearInterval(this._intervals[guid]);
			}
			if (this._timeouts.captions.hasOwnProperty(guid)) {
				clearTimeout(this._timeouts.captions[guid]);
			}
			this._deactivate(container);
		});
	},
	_switch(from, to) {
		this._deactivate(from);
		this._activate(to);
	},
	_deactivate(container) {
		const caption = container.querySelector('figcaption');
		const img     = container.querySelector('img');
		setTimeout(() => {
			img.classList.remove('running');
		}, this._transitionDuration);
		if (caption) {
			setTimeout(() => {
				caption.classList.remove('active');
			}, this._transitionDuration);
		}
		container.classList.remove(this._activeClass);
	},
	_activate(container) {
		const caption = container.querySelector('figcaption');
		const img     = container.querySelector('img');
		if (caption) {
			const guid = container.getAttribute('data-guid');
			if (this._timeouts.captions.hasOwnProperty(guid)) {
				clearTimeout(this._timeouts.captions[guid]);
			}
			this._timeouts.captions[guid] = setTimeout(() => {
				caption.classList.add('active');
			}, (this._transitionDuration / 2));
		}
		container.classList.add(this._activeClass);
		img.classList.add('running');
	}
};