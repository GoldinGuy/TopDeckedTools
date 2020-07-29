import { Component } from '@angular/core';
// import { timer } from 'rxjs/observable/timer';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss'],
})
export class AppComponent {
    constructor(
        private platform: Platform,
        private splashScreen: SplashScreen,
        private statusBar: StatusBar
    ) {
        this.initializeApp();
    }
    // showSplash = true; // <-- show animation

    initializeApp() {
        this.platform.ready().then(() => {
            // set status bar to white
            this.statusBar.backgroundColorByHexString('#e6e6e6');
            this.statusBar.styleDefault();
            this.splashScreen.hide(); // <-- hide static image
            // this.showSplash = false; // <-- hide animation
            // timer(500).subscribe(() => (this.showSplash = false)); // <-- hide animation after 3s
        });
    }
}
