import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/views/Home';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: Home,
      children: [
        {
          path: '/foo',
          name: 'Foo',
          component: () => import('@/views/Foo'),
        },
        {
          path: '/bar',
          name: 'Bar',
          component: () => import('@/views/Bar'),
        },
      ],
    },
  ],
});
