import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {
        path: '',
        loadChildren: () => import('../tabs/tabs.module').then(m => m.TabsPageModule)
    }
    // { path: 'feed', loadChildren: './feed/feed.module#FeedPageModule' },
    // { path: 'tools', loadChildren: './tools/tools.module#ToolsPageModule' },
    // { path: 'events', loadChildren: './events/events.module#EventsPageModule' }
];
@NgModule({
    imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
    exports: [RouterModule]
})
export class AppRoutingModule {}
