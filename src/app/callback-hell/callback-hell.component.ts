import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-callback-hell',
  templateUrl: './callback-hell.component.html',
  styleUrls: ['./callback-hell.component.css']
})
export class CallbackHellComponent implements OnInit {
  matProgressBar1:boolean  = false;
  matProgressBar2:boolean  = false;
  status:string = '';
  status1:string = '';
  constructor(private http: HttpClient) { }

  ngOnInit(): void {
  }

  callBackHell(){
    this.matProgressBar1 = true;
    this.getUser().subscribe((data) =>  {
      this.status = 'got the user';
      this.createUser().subscribe((user) => {
        this.status = 'new user created';
       this.deleteUser(user.id).subscribe((res) =>  {
        this.status = 'deleted user';
        this.matProgressBar1 = false;
         console.log(res);

       })
      })
      
  }, error => {
    if(error && error.status===404){
      this.matProgressBar1 = false;
      this.status = 'user not found';
       console.log('user not found');
      }
})
  }


  ngrxMethod(){
    this.matProgressBar2 = true;
    const getuser$ =  this.getUser().pipe(
      switchMap(data => {
        this.status1 = 'got the user';
        return this.createUser();
    })
    );
    const createUser$ =  getuser$.pipe(
      switchMap(user => {
        this.status1 = 'new user created';
        return this.deleteUser(user.id);
    })
    )
    createUser$.subscribe(
      res => {
        this.status1 = 'deleted user';
        this.matProgressBar2 = false;
        console.log(res);
      },
      error =>{
        this.matProgressBar2 = false;
        this.status1 = 'user not found';
        console.log('user not found');
      }
  );

  }

  getUser(){
    let userid = this.getRandom(10);
    let url = 'https://reqres.in/api/users/' + userid;
    return  this.http.get<any>(url).pipe(
      map(response => (response.data.first_name)
      ),
      catchError((err) => {
        console.error(err);
        return throwError(err); 
      })
      )
  }
  createUser(){
    let url = 'https://reqres.in/api/users/';
    return  this.http.post<any>(url,{ "name": "test",
    "job": "test"});
  }
  deleteUser(userid:any){
    let url = 'https://reqres.in/api/users/' + userid;
    return  this.http.delete<any>(url,{});
  }
  getRandom(max:number) {
    return Math.floor(Math.random() * max);
  }

}
