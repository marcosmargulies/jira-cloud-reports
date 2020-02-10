export class Profile {
  self: string;
  key: string;
  accountId: string;
  name: string[];
  emailAddress: string;
  avatarUrls: string[];
  displayName: string;
  active: boolean;
  timeZone: string;
  locale: string;
  // groups: {size: 4, items: []}
  // applicationRoles: {size: 1, items: []}
  expand: string;
}
