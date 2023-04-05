import { createReducer, on } from "@ngrx/store";
import { Books } from "../store/books";
import { booksFetchAPISuccess, saveDeleteAPISucess, saveNewBookAPISucess, saveNewUpdateAPISucess } from "./books.action";
 
export const initialState: ReadonlyArray<Books> = [];
 
export const bookReducer = createReducer(
    initialState,
    on(booksFetchAPISuccess,(state,{allBooks})=>{
        return allBooks;
    }),
    on(saveNewBookAPISucess, (state, { newBook }) => {
        let newState = [...state];
        newState.unshift(newBook);
        return newState;
      }),
    on(saveNewUpdateAPISucess,(state,{updateBook})=>{
        let newState = state.filter((_) => _.id != updateBook.id);
        newState.unshift(updateBook);
        return newState;
 
    }),
    on(saveDeleteAPISucess,(state,{id})=>{
        let newState = state.filter((_)=> _.id ! = id );
        return newState;
    }
    )
    
);