import { Component, OnInit } from '@angular/core';
import { NewsService } from './news.service'
import { News } from './news'

import { NavController } from 'ionic-angular';

@Component({
  templateUrl: 'home.html',
  providers: [NewsService],
})
export class HomePage implements OnInit {
  news: News[];
  errorMessage: string = '';

  constructor(public navCtrl: NavController, private newsService: NewsService) {

  }

  getNews(): void {
    this.newsService.getAll().subscribe(
         /* happy path */ n => this.news = n,
         /* error path */ e => this.errorMessage = e);
  }

  ngOnInit(): void {
    this.getNews();
  }
}