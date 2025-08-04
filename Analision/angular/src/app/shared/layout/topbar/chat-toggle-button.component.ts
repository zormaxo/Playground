import { Component, Injector, OnInit, inject, input } from '@angular/core';
import { ThemesLayoutBaseComponent } from '../themes/themes-layout-base.component';
import { AbpSessionService } from 'abp-ng2-module';
import { DateTimeService } from '@app/shared/common/timing/date-time.service';

import { TooltipDirective } from 'ngx-bootstrap/tooltip';
import { LocalizePipe } from '@shared/common/pipes/localize.pipe';
import { FeatureCheckerPipe } from '@shared/common/pipes/feature-checker.pipe';

@Component({
    selector: 'chat-toggle-button',
    templateUrl: './chat-toggle-button.component.html',
    imports: [TooltipDirective, LocalizePipe, FeatureCheckerPipe],
})
export class ChatToggleButtonComponent extends ThemesLayoutBaseComponent implements OnInit {
    private _abpSessionService = inject(AbpSessionService);

    readonly customStyle = input(
        'btn btn-active-color-primary btn-active-light btn-custom btn-icon btn-icon-muted h-35px h-md-40px position-relative w-35px w-md-40px'
    );
    readonly iconStyle = input('flaticon-chat-2 fs-4');

    unreadChatMessageCount = 0;
    chatConnected = false;
    isHost = false;

    constructor(...args: unknown[]);

    public constructor() {
        const injector = inject(Injector);
        const _dateTimeService = inject(DateTimeService);

        super(injector, _dateTimeService);
    }

    ngOnInit(): void {
        this.registerToEvents();
        this.isHost = !this._abpSessionService.tenantId;
    }

    registerToEvents() {
        this.subscribeToEvent('app.chat.unreadMessageCountChanged', (messageCount) => {
            this.unreadChatMessageCount = messageCount;
        });

        this.subscribeToEvent('app.chat.connected', () => {
            this.chatConnected = true;
        });
    }
}
