import App from './app';
import './styles/main.css';

document.addEventListener('DOMContentLoaded', () => {
  const app = new App('#app');
  app.init();
});

export { App };