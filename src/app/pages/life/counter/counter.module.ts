import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { CounterPage } from './counter';
import { LongPressModule } from 'ionic-long-press';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        LongPressModule,
        RouterModule.forChild([
            {
                path: '',
                component: CounterPage,
            },
        ]),
    ],
    declarations: [CounterPage],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CounterPageModule {}
