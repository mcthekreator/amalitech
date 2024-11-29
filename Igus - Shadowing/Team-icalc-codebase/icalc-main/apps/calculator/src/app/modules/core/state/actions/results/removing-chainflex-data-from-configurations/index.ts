export class Submitted {
  public static readonly type = '[Results] RemovingChainflexDataFromConfigurations Submitted';
  constructor(public payload: string[]) {}
}
