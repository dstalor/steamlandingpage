export interface Player {
  steamid?: string;
  communityvisibilitystate?: number;
  profilestate?: number;
  personaname?: string;
  profileurl?: string | URL;
  avatar?: string | URL;
  avatarmedium?: string | URL;
  avatarfull?: string | URL;
  avatarhash?: string;
  lastlogoff?: number;
  personastate?: number;
  realname?: string;
  primaryclanid?: string;
  timecreated?: number;
  personastateflags?: number;
  gameextrainfo?: string;
  gameid?: string;
  loccountrycode?: string;
}
