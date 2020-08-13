import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { SettingsPage } from './settings';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild([
            {
                path: '',
                component: SettingsPage,
            },
        ]),
    ],
    declarations: [SettingsPage],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SettingsPageModule {}
