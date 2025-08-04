import { Component, Injector, ViewEncapsulation, inject, output, viewChild } from '@angular/core';
import { AppConsts } from '@shared/AppConsts';
import { AppComponentBase } from '@shared/common/app-component-base';
import {
    CreateOrUpdateUserInput,
    OrganizationUnitDto,
    PasswordComplexitySetting,
    ProfileServiceProxy,
    UserEditDto,
    UserRoleDto,
    UserServiceProxy,
} from '@shared/service-proxies/service-proxies';
import { ModalDirective } from 'ngx-bootstrap/modal';
import {
    IOrganizationUnitsTreeComponentData,
    OrganizationUnitsTreeComponent,
} from '../shared/organization-unit-tree.component';
import { map as _map, filter as _filter } from 'lodash-es';
import { finalize } from 'rxjs/operators';
import { PasswordMeterComponent } from '@metronic/app/kt/components';
import { AppBsModalDirective } from '../../../shared/common/appBsModal/app-bs-modal.directive';

import { FormsModule } from '@angular/forms';
import { TabsetComponent, TabDirective, TabHeadingDirective } from 'ngx-bootstrap/tabs';
import { ValidationMessagesComponent } from '../../../shared/utils/validation-messages.component';
import { TooltipDirective } from 'ngx-bootstrap/tooltip';
import { EqualValidator } from '../../../shared/utils/validation/equal-validator.directive';
import { PasswordComplexityValidator } from '../../../shared/utils/validation/password-complexity-validator.directive';
import { ButtonBusyDirective } from '../../../shared/utils/button-busy.directive';
import { ChangeProfilePictureModalComponent } from '../../shared/layout/profile/change-profile-picture-modal.component';
import { LocalizePipe } from '@shared/common/pipes/localize.pipe';

@Component({
    selector: 'createOrEditUserModal',
    templateUrl: './create-or-edit-user-modal.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['create-or-edit-user-modal.component.less'],
    imports: [
        AppBsModalDirective,
        FormsModule,
        TabsetComponent,
        TabDirective,
        ValidationMessagesComponent,
        TooltipDirective,
        EqualValidator,
        PasswordComplexityValidator,
        TabHeadingDirective,
        OrganizationUnitsTreeComponent,
        ButtonBusyDirective,
        ChangeProfilePictureModalComponent,
        LocalizePipe,
    ],
})
export class CreateOrEditUserModalComponent extends AppComponentBase {
    private _userService = inject(UserServiceProxy);
    private _profileService = inject(ProfileServiceProxy);

    readonly modal = viewChild<ModalDirective>('createOrEditModal');
    readonly organizationUnitTree = viewChild<OrganizationUnitsTreeComponent>('organizationUnitTree');

    readonly modalSave = output<any>();

    active = false;
    saving = false;
    canChangeUserName = true;
    canChangeProfilePicture = false;
    isTwoFactorEnabled: boolean = this.setting.getBoolean('Abp.Zero.UserManagement.TwoFactorLogin.IsEnabled');
    isLockoutEnabled: boolean = this.setting.getBoolean('Abp.Zero.UserManagement.UserLockOut.IsEnabled');
    passwordComplexitySetting: PasswordComplexitySetting = new PasswordComplexitySetting();

    user: UserEditDto = new UserEditDto();
    roles: UserRoleDto[];
    sendActivationEmail = true;
    setRandomPassword = true;
    passwordComplexityInfo = '';
    profilePicture: string;
    allowedUserNameCharacters = '';
    isSMTPSettingsProvided = false;
    passwordMeterInitialized = false;

    allOrganizationUnits: OrganizationUnitDto[];
    memberedOrganizationUnits: string[];
    userPasswordRepeat = '';

    constructor(...args: unknown[]);

    constructor() {
        const injector = inject(Injector);

        super(injector);
    }

    show(userId?: number): void {
        if (!userId) {
            this.active = true;
            this.setRandomPassword = true;
            this.sendActivationEmail = true;
            this.canChangeProfilePicture = false;
        } else {
            this.canChangeProfilePicture = this.permission.isGranted('Pages.Administration.Users.ChangeProfilePicture');
        }

        this._userService.getUserForEdit(userId).subscribe((userResult) => {
            this.user = userResult.user;
            this.roles = userResult.roles;
            this.canChangeUserName = this.user.userName !== AppConsts.userManagement.defaultAdminUserName;
            this.allowedUserNameCharacters = userResult.allowedUserNameCharacters;
            this.isSMTPSettingsProvided = userResult.isSMTPSettingsProvided;
            this.sendActivationEmail = userResult.isSMTPSettingsProvided;

            this.allOrganizationUnits = userResult.allOrganizationUnits;
            this.memberedOrganizationUnits = userResult.memberedOrganizationUnits;

            this.getProfilePicture(userId);

            if (userId) {
                this.active = true;

                setTimeout(() => {
                    this.setRandomPassword = false;
                }, 0);

                this.sendActivationEmail = false;
            }

            this._profileService.getPasswordComplexitySetting().subscribe((passwordComplexityResult) => {
                this.passwordComplexitySetting = passwordComplexityResult.setting;
                this.setPasswordComplexityInfo();
                this.modal().show();
            });
        });
    }

    setPasswordComplexityInfo(): void {
        this.passwordComplexityInfo = '<ul>';

        if (this.passwordComplexitySetting.requireDigit) {
            this.passwordComplexityInfo += '<li>' + this.l('PasswordComplexity_RequireDigit_Hint') + '</li>';
        }

        if (this.passwordComplexitySetting.requireLowercase) {
            this.passwordComplexityInfo += '<li>' + this.l('PasswordComplexity_RequireLowercase_Hint') + '</li>';
        }

        if (this.passwordComplexitySetting.requireUppercase) {
            this.passwordComplexityInfo += '<li>' + this.l('PasswordComplexity_RequireUppercase_Hint') + '</li>';
        }

        if (this.passwordComplexitySetting.requireNonAlphanumeric) {
            this.passwordComplexityInfo += '<li>' + this.l('PasswordComplexity_RequireNonAlphanumeric_Hint') + '</li>';
        }

        if (this.passwordComplexitySetting.requiredLength) {
            this.passwordComplexityInfo +=
                '<li>' +
                this.l('PasswordComplexity_RequiredLength_Hint', this.passwordComplexitySetting.requiredLength) +
                '</li>';
        }

        this.passwordComplexityInfo += '</ul>';
    }

    getProfilePicture(userId: number): void {
        if (!userId) {
            this.profilePicture = this.appRootUrl() + 'assets/common/images/default-profile-picture.png';
            return;
        }

        this._profileService.getProfilePictureByUser(userId).subscribe((result) => {
            if (result && result.profilePicture) {
                this.profilePicture = 'data:image/jpeg;base64,' + result.profilePicture;
            } else {
                this.profilePicture = this.appRootUrl() + 'assets/common/images/default-profile-picture.png';
            }
        });
    }

    onShown(): void {
        this.organizationUnitTree().data = <IOrganizationUnitsTreeComponentData>{
            allOrganizationUnits: this.allOrganizationUnits,
            selectedOrganizationUnits: this.memberedOrganizationUnits,
        };

        document.getElementById('Name').focus();
    }

    save(): void {
        let input = new CreateOrUpdateUserInput();

        input.user = this.user;
        input.setRandomPassword = this.setRandomPassword;
        input.sendActivationEmail = this.sendActivationEmail;
        input.assignedRoleNames = _map(
            _filter(this.roles, { isAssigned: true, inheritedFromOrganizationUnit: false }),
            (role) => role.roleName
        );

        input.organizationUnits = this.organizationUnitTree().getSelectedOrganizationIds();

        this.saving = true;
        this._userService
            .createOrUpdateUser(input)
            .pipe(
                finalize(() => {
                    this.saving = false;
                })
            )
            .subscribe(() => {
                this.notify.info(this.l('SavedSuccessfully'));
                this.close();
                this.modalSave.emit(null);
            });
    }

    close(): void {
        this.active = false;
        this.userPasswordRepeat = '';
        this.modal().hide();
    }

    getAssignedRoleCount(): number {
        return _filter(this.roles, { isAssigned: true }).length;
    }

    getAssignedMemberedOrganizationUnitCount(): number {
        return this.memberedOrganizationUnits ? this.memberedOrganizationUnits.length : 0;
    }

    onOrganizationUnitTreeSelectionChanged(): void {
        let organizationUnits = this.organizationUnitTree().getSelectedOrganizations();
        this.memberedOrganizationUnits = _map(organizationUnits, (ou) => ou.code);
    }

    setRandomPasswordChange(event): void {
        if (this.passwordMeterInitialized && this.setRandomPassword) {
            this.passwordMeterInitialized = false;
            return;
        }

        setTimeout(() => {
            PasswordMeterComponent.bootstrap();
            this.passwordMeterInitialized = true;
        }, 0);
    }
}
