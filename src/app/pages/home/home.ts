// import { AdMobFree } from "@ionic-native/admob-free/ngx";

import { Component, ViewChild } from '@angular/core';
import { NavController, IonInfiniteScroll, IonSlides } from '@ionic/angular';
import { CategoryService } from '../../services/categoty.service';
import { SyncService } from '../../services/sync.service';
import { UserService } from '../../services/user.service';
import { PostService } from '../../services/post.service';
import { MediaService } from '../../services/media.service';
import { NavigationExtras } from '@angular/router';
import { ConfigData } from '../../services/config';
import { DomSanitizer } from '@angular/platform-browser';
import { MenuController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
// import { Slides } from 'ionic-angular';
// import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions/ngx';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser/ngx';
// import { ContentFiltersPage } from '../contentFilters/contentFilters';
// import { VideoPlayer } from '@ionic-native/video-player/ngx';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html',
    styleUrls: ['home.scss'],
    providers: [
        CategoryService,
        UserService,
        SyncService,
        PostService,
        MediaService,
        // AdMobFree,
        InAppBrowser
    ]
})
export class HomePage {
    @ViewChild('IonInfiniteScroll', { static: true }) slides: IonSlides;
    // slides: Slides;
    // @ViewChild('slides') slides: Slides;
    infiniteScroll: IonInfiniteScroll;

    dataLoaded: Promise<boolean>;
    dataNotLoaded: Boolean;
    posts: any = [];
    postsInSlider: number;
    postsExtra: number;
    postsExtraAdd: number;
    noImageCycleCounter: number;
    noImageCycleMax: number;
    imageBaseURL: string;
    interval;
    originalposts;
    display: boolean;
    new_url: any;
    row;
    preview: any = [];
    link;
    scanning: boolean;
    videos;
    currentScreenOrientation: string;

    constructor(
        // private admobFree: AdMobFree,
        public navCtrl: NavController,
        private domSanitizer: DomSanitizer,
        private syncService: SyncService,
        private categoryService: CategoryService,
        private postService: PostService,
        private mediaService: MediaService,
        private http: HttpClient,
        private iab: InAppBrowser,
        private screenOrientation: ScreenOrientation,
        // private videoPlayer: VideoPlayer,
        // private menu: MenuController,
        private storage: Storage // private nativePageTransitions: NativePageTransitions
    ) {
        this.scanning = true;
        this.dataNotLoaded = true;
        this.postsInSlider = 0;
        this.postsExtra = 10;
        this.postsExtraAdd = 10;
        this.noImageCycleCounter = 0;
        this.noImageCycleMax = 94;
        this.imageBaseURL = 'assets/imgs/';
        this.originalposts = [];
        this.currentScreenOrientation = this.screenOrientation.type;
        // this.postPageLoaded = 1;
        // // this.showBannerAds();
        this.screenOrientation.onChange().subscribe(() => {
            alert('Orientation Changed' + this.screenOrientation.type);
            this.currentScreenOrientation = this.screenOrientation.type;
        });
    }

    setLandscape() {
        // set to landscape
        this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE);
    }

    setPortrait() {
        // set to portrait
        this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
    }

    unlockScreen() {
        // allow user rotate
        this.screenOrientation.unlock();
    }

    goBack() {
        this.navCtrl.pop();
    }

    nextSlide() {
        this.slides.slideNext();
    }

    prevSlide() {
        this.slides.slidePrev();
    }

    arrangeDisplay() {
        if (this.display == true) {
            this.display = false;
        } else {
            this.display = true;
        }
        return this.display;
    }

    getDisplay() {
        return !!this.display;
    }

    getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
    }

    // display: 'row';

    // public async get(display) {
    //     console.log('getting display' + display);
    //     return await this.storage.get(`content:${display}`);
    // }

    // openContentFilter() {
    //     this.menu.enable(true, 'contentFilter');
    //     this.menu.open('contentFilter');
    // }

    doRefresh(event) {
        console.log('Begin async operation');

        setTimeout(() => {
            console.log('Async operation has ended');
            event.target.complete();
        }, 1500);
    }

    getSelectedPosts(first) {
        var sp = []; // Selected Posts
        if (first) {
            for (let i = 0; i < this.postsInSlider; i++) {
                sp.push(this.posts[i]);
            }
        } else {
            for (
                let i = this.postsInSlider;
                i <
                (this.posts.length < this.postsInSlider + this.postsExtra
                    ? this.posts.length
                    : this.postsInSlider + this.postsExtra);
                i++
            ) {
                sp.push(this.posts[i]);
            }
        }
        return sp;
    }

    // ngOnInit() {
    //     this.http.get('https://mystic-api-test.herokuapp.com/scryfall-promo-set').subscribe(res => {
    //         this.link = res;
    //     });
    //     this.http.get('https://mystic-api-test.herokuapp.com/articles').subscribe(res => {
    //         this.posts = res;
    //         this.originalposts = res;
    //         console.log('Posts', this.posts);
    //         this.dataNotLoaded = false;
    //         this.dataLoaded = Promise.resolve(true);
    //     });

    //     this.noImageCycleCounter = Math.floor(Math.random() * (94 - 1)) + 1;
    // }

    ngOnInit() {
        this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
        this.posts = -1;
        this.dataLoaded = Promise.resolve(false);
        this.storage.get('home_posts').then(val => {
            console.log(val);
            if (this.posts === -1) {
                this.posts = val;
            }
            this.dataLoaded = Promise.resolve(true);
        });

        this.http.get('https://mystic-api-test.herokuapp.com/scryfall-promo-set').subscribe(res => {
            this.link = res;
        });
        this.http.get('https://mystic-api-test.herokuapp.com/articles').subscribe(res => {
            this.posts = res;
            this.originalposts = res;
            console.log('GET: Articles', res);

            this.http.get('https://mystic-api-test.herokuapp.com/videos').subscribe(res => {
                this.videos = [];
                for (var i = 0; i < Math.min(res['items'].length, 4); i++) {
                    // this.videos.push(res['items'][i]);
                    let item = res['items'][i];
                    item.safeUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(
                        'https://www.youtube.com/embed/' + item.snippet.resourceId.videoId
                    );
                    console.log(item.safeUrl);
                    this.videos.push(item);
                }

                console.log('GET: Videos', res);

                console.log('Unsorted', this.posts);
                // this.sortPosts(this.posts);
                // console.log('Sorted', this.posts);

                this.dataNotLoaded = false;
                this.dataLoaded = Promise.resolve(true);

                this.storage.set('home_posts', this.posts);
            });
        });

        this.noImageCycleCounter = Math.floor(Math.random() * (this.noImageCycleMax - 1)) + 1;
        setTimeout(() => {
            // this.secondnativeFunction()
            this.scanning = false;
        }, 8000);
    }

    ionViewWillEnter() {
        this.searchChanged();
        this.interval = setInterval(async () => {
            let array = await Promise.all([this.storage.get('time'), this.storage.get('last')]);
            if (array[0] !== array[1]) {
                this.searchChanged();
                await this.storage.set('last', array[0]);
            }
        }, 1);
    }

    async searchChanged() {
        console.log('Search Changed');

        this.display = await this.storage.get('row');
        let filter = await this.storage.get('filters');
        console.log(filter);

        let set = [];
        filter.forEach(element => {
            if (element.isChecked) {
                set.push(element.name.replace(/\s+/g, ''));
            }
        });
        console.log(set);
        if (set.length > 0) {
            this.posts = this.originalposts.filter(post =>
                set.includes(post.site_name.replace(/\s+/g, ''))
            );
        }
    }

    ionViewWillLeave() {
        clearInterval(this.interval);
    }

    // openFilters() {

    //     this.nativePageTransitions.slide();
    //     this.navCtrl.push(ContentFiltersPage);

    // }

    getTimeString(time) {
        var date = new Date(time);
        var now = new Date();
        var diff = Math.floor((now.getTime() - date.getTime()) / 60000);
        if (diff < 60) {
            var r = Math.ceil(diff);
            if (r <= 0) {
                return 'Just Now';
            }
            return r + ' minute' + (r == 1 ? '' : 's') + ' ago';
        } else if (diff < 60 * 24) {
            var r = Math.ceil(diff / 60);
            return r + ' hour' + (r == 1 ? '' : 's') + ' ago';
        } else {
            var r = Math.floor(diff / (60 * 24));
            return r + ' day' + (r == 1 ? '' : 's') + ' ago';
        }
    }

    getLogoURL(item) {
        var url = item.site_name;
        url = this.imageBaseURL + 'logos/' + this.replaceAll(url, ' ', '_').toLowerCase() + '.jpg';
        return url;
    }

    getImageURL(item) {
        if (item.image_url != null || item.image_url == '') {
            var url = item.image_url;
            return url;
        } else {
            this.noImageCycleCounter++;
            if (this.noImageCycleCounter > this.noImageCycleMax) {
                this.noImageCycleCounter = 1;
            }
            var urlA = this.imageBaseURL + 'grid/grid' + this.noImageCycleCounter + '.JPG';
            item.image_url = urlA;
            return urlA;
        }
    }

    // next() {
    //     this.slides.slideNext();
    // }

    // prev() {
    //     this.slides.slidePrev();
    // }

    getPreviewsImageURL() {
        return '/assets/imgs/cards2.jpg';
    }

    getEventsImageURL() {
        return '/assets/imgs/events.jpg';
    }

    getAdImageURL() {
        return '/assets/imgs/ad2.jpg';
    }

    replaceAll(str, find, replace) {
        return str.replace(new RegExp(find, 'g'), replace);
    }

    // showBannerAds() {
    //   if (!ConfigData.bannerAds.enable) {
    //     return;
    //   }
    //   this.admobFree.banner.config(ConfigData.bannerAds.config);
    //   this.admobFree.banner.prepare();
    // }

    getHtmlTitle(title) {
        if (title) {
            return this.domSanitizer.bypassSecurityTrustHtml(title);
        }
    }

    doInfinite(event) {
        if (this.postsExtra + this.postsExtraAdd > this.posts.length - this.postsInSlider) {
            this.postsExtra = this.posts.length - this.postsInSlider;
        } else {
            this.postsExtra += this.postsExtraAdd;
        }
        event.target.complete();
    }

    // socialShare(item) {
    //     var options = {
    //         message: item.title, // not supported on some apps (Facebook, Instagram)
    //         subject: item.title, // fi. for email
    //         url: item.url,
    //         chooserTitle: 'Choose an App' // Android only, you can override the default share sheet title,
    //     };

    //     var onSuccess = function(result) {
    //         console.log('Share completed? ' + result.completed); // On Android apps mostly return false even while it's true
    //         console.log('Shared to app: ' + result.app); // On Android result.app since plugin version 5.4.0 this is no longer empty. On iOS it's empty when sharing is cancelled (result.completed=false)
    //     };

    //     var onError = function(msg) {
    //         console.log('Sharing failed with message: ' + msg);
    //     };

    //     window.plugins.socialsharing.shareWithOptions(options, onSuccess, onError);
    // }

    openPost(item) {
        var new_url = item.url;
        if (!item.url.includes('https')) {
            if (item.url.includes('http')) {
                new_url = new_url.replace('http', 'https');
            }
        }

        // var options =
        //     'zoom=no,location=yes,hideurlbar=yes,presentationstyle=pagesheet,shouldPauseOnSuspend=yes,allowInlineMediaPlayback=yes,enableViewportScale=yes,toolbarcolor=#d9d9d9,closebuttoncolor=#444444,navigationbuttoncolor=#444444';
        var options =
            'zoom=no,location=yes,hideurlbar=yes,presentationstyle=pagesheet,shouldPauseOnSuspend=yes,allowInlineMediaPlayback=yes,enableViewportScale=yes,toolbarcolor=#1e1e2f,hidenavigationbuttons=yes,closebuttoncolor=#eeeeee,navigationbuttoncolor=#eeeeee';
        this.iab.create(new_url, `_blank`, options);
        // this.iab.create(new_url, `_blank`, {
        //     enableViewportScale: 'yes',
        //     zoom: 'no',
        //     hideurlbar: 'yes',
        //     presentationstyle: 'pagesheet',
        //     shouldPauseOnSuspend: 'yes',
        //     allowInlineMediaPlayback: 'yes'
        // });

        // this.iab.create(item.url, `_blank`, options);
        // var options = 'location=yes,hidden=yes,hideurlbar=yes,presentationstyle=pagesheet';
        // var ref = cordova.InAppBrowser.open(item.url, '_blank', options);
        // ref.show();

        // const navigationExtras: NavigationExtras = {
        //   queryParams: { item: JSON.stringify(item) }
        // };
        // this.navCtrl.navigateForward(["/single-page"], navigationExtras);
        // const options: InAppBrowserOptions = {
        //     zoom: 'no',
        //     hidenavigationbuttons: 'yes',
        //     hideurlbar: 'yes',
        //     toolbar: 'yes',
        //     presentationstyle: 'pagesheet',
        //     toolbarcolor: '#5e548e'
        // };

        // const browser = this.iab.create(item.url, '_self', options);
        // const browser = this.iab.create(item.url, '_blank', options);
    }

    // openPreviews() {
    //     this.http.get('https://mystic-api-test.herokuapp.com/scryfall-promo-set').subscribe(res => {
    //         this.preview = res;
    //     });
    //     var options =
    //         'zoom=no,location=yes,hideurlbar=yes,presentationstyle=pagesheet,shouldPauseOnSuspend=yes,allowInlineMediaPlayback=yes,enableViewportScale=yes';
    //     this.iab.create(preview(1).url, `_blank`, options);
    // }

    openPreviews() {
        var options =
            'zoom=no,location=yes,hideurlbar=yes,presentationstyle=pagesheet,shouldPauseOnSuspend=yes,allowInlineMediaPlayback=yes,enableViewportScale=yes';
        this.iab.create(this.link.url, `_blank`, options);
    }

    openResults() {
        var options =
            'zoom=no,location=yes,hideurlbar=yes,presentationstyle=pagesheet,shouldPauseOnSuspend=yes,allowInlineMediaPlayback=yes,enableViewportScale=yes';
        this.iab.create('https://www.mtggoldfish.com/tournaments/all#paper', `_blank`, options);
    }

    openAd() {
        var options =
            'zoom=no,location=yes,hideurlbar=yes,presentationstyle=pagesheet,shouldPauseOnSuspend=yes,allowInlineMediaPlayback=yes,enableViewportScale=yes';
        this.iab.create(
            'https://store.tcgplayer.com/massentry?partner=MTGMystic&utm_campaign=affiliate&utm_medium=MTGMystic&utm_source=MTGMystic',
            `_blank`,
            options
        );
    }

    // get() {
    //     let display = localStorage.getItem('display');
    //     if (display == null) {
    //         display = 'grid';
    //     }
    //     console.log('getting display' + display);
    // }

    //     public async get(display) {
    //         // console.log(value);
    //         return await this.storage.get(`setting:${display}`);
    //     }
    // }
}
