// import { Component, ViewChild } from '@angular/core';
// import { NavController, IonInfiniteScroll } from '@ionic/angular';
// // import { RulesService } from "../../services/categoty.service";
// import { NavigationExtras } from '@angular/router';
// import { ConfigData } from '../../services/config';
// import { DomSanitizer } from '@angular/platform-browser';
// import { Storage } from '@ionic/storage';

// @Component({
//     selector: 'page-rules',
//     templateUrl: 'rules.html',
//     styleUrls: ['rules.scss']
//     // providers: [RulesService]
// })
// export class RulesPage {
//     constructor(public navCtrl: NavController) { }

//     rulesCard() {

//     }
// }

import { Component } from '@angular/core';
// import { ScryfallService } from '../../provider/scryfall-service/scryfall.service';
// import { TcgService } from '../../provider/tcg-service/tcg.service';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { map } from 'rxjs/operators';
import { isNullOrUndefined } from 'util';
import { Storage } from '@ionic/storage';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser/ngx';
import { VirtualTimeScheduler } from 'rxjs';
import rules from './rules_txt';

import { LoadingController } from '@ionic/angular';

@Component({
    selector: 'page-rules',
    templateUrl: 'rules.html',
    styleUrls: ['rules.scss'],
    providers: [InAppBrowser]
})
export class RulesPage {
    page_name: any;
    page_path: any;
    component_name: any;
    array;
    searchTerm;
    searching;

    searchReference;

    constructor(
        // private scryfallService: ScryfallService,
        private router: Router,
        private route: ActivatedRoute,
        private storage: Storage,
        public loadingController: LoadingController,
        // private tcgService: TcgService,
        private iab: InAppBrowser
    ) {
        console.log('rulesPage');

        console.log(rules);
        this.array = Object.keys(rules);
        this.searching = false;
        this.searchReference = {};
    }
    searchChanged() {
        this.searching = !!this.searchTerm;

        this.searchTerm = this.searchTerm.toLowerCase();

        if (this.searching) {
            this.array = ['Loading...'];

            let temp = [];
            Object.keys(rules).forEach(key => {
                let subrule = rules[key];
                Object.keys(subrule).forEach(subkey => {
                    let detail = rules[key][subkey];
                    let added = false;
                    if (typeof detail !== 'object') {
                        detail = [detail];
                    }

                    detail.forEach(explanation => {
                        if (explanation.toLowerCase().search(this.searchTerm) !== -1 && !added) {
                            temp.push(subkey);
                            this.searchReference[subkey] = key;
                            added = true;
                        }
                    });
                });
            });

            if (temp.length >= 1) {
                this.array = temp;
            } else {
                // this.array = ['No Rules Found :('];
                this.array = ['No results found'];
            }
        } else {
            this.array = Object.keys(rules);
        }
    }

    nav(rule) {
        if (!this.searching) {
            let navigationExtras: NavigationExtras = {
                state: { rule }
            };
            this.router.navigate(['/tabs/rules/topics'], navigationExtras);
        } else {
            let navigationExtras: NavigationExtras = {
                state: { rule: this.searchReference[rule], section: rule }
            };
            this.router.navigate(['/tabs/rules/details'], navigationExtras);
        }
    }

    learnToPlay() {
        var options =
            'zoom=no,location=yes,hideurlbar=yes,presentationstyle=pagesheet,shouldPauseOnSuspend=yes,allowInlineMediaPlayback=yes,enableViewportScale=yes';
        this.iab.create('https://magic.wizards.com/en/magic-gameplay', `_blank`, options);
    }
}
