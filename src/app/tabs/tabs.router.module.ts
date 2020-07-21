import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
    {
        path: 'tabs',
        component: TabsPage,
        children: [
            {
                path: 'rules',
                children: [
                    {
                        path: '',
                        loadChildren: () =>
                            import('../pages/rules/rules.module').then((m) => m.RulesPageModule),
                    },
                ],
            },

            {
                path: 'events',
                children: [
                    {
                        path: '',
                        loadChildren: () =>
                            import('../pages/events/events.module').then((m) => m.EventsPageModule),
                    },
                    {
                        path: 'tournaments',
                        loadChildren: () =>
                            import('../pages/events/tournaments/tournaments.module').then(
                                (m) => m.TournamentsPageModule
                            ),
                    },
                ],
            },
            {
                path: '',
                redirectTo: '/tabs/rules',
                pathMatch: 'full',
            },
        ],
    },
    {
        path: '',
        redirectTo: '/tabs/rules',
        pathMatch: 'full',
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class TabsPageRoutingModule {}
