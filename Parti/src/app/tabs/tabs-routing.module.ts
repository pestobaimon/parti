import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'parties',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../parties/parties.module').then(m => m.PartiesPageModule)
          }
        ]
      },
      {
        path: 'friends',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../friends/friends.module').then(m => m.FriendsPageModule)
          }
        ]
      },
      {
        path: 'groups',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../groups/groups.module').then(m => m.GroupsPageModule)
          }
        ]
      },
      {
        path: '',
        redirectTo: '/tabs/parties',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/parties',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
