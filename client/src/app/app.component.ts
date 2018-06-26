import { Component, OnInit } from '@angular/core';
import { LoadingIndicatorService, AlertMessageService } from './shared/services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

   loading: boolean;

   constructor(private loadingIndicatorService: LoadingIndicatorService) {
      this.loading = false;
      loadingIndicatorService.onLoadingChanged.subscribe(isLoading => this.loading = isLoading);
   }

   ngOnInit(): void { }
}
