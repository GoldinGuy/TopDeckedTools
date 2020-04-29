import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import rules from '../rules_txt';

@Component({
    selector: 'app-details',
    templateUrl: 'details.html',
    styleUrls: ['details.scss']
})
export class DetailsPage {
    page_name: any;
    page_path: any;
    component_name: any;

    subsection;
    section;
    detail;

    constructor(private router: Router, public route: ActivatedRoute) {
        if (this.router.getCurrentNavigation().extras.state) {
            this.section = this.router.getCurrentNavigation().extras.state.rule;
            this.subsection = this.router.getCurrentNavigation().extras.state.section;
            this.detail = rules[this.section][this.subsection];
            if (typeof this.detail === 'string') {
                this.detail = [this.detail];
            }
        }
    }

    ngOnInit() {}

    isRule(ruleToCheck) {
        return this.isNumeric(ruleToCheck.substring(0, 1));
    }

    isNumeric(value) {
        return /^-{0,1}\d+$/.test(value);
    }
}
