import { NgModule } from '@angular/core';
// import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { PROVIDERS } from './providers';

@NgModule({
  providers: [PROVIDERS],
  // exports: [HttpModule]
  exports: [HttpClientModule]
})
export class JsonApiModule {
}
