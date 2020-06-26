import { RulesService } from 'src/app/services/rules.service';

import { Component } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Component({
    selector: 'page-rules',
    templateUrl: 'rules.html',
    styleUrls: ['rules.scss'],
})
export class RulesPage {
    constructor(
        public rules: RulesService,
        public loadingController: LoadingController
    ) {
        (this.searching = false), (this.hideBack = true);
        this.array = this.rules.getAllTopicIds();
    }

    searchTerm: string;
    searching: boolean;
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
        // if the main rules are currently displayed (default), and a rule is clicked,
        // display all rules its "section" represents, show back button
        this.hideBack = false;
        if (this.array === this.rules.getAllTopicIds()) {
            // sets the back-button label
            this.currentTerm = rule;
            this.array = this.rules.getAllSubTopicIds(this.rules.getAllRules()[rule]);
            // when a section is displayed or searched, and a rule is clicked, display all rules its "subsection" represents
        } else {
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
    isDisplayingSubsection(array: any[]) {
        if (array === this.subsection) {
            return true;
        } else {
            return false;
        }
    }
}
