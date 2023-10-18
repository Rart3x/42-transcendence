export class CreateGameRoomDTO {
  constructor(gameRoomData: Partial<CreateGameRoomDTO>) {
    Object.assign(this, gameRoomData);
  }
}

