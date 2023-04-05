import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { EMPTY, map, mergeMap, switchMap, withLatestFrom } from 'rxjs';
import { setAPIStatus } from '../../shared/app.action';
import { Appstate } from '../../shared/appstate';
import { BooksService } from '../books.service';
import {
  booksFetchAPISuccess,
  invokeBooksAPI,
  invokeDeleteBookAPI,
  invokeSaveNewBookAPI,
  invokeUpdateBookAPI,
  saveDeleteAPISucess,
  saveNewBookAPISucess,
  saveNewUpdateAPISucess,
} from './books.action';
import { selectBooks } from './books.selector';

@Injectable()
export class BooksEffect {
  constructor(
    private actions$: Actions,
    private booksService: BooksService,
    private store: Store,
    private appStore: Store<Appstate>
  ) { }

  // existing code hidden for display purpose
  loadAllBooks$ = createEffect(() =>
    this.actions$.pipe(
      ofType(invokeBooksAPI),
      withLatestFrom(this.store.pipe(select(selectBooks))),
      mergeMap(([, bookformStore]) => {
        if (bookformStore.length < 0) {
          return EMPTY;
        }
        return this.booksService
          .get()
          .pipe(map((data) => booksFetchAPISuccess({ allBooks: data })));
      })
    )
  );
  saveNewBook$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(invokeSaveNewBookAPI),
      switchMap((action) => {
        this.appStore.dispatch(
          setAPIStatus({ apiStatus: { apiResponseMessage: '', apiStatus: '' } })
        );
        return this.booksService.create(action.newBook).pipe(
          map((data) => {
            this.appStore.dispatch(
              setAPIStatus({
                apiStatus: { apiResponseMessage: '', apiStatus: 'success' },
              })
            );
            return saveNewBookAPISucess({ newBook: data });
          })
        );
      })
    );
  });
  updateBookAPI$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(invokeUpdateBookAPI),
      switchMap((action) => {
        this.appStore.dispatch(
          setAPIStatus({ apiStatus: { apiResponseMessage: '', apiStatus: ' ' } })
        );
        return this.booksService.update(action.updateBook).pipe(
          map((data) => {
            this.appStore.dispatch(
              setAPIStatus({
                apiStatus: { apiResponseMessage: '', apiStatus: 'success' },
              })
            );
            return saveNewUpdateAPISucess({ updateBook: data });
          })
        )

      })
    )
  });

  deleteBookAPI$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(invokeDeleteBookAPI),
      switchMap((action) => {
        this.appStore.dispatch(
          setAPIStatus({ apiStatus: { apiResponseMessage: '', apiStatus: ' ' } })
        );
        return this.booksService.delete(action.id).pipe(
          map(() => {
            this.appStore.dispatch(
              setAPIStatus({
                apiStatus: { apiResponseMessage: '', apiStatus: 'success' }
              })
            )
            return saveDeleteAPISucess({ id: action.id })
          })
        )
      })
    );
  });
}