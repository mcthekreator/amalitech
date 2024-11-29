import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AddAnimal, GetAnimal } from '../../../store/animal.actions';
import { select, Store } from '@ngxs/store';
import { ZooState } from '../../../store/animal.state';
import { AnimalGet } from '../../../model/AnimalGet.model';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  public loginForm: FormGroup;
  private fb = inject(FormBuilder)
  private router = inject(Router)
  private store = inject(Store)

  constructor() {
    this.loginForm = this.fb.group({
      email: [''],
      password: ['']
    });
  }

  ngOnInit(): void {
    this.login()
    // this.getAnimal()

  }

  public login(): void {
    let loginData = this.loginForm.value;
    console.log(loginData);
    this.store.dispatch(new AddAnimal(loginData))
    this.router.navigate(['/home'])
  }



//   @select(ZooState.getAnimalSelector) getAnimalOb$: Observable<AnimalGet[]>
//   public getAnimal() {
//     this.store.dispatch(new GetAnimal())
//     this.getAnimaalOb$?.subscribe((res:any) =>{
//       console.log(res);
      

//     })
  }
