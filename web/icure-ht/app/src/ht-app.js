/**
 @license
 Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
 This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 Code distributed by Google as part of the polymer project is also
 subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

import '@polymer/iron-icon/iron-icon.js'
import '@polymer/paper-dialog/paper-dialog.js'
import '@polymer/paper-item/paper-item.js'
import '@polymer/paper-card/paper-card.js'
import '@polymer/paper-button/paper-button.js'
import '@polymer/paper-icon-button/paper-icon-button.js'
import '@polymer/paper-listbox/paper-listbox.js'
import '@polymer/paper-tabs/paper-tabs.js'
import '@polymer/paper-tooltip/paper-tooltip.js'
import '@polymer/paper-menu-button/paper-menu-button.js'
import '@polymer/app-route/app-location.js'
import '@polymer/app-route/app-route.js'
import '@polymer/app-layout/app-layout.js'

import {PolymerElement,html} from "@polymer/polymer/polymer-element";

import './app-theme.js';
import './shared-styles.js';
import './vaadin-icure-theme.js';
import './elements/tk-localizer.js';
import './elements/splash-screen/splash-screen.js';
import './elements/ht-tools/ht-export-key.js';
import './elements/ht-tools/ht-import-keychain.js';
import './elements/ht-tools/ht-access-log.js';
import './elements/ht-tools/ht-my-profile.js';
import './elements/ht-app/ht-app-login-dialog.js';
import './elements/ht-app/ht-app-first-login-dialog.js';
import './elements/ht-app/ht-app-welcome.js';
import './elements/ht-app/ht-app-register-keypair-dialog.js';
import './elements/menu-bar/menu-bar.js';
import './elements/ht-app/ht-app-entities-selector.js';
import './elements/ht-app/ht-app-setup-prompt.js';
import './elements/icc-api/icc-api.js';
import './dialog-style.js';
import './elements/ht-spinner/ht-spinner.js';
import './elements/icons/icure-icons.js';
import './notification-style.js';
import moment from 'moment/src/moment'

import Worker from 'worker-loader!./workers/ehboxWebworker.js'

const runtime = require('offline-plugin/runtime');

import io from 'socket.io-client';
import {TkLocalizerMixin} from "./elements/tk-localizer";

class HtApp extends TkLocalizerMixin(PolymerElement) {
    static get template() {
        return html`
              <style include="shared-styles dialog-style notification-style">
            :host {
                display: block;
            }

            app-header {
                color: var(--app-text-color-light);
                background-color: var(--app-primary-color-dark);
                height: 64px;
                @apply --shadow-elevation-4dp;
            }

            app-header paper-icon-button {
                --paper-icon-button-ink-color: white;
            }

            app-toolbar {
                padding-right: 0;
                height: 64px;
                display: flex;
                flex-flow: row nowrap;
                justify-content: space-between;
                align-items: stretch;

            }

            :host iron-pages {
                height: calc(100% - 64px);
            }

            :host app-header-layout {
                height: 100%;
            }

            iron-icon {
                max-height: 20px;
                width: 20px;
                margin-right: 8px;
                color: rgba(255, 255, 255, 0.5);
            }

            iron-icon.smaller {
                height: 16px !important;
                width: 16px !important;
            }

            .icure-logo {
                height: 64px;
                margin-right: 24px;
            }


            paper-menu-button {
                --paper-menu-button-content: {
                    width: 380px;
                };
                --paper-menu-button-dropdown: {
                    padding: 0;
                }
            }

            .extra-menu {
                padding: 0;
            }

            .extra-menu-item {
                cursor: pointer;
                --paper-item-focused: {
                    background: white;
                }
            }

            .extra-menu-item:hover {
                background-color: var(--app-background-color-dark);
            }

            .extra-menu-item:last-child, .extra-menu-item:nth-last-child(2) {
                border-top: 1px solid var(--app-background-color-dark);
            }

            .extra-menu-item iron-icon {
                color: var(--app-text-color-disabled);
            }

            paper-tabs {
                --paper-tabs-selection-bar-color: var(--app-secondary-color);
                height: 64px;
            }

            paper-tab {
                --paper-tab-ink: var(--app-secondary-color);
            }

            paper-tab:hover {
                background: rgba(255, 255, 255, 0.05);
            }

            paper-tab.iron-selected {
                font-weight: bold;
            }

            paper-tab.iron-selected > iron-icon {
                color: var(--app-secondary-color);
            }

            .mobile-menu-btn {
                align-self: center;
                display: none;
            }

            .mobile-menu {
                position: fixed;
                top: 64px;
                left: 0;
                bottom: 0;
                background: var(--app-light-color);
                overflow: hidden;
                width: 180px;
                transform: translateX(-180px); /* 180 = menu-width */
                transition: .24s cubic-bezier(0.4, 0.0, 0.2, 1);
                visibility: hidden;
                @apply --shadow-elevation-6dp;
                padding: 0 1em;
                height: calc(100vh - 84px); /* 84px = app-header height and log */
                overflow-y: auto;
            }

            .mobile-menu.open {
                visibility: visible;
                transform: translateX(0);
            }

            .mobile-menu paper-button {
                font-size: 14px;
                color: var(--app-text-color);
                width: 100%;
                margin: 8px 0;
                justify-content: flex-start;
                --paper-button-ink-color: var(--app-secondary-color);
            }

            .mobile-menu paper-button iron-icon {
                color: var(--app-text-color-disabled);
            }

            .mobile-menu paper-button.iron-selected {
                font-weight: 600;
            }

            .mobile-menu paper-button.iron-selected iron-icon {
                color: var(--app-secondary-color);
            }

            .mobile-menu-overlay {
                position: absolute;
                top: 64px;
                left: 0;
                width: 100vw;
                height: calc(100vh - 84px);
                display: none;
                background: var(--app-text-color-disabled);
            }

            .mobile-menu-overlay.open {
                display: block;

            }

            .mobile-menu-container {
                display: none;
            }

            .ehbox-notification-panel,
            .electron-notification-panel {
                position: fixed;
                top: 76px;
                right: 16px;
                z-index: 1000;
                height: 56px;
                border-radius: 3px 0 0 3px;
                width: 0;
                opacity: 0;
            }


            .notification-panel {
                position: fixed;
                top: 50%;
                right: 0;
                z-index: 1000;
                color: white;
                font-size: 13px;
                background: rgba(255, 0, 0, 0.55);
                height: 48px;
                padding: 0 8px 0 12px;
                border-radius: 3px 0 0 3px;
                width: 0;
                opacity: 0;
            }


            footer.log-info {
                position: fixed;
                bottom: 0;
                width: 100%;
                padding: 0 24px;
                height: 20px;
                display: flex;
                flex-flow: row wrap;
                justify-content: space-between;
                align-items: center;
                background: var(--app-background-color-light);
                border-top: 1px solid var(--app-background-color-dark);
                font-size: 12px;
                box-sizing: border-box;
            }

            footer.log-info .user-email iron-icon, footer.log-info .eHealth-status-container iron-icon {
                color: var(--app-text-color);
                opacity: .5;
                height: 14px;
                width: 14px;
                margin: 0 4px 0 0;
                padding: 0;
            }

            footer.log-info .eHealth-status-container:hover, footer.log-info .user-email:hover, footer.log-info .versions span:hover {
                background: var(--app-background-color-dark);
            }


            footer.log-info > div {
                display: flex;
                flex-flow: row nowrap;
                justify-content: flex-start;
                align-items: center;
                font-family: 'Roboto', Arial, Helvetica, sans-serif;
                font-size: 12px;
                color: var(--app-text-color);
                margin: 0;
            }

            footer.log-info .user-email, footer.log-info .eHealth-status-container {
                display: flex;
                flex-flow: row nowrap;
                justify-content: flex-start;
                align-items: center;
                padding: 0 8px 0 0;
                border-right: 1px solid var(--app-background-color-dark);
            }

            footer.log-info .eHealth-status-container {
                padding: 0 8px 0 2px;
            }

            footer.log-info .eHealth-status-container .ehealth-connection-status, footer.log-info .eHealth-status-container .ehealth-mh-connection-status {
                content: '';
                display: block;
                height: 7px;
                width: 7px;
                border-radius: 8px;
                margin-left: 4px;
            }

            footer.log-info .versions {
                display: flex;
                flex-flow: row wrap;
                justify-content: flex-end;
            }

            footer.log-info .versions span {
                border-left: 1px solid var(--app-background-color-dark);
                padding: 0 8px;
                display: block;
            }

            .connected {
                background: var(--app-status-color-ok);
            }

            .pending {
                background: var(--app-status-color-pending);
                animation: pendingAnim .8s ease-in-out infinite alternate;
            }

            .disconnected {
                background: var(--app-status-color-nok);
            }

            .notconfigured {
                background: var(--app-status-color-nok);
            }

            @keyframes pendingAnim {
                from {
                    background: var(--app-status-color-pending);
                }
                to {
                    background: transparent;
                }
            }

            @media (max-width: 1024px) {
                paper-button {
                    margin-right: 10px;
                }

                paper-tabs {
                    display: none;
                }

                .mobile-menu-btn {
                    display: block;
                }

                .mobile-menu-container {
                    display: block;
                }
            }

            paper-dialog#ht-invite-hcp {
                width: 50vw;
                left: 0;
                transform: translateX(50%);
                margin: 0;
                display: flex;
                flex-direction: column;
            }

            #ht-invite-hcp h3.modal-title {
                margin: 0 !important;
            }

            paper-dialog#ht-invite-hcp-user-already-exists {
                width: 60%;
                left: 0;
                transform: translateX(50%);
                margin: 0;
            }

            .inviteHcpInput {
                width: 100%;
            }

            #ht-invite-hcp .buttons {
                position: initial !important;
                border-top: 1px solid var(--app-background-color-dark);
                color: var(--app-text-color-light);
            }

            #ht-invite-hcp .buttons * {
                background: var(--app-secondary-color-dark);
            }

            #ht-invite-hcp .buttons .modal-button--cancel {
                background: transparent;
                border: 1px solid var(--app-background-color-dark);
            }

            .formNewHcp {
                max-height: 312px;
                overflow-y: auto;
                width: 100%;
                box-sizing: border-box;
            }

            .formNewHcp paper-input {
                --paper-input-container-focus-color: var(--app-primary-color);
            }

            .top-gradient {
                line-height: 0;
                font-size: 0;
                display: block;
                background: linear-gradient(90deg, var(--app-secondary-color-dark), var(--app-secondary-color));
                height: 10px;
                position: relative;
                top: 0;
                left: 0;
                right: 0;
                margin: 0;
                border-radius: 2px 2px 0 0;
            }

            .timer {
                font-size: 10px;
                width: auto;
                text-align: center;
            }

            .nok {
                color: var(--app-status-color-nok) !important;
            }

            .taktik-logo {
                transform: translateY(-2px);
            }

            .modal-button {
                --paper-button-ink-color: var(--app-secondary-color);
                background-color: var(--app-secondary-color);
                color: var(--app-text-color);
                font-weight: 700;
                font-size: 14px;
                height: 40px;
                min-width: 100px;
                padding: 10px 1.2em;
                text-transform: capitalize;
            }

            .modal-button--close,
            .modal-button--cancel {
                background: transparent;
                color: var(--app-primary-color-dark);
                font-weight: 400;
            }

            .modal-button--save {
                box-shadow: var(--shadow-elevation-2dp_-_box-shadow);
                background: var(--app-secondary-color);
                color: var(--app-primary-color-dark);
                font-weight: 700;

            }

            ht-app-welcome {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 2000;
                background: white;
            }

            #tutorialDialog {
                height: 500px;
                width: 600px;
            }

            #mikronoErrorDialog {
                height: 300px;
                width: 600px;

            }

            .errorMikrono {
                color: var(--app-status-color-nok);
            }

            #appointmentsMigrationDialog {
                height: 400px;
                width: 600px;
            }

            #busySpinner {
                position: absolute;
                height: 100%;
                width: 100%;
                background: rgba(255, 255, 255, .6);
                z-index: 110;
                margin-top: 0;
                top: 0;
                left: 0;
            }

            #busySpinnerContainer {
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translateX(-50%) translateY(-50%);
                width: 100px;
                height: 100px;
            }

            #update-notification {
                z-index: 1000;
                position: fixed;
                right: 32px;
                top: 32px;
                height: 48px;
                width: 256px;
                font-size: 12px;
                font-weight: 500;
                background-color: var(--app-secondary-color);
                opacity: 1;
                display: flex;
                flex-flow: row wrap;
                justify-content: space-around;
                align-items: center;
                color: var(--app-text-color-light);
            }

            span.warn {
                color: var(--app-error-color);
                background: transparent !important;
            }

            paper-tooltip.big {
                transform: translateY(8px) scale(1.5);
            }

            paper-button[disabled] {
                background-color: var(--app-secondary-color-dark);
                color: var(--app-text-color-disabled);
                box-shadow: none;
            }

            @media screen and (max-width: 640px) {
                .timer {
                    display: none;
                }

                paper-dialog#ht-invite-hcp {
                    max-width: none !important;
                    width: 100% !important;
                    transform: none !important;
                }

                svg .logo-text {
                    display: none;
                }
            }

            @media screen and (max-width: 352px) {
                .logo {
                    width: 56px;
                }
            }

            @media screen and (max-width: 256px) {
                paper-menu-button#tools-and-parameters {
                    position: fixed;
                    top: 0;
                    right: 0;
                    transform: none;
                }

                .log-info {
                    position: fixed;
                    left: 64px;
                }

                .log-info span.user-email {
                    max-width: 33vw !important;
                }

                .logo {
                    display: none;
                }
            }
        </style>

        <icc-api id="api" host="[[icureUrl]]" fhc-host="[[fhcUrl]]" headers="[[headers]]"
                 credentials="[[credentials]]"></icc-api>

        <paper-item id="noehealth" class="notification-panel noehealth">[[localize('no_ehe_con','No Ehealth
            connection',language)]]
            <iron-icon icon="icons:warning"></iron-icon>
        </paper-item>

        <ht-app-setup-prompt id="setupPrompt"></ht-app-setup-prompt>

        <ht-app-welcome-tz id="welcome" i18n="[[i18n]]" language="[[language]]" resources="[[resources]]"
                           credentials="[[credentials]]" api="[[api]]" hidden="[[!showWelcomePage]]" on-login="login"
                           default-icure-url="[[defaultIcureUrl]]"
                           default-fhc-url="[[defaultFhcUrl]]"></ht-app-welcome-tz>

        <ht-app-login-dialog id="loginDialog" i18n="[[i18n]]" language="[[language]]" resources="[[resources]]"
                             credentials="[[credentials]]"
                             on-login="login" default-icure-url="[[defaultIcureUrl]]"
                             default-fhc-url="[[defaultFhcUrl]]"></ht-app-login-dialog>

        <ht-app-entities-selector id="ht-app-account-selector" i18n="[[i18n]]" language="[[language]]"
                                  resources="[[resources]]" credentials="[[credentials]]" api="[[api]]" user="[[user]]"
                                  entities="[[entities]]" credentials="[[credentials]]"
                                  on-redirect-another-entity="_redirectToAnotherEntity"></ht-app-entities-selector>

        <ht-app-first-login-dialog id="firstConnectionDialog" i18n="[[i18n]]" language="[[language]]"
                                   resources="[[resources]]" credentials="[[credentials]]" api="[[api]]"
                                   route="{{route}}" user="[[user]]"></ht-app-first-login-dialog>
        <ht-app-register-keypair-dialog id="registerKeyPairDialog" i18n="[[i18n]]" language="[[language]]"
                                        resources="[[resources]]" api="[[api]]" user="[[user]]"
                                        keyhcpid="[[keyHcpId]]"
                                        message="[[registerKeyPairDialogMessage]]" on-file-selected="importPrivateKey"
                                        on-key-scanned="importScannedPrivateKey"></ht-app-register-keypair-dialog>
        <ht-export-key id="export-key" i18n="[[i18n]]" language="[[language]]" resources="[[resources]]" api="[[api]]"
                       user="[[user]]"></ht-export-key>
        <ht-import-keychain id="ht-import-keychain" i18n="[[i18n]]" language="[[language]]" resources="[[resources]]"
                            api="[[api]]" user="[[user]]"></ht-import-keychain>
        <ht-access-log id="ht-access-log" i18n="[[i18n]]" language="[[language]]" resources="[[resources]]"
                       api="[[api]]" user="[[user]]"></ht-access-log>
        <ht-my-profile id="ht-my-profile" i18n="[[i18n]]" language="[[language]]" resources="[[resources]]"
                       api="[[api]]" user="[[user]]"
                       on-user-saved="_userSaved"></ht-my-profile>

        <template is="dom-if" if="[[updateMessage]]">
            <paper-card id="update-notification">
                <span>[[updateMessage]]</span>
                <template is="dom-if" if="[[updateAction]]">
                    <paper-button name="update" on-tap="doUpdate">
                        <iron-icon class="iron-icon" icon="play-for-work"></iron-icon>
                        <span>[[updateAction]]</span>
                    </paper-button>
                </template>
            </paper-card>
        </template>

        <app-location route="{{route}}" query-param="{{queryParams}}" use-hash-as-path="true"></app-location>
        <app-route route="{{route}}" pattern="/:page" data="{{routeData}}" tail="{{subroute}}"></app-route>
        <app-route route="{{subroute}}" pattern="/:page" data="{{subrouteData}}"></app-route>


        <app-drawer-layout fullbleed>
            <!-- Main content -->
            <app-header-layout fullbleed>
                <app-header slot="header" fixed condenses effects="waterfall">
                    <app-toolbar id="mainToolbar" class="" sticky>
                        <!-- Mobile Menu -->
                        <paper-icon-button class="mobile-menu-btn" icon="menu"
                                           on-tap="_triggerMenu"></paper-icon-button>
                        <div class="mobile-menu-container">
                            <div id="overlayMenu" class="mobile-menu-overlay" on-tap="_triggerMenu"></div>
                            <paper-listbox id="mobileMenu" class="mobile-menu" selected="[[routeData.page]]"
                                           attr-for-selected="name">
                                <paper-button name="main" on-tap="doRoute">
                                    <iron-icon class="iron-icon" icon="home"></iron-icon>
                                    [[localize('sum','Summary',language)]]
                                </paper-button>
                                <paper-button name="pat" on-tap="doRoute">
                                    <iron-icon icon="vaadin:user-heart"></iron-icon>
                                    [[localize('pat','Patients',language)]]
                                </paper-button>
                                <paper-button name="hcp" on-tap="doRoute">
                                    <iron-icon icon="vaadin:hospital"></iron-icon>
                                    [[localize('hc_par','HC parties',language)]]
                                </paper-button>
                                <paper-button name="msg" on-tap="doRoute">
                                    <iron-icon icon="communication:email"></iron-icon>
                                    [[localize('msg','Message',language)]]
                                </paper-button>
                                <paper-button name="diary" on-tap="checkAndLoadMikrono">
                                    <iron-icon icon="date-range"></iron-icon>
                                    [[localize('diary','Diary',language)]]
                                </paper-button>
                                <!-- <template is="dom-if" if="[[isAdmin]]">-->
                                <paper-button name="admin" on-tap="doRoute">
                                    <iron-icon icon="vaadin:cog-o"></iron-icon>
                                    [[localize('admin')]]
                                </paper-button>
                                <!--</template>-->
                            </paper-listbox>
                        </div>
                        </div>
                        <div style="display: flex; align-items: center;">
                            <div name="main" on-tap="doRoute" style="cursor:pointer">
                                <svg version="1.1"
                                     xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                                     xmlns:a="http://ns.adobe.com/AdobeSVGViewerExtensions/3.0/"
                                     x="0px" y="0px" width="92px" height="64px" viewBox="0 0 92 64"
                                     style="enable-background:new 0 0 92 64;" xml:space="preserve" class="icure-logo">
                                    <style type="text/css">
                                    .st1 {
                                        fill: #FFFFFF;
                                    }

                                    .st2 {
                                        fill: #66DEA1;
                                    }
                                    </style>
                                    <defs>
                                    </defs>
                                    <g>
                                        <g>
                                            <rect x="44.3" y="32.2" class="st1" width="1.3" height="12.6"/>
                                            <path class="st1"
                                                  d="M45,27.6c-0.6,0-1,0.5-1,1.2c0,0.6,0.4,1.2,1,1.2h0c0.6,0,1-0.5,1-1.2C46,28.1,45.6,27.6,45,27.6z"/>
                                            <path class="st1" d="M60.2,43c-1,0.5-2.3,0.8-3.7,0.8c-4.3,0-6.9-2.9-6.9-7.7c0-5,2.6-8,7-8c1.3,0,2.5,0.3,3.4,0.7l0.1,0l0.4-1.2
                                                l-0.1,0c-0.4-0.2-1.7-0.8-3.8-0.8c-5,0-8.4,3.7-8.4,9.2c0,6.6,4.2,9,7.9,9c2.1,0,3.7-0.5,4.5-0.9l0.1,0L60.2,43L60.2,43z"/>
                                            <path class="st1" d="M72.3,41.7v-9.5H71V40c0,0.4-0.1,0.9-0.2,1.3c-0.5,1.1-1.6,2.4-3.4,2.4c-2,0-3-1.5-3-4.5v-7.1H63v7.3
                                                c0,5,2.9,5.6,4.1,5.6c1.9,0,3.3-1.2,4-2.3l0.1,2.1h1.3l0-0.1C72.3,43.8,72.3,42.9,72.3,41.7z"/>
                                            <path class="st1" d="M80.5,31.9c-1.4,0-2.7,1-3.3,2.6l0-2.3h-1.3l0,0.1C76,33.4,76,34.6,76,36v8.8h1.3v-6.9c0-0.5,0-0.9,0.1-1.2
                                                c0.3-2.1,1.5-3.4,3-3.4c0.2,0,0.4,0,0.5,0l0.1,0V32L81,32C80.9,31.9,80.7,31.9,80.5,31.9z"/>
                                            <path class="st1" d="M91.1,34.1c-0.8-1.4-2.1-2.2-3.8-2.2c-3.2,0-5.4,2.7-5.4,6.8c0,3.8,2.2,6.3,5.5,6.3c2.1,0,3.3-0.6,3.7-0.8
                                                l0.1,0L91,43.1l-0.1,0c-0.7,0.4-1.6,0.7-3.2,0.7c-1.3,0-4.3-0.5-4.4-5.3h8.6l0-0.1C92,38.1,92,38,92,37.6
                                                C92,37.1,91.9,35.5,91.1,34.1z M83.4,37.3c0.3-1.9,1.4-4.1,3.8-4.1c1,0,1.8,0.3,2.3,0.9c0.9,1,1.1,2.5,1.1,3.2H83.4z"/>
                                        </g>
                                        <path class="st2" d="M36.2,38.4c-0.4-4.3-2.9-6.6-7.4-6.6l-5.5,0c-0.2,0-0.4,0.1-0.5,0.3l-0.6,1.5l-1.9-8.4c0-0.3-0.3-0.5-0.6-0.5
                                        c-0.3,0-0.5,0.2-0.6,0.5l-2.3,10.4L15.4,29c0-0.3-0.3-0.5-0.6-0.5c-0.3,0-0.5,0.2-0.6,0.4L13,31.8H8.3V33h5.2
                                        c0.3,0,0.5-0.2,0.6-0.4l0.6-1.5l1.6,7.2c0.1,0.3,0.3,0.5,0.6,0.5c0.3,0,0.5-0.2,0.6-0.5l2.2-10.3l1.7,7.5c0,0.3,0.2,0.5,0.5,0.5
                                        c0.2,0.1,0.5-0.1,0.6-0.3l1.2-2.7l5.1,0c3.8,0,5.8,1.5,6.3,4.7c0.3,2-0.2,3.8-1.3,5.1c-1.2,1.4-3,2-5,1.9H8.8
                                        c-4.1,0-7.5-3.4-7.6-7.6C1,32.8,4,29.1,8,28.8c0.3,0,0.5-0.3,0.5-0.5c0.3-2.3,1.2-4.4,2.7-6c1.8-1.9,4.2-3,6.8-3c2.6,0,5,1.1,6.8,3
                                        c1.2,1.3,2.3,3.7,2.7,6.4l0,0.2l0.2,0c0.2,0,0.7-0.1,0.8-0.1l0.2,0l0-0.2c-0.5-3-1.6-5.6-3-7.1c-2-2.1-4.7-3.3-7.6-3.3
                                        c-2.9,0-5.6,1.2-7.6,3.3c-1.6,1.7-2.6,3.9-3,6.3C3.1,28.3-0.1,32.3,0,37c0.1,2.4,1,4.6,2.7,6.4C4.4,45.1,6.6,46,8.8,46l19.7,0
                                        c0.1,0,0.2,0,0.4,0c2.2,0,4.2-0.9,5.6-2.4C35.7,42.2,36.3,40.4,36.2,38.4z"/>
                                    </g>
                                </svg>
                            </div>
                            <!-- Regular Tabs Menu -->
                            <paper-tabs selected="[[routeData.page]]" attr-for-selected="name" role="navigation">
                                <paper-tab name="main" on-tap="doRoute">
                                    <iron-icon class="iron-icon" icon="home"></iron-icon>
                                    [[localize('sum','Summary',language)]]
                                </paper-tab>
                                <paper-tab name="pat" on-tap="doRoute">
                                    <iron-icon class="smaller" icon="vaadin:user-heart"></iron-icon>
                                    [[localize('pat','Patients',language)]]
                                </paper-tab>
                                <paper-tab name="hcp" on-tap="doRoute">
                                    <iron-icon class="smaller" icon="vaadin:hospital"></iron-icon>
                                    [[localize('hc_par','HC parties',language)]]
                                </paper-tab>
                                <paper-tab name="msg" on-tap="doRoute">
                                    <iron-icon class="smaller" icon="communication:email"></iron-icon>
                                    [[localize('msg','Message',language)]]
                                </paper-tab>
                                <paper-tab name="diary" on-tap="checkAndLoadMikrono">
                                    <iron-icon icon="date-range"></iron-icon>
                                    [[localize('diary','Diary',language)]]
                                </paper-tab>
                                <!--<template is="dom-if" if="[[isAdmin]]">-->
                                <paper-tab name="admin" on-tap="doRoute">
                                    <iron-icon icon="settings"></iron-icon>
                                    [[localize('admin')]]
                                </paper-tab>
                                <!--</template>-->
                            </paper-tabs>
                        </div>
                        <div style="display:flex; align-items: center; width: 120px;">
                            <!-- Generator: Adobe Illustrator 22.1.0, SVG Export Plug-In  -->
                            <svg version="1.1"
                                 xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                                 xmlns:a="http://ns.adobe.com/AdobeSVGViewerExtensions/3.0/"
                                 x="0px" y="0px" width="100px" height="17.3px" viewBox="0 0 100 17.3"
                                 style="enable-background:new 0 0 100 17.3;"
                                 xml:space="preserve" class="taktik-logo">

                            <defs>
                            </defs>
                                <polygon class="st1"
                                         points="0,8.3 6.9,8.3 6.9,17.2 10,17.2 10,8.3 16.9,8.3 16.9,5.3 0,5.3 "/>
                                <path class="st1" d="M36.1,17.2v-8c0-2.1-1.6-3.9-3.6-3.9H19.3v3H33v1.5H22.5c-2.1,0-3.8,1.7-3.8,3.7c0,2.1,1.8,3.8,4,3.8H36.1z
                            M21.9,12.8H33v1.5H21.9V12.8z"/>
                                <polygon class="st1"
                                         points="56.8,8.3 63.7,8.3 63.7,17.2 66.8,17.2 66.8,8.3 73.7,8.3 73.7,5.3 56.8,5.3 "/>
                                <rect x="75.7" y="5.3" class="st1" width="3.1" height="11.9"/>
                                <rect x="75.7" class="st1" width="3.1" height="3.1"/>
                                <path class="st1" d="M43,9.4C43,9.4,43,9.4,43,9.4C43,9.4,43,9.4,43,9.4z"/>
                                <path class="st1" d="M86.9,9.4C87,9.4,87,9.4,86.9,9.4C87,9.4,87,9.4,86.9,9.4z"/>
                                <path class="st1" d="M91.3,12.3l8.7,5h-6.3l-5.2-3.1c-0.2-0.1-0.5-0.3-0.7-0.4c-0.2-0.1-0.4-0.3-0.6-0.4c-0.2-0.2-0.4-0.4-0.6-0.6
                            c0,0,0-0.1-0.1-0.1c-0.2-0.3-0.4-0.7-0.4-1.2v5.7h-3.1V5.4h3.1V11c0.1-0.6,0.3-1.2,0.7-1.6c0,0,0,0,0.1-0.1c0,0,0,0,0,0
                            c0.3-0.3,0.7-0.6,1.3-0.9l5.5-3.1h6.3l-8.7,4.9l-1.7,1L91.3,12.3z"/>
                                <path class="st1" d="M43.1,9.4C43.1,9.4,43.1,9.4,43.1,9.4C43.1,9.4,43.1,9.4,43.1,9.4z"/>
                                <path class="st1" d="M43.1,9.4C43.1,9.4,43.1,9.4,43.1,9.4C43.1,9.4,43.1,9.4,43.1,9.4z"/>
                                <path class="st1" d="M47.4,12.3l8.7,5h-6.3l-5.2-3.1c-0.2-0.1-0.5-0.3-0.7-0.4c-0.2-0.1-0.4-0.3-0.6-0.4c-0.2-0.2-0.4-0.4-0.6-0.6
                            c0,0,0-0.1-0.1-0.1c-0.2-0.3-0.4-0.7-0.4-1.2v5.7h-3.1V5.4h3.1V11c0.1-0.6,0.3-1.2,0.7-1.6c0,0,0,0,0.1-0.1c0,0,0,0,0,0
                            c0.3-0.3,0.7-0.6,1.3-0.9l5.5-3.1h6.3l-8.7,4.9l-1.7,1L47.4,12.3z"/>
                            </svg>


                            <paper-tooltip class="big" position="left" for="tools-and-parameters">
                                [[localize('tools_and_parameters','Tools and parameters',language)]]
                            </paper-tooltip>
                            <paper-menu-button id="tools-and-parameters" horizontal-align="right" close-on-activate
                                               no-overlap no-animations focused="false">
                                <paper-icon-button icon="icons:more-vert" slot="dropdown-trigger"
                                                   alt="menu"></paper-icon-button>
                                <paper-listbox class="extra-menu" slot="dropdown-content"
                                               stop-keyboard-event-propagation>
                                    <div class="dropdown-content"></div>
                                    <!-- workaround to fix that the fist element of the list was always focus -->

                                    <paper-item class="extra-menu-item" on-tap="_openExportKey">
                                        [[localize('tra_pri_key_/_con_tab','Transfer private key / Connect
                                        tablet',language)]]
                                    </paper-item>
                                    <paper-item class="extra-menu-item" on-tap="_importKeychain">
                                        [[localize('imp_my_ehe_key','Import my eHealth keychain',language)]]
                                    </paper-item>
                                    <paper-item class="extra-menu-item" on-tap="_inviteHCP">
                                        [[localize('inviteHCP','Invite a colleague ',language)]]
                                    </paper-item>
                                    <paper-item class="extra-menu-item" on-tap="_logList">[[localize('acc_log','Access
                                        Log',language)]]
                                    </paper-item>
                                    <paper-item class="extra-menu-item" on-tap="_tuto">
                                        [[localize('tutorial','Tutorial',language)]]
                                    </paper-item>
                                    <paper-item class="extra-menu-item" on-tap="mikronoAppointmentsMigration">
                                        [[localize('imp_ep_app','Import Epicure appointments',language)]]
                                    </paper-item>
                                    <paper-item class="extra-menu-item" on-tap="_myProfile">
                                        <iron-icon icon="icons:account-circle"></iron-icon>
                                        [[localize('my_pro','My profile',language)]]
                                    </paper-item>
                                    <paper-item class="extra-menu-item" name="logout" on-tap="doRoute">
                                        <iron-icon icon="power-settings-new"></iron-icon>
                                        [[localize('log_out','Log out',language)]]
                                    </paper-item>
                                </paper-listbox>
                            </paper-menu-button>

                        </div>

                    </app-toolbar>

                </app-header>
                <iron-pages
                        selected="[[view]]"
                        attr-for-selected="name"
                        fallback-selection="view404"
                        role="main">
                    <ht-main name="main" api="[[api]]" user="[[user]]" i18n="[[i18n]]" language="[[language]]"
                             resources="[[resources]]" route="{{subroute}}" socket="[[socket]]">
                        <splash-screen></splash-screen>
                    </ht-main>
                    <ht-pat name="pat" api="[[api]]" i18n="[[i18n]]" language="[[language]]" resources="[[resources]]"
                            user="[[user]]" route="{{subroute}}"
                            socket="[[socket]]" on-user-saved="_userSaved" on-idle="resetTimer">
                        <splash-screen></splash-screen>
                    </ht-pat>
                    <ht-hcp name="hcp" api="[[api]]" i18n="[[i18n]]" language="[[language]]" resources="[[resources]]"
                            user="[[user]]" route="{{subroute}}">
                        <splash-screen></splash-screen>
                    </ht-hcp>
                    <ht-msg name="msg" api="[[api]]" i18n="[[i18n]]" language="[[language]]" resources="[[resources]]"
                            user="[[user]]" credentials="[[credentials]]"
                            on-trigger-open-my-profile="_triggerOpenMyProfile"
                            on-trigger-goto-admin="_triggerOpenAdminGroupsManagementSubMenu">
                        <splash-screen></splash-screen>
                    </ht-msg>
                    <ht-diary id="htDiary" name="diary" api="[[api]]" i18n="[[i18n]]" language="[[language]]"
                              resources="[[resources]]" user="[[user]]" credentials="[[credentials]]">
                        <splash-screen></splash-screen>
                    </ht-diary>
                    <ht-admin id="htAdmin" name="admin" api="[[api]]" i18n="[[i18n]]" language="[[language]]"
                              resources="[[resources]]" user="[[user]]" credentials="[[credentials]]"
                              socket="[[socket]]">
                        <splash-screen-tz></splash-screen-tz>
                    </ht-admin>
                    <ht-view404 name="view404"></ht-view404>
                </iron-pages>
            </app-header-layout>
            <footer class="log-info">
                <div>
                    <div class="user-email">
                        <iron-icon icon="icons:account-circle"></iron-icon>
                        [[user.login]]
                    </div>
                    <div class="eHealth-status-container">
                        <iron-icon icon="icure-svg-icons:ehealth"></iron-icon>
                        <span>eHealth</span>
                        <span id="eHealthStatus" class="ehealth-connection-status pending"></span>
                        <paper-tooltip for="eHealthStatus" position="top">[[localize('ehe','eHealth
                            status',language)]]
                        </paper-tooltip>
                    </div>
                    <template is="dom-if" if="[[hasMHCertificate]]">
                        <div class="eHealth-status-container">
                            <iron-icon icon="icure-svg-icons:ehealth"></iron-icon>
                            <span>[[localize('medical_house','Medical House',language)]] eHealth</span>
                            <span id="eHealthMHStatus" class="ehealth-mh-connection-status pending"></span>
                            <paper-tooltip for="eHealthMHStatus" position="top">[[localize('eheMM','eHealth status for
                                Medical House certificats',language)]]
                            </paper-tooltip>
                        </div>
                    </template>
                </div>
                <div class$="versions [[_versionOk(electronVersionOk,backendVersionOk)]]">
                    <span class="frontVersion">frontend: [AIV]{version}[/AIV]</span>
                    <span class="backVersion">backend: [[backendVersion]]</span>
                    <template is="dom-if" if="[[isElectron]]">
                        <span class$="electronVersion [[_versionOk(electronVersionOk,'true')]]">e—[[electronVersion]]</span>
                    </template>
                </div>
                <paper-tooltip for="ehealth" position="top">
                    <template is="dom-if" if="[[api.tokenId]]">
                        [[localize('ehe_is_con','eHealth is connected',language)]]
                    </template>
                    <template is="dom-if" if="[[!api.tokenId]]">
                        [[localize('ehe_is_not_con','eHealth is not connected',language)]]
                    </template>
                </paper-tooltip>
                <paper-tooltip for="ehealthMH" position="top">
                    <template is="dom-if" if="[[api.tokenIdMH]]">
                        [[localize('ehe_is_con','eHealth is connected',language)]]
                    </template>
                    <template is="dom-if" if="[[!api.tokenIdMH]]">
                        [[localize('ehe_is_not_con','eHealth is not connected',language)]]
                    </template>
                </paper-tooltip>
            </footer>
        </app-drawer-layout>

        <template is="dom-if" if="[[busySpinner]]">
            <div id="busySpinner">
                <div id="busySpinnerContainer">
                    <ht-spinner class="spinner" active></ht-spinner>
                </div>
            </div>
        </template>

        <paper-dialog id="ht-invite-hcp">
            <h3 class="modal-title">[[localize('inviteHCP','Invite a colleague ',language)]]</h3>
            <div id="" class="content formNewHcp">
                <paper-input class="inviteHcpInput" label="[[localize('las_nam','Last name',language)]]"
                             value="{{lastName}}"></paper-input>
                <paper-input class="inviteHcpInput" label="[[localize('fir_nam','First name',language)]]"
                             value="{{firstName}}"></paper-input>
                <paper-input class="inviteHcpInput" label="[[localize('ema','Email',language)]]"
                             value="{{email}}"></paper-input>
                <paper-input class="inviteHcpInput" label="[[localize('inami','NIHII',language)]]"
                             value="{{nihii}}"></paper-input>
                <paper-input class="inviteHcpInput" label="[[localize('ssin','SSIN',language)]]"
                             value="{{ssin}}"></paper-input>
            </div>

            <div class="buttons">
                <span class="warn">[[warn]]</span>
                <paper-button dialog-dismiss class="modal-button modal-button--cancel">
                    [[localize('can','Cancel',language)]]
                </paper-button>
                <paper-button dialog-confirm autofocus on-tap="confirmUserInvitation"
                              class="modal-button modal-button--save" disabled="[[!validInvite]]">
                    [[localize('invite','Invite',language)]]
                </paper-button>
            </div>
        </paper-dialog>
        <paper-dialog id="ht-invite-hcp-link">
            <h3>Lien de première connexion</h3>
            <h4>[[invitedHcpLink]]</h4>
        </paper-dialog>


        <paper-dialog id="ht-invite-hcp-user-already-exists">
            <h3>[[localize('warning','Attention',language)]]</h3>
            <h4> [[localize( 'email_address_already_exists', 'L\\'adresse email de ce collègue existe déjà\\, veuillez svp
                en spécifier une autre', language)]]</h4>
            <paper-button dialog-confirm autofocus class="modal-button modal-button--close" on-tap="_inviteHCP">
                [[localize('clo','Close',language)]]
            </paper-button>
        </paper-dialog>

        <paper-dialog id="tutorialDialog">
            <h3>[[localize('tutorialList','Tutorial list',language)]]</h3>
            <div id="tutorialContainer">
                <ul>
                    <li><a href="../docs/1_1_connexion.pdf" target="_blank">Connexion</a></li>
                    <li><a href="../docs/1_2_Configuration_du_compte_utilisateur.pdf" target="_blank">Configuration du
                        compte utilisateur</a></li>
                    <li><a href="../docs/1_3_Configuration_et_importation_du_trousseau_eHealth.pdf" target="_blank">Configuration
                        et importation du trousseau eHealth</a></li>
                    <li><a href="../docs/1_4_dashboard_first_use.pdf" target="_blank">Tableau de bord</a></li>
                    <li><a href="../docs/2_1_presentation_generale.pdf" target="_blank">Présentation générale</a></li>
                    <li><a href="../docs/2_2_creation_et_configuration_patient.pdf" target="_blank">Création et
                        configuration d'un patient</a></li>
                    <li><a href="../docs/2_3_Partage_de_patients.pdf" target="_blank">Partager un patient</a></li>
                    <li><a href="../docs/3_1_dossier_complet.pdf" target="_blank">Dossier complet</a></li>
                    <li><a href="../docs/manuel.pdf" target="_blank">Manuel</a></li>
                </ul>
            </div>
            <div class="buttons">
                <paper-button dialog-dismiss>[[localize('clo','Close',language)]]</paper-button>
            </div>
        </paper-dialog>

        <paper-item id="ehboxInboxMessage" class="notification-container grey">
            <iron-icon class="notification-icn" icon="communication:email"></iron-icon>
            <div class="notification-msg">[[ehboxWebWorkerMessage]]</div>
            <paper-button class="notification-btn single-btn" on-tap="_closeNotif">[[localize('clo','Close',
                language)]]
            </paper-button>
        </paper-item>

        <paper-item id="electronMessage" class="notification-container electron-notification-panel">
            <iron-icon class="notification-icn" icon="icons:warning"></iron-icon>
            <div class="notification-msg">[[localize('electron_update_available','New electron version
                available',language)]]
            </div>
            <paper-button class="notification-btn single-btn" on-tap="_closeNotif">[[localize('clo','Close',
                language)]]
            </paper-button>
        </paper-item>

        <paper-dialog id="mikronoErrorDialog">
            <h3>Erreur lors de la création de votre compte agenda</h3>
            <div class="errorMikrono">
                <template is="dom-if" if="[[!mikronoError.addresses]]"><h5>- Adresse manquante</h5></template>
                <template is="dom-if" if="[[!mikronoError.workAddresses]]"><h5>- Adresse de type travail manquante</h5>
                </template>
                <template is="dom-if" if="[[!mikronoError.workMobile]]"><h5>- N° de gsm manquant</h5></template>
                <template is="dom-if" if="[[!mikronoError.workEmail]]"><h5>- Email manquant</h5></template>
                <template is="dom-if" if="[[!mikronoError.token]]"><h5>- Token manquant</h5></template>
                <template is="dom-if" if="[[!mikronoError.error]]"><h5>- Erreur lors de la création du compte</h5>
                </template>
            </div>
            <div class="buttons">
                <paper-button dialog-dismiss>[[localize('clo','Close',language)]]</paper-button>
            </div>
        </paper-dialog>

        <paper-dialog id="appointmentsMigrationDialog">
            <h4>Migration de vos rendez-vous</h4>
            <vaadin-grid id="migrItem" class="material" items="[[migrationItems]]">
                <vaadin-grid-column>
                    <template class="header">
                        Opération en cours
                    </template>
                    <template>
                        <div>[[item.item]]</div>
                    </template>
                </vaadin-grid-column>
            </vaadin-grid>
        </paper-dialog>
`;
    }

    static get is() {
        return 'ht-app'
    }

    static get properties() {
        return {
            versions: {
                type: Object,
                value: function () {
                    return require('../versions.json');
                }
            },
            api: {
                type: Object,
                noReset: true,
                value: null
            },
            user: {
                type: Object,
                value: null
            },
            keyHcpId: {
                type: Object,
                value: null,
            },
            language: {
                type: String,
                noReset: true,
                value: 'fr'
            },
            i18n: {
                Type: Object,
                noReset: true,
                value() {
                    moment.locale('fr')
                    const res = {
                        monthNames: moment.months(),
                        weekdays: moment.weekdays(),
                        weekdaysShort: moment.weekdaysShort(),
                        firstDayOfWeek: moment.localeData().firstDayOfWeek(),
                        week: 'Semaine',
                        calendar: 'Calendrier',
                        clear: 'Clear',
                        today: 'Aujourd\'hui',
                        cancel: 'Annuler',
                        formatDate(d) {
                            //return moment(d).format(moment.localeData().longDateFormat('L'))
                            return moment(d).format('DD/MM/YYYY')
                        },
                        parseDate(s) {
                            return moment(s, 'DD/MM/YYYY').toDate()
                        },
                        formatTitle(monthName, fullYear) {
                            return monthName + ' ' + fullYear
                        }
                    }
                    return res
                }
            },
            view: {
                type: String,
                reflectToAttribute: true,
                observer: '_viewChanged',
                noReset: true
            },
            headers: {
                type: Object,
                value: {"Content-Type": "application/json"}
            },
            credentials: {
                type: Object,
                value: {logout: false}
            },
            lazyPages: {
                type: Object,
                noReset: true,
                value: {
                    main() {
                        import(/* webpackChunkName: "ht-main" */ './ht-main.js')
                    },
                    pat() {
                        import(/* webpackChunkName: "ht-pat" */ './ht-pat.js')
                    },
                    hcp() {
                        import(/* webpackChunkName: "ht-hcp" */ './ht-hcp.js')
                    },
                    msg() {
                        import(/* webpackChunkName: "ht-msg" */ './ht-msg.js')
                    },
                    diary() {
                        //import(/* webpackChunkName: "ht-diary" */ './ht-diary.html')
                    },
                    admin() {
                        //import(/* webpackChunkName: "ht-admin" */ './ht-admin.html')
                    },
                    view404() {
                        //import(/* webpackChunkName: "ht-view404" */ './ht-view404.html')
                    }
                }
            },
            resources: {
                value() {
                    return require('./elements/language/language.json')
                },
                noReset: true
            },
            invitedHcpLink: {
                type: String,
                value: ""
            },
            disconnectionTimer: {
                type: Number,
                value: 60,
                noReset: true
            },
            connectionTime: {
                type: Number,
                noReset: true
            },
            ehboxWebWorkerMessage: {
                type: String,
                value: ""
            },
            EhboxCheckingActive: {
                type: Boolean,
                value: false
            },
            worker: {
                type: Worker,
                noReset: true
            },
            timeOutId: {
                type: String
            },
            keyPairKeystore: {
                type: Array,
                value: () => []
            },
            showWelcomePage: {
                type: Boolean,
                value: false
            },
            entities: {
                type: Array,
                value: () => []
            },
            isMultiUser: {
                type: Boolean,
                value: true
            },
            mikronoError: {
                type: Object,
                value: () => {
                }
            },
            migrationItems: {
                type: Array,
                value: () => []
            },
            busySpinner: {
                type: Boolean,
                value: false
            },
            updateMessage: {
                type: String,
                value: null
            },
            updateAction: {
                type: String,
                value: null
            },
            validInvite: {
                type: Boolean,
                value: false
            },
            warn: {
                type: String
            },
            validMail: {
                type: Boolean,
                value: null
            },
            isElectron: {
                type: Boolean,
                value: false
            },
            electronVersion: {
                type: String,
                value: ""
            },
            electronVersionOk: {
                type: Boolean,
                value: true
            },
            backendVersionOk: {
                type: Boolean,
                value: true
            },
            socket: {
                type: Object,
                value: null
            }
        }
    }

    static get observers() {
        return [
            '_routePageChanged(routeData.page)',
            '_isValidInvite(lastName,firstName,validMail)',
            'isMailValid(email)'
        ]
    }

    constructor() {
        super()
    }

    _closeNotif(e) {
        e.target.parentElement.classList.remove('notification');
    }


    _isValidInvite() {
        this.set('validInvite', this.lastName && this.firstName && this.lastName.length && this.firstName.length && this.validMail)
    }

    isMailValid(str) {
        setTimeout(() => {
            if (str.length) {
                const filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

                if (filter.test(str)) {
                    this.set('warn', '')
                    this.set('validMail', true)
                } else {
                    this.set('warn', this.localize('please_valid_mail', 'Please enter valid email', this.language))
                    this.set('validMail', false)
                }
            }
        }, 2000)
    }

    setUrls() {
        const params = this.route.__queryParams //_.fromPairs((this.route.path.split('?')[1] || "").split('&').map(p => p.split('=')))

        this.set('icureUrl', params.icureUrl || `https://backend${window.location.href.replace(/https?:\/\/.+?(b?)\.icure\.cloud.*/, '$1')}.svc.icure.cloud/rest/v1`)
        this.set('fhcUrl', params.fhcUrl || (window.location.href.includes('https://tzb') ? 'https://fhctz.icure.cloud' : 'https://fhcprd.icure.cloud'))

        this.set('defaultIcureUrl', this.icureUrl)
        this.set('defaultFhcUrl', this.fhcUrl)

    }

    _updateServerUrl(icureurl, fhcurl) {

        if (icureurl) this.set('icureUrl', icureurl)
        if (fhcurl) this.set('fhcUrl', fhcurl)

    }

    reset() {
        const props = HtApp.properties
        Object.keys(props).forEach(k => {
            if (!props[k].noReset) {
                this.set(k, (typeof props[k].value === 'function' ? props[k].value() : (props[k].value || null)))
            }
        })
        ;['#ht-main', '#ht-pat', '#ht-hcp', '#ht-msg'].map(x => this.root.querySelector(x)).map(el => el && typeof el.reset === 'function' && el.reset())
    }

    _checkShowWelcomePage() {
        this.api.icure().isReady().then(ok => {
            if (ok === 'false') {
                this.set('showWelcomePage', true)
                this.$["loginDialog"].disable()
                this.$["setupPrompt"].close()
            } else if (ok !== 'true') {
                this.$["setupPrompt"].close()
                this.$["loginDialog"].disable()
                setTimeout(() => this._checkShowWelcomePage(), 10000)
            } else {
                localStorage.setItem('last_app_startup', Date.now().toString())
                this.$["loginDialog"].enable()
                this.$["setupPrompt"].close()
            }
        }).catch(() => {
            if (!localStorage.getItem('last_app_startup')) this.$["setupPrompt"].open()
            this.$["loginDialog"].disable()
            setTimeout(() => this._checkShowWelcomePage(), 10000)
        })
    }

    ready() {
        super.ready()

        this.set("isMultiUser", true)

        const url = new URL(window.location.href)
        if (!url.hash || !url.hash.startsWith('#/')) {
            url.hash = '#/'
            window.location.replace(url.toString())
        }

        window.app = this

        if (!this.icureUrl) {
            this.setUrls()
        }

        this.set('api', this.$.api)

        //init socket io
        this.set("socket", null)
        this.api.isElectronAvailable().then(electron => {
            if (electron) {
                this.set("socket", io('http://localhost:16042'))

                this.socket.on("connect", () => {
                    console.log("connection avec le socket de electron")
                })

                this.socket.on("update-downloaded", msg => {
                    console.log(msg)
                    this.$['electronMessage'].classList.add('notification');
                    setTimeout(() => {
                        this.$['electronMessage'].classList.remove('notification');
                    }, 7500);
                })
                this.notifyPath("socket");
            }

        })

        document.onmousemove = this.resetTimer.bind(this)
        document.onkeypress = this.resetTimer.bind(this)

        runtime.install({
            onUpdating: () => {
                console.log('SW Event: ', 'onUpdating');
                this.set('updateMessage', this.localize('new_upd_det', 'New update detected.', this.language))
                this.set('updateAction', null)
            },
            onUpdateReady: () => {
                console.log('SW Event: ', 'onUpdateReady');
                this.set('updateMessage', this.localize('new_upd_rea', 'New update ready', this.language))
                this.set('updateAction', this.localize('upd', 'Update'))
            },
            onUpdated: () => {
                console.log('SW Event: ', 'onUpdated');
                window.location.reload();
            },

            onUpdateFailed: () => {
                console.log('SW Event: ', 'onUpdateFailed');
                this.set('updateMessage', this.localize('upd_fail', 'Update failed, please refresh.'))
            }
        });

        this.api.isElectronAvailable().then(electron => {
            this.set("isElectron", electron)
            if (this.isElectron) {
                fetch('http://127.0.0.1:16042/getVersion')
                    .then((response) => {
                        return response.json()
                    })
                    .then(res => {
                        if (res.version) {
                            this.set("electronVersion", res.version)
                            this.set("electronVersionOk", this.versions.electron.includes(res.version))
                        }
                    })
            } else {
                this.set("electronVersionOk", true)
            }
        })

        this.api.icure().getVersion().then(v => {
            this.set("backendVersion", v.substring(0, v.indexOf('-')))
            this.set("backendVersionOk", this.versions.backend.includes(v))
        })

        this._checkShowWelcomePage()
        this._startCheckInactiveTimer()
    }

    doUpdate() {
        this.set('updateMessage', this.localize('upd_ing', 'Updating...'))
        this.set('updateAction', null)
        runtime.applyUpdate();
    }

    resetTimer() {
        this.set('connectionTime', +new Date())
    }

    _userSaved(e) {
        this.set('user', e.detail)
    }

    _openUtility(e) {
        if (e.detail && e.detail.panel === 'my-profile') {
            this._myProfile(e.detail.tab)
        } else if (e.detail && e.detail.panel === 'import-keychain') {
            this._importKeychain()
        }
    }


    _startCheckInactiveTimer() {
        clearInterval(this.interval)
        this.interval = setInterval(() => {
            const timeBeforeDeconnection = Math.floor(60 - (+new Date() - this.connectionTime) / 1000 / 60)
            if (timeBeforeDeconnection > 0) {
                this.set('disconnectionTimer', timeBeforeDeconnection)
            } else {
                const creds = _.clone(this.credentials)
                this.set("isMultiUser", true)
                this.set('routeData.page', 'logout')
                this.credentials.username = creds.username
                this.credentials.ehpassword = creds.ehpassword
                this._triggerMenu()
            }
        }, 10000)


        this.sessionInterval && clearInterval(this.sessionInterval)
        this.sessionInterval = setInterval(() => this.api.user().getCurrentSessionWithSession(this.api.sessionId).then(sessionId => this.api.set('sessionId', sessionId)), 240000)
    }

    _timeCheck(period = 30000) {
        setTimeout(() => {
            if (this.api.isMH ? this.api.tokenIdMH : this.api.tokenId) {
                this.api.fhc().Stscontroller().checkTokenValidUsingGET(this.api.isMH ? this.api.tokenIdMH : this.api.tokenId).then(isTokenValid => {
                    if (!isTokenValid) {
                        this.uploadKeystoreAndCheckToken().then(() => {
                            this._timeCheck()
                        }).catch(() => this._timeCheck(10000))
                    } else {
                        this._timeCheck()
                    }
                }).catch(() => this._timeCheck(10000))
            } else {
                this.uploadKeystoreAndCheckToken().then(() => {
                    this._timeCheck()
                }).catch(() => this._timeCheck(10000))
            }
        }, period)
    }

    _timeCheckMH(period = 30000) {
        setTimeout(() => {
            if (this.api.tokenIdMH) {
                this.api.fhc().Stscontroller().checkTokenValidUsingGET(this.api.tokenIdMH).then(isTokenValid => {
                    if (!isTokenValid) {
                        this.uploadMHKeystoreAndCheckToken().then(() => {
                            this._timeCheckMH()
                        }).catch(() => this._timeCheckMH(10000))
                    } else {
                        this._timeCheckMH()
                    }
                }).catch(() => this._timeCheckMH(10000))
            } else {
                this.uploadMHKeystoreAndCheckToken().then(() => {
                    this._timeCheckMH()
                }).catch(() => this._timeCheckMH(10000))
            }
        }, period)
    }

    _inboxMessageCheck(period = 20000) {
        this.timeOutId && clearInterval(this.timeOutId)
        this.timeOutId = setInterval(() => {
            this.api.tokenId && this.checkEhboxMessage()
        }, period)
    }

    _routePageChanged(page) {
        if (page === 'logout') {
            sessionStorage.removeItem('auth')

            this.authenticated = false

            this.worker && this.worker.terminate()

            this.reset()
            this.set('routeData.page', '/')
            setTimeout(() => window.location.reload(), 100)
        } else {
            console.log("page is -> " + page)

            if (!this.icureUrl) {
                this.setUrls()
            }

            if (!this.authenticated && (!page || !page.startsWith('auth'))) {
                if (sessionStorage.getItem('auth') || (this.route.__queryParams.token && this.route.__queryParams.userId)) {
                    this.loginAndRedirect(page)
                } else {
                    this.set('routeData.page', 'auth/' + (!page ? 'main' : page.startsWith('logout') ? 'main' : page))
                }
            } else {
                const dest = page ? page.replace(/\/$/, '') : 'main'
                if (dest !== this.view) {
                    this.set('view', dest)
                }
            }
            this._startCheckInactiveTimer('refresh')
        }
    }

    _triggerMenu() {
        let menu = this.$.mobileMenu
        let overlay = this.$.overlayMenu

        overlay.classList.toggle('open')
        menu.classList.toggle('open')


    }

    _viewChanged(view) {
        if (view.startsWith('auth')) {
            this.$.loginDialog.open()
            return
        }
        if (this.lazyPages[view]) {
            this.lazyPages[view]()
        } else {
            this._showPage404()
        }
    }

    _showPage404() {
        this.view = 'view404'
    }

    doRoute(e) {
        this.set('routeData.page', ((e.target.getAttribute('name') || 'main') || e.target.parentElement.getAttribute('name')) + "/")
        this._triggerMenu()
    }

    _openExportKey() {
        this.$['export-key'].open()
    }

    _importKeychain() {
        this.$['ht-import-keychain'].open()
    }

    _inviteHCP() {
        this.set('firstName', '')
        this.set('lastName', '')
        this.set('email', '')
        this.set('warn', '')
        this.$['ht-invite-hcp'].open()
    }

    _myProfile(tab) {
        this.$['ht-my-profile'].open(tab)
    }

    _selectEntities() {
        this.$['ht-app-account-selector'].open()
    }

    _getToken() {
        return this.$.api.hcparty().getHealthcareParty(this.user.healthcarePartyId).then(hcp => {
                const isMH = hcp.type && hcp.type.toLowerCase() === 'medicalhouse';
                return this.$.api.fhc().Stscontroller().requestTokenUsingGET(this.credentials.ehpassword, isMH ? hcp.nihii.substr(0, 8) : hcp.ssin, this.api.keystoreId, isMH).then(res => {
                    this.$.eHealthStatus.classList.remove('pending')
                    this.$.eHealthStatus.classList.remove('disconnected')
                    this.$.eHealthStatus.classList.add('connected')

                    this.set('api.isMH', isMH)
                    if (isMH) {
                        this.credentials.ehpasswordMH = this.credentials.ehpassword

                        this.set('api.keystoreIdMH', this.api.keystoreId)
                        this.set('api.tokenIdMH', res.tokenId)
                        this.set('api.tokenMH', res.token)
                        this.set('api.nihiiMH', hcp.nihii)

                        if (hcp.contactPersonHcpId) {
                            this.$.api.hcparty().getHealthcareParty(hcp.contactPersonHcpId).then(hcpCt => {
                                this.set('api.MHContactPersonName', hcpCt.lastName + ' ' + hcpCt.firstName)
                                this.set('api.MHContactPersonSsin', hcpCt.ssin)
                            });
                        }

                    } else {
                        this.set('api.tokenId', res.tokenId)
                        this.set('api.token', res.token)
                    }
                    return res.tokenId
                }).catch((e) => {
                    this.$.eHealthStatus.classList.remove('pending')
                    this.$.eHealthStatus.classList.remove('connected')
                    this.$.eHealthStatus.classList.add('disconnected')
                    throw(e)
                })
            }
        )
    }

    _versionOk(a, b) {
        return a && b ? '' : 'nok'
    }

    _getMHToken() {
        //TODO: change the request for MH
        //this.api.fhc().Stscontroller().requestTokenUsingGET(k.passPhrase, this.getNihii8(MHNihii), k.uuid, true )
        //get the password from local storage
        //let mhPassword= "";
        return this.$.api.hcparty().getHealthcareParty(this.user.healthcarePartyId)
            .then(hcp => this.$.api.hcparty().getHealthcareParty(hcp.parentId))
            .then(hcpMH => {
                this.set('hasMHCertificate', hcpMH && this.api.keystoreIdMH)
                return this.$.api.fhc().Stscontroller().requestTokenUsingGET(this.credentials.ehpasswordMH, hcpMH.nihii.substr(0, 8), this.api.keystoreIdMH, true).then(res => {
                    if (this.root.getElementById('eHealthMHStatus')) this.root.getElementById('eHealthMHStatus').classList.remove('pending')
                    if (this.root.getElementById('eHealthMHStatus')) this.root.getElementById('eHealthMHStatus').classList.remove('disconnected')
                    if (this.root.getElementById('eHealthMHStatus')) this.root.getElementById('eHealthMHStatus').classList.add('connected')

                    this.set('api.tokenIdMH', res.tokenId)
                    this.set('api.tokenMH', res.token)
                    this.set('api.nihiiMH', hcpMH.nihii)
                    return res.tokenId
                })
            }).catch((e) => {
                if (this.root.getElementById('eHealthMHStatus')) this.root.getElementById('eHealthMHStatus').classList.remove('pending')
                if (this.root.getElementById('eHealthMHStatus')) this.root.getElementById('eHealthMHStatus').classList.remove('connected')
                if (this.root.getElementById('eHealthMHStatus')) this.root.getElementById('eHealthMHStatus').classList.add('disconnected')
                throw(e)
            })
    }

    loginAndRedirect(page) {
        const sAuth = JSON.parse(sessionStorage.getItem('auth'))
        if (!this.credentials || (!this.credentials.password && sAuth && sAuth.password) || (!this.credentials.appToken && sAuth && sAuth.appToken)) {
            this.set('credentials', sAuth)
        }

        if (this.route.__queryParams.token && this.route.__queryParams.userId) {
            this.set('headers', _.assign(_.assign({}, this.headers),
                {Authorization: 'Basic ' + btoa(this.route.__queryParams.userId + ':' + this.route.__queryParams.token)}))
        } else if ((this.credentials.userId && this.credentials.appToken)) {
            this.set('headers', _.assign(_.assign({}, this.headers),
                {Authorization: 'Basic ' + btoa(this.credentials.userId + ':' + this.credentials.appToken)}))
        } else if ((this.credentials.username && this.credentials.password)) {
            this.set('headers', _.assign(_.assign({}, this.headers),
                {Authorization: 'Basic ' + btoa(this.credentials.username + ':' + this.credentials.password + (this.credentials.twofa ? '|' + this.credentials.twofa : ''))}))
        }

        //Be careful not to use this.api here as it might not have been defined yet
        //TODD debounce here
        this.$.api.user().getCurrentUser().then(u => {
            if (this.isMultiUser) {
                this._selectEntities()
            }

            this.api.user().getCurrentSession().then(sessionId => this.api.set('sessionId', sessionId))

            this.set('user', u)
            this.user.roles && this.user.roles.find(r => r === 'ADMIN' || r === 'MS-ADMIN' || r === 'MS_ADMIN') ? this.set('isAdmin', true) : this.set('isAdmin', false)
            this.set('connectionTime', +new Date())
            this.api.hcparty().getCurrentHealthcareParty().then(hcp => {
                const language = (hcp.languages || ['fr']).find(lng => lng && lng.length === 2)
                language && this.set('language', language)

                this.$.loginDialog.opened = false

                this.api.isElectronAvailable().then(electron => {
                    if (electron === true) {
                        //request electron tc.
                        fetch('http://localhost:16042/tc', {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json; charset=utf-8"
                            },
                            body: JSON.stringify({
                                "userId": this.user.id,
                                "token": this.user.applicationTokens.MIKRONO || this.user.applicationTokens.tmp || this.user.applicationTokens.tmpFirstLogin
                            })
                        })
                    }
                })

                this.set('credentials.twofa', null)
                u.groupId ? this.set('credentials.userId', u.groupId + "/" + u.id) : this.set('credentials.userId', u.id)
                this.set('credentials.appToken', u.applicationTokens && u.applicationTokens.ICC)

                if ((this.credentials.userId && this.credentials.appToken)) {
                    this.set('credentials.password', null)
                    this.set('headers.Authorization', 'Basic ' + btoa(this.credentials.userId + ':' + this.credentials.appToken))
                }
                sessionStorage.setItem('auth', JSON.stringify(this.credentials))
                localStorage.setItem('last_connection', this.credentials.username)

                if (!this.authenticated) {
                    this.authenticated = true

                    const loadKeysForParent = (parentId, prom) => {
                        if (parentId) {
                            return prom.then(([success, destPage]) => {
                                if (success) {
                                    return this.api.hcparty().getHealthcareParty(parentId).then(hcp =>
                                        loadKeysForParent(hcp.parentId, this.loadOrImportRSAKeys(u, hcp, destPage))
                                    )
                                } else {
                                    return Promise.resolve([success, destPage])
                                }
                            })
                        } else {
                            return prom
                        }
                    }

                    loadKeysForParent(hcp.parentId, this.loadOrImportRSAKeys(u, hcp, page)).then(([success, page]) => {
                        if (success) {
                            const destPage = page || (this.routeData && this.routeData.page === 'auth' && this.subrouteData && this.subrouteData.page ? this.subrouteData.page : 'main')
                            if (!this.routeData || destPage !== this.routeData.page) {
                                this.set('routeData.page', destPage)
                            } else {
                                this._routePageChanged(destPage)
                            }
                        }
                    })
                }
                this._timeCheck()
                this._timeCheckMH(0)//Should launch directly, no wait in this case!!!
                this._inboxMessageCheck()
            })
        }).catch(function (e) {
            this.authenticated = false
            sessionStorage.removeItem('auth')
            this.set("credentials.error", "Wrong user or password")
        }.bind(this))
    }

    loadOrImportRSAKeys(u, hcp, page) {
        return new Promise((resolve, reject) => {
            if (this.$.api.crypto().RSA.loadKeyPairNotImported(hcp.id)) {
                this.$.api.crypto().checkPrivateKeyValidity(hcp).then(ok => {
                    this.set("keyHcpId", hcp.id)
                    if (ok) {
                        this.api.loadUsersAndHcParties()
                        this.uploadKeystoreAndCheckToken().catch(e => console.log(e))
                        resolve([true, page])
                    } else {
                        this.registerKeyPairDialogMessage = "The key registered in your browser is invalid"
                        this.registerKeyPairDialogResolution = ([resolve, reject])
                        this.$.registerKeyPairDialog.opened = true
                    }
                })
            } else {
                this.set("keyHcpId", hcp.id)
                if (hcp.publicKey) {
                    this.registerKeyPairDialogMessage = ""
                    this.registerKeyPairDialogResolution = ([resolve, reject])
                    this.$.registerKeyPairDialog.opened = true
                } else {
                    console.log("HCP public key is " + hcp.publicKey, hcp)
                    this.registerKeyPairDialogResolution = ([resolve, reject])
                    this.$.firstConnectionDialog.opened = true
                }
            }

        })
    }

    uploadKeystoreAndCheckToken() {
        if (this.credentials.ehpassword) {
            const ehKeychain = this.$.api.crypto().loadKeychainFromBrowserLocalStorage(this.user.healthcarePartyId)
            if (ehKeychain) {
                return this.$.api.fhc().Stscontroller().uploadKeystoreUsingPOST(ehKeychain).then(res => {
                    this.$.api.keystoreId = res.uuid
                    return this._getToken()
                }).catch((e) => {
                    this.$.eHealthStatus.classList.remove('pending')
                    this.$.eHealthStatus.classList.remove('connected')
                    this.$.eHealthStatus.classList.add('disconnected')
                    throw(e)
                })
            } else {
                this.$.noehealth.classList.add("notification")

                this.$.eHealthStatus.classList.remove('pending')
                this.$.eHealthStatus.classList.remove('connected')
                this.$.eHealthStatus.classList.add('disconnected')
            }
        } else {
            this.$.eHealthStatus.classList.remove('pending')
            this.$.eHealthStatus.classList.remove('connected')
            this.$.eHealthStatus.classList.add('disconnected')
        }
        return Promise.resolve(null);
    }


    uploadMHKeystoreAndCheckToken() {

        const ksKey = "org.taktik.icure.ehealth.keychain.MMH." + this.user.healthcarePartyId;
        Object.keys(localStorage).filter(k => k === ksKey).map(kM => {
            const val = localStorage.getItem(kM);
            Object.keys(localStorage).map(kA => {
                if (localStorage.getItem(kA) === val) {
                    this.getDecryptedValueFromLocalstorage(this.user.healthcarePartyId, kA.replace("keychain.", "keychain.password."))
                        .then(password => {
                            if (password) {
                                this.credentials.ehpasswordMH = password
                                const ehKeychain = this.$.api.crypto().loadKeychainFromBrowserLocalStorage("MMH." + this.user.healthcarePartyId)
                                if (ehKeychain) {
                                    return this.$.api.fhc().Stscontroller().uploadKeystoreUsingPOST(ehKeychain).then(res => {
                                        this.$.api.keystoreIdMH = res.uuid
                                        return this._getMHToken()
                                    }).catch((e) => {
                                        if (this.root.getElementById('eHealthMHStatus')) this.root.getElementById('eHealthMHStatus').classList.remove('pending')
                                        if (this.root.getElementById('eHealthMHStatus')) this.root.getElementById('eHealthMHStatus').classList.remove('connected')
                                        if (this.root.getElementById('eHealthMHStatus')) this.root.getElementById('eHealthMHStatus').classList.add('disconnected')
                                        throw(e)
                                    })
                                } else {
                                    //TODO: notif for no MH session
                                    //this.$.noehealth.classList.add("notification")
                                    if (this.root.getElementById('eHealthMHStatus')) this.root.getElementById('eHealthMHStatus').classList.remove('pending')
                                    if (this.root.getElementById('eHealthMHStatus')) this.root.getElementById('eHealthMHStatus').classList.remove('connected')
                                    if (this.root.getElementById('eHealthMHStatus')) this.root.getElementById('eHealthMHStatus').classList.add('disconnected')
                                }
                            } else {
                                if (this.root.getElementById('eHealthMHStatus')) this.root.getElementById('eHealthMHStatus').classList.remove('pending')
                                if (this.root.getElementById('eHealthMHStatus')) this.root.getElementById('eHealthMHStatus').classList.remove('connected')
                                if (this.root.getElementById('eHealthMHStatus')) this.root.getElementById('eHealthMHStatus').classList.add('disconnected')
                            }
                            return Promise.resolve(null);
                        });
                }
            })
        })
        return Promise.resolve(null);
    }

    login(event, loginObject) { /* this is called from mouseDown with 2 arguments */
        this._updateServerUrl(loginObject.icureurl, loginObject.fhcurl)

        this.set('credentials', loginObject && loginObject.credentials)
        this.loginAndRedirect(loginObject && loginObject.page)
    }

    importPrivateKey(e, selectedRsaFile) {
        let hcpId;
        if (this.keyHcpId == null) {
            hcpId = this.user.healthcarePartyId
        } else {
            hcpId = this.keyHcpId
        }
        selectedRsaFile && selectedRsaFile.name && this.api.crypto().loadKeyPairsInBrowserLocalStorage(hcpId, selectedRsaFile).then(function () {
            if (this.$.api.crypto().RSA.loadKeyPairNotImported(hcpId)) {
                this.$.registerKeyPairDialog.opened = false
                this.set("registerKeyPairDialogMessage", "")

                this.registerKeyPairDialogResolution[0]([true, 'main/'])
            } else {
                this.set("registerKeyPairDialogMessage", "Invalid key file")
                this.$.registerKeyPairDialog.reset()
            }
        }.bind(this)).catch(e => {
            console.log(e);
            this.registerKeyPairDialogResolution[1](e)
        })
    }

    importScannedPrivateKey(e, jwkKey) {
        let hcpId;
        if (this.keyHcpId == null) {
            hcpId = this.user.healthcarePartyId
        } else {
            hcpId = this.keyHcpId
        }
        this.api.crypto().loadKeyPairsAsJwkInBrowserLocalStorage(hcpId, jwkKey).then(function () {
            if (this.$.api.crypto().RSA.loadKeyPairNotImported(hcpId)) {
                this.$.registerKeyPairDialog.opened = false
                this.set("registerKeyPairDialogMessage", "")
                this.registerKeyPairDialogResolution[0]([true, 'main/'])
            } else {
                this.set("registerKeyPairDialogMessage", "Invalid key file")
                this.$.registerKeyPairDialog.reset()
            }
        }.bind(this)).catch(e => {
            console.log(e);
            this.registerKeyPairDialogResolution[1](e)
        })
    }

    togglePanel(e) {
    }

    confirmUserInvitation() {
        if (this.validInvite) {
            // See if user exists first, based on email address
            this.api.user().getUserByEmail(this.email).then(existingUserDto => {
                if (existingUserDto && existingUserDto.id) {
                    this.$['ht-invite-hcp-user-already-exists'].open()
                } else {
                    this.createAndInviteUser();
                }
            }).catch(error => {
                this.createAndInviteUser();
            })
        }
    }

    checkEhboxMessage() {
        if (!this.user) {
            return
        }
        const lastLoad = parseInt(localStorage.getItem('lastEhboxRefresh')) ? parseInt(localStorage.getItem('lastEhboxRefresh')) : -1
        const shouldLoad = (lastLoad + (10 * 60000) <= Date.now() || lastLoad === -1)
        console.log('checkEhboxMessage', lastLoad + (10 * 60000) + '<=' + Date.now(), shouldLoad)
        if (localStorage.getItem('receiveMailAuto') === 'true' && shouldLoad) {
            localStorage.setItem('lastEhboxRefresh', Date.now())

            const getParents = (id, keyPairs) => this.api.hcparty().getHealthcareParty(id).then(hcp => {
                keyPairs[hcp.id] = this.api.crypto().RSA.loadKeyPairNotImported(id)
                if (hcp.parentId) {
                    return getParents(hcp.parentId, keyPairs)
                }
                return keyPairs
            })

            this.$.ehboxInboxMessage.classList.remove('notificationEhbox')

            if (!this.worker) {
                this.worker = new Worker()
            }

            getParents(this.user.healthcarePartyId, {}).then(kp => this.getAlternateKeystores().then(alternateKeystores => {
                this.worker.postMessage({
                    action: "loadEhboxMessage",
                    hcpartyBaseApi: this.api.hcpartyLight(),
                    fhcHost: this.api.fhc().host,
                    fhcHeaders: JSON.stringify(this.api.fhc().headers),
                    language: this.language,
                    iccHost: this.api.host,
                    iccHeaders: JSON.stringify(this.api.headers),
                    tokenId: this.api.tokenId,
                    keystoreId: this.api.keystoreId,
                    user: this.user,
                    ehpassword: this.credentials.ehpassword,
                    boxId: ["INBOX", "SENTBOX"],
                    alternateKeystores: ({keystores: alternateKeystores.filter(ak => ak.passPhrase)}),
                    keyPairs: kp
                })
            }))

            this.worker.onmessage = e => {
                this.set('ehboxWebWorkerMessage', e.data.message)
                this.$.ehboxInboxMessage.classList.add('notificationEhbox')
                console.log("Le worker à repondu " + e.data.message)
            }

        } else {
            // this.set('ehboxWebWorkerMessage', 'Réception automatique désactivée')
            // this.$.ehboxInboxMessage.classList.add('notificationEhbox')
            console.log('check ehbox prevent from user param OR time prevent')
        }
    }

    getMHKeystore() {
        const healthcarePartyId = this.user.healthcarePartyId;
        // MHPrefix ? MHPrefix + "." + this.user.healthcarePartyId :

    }

    getAlternateKeystores() {
        const healthcarePartyId = this.user.healthcarePartyId;

        return Promise.all(
            Object.keys(localStorage).filter(k => k.includes(this.api.crypto().keychainLocalStoreIdPrefix + healthcarePartyId + ".") === true)
                .map(fk => this.getDecryptedValueFromLocalstorage(healthcarePartyId, fk.replace("keychain.", "keychain.password."))
                    .then(password =>
                        (this.keyPairKeystore[fk]) ?
                            // Get fhc keystore UUID in cache
                            new Promise(x => x(({uuid: this.keyPairKeystore[fk], passPhrase: password}))) :
                            // Upload new keystore
                            this.$.api.fhc().Stscontroller().uploadKeystoreUsingPOST(this.api.crypto().utils.base64toByteArray(localStorage.getItem(fk)))
                                .then(res => this.addUUIDKeystoresInCache(fk, res.uuid, password))
                    )
                )
        )
    }

    addUUIDKeystoresInCache(key, uuid, password) {
        return new Promise(x => {
            this.keyPairKeystore[key] = uuid;
            x(({uuid: uuid, passPhrase: password}))
        })

    }

    getDecryptedValueFromLocalstorage(healthcarePartyId, key) {
        let item = localStorage.getItem(key);

        return this.api.crypto().hcpartyBaseApi.getHcPartyKeysForDelegate(healthcarePartyId)
            .then(encryptedHcPartyKey =>
                this.api.crypto().decryptHcPartyKey(healthcarePartyId, healthcarePartyId, encryptedHcPartyKey[healthcarePartyId], true)
            )
            .then(importedAESHcPartyKey =>
                (item) ? this.api.crypto().AES.decrypt(importedAESHcPartyKey.key, this.api.crypto().utils.text2ua(item)) : null
            )
            .then(data =>
                (data) ? this.api.crypto().utils.ua2text(data) : null
            );
    }

    _logList() {
        this.$['ht-access-log'].open()
    }

    createAndInviteUser() {
        this.api.hcparty().createHealthcareParty({
            "name": this.lastName + " " + this.firstName,
            "lastName": this.lastName,
            "firstName": this.firstName,
            "nihii": this.nihii,
            "ssin": this.ssin
        }).then(hcp => {
            this.api.user().createUser({
                "healthcarePartyId": hcp.id,
                "name": this.lastName + " " + this.firstName,
                "email": this.email,
                "applicationTokens": {"tmpFirstLogin": this.api.crypto().randomUuid()},
                "status": "ACTIVE",
                "type": "database"
            }).then(usr => {
                this.invitedHcpLink = window.location.origin + window.location.pathname + '/?userId=' + usr.id + '&token=' + usr.applicationTokens.tmpFirstLogin
                this.$['ht-invite-hcp-link'].open()
            })
        })
    }

    _redirectToAnotherEntity(e) {
        if (e.detail) {
            this.set("isMultiUser", false)
            this.$['ht-app-account-selector'].close()
            this.login(e, {credentials: e.detail})
        }
    }

    _tuto() {
        // this.$['tutorialDialog'].open()
        window.open("http://topaz.care/fr/tutorials.html");
    }

    checkAndLoadMikrono() {
        if (this.user) {
            this.api.hcparty().getHealthcareParty(this.user.healthcarePartyId).then(hcp => {

                const applicationTokens = this.user.applicationTokens
                const mikronoUrl = this.user && this.user.properties.find(p => p.type.identifier === "org.taktik.icure.be.plugins.mikrono.url") && this.user.properties.find(p => p.type.identifier === "org.taktik.icure.be.plugins.mikrono.url").typedValue.stringValue || null
                const mikronoUser = this.user && this.user.properties.find(p => p.type.identifier === "org.taktik.icure.be.plugins.mikrono.user") && this.user.properties.find(p => p.type.identifier === "org.taktik.icure.be.plugins.mikrono.user").typedValue.stringValue || null
                const mikronoPassword = this.user && this.user.properties.find(p => p.type.identifier === "org.taktik.icure.be.plugins.mikrono.password") && this.user.properties.find(p => p.type.identifier === "org.taktik.icure.be.plugins.mikrono.password").typedValue.stringValue || null


                if (mikronoUrl && mikronoUser && mikronoPassword && applicationTokens && applicationTokens.MIKRONO) {
                    this.api.isElectronAvailable().then(electron => {
                        if (electron === false) {
                            window.open("https://" + mikronoUser + ":" + mikronoPassword + "@" + mikronoUrl.replace("https://", "") + "/iCureShortcut.jsp?id=" + this.user.id, '_blank')
                        } else {
                            fetch('http://127.0.0.1:16042/mc', {
                                method: "POST",
                                headers: {"Content-Type": "application/json"},
                                body: JSON.stringify({username: mikronoUser, password: mikronoPassword})
                            }).then(response => response.json()).then(rep => {
                                if (rep.ok) {
                                    this.set('routeData.page', "diary")
                                    setTimeout(() => this.shadowRoot.querySelector("#htDiary").loadMikornoIframe(), 100)
                                }
                            })


                        }
                    })

                } else {
                    const addresses = hcp && hcp.addresses || null
                    const workAddresses = addresses.find(adr => adr.addressType === "work") || null
                    const telecoms = workAddresses && workAddresses.telecoms
                    const workMobile = telecoms && telecoms.find(tel => tel.telecomType === "mobile" || tel.telecomType === "phone") || null
                    const workEmail = telecoms && telecoms.find(tel => tel.telecomType === "email") || null

                    if (workMobile && workMobile.telecomNumber !== "" && workEmail && workEmail.telecomNumber !== "") {
                        this.api.onlinebemikrono().register(this.user.id, {}).then(user => {
                            if (user === true) {
                                this.api.user().getUser(this.user.id).then(u => {
                                    this.set('user', u)
                                    const mikronoUrl = this.user && this.user.properties.find(p => p.type.identifier === "org.taktik.icure.be.plugins.mikrono.url") && this.user.properties.find(p => p.type.identifier === "org.taktik.icure.be.plugins.mikrono.url").typedValue.stringValue || null
                                    const mikronoUser = this.user && this.user.properties.find(p => p.type.identifier === "org.taktik.icure.be.plugins.mikrono.user") && this.user.properties.find(p => p.type.identifier === "org.taktik.icure.be.plugins.mikrono.user").typedValue.stringValue || null
                                    const mikronoPassword = this.user && this.user.properties.find(p => p.type.identifier === "org.taktik.icure.be.plugins.mikrono.password") && this.user.properties.find(p => p.type.identifier === "org.taktik.icure.be.plugins.mikrono.password").typedValue.stringValue || null
                                    if (mikronoUrl && mikronoUser && mikronoPassword && applicationTokens && applicationTokens.MIKRONO) {
                                        this.api.isElectronAvailable().then(electron => {
                                            if (electron === false) {
                                                window.open("https://" + mikronoUser + ":" + mikronoPassword + "@" + mikronoUrl.replace("https://", "") + "/iCureShortcut.jsp?id=" + this.user.id, '_blank')
                                            } else {
                                                fetch('http://127.0.0.1:16042/mc', {
                                                    method: "POST",
                                                    headers: {"Content-Type": "application/json"},
                                                    body: JSON.stringify({
                                                        username: mikronoUser,
                                                        password: mikronoPassword
                                                    })
                                                }).then(response => response.json()).then(rep => {
                                                    if (rep.ok) {
                                                        this.set('routeData.page', "diary")
                                                        setTimeout(() => this.shadowRoot.querySelector("#htDiary").loadMikornoIframe(), 100)
                                                    }
                                                })


                                            }
                                        })
                                    } else {
                                        this.set("mikronoError", {
                                            addresses: false,
                                            workAddresses: false,
                                            workMobile: false,
                                            workEmail: false,
                                            token: applicationTokens.MIKRONO ? true : false,
                                            error: true
                                        })
                                    }
                                })
                            } else {
                                this.set("mikronoError", {
                                    addresses: addresses ? true : false,
                                    workAddresses: workAddresses ? true : false,
                                    workMobile: workMobile ? true : false,
                                    workEmail: workEmail ? true : false,
                                    token: applicationTokens.MIKRONO ? true : false,
                                    error: true
                                })
                            }

                        })
                    } else {
                        this.set("mikronoError", {
                            addresses: addresses ? true : false,
                            workAddresses: workAddresses ? true : false,
                            workMobile: workMobile ? true : false,
                            workEmail: workEmail ? true : false,
                            token: applicationTokens.MIKRONO ? true : false,
                            error: false
                        })

                        this.$['mikronoErrorDialog'].open()
                    }
                }

            })
        }
    }

    mikronoAppointmentsMigration() {

        const applicationTokens = _.get(this.user, "applicationTokens", "")
        const mikronoUrl = this.user && this.user.properties.find(p => p.type.identifier === "org.taktik.icure.be.plugins.mikrono.url") && this.user.properties.find(p => p.type.identifier === "org.taktik.icure.be.plugins.mikrono.url").typedValue.stringValue || null
        const mikronoUser = this.user && this.user.properties.find(p => p.type.identifier === "org.taktik.icure.be.plugins.mikrono.user") && this.user.properties.find(p => p.type.identifier === "org.taktik.icure.be.plugins.mikrono.user").typedValue.stringValue || null
        const mikronoPassword = this.user && this.user.properties.find(p => p.type.identifier === "org.taktik.icure.be.plugins.mikrono.password") && this.user.properties.find(p => p.type.identifier === "org.taktik.icure.be.plugins.mikrono.password").typedValue.stringValue || null

        if (mikronoUrl && mikronoUser && mikronoPassword && applicationTokens && applicationTokens.MIKRONO) {
            this.busySpinner = true;
            this.set("migrationItems", [])
            this.$["appointmentsMigrationDialog"].open()
            this.push("migrationItems", {status: "", item: "Récupération de vos rendez-vous en cours..."})

            let appointments = []

            // TODO: Restore me
            // this.api.calendaritem().getCalendarItemsByPeriodAndHcPartyId(moment().subtract(1, 'months').format('YYYYMMDDHHmmss'), moment().add(3, 'months').format('YYYYMMDDHHmmss'), this.user.healthcarePartyId).then(items => {
            this.api.hcparty().getCurrentHealthcareParty().then(hcp => {
                return Promise.all([this.api.calendaritem().getCalendarItemsByPeriodAndHcPartyId(moment().subtract(15, 'days').format('YYYYMMDDHHmmss'), moment().add(6, 'months').format('YYYYMMDDHHmmss'), this.user.healthcarePartyId)].concat(
                    hcp.parentId ? [this.api.calendaritem().getCalendarItemsByPeriodAndHcPartyId(moment().subtract(15, 'days').format('YYYYMMDDHHmmss'), moment().add(6, 'months').format('YYYYMMDDHHmmss'), hcp.parentId)] : []
                )).then(([a, b]) => {
                    const items = a.concat(b.filter(calItem => calItem.responsible === hcp.id))
                    this.push("migrationItems", {status: "", item: "Traitement de vos rendez-vous en cours..."})
                    return items.filter(item => parseInt(_.get(item, "startTime", 0)) && parseInt(_.get(item, "endTime", 0)) && !_.get(item, "wasMigrated", false)).map(item => ({
                        comments: _.trim(_.get(item, "details", "")) || null,
                        externalCustomerId: _.trim(_.get(item, "patientId", "")) || null,
                        customerComments: _.trim(_.get(item, "details", "")) || null,
                        title: _.trim(_.get(item, "title", "")) || null,
                        startTime: (parseInt(_.get(item, "startTime", 0)) ? moment(_.trim(_.get(item, "startTime", "")), "YYYYMMDDHHmmss").format("YYYY-MM-DDTHH:mm:ss") + "Z" : null),
                        endTime: (parseInt(_.get(item, "startTime", 0)) ? moment(_.trim(_.get(item, "endTime", "")), "YYYYMMDDHHmmss").format("YYYY-MM-DDTHH:mm:ss") + "Z" : null),
                        type: null,
                        street: _.trim(_.get(item, "addressText", "")) || null,
                        originalObject: _.merge({wasMigrated: true}, item)
                    }))
                })
            }).then(apps => {

                console.log(apps);

                this.push("migrationItems", {status: "", item: "Migration de vos rendez-vous en cours..."})
                if (apps && apps.length !== 0) {
                    let prom = Promise.resolve([])
                    _.chunk(apps, 100).forEach(chunkOfAppointments => {
                        prom = prom.then(prevResults => this.api.bemikrono().createAppointments(chunkOfAppointments).then(() => {

                            // TODO: make this evolve and pass appointments by batches
                            _.forEach(chunkOfAppointments, (i => {
                                this.api.calendaritem().modifyCalendarItem(_.get(i, "originalObject")).then(() => { /*this.push("migrationItems", { status: "", item: "Migration terminée"})*/
                                })
                            }))

                        }).then(res => {
                            this.push("migrationItems", {
                                status: "",
                                item: "100 rendez-vous (de plus) migrés..."
                            })
                            return prevResults.concat(res)
                        }))
                    })
                    prom = prom.then(results => {
                        this.$["appointmentsMigrationDialog"].close()
                        this.busySpinner = false;
                        window.open("https://" + mikronoUser + ":" + mikronoPassword + "@" + mikronoUrl.replace("https://", "") + "/iCureShortcut.jsp?id=" + this.user.id, '_blank')
                    }).catch((e) => {
                        this.busySpinner = false;
                    })
                } else {
                    this.busySpinner = false;
                    window.open("https://" + mikronoUser + ":" + mikronoPassword + "@" + mikronoUrl.replace("https://", "") + "/iCureShortcut.jsp?id=" + this.user.id, '_blank');
                }
            }).catch((e) => {
                this.busySpinner = false;
            })
        }

    }

    _triggerOpenMyProfile(e) {
        this._myProfile(parseInt(_.get(e, "detail.tabIndex", 1)));
    }

    _triggerOpenAdminGroupsManagementSubMenu(e) {
        this.set('routeData.page', "admin");
        this._triggerMenu();
        this.$['htAdmin'] && typeof this.$['htAdmin'].handleMenuChange === "function" && this.$['htAdmin'].handleMenuChange({
            detail: {
                selection: {
                    item: 'management',
                    submenu: 'facturationFlatRateManagementSubMenu'
                }
            }
        });
    }

}

customElements.define(HtApp.is, HtApp)
