import {Component, OnDestroy, OnInit} from '@angular/core';
import {ModalService} from "../../services/modal.service";
import {FormValidateUtils} from "../../shared/form-validate-utils";
import {ToastFactory} from "../../shared/toast-factory";
import {PcvtConstants} from "../../shared/pcvt-constants";
import {ActivatedRoute, Router} from "@angular/router";
import {Subscription} from "rxjs/Rx";
import {ApiMessage} from "../../model/pcvt-message";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Plan} from "../../model/plan";
import {PlanService} from "../../services/plan.service";
import {IFormCanDeactivate} from "../../guards/Iform-candeactivate";
import {SIMPLE_OPTIONS} from "../../model/simple-options";
import {PcvtUtils} from "../../shared/pcvt-utils";

declare var $ :any;

@Component({
  selector: 'app-edit-plan',
  templateUrl: './edit-plan.component.html',
  styleUrls: ['./edit-plan.component.css', '../create-plan/create-plan.component.css']
})
export class EditPlanComponent implements OnInit, OnDestroy, IFormCanDeactivate {
  form: FormGroup;
  plan: Plan;

  private formValidateUtils: FormValidateUtils;

  /**
   * Subscription to listen changes in form
   */
  private subsc: Subscription;

  /**
   * Subscription to list changes in resolved data
   */
  private subsc2: Subscription;

  /**
   * Flag changes in form
   */
  private hasUnsavedChanges: boolean = false;

  detailsObject: any = {};
  characteristicsObject: any = {};

  instrumentQuestions = PcvtConstants.INSTRUMENT_QUESTIONS;

  private readonly CHARACTERIZATION_QUESTIONS = PcvtConstants.CHARACTERIZATION_QUESTIONS;
  options = SIMPLE_OPTIONS;

  saving: boolean = false;
  completing: boolean = false;

  getCharacterizationQuestionsObject(key: string): any {
    return this.CHARACTERIZATION_QUESTIONS.find(item => item['key'] === key);
  }

  constructor(
    private formBuilder: FormBuilder,
    private planService: PlanService,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: ModalService) { }

  ngOnInit() {
    $(document).ready(function(){
      $('.collapsible').collapsible();
    });

    this.subsc2 = this.route.data.subscribe(
      (info: {plan: Plan}) => {
        this.plan = info['plan'];
        this.detailsObject = this.plan.planDetails !== undefined ?
          JSON.parse(this.plan.planDetails) : this.buildDetailsObject();

        if(this.plan.planCharacteristics !== undefined)
          this.characteristicsObject = JSON.parse(this.plan.planCharacteristics);
      }
    );

    this.form = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(1024)]],
      description: ['']
    });

    this.formValidateUtils = new FormValidateUtils(this.form);
    this.subsc = this.form.valueChanges.subscribe(
      () => {
        this.hasUnsavedChanges = true;

        // if a change already occurred, it's not necessary to keep the subscribe
        this.subsc.unsubscribe();
      }
    )
  }

  onSubmit() {
    this.saving = true;
    if(this.form.valid) {
      this.plan.planDetails = JSON.stringify(this.detailsObject);
      this.plan.planCharacteristics = JSON.stringify(this.characteristicsObject);

      this.planService.updatePlan(this.plan)
        .finally(() => this.saving = false)
        .subscribe(
          () => {
            this.hasUnsavedChanges = false;
            ToastFactory.successToast("Plan updated!");

            this.router.navigate(['/plans']);
          },
          (err: ApiMessage) => {
            this.hasUnsavedChanges = false;
            ToastFactory.errorToast(err.message);
            console.log(err);
          }
        );
    } else {
      this.formValidateUtils.checkAllFields(this.form);
    }
  }

  saveAndComplete() {
    this.completing = true;
    this.plan.state = 'ReadyToReview';
    this.planService.updateStatus(this.plan)
      .finally(() => this.completing = false)
      .subscribe(
        () => {
        ToastFactory.successToast("Plan ready to review!");
        this.onSubmit();
      },
      (err: ApiMessage) => {
        this.hasUnsavedChanges = false;
        ToastFactory.errorToast(err.message);
        console.log(err);
    });
  }

  enableSaveAndComplete() {
    const isCharacterizationComplete = PcvtUtils.isCharacterizationInstrumentComplete(this.characteristicsObject);
    const isPlanningComplete = PcvtUtils.isPlanningInstrumentComplete(this.detailsObject);

    return isCharacterizationComplete && isPlanningComplete;
  }

  private buildDetailsObject(): any {
    let obj: any = {};
    this.instrumentQuestions.forEach(item => {
      item.questions.forEach(question => {
        obj[question.key] = '';
      });
    });

    return obj;
  }

  isActiveLabel(value: string): any {
    return {
      'active': value !== null
    }
  }

  showError(field: string): boolean {
    return this.formValidateUtils.checkInvalidAndTouchedField(field);
  }

  buildErrorMessage(field: string): string {
    return this.formValidateUtils.buildErrorMessage(field);
  }

  addClassError(field: string) {
    let result = this.showError(field);
    return {
      invalid: result
    }
  }

  canDeactivateForm() {
    return !this.hasUnsavedChanges || this.modalService.showUnsaveChangesModal();
  }

  ngOnDestroy() {
    this.subsc.unsubscribe();
    this.subsc2.unsubscribe();
  }
}
