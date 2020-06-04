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
        this.hideBack = true;
        this.array = this.rules.mainRules;
    }
    public searchTerm: string;
    public searching;
    public searchReference;
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
            this.array = this.rules.getAllRulesMatching(this.searchTerm);
        } else {
            this.array = this.rules.mainRules;
        }
    }

    // when a rule is clicked, displays the subcategories or detailed rules that category contains
    displaySubrules(rule) {
        // if the main rules are currently displayed (default), and a rule is clicked, display all rules its "section" represents, show back button
        this.hideBack = false;
        if (this.array == this.rules.mainRules) {
            this.array = this.rules.getRuleSecById(rule);
            // sets the back-button label
            this.currentTerm = rule;
            // when a section is displayed or searched, and a rule is clicked, display all rules its "subsection" represents
        } else if (this.searchReference != {}) {
            // set sectionrule to glossary by default
            this.sectionrule = this.rules.glossary;
            // if not glossary, set sectionrule to appropriate section
            for (let i = 0; i < this.rules.mainRules.length; i++) {
                if (this.rules.mainRules[i].startsWith(rule.substring(0, 1))) {
                    this.sectionrule = this.rules.mainRules[i];
                }
            }
            this.array = this.rules.getRuleSubSecById(this.sectionrule, rule);
            this.subsection = this.array;
            this.currentTerm = rule;
        }
    }

    // resets the array to default main rules categories, hides back button
    returnMainRules() {
        this.array = this.rules.mainRules;
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
