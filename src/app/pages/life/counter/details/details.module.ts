import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { DetailsPage } from './details';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild([
            {
                path: '',
                component: DetailsPage,
            },
        ]),
    ],
    declarations: [DetailsPage],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DetailsPageModule {}
