import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, take } from 'rxjs';

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
  userName = new Subject<string>();
  userId = new Subject<string>();
  gameData = new Subject();

  constructor(private http: HttpClient, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      console.log(params);
      this.userId.next(params['id']);
      this.userName.next(params['name']);

      if (!params['id']) {
        this.http
          .get<any>(
            `https://api.steampowered.com/ISteamUser/${api.vanityURL}`,
            { params: { key, vanityurl: params['name'] } }
          )
          .pipe(take(1))
          .subscribe((data) => {
            console.log(data);
            this.userId.next(data.response?.steamid);
          });
      }
    });

    this.userId.subscribe((id) => {
      this.http
      .get<any>(
        `https://api.steampowered.com/ISteamUser/${api.playerSummaries}`,
        { params: { key, steamids: id } }
      )
      .pipe(take(1))
      .subscribe((data) => {
        console.log(data);
        this.gameData.next(data.response?.players[0]);
      });

    })
  }
}
