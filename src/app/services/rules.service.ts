interface RuleSection {
    ruleSection: string[];
    subsections: RuleSubsection[];
}

interface RuleSubsection {
    String: string[];
    rules: string[];
}

import { Injectable, SystemJsNgModuleLoader, ɵConsole } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import rules from './rules_txt';
import { JsonpClientBackend } from '@angular/common/http';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Injectable({ providedIn: 'root' })
export class RulesService {
    // component_name: any;
    // subsection: RuleSubsection;
    // section: RuleSection;
    searchReference;
    mainRules: string[];
    glossary: string;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        public loadingController: LoadingController
    ) {
        this.mainRules = Object.keys(rules);
        this.searchReference = {};

        // by default glossary is currently this.mainRules[9] but in case the order ever changes this will ensure it continues to work
        for (let i = 0; i < this.mainRules.length; i++) {
            if (this.mainRules[i].toLowerCase() == 'glossary') {
                this.glossary = this.mainRules[i];
            }
        }
    }

    // returns all subrules matching a given term
    getAllRulesMatching(searchTerm) {
        if (searchTerm == null || searchTerm == '') {
            return this.mainRules;
        } else {
            // this.array = ['Loading...'];

            let temp = [];
            Object.keys(rules).forEach((key) => {
                let subrule = rules[key];
                Object.keys(subrule).forEach((subkey) => {
                    let detail = rules[key][subkey];
                    let added = false;
                    if (typeof detail !== 'object') {
                        detail = [detail];
                    }

                    detail.forEach((explanation) => {
                        if (explanation.toLowerCase().search(searchTerm) !== -1 && !added) {
                            temp.push(subkey);
                            this.searchReference[subkey] = key;
                            added = true;
                        }
                    });
                });
            });

            if (temp.length >= 1) {
                return temp;
            } else {
                return ['No results found :('];
            }
        }
    }

    getRuleSecById(sectionrule) {
        return Object.keys(rules[sectionrule]);
    }

    getRuleSubSecById(sectionrule, rule) {
        let subsection = rules[sectionrule][rule];
        if (typeof subsection === 'string') {
            subsection = [subsection];
        }
        return subsection;
    }

    // determine if a given rule is numeric or a glossary term
    isRule(ruleToCheck) {
        return this.isNumeric(ruleToCheck.substring(0, 2));
    }

    isNumeric(value) {
        return /^-{0,1}\d+$/.test(value);
    }
}
