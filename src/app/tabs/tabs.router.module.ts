import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
    {
        path: 'tabs',
        component: TabsPage,
        children: [
            // {
            //     path: 'home',
            //     children: [
            //         {
            //             path: '',
            //             loadChildren: () =>
            //                 import('../pages/home/home.module').then((m) => m.HomePageModule),
            //         },
            //     ],
            // },
            // {
            //     path: 'contentFilters',
            //     children: [
            //         {
            //             path: '',
            //             loadChildren: () =>
            //                 import('../pages/contentFilters/contentFilters.module').then(
            //                     (m) => m.ContentFiltersPageModule
            //                 ),
            //         },
            //     ],
            // },
            // {
            //     path: 'tools',
            //     children: [
            //         {
            //             path: '',
            //             loadChildren: () =>
            //                 import('../pages/tools/tools.module').then(m => m.ToolsPageModule)
            //         }
            //     ]
            // },
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
            // {
            //     path: 'settings',
            //     children: [
            //         {
            //             path: '',
            //             loadChildren: () =>
            //                 import('../pages/settings/settings.module').then(
            //                     (m) => m.SettingsPageModule
            //                 ),
            //         },
            //     ],
            // },
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
                    {
                        path: 'standings',
                        loadChildren: () =>
                            import('../pages/events/standings/standings.module').then(
                                (m) => m.standingsPageModule
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

// { path: 'feed', loadChildren: './feed/feed.module#FeedPageModule' },
// { path: 'tools', loadChildren: './tools/tools.module#ToolsPageModule' },
// { path: 'events', loadChildren: './events/events.module#EventsPageModule' }
