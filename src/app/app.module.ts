import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';

import { FormsModule } from '@angular/forms';  //<<<< import it here


import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore'; 
import { AngularFireStorageModule } from 'angularfire2/storage';
import { environment } from '../environments/environment';

import { NgxSpinnerModule } from 'ngx-spinner';

import { AngularFireDatabaseModule  } from 'angularfire2/database';
import { SuperiorUIComponent } from './components/superior-ui/superior-ui.component';
import { InferiorUIComponent } from './components/inferior-ui/inferior-ui.component';
import { WordsTableComponent } from './components/words-table/words-table.component';
import { SnakeComponent } from './components/snake/snake.component';
import { CodenamesComponent } from './components/codenames/codenames.component';


import { RouterModule, Routes } from '@angular/router';
const appRoutes: Routes = [
  { path: 'snake', component: SnakeComponent },
  { path: '', component: CodenamesComponent },
];


@NgModule({
  declarations: [
    AppComponent,
    SuperiorUIComponent,
    InferiorUIComponent,
    WordsTableComponent,
    SnakeComponent,
    CodenamesComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireDatabaseModule ,
    NgxSpinnerModule,

    RouterModule.forRoot(
      appRoutes     
    )
   
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
