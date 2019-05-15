export default {
	init() {

	},
	reload() {
		return this.init();
	},
	getElementHeight(element) {
		let height;
		let clone             = element.cloneNode(true);
		clone.style.maxHeight = 'none';
		clone.style.display   = 'block';
		element.parentNode.appendChild(clone);
		height = clone.clientHeight;
		element.parentNode.removeChild(clone);
		return height;
	},
	haltEvent(e) {
		e.preventDefault();
		e.stopPropagation();
	},
	postAjax(url, data, success) {
		const params = typeof data === 'string' ? data : Object.keys(data).map(k => {
					return encodeURIComponent(k) + '=' + encodeURIComponent(data[k]);
				}
		).join('&');
		let xhr      = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
		xhr.open('POST', url);
		xhr.onreadystatechange = function () {
			if (xhr.readyState > 3 && xhr.status === 200) {
				success(xhr.responseText);
			}
		};
		xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
		xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		xhr.send(params);
		return xhr;
	},
	getWindowWidth(returnClientWidth) {
		const w = window;
		const d = document;
		const e = d.documentElement;
		const b = d.getElementsByTagName('body')[0];
		return returnClientWidth ? e.clientWidth || b.clientWidth : w.innerWidth || e.clientWidth || b.clientWidth;
	},
	getWindowHeight() {
		const w = window;
		const d = document;
		const e = d.documentElement;
		const b = d.getElementsByTagName('body')[0];
		return w.innerHeight || e.clientHeight || b.clientHeight;
	},
	getWindowYOffset() {
		const w = window;
		const d = document;
		const e = d.documentElement;
		const b = d.getElementsByTagName('body')[0];
		return w.pageYOffset || e.scrollTop || b.scrollTop;
	}
};