export class GetUserNotificationsQuery {
  constructor(public readonly userId: string) {}
}

export class GetUnreadNotificationsQuery {
  constructor(public readonly userId: string) {}
}
