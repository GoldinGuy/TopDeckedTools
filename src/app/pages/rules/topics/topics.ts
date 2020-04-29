import { Component } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import rules from '../rules_txt';

@Component({
    selector: 'app-topics',
    templateUrl: 'topics.html',
    styleUrls: ['topics.scss']
})
export class TopicsPage {
    page_name: any;
    page_path: any;
    component_name: any;

    subsection;
    section;

    constructor(private router: Router, public route: ActivatedRoute) {
        if (this.router.getCurrentNavigation().extras.state) {
            this.section = this.router.getCurrentNavigation().extras.state.rule;
            this.subsection = Object.keys(rules[this.section]);
        }
    }

    nav(rule) {
        let navigationExtras: NavigationExtras = {
            state: { rule: this.section, section: rule }
        };
        this.router.navigate(['/tabs/rules/details'], navigationExtras);
    }

    ngOnInit() {}
}
