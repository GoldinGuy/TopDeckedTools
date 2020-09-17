import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { LifePage } from './life';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        FontAwesomeModule,
        RouterModule.forChild([
            {
                path: '',
                component: LifePage,
            },
        ]),
    ],
    declarations: [LifePage],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LifePageModule {}
