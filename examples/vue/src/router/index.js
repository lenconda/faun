import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/views/Home';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/vue',
      name: 'HelloWorld',
      component: Home,
      children: [
        {
          path: '/vue/foo',
          name: 'Foo',
          component: () => import('@/views/Foo'),
        },
        {
          path: '/vue/bar',
          name: 'Bar',
          component: () => import('@/views/Bar'),
        },
      ],
    },
  ],
});
