import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FooComponent } from './pages/foo/foo.component';
import { BarComponent } from './pages/bar/bar.component';

const routes: Routes = [
  {
    path: 'foo',
    component: FooComponent,
  },
  {
    path: 'bar',
    component: BarComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
