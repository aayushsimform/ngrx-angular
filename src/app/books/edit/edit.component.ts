import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { switchMap } from 'rxjs';
import { setAPIStatus } from 'src/app/shared/app.action';
import { selectAppState } from 'src/app/shared/app.selector';
import { Appstate } from 'src/app/shared/appstate';
import { Books } from '../store/books';
import { invokeUpdateBookAPI } from '../store/books.action';
import { selectBooksById } from '../store/books.selector';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router:Router,
    private appStore:Store<Appstate>,
    private store:Store
  ){}

  bookForm:Books = {
    id: 0 ,
    author : '',
    name: '',
    cost : 0
  }
  ngOnInit(): void {
    let fethchData$ = this.route.paramMap.pipe(
      switchMap((params)=>{
            var id = Number(params.get('id'));
            return this.store.pipe(select(selectBooksById(id)));
      })
    );

    fethchData$.subscribe((data)=>{
      if (data) {
        this.bookForm = { ...data};
        
      } else {
        this.router.navigate(['/']);
      }
    });
    
  }

  udapte() {
    this.store.dispatch(
      invokeUpdateBookAPI({ updateBook: { ...this.bookForm } })
    );
    let apiStatus$ = this.appStore.pipe(select(selectAppState));
    apiStatus$.subscribe((apState) => {
      if (apState.apiStatus == 'success') {
        this.appStore.dispatch(
          setAPIStatus({ apiStatus: { apiResponseMessage: '', apiStatus: '' } })
        );
        this.router.navigate(['/']);
      }
    });
  }
   
}
