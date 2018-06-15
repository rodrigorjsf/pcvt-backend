import { Component, OnInit } from '@angular/core';
import {Plan} from "../model/plan";
import {PlanService} from "../services/plan.service";
import {ReviewsService} from "../services/reviews.service";
import {ApiMessage} from "../model/pcvt-message";
import {ToastFactory} from "../shared/toast-factory";

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.css']
})
export class ReviewsComponent implements OnInit {

  reviews: Array<any> = [];

  loading: boolean = true;

  constructor(private planService: PlanService, private reviewsService: ReviewsService) { }

  ngOnInit() {
    this.reviewsService.getReviewsRequest()
      .finally(() => this.loading = false)
      .subscribe(
        data => {
          console.log(data);
          this.reviews = data;
        },
        (err: ApiMessage) => {
          console.log(err);
          ToastFactory.errorToast(err.message);
        }
      )
  }

}