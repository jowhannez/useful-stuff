export default {
    _form: null,
    init() {
        this._forms = document.querySelectorAll('[data-form]');
        if (!this._forms) {
            return;
        }

        for (const form of this._forms) {
            form.addEventListener('submit', event => {
                event.preventDefault();
    
                grecaptcha.ready(() => {
                    const recaptchaToken = form.getAttribute('data-form');

                    grecaptcha.execute(recaptchaToken, {action: 'homepage'}).then(privateToken => {
                        const url      = form.action;
                        const data     = {};
                        const inputs   = form.querySelectorAll('input, select, textarea');
                        let redirect   = '';
                        
                        for (const input of inputs) {
                            data[input.name] = input.value;
                            if (input.name === 'redirect') {
                                redirect = input.value;
                            }
                        }
                        data['captchaKey'] = privateToken;

                        let searchParams = '';
                        for (const key in data) {
                            if (Object.keys(data).indexOf(key) !== 0) {
                                searchParams += '&';
                            }
                            searchParams += key + '=' + data[key];
                        }
                        
                        this._postAjax(url + searchParams, result => {
                            const res       = JSON.parse(result);
                            let redirectUrl = redirect;

                            if (res.success) {
                                redirectUrl += (redirectUrl.includes('?') ? '&' : '?') + 'success=true';
                            }

                            window.location.href = redirectUrl;
                        });
                    });
                })
            })
        }
    },
	_postAjax(url, success) {
		let xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
		xhr.open('POST', url);
		xhr.onreadystatechange = function () {
			if (xhr.readyState > 3 && xhr.status === 200) {
				success(xhr.responseText);
			}
		};
		xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
		xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		xhr.send();
        
		return xhr;
	}
}
