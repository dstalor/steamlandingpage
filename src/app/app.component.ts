import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

const key = 'DAE8411586FA4F067901D996D587E20A';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'steamlandingpage';
  userName = '';
  userId = '';

  constructor(private http: HttpClient, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      console.log(params);
      this.userId = params['id'];
      this.userName = params['name'];

      if (!this.userId) {
        this.http
          .get<any>(
            `http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/`,
            {
              params: {
                key,
                vanityurl: this.userName,
              },
            }
          )
          .subscribe((data) => {
            console.log(data);

            this.userId = data.response?.steamid;
          });
      }
    });
  }
}
