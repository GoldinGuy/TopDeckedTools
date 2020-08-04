import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { CounterPage } from './counter';
import { LongPressDirective } from '../../../../../plugins/longPressDirective';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        LongPressDirective,
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
