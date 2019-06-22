import components from './components/*.js';

const app = {
    init() {
        components.forEach((component) => {
            if (typeof component === 'object' && component.hasOwnProperty('default')) {
                component = component.default;
                component.hasOwnProperty('init') ? component.init() : null;
            }
        });
    }
};

app.init();
