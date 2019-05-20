import '@polymer/iron-icon/iron-icon.js'
import '@polymer/iron-pages/iron-pages.js'
import '@polymer/paper-button/paper-button.js'
import '@polymer/paper-dialog/paper-dialog.js'
import '@polymer/paper-dropdown-menu/paper-dropdown-menu.js'
import '@polymer/paper-input/paper-input.js'
import '@polymer/paper-item/paper-item.js'
import '@polymer/paper-listbox/paper-listbox.js'
import '@polymer/paper-radio-button/paper-radio-button.js'
import '@polymer/paper-radio-group/paper-radio-group.js'
import '@polymer/paper-tabs/paper-tab.js'
import '@polymer/paper-tabs/paper-tabs.js'
import '@polymer/paper-tooltip/paper-tooltip.js'
import '../qrcode-manager/qrcode-printer.js';
import '../dynamic-form/validator/ht-iban-validator.js';
import '../dynamic-form/dynamic-bank-account.js';
import * as models from 'icc-api/dist/icc-api/model/models';
import iban from 'iban'
import {TkLocalizerMixin} from "../tk-localizer";

import {PolymerElement,html} from '@polymer/polymer/polymer-element.js';
import {mixinBehaviors} from '@polymer/polymer/lib/legacy/class'
import {IronResizableBehavior} from '@polymer/iron-resizable-behavior/iron-resizable-behavior.js';

class HtExportKey extends TkLocalizerMixin(mixinBehaviors([IronResizableBehavior], PolymerElement)) {
  static get template() {
    return html`
        <style>
            paper-dialog {
                width: 90%;
                min-height: 380px;
                display: flex;
                flex-flow: row wrap;
                justify-content: space-between;
                align-items: flex-start;
            }

            paper-input {
                --paper-input-container-focus-color: var(--app-primary-color);
                font-size: var(--form-font-size);
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

            .error {
                color: #e53935;
            }

            .buttons {
                width: 100%;
                text-align: center;
            }

            .modal-button {
                --paper-button-ink-color: var(--app-secondary-color-dark);
                color: var(--app-text-color);
                font-weight: 400;
                font-size: 14px;
                height: 40px;
                min-width: 100px;
                padding: 10px 1.2em;
                text-transform: capitalize;
            }

            .modal-button--save {
                box-shadow: var(--shadow-elevation-2dp_-_box-shadow);
                background: var(--app-secondary-color);
                color: var(--app-primary-color-dark);

            }

            .left-col, .right-col {
                flex-grow: 1;
                width: 50%;
                box-sizing: border-box;
                float: left
            }

            .row {
                display: block;
                width: 100%
            }

            .col-10 {
                flex-grow: 1;
                width: 10%;
                box-sizing: border-box;
                float: left
            }

            .col-15 {
                flex-grow: 1;
                width: 15%;
                box-sizing: border-box;
                float: left
            }

            .col-25 {
                flex-grow: 1;
                width: 25%;
                box-sizing: border-box;
                float: left
            }

            .col-20 {
                flex-grow: 1;
                width: 20%;
                box-sizing: border-box;
                float: left
            }

            .col-30 {
                flex-grow: 1;
                width: 30%;
                box-sizing: border-box;
                float: left
            }

            .col-35 {
                flex-grow: 1;
                width: 35%;
                box-sizing: border-box;
                float: left
            }

            .col-40 {
                flex-grow: 1;
                width: 40%;
                box-sizing: border-box;
                float: left
            }

            .col-45 {
                flex-grow: 1;
                width: 45%;
                box-sizing: border-box;
                float: left
            }

            .col-50 {
                flex-grow: 1;
                width: 50%;
                box-sizing: border-box;
                float: left
            }

            #dialog {
                position: fixed;
                overflow: hidden;
                border-radius: 2px;
                top: 50% !important;
                left: 50% !important;
                max-width: initial !important;
                max-height: initial !important;
                height: initial !important;
                width: 80vw !important;
                transform: translate(-50%, -50%);
            }

            #printable {
                width: fit-content;
                padding: 0 8px;
            }

            @media screen and (max-width: 650px) {
                #dialog {
                    height: 80vh;
                }

                div.left-col, div.right-col {
                    width: 100%;
                }


            }

            paper-tabs {
                background: var(--app-background-color);
                --paper-tabs-selection-bar-color: var(--app-secondary-color);
                --paper-tabs: {
                    color: var(--app-text-color);
                };
            }

            paper-tab {
                --paper-tab-ink: var(--app-text-color);
            }

            paper-tab.iron-selected {
                font-weight: bold;
            }

            paper-tab.iron-selected iron-icon {
                opacity: 1;
            }

            paper-tab iron-icon {
                opacity: 0.5;
                color: var(--app-text-color);
            }

            .administrative-panel {
                height: 100%;
                background: var(--app-background-color);
                margin: 0;
                width: 100%;
                grid-column: 2 / 4;
                /*grid-template-columns: 40px 200px 200px 40px;*/
                grid-row: 1 / 1;
            }

            .horizontal {
                display: grid;
                flex-direction: row;
                flex-wrap: wrap;
                flex-basis: 100%;
                align-items: center;
            }

            .horizontal paper-input {
                @apply --padding-right-left-16;
                height: 65px;
            }

            .horizontal .tile paper-input {
                padding-left: initial;
                padding-right: initial;
                padding: 0 8px;
            }

            .horizontal paper-input-container {
                @apply --padding-right-left-16;
                padding: 0;
            }

            .horizontal paper-menu-button {
                padding: 0;
            }

            .horizontal vaadin-date-picker {
                @apply --padding-right-left-16;
                padding-top: 4px;
                height: 48px;
            }

            .statusBulletContainer {
                height: 65px;
                display: flex;
                align-items: center;
            }

            .statusBullet {
                display: block;
                width: 12px;
                height: 12px;
                background-color: var(--app-status-color-nok);
                -webkit-border-radius: 12px;
                -moz-border-radius: 12px;
                border-radius: 12px;
                margin: 0 auto;
            }

            .statusBullet.ok {
                background-color: var(--app-status-color-ok);
            }

            .textAlignCenter {
                text-align: center;
            }

            .headerField {
                display: flex;
                flex-flow: row wrap;
                justify-content: center;
                align-items: center;
                background-color: var(--app-background-color-dark);
                height: 48px;
                --paper-input-container-underline: {
                    display: none
                };
                --paper-input-container-underline-focus: {
                    display: none
                };
                --paper-input-container-underline-disabled: {
                    display: none
                };
                font-weight: 700;
                color: var(--app-primary-color);
            }

            /* .borderTop { border-top:1px solid var(--app-primary-color); }
            .borderLeft { border-left:1px solid var(--app-primary-color); }
            .borderRight { border-right:1px solid var(--app-primary-color); }
            .borderBottom { border-bottom:1px solid var(--app-primary-color); } */

            .icon-button {
                cursor: pointer;
            }

            #edmgRegistrationComplete {
                width: 100%;
                height: 100%;
                background: linear-gradient(rgba(255, 255, 255, .3) 0%, rgba(255, 255, 255, .85) 50%);
                position: absolute;
                z-index: 10;
                font-size: 1.8em;
                text-align: center;
                color: var(--app-secondary-color);
            }

            #edmgRegistrationComplete iron-icon {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -120%);
                height: 20%;
                width: 20%;
            }

            #edmgRegistrationComplete p {
                position: relative;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 30%;
                padding: .5em 2em;
                line-height: 1.5;
                font-weight: 700;
                text-transform: none;
                border-top: 2px solid var(--app-secondary-color);
            }

            /* @keyframes woohoo{
                0%{
                    transform: rotate(0) scale(1);
                }
                100%{
                    transform: rotate(360deg) scale(2);
                }
            } */

            .marginRight10 {
                margin-right: 10px;
            }

            #supervisor-search, #mh-search, #hcp-search {
                flex: 1;
            }

            .financialInformationListing {
                padding: 0;
                margin: 20px 0 20px 20px;
            }

            .financialInformationListing li {
                list-style-type: none;
                padding: 0;
                margin: 0 0 10px 0;
                text-transform: uppercase;
                font-size: 1.1em;
            }

            .financialInformationListing li label {
                font-weight: 700;
                display: inline-block;
                margin-right: 10px;
                padding: 10px;
                background-color: #eeeeee;
            }

            .toolTip {
                background-color: #eeeeee;
                padding: 10px;
                font-size: 1.1em;
                line-height: 1.1em;
            }

            .administrative-panel {
                width: 100%;
                padding: 0;
            }

            .administrative-panel .panel-content {
                padding: 0 12px;
                overflow: hidden;
                border-bottom: 1px solid var(--app-background-color-dark);
                box-sizing: border-box;
                height: 50vh;
                overflow-y: auto;
            }

            paper-radio-group {
                padding-left: 16px;
            }

            paper-radio-button {
                --paper-radio-button-unchecked-ink-color: var(--app-secondary-color-dark);
                --paper-radio-button-checked-color: var(--app-secondary-color);
                --paper-radio-button-checked-ink-color: var(--app-secondary-color);
            }

            paper-listbox {
                margin: 0 16px;
                padding: 0;
            }

            vaadin-combo-box {
                width: 100%;
                padding: 0 16px;
                box-sizing: border-box;
            }

            .p-l-0 {
                padding-left: 0;
            }

            .col-lg-12 {
                width: calc(99.9995% - 4em);
            }

            .col-lg-6.tile {
                box-sizing: border-box;
                border-radius: 4px;
                border: 1px solid var(--app-background-color-darker);
                background: var(--app-background-color);
                margin: 16px calc(.5 * var(--vaadin-form-layout-column-gap));
            }

            .tile h2 {
                background: var(--app-background-color-dark);
                width: 100%;
                text-align: center;
                margin: 0 0 8px 0;
                padding: 8px;
                box-sizing: border-box;;
            }

            .line {
                display: flex;
            }

            .line.p8 {
                padding: 0 8px;
                box-sizing: border-box;
            }

            .line.p16 {
                padding: 0 16px;
                box-sizing: border-box;
            }

            .line > * {
                flex-grow: 1;
            }

            .line > *.no-grow {
                flex-grow: 0;
            }

            .line > *.w50 {
                width: 50px;
            }

            .line > *.w100 {
                width: 100px;
            }

            .line > *.w150 {
                width: 150px;
            }

            .line > *.grow-3 {
                flex-grow: 3;
            }

            .line span.lang {
                padding-top: 20px;
                width: 80px !important;
            }

            .flex-horizontal, .flex-horizontal .format {
                display: flex;
                flex-direction: row;
                flex-grow: 1;
            }

            .flex-horizontal .format {
                border-bottom: 1px solid var(--app-background-color-dark);
            }

            .flex-horizontal .format.regulations {
                border-bottom: 0;
            }

            .flex-horizontal > div {
                flex-grow: 1;
                box-sizing: border-box;
                border: 1px solid var(--app-background-color-darker);
                margin: 16px 8px;
                border-radius: 4px;
            }

            .flex-horizontal > div.col {
                border: 0;
                margin: initial;
                border-radius: 0;
            }

            .flex-horizontal div.print-tile {
                border: 1px solid var(--app-background-color-darker);
                margin: 16px 8px;
                border-radius: 4px;
            }

            .flex-horizontal h2 {
                background: var(--app-background-color-dark);
                padding: 8px;
                width: 100%;
                text-align: center;
                box-sizing: border-box;
                margin: 0;
            }

            .flex-horizontal .format {
                flex-direction: row;
            }

            .flex-horizontal .format .left {
                flex-grow: initial;
                width: 128px;
                line-height: 64px;
                text-align: center;
                font-weight: bold;
            }

            .flex-horizontal .format .right {
                flex-grow: 1;
                padding: 0 16px;
            }

            .flex-horizontal .format .right paper-dropdown-menu {
                width: 100%;
            }

            .flex-horizontal paper-listbox {
                max-height: 256px;
                max-width: 256px;
            }

            .flex-horizontal paper-item {
                cursor: pointer;
                box-sizing: border-box;
            }

            .flex-horizontal paper-item:hover {
                background: var(--app-background-color-dark);
            }

            .flex-horizontal paper-item:active,
            .flex-horizontal paper-item:focus {
                background: var(--app-background-color-darker);
            }

            .modal-button--cancel {
                background: transparent;
                border: 1px solid var(--app-background-color-dark);
            }

            .onlymobile {
                display: none;
            }

            @media screen and (max-width: 800px) {
                paper-dialog#dialog {
                    margin: 0;
                }

                .flex-horizontal {
                    flex-direction: column;
                }

                .flex-horizontal paper-listbox {
                    width: 100%;
                    max-width: none;
                }
            }

            @media screen and (max-width: 1024px) {
                .nomobile {
                    display: none;
                }

                .onlymobile {
                    display: block;
                }
            }

        </style>

        <paper-dialog id="dialog" opened="{{opened}}">
            <div class="administrative-panel">
                <div class="top-gradient"></div>
                <paper-tabs selected="{{tabs}}">
                    <paper-tab id="tab-access" class="adm-tab">
                        <iron-icon icon="icons:lock" class="marginRight10"></iron-icon>
                        <span class="nomobile">[[localize('my_access','Mes accès',language)]]</span></paper-tab>
                    <paper-tab id="tab-details" class="adm-tab">
                        <iron-icon icon="icons:account-circle" class="marginRight10"></iron-icon>
                        <span class="nomobile">[[localize('my_details','Mes coordonnées',language)]]</span></paper-tab>
                    <paper-tab id="tab-banking" class="adm-tab">
                        <iron-icon icon="icons:account-balance" class="marginRight10"></iron-icon>
                        <span class="nomobile">[[localize('my_banking_details','Informations bancaires',language)]]</span>
                    </paper-tab>
                    <paper-tab id="tab-edmg" class="adm-tab">
                        <iron-icon icon="icons:folder-shared" class="marginRight10"></iron-icon>
                        <span class="nomobile">[[localize('edmg_subscription','EDMG',language)]]</span></paper-tab>
                    <template is="dom-if" if="[[electronAvailable]]">
                        <paper-tab id="tab-printer" class="adm-tab">
                            <iron-icon icon="icons:print" class="marginRight10"></iron-icon>
                            <span class="nomobile">[[localize('def_printer','Default Printers',language)]]</span>
                        </paper-tab>
                    </template>
                </paper-tabs>
                <div class="onlymobile">
                    <paper-tooltip position="bottom" for="tab-access">[[localize('my_access','My access',language)]]
                    </paper-tooltip>
                    <paper-tooltip position="bottom" for="tab-details">[[localize('my_details','My
                        details',language)]]
                    </paper-tooltip>
                    <paper-tooltip position="bottom" for="tab-banking">[[localize('my_banking_details','My banking
                        details',language)]]
                    </paper-tooltip>
                    <paper-tooltip position="bottom" for="tab-edmg">[[localize('edmg_subscription','EDMG',language)]]
                    </paper-tooltip>
                    <paper-tooltip position="bottom" for="tab-printer">[[localize('def_printer','Default
                        Printers',language)]]
                    </paper-tooltip>
                </div>

                <iron-pages selected="[[tabs]]" class="panel-content">
                    <page>

                        <div class="horizontal" style="margin-top:10px">
                            <vaadin-form-layout>
                                <div class="col-lg-6 tile">
                                    <h2>
                                        <iron-icon icon="communication:vpn-key"></iron-icon>
                                        [[localize('login_opt','Login option',language)]]
                                    </h2>
                                    <paper-input label="Login*" value="{{user.login}}" readonly=""></paper-input>
                                    <div class="line">
                                        <paper-input label="[[localize('password','Password',language)]]" value="{{userPassword}}" type="password"></paper-input>
                                        <paper-input label="Confirmation" value="{{userConfirmation}}" type="password" disabled="[[!userPassword.length]]"></paper-input>
                                    </div>
                                    <template is="dom-if" if="[[_mismatch(userPassword,userConfirmation)]]">
                                        <div class="error">[[localize('pass_nomatch','Passwords do not
                                            match',language)]]
                                        </div>
                                    </template>
                                    <template is="dom-if" if="[[_tooShort(userPassword)]]">
                                        <div class="error">[[localize('pass_tooshort','Password must be at least 8
                                            characters',language)]]
                                        </div>
                                    </template>

                                    <paper-input label="[[localize('auto_logout','Auto logout delay (minutes)',language)]]" type="number" min="0" value=""></paper-input>
                                    <div id="printable">
                                        <vaadin-checkbox colspan="2" checked="{{user.use2fa}}">
                                            [[localize('use_two_fac_aut','Use two factors Authentication',language)]]
                                        </vaadin-checkbox>
                                        <vaadin-checkbox colspan="2" checked="{{showQr}}">[[localize('sho_qr','Show QR
                                            code',language)]]
                                        </vaadin-checkbox>
                                        <qrcode-printer i18n="[[i18n]]" language="[[language]]" hidden="[[!showQr]]" resources="[[resources]]" id="qrcode" text="[[qrCode(user.login,user.secret)]]" size="[[qrCodeWidth]]" ecl="H"></qrcode-printer>
                                    </div>
                                </div>

                                <div class="col-lg-6 tile">
                                    <h2>
                                        <iron-icon icon="settings"></iron-icon>
                                        [[localize('oth_opt','Other options',language)]]
                                    </h2>
                                    <paper-input label="Group ID" value="{{user.groupId}}"></paper-input>

                                    <div class="line p16">
                                        <span class="lang">[[localize('languages','Langues',language)]] : </span>
                                        <div class="horizontal" style="margin-top:10px">
                                            <paper-radio-group selected="{{hcp.languages.0}}">
                                                <paper-radio-button name="en">[[localize('eng','English',language)]]
                                                </paper-radio-button>
                                                <paper-radio-button name="fr">[[localize('fre','French',language)]]
                                                </paper-radio-button>
                                                <paper-radio-button name="nl">[[localize('dut','Dutch',language)]]
                                                </paper-radio-button>
                                            </paper-radio-group>
                                        </div>
                                    </div>

                                    <div class="line p16">
                                        <span class="lang">[[localize('aspect_ratio','Aspect ratio',language)]] : </span>
                                        <div class="horizontal" style="margin-top:10px">
                                            <paper-radio-group selected="[[aspectRatio(user.properties)}}" on-selected-changed="aspectRatioChanged">
                                                <paper-radio-button name="narrow">
                                                    [[localize('narrow','Narrow',language)]]
                                                </paper-radio-button>
                                                <paper-radio-button name="wide">[[localize('wide','Wide',language)]]
                                                </paper-radio-button>
                                            </paper-radio-group>
                                        </div>
                                    </div>

                                    <!--<div class="horizontal" style="margin-top:10px">
                                        <paper-radio-group selected="{{hcp.type}}">
                                            <label class="p-l-0">[[localize('accountType','Type de compte',language)]]: </label>
                                            <paper-radio-button name="persphysician">[[localize('praticien','Praticien',language)]]</paper-radio-button>
                                            <paper-radio-button name="medicalHouse">[[localize('medicalHouse','Maison médicale',language)]]</paper-radio-button>
                                        </paper-radio-group>
                                    </div>-->

                                    <template is="dom-if" if="[[_isMedicalHouse(hcp.type)]]">
                                        <div class="line" style="margin-top:10px">
                                            <paper-radio-group selected="{{hcp.billingType}}">
                                                <label class="p-l-0">[[localize('billingType','Type de
                                                    facturation',language)]]: </label>
                                                <paper-radio-button name="serviceFee">[[localize('serviceFee','A
                                                    l\\'acte',language)]]
                                                </paper-radio-button>
                                                <paper-radio-button name="flatRate">[[localize('medicalHouse','Au
                                                    forfait',language)]]
                                                </paper-radio-button>
                                            </paper-radio-group>
                                        </div>
                                        <!--<paper-input label="[[localize('contactPerson','Personne de contact',language)]]" value="{{hcp.contactPerson}}"></paper-input>-->
                                        <!--<paper-input label="[[localize('contactPerson','Personne de contact',language)]]" value="{{hcp.contactPersonHcpId}}"></paper-input>-->
                                        <vaadin-combo-box id="hcp-search" filtered-items="[[contactListItem]]" item-label-path="hrLabel" item-value-path="id" on-filter-changed="_hcpSearch" on-keydown="isEnterPressed" label="[[localize('mhContactPerson','Personne de contact pour la facturation forfait',language)]]" value="{{hcp.contactPersonHcpId}}">
                                        </vaadin-combo-box>
                                    </template>

                                    <template is="dom-if" if="[[!_isMedicalHouse(hcp.type)]]">
                                        <vaadin-combo-box id="mh-search" filtered-items="[[mhListItem]]" item-label-path="hrLabel" item-value-path="id" on-filter-changed="_mhSearch" on-keydown="isEnterPressed" label="[[localize('mhWhereIWork','Maison médicale où vous officiez (uniquement si d\\'application)',language)]]" value="{{hcp.parentId}}">
                                        </vaadin-combo-box>

                                        <vaadin-combo-box id="supervisor-search" filtered-items="[[supervisorListItem]]" item-label-path="hrLabel" item-value-path="id" on-filter-changed="_superVisorSearch" on-keydown="isEnterPressed" label="[[localize('supervisor','Votre médecin référent (uniquement si vous êtes stagiaire)',language)]]" value="{{hcp.supervisorId}}">
                                        </vaadin-combo-box>
                                    </template>

                                </div>

                                <div class="col-lg-6 tile">
                                    <h2>
                                        <iron-icon icon="cloud"></iron-icon>
                                        eServices
                                    </h2>
                                    <div class="line p8">
                                        <paper-dropdown-menu id="preferredHub" label="[[localize('pre_hub','Preferred hub',language)]]">
                                            <paper-listbox slot="dropdown-content" attr-for-selected="name" selected="{{userPreferredHub}}">
                                                <paper-item name="rsb">[[localize('rsw','RSB',language)]]</paper-item>
                                                <paper-item name="rsw">[[localize('rsb','RSW',language)]]</paper-item>
                                                <paper-item name="vitalink">
                                                    [[localize('vitalink','Vitalink',language)]]
                                                </paper-item>
                                            </paper-listbox>
                                        </paper-dropdown-menu>
                                        <paper-radio-group selected="{{userEHealthEnv}}">
                                            <paper-radio-button name="acc">[[localize('acc','Acceptance',language)]]
                                            </paper-radio-button>
                                            <paper-radio-button name="prd">[[localize('prd','Production',language)]]
                                            </paper-radio-button>
                                        </paper-radio-group>
                                    </div>

                                    <div class="horizontal line p8">
                                        <vaadin-checkbox checked="{{receiveMailAuto}}">[[localize('auto_ehbox','Receive
                                            mails automatically',language)]]
                                        </vaadin-checkbox>
                                    </div>
                                </div>

                            </vaadin-form-layout>

                        </div>
                    </page>

                    <page>
                        <div class="horizontal" style="margin-top:10px">
                            <vaadin-form-layout>
                                <div class="col-lg-6 tile">
                                    <h2>
                                        <iron-icon icon="social:person"></iron-icon>
                                        [[localize('gen_info','General informations',language)]]
                                    </h2>
                                    <template is="dom-if" if="[[!_isMedicalHouse(hcp.type)]]">
                                        <div class="line">
                                            <paper-input label="[[localize('lastname','Nom',language)]] *" value="{{hcp.lastName}}"></paper-input>
                                            <paper-input label="[[localize('firstname','Prénom',language)]] *" value="{{hcp.firstName}}"></paper-input>
                                        </div>
                                        <div class="line">
                                            <paper-input label="[[localize('ssin','Registre national',language)]]" value="{{hcp.ssin}}"></paper-input>
                                            <paper-input label="[[localize('nihii','Numéro Inami',language)]]" value="{{hcp.nihii}}"></paper-input>
                                        </div>
                                    </template>
                                    <template is="dom-if" if="[[_isMedicalHouse(hcp.type)]]">
                                        <paper-input label="[[localize('name','Nom',language)]]" value="{{hcp.name}}"></paper-input>
                                    </template>
                                    <paper-input label="[[localize('cbe','CBE',language)]]" value="{{hcp.cbe}}"></paper-input>
                                </div>
                                <div class="col-lg-6 tile">
                                    <h2>
                                        <iron-icon icon="home"></iron-icon>
                                        [[localize('addr_pro','Work Address',language)]]
                                    </h2>
                                    <div class="line">
                                        <paper-input label="[[localize('street','Street',language)]] *" value="{{adr.street}}"></paper-input>
                                        <paper-input class="no-grow w50" label="[[localize('number','House Number',language)]] *" value="{{adr.houseNumber}}"></paper-input>
                                        <paper-input class="no-grow w150" label="[[localize('box_number','Box Number',language)]]" value="{{adr.postboxNumber}}"></paper-input>
                                    </div>
                                    <div class="line">
                                        <paper-input class="no-grow w100" label="[[localize('postalCode','Postal Code',language)]] *" value="{{adr.postalCode}}"></paper-input>
                                        <paper-input class="grow-3" label="[[localize('city','City',language)]] *" value="{{adr.city}}"></paper-input>
                                        <paper-input label="[[localize('country','Country',language)]] *" value="{{adr.country}}"></paper-input>
                                    </div>
                                    <div class="line">
                                        <paper-input label="[[localize('phone','Phone',language)]] *" value="{{adr.phoneNumber}}"></paper-input>
                                        <paper-input label="[[localize('email','Email',language)]] *" value="{{adr.proMail}}"></paper-input>
                                    </div>
                                </div>
                                <template is="dom-if" if="[[!_isMedicalHouse(hcp.type)]]">
                                    <div class="col-lg-6 tile">
                                        <h2>
                                            <iron-icon icon="assignment"></iron-icon>
                                            [[localize('info','Informations',language)]]
                                            [[localize('inv_prest','physician',language)]]
                                        </h2>
                                        <!-- <paper-input label="[[localize('civility','Civilité',language)]]" value="{{hcp.civility}}"></paper-input> -->
                                        <paper-input label="[[localize('speciality','Spécialité',language)]]" value="{{hcp.speciality}}"></paper-input>
                                        <paper-input label="[[localize('gender','Genre',language)]]" value="{{hcp.gender}}"></paper-input>
                                    </div>
                                </template>
                                <!--<div class="toolTip" style="margin-top:20px"><iron-icon icon="icons:info-outline" style="margin-right: 10px"></iron-icon> Vous souhaitez modifier votre profile complet ?</div>-->
                                <!--<div class="toolTip" style="margin-bottom:20px"><iron-icon icon="icons:account-circle" class="marginRight10"></iron-icon> <b>Rendez-vous dans <a on-tap="_gotoMyProfile" style="color:var(&#45;&#45;app-secondary-color); cursor:pointer">votre fiche personnelle</a></b></div>-->

                            </vaadin-form-layout>
                        </div>
                    </page>

                    <page>
                        <dynamic-bank-account opened="{{opened}}" api="[[api]]" user="{{user}}" hcp="{{hcp}}" i18n="[[i18n]]" language="[[language]]"></dynamic-bank-account>
                    </page>


                    <page>

                        <div class="horizontal" style="padding-top:10px;">

                            <!--<template is="dom-repeat" items="[[currentRegs.rs]]" as="reg">-->
                            <!--[[_getOARegStatus(reg)]]-->
                            <!--</template>-->

                            <template is="dom-if" if="[[allEDmgregistered]]">
                                <ht-iban-validator validator-name="ht-iban-validator"></ht-iban-validator>
                                <div class="row" style="position:relative">
                                    <div id="edmgRegistrationComplete">
                                        <iron-icon icon="check-circle"></iron-icon>
                                        <p>[[localize('edmg_completed','EDMG REGISTRATION COMPLETED',language)]]</p>
                                    </div>
                                    <div class="col-15">


                                        <paper-input value="OA" readonly="" disabled="" class="headerField borderTop borderLeft"></paper-input>
                                        <paper-input value="OA 100" readonly="" disabled="" class="headerField borderRight borderLeft"></paper-input>
                                        <paper-input value="OA 200" readonly="" disabled="" class="headerField borderRight borderLeft"></paper-input>
                                        <paper-input value="OA 300" readonly="" disabled="" class="headerField borderRight borderLeft"></paper-input>
                                        <paper-input value="OA 400" readonly="" disabled="" class="headerField borderRight borderLeft"></paper-input>
                                        <paper-input value="OA 500" readonly="" disabled="" class="headerField borderRight borderLeft"></paper-input>
                                        <paper-input value="OA 600" readonly="" disabled="" class="headerField borderRight borderLeft"></paper-input>
                                        <paper-input value="OA 900" readonly="" disabled="" class="headerField borderRight borderLeft borderBottom"></paper-input>
                                    </div>
                                    <div class="col-45">
                                        <paper-input label="IBAN" readonly="" disabled="" class="headerField borderTop borderBottom"></paper-input>
                                        <paper-input label="IBAN" value="{{userIBAN_100}}" id="userIBAN_100" rel="100" validator="ht-iban-validator" auto-validate="" on-value-changed="_evalBic" on-tap="_evalBic" readonly="">
                                            <iron-icon class="icon-button" slot="suffix" on-tap="replicateIbanValueToAllFields" icon="content-copy" alt="Copy in all fields" title="Copy in all fields"></iron-icon>
                                            <iron-icon icon="account-balance" slot="suffix"></iron-icon>
                                        </paper-input>
                                        <paper-input label="IBAN" value="{{userIBAN_200}}" id="userIBAN_200" rel="200" validator="ht-iban-validator" auto-validate="" on-value-changed="_evalBic" on-tap="_evalBic" readonly="">
                                            <iron-icon icon="account-balance" slot="suffix"></iron-icon>
                                        </paper-input>
                                        <paper-input label="IBAN" value="{{userIBAN_300}}" id="userIBAN_300" rel="300" validator="ht-iban-validator" auto-validate="" on-value-changed="_evalBic" on-tap="_evalBic" readonly="">
                                            <iron-icon icon="account-balance" slot="suffix"></iron-icon>
                                        </paper-input>
                                        <paper-input label="IBAN" value="{{userIBAN_400}}" id="userIBAN_400" rel="400" validator="ht-iban-validator" auto-validate="" on-value-changed="_evalBic" on-tap="_evalBic" readonly="">
                                            <iron-icon icon="account-balance" slot="suffix"></iron-icon>
                                        </paper-input>
                                        <paper-input label="IBAN" value="{{userIBAN_500}}" id="userIBAN_500" rel="500" validator="ht-iban-validator" auto-validate="" on-value-changed="_evalBic" on-tap="_evalBic" readonly="">
                                            <iron-icon icon="account-balance" slot="suffix"></iron-icon>
                                        </paper-input>
                                        <paper-input label="IBAN" value="{{userIBAN_600}}" id="userIBAN_600" rel="600" validator="ht-iban-validator" auto-validate="" on-value-changed="_evalBic" on-tap="_evalBic" readonly="">
                                            <iron-icon icon="account-balance" slot="suffix"></iron-icon>
                                        </paper-input>
                                        <paper-input label="IBAN" value="{{userIBAN_900}}" id="userIBAN_900" rel="900" validator="ht-iban-validator" auto-validate="" on-value-changed="_evalBic" on-tap="_evalBic" readonly="">
                                            <iron-icon icon="account-balance" slot="suffix"></iron-icon>
                                        </paper-input>
                                    </div>
                                    <div class="col-30">
                                        <paper-input label="BIC" readonly="" disabled="" class="headerField borderTop borderBottom"></paper-input>
                                        <paper-input label="BIC" value="{{userBIC_100}}" id="userBIC_100" rel="100" readonly="">
                                            <iron-icon icon="settings" slot="suffix"></iron-icon>
                                        </paper-input>
                                        <paper-input label="BIC" value="{{userBIC_200}}" id="userBIC_200" rel="200" readonly="">
                                            <iron-icon icon="settings" slot="suffix"></iron-icon>
                                        </paper-input>
                                        <paper-input label="BIC" value="{{userBIC_300}}" id="userBIC_300" rel="300" readonly="">
                                            <iron-icon icon="settings" slot="suffix"></iron-icon>
                                        </paper-input>
                                        <paper-input label="BIC" value="{{userBIC_400}}" id="userBIC_400" rel="400" readonly="">
                                            <iron-icon icon="settings" slot="suffix"></iron-icon>
                                        </paper-input>
                                        <paper-input label="BIC" value="{{userBIC_500}}" id="userBIC_500" rel="500" readonly="">
                                            <iron-icon icon="settings" slot="suffix"></iron-icon>
                                        </paper-input>
                                        <paper-input label="BIC" value="{{userBIC_600}}" id="userBIC_600" rel="600" readonly="">
                                            <iron-icon icon="settings" slot="suffix"></iron-icon>
                                        </paper-input>
                                        <paper-input label="BIC" value="{{userBIC_900}}" id="userBIC_900" rel="900" readonly="">
                                            <iron-icon icon="settings" slot="suffix"></iron-icon>
                                        </paper-input>
                                    </div>
                                    <div class="col-10">
                                        <paper-input label="STATUS" readonly="" disabled="" class="headerField borderTop borderRight borderBottom"></paper-input>
                                        <div class="statusBulletContainer">
                                            <div class\$="statusBullet [[statusBullet_100_cssClass]]" rel="100" id="statusBullet_100"></div>
                                        </div>
                                        <div class="statusBulletContainer">
                                            <div class\$="statusBullet [[statusBullet_200_cssClass]]" rel="200" id="statusBullet_200"></div>
                                        </div>
                                        <div class="statusBulletContainer">
                                            <div class\$="statusBullet [[statusBullet_300_cssClass]]" rel="300" id="statusBullet_300"></div>
                                        </div>
                                        <div class="statusBulletContainer">
                                            <div class\$="statusBullet [[statusBullet_400_cssClass]]" rel="400" id="statusBullet_400"></div>
                                        </div>
                                        <div class="statusBulletContainer">
                                            <div class\$="statusBullet [[statusBullet_500_cssClass]]" rel="500" id="statusBullet_500"></div>
                                        </div>
                                        <div class="statusBulletContainer">
                                            <div class\$="statusBullet [[statusBullet_600_cssClass]]" rel="600" id="statusBullet_600"></div>
                                        </div>
                                        <div class="statusBulletContainer">
                                            <div class\$="statusBullet [[statusBullet_900_cssClass]]" rel="900" id="statusBullet_900"></div>
                                        </div>
                                    </div>
                                </div>
                            </template>

                            <template is="dom-if" if="[[!allEDmgregistered]]">

                                <ht-iban-validator validator-name="ht-iban-validator"></ht-iban-validator>
                                <div class="row" style="position:relative">

                                    <div class="col-20">
                                        <paper-input value="OA" readonly="" disabled="" class="headerField borderTop borderLeft"></paper-input>
                                        <paper-input value="OA 100" readonly="" disabled="" class="headerField borderRight borderLeft"></paper-input>
                                        <paper-input value="OA 200" readonly="" disabled="" class="headerField borderRight borderLeft"></paper-input>
                                        <paper-input value="OA 300" readonly="" disabled="" class="headerField borderRight borderLeft"></paper-input>
                                        <paper-input value="OA 400" readonly="" disabled="" class="headerField borderRight borderLeft"></paper-input>
                                        <paper-input value="OA 500" readonly="" disabled="" class="headerField borderRight borderLeft"></paper-input>
                                        <paper-input value="OA 600" readonly="" disabled="" class="headerField borderRight borderLeft"></paper-input>
                                        <paper-input value="OA 900" readonly="" disabled="" class="headerField borderRight borderLeft borderBottom"></paper-input>
                                    </div>
                                    <div class="col-40">
                                        <paper-input label="IBAN" readonly="" disabled="" class="headerField borderTop borderBottom"></paper-input>
                                        <paper-input label="IBAN" value="{{userIBAN_100}}" id="userIBAN_100" rel="100" validator="ht-iban-validator" auto-validate="" on-value-changed="_evalBic" on-tap="_evalBic">
                                            <iron-icon class="icon-button" slot="suffix" on-tap="replicateIbanValueToAllFields" icon="content-copy" alt="Copy in all fields" title="Copy in all fields"></iron-icon>
                                            <iron-icon icon="account-balance" slot="suffix"></iron-icon>
                                        </paper-input>
                                        <paper-input label="IBAN" value="{{userIBAN_200}}" id="userIBAN_200" rel="200" validator="ht-iban-validator" auto-validate="" on-value-changed="_evalBic" on-tap="_evalBic">
                                            <iron-icon icon="account-balance" slot="suffix"></iron-icon>
                                        </paper-input>
                                        <paper-input label="IBAN" value="{{userIBAN_300}}" id="userIBAN_300" rel="300" validator="ht-iban-validator" auto-validate="" on-value-changed="_evalBic" on-tap="_evalBic">
                                            <iron-icon icon="account-balance" slot="suffix"></iron-icon>
                                        </paper-input>
                                        <paper-input label="IBAN" value="{{userIBAN_400}}" id="userIBAN_400" rel="400" validator="ht-iban-validator" auto-validate="" on-value-changed="_evalBic" on-tap="_evalBic">
                                            <iron-icon icon="account-balance" slot="suffix"></iron-icon>
                                        </paper-input>
                                        <paper-input label="IBAN" value="{{userIBAN_500}}" id="userIBAN_500" rel="500" validator="ht-iban-validator" auto-validate="" on-value-changed="_evalBic" on-tap="_evalBic">
                                            <iron-icon icon="account-balance" slot="suffix"></iron-icon>
                                        </paper-input>
                                        <paper-input label="IBAN" value="{{userIBAN_600}}" id="userIBAN_600" rel="600" validator="ht-iban-validator" auto-validate="" on-value-changed="_evalBic" on-tap="_evalBic">
                                            <iron-icon icon="account-balance" slot="suffix"></iron-icon>
                                        </paper-input>
                                        <paper-input label="IBAN" value="{{userIBAN_900}}" id="userIBAN_900" rel="900" validator="ht-iban-validator" auto-validate="" on-value-changed="_evalBic" on-tap="_evalBic">
                                            <iron-icon icon="account-balance" slot="suffix"></iron-icon>
                                        </paper-input>
                                    </div>
                                    <div class="col-30">
                                        <paper-input label="BIC" readonly="" disabled="" class="headerField borderTop borderBottom"></paper-input>
                                        <paper-input label="BIC" value="{{userBIC_100}}" id="userBIC_100" rel="100" readonly="">
                                            <iron-icon icon="settings" slot="suffix"></iron-icon>
                                        </paper-input>
                                        <paper-input label="BIC" value="{{userBIC_200}}" id="userBIC_200" rel="200" readonly="">
                                            <iron-icon icon="settings" slot="suffix"></iron-icon>
                                        </paper-input>
                                        <paper-input label="BIC" value="{{userBIC_300}}" id="userBIC_300" rel="300" readonly="">
                                            <iron-icon icon="settings" slot="suffix"></iron-icon>
                                        </paper-input>
                                        <paper-input label="BIC" value="{{userBIC_400}}" id="userBIC_400" rel="400" readonly="">
                                            <iron-icon icon="settings" slot="suffix"></iron-icon>
                                        </paper-input>
                                        <paper-input label="BIC" value="{{userBIC_500}}" id="userBIC_500" rel="500" readonly="">
                                            <iron-icon icon="settings" slot="suffix"></iron-icon>
                                        </paper-input>
                                        <paper-input label="BIC" value="{{userBIC_600}}" id="userBIC_600" rel="600" readonly="">
                                            <iron-icon icon="settings" slot="suffix"></iron-icon>
                                        </paper-input>
                                        <paper-input label="BIC" value="{{userBIC_900}}" id="userBIC_900" rel="900" readonly="">
                                            <iron-icon icon="settings" slot="suffix"></iron-icon>
                                        </paper-input>
                                    </div>
                                    <div class="col-10">
                                        <paper-input label="STATUS" readonly="" disabled="" class="headerField borderTop borderRight borderBottom"></paper-input>
                                        <div class="statusBulletContainer">
                                            <div class\$="statusBullet [[statusBullet_100_cssClass]]" rel="100" id="statusBullet_100"></div>
                                        </div>
                                        <div class="statusBulletContainer">
                                            <div class\$="statusBullet [[statusBullet_200_cssClass]]" rel="200" id="statusBullet_200"></div>
                                        </div>
                                        <div class="statusBulletContainer">
                                            <div class\$="statusBullet [[statusBullet_300_cssClass]]" rel="300" id="statusBullet_300"></div>
                                        </div>
                                        <div class="statusBulletContainer">
                                            <div class\$="statusBullet [[statusBullet_400_cssClass]]" rel="400" id="statusBullet_400"></div>
                                        </div>
                                        <div class="statusBulletContainer">
                                            <div class\$="statusBullet [[statusBullet_500_cssClass]]" rel="500" id="statusBullet_500"></div>
                                        </div>
                                        <div class="statusBulletContainer">
                                            <div class\$="statusBullet [[statusBullet_600_cssClass]]" rel="600" id="statusBullet_600"></div>
                                        </div>
                                        <div class="statusBulletContainer">
                                            <div class\$="statusBullet [[statusBullet_900_cssClass]]" rel="900" id="statusBullet_900"></div>
                                        </div>
                                    </div>
                                </div>
                            </template>


                            <template is="dom-if" if="[[!allEDmgregistered]]">
                                <div class="horizontal" style="margin-top:10px">
                                    <div class="row">
                                        <div class="col-35">&nbsp;</div>
                                        <div class="col-30 textAlignCenter">
                                            <paper-button disabled="[[!registerEnabled]]" on-tap="_registerToEDMG" class="modal-button--save">[[localize('reg_dmg','Register to
                                                eDmg',language)]]
                                            </paper-button>
                                        </div>
                                        <div class="col-35">&nbsp;</div>
                                    </div>
                                </div>
                                <div class="horizontal">&nbsp;</div>
                            </template>

                        </div>

                    </page>


                </iron-pages>
            </div>


            <div class="buttons">
                <paper-button class="modal-button modal-button--cancel" dialog-dismiss="">
                    [[localize('clo','Close',language)]]
                </paper-button>
                <paper-button class="modal-button modal-button--save" autofocus="" on-tap="confirm">
                    [[localize('save','Save',language)]]
                </paper-button>
            </div>
        </paper-dialog>
`;
  }

  static get is() {
      return 'ht-my-profile';
  }

  static get properties() {
      return {
          api: {
              type: Object,
              value: null
          },
          user: {
              type: Object,
              value: null
          },
          hcp: {
              type: Object,
              value: null
          },
          qrCodeWidth: {
              type: Number,
              value: 0
          },
          opened: {
              type: Boolean,
              value: false
          },
          verbose: {
              type: Boolean,
              value: true
          },
          userPassword: {
              type: String,
              value: null
          },
          userConfirmation: {
              type: String,
              value: null
          },
          userPreferredHub: {
              type: String,
              value: null
          },
          userEHealthEnv: {
              type: String,
              value: null
          },
          userIBAN: {
              type: String,
              value: null
          },
          userBIC: {
              type: String,
              value: null
          },
          userMedicalHouseNihii: {
              type: String,
              value: null

          },
          listOAs: {
              type: Array,
              value: ['100', '200', '300', '400', '500', '600', '900']
          },
          regStatus: {
              type: Object,
              value: null
          },
          allEDmgregistered: {
              type: Boolean,
              value: false
          },
          currentRegs: {
              type: Object,
              value: null
          },
          tabs: {
              type: Number,
              value: 0
          },
          registerEnabled: {
              type: Boolean,
              value: true
          },
          userIBAN_100: {type: String, value: ''},
          userIBAN_200: {type: String, value: ''},
          userIBAN_300: {type: String, value: ''},
          userIBAN_400: {type: String, value: ''},
          userIBAN_500: {type: String, value: ''},
          userIBAN_600: {type: String, value: ''},
          userIBAN_900: {type: String, value: ''},

          userBIC_100: {type: String, value: ''},
          userBIC_200: {type: String, value: ''},
          userBIC_300: {type: String, value: ''},
          userBIC_400: {type: String, value: ''},
          userBIC_500: {type: String, value: ''},
          userBIC_600: {type: String, value: ''},
          userBIC_900: {type: String, value: ''},

          statusBullet_100_cssClass: {type: String, value: ''},
          statusBullet_200_cssClass: {type: String, value: ''},
          statusBullet_300_cssClass: {type: String, value: ''},
          statusBullet_400_cssClass: {type: String, value: ''},
          statusBullet_500_cssClass: {type: String, value: ''},
          statusBullet_600_cssClass: {type: String, value: ''},
          statusBullet_900_cssClass: {type: String, value: ''},

          allEDmgregisteredReadAttribute: {type: String, value: ''},

          supervisorListItem: {
              type: Array,
              value: function () {
                  return [];
              }
          },
          mhListItem: {
              type: Array,
              value: function () {
                  return [];
              }
          },
          hcpListItem: {
              type: Array,
              value: function () {
                  return [];
              }
          },
          adr: {
              type: Object,
              value: {},
              observer: 'addressProChanged'
          },
          receiveMailAuto: {
              type: Boolean,
              value: localStorage.getItem('receiveMailAuto') ? localStorage.getItem('receiveMailAuto') : true
          },
          printers: {
              type: Array,
              value: []
          },
          selectedPrinter: {
              type: Object,
              value: {
                  a4: {"color": '', "bw": ''},
                  a5: {"color": '', "bw": ''},
                  presc: {"color": '', "bw": ''},
                  stickers: {"bw": '', "h": 0, "w": 0},
                  regulations: {"bw": ''}
              }
          },
          numericSelectedPrinter: {
              type: Object,
              value: {
                  a4: {"color": null, "bw": null},
                  a5: {"color": null, "bw": null},
                  presc: {"color": null, "bw": null},
                  stickers: {"bw": null, "h": null, "w": null},
                  regulations: {"bw": null}
              }
          },
          electronAvailable: {
              type: Boolean,
              value: false
          },
          showQr: {
              type: Boolean,
              value: true
          },
          idAddress: {
              type: Number,
              value: -1
          }
      };
  }

  static get observers() {
      return ['apiReady(api,user,opened)', '_userChanged(user)', 'addressProChanged(adr,adr.*)', '_autoMailChanged(receiveMailAuto)', '_selectedPrinterChanged(selectedPrinter.*)'];
  }

  ready() {
      super.ready();
      this.addEventListener('iron-resize', () => this.onWidthChange());
      this.set('receiveMailAuto', localStorage.getItem('receiveMailAuto') ? localStorage.getItem('receiveMailAuto') : true)
  }

  _autoMailChanged() {
      localStorage.setItem('receiveMailAuto', this.receiveMailAuto)
      console.log('just set receiveMailAuto to ', this.receiveMailAuto + ' ' + typeof this.receiveMailAuto, 'storage says ', localStorage.getItem('receiveMailAuto') + ' ' + typeof localStorage.getItem('receiveMailAuto'))
  }

  aspectRatio(props) {
      return this.user && (((this.user.properties.find(p => p.type && p.type.identifier === 'org.taktik.icure.user.wideAspectRatio') || {typedValue: {}}).typedValue.booleanValue || false) ? 'wide' : 'narrow')
  }

  aspectRatioChanged(ev) {
      const propAr = this.user.properties.find(p => p.type && p.type.identifier === 'org.taktik.icure.user.wideAspectRatio') ||
          (this.user.properties[this.user.properties.length] = {
              type: {identifier: 'org.taktik.icure.user.wideAspectRatio'},
              typedValue: {type: 'BOOLEAN', booleanValue: false}
          });

      propAr.typedValue = {type: 'BOOLEAN', booleanValue: ev.detail.value === 'wide'}
  }

  showEHPreferrences(user) {
      const propHub = this.user.properties.find(p => p.type && p.type.identifier === 'org.taktik.icure.user.preferredhub') ||
          (this.user.properties[this.user.properties.length] = {
              type: {identifier: 'org.taktik.icure.user.preferredhub'},
              typedValue: {type: 'STRING', stringValue: 'rsw'}
          });
      this.set('userPreferredHub', propHub.typedValue.stringValue);

      const propEnv = this.user.properties.find(p => p.type && p.type.identifier === 'org.taktik.icure.user.eHealthEnv') ||
          (this.user.properties[this.user.properties.length] = {
              type: {identifier: 'org.taktik.icure.user.eHealthEnv'},
              typedValue: {type: 'STRING', stringValue: 'prd'}
          });
      this.set('userEHealthEnv', propEnv.typedValue.stringValue);

      const propMHNihii = this.user.properties.find(p => p.type && p.type.identifier === 'org.taktik.icure.user.medicalHouse.nihii') ||
          (this.user.properties[this.user.properties.length] = {
              type: {identifier: 'org.taktik.icure.user.medicalHouse.nihii'},
              typedValue: {type: 'STRING', stringValue: ''}
          });
      this.set('userMedicalHouseNihii', propMHNihii.typedValue.stringValue);

      const propBIC = this.user.properties.find(p => p.type && p.type.identifier === 'org.taktik.icure.user.BIC') ||
          (this.user.properties[this.user.properties.length] = {
              type: {identifier: 'org.taktik.icure.user.BIC'},
              typedValue: {type: 'STRING', stringValue: ''}
          });
      this.set('userBIC', propBIC.typedValue.stringValue);

      const propIBAN = this.user.properties.find(p => p.type && p.type.identifier === 'org.taktik.icure.user.IBAN') ||
          (this.user.properties[this.user.properties.length] = {
              type: {identifier: 'org.taktik.icure.user.IBAN'},
              typedValue: {type: 'STRING', stringValue: ''}
          });
      this.set('userIBAN', propIBAN.typedValue.stringValue);
  }

  _getOARegStatus(reg) {
      if (reg) {
          return reg.registered ? reg.OA + ':OK ' : reg.OA + ':NOK ';
      } else {
          return ''
      }
  }

  _registerToEDMG() {
      //100,200,300,400,500,600,900
      let regs = this.getRegistrationStatus();
      this.set('registerEnabled', false);
      Promise.all(regs.rs.filter(reg => !reg.registered).map(reg =>
          this.registerToEDMGbyOA(_.assign(reg, {
              iban: this[`userIBAN_${reg.OA}`],
              bic: this[`userBIC_${reg.OA}`]
          })).then(reg => {
              this.set(`statusBullet_${reg.OA}_cssClass`, reg.registered ? 'ok' : '')
              const idx = regs.rs.findIndex(r => r.OA === reg.OA);
              if (idx >= 0) {
                  regs.rs.splice(idx, 1, reg);
              } else {
                  regs.rs.push(reg);
              }

              this.set('regStatus', JSON.stringify(regs));

              let propRegStatus = this.user.properties.find(p => p.type && p.type.identifier === 'org.taktik.icure.user.eDMG.RegistrationStatus')
              propRegStatus.typedValue.stringValue = this.regStatus;

              return reg
          })
      )).then(regs => {
          let allDone = regs.every(r => !!r.registered)
          this.set('allEDmgregistered', allDone)
          return this.api.user().modifyUser(this.user)
              .then(user => {
                  this.user = user
                  this.dispatchEvent(new CustomEvent('user-saved', {
                      detail: user,
                      bubbles: true,
                      composed: true
                  }))
              })
              .finally(() => {
                  if (!allDone) {
                      setTimeout(() => {
                          this._registerToEDMG()
                      }, 300000)
                  }
              })
      }).finally(() => this.set('registerEnabled', true))
  }

  getRegistrationStatus() {
      const propRegStatus = this.user.properties.find(p => p.type && p.type.identifier === 'org.taktik.icure.user.eDMG.RegistrationStatus') ||
          (this.user.properties[this.user.properties.length] = {
              type: {identifier: 'org.taktik.icure.user.eDMG.RegistrationStatus'},
              typedValue: {type: 'JSON', stringValue: '{\"rs\":[]}'}
          });
      //'{"rs":[{"OA":"100","Comment":"","ErrorCode":""}]}'

      let OAStatus = {};
      if (propRegStatus && propRegStatus.typedValue) {
          OAStatus = JSON.parse(propRegStatus.typedValue.stringValue);
      }
      let regs = {rs: (OAStatus.rs || []).map(r => r)}
      this.listOAs.map(itOA => {
          let reg = regs.rs.find(r => r.OA === itOA) || {
              OA: itOA,
              registered: false,
              lastExecution: null,
              Comment: '',
              ErrorCode: '',
              iban: '',
              bic: ''
          };
          const idx = regs.rs.findIndex(r => r.OA === itOA);
          if (idx >= 0) {
              regs.rs.splice(idx, 1, reg);
          } else {
              regs.rs.push(reg);
          }
      })
      this.set('allEDmgregistered', regs.rs.every(r => !!r.registered));
      this.set('currentRegs', regs);

      return regs;
  }


  registerToEDMGbyOA(reg) {
      if (this.api.tokenId) {
          if (!iban.isValid(reg.iban)) {
              return Promise.resolve(reg)
          }
          return this.api.hcparty().getHealthcareParty(this.user.healthcarePartyId)
              .then(hcp => {
                      return this.api.fhc().Dmgcontroller().registerDoctorUsingPOST(
                          this.api.keystoreId, this.api.tokenId, this.api.credentials.ehpassword,
                          hcp.nihii, hcp.ssin, hcp.firstName, hcp.lastName, reg.OA, reg.bic.replace(/ /g, '').toUpperCase(), reg.iban.replace(/ /g, '').toUpperCase())
                          .then(r => this.api.logMcn(r, this.user, hcp.id, "DMG", "register"))
                  }
              ).then(regResp => {
                      if (regResp) {
                          if (regResp.errors && regResp.errors.length > 0) {
                              const err = regResp.errors.find(er => er.code === '168')
                              if (err && err.code === '168') {
                                  reg.registered = true
                                  reg.lastExecution = (new Date).getTime()
                                  return reg
                              } else {
                                  reg.registered = regResp.success
                                  reg.lastExecution = (new Date).getTime()
                                  reg.response = JSON.stringify(regResp)
                                  return reg
                              }
                          } else {
                              reg.registered = regResp.success
                              reg.lastExecution = (new Date).getTime()
                              return reg
                          }
                      } else {
                          reg.registered = false
                          reg.lastExecution = (new Date).getTime()
                          return reg
                      }
                  }
              )
              .catch((error) => {
                  reg.Comment = 'exception caugh:' + error
                  reg.response = JSON.stringify(error)
                  reg.lastExecution = (new Date).getTime()

                  return Promise.resolve(reg)
              })
      } else {
          reg.Comment = 'err: no tokenid'
          return Promise.resolve(reg)
      }
  }

  _userChanged(user) {
  }

  _mismatch(a, b) {
      return a && a !== b
  }

  _tooShort(a) {
      return a && a.length < 8
  }

  apiReady() {
      if (this.user && this.api && this.opened) {
          this.api.hcparty().getHealthcareParty(this.user.healthcarePartyId).then(hcp => this.hcp = this.api.register(hcp, 'hcp', null, true)).then(hcp => {
              if (!hcp.languages || !hcp.languages.length) hcp.languages = ['en'];
              if (!hcp.type) hcp.type = 'persphysician';
              if (!hcp.billingType) hcp.billingType = 'flatRate';

              // Resolve for dataprovider / combobox
              if (hcp.supervisorId || hcp.parentId || hcp.contactPersonHcpId) {

                  const hcpIdx = _.compact([hcp.supervisorId, hcp.parentId, hcp.contactPersonHcpId]).join(',')
                  this.api.hcparty().getHealthcareParties(hcpIdx).then(results => {
                      const supervisor = _.chain(results).filter({id: hcp.supervisorId}).head().value();
                      const parent = _.chain(results).filter({id: hcp.parentId}).head().value();
                      const contactPerson = _.chain(results).filter({id: hcp.contactPersonHcpId}).head().value();

                      this.supervisorListItem = supervisor ? [{
                          id: supervisor.id,
                          lastName: _.upperFirst(_.lowerCase(supervisor.lastName)),
                          hrLabel:
                              _.upperFirst(_.lowerCase(supervisor.lastName)) + ' ' +
                              _.upperFirst(_.lowerCase(supervisor.firstName)) + ' ' +
                              (typeof supervisor.nihii === 'undefined' || !supervisor.nihii ? '' : ' - ' + this.localize('nihii', 'INAMI', language) + ': ' + supervisor.nihii) + ' ' +
                              (typeof supervisor.ssin === 'undefined' || !supervisor.ssin ? '' : ' - ' + this.localize('ssin', 'Registre national', language) + ': ' + supervisor.ssin.substr(0, 6) + '-' + supervisor.ssin.substr(6, 3) + '-' + supervisor.ssin.substr(8, 2)) + ' ' +
                              ''
                      }] : [];

                      this.mhListItem = parent ? [{
                          id: parent.id,
                          name: _.upperFirst(_.lowerCase(parent.name)),
                          hrLabel:
                              _.upperFirst(_.lowerCase(parent.name)) + ' ' +
                              (typeof parent.nihii === 'undefined' || !parent.nihii ? '' : ' - ' + this.localize('nihii', 'INAMI', language) + ': ' + parent.nihii) + ' ' +
                              ''
                      }] : [];

                      this.contactListItem = contactPerson ? [{
                          id: contactPerson.id,
                          name: _.upperFirst(_.lowerCase(contactPerson.name)),
                          hrLabel:
                              _.upperFirst(_.lowerCase(contactPerson.name)) + ' ' +
                              (typeof contactPerson.nihii === 'undefined' || !contactPerson.nihii ? '' : ' - ' + this.localize('nihii', 'INAMI', language) + ': ' + contactPerson.nihii) + ' ' +
                              ''
                      }] : [];

                  });

              }

              this._hcpChanged()
          });
      }
  }

  _hcpChanged() {
      if (this.api && this.hcp) {
          this.api.getRegistry('hcp').listeners['hcp-profile'] = {
              target: this,
              callbacks: [() => this._hcpChanged()],
              pool: [this.hcp.id]
          }

          if (this.idAddress === -1) {
              this.idAddress = this.hcp.addresses.findIndex(adr => adr.addressType === "work")
          }
          let idxPhone = this.hcp.addresses[this.idAddress].telecoms.findIndex(tel => tel && tel.telecomType === "phone")
          let idxMail = this.hcp.addresses[this.idAddress].telecoms.findIndex(tel => tel && tel.telecomType === "email")
          this.idAddress >= 0 ? this.set('adr', {
              addressType: "work",
              street: this.hcp.addresses[this.idAddress].street,
              houseNumber: this.hcp.addresses[this.idAddress].houseNumber,
              postboxNumber: this.hcp.addresses[this.idAddress].postboxNumber,
              postalCode: this.hcp.addresses[this.idAddress].postalCode,
              city: this.hcp.addresses[this.idAddress].city,
              country: this.hcp.addresses[this.idAddress].country,
              phoneNumber: this.hcp.addresses[this.idAddress].telecoms[idxPhone] && this.hcp.addresses[this.idAddress].telecoms[idxPhone].telecomNumber || '',
              proMail: this.hcp.addresses[this.idAddress].telecoms[idxMail] && this.hcp.addresses[this.idAddress].telecoms[idxMail].telecomNumber || ''
          }) : ""
      }
  }


  qrCode(login, secret) {
      return login && secret ? `otpauth://totp/${login}:iCure-cloud?secret=${secret}&issuer=icure-cloud` : '';
  }

  attached() {
      super.attached();
      this.async(this.notifyResize, 1);
  }

  onWidthChange() {
      const offsetWidth = this.$.dialog.offsetWidth;
      const offsetHeight = this.$.dialog.offsetHeight;
      if (!offsetWidth || !offsetHeight) {
          return;
      }
      this.set('qrCodeWidth', Math.max(Math.min(offsetWidth / 2 - 64, 280), 120));
  }

  open(tab) {
      this.showEHPreferrences(this.user);
      const regs = this.getRegistrationStatus()
      regs.rs.forEach(reg => {
          this.set(`userIBAN_${reg.OA}`, reg.iban)
          this.set(`userBIC_${reg.OA}`, reg.bic)
          this.set(`statusBullet_${reg.OA}_cssClass`, reg.registered ? 'ok' : '')
      })

      this.$.dialog.open();
      this.set('tabs', tab > 0 ? tab : 0)
  }

  close() {
      this.$.dialog.close();
  }

  confirm() {
      if ((!this.userPassword || this.userPassword.length > 7) && this.userPassword === this.userConfirmation) {
          this.user.passwordHash = this.userPassword || this.user.passwordHash
          let propHub = this.user.properties.find(p => p.type && p.type.identifier === 'org.taktik.icure.user.preferredhub')
          propHub.typedValue.stringValue = this.userPreferredHub;
          let propEnv = this.user.properties.find(p => p.type && p.type.identifier === 'org.taktik.icure.user.eHealthEnv')
          propEnv.typedValue.stringValue = this.userEHealthEnv;

          let propMHNihii = this.user.properties.find(p => p.type && p.type.identifier === 'org.taktik.icure.user.medicalHouse.nihii')
          propMHNihii.typedValue.stringValue = this.userMedicalHouseNihii;

          // Only save if we actually have data
          if (this.hcp && this.hcp.financialInstitutionInformation) this.hcp.financialInstitutionInformation = _.filter(this.hcp.financialInstitutionInformation, 'bankAccount');

          // this.api.user().modifyUser(this.user)
          //     .then(user => this.api.register(user,"user"))
          //     .then(user => this.dispatchEvent(new CustomEvent('user-saved', {detail: user, bubbles: true, composed: true})))
          //     .then(() => this.api.hcparty().modifyHealthcareParty(this.hcp))
          //     .then(hcp => this.api.register(hcp,"hcp"))
          //     .then(hcp => this.hcp = hcp)
          //     .finally(() => this.$.dialog.close())
          Promise.all([this.api.user().modifyUser(this.user), this.api.hcparty().modifyHealthcareParty(this.hcp)])
              .then(([user, hcp]) => {
                  this.api.register(hcp, 'hcp');
                  this.dispatchEvent(new CustomEvent('user-saved', {
                      detail: user,
                      bubbles: true,
                      composed: true
                  }))
                  this.$.dialog.close()
              })
              .catch(err => console.error(err))

      }
  }

  // Resolve and assign BIC based on IBAN
  _evalBic(event, fieldObject) {

      // Could be a click event / we wouldn't have any value here
      if (typeof fieldObject.value === 'undefined') return;

      // target & save
      var ibanFieldObject = event.path[0];

      // Target (100,200,300,400,500,600,900)
      var oaValue = parseInt(ibanFieldObject.getAttribute('rel'));

      // Get bic based on iban
      var bicValue = this.api.getBicByIban(fieldObject.value || '');

      // Assign bic value back, should we have any
      if ((bicValue + '').length) {

          if (oaValue == 100) this.userBIC_100 = bicValue;
          if (oaValue == 200) this.userBIC_200 = bicValue;
          if (oaValue == 300) this.userBIC_300 = bicValue;
          if (oaValue == 400) this.userBIC_400 = bicValue;
          if (oaValue == 500) this.userBIC_500 = bicValue;
          if (oaValue == 600) this.userBIC_600 = bicValue;
          if (oaValue == 900) this.userBIC_900 = bicValue;

      }
  }

  replicateIbanValueToAllFields() {
      // Copy iban values to all fields (including us)
      this.listOAs.forEach(io => this.set(`userIBAN_${io}`, this.userIBAN_100))
      // Same goes for BIC values (including us)
      this.listOAs.forEach(io => this.set(`userBIC_${io}`, this.userBIC_100))
  }

  _goToEdmg() {
      this.set('tabs', 3)
  }

  _superVisorSearch(e) {
      let latestSearchValue = e && e.detail.value
      this.latestSearchValue = latestSearchValue

      if (!latestSearchValue || latestSearchValue.length < 2) {
          this.set('supervisorListItem', []);
          return;
      }
      this._supervisorDataProvider() && this._supervisorDataProvider().filter(latestSearchValue).then(res => {
          if (latestSearchValue !== this.latestSearchValue) return;
          this.set('supervisorListItem', res.rows)
      })
  }

  _hcpSearch(e) {
      let hcpLatestSearchValue = e && e.detail.value
      this.hcpLatestSearchValue = hcpLatestSearchValue

      if (!hcpLatestSearchValue || hcpLatestSearchValue.length < 2) {
          this.set('contactListItem', []);
          return;
      }
      this._hcpDataProvider() && this._hcpDataProvider().filter(hcpLatestSearchValue).then(res => {
          if (hcpLatestSearchValue !== this.hcpLatestSearchValue) return;
          this.set('contactListItem', res.rows)
      })
  }

  _hcpDataProvider() {
      return {
          filter: function (supervisorFilterValue) {
              return Promise.all(
                  [
                      this.api.hcparty().findBySsinOrNihii(supervisorFilterValue),
                      this.api.hcparty().findByName(supervisorFilterValue)
                  ]
              ).then(
                  results => {
                      const dataProviderResults =
                          _.flatten(
                              _
                                  .chain(_.concat(results[0].rows, results[1].rows))
                                  .uniqBy('id')
                                  .filter((i) => {
                                      return !i.type || i.type.toLowerCase() !== 'medicalhouse'
                                  })
                                  .value()
                                  .map(
                                      i => ({
                                          id: i.id,
                                          lastName: _.upperFirst(_.lowerCase(i.lastName)),
                                          hrLabel:
                                              _.upperFirst(_.lowerCase(i.lastName)) + ' ' +
                                              _.upperFirst(_.lowerCase(i.firstName)) + ' ' +
                                              (typeof i.nihii === 'undefined' || !i.nihii ? '' : ' - ' + this.localize('nihii', 'INAMI', language) + ': ' + i.nihii) + ' ' +
                                              (typeof i.ssin === 'undefined' || !i.ssin ? '' : ' - ' + this.localize('ssin', 'Registre national', language) + ': ' + i.ssin.substr(0, 6) + '-' + i.ssin.substr(6, 3) + '-' + i.ssin.substr(8, 2)) + ' ' +
                                              ''
                                      })
                                  )
                          )
                      ;
                      return {
                          totalSize: dataProviderResults.length,
                          rows: _.sortBy(dataProviderResults, 'lastName')
                      }
                  }
              )

          }.bind(this)
      }
  }

  _mhSearch(e) {
      let mhLatestSearchValue = e && e.detail.value
      this.mhLatestSearchValue = mhLatestSearchValue

      if (!mhLatestSearchValue || mhLatestSearchValue.length < 2) {
          this.set('mhListItem', []);
          return;
      }
      this._mhDataProvider() && this._mhDataProvider().filter(mhLatestSearchValue).then(res => {
          if (mhLatestSearchValue !== this.mhLatestSearchValue) return;
          this.set('mhListItem', res.rows)
      })
  }

  _mhDataProvider() {
      return {
          filter: function (mhFilterValue) {
              return Promise.all(
                  [
                      this.api.hcparty().findBySsinOrNihii(mhFilterValue),
                      this.api.hcparty().findByName(mhFilterValue)
                  ]
              ).then(
                  results => {
                      const dataProviderResults =
                          _.flatten(
                              _
                                  .chain(_.concat(results[0].rows, results[1].rows))
                                  .uniqBy('id')
                                  .filter({type: 'medicalhouse'})
                                  .value()
                                  .map(
                                      i => ({
                                          id: i.id,
                                          name: _.upperFirst(_.lowerCase(i.name)),
                                          hrLabel:
                                              _.upperFirst(_.lowerCase(i.name)) + ' ' +
                                              (typeof i.nihii === 'undefined' || !i.nihii ? '' : ' - ' + this.localize('nihii', 'INAMI', language) + ': ' + i.nihii) + ' ' +
                                              ''
                                      })
                                  )
                          )
                      ;
                      return {
                          totalSize: dataProviderResults.length,
                          rows: _.sortBy(dataProviderResults, 'name')
                      }
                  }
              )

          }.bind(this)
      }
  }

  _supervisorDataProvider() {
      return {
          filter: function (supervisorFilterValue) {
              return Promise.all(
                  [
                      this.api.hcparty().findBySsinOrNihii(supervisorFilterValue),
                      this.api.hcparty().findByName(supervisorFilterValue)
                  ]
              ).then(
                  results => {
                      const dataProviderResults =
                          _.flatten(
                              _
                                  .chain(_.concat(results[0].rows, results[1].rows))
                                  .uniqBy('id')
                                  .filter((i) => {
                                      return !i.type || i.type.toLowerCase() !== 'medicalhouse'
                                  })
                                  .value()
                                  .map(
                                      i => ({
                                          id: i.id,
                                          lastName: _.upperFirst(_.lowerCase(i.lastName)),
                                          hrLabel:
                                              _.upperFirst(_.lowerCase(i.lastName)) + ' ' +
                                              _.upperFirst(_.lowerCase(i.firstName)) + ' ' +
                                              (typeof i.nihii === 'undefined' || !i.nihii ? '' : ' - ' + this.localize('nihii', 'INAMI', language) + ': ' + i.nihii) + ' ' +
                                              (typeof i.ssin === 'undefined' || !i.ssin ? '' : ' - ' + this.localize('ssin', 'Registre national', language) + ': ' + i.ssin.substr(0, 6) + '-' + i.ssin.substr(6, 3) + '-' + i.ssin.substr(8, 2)) + ' ' +
                                              ''
                                      })
                                  )
                          )
                      ;
                      return {
                          totalSize: dataProviderResults.length,
                          rows: _.sortBy(dataProviderResults, 'lastName')
                      }
                  }
              )

          }.bind(this)
      }
  }

  isEnterPressed(e) {
      if (e.keyCode == 13) {
          // this._addSupervisor(e);
      }
  }


  _isMedicalHouse(hcpType) {
      return hcpType && hcpType.toLowerCase() === "medicalhouse";
  }

  addressProChanged() {
      if (!this.hcp) return;
      if (this.idAddress === -1) {
          this._findAddress()
      }

      let idxPhone = this.hcp.addresses[this.idAddress].telecoms.findIndex(tel => tel && tel.telecomType === "phone")
      let idxMail = this.hcp.addresses[this.idAddress].telecoms.findIndex(tel => tel && tel.telecomType === "email")
      // console.log('addressProChanged',idxAddress,idxPhone,idxMail)
      if (this.idAddress < 0) {
          this.push('hcp.addresses', {
              addressType: "work",
              street: this.adr.street || "",
              houseNumber: this.adr.houseNumber || "",
              postboxNumber: this.adr.postboxNumber || "",
              postalCode: this.adr.postalCode || "",
              city: this.adr.city || "",
              country: this.adr.country || "",
              telecoms: [
                  {telecomType: "phone", telecomNumber: this.adr.phoneNumber || ""},
                  {telecomType: "email", telecomNumber: this.adr.proMail || ""}
              ]
          })
          // console.log('add addr',this.hcp)
      } else if (idxPhone < 0) {
          this.push('hcp.addresses.' + this.idAddress + '.telecoms', {
              telecomType: "phone",
              telecomNumber: this.adr.phoneNumber || ""
          })
          // console.log('add phone',this.hcp)
      } else if (idxMail < 0) {
          this.push('hcp.addresses.' + this.idAddress + '.telecoms', {
              telecomType: "email",
              telecomNumber: this.adr.proMail || ""
          })
          // console.log('add mail',this.hcp)
      } else {
          this.set('hcp.addresses.' + this.idAddress + '.addressType', "work")
          this.set('hcp.addresses.' + this.idAddress + '.street', this.adr.street || "")
          this.set('hcp.addresses.' + this.idAddress + '.houseNumber', this.adr.houseNumber || "")
          this.set('hcp.addresses.' + this.idAddress + '.postboxNumber', this.adr.postboxNumber || "")
          this.set('hcp.addresses.' + this.idAddress + '.postalCode', this.adr.postalCode || "")
          this.set('hcp.addresses.' + this.idAddress + '.city', this.adr.city || "")
          this.set('hcp.addresses.' + this.idAddress + '.country', this.adr.country || "")
          this.set('hcp.addresses.' + this.idAddress + '.telecoms.' + idxPhone, {
              telecomType: "phone",
              telecomNumber: this.adr.phoneNumber || ""
          })
          this.set('hcp.addresses.' + this.idAddress + '.telecoms.' + idxMail, {
              telecomType: "email",
              telecomNumber: this.adr.proMail || ""
          })
          // console.log('success',this.hcp)
      }
  }

  _findAddress() {
      let index = this.hcp.addresses.findIndex(addr => addr.addressType === "work" && this.adr.street === addr.street && this.adr.houseNumber === addr.houseNumber
          && this.adr.postboxNumber === addr.postboxNumber && this.adr.postalCode === addr.postalCode && this.adr.city === addr.city && this.adr.country === addr.country
          && (!this.adr.phoneNumber || this.adr.phoneNumber === "" || (this.adr.phoneNumber !== "" && addr.telecoms.find(tel => tel.telecomType === "phone" && this.adr.phoneNumber === tel.telecomNumber)))
          && (!this.adr.proMail || this.adr.proMail === "" || (this.adr.proMail !== "" && addr.telecoms.find(tel => tel.telecomType === "email" && this.adr.proMail === tel.telecomNumber))))
      console.log(index, this.hcp)
      if (index === -1) {
          index = this.hcp.addresses.findIndex(addr => addr.addressType === "work" && this.adr.street === addr.street && this.adr.houseNumber === addr.houseNumber
              && this.adr.postboxNumber === addr.postboxNumber && this.adr.postalCode === addr.postalCode && this.adr.city === addr.city && this.adr.country === addr.country)
          if (index === -1) {
              this.hcp.addresses.push({
                  "addressType": "work",
                  "street": this.adr.street,
                  "houseNumber": this.adr.houseNumber,
                  "postboxNumber": this.adr.postboxNumber,
                  "postalCode": this.adr.postalCode,
                  "city": this.adr.city,
                  "country": this.adr.country,
                  "telecoms": [
                      {
                          "telecomType": "phone",
                          "telecomNumber": this.adr.phoneNumber || ""
                      },
                      {
                          "telecomType": "email",
                          "telecomNumber": this.adr.proMail || ""
                      }
                  ]
              })
              index = this.hcp.addresses.length - 1
          }

          this.set("idAddress", index)
      }
  }
}

customElements.define(HtExportKey.is, HtExportKey);
