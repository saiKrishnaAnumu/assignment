import { Component, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
@Injectable()
export class AppComponent {
  searchterm:string = '';
  result:string = '';
  testArray:any=  ["test1", "test2", "test3"];

  constructor(private http: HttpClient) { }

  search() {
    if(this.testArray.includes(this.searchterm)){

      this.result = "found static data: " + this.searchterm;
    } else if(this.searchterm) {  
      this.callApi().subscribe((data) =>  {
        this.result = "data not found result from API: " + data;
    })
    }
  }

  callApi(){
    let userid = this.getRandom(10);
    let url = 'https://reqres.in/api/users/' + userid;
    return  this.http.get<any>(url).pipe(
      map(response => (response.data.first_name),
      catchError((err) => {
        console.error(err);
        return throwError(err); 
      })
      ))
  }

  getRandom(max:number) {
    return Math.floor(Math.random() * max);
  }
}
