import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/views/Home';
import Foo from '@/views/Foo';
import Bar from '@/views/Bar';

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
          component: Foo,
        },
        {
          path: '/bar',
          name: 'Bar',
          component: Bar,
        },
      ],
    },
  ],
});
