import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LayoutsModule } from './layouts/layouts.module';

import { APP_INITIALIZER } from '@angular/core';
import { LogitrackAuthService } from './core/services/logitrack-auth.service';

export function appInitializer(authService: LogitrackAuthService) {
  return () => new Promise<void>((resolve) => {
    authService.checkSessionInitializer().subscribe().add(resolve);
  });
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    LayoutsModule
  ],
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializer,
      multi: true,
      deps: [LogitrackAuthService]
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
