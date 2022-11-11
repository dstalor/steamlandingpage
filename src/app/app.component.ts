import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReplaySubject, Subject, take } from 'rxjs';

const key = '366A3809CC9855BE0B939783903DBD5A';
const api = {
  vanityURL: 'ResolveVanityURL/v0001/',
  playerSummaries: 'GetPlayerSummaries/v0002/',
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'steamlandingpage';
  userName$ = new ReplaySubject<string>();
  _userName = '';
  userId$ = new ReplaySubject<string>();
  _userId = '';
  gameData = new ReplaySubject();

  constructor(private http: HttpClient, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      console.log(params);
      this.userId$.next(params['id']);
      this.userName$.next(params['name']);
    });

    this.userName$.subscribe((name) => {
      this._userName = name;
      if (!this._userId) {
        this.http
          .get<any>(
            `//api.steampowered.com/ISteamUser/${api.vanityURL}`,
            { params: { key, vanityurl: name } }
          )
          .pipe(take(1))
          .subscribe((data) => {
            console.log(data);
            this.userId$.next(data.response?.steamid);
          });
      }
    });
    this.userId$.subscribe((id) => {
      this._userId = id;
      this.http
        .get<any>(
          `//api.steampowered.com/ISteamUser/${api.playerSummaries}`,
          { params: { key, steamids: id } }
        )
        .pipe(take(1))
        .subscribe((data) => {
          console.log(data);
          this.gameData.next(data.response?.players[0]);
        });
    });
  }
}
