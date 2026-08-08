import { Component, HostBinding, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { TranslationService } from '../../../../../../modules/i18n';
import { AuthService, UserType } from '../../../../../../modules/auth';
import { UserModel } from 'src/app/modules/user-management/models/user.model';
import { UserManagementService } from 'src/app/modules/user-management/user-management.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-user-inner',
  templateUrl: './user-inner.component.html',
  styleUrls: ['./user-inner.component.scss'],
})
export class UserInnerComponent implements OnInit, OnDestroy {
  @HostBinding('class')
  class = `menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-700 menu-state-bg menu-state-primary fw-semibold py-0 fs-6 w-300px styever-user-menu`;
  @HostBinding('attr.data-kt-menu') dataKtMenu = 'true';

  language: LanguageFlag;
  user: UserModel;
  langs = languages;
  private unsubscribe: Subscription[] = [];
  avatarUrl: string = '';
  languageMenuOpen = false;

  constructor( 
    private auth: AuthService,
    private userManagementService: UserManagementService,
    private translationService: TranslationService
  ) {}

  ngOnInit(): void {
    this.auth.currentUserSubject.subscribe(auth => {
      this.userManagementService.updateUser(auth?.id!);
    });

    this.userManagementService.user$.subscribe(result => {
      this.user = result!;

      if(this.user?.fileId) {
        this.avatarUrl = environment.avatarUploadFolderUrl + "/" + this.user.file?.path.split("\\")[this.user.file?.path.split("\\").length-1];
      }
    });
    
    this.setLanguage(this.translationService.getSelectedLanguage());
  }

  logout() {
    this.auth.logout();
  }

  toggleLanguageMenu(event?: Event) {
    event?.preventDefault();
    event?.stopPropagation();
    this.languageMenuOpen = !this.languageMenuOpen;
  }

  selectLanguage(lang: string) {
    this.translationService.setLanguage(lang);
    this.setLanguage(lang);
    this.languageMenuOpen = false;
  }

  setLanguage(lang: string) {
    this.langs.forEach((language: LanguageFlag) => {
      if (language.lang === lang) {
        language.active = true;
        this.language = language;
      } else {
        language.active = false;
      }
    });
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}

interface LanguageFlag {
  lang: string;
  nameTr: string;
  nameEn: string;
  flag: string;
  active?: boolean;
}

const languages = [
  {
    lang: 'en',
    nameTr: 'İngilizce',
    nameEn: 'English',
    flag: './assets/media/flags/united-states.svg',
  },
  {
    lang: 'tr',
    nameTr: 'Türkçe',
    nameEn: 'Turkish',
    flag: './assets/media/flags/turkey.svg',
  },
];
