import { ChangeDetectorRef, Component, NgZone } from '@angular/core';
import { onAuthUIStateChange, CognitoUserInterface, AuthState } from '@aws-amplify/ui-components';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'vault';

  user: CognitoUserInterface | undefined;
  authState: AuthState | undefined;

  constructor(private zone: NgZone) {}

  ngOnInit() {
    onAuthUIStateChange((authState, authData) => {
      this.zone.run(() => {
        this.authState = authState;
        this.user = authData as CognitoUserInterface;
        // this.ref.detectChanges();
      });
    });
  }

  ngOnDestroy() {
    return onAuthUIStateChange;
  }

}
