import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

import { RulesPage } from './rules';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,

        RouterModule.forChild([
            {
                path: '',
                component: RulesPage
            }
        ])
    ],
    declarations: [RulesPage],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class RulesPageModule {}
