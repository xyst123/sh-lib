import Vue from 'vue';
import Router from 'vue-router';
import Demo from '@/views/Demo';

Vue.use(Router);

const routes = [{
  path: '/',
  name: 'Demo',
  component: Demo,
}, {
  path: '*',
  redirect: '/',
}];

export default new Router({ routes });
