import { createRouter, createWebHistory } from 'vue-router';
import LandingPage from '../components/LandingPage.vue';
import CompetitionDetails from '../components/CompetitionPage.vue';

const routes = [
  { path: '/', component: LandingPage },
  {
    path: '/competition/:title',
    name: 'CompetitionDetails',
    component: CompetitionDetails,
    props: true,  // Pass the route params as props to the component
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
