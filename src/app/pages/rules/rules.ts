import { Component } from '@angular/core';
import { RulesService } from 'src/app/services/rules.service';
import { Storage } from '@ionic/storage';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { LoadingController } from '@ionic/angular';

@Component({
    selector: 'page-rules',
    templateUrl: 'rules.html',
    styleUrls: ['rules.scss'],
})
export class RulesPage {
    constructor(
        private rules: RulesService,
        private router: Router,
        public loadingController: LoadingController
    ) {
        this.searching = false;
        this.searchReference = {};
    }
    public searchTerm: string;
    public searching;
    public searchReference;

    searchChanged() {
        this.searching = !!this.searchTerm;
        this.searchTerm = this.searchTerm.toLowerCase();

        if (this.searching) {
            this.rules.getAllRulesMatching(this.searchTerm);
        } else {
            this.rules.array = this.rules.backupArray;
        }
    }

    // searchChanged(searching) {
    //     this.searching = !!this.searchTerm;
    //     var oldArray = this.rules.array;
    //     this.searchTerm = this.searchTerm.toLowerCase();

    //     if (this.searching) {
    //         this.rules.array = ['Loading...'];

    //         let temp = [];
    //         Object.keys(this.rules).forEach((key) => {
    //             let subrule = this.rules[key];
    //             Object.keys(subrule).forEach((subkey) => {
    //                 let detail = this.rules[key][subkey];
    //                 let added = false;
    //                 if (typeof detail !== 'object') {
    //                     detail = [detail];
    //                 }

    //                 detail.forEach((explanation) => {
    //                     if (explanation.toLowerCase().search(this.searchTerm) !== -1 && !added) {
    //                         temp.push(subkey);
    //                         this.searchReference[subkey] = key;
    //                         added = true;
    //                     }
    //                 });
    //             });
    //         });

    //         if (temp.length >= 1) {
    //             this.rules.array = temp;
    //         } else {
    //             this.rules.array = ['No results found :('];
    //         }
    //     } else {
    //         this.rules.array = oldArray;
    //     }
    // }

    // public isActive(rule: Rule) {}

    // public setActive(rule: Rule) {}

    // ionViewDidLoad() {
    //     this.rules.getRules(); // This will log "I do something useful!"
    // }

    // searchChanged() {
    //     this.searching = !!this.searchTerm;

    //     this.searchTerm = this.searchTerm.toLowerCase();

    //     if (this.searching) {
    //         this.array = ['Loading...'];

    //         let temp = [];
    //         Object.keys(rules).forEach((key) => {
    //             let subrule = rules[key];
    //             Object.keys(subrule).forEach((subkey) => {
    //                 let detail = rules[key][subkey];
    //                 let added = false;
    //                 if (typeof detail !== 'object') {
    //                     detail = [detail];
    //                 }

    //                 detail.forEach((explanation) => {
    //                     if (explanation.toLowerCase().search(this.searchTerm) !== -1 && !added) {
    //                         temp.push(subkey);
    //                         this.searchReference[subkey] = key;
    //                         added = true;
    //                     }
    //                 });
    //             });
    //         });

    //         if (temp.length >= 1) {
    //             this.array = temp;
    //         } else {
    //             this.array = ['No results found'];
    //         }
    //     } else {
    //         this.array = Object.keys(rules);
    //     }
    // }

    // nav(rule) {
    //     if (!this.searching) {
    //         let navigationExtras: NavigationExtras = {
    //             state: { rule },
    //         };
    //         this.router.navigate(['/tabs/rules/topics'], navigationExtras);
    //     } else {
    //         let navigationExtras: NavigationExtras = {
    //             state: { rule: this.searchReference[rule], section: rule },
    //         };
    //         this.router.navigate(['/tabs/rules/details'], navigationExtras);
    //     }
    // }
}
