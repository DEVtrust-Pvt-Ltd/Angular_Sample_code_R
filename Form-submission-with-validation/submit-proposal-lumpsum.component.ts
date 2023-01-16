import { Component, OnInit } from '@angular/core';
import { Options } from '@angular-slider/ngx-slider';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BaseService } from 'src/app/services/base.service';
import { ActivatedRoute, Router } from '@angular/router';
import { trim } from '@amcharts/amcharts4/.internal/core/utils/Utils';
import { NgxSpinnerService } from 'ngx-spinner';

interface List {
  url: string;
  filters?: any;
}

@Component({
  selector: 'app-submit-proposal-lumpsum',
  templateUrl: './submit-proposal-lumpsum.component.html',
  styleUrls: ['./submit-proposal-lumpsum.component.scss']
})

export class SubmitProposalLumpsumComponent implements OnInit {

  // Here all variables declared
  cover_letter_text = '';
  Scope_of_Work_text = '';
  Methodologies_text = '';
  Related_work_and_References_text = '';
  value: number = 30;
  options: Options = {
    floor: 0,
    ceil: 80,
    step: 10,
    showTicks: true,
    showTicksValues: true,
    stepsArray: [
      { value: 12000, legend: "$" },
      { value: 13000, legend: "$" },
      { value: 14000, legend: "$" },
      { value: 15000, legend: "$" },
      { value: 16000, legend: "$" }

    ]
  };
  files: any = [];
  submitted: boolean = false;
  radioBtnDefault: boolean;
  controls: any;
  talentId: any;
  jobId: any;
  notificationNumbers_: any;
  searchText: any;
  searchQueryType: any;
  submitProposalLumpsum: FormGroup;
  countmilestoneAmount: any = 0;
  constalService: any;
  totalServiceFee: any;
  estimateServiceFee: any;
  selectedStatus: string;
  projectBidAmount: any;
  constalServiceFee: any;
  estimateEarnFee: any;
  earningPercentage: any;
  router: any;
  showDayduration: boolean = false;
  min1Date: any;
  fileSizeError: boolean;
  buttonEnableStatus: boolean;
  typeSelected: string;
  toolsquery: any[] = [];
  workquery: any[] = [];
  textspace: any;
  textcover: any;
  textscope: any;
  textmethodologies: any;
  textscedulemessage: any;
  textesign: any;
  textrelatedWork: any;
  addnewRowCount: boolean = true;
  searchwidth: any = 100;

  constructor(private _snackBar: MatSnackBar, private baseService: BaseService, private formBuilder: FormBuilder, private route: ActivatedRoute, private spinnerService: NgxSpinnerService, private routering: Router) {
    this.typeSelected = 'ball-fussion';
    this.showDayduration = false;
    this.fileSizeError = false;
  }

  ngOnInit(): void {
    this.searchwidth;
    this.buttonEnableStatus = false;
    this.min1Date = new Date();
    this.selectedStatus = 'milestone';
    this.projectBidAmount = 0;
    this.constalServiceFee = 0;
    this.estimateEarnFee = 0;
    this.constalService = 0;
    this.totalServiceFee = 0;
    this.estimateServiceFee = 0;

    // Start submit proposal form declaration
    this.submitProposalLumpsum = this.formBuilder.group({
      coverLetter: ['', Validators.required],
      relatedWork: [''],
      scopWork: ['', Validators.required],
      methodology: ['', Validators.required],
      tools: [''],
      expectStartdate: ['', Validators.required],
      expectCompletiondate: ['', Validators.required],
      applyproposalType: ['', Validators.required],
      termsAndconditions: ['', Validators.required],
      files: this.files,
      Rows: this.formBuilder.array([this.initRows()]),
      scheduleMessage: [''],
      bid: ['']
    });

    // Get URL data through query params
    this.route.queryParams
      .subscribe(params => {
        this.jobId = params.jobId;
        this.talentId = params.talentId;
    });

    // Get URL parameter through snapshot
    const searchType = this.route.snapshot.paramMap.get('searchType');
    const searchKey = this.route.snapshot.paramMap.get('searchKey');
    if (searchType) {
      this.searchQueryType = trim(searchKey);
      this.searchQueryType = trim(searchType);
      this.searchText = trim(searchKey);
    }

    // This function is used for initialization
    this.onLoadAPIs();

    // Set validation according changing bypass value
    this.submitProposalLumpsum.get('applyproposalType').valueChanges.subscribe(
      (mode: string) => {
        console.log(mode);
        const control = <FormArray>this.submitProposalLumpsum.get('Rows');
        if (mode === 'project') {
          this.submitProposalLumpsum.controls["bid"].setValidators([Validators.required]);
          control.controls[0]['controls']['discreption'].clearValidators();
          control.controls[0]['controls']['dueDate'].clearValidators();
          control.controls[0]['controls']['ammount'].clearValidators();
        }
        else if (mode === 'milestone') {
          this.submitProposalLumpsum.controls["bid"].clearValidators();
          control.controls[0]['controls']['discreption'].setValidators([Validators.required]);
          control.controls[0]['controls']['dueDate'].setValidators([Validators.required]);
          control.controls[0]['controls']['ammount'].setValidators([Validators.required]);
        }
        this.submitProposalLumpsum.controls["bid"].updateValueAndValidity();
        control.controls[0]['controls']['discreption'].updateValueAndValidity();
        control.controls[0]['controls']['dueDate'].updateValueAndValidity();
        control.controls[0]['controls']['ammount'].updateValueAndValidity();
      }
    );
  }

  // This function is used for connect API (user-notifications-count)
  onLoadAPIs() {
    let notification: List = {
      url: 'user-notifications-count',
      filters: { "userId": "60cd1ba50b052b63cb87e8c8" }
    }
    this.getNotificationsCountByID(notification);
  }

  // This function is used to receive user notifications via API

  getNotificationsCountByID(obj: List): void {
    let modifiers = {
      url: obj.url,
    }
    if (obj.filters) {
      modifiers['filters'] = obj.filters;
    }
    this.baseService.getList(modifiers)
      .subscribe(results => {
        if (results.status && results.data) {
          this.notificationNumbers_ = results.data
        } else {
          this.notificationNumbers_ = 0;
        }
      });
  }

  // This function is used to search string without any spaces
  searchUrlString(list: any) {
    this.searchText = trim(list[0].searchText);
    this.searchQueryType = trim(list[0].searchType);
    this.searchQueryType = trim(list[0].searchText);
  }

  // Convenience getter for easy access to form fields
  get f() { return this.submitProposalLumpsum.controls; }

  // This is used for message alert popup.
  openSnackBar(msg, type) {
    this._snackBar.open(msg, 'X', {
      horizontalPosition: 'end',
      verticalPosition: 'top',
      duration: 5000,
      panelClass: (type == 'error') ? ['alert-red'] : ['alert-success'],
    });
  }

  // It is used to return value as an array format
  get formArr() {
    return (<FormArray>this.submitProposalLumpsum.get('Rows')).controls.length;
  }

  // In submit proposal lumpsum form, initalize first row at Project Milestones section
  initRows() {
    return this.formBuilder.group({
      discreption: ['', Validators.required],
      dueDate: ['', Validators.required],
      ammount: ['', Validators.required]
    });
  }

  // This function is used for append new rows at Project Milestones section
  addNewRow() {
    const control = <FormArray>this.submitProposalLumpsum.controls['Rows'];
    if (control.value.length < 7) {
      control.push(this.initRows());
    } else {
      this.addnewRowCount = false;
    }
  }

  // This function is used for prepend new rows at Project Milestones section
  deleteRow(index: number) {
    const control = <FormArray>this.submitProposalLumpsum.get('Rows');
    if (control.value.length <= 7) {
      this.addnewRowCount = true;
    }
    control.removeAt(index);
    this.getAmountMilestone(index);
  }

  // This is used for file upload validation at Attachments section
  onFileChange(event) {
    if (event.target.files.length <= 5) {
      for (var i = 0; i < event.target.files.length; i++) {
        if (event.target.files[i].type == 'application/pdf') {
          if (event.target.files[i].size / (1024 * 1024) < 20) { //Validate 20 MB
            if (this.files.length <= 4) {
              this.files.push(event.target.files[i]);
            } else {
              this.openSnackBar('Only five attachments are allowed!', 'error');
            }
            this.fileSizeError = false;
          } else {
            this.fileSizeError = true;
          }
        } else {
          this.openSnackBar('Only pdf files are allowed!', 'error');
        }
      }
    } else {
      this.openSnackBar('Only five attachments are allowed!', 'error');
    }
    if (this.files.length <= 5) {
      this.files;
    }
  }

  // This is used for file remove  at Attachments section
  deleteFilePreviewRow(index: number) {
    this.files.splice(index, 1);
  }

  // This is used to filter value in proposal lumpsum
  getDurationdata(durationValue: string) {
    if (durationValue === 'Other') {
      this.showDayduration = true;
    } else {
      this.showDayduration = false;
    }
  }

  // This is used to get mildstone ammount
  getAmountMilestone(index: number) {
    const control = <FormArray>this.submitProposalLumpsum.get('Rows');
    const arr = [control.value];
    this.countmilestoneAmount = arr[0].reduce((accumulator, current) => eval(accumulator + '+' + current.ammount), 0);
    this.totalServiceFee = this.countmilestoneAmount;
    this.constalService = parseFloat(((this.totalServiceFee * 10) / 100).toFixed(2));
    this.estimateServiceFee = parseFloat((this.totalServiceFee - (this.totalServiceFee * 10) / 100).toFixed(2));
  }

  // This is used to get project bid ammount
  getBidAmount(value) {
    this.projectBidAmount = value;
    this.constalServiceFee = ((this.projectBidAmount * 10) / 100).toFixed(2);
    this.estimateEarnFee = (this.projectBidAmount - (this.projectBidAmount * 10) / 100).toFixed(2);
  }

  // This is used to get total recive ammount
  getReciveAmount(value) {
    this.estimateEarnFee = value;
    this.projectBidAmount = ((this.estimateEarnFee * 100) / 90).toFixed(2); //(100-10)=90 calculation for 10% only.
    this.constalServiceFee = ((this.projectBidAmount * 10) / 100).toFixed(2);
  }

  // This function is used for final submit
  onSubmit() {
    this.submitted = true;
    this.spinnerService.show();
    this.buttonEnableStatus = true;
    if (this.submitProposalLumpsum.value.coverLetter.trim().length > 0 && this.submitProposalLumpsum.value.scopWork.trim().length > 0 && this.submitProposalLumpsum.value.termsAndconditions == true && this.submitProposalLumpsum.value.methodology.trim().length > 0 && this.toolsquery.length > 0 && this.submitProposalLumpsum.value.relatedWork.trim().length > 0) {
      // stop here if form is invalid
      if (this.submitProposalLumpsum.invalid) {
        this.spinnerService.hide();
        return;
      } else {
        let scheduleOthers = '';
        if (this.submitProposalLumpsum.value.expectCompletiondate == 'Other') {
          // To get value from submit-proposal-form
          const nos = (<HTMLInputElement>document.getElementById('nos')).value;
          const typeOfstatus = (<HTMLInputElement>document.getElementById('typeOfstatus')).value;
          scheduleOthers = nos + '-' + typeOfstatus;
        }
        // Initialize duration
        const duration: any = [{
          "start_date": this.submitProposalLumpsum.value.expectStartdate,
          "completion_date": this.submitProposalLumpsum.value.expectCompletiondate,
          "others": scheduleOthers,
          "comments": this.textscedulemessage
        }];
        if (this.submitProposalLumpsum.value.applyproposalType == 'project') {
          // To get value from submit-proposal-form
          const constalService = (<HTMLInputElement>document.getElementById('projectserviceFee')).value;
          const estimateServiceFee = (<HTMLInputElement>document.getElementById('receiveAmount')).value;
          const totalServiceFee = (<HTMLInputElement>document.getElementById('bid')).value;
          // Initialize earningPercentage
          const earningPercentage: any = [{
            "constal_service_charge": constalService,
            "your_earning": estimateServiceFee,
            "total_cost": totalServiceFee
          }];
          this.earningPercentage = earningPercentage;
        } else {
          // To get value from submit-proposal-form
          const constalService = (<HTMLInputElement>document.getElementById('constalService')).value;
          const estimateServiceFee = (<HTMLInputElement>document.getElementById('estimateServiceFee')).value;
          const totalServiceFee = (<HTMLInputElement>document.getElementById('totalServiceFee')).value;
          // Initialize earningPercentage
          const earningPercentage: any = [{
            "constal_service_charge": constalService,
            "your_earning": estimateServiceFee,
            "total_cost": totalServiceFee
          }];
          this.earningPercentage = earningPercentage;
        }
        // Initialize form data as array
        const formData = new FormData();
        formData.append("proposalType", "lumpsum");
        formData.append("jobId", this.jobId);
        formData.append("clientId", "6090e1f63c506b537b19fe89");
        formData.append("talentId", this.talentId);
        formData.append("coverLetter", this.textcover);
        formData.append("experience", this.textrelatedWork);
        formData.append("scopeOfWork", this.textscope);
        formData.append("methodologies", this.textmethodologies);
        formData.append("toolsAndTechnologies", JSON.stringify(this.toolsquery));
        formData.append("durations", JSON.stringify(duration));
        formData.append("submitType", this.submitProposalLumpsum.value.applyproposalType);
        formData.append("milestones", JSON.stringify(this.submitProposalLumpsum.value.Rows));
        formData.append("termsConditions", this.submitProposalLumpsum.value.termsAndconditions);
        formData.append("earningPercentage", JSON.stringify(this.earningPercentage));
        for (var i = 0; i < this.files.length; i++) {
          formData.append("fileToUpload", this.files[i]);
        }
        
        //This is used for declare interfaces
        let proposalHourlyInsertlist: List =
        {
          url: 'save-talent-proposals',
          filters: formData
        }

        // It is used to post data thru API and submit all records in database
        this.baseService.create(proposalHourlyInsertlist).subscribe(data => {
          if (data.status == 1) {
            this.submitProposalLumpsum.reset();
            this.spinnerService.hide();
            this.openSnackBar('Proposal submitted successfully!', 'success');
            this.getResetData();
            this.submitted = false;
            this.toolsquery.splice(0, this.toolsquery.length);
            this.routering.navigate(['view-proposal', data.data[0].proposalId]);
          } else {
            this.spinnerService.hide();
            this.openSnackBar('Something went wrong!', 'error')
            this.submitted = false;
          }
        });
      }
    } else {
      this.spinnerService.hide();
      this.openSnackBar('Please fill all mandatory fields!', 'error');
      this.submitProposalLumpsum.invalid;
      return;
    }
  }

  // This function is used for after submitting the form to set all the values ​​as default
  getResetData() {
    this.buttonEnableStatus = false;
    this.selectedStatus = 'milestone';
    this.radioBtnDefault = true;
    this.projectBidAmount = 0;
    this.constalServiceFee = 0;
    this.estimateEarnFee = 0;
    this.constalService = 0;
    this.totalServiceFee = 0;
    this.estimateServiceFee = 0;
    this.files = [];
    this.showDayduration = false;
    this.ngOnInit();
  }

  // It is constant value as a array format
  public staticList = [
    "Digital Transformation",
    "Architecture",
    "Structure",
    "Sustainability",
    "Planning & Scheduling",
    "Claims",
    "BIM",
    "QA & QC"
  ];

  // It is used to handle static result selected
  public handleStaticResultSelected(result) {
    if (result) {
      this.toolsquery.push(result);
      this.toolsquery.map((item: any, index: any) => {
      })
    }
  }

  // It is used to delete tool data as array format
  deletetoolsdata(index: number) {
    this.toolsquery.splice(index, 1);
  }

  // It is set for remove all value as NULL
  clear(e: any) {
    this.searchwidth = '0';
    return e.target.value = '';
  }

  // Onchange event value set NULL
  onChange(e: any) {
    return e.target.value = '';
  }

  // It is constant value as a array format
  public workdata = [
    "Buildings",
    "Transportation",
    "Infrastructure",
    "Power & Utilities",
    "Oil & Gas",
    "Technology"
  ];

  // It is used to handle static work selected
  public handleStaticResultwork(result) {
    if (result) {
      this.workquery.push(result);
      this.workquery.map((item: any, index: any) => {
      })
    }
  }

  // It is used to delete tool data as array format
  deleteworkdata(index: number) {
    this.workquery.splice(index, 1);
  }

  // It is used for to remove extra space and all string value break as \n 
  textareaspace(e: any, name: any) {
    var text = e.target.value;
    if (name == 'cover') {
      this.textcover = e.target.value.replaceAll("\n", "<br/>\r\n");
    }
    else if (name == 'scope') {
      this.textscope = e.target.value.replaceAll("\n", "<br/>\r\n");
    }
    else if (name == 'methodologies') {
      this.textmethodologies = e.target.value.replaceAll("\n", "<br/>\r\n");
    }
    else if (name == 'scedulemessage') {
      this.textscedulemessage = e.target.value.replaceAll("\n", "<br/>\r\n");
    }
    else if (name == 'relatedWork') {
      this.textrelatedWork = e.target.value.replaceAll("\n", "<br/>\r\n");
    }
    else {
      this.textesign = e.target.value.replaceAll("\n", "<br/>\r\n");
    }
  }

  // This function is used for accept only character
  letterOnly(event): any {
    const charCode = (event.which) ? event.which : event.keyCode;
    if ((charCode < 48 || charCode > 57)) {
      return true;
    }
    return false;
  }
}

