import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field'; 
import { FlexLayoutModule } from '@angular/flex-layout';
import { AccountsComponent } from './accounts/accounts.component';

import { AmplifyUIAngularModule } from '@aws-amplify/ui-angular';

// Amplify Configuration
import Auth from '@aws-amplify/auth';
import API from '@aws-amplify/api';
import AWSConfig from 'src/aws-exports';
import { AccountComponent } from './account/account.component';

Auth.configure(AWSConfig);
API.configure(AWSConfig)
// End Amplify Configuration


@NgModule({
  declarations: [
    AppComponent,
    AccountsComponent,
    AccountComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatSelectModule,
    MatToolbarModule,
    MatListModule,
    MatInputModule,
    MatIconModule,
    MatDialogModule,
    MatMenuModule,
    ClipboardModule,
    MatButtonToggleModule,
    FormsModule,
    MatFormFieldModule,
    FlexLayoutModule,
    AmplifyUIAngularModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
