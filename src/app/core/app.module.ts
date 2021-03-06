import { NgModule } from '@angular/core';
import { BrowserModule, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IonicStorageModule } from '@ionic/storage';
import { SMS } from '@ionic-native/sms/ngx';
import { IonicGestureConfig } from '../../../plugins/IonicGestureConfig';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';

@NgModule({
    declarations: [AppComponent],
    entryComponents: [],
    imports: [
        BrowserModule,
        IonicModule.forRoot({
            mode: 'md',
        }),
        IonicStorageModule.forRoot(),
        AppRoutingModule,
        HttpClientModule,
        FontAwesomeModule,
    ],
    providers: [
        StatusBar,
        SplashScreen,
        ScreenOrientation,
        SMS,
        { provide: HAMMER_GESTURE_CONFIG, useClass: IonicGestureConfig },
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    ],
    bootstrap: [AppComponent],
})
export class AppModule {
    constructor(library: FaIconLibrary) {
        library.addIconPacks(fas, fab, far);
    }
}
