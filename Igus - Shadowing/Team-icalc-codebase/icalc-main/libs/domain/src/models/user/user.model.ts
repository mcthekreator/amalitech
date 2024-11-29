export interface PublicIcalcUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  creationDate: Date;
  modificationDate: Date;
  role: string;
}

export interface IcalcUser extends PublicIcalcUser {
  hash?: string;
  hastRt?: string;
}
