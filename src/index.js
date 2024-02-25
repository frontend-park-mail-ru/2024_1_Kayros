import '@fontsource/roboto';
import '@fontsource/montserrat';
import Layout from './components/Layout/Layout';
import RestaurantsPage from './pages/RestaurantsPage';
import './global.scss';

const root = document.getElementById('root');
const layout = new Layout(root);
layout.render();

const content = document.getElementById('content');
const restaurantsPage = new RestaurantsPage(content);
restaurantsPage.render();
