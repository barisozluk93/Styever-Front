import {Component,OnInit} from '@angular/core';
import {AuthService} from '../../auth';
import {UserManagementService} from '../../user-management/user-management.service';
import {UserAgreement} from '../../user-management/models/agreement.model';

@Component({
  selector:'app-agreements',
  templateUrl:'./agreements.component.html'
})
export class AgreementsComponent implements OnInit{
  loading=true;
  agreements:UserAgreement[]=[];
  expandedId:number|null=null;

  constructor(
    private auth:AuthService,
    private users:UserManagementService
  ){}

  ngOnInit():void{
    const id=this.auth.currentUserValue?.id;
    if(!id){
      this.loading=false;
      return;
    }

    this.users.getUserAgreements(id).subscribe({
      next:r=>{
        this.agreements=r.data||[];
        this.loading=false;
      },
      error:()=>this.loading=false
    });
  }

  toggleDetails(id:number):void{
    this.expandedId=this.expandedId===id?null:id;
  }

  contextKey(context:string):string{
    return context?.toLowerCase()==='purchase'
      ?'MY_AGREEMENTS.CONTEXT_PURCHASE'
      :'MY_AGREEMENTS.CONTEXT_REGISTRATION';
  }

  typeKey(type:string):string{
    const value=type?.toLowerCase();
    if(value==='preinformationform')return'MY_AGREEMENTS.TYPE_PRE_INFORMATION';
    if(value==='distancesalesagreement')return'MY_AGREEMENTS.TYPE_DISTANCE_SALES';
    if(value==='privacypolicy')return'MY_AGREEMENTS.TYPE_PRIVACY';
    if(value==='kvkk')return'MY_AGREEMENTS.TYPE_KVKK';
    if(value==='commercialcommunication')return'MY_AGREEMENTS.TYPE_COMMERCIAL';
    if(value==='socialresponsibility')return'MY_AGREEMENTS.TYPE_SOCIAL';
    return'MY_AGREEMENTS.TYPE_MEMBERSHIP';
  }
}
