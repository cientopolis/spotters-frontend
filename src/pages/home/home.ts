import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { CurrentLocationService } from '../../utils/currentLocation.service';
import { NewsProvider } from '../../providers/news.provider'
import { Configuration } from '../../models/configuration'
import { News } from '../../models/news'
import _ from 'lodash';

@Component({
  templateUrl: 'home.html',
  providers: [NewsProvider],
})
export class HomePage implements OnInit {
  news: News[] = [];
  configuration: Configuration = null;
  errorMessage: string = '';

  constructor(public navCtrl: NavController, private newsProvider: NewsProvider, private currentLocation: CurrentLocationService) {
    this.currentLocation.configuration$.subscribe(
      c => {
        if (!_.isNil(c)) {
          this.configuration = c;
        }
      });
  }

  getNews(): void {
    this.newsProvider.getAll().subscribe(
      n => this.news = n,
      e => this.errorMessage = e);
  }

  ngOnInit(): void {
    this.getNews();
  }
}