import { Action, Selector, State, StateContext } from "@ngxs/store";
import { AnimalAdd, AnimalGet } from "../model/AnimalGet.model";
import { inject, Injectable } from "@angular/core";
import { GetAnimal } from "./animal.actions";
import { ApiService } from "../apiService/api.service";
import { tap } from "rxjs";

export interface ZooStateModel {
    GetAnimal: AnimalGet[]
    AddAnimal: AnimalAdd[]
}

@State<ZooStateModel>({
    name: "Zoo",
    defaults: {
        GetAnimal: [],
        AddAnimal: []
    }
})

@Injectable()
export class ZooState {
    private apiService = inject(ApiService)
    @Selector()
    static getAnimals(state: ZooStateModel): AnimalGet[] {
        return state.GetAnimal
    }
    @Action(GetAnimal)
    getAnimalStateAction(ctx: StateContext<ZooStateModel>) {
        return this.apiService.getPosts().pipe(tap((res: any) => {
            const state = ctx.getState();
            ctx.setState({
                ...state,
                GetAnimal: res
            })
        }))
    }
}


@Injectable()
export class UserState{
}

