import Helper from '../lib/Helper';

export default {
	_config            : null,
	_threshold         : 150,
	_hiddenClass       : 'header--hidden',
	_transformClass    : 'header--transition-transform',
	_shrinkClass       : 'header--shrunk',
	_header            : null,
	_main              : null,
	_previousScrollTop : null,
	_disabled          : false,
	init(appConfig, reloaded) {
		this._config = appConfig;
		this._header = document.querySelector('.header');
		this._main   = document.querySelector('.main');

		if (!this._header || !this._main) {
			return;
		}
		this._checkScroll();
		this._adjustBody();
		this._header.classList.add(this._transformClass);

		if (!reloaded) {
			window.addEventListener('scroll', this._handleScroll.bind(this));
			window.addEventListener('orientationchange', this._adjustBody.bind(this));
		}
	},
	reload() {
		this.init(this._config, true);
	},
	_getShouldHide() {
		return this._previousScrollTop >= this._threshold;
	},
	_getIsHidden() {
		return this._header.classList.contains(this._hiddenClass);
	},
	_checkScroll() {
		const scrollTop         = Helper.getWindowYOffset();
		const scrollingUpwards  = scrollTop < this._previousScrollTop;
		this._previousScrollTop = scrollTop;
		const isHidden          = this._getIsHidden();
		const shouldHide        = this._getShouldHide();
		if (!shouldHide) {
			this._header.classList.remove(this._shrinkClass);
		}
		if (scrollingUpwards) {
			if (isHidden) {
				this._header.classList.remove(this._hiddenClass);
			}
			return;
		}
		if (isHidden || !shouldHide) {
			return;
		}
		this._header.classList.add(this._hiddenClass, this._shrinkClass);
	},
	_adjustBody() {
		const headerHeight          = Helper.getElementHeight(this._header);
		this._main.style.paddingTop = `${headerHeight}px`;
	},
	_handleScroll() {
		if (this._disabled) {
			this._header.classList.add(this._hiddenClass);
			return;
		}
		this._checkScroll();
	}
};