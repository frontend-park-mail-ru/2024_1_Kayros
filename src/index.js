import '@fontsource/roboto';
import '@fontsource/montserrat';
import MainPage from './pages/MainPage';
import './global.scss';

const root = document.getElementById('root');

const mainPage = new MainPage(root);
mainPage.render();
