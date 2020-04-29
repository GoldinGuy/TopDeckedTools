import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-recent-news',
  templateUrl: 'recent-news.html',
  styleUrls: ['recent-news.scss'],
})
export class RecentNewsPage {
  title: any;
  categoryId:any;

  constructor(public navCtrl: NavController, private route: ActivatedRoute) {
      let self = this;
      this.route.queryParams.subscribe(params => {
          self.categoryId = JSON.parse(params['id']);
      });
  }
}
