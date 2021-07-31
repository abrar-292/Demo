import {Component, OnInit, ViewChild} from '@angular/core';
import {HttpClientModule} from "@angular/common/http";
import {ApiService} from "./api.service";
import {FormControl, Validators} from "@angular/forms";
import {PageEvent} from "@angular/material/paginator";
import {NgxSpinnerService} from "ngx-spinner";
import {debounce, debounceTime} from "rxjs/operators";

declare var $: any;

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    searchFormControl = new FormControl('', [
        Validators.required,
    ]);

    requestPara: any = {};
    list = [];
    listLength;
    filteredStates = [];

    constructor(private http: HttpClientModule, private api: ApiService, private spinner: NgxSpinnerService) {
    }

    ngOnInit() {
        this.requestPara.page = 1;

        this.searchFormControl.valueChanges.pipe(debounceTime(300)).subscribe((e) => {
            if (e.length > 2) {
                this.requestPara.search = e;
                this.getMovieList(this.requestPara);
            } else {
                this.list = [];
                this.listLength = '';
            }
        })
    }


    getMovieList(data) {
        this.spinner.show();
        const apiKey = 'apikey=4897472c';
        const page = data && data.page ? '&page=' + data.page : '';
        const search = data && data.search ? '&s=' + data.search : '';
        const queryString = apiKey + page + search;
        this.api.getList(queryString).subscribe((re) => {
            this.spinner.hide();
            if (re.Response == 'True') {
                this.list = re.Search
                this.listLength = re.totalResults;
                setTimeout(() => {
                    window.scroll(0, 0);
                }, 100)
            } else {
                alert(re.Error)
            }
        })
    }

    searchMovie(search) {
        this.requestPara.search = '';
        this.requestPara.search = search.value;
        this.getMovieList(this.requestPara);
    }

    changePage(e: PageEvent) {
        this.requestPara.page = e.pageIndex + 1;
        this.getMovieList(this.requestPara);
    }
}
