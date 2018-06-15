import {Component, OnDestroy, OnInit} from '@angular/core';
import {Plan} from "../../model/plan";
import {ReviewsService} from "../../services/reviews.service";
import {ActivatedRoute} from "@angular/router";
import {Subscription} from "rxjs/Subscription";
import {PcvtConstants} from "../../shared/pcvt-constants";
import {REVIEW_OPTIONS} from "../../model/review-options";

declare var $ :any;

@Component({
  selector: 'app-review-plan',
  templateUrl: './review-plan.component.html',
  styleUrls: ['./review-plan.component.css', '../../plans/create-plan/create-plan.component.css']
})
export class ReviewPlanComponent implements OnInit, OnDestroy {

  review: any = {};
  plan: Plan;
  planDetails: any;

  instrumentQuestions = PcvtConstants.REVIEW_INSTRUMENT_QUESTIONS;

  options = REVIEW_OPTIONS;

  private subsc: Subscription;

  constructor(
    private reviewsService: ReviewsService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    $(document).ready(function(){
      $('.collapsible').collapsible();
    });

    this.subsc = this.route.data.subscribe(
      (info: { review: any }) => {
        this.review = info['review'];
        this.plan = this.review.plan;
        this.planDetails = JSON.parse(this.plan.planDetails);

        console.log(this.review);
      });
  }

  ngOnDestroy() {
    this.subsc.unsubscribe();
  }
}
