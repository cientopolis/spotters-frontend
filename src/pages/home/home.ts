import { Component, OnInit } from '@angular/core';
import { NewsProvider } from '../../providers/news.provider'
import { News } from '../../models/news'
import { NavController } from 'ionic-angular';

@Component({
  templateUrl: 'home.html',
  providers: [NewsProvider],
})
export class HomePage implements OnInit {
  news: News[];
  errorMessage: string = '';

  constructor(public navCtrl: NavController, private newsProvider: NewsProvider) {

  }

  getNews(): void {
    this.newsProvider.getAll().subscribe(
         /* happy path */ n => this.news = n,
         /* error path */ e => this.errorMessage = e);
  }

  ngOnInit(): void {
    this.getNews();
  }
}