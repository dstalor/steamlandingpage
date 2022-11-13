import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  BehaviorSubject,
  distinct,
  distinctUntilChanged,
  distinctUntilKeyChanged,
  ReplaySubject,
  take,
} from 'rxjs';
import { Player } from './core/models/player.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'steamlandingpage';
  player$ = new BehaviorSubject<Player>({});
  game$ = new BehaviorSubject<any>({});
  searchPrefix = '';
  searchText = '';

  constructor(private http: HttpClient, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.player$.next({
        ...this.player$.getValue(),
        steamid: params['id'],
        personaname: params['name'],
      });
    });

    this.player$
      .pipe(
        distinctUntilChanged(
          (prev, curr) =>
            prev &&
            prev?.steamid === curr.steamid &&
            prev?.personaname === curr.personaname
        )
      )

      .subscribe((player) => {
        if (!player.steamid && player.personaname) {
          this.http
            .post<any>('https://daniel.talor.me/steamlink.php', {
              interface: 'ISteamUser',
              method: 'ResolveVanityURL',
              version: 'v1',
              vanityurl: player.personaname,
            })
            .pipe(take(1))
            .subscribe((data) => {
              console.log(data);
              const steamid = data.response?.steamid;
              this.player$.next({ ...this.player$.getValue(), steamid });
            });
        } else if (player.steamid) {
          this.http
            .post<any>('https://daniel.talor.me/steamlink.php', {
              interface: 'ISteamUser',
              method: 'GetPlayerSummaries',
              version: 'v2',
              steamids: player.steamid,
            })
            .pipe(take(1))
            .subscribe((data) => {
              console.log(data);
              this.player$.next(data.response?.players[0]);
              this.searchPrefix = data.response?.players[0].gameextrainfo;
            });
        }
      });
    this.player$.pipe(distinctUntilKeyChanged('gameid')).subscribe((player) => {
      if (player.gameid) {
        this.http
          .post<any>('https://daniel.talor.me/steamlink.php', {
            interface: 'IPlayerService',
            method: 'GetRecentlyPlayedGames',
            version: 'v1',
            steamid: player.steamid,
            count: 1,
          })
          .pipe(take(1))
          .subscribe((data) => {
            console.log(data);
            this.game$.next(data.response?.games[0]);
          });
      }
    });
  }

  doSearch(ev:any) {
    console.log(ev);

    // window.open(url, "_blank");
  }
}
