import type { IcalcUser, PublicIcalcUser } from './user.model';

export class UserMapper {
  public static toPublicUser(user: IcalcUser): PublicIcalcUser {
    const { id, email, firstName, lastName, creationDate, modificationDate, role } = user;

    return {
      id,
      email,
      firstName,
      lastName,
      creationDate,
      modificationDate,
      role,
    };
  }

  public static toUserName({ firstName, lastName }: IcalcUser): string {
    return `${firstName} ${lastName}`;
  }
}
