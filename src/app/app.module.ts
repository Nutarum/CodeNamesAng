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

@NgModule({
  declarations: [
    AppComponent,
    SuperiorUIComponent,
    InferiorUIComponent,
    WordsTableComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireDatabaseModule ,
    NgxSpinnerModule
   
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
