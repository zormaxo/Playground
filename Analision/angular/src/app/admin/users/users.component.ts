import { Component, Injector, ViewEncapsulation, AfterViewInit, inject, viewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppConsts } from '@shared/AppConsts';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import {
    EntityDtoOfInt64,
    GetRolesInput,
    GetUsersInput,
    UserListDto,
    UserServiceProxy,
} from '@shared/service-proxies/service-proxies';
import { FileDownloadService } from '@shared/utils/file-download.service';
import { LazyLoadEvent } from 'primeng/api';
import { Paginator, PaginatorModule } from 'primeng/paginator';
import { Table, TableModule } from 'primeng/table';
import { CreateOrEditUserModalComponent } from './create-or-edit-user-modal.component';
import { EditUserPermissionsModalComponent } from './edit-user-permissions-modal.component';
import { ImpersonationService } from './impersonation.service';
import { HttpClient } from '@angular/common/http';
import { FileUpload, FileUploadModule } from 'primeng/fileupload';
import { finalize } from 'rxjs/operators';
import { PermissionTreeModalComponent } from '../shared/permission-tree-modal.component';
import { LocalStorageService } from '@shared/utils/local-storage.service';
import { DynamicEntityPropertyManagerComponent } from '@app/shared/common/dynamic-entity-property-manager/dynamic-entity-property-manager.component';
import { DateTimeService } from '@app/shared/common/timing/date-time.service';
import { ExcelColumnSelectionModalComponent } from '@app/shared/common/excel-column-selection/excel-column-selection-modal';
import { SubHeaderComponent } from '../../shared/common/sub-header/sub-header.component';
import { BsDropdownDirective, BsDropdownToggleDirective, BsDropdownMenuDirective } from 'ngx-bootstrap/dropdown';
import { NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AutoFocusDirective } from '../../../shared/utils/auto-focus.directive';
import { RoleComboComponent } from '../shared/role-combo.component';
import { BusyIfDirective } from '../../../shared/utils/busy-if.directive';
import { TooltipDirective } from 'ngx-bootstrap/tooltip';
import { DynamicEntityPropertyManagerComponent as DynamicEntityPropertyManagerComponent_1 } from '../../shared/common/dynamic-entity-property-manager/dynamic-entity-property-manager.component';
import { ExcelColumnSelectionModalComponent as ExcelColumnSelectionModalComponent_1 } from '../../shared/common/excel-column-selection/excel-column-selection-modal';
import { LuxonFormatPipe } from '../../../shared/utils/luxon-format.pipe';
import { LocalizePipe } from '@shared/common/pipes/localize.pipe';
import { PermissionPipe } from '@shared/common/pipes/permission.pipe';
import { PermissionAnyPipe } from '@shared/common/pipes/permission-any.pipe';

@Component({
    templateUrl: './users.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./users.component.less'],
    animations: [appModuleAnimation()],
    imports: [
        SubHeaderComponent,
        BsDropdownDirective,
        BsDropdownToggleDirective,
        BsDropdownMenuDirective,
        FileUploadModule,
        FormsModule,
        AutoFocusDirective,
        NgClass,
        PermissionTreeModalComponent,
        RoleComboComponent,
        BusyIfDirective,
        TableModule,
        TooltipDirective,
        PaginatorModule,
        CreateOrEditUserModalComponent,
        EditUserPermissionsModalComponent,
        DynamicEntityPropertyManagerComponent_1,
        ExcelColumnSelectionModalComponent_1,
        LuxonFormatPipe,
        LocalizePipe,
        PermissionPipe,
        PermissionAnyPipe,
    ],
})
export class UsersComponent extends AppComponentBase implements AfterViewInit {
    private _userServiceProxy = inject(UserServiceProxy);
    private _fileDownloadService = inject(FileDownloadService);
    private _activatedRoute = inject(ActivatedRoute);
    private _httpClient = inject(HttpClient);
    private _localStorageService = inject(LocalStorageService);
    private _dateTimeService = inject(DateTimeService);

    _impersonationService = inject(ImpersonationService);

    readonly createOrEditUserModal = viewChild<CreateOrEditUserModalComponent>('createOrEditUserModal');
    readonly editUserPermissionsModal = viewChild<EditUserPermissionsModalComponent>('editUserPermissionsModal');
    readonly dataTable = viewChild<Table>('dataTable');
    readonly paginator = viewChild<Paginator>('paginator');
    readonly excelFileUpload = viewChild<FileUpload>('ExcelFileUpload');
    readonly permissionFilterTreeModal = viewChild<PermissionTreeModalComponent>('permissionFilterTreeModal');
    readonly dynamicEntityPropertyManager =
        viewChild<DynamicEntityPropertyManagerComponent>('dynamicEntityPropertyManager');
    readonly excelColumnSelectionModal = viewChild<ExcelColumnSelectionModalComponent>('excelColumnSelectionModal');

    uploadUrl: string;

    //Filters
    advancedFiltersAreShown = false;
    filterText = '';
    role = '';
    onlyLockedUsers = false;

    constructor(...args: unknown[]);

    constructor() {
        const injector = inject(Injector);

        super(injector);
        this.filterText = this._activatedRoute.snapshot.queryParams['filterText'] || '';
        this.uploadUrl = AppConsts.remoteServiceBaseUrl + '/Users/ImportFromExcel';
    }

    ngAfterViewInit(): void {
        this.primengTableHelper.adjustScroll(this.dataTable());
    }

    getUsers(event?: LazyLoadEvent) {
        if (this.primengTableHelper.shouldResetPaging(event)) {
            this.paginator().changePage(0);

            if (this.primengTableHelper.records && this.primengTableHelper.records.length > 0) {
                return;
            }
        }

        this.primengTableHelper.showLoadingIndicator();

        this._userServiceProxy
            .getUsers(
                new GetUsersInput({
                    filter: this.filterText,
                    permissions: this.permissionFilterTreeModal().getSelectedPermissions(),
                    role: this.role !== '' ? parseInt(this.role) : undefined,
                    onlyLockedUsers: this.onlyLockedUsers,
                    sorting: this.primengTableHelper.getSorting(this.dataTable()),
                    maxResultCount: this.primengTableHelper.getMaxResultCount(this.paginator(), event),
                    skipCount: this.primengTableHelper.getSkipCount(this.paginator(), event),
                })
            )
            .pipe(finalize(() => this.primengTableHelper.hideLoadingIndicator()))
            .subscribe((result) => {
                this.primengTableHelper.totalRecordsCount = result.totalCount;
                this.primengTableHelper.records = result.items;
                this.setUsersProfilePictureUrl(this.primengTableHelper.records);
                this.primengTableHelper.hideLoadingIndicator();
            });
    }

    unlockUser(record): void {
        this._userServiceProxy.unlockUser(new EntityDtoOfInt64({ id: record.id })).subscribe(() => {
            this.notify.success(this.l('UnlockedTheUser', record.userName));
            this.reloadPage();
        });
    }

    getRolesAsString(roles): string {
        let roleNames = '';

        for (let j = 0; j < roles.length; j++) {
            if (roleNames.length) {
                roleNames = roleNames + ', ';
            }

            roleNames = roleNames + roles[j].roleName;
        }

        return roleNames;
    }

    reloadPage(): void {
        this.paginator().changePage(this.paginator().getPage());
    }

    exportToExcel($event): void {
        this._userServiceProxy
            .getUsersToExcel(
                this.filterText,
                this.permissionFilterTreeModal().getSelectedPermissions(),
                $event,
                this.role !== '' ? parseInt(this.role) : undefined,
                this.onlyLockedUsers,
                this.primengTableHelper.getSorting(this.dataTable())
            )
            .subscribe((result) => {
                this._fileDownloadService.downloadTempFile(result);
            });
    }

    createUser(): void {
        this.createOrEditUserModal().show();
    }

    uploadExcel(data: { files: File }): void {
        const formData: FormData = new FormData();
        const file = data.files[0];
        formData.append('file', file, file.name);

        this._httpClient
            .post<any>(this.uploadUrl, formData)
            .pipe(finalize(() => this.excelFileUpload().clear()))
            .subscribe((response) => {
                if (response.success) {
                    this.notify.success(this.l('ImportUsersProcessStart'));
                } else if (response.error != null) {
                    this.notify.error(this.l('ImportUsersUploadFailed'));
                }
            });
    }

    onUploadExcelError(): void {
        this.notify.error(this.l('ImportUsersUploadFailed'));
    }

    deleteUser(user: UserListDto): void {
        if (user.userName === AppConsts.userManagement.defaultAdminUserName) {
            this.message.warn(this.l('{0}UserCannotBeDeleted', AppConsts.userManagement.defaultAdminUserName));
            return;
        }

        this.message.confirm(this.l('UserDeleteWarningMessage', user.userName), this.l('AreYouSure'), (isConfirmed) => {
            if (isConfirmed) {
                this._userServiceProxy.deleteUser(user.id).subscribe(() => {
                    this.reloadPage();
                    this.notify.success(this.l('SuccessfullyDeleted'));
                });
            }
        });
    }

    showDynamicProperties(user: UserListDto): void {
        this.dynamicEntityPropertyManager()
            .getModal()
            .show('Analision.Authorization.Users.User', user.id.toString());
    }

    setUsersProfilePictureUrl(users: UserListDto[]): void {
        for (let i = 0; i < users.length; i++) {
            let user = users[i];
            this._localStorageService.getItem(AppConsts.authorization.encrptedAuthTokenName, function (err, value) {
                let profilePictureUrl =
                    AppConsts.remoteServiceBaseUrl +
                    '/Profile/GetProfilePictureByUser?userId=' +
                    user.id +
                    '&' +
                    AppConsts.authorization.encrptedAuthTokenName +
                    '=' +
                    encodeURIComponent(value.token);
                (user as any).profilePictureUrl = profilePictureUrl;
            });
        }
    }

    isUserLocked(user: UserListDto): boolean {
        if (!user.lockoutEndDateUtc) {
            return false;
        }

        let lockoutEndDateUtc = this._dateTimeService.changeDateTimeZone(user.lockoutEndDateUtc, 'UTC');
        return lockoutEndDateUtc > this._dateTimeService.getUTCDate();
    }

    showExcelColumnsSelectionModal(): void {
        this._userServiceProxy.getUserExcelColumnsToExcel().subscribe((result) => {
            this.excelColumnSelectionModal().show(result);
        });
    }
}
