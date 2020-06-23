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
        (this.searching = false), (this.hideBack = true);
        this.searchReference = {};
        this.array = this.rules.getAllTopicIds();
    }
    searchTerm: string;
    searching: boolean;
    searchReference;
    hideBack: boolean;
    sectionrule: string;
    currentTerm: string;
    subsection: string[];
    section: string[];
    array: string[];

    // when searchbar changes, update array. when searchbar is empty, display main rules categories
    searchChanged() {
        this.searching = !!this.searchTerm;
        this.searchTerm = this.searchTerm.toLowerCase();

        if (this.searching) {
            this.hideBack = true;
            // this.array = this.rules.getAllRulesMatching(this.searchTerm);
            this.array = this.rules.findAllInstancesMatching(this.searchTerm, true);
            this.subsection = this.array;
        } else {
            this.array = this.rules.getAllTopicIds();
        }
    }

    // when a rule is clicked, displays the subcategories or detailed rules that category contains
    displaySubrules(rule: string) {
        // if the main rules are currently displayed (default), and a rule is clicked, display all rules its "section" represents, show back button
        this.hideBack = false;
        if (this.array == this.rules.getAllTopicIds()) {
            // sets the back-button label
            this.currentTerm = rule;
            this.array = this.rules.getAllSubTopicIds(this.rules.getAllRules()[rule]);
            // when a section is displayed or searched, and a rule is clicked, display all rules its "subsection" represents
        } else if (this.searchReference != {}) {
            this.currentTerm = rule;
            this.array = this.rules.getRuleDetails(rule);
            this.subsection = this.array;
        }
    }

    // resets the array to default main rules categories, hides back button
    resetArrayDefault() {
        this.array = this.rules.getAllTopicIds();
        this.hideBack = true;
    }

    // determines whether the array is currently displaying "subsection" rules or not
    isSubsecRule() {
        if (this.array == this.subsection) {
            return true;
        } else {
            return false;
        }
    }
}
