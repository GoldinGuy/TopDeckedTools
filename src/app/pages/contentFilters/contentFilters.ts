import { Component, ViewChild } from '@angular/core';
import { NavController, IonInfiniteScroll } from '@ionic/angular';
// import { ContentFiltersService } from "../../services/categoty.service";
import { NavigationExtras } from '@angular/router';
import { ConfigData } from '../../services/config';
import { DomSanitizer } from '@angular/platform-browser';
import { Storage } from '@ionic/storage';

@Component({
    selector: 'page-contentFilters',
    templateUrl: 'contentFilters.html',
    styleUrls: ['contentFilters.scss']
    // providers: [ContentFiltersService]
})
export class ContentFiltersPage {
    filter = [];

    filterstorage = [
        {
            name: 'Wizards',
            url: '/assets/imgs/logos/wizards.jpg',
            isChecked: true
        },
        {
            name: 'MTGGoldfish',
            url: '/assets/imgs/logos/mtggoldfish.jpg',
            isChecked: true
        },

        {
            name: 'Channel Fireball',
            url: '/assets/imgs/logos/channelfireball.jpg',
            isChecked: true
        },
        {
            name: 'TCGPlayer',
            url: '/assets/imgs/logos/tcgplayer.jpg',
            isChecked: true
        },
        {
            name: 'Star City Games',
            url: '/assets/imgs/logos/starcitygames.jpg',
            isChecked: true
        },
        {
            name: 'Cool Stuff Inc',
            url: '/assets/imgs/logos/coolstuffinc.jpg',
            isChecked: true
        },
        {
            name: 'Hipsters of the Coast',
            url: '/assets/imgs/logos/hipsters_of_the_coast.jpg',
            isChecked: true
        },
        {
            name: 'EDHREC',
            url: '/assets/imgs/logos/edhrec.jpg',
            isChecked: true
        },
        // {
        //     name: 'Tolarian Community College',
        //     url: 'assets/imgs/logos/tolarian.jpg',
        //     isChecked: true
        // },
        // {
        //     name: 'The Command Zone',
        //     url: '/assets/imgs/logos/commandzone.jpg',
        //     isChecked: true
        // },
        // {
        //     name: 'The Mana Source',
        //     url: '/assets/imgs/logos/manasource.jpg',
        //     isChecked: true
        // },
        // {
        //     name: 'Rhystic Studies',
        //     url: '/assets/imgs/logos/rhystic.jpg',
        //     isChecked: true
        // },
        {
            name: 'Card Kingdom',
            url: '/assets/imgs/logos/card_kingdom.jpg',
            isChecked: true
        }
        // {
        //     name: 'Alpha Investments',
        //     url: '/assets/imgs/logos/alphainvestments.jpg',
        //     isChecked: true
        // },
        // {
        //     name: 'SB MTG',
        //     url: '/assets/imgs/logos/sbmtg.jpg',
        //     isChecked: true
        // }
    ];

    display: 'row';
    status;

    constructor(
        public navCtrl: NavController,
        private storage: Storage,
        private domSanitizer: DomSanitizer
    ) {}

    async ngAfterViewInit() {
        this.status = 'Scrying...';
        let array = await Promise.all([this.storage.get('filters'), this.storage.get('display')]);
        this.filter = array[0] || this.filterstorage;
        this.display = array[1];
        this.status = '';
        console.log(this.display);
    }

    async searchChanged() {
        console.log('what');
        await Promise.all([
            this.storage.set('filters', this.filter),
            this.storage.set('time', new Date().getTime())
        ]);
    }

    async row(val) {
        await this.storage.set('row', val);
    }

    // async set(display, value) {
    //     await this.storage.set('display', value);
    //     console.log(value);
    // }

    // async set(value) {
    //     localStorage.setItem('display', 'value');
    //     console.log(value);
    // }
    // async set(value) {
    //     localStorage.set('display', 'value');
    //     console.log(value);
    // }

    public set(display, value) {
        console.log(value);
        value;
        return this.storage.set(`setting:${display}`, value);
    }

    public async get(display) {
        // console.log(value);
        return await this.storage.get(`setting:${display}`);
    }
}
