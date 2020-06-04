import { Component } from '@angular/core';
import { RulesService } from 'src/app/services/rules.service';
import { Storage } from '@ionic/storage';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { empty } from 'rxjs';

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

    // when searchbar changes, update array. when searchbar is empty, display main rules categories
    searchChanged() {
        this.searching = !!this.searchTerm;
        this.searchTerm = this.searchTerm.toLowerCase();

        if (this.searching) {
            this.rules.getAllRulesMatching(this.searchTerm);
        } else {
            this.rules.array = this.rules.mainRules;
        }
    }

    // determine if a given rule is numeric or a glossary term
    isRule(ruleToCheck) {
        return this.isNumeric(ruleToCheck.substring(0, 2));
    }

    isNumeric(value) {
        return /^-{0,1}\d+$/.test(value);
    }
}
