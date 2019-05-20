import '@polymer/iron-icon/iron-icon.js'
import '@polymer/iron-pages/iron-pages.js'
import '@polymer/paper-button/paper-button.js'
import '@polymer/paper-card/paper-card.js'
import '@polymer/paper-checkbox/paper-checkbox.js'
import '@polymer/paper-dialog/paper-dialog.js'
import '@polymer/paper-input/paper-input.js'
import '@polymer/paper-tabs/paper-tab.js'
import '@polymer/paper-tabs/paper-tabs.js'
import '@polymer/paper-input/paper-textarea.js'
import '@polymer/paper-tooltip/paper-tooltip.js'
/**
@license
Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
import '../dynamic-form/dynamic-form.js';

import './dialogs/medicalhouse/ht-pat-medicalhouse-timeline.js';

import moment from 'moment/src/moment';
import {TkLocalizerMixin} from "../tk-localizer";

import {PolymerElement,html} from '@polymer/polymer/polymer-element.js';
class HtPatAdminCard extends TkLocalizerMixin(PolymerElement) {
  static get template() {
    return html`
        <style include="iron-flex iron-flex-alignment"></style>
        <style>
            :host {
                height: 100%;
            }

            .container {
                width: 100%;
                height: 100%;
            }

            paper-tabs {
                background: var(--app-secondary-color);
                --paper-tabs-selection-bar-color: var(--app-text-color-disabled);
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


            paper-material.card {
                background-color: #fff;
                padding: 10px;
                margin-left: 5px;
                margin-right: 5px;
                margin-bottom: 10px;
            }

            paper-input {
                padding-left: 5px;
                padding-right: 5px;
            }

            paper-input {
                --paper-input-container-focus-color: var(--app-primary-color);
                --paper-input-container-label: {
                    color: var(--app-text-color);
                    opacity: 1;
                };
                --paper-input-container-underline-disabled: {
                    border-bottom: 1px solid var(--app-text-color);

                };
                --paper-input-container-color: var(--app-text-color);
            }

            paper-textarea {
                --paper-input-container-focus-color: var(--app-primary-color);
            }

            paper-dropdown-menu {
                padding-left: 5px;
                padding-right: 5px;
            }

            iron-pages {
                padding: 32px 0 0;
                width: 100%;
                height: 100%;
                box-sizing: border-box;
            }

            .page-container {
                height: calc(100% - 48px);
                overflow-y: auto;
            }

            :host #institution-list {
                height: calc(100% - 140px);
                outline: none;
            }

            #institution-list {
                width: 98%;
                padding: 5px;
                height: calc(100% - 140px);
            }

            .grid-institution {
                width: 100%;
                padding: 5px;
                height: calc(100% - 20px);
            }

            vaadin-grid.material {
                box-shadow: var(--app-shadow-elevation-1);
                border: 0;
                font-family: Roboto, sans-serif;
                --divider-color: rgba(0, 0, 0, var(--dark-divider-opacity));
                margin: 0 0 32px 0;

                --vaadin-grid-cell: {
                    padding: 8px;
                };

                --vaadin-grid-header-cell: {
                    height: 64px;
                    color: rgba(0, 0, 0, var(--dark-secondary-opacity));
                    font-size: 12px;
                };

                --vaadin-grid-body-cell: {
                    height: 48px;
                    color: rgba(0, 0, 0, var(--dark-primary-opacity));
                    font-size: 13px;
                };

                --vaadin-grid-body-row-hover-cell: {
                    background-color: var(--paper-grey-200);
                };

                --vaadin-grid-body-row-selected-cell: {
                    background-color: var(--paper-grey-100);
                };

                --vaadin-grid-focused-cell: {
                    box-shadow: none;
                    font-weight: bold;
                };
            }

            vaadin-grid.material .cell {
                overflow: hidden;
                text-overflow: ellipsis;
                padding-right: 56px;
            }

            vaadin-grid.material .cell.last {
                padding-right: 24px;
            }

            vaadin-grid.material .cell.numeric {
                text-align: right;
            }

            vaadin-grid.material paper-checkbox {
                --primary-color: var(--paper-indigo-500);
                margin: 0 24px;
            }

            vaadin-grid.material vaadin-grid-sorter .cell {
                flex: 1;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            vaadin-grid.material vaadin-grid-sorter iron-icon {
                transform: scale(0.8);
            }

            vaadin-grid.material vaadin-grid-sorter:not([direction]) iron-icon {
                color: rgba(0, 0, 0, var(--dark-disabled-opacity));
            }

            vaadin-grid.material vaadin-grid-sorter[direction] {
                color: rgba(0, 0, 0, var(--dark-primary-opacity));
            }

            vaadin-grid.material vaadin-grid-sorter[direction=desc] iron-icon {
                transform: scale(0.8) rotate(180deg);
            }

            paper-dialog paper-input {
                padding: 0;
            }

            paper-dialog > div {
                margin-top: 0;
            }

            paper-dialog vaadin-grid.material {
                margin: 24px 0 0;
            }

            .buttons {
                position: absolute;
                bottom: 0;
                width: 100%;
                box-sizing: border-box;
                padding: 8px 24px;
                flex-flow: row wrap;
                justify-content: space-between;
            }

            .buttons paper-checkbox {
                align-self: center;
            }

            #dialogAddInstitution {
                height: 400px;
                width: 600px;
            }

            .formAddStay {
                width: 100%;
                border-collapse: collapse;
            }

            .full-width {
                width: 100%;
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
                font-weight: 700;

            }

            .administrative-panel {
                height: 100%;
                background: var(--app-background-color);
                margin: 0;
                grid-column: 2 / 4;
                grid-row: 1 / 1;
            }

            .modal-button--extra {
                padding-left: 0;
                padding-right: 0;
                margin: 0;
            }

            .add-btn-stay-container {
                display: table;
                margin: auto;
            }

            .btn {
                --paper-button-ink-color: var(--app-secondary-color-dark);
                background: var(--app-secondary-color);
                color: var(--app-text-color);
                font-weight: 700;
                font-size: 12px;
                height: 40px;
                min-width: 100px;
                box-shadow: var(--shadow-elevation-2dp_-_box-shadow);
                padding: 10px 1.2em;
            }

            #institutionComment {
                height: 140px;
            }

            #add-person-to-care-team {
                min-height: 554px;
                max-height: 50%;
                min-width: 800px;
                max-width: 60%;
            }

            #add-new-person-to-care-team {
                height: 520px;
                width: 500px;
            }

            #internal-care-team-list, #external-care-team-list, #dmg-owner-list {
                max-height: 50%;
                height: auto;
            }

            #showHcpInfo {
                min-height: 520px;
                max-height: 50%;
                min-width: 500px;
                max-width: 60%;
            }

            .hcpInfo {
                max-height: calc(520px - 56px);
                overflow: auto;
                padding: 0;
            }

            .iconHcpInfo {
                height: 18px;
            }

            .indent {
                margin-bottom: 12px;
            }

            .indent paper-input {
                margin: 0 24px;
            }

            .titleHcpInfo {
                height: 48px;
                width: calc(100% - 48px);
                color: var(--app-text-color);
                background-color: var(--app-background-color-dark);
                padding: 0 24px;
                font-weight: bold;
                display: flex;
                flex-flow: row wrap;
                justify-content: flex-start;
                align-items: center;
            }


            .titleHcpInfo_Icon {
                height: 24px;
                width: 24px;
                opacity: 0.5;
            }

            .titleHcpInfo_Txt {
                padding-left: 8px;
            }

            .label {
                font-weight: bold;
            }

            .hcpAdr {
                margin-bottom: 10px;
            }

            .button_add_provider {
                width: 75%;
                position: fixed;
                bottom: 16px;
                display: flex;
                flex-direction: row;
                justify-content: center;
                align-items: center;
            }

            .add-btn {
                --paper-button-ink-color: var(--app-secondary-color-dark);
                background: var(--app-secondary-color);
                color: var(--app-text-color);
                font-weight: bold;
                font-size: 12px;
                height: 40px;
                min-width: 100px;
                @apply --shadow-elevation-2dp;
                padding: 10px 1.2em;
            }

            paper-card {
                width: 100%;
                margin-bottom: 32px;
                padding: 16px;
            }

            .not-form-page {
                padding: 32px
            }

            iron-icon.smaller {
                padding-right: 8px;
                width: 16px;
                height: 16px;
            }

            .subtitle {
                display: block;
                @apply --paper-font-body2;
                padding-bottom: 8px;
                margin: 0;
            }

            .modal-title {
                background: var(--app-background-color-dark);
                margin-top: 0;
                padding: 16px 24px;
            }

            .iron-container {
                padding: 0;
            }

            .form-container {
                padding-bottom: 32px;
            }

            .save, .print-vignette {
                background: var(--app-secondary-color);
                border-radius: 50%;
                margin: 7px 4px;
                padding: 4px;
                cursor: pointer;
                box-shadow: var(--shadow-elevation-2dp_-_box-shadow);
                transition: .25s ease;
                width: 24px;
                height: 24px;
                text-align: center;
                line-height: 24px;
                background: var(--app-primary-color);
            }

            .save {
                margin-right: 36px;
                margin-left: 16px;
            }

            .save iron-icon,
            .print-vignette iron-icon {
                width: 20px;
                margin-top: -3px;
                color: white;
            }

            .save:hover,
            .print-vignette:hover {
                transform: scale(1.05);
            }

            .save:active,
            .print-vignette:active {
                background: var(--app-background-color-dark);
                box-shadow: none;
                transform: scale(.9);
            }
        </style>
        <div class="administrative-panel">
            <paper-tabs selected="{{tabs}}">
                <paper-tab class="adm-tab">
                    <iron-icon class="smaller" icon="vaadin:clipboard-text"></iron-icon>
                    [[localize('adm_form','Administrative form',language)]]
                </paper-tab>
                <paper-tab class="adm-tab">
                    <iron-icon class="smaller" icon="vaadin:family"></iron-icon>
                    [[localize('adm_ctc_per','Contact persons',language)]]
                </paper-tab>
                <paper-tab class="adm-tab">
                    <iron-icon class="smaller" icon="vaadin:doctor"></iron-icon>
                    [[localize('adm_h_t','Care team',language)]]
                </paper-tab>
                <paper-tab class="adm-tab">
                    <iron-icon class="smaller" icon="vaadin:edit"></iron-icon>
                    [[localize('adm_post_it','Post-it',language)]]
                </paper-tab>
                <paper-tab class="adm-tab">
                    <iron-icon class="smaller" icon="timeline"></iron-icon>
                    [[localize('mh_timeline','Timeline',language)]]
                </paper-tab>
                <div class="print-vignette">
                    <iron-icon id="print-vignette" icon="av:recent-actors" on-tap="printMutualVignette"></iron-icon>
                    <paper-tooltip for="print-vignette" position="left">[[localize('print_mutual_vignette','Print mutual
                        vignette',language)]]
                    </paper-tooltip>
                </div>
                <div class="print-vignette">
                    <iron-icon id="print-vignette-grid" icon="av:library-books" on-tap="printMutualVignetteGrid"></iron-icon>
                    <paper-tooltip for="print-vignette-grid" position="left">
                        [[localize('print_mutual_vignette_grid','Print mutual vignette grid',language)]]
                    </paper-tooltip>
                </div>
                <div class="print-vignette">
                    <iron-icon id="fill-with-card" icon="vaadin:health-card" on-tap="fillWithCard"></iron-icon>
                    <paper-tooltip for="fill-with-card" position="left">[[localize('fill_with_eid','Fill with
                        eid',language)]]
                    </paper-tooltip>
                </div>
                <div class="save">
                    <iron-icon id="save-btn" icon="save" on-tap="forceSaveAdmin"></iron-icon>
                    <paper-tooltip for="save-btn" position="left">[[localize('save','Save',language)]]</paper-tooltip>
                </div>
            </paper-tabs>

            <iron-pages class="iron-container" selected="[[tabs]]">
                <page>
                    <div class="page-container">
                        <div class="form-container">
                            <dynamic-form id="dynamic-form-administrative" class="page-content printable" api="[[api]]" user="[[user]]" template="[[patientForm]]" data-map="[[patientMap]]" data-provider="[[dataProvider]]" i18n="[[i18n]]" resources="[[resources]]" language="[[language]]" no-print="">
                            </dynamic-form>
                        </div>
                    </div>
                </page>
                <page>
                    <div class="page-container">
                        <dynamic-form id="dynamic-form-partnerships" class="page-content" api="[[api]]" user="[[user]]" template="[[partnershipsContainerForm]]" data-map="[[patientMap]]" data-provider="[[dataProvider]]" i18n="[[i18n]]" resources="[[resources]]" language="[[language]]" no-print=""></dynamic-form>
                    </div>
                </page>
                <page>
                    <div class="page-container">
                        <div class="not-form-page">
                            <h4 class="subtitle">[[localize('icp','Internal care provider',language)]]</h4>
                            <vaadin-grid id="internal-care-team-list" class="material" overflow="bottom" multi-sort="[[multiSort]]" items="[[currentInternalCareTeam]]" active-item="{{selectedCareProvider}}" on-tap="showInfoSelectedHcp">
                                <vaadin-grid-column width="120px">
                                    <template class="header">
                                        <vaadin-grid-sorter path="lastName">[[localize('las_nam','Last
                                            name',language)]]
                                        </vaadin-grid-sorter>
                                    </template>
                                    <template>
                                        <div class="cell frozen">[[item.lastName]]</div>
                                    </template>
                                </vaadin-grid-column>
                                <vaadin-grid-column width="120px">
                                    <template class="header">
                                        <vaadin-grid-sorter path="firstName">[[localize('fir_nam','Last
                                            name',language)]]
                                        </vaadin-grid-sorter>
                                    </template>
                                    <template>
                                        <div class="cell frozen">[[item.firstName]]</div>
                                    </template>
                                </vaadin-grid-column>
                                <vaadin-grid-column width="80px">
                                    <template class="header">
                                        <vaadin-grid-sorter path="nihii">[[localize('inami','Nihii',language)]]
                                        </vaadin-grid-sorter>
                                    </template>
                                    <template>
                                        <div class="cell frozen">[[formatNihiiNumber(item.nihii)]]</div>
                                    </template>
                                </vaadin-grid-column>
                                <vaadin-grid-column width="80px">
                                    <template class="header">
                                        <vaadin-grid-sorter path="speciality">
                                            [[localize('speciality','Speciality',language)]]
                                        </vaadin-grid-sorter>
                                    </template>
                                    <template>
                                        <div class="cell frozen">[[item.speciality]]</div>
                                    </template>
                                </vaadin-grid-column>
                            </vaadin-grid>

                            <h4 class="subtitle">[[localize('ecp','External care provider',language)]]</h4>
                            <vaadin-grid id="dmg-owner-list" class="material" overflow="bottom" multi-sort="[[multiSort]]" items="[[currentExternalPatientCareTeam]]" active-item="{{selectedCareProvider}}" on-tap="showInfoSelectedHcp">
                                <vaadin-grid-column width="240px">
                                    <template class="header">
                                        <vaadin-grid-sorter path="name">[[localize('nam','Name',language)]]
                                        </vaadin-grid-sorter>
                                    </template>
                                    <template>
                                        <div class="cell frozen">[[getHcpName(item)]]</div>
                                    </template>
                                </vaadin-grid-column>
                                <vaadin-grid-column width="80px">
                                    <template class="header">
                                        <vaadin-grid-sorter path="nihii">[[localize('inami','Nihii',language)]]
                                        </vaadin-grid-sorter>
                                    </template>
                                    <template>
                                        <div class="cell frozen">[[formatNihiiNumber(item.nihii)]]</div>
                                    </template>
                                </vaadin-grid-column>
                                <vaadin-grid-column width="80px">
                                    <template class="header">
                                        <vaadin-grid-sorter path="speciality">
                                            [[localize('speciality','Speciality',language)]]
                                        </vaadin-grid-sorter>
                                    </template>
                                    <template>
                                        <div class="cell frozen">[[item.speciality]]</div>
                                    </template>
                                </vaadin-grid-column>
                                <vaadin-grid-column>
                                    <template class="header">
                                        <vaadin-grid-sorter path="beginDate">[[localize('sta_dat','Start
                                            date',language)]]
                                        </vaadin-grid-sorter>
                                    </template>
                                    <template>
                                        <div class="cell frozen">[[getStartDate(item)]]</div>
                                    </template>
                                </vaadin-grid-column>
                                <vaadin-grid-column>
                                    <template class="header">
                                        <vaadin-grid-sorter path="endDate">[[localize('end_dat','End date',language)]]
                                        </vaadin-grid-sorter>
                                    </template>
                                    <template>
                                        <div class="cell frozen">[[getEndDate(item)]]</div>
                                    </template>
                                </vaadin-grid-column>
                            </vaadin-grid>
                        </div>
                    </div>
                </page>
                <page>
                    <div class="page-container">
                        <div class="not-form-page">
                            <h4 class="subtitle">[[localize('adm_post_it_adm','Post-it administratif',language)]]</h4>
                            <paper-card>
                                <paper-textarea no-label-float="" value="{{administrativePostit}}"></paper-textarea>
                            </paper-card>

                            <h4 class="subtitle">[[localize('adm_post_it_adm','Post-it médical',language)]]</h4>
                            <paper-card>
                                <paper-textarea no-label-float="" value="{{medicalPostit}}"></paper-textarea>
                            </paper-card>
                        </div>
                    </div>
                </page>
                <page>
                    <div class="page-container">
                        <ht-pat-medicalhouse-timeline class="page-content printable" api="[[api]]" user="[[user]]" language="[[language]]" patient="[[patient]]" i18n="[[i18n]]" current-contact="[[currentContact]]" resources="[[resources]]" no-print="">
                    </ht-pat-medicalhouse-timeline></div>
                </page>
            </iron-pages>
        </div>

        <paper-dialog id="add-person-to-care-team">
            <h2 class="modal-title">[[localize('add_per_to_car_tea','Add person',language)]]</h2>
            <div>
                <vaadin-grid id="hcp-list" class="material" overflow="bottom" items="[[currentHcp]]" active-item="{{selectedHcp}}">
                    <vaadin-grid-column width="100px">
                        <template class="header">
                        </template>
                        <template>
                            <vaadin-checkbox id="[[item.id]]" checked="[[_sharingHcp(item, currentHcp.*)]]" on-checked-changed="_checkHcp"></vaadin-checkbox>
                        </template>
                    </vaadin-grid-column>
                    <vaadin-grid-column width="120px">
                        <template class="header">
                            <vaadin-grid-sorter path="lastName">[[localize('las_nam','Last name',language)]]
                            </vaadin-grid-sorter>
                        </template>
                        <template>
                            <div class="cell frozen">[[item.lastName]]</div>
                        </template>
                    </vaadin-grid-column>
                    <vaadin-grid-column width="120px">
                        <template class="header">
                            <vaadin-grid-sorter path="firstName">[[localize('fir_nam','First name',language)]]
                            </vaadin-grid-sorter>
                        </template>
                        <template>
                            <div class="cell frozen">[[item.firstName]]</div>
                        </template>
                    </vaadin-grid-column>
                    <vaadin-grid-column width="80px">
                        <template class="header">
                            <vaadin-grid-sorter path="nihii">[[localize('inami','Nihii',language)]]</vaadin-grid-sorter>
                        </template>
                        <template>
                            <div class="cell frozen">[[formatNihiiNumber(item.nihii)]]</div>
                        </template>
                    </vaadin-grid-column>
                    <vaadin-grid-column width="80px">
                        <template class="header">
                            <vaadin-grid-sorter path="speciality">[[localize('speciality','Speciality',language)]]
                            </vaadin-grid-sorter>
                        </template>
                        <template>
                            <div class="cell frozen">[[item.speciality]]</div>
                        </template>
                    </vaadin-grid-column>
                </vaadin-grid>
            </div>
            <div class="buttons">
                <paper-button class="modal-button modal-button--extra" on-tap="showAddNewPersonToCareTeamForm">
                    <iron-icon icon="icons:add"></iron-icon>
                    [[localize('new_per','New person',language)]]
                </paper-button>
                <div>
                    <paper-button class="modal-button" dialog-dismiss="">[[localize('can','Cancel',language)]]
                    </paper-button>
                    <paper-button class="modal-button--save" dialog-confirm="" autofocus="" on-tap="confirmSharing">
                        [[localize('save','Save',language)]]
                    </paper-button>
                </div>
            </div>
        </paper-dialog>

        <paper-dialog id="add-new-person-to-care-team">
            <h2 class="modal-title">[[localize('add_new_per_to_car_tea','Add new person to the care
                team',language)]]</h2>
            <div>
                <paper-input id="" label="[[localize('las_nam','Last name',language)]]" value="{{newHcpCareTeam.LastName}}"></paper-input>
                <paper-input id="" label="[[localize('fir_nam','First name',language)]]" value="{{newHcpCareTeam.FirstName}}"></paper-input>
                <paper-input id="" label="[[localize('ema','Email',language)]]" value="{{newHcpCareTeam.Email}}"></paper-input>
                <paper-input id="" label="[[localize('inami','Nihii',language)]]" value="{{newHcpCareTeam.Nihii}}"></paper-input>
                <paper-input id="" label="[[localize('niss','Niss',language)]]" value="{{newHcpCareTeam.Niss}}"></paper-input>
                <paper-input id="" label="[[localize('speciality','Speciality',language)]]" value="{{newHcpCareTeam.Speciality}}"></paper-input>
            </div>
            <div class="buttons">
                <paper-checkbox value="{{newHcpCareTeam.Invite}}" on-change="chckInvite">Invite care provider
                </paper-checkbox>

                <div>
                    <paper-button class="modal-button" dialog-dismiss="">[[localize('can','Cancel',language)]]
                    </paper-button>
                    <paper-button class="modal-button--save" dialog-confirm="" autofocus="" on-tap="addNewExternalPersonToCareTeam">[[localize('save','Save',language)]]
                    </paper-button>
                </div>
            </div>
        </paper-dialog>


        <paper-dialog id="showHcpInfo">
            <div class="hcpInfo">
                <div>
                    <div class="titleHcpInfo">
                        <div class="titleHcpInfo_Icon">
                            <iron-icon icon="icons:perm-contact-calendar"></iron-icon>
                        </div>
                        <div class="titleHcpInfo_Txt">
                            [[localize('gen_info','General informations',language)]]
                        </div>
                    </div>
                    <div class="indent">
                        <paper-input id="" label="[[localize('las_nam','Last name',language)]]" value="[[selectedPerson.lastName]]" readonly=""></paper-input>
                        <paper-input id="" label="[[localize('fir_nam','First name',language)]]" value="[[selectedPerson.firstName]]" readonly=""></paper-input>
                        <paper-input id="" label="[[localize('name','Name',language)]]" value="[[selectedPerson.name]]" readonly=""></paper-input>
                        <paper-input id="" label="Type:" value="[[selectedPerson.hcpType]]" readonly=""></paper-input>
                        <paper-input id="" label="[[localize('inami','Nihii',language)]]" value="[[formatNihiiNumber(selectedPerson.nihii)]]" readonly=""></paper-input>
                        <paper-input id="" label="[[localize('ssin','Ssin',language)]]" value="[[formatNissNumber(selectedPerson.ssin)]]" readonly=""></paper-input>
                        <paper-input id="" label="[[localize('speciality','Speciality',language)]]" value="[[selectedPerson.speciality]]" readonly=""></paper-input>
                    </div>
                    <template is="dom-if" if="[[selectedPerson.addresses]]">
                        <div>
                            <div class="titleHcpInfo">
                                <div class="titleHcpInfo_Icon">
                                    <iron-icon class="iconHcpInfo" icon="icons:home"></iron-icon>
                                </div>
                                <div class="titleHcpInfo_Txt">
                                    [[localize('addresses','Addresses',language)]]
                                </div>
                            </div>
                            <div class="indent">
                                <template is="dom-repeat" items="[[selectedPerson.addresses]]" as="adr">
                                    <div class="hcpAdr">
                                        <paper-input id="" label="[[localize('street','Street',language)]]" value="[[adr.street]]" readonly=""></paper-input>
                                        <paper-input id="" label="[[localize('number','Number',language)]]" value="[[adr.number]]" readonly=""></paper-input>
                                        <paper-input id="" label="[[localize('postalCode','Postal code',language)]]" value="[[adr.postalCode]]" readonly=""></paper-input>
                                        <paper-input id="" label="[[localize('city','City',language)]]" value="[[adr.city]]" readonly=""></paper-input>
                                        <div class="titleHcpInfo">
                                            <div class="titleHcpInfo_Icon">
                                                <iron-icon class="iconHcpInfo" icon="communication:phone"></iron-icon>
                                            </div>
                                            <div class="titleHcpInfo_Txt">
                                                [[localize('telecom','Telecom',language)]]
                                            </div>
                                        </div>
                                        <template is="dom-repeat" items="[[adr.telecoms]]" as="telecom">
                                            <paper-input id="" label="[[localize('tel_type','Telecom type',language)]]" value="[[telecom.telecomType]]" readonly=""></paper-input>
                                            <paper-input id="" label="[[localize('tel_num','Telecom number',language)]]" value="[[telecom.telecomNumber]]" readonly=""></paper-input>
                                        </template>
                                    </div>
                                </template>
                            </div>
                        </div>
                    </template>
                </div>
                <template is="dom-if" if="[[selectedPerson.pphc.referralPeriods]]">
                    <div>
                        <div class="titleHcpInfo">
                            <div class="titleHcpInfo_Icon">
                                <iron-icon class="iconHcpInfo" icon="vaadin:clock"></iron-icon>
                            </div>
                            <div class="titleHcpInfo_Txt">
                                [[localize('ref_per','Referral periods',language)]]
                            </div>
                        </div>
                        <div class="indent">
                            <template is="dom-repeat" items="[[selectedPerson.pphc.referralPeriods]]" as="referralPeriod">
                                <paper-input id="" label="[[localize('startDate','Start date',language)]]" value="[[_timeFormat(referralPeriod.startDate)]]" readonly=""></paper-input>
                                <paper-input id="" label="[[localize('endDate','End date',language)]]" value="[[_timeFormat(referralPeriod.endDate)]]" readonly=""></paper-input>
                            </template>
                        </div>
                    </div>
                </template>
            </div>
            <div class="buttons" style="flex-flow: row-reverse wrap; padding: 8px 0;">
                <paper-button class="modal-button" dialog-dismiss="">[[localize('clo','Close',language)]]</paper-button>
            </div>
        </paper-dialog>

        <paper-dialog id="ht-invite-hcp-link">
            <h3>Lien de première connexion</h3>
            <h4>[[invitedHcpLink]]</h4>
        </paper-dialog>
`;
  }

  static get is() {
      return 'ht-pat-admin-card';
  }

  static get properties() {
      return {
          api: {
              type: Object
          },
          patientForm: {
              type: Object,
              value: function () {
                  return require('./rsrc/PatientAdministrativeForm.json');
              }
          },
          addressForm: {
              type: Object,
              value: function () {
                  return require('./rsrc/PatientAddressForm.json');
              }
          },
          medicalHouseContractsForm: {
              type: Object,
              value: function () {
                  return require('./rsrc/PatientMedicalHouseContractsForm.json');
              }
          },
          telecomForm: {
              type: Object,
              value: function () {
                  return require('./rsrc/PatientTelecomForm.json');
              }
          },
          insuranceForm: {
              type: Object,
              value: function () {
                  return require('./rsrc/PatientInsuranceForm.json');
              }
          },
          partnershipsForm: {
              type: Object,
              value: function () {
                  return require('./rsrc/PatientPartnershipsForm.json');
              }
          },
          partnershipsContainerForm: {
              type: Object,
              value: function () {
                  return require('./rsrc/PatientPartnershipsContainerForm.json');
              }
          },
          user: {
              type: Object
          },
          patient: {
              type: Object,
              notify: true
          },
          patientMap: {
              type: Object
          },
          dataProvider: {
              type: Object,
              value: null
          },
          administrativePostit: {
              type: String
          },
          medicalPostit: {
              type: String
          },
          newHcpCareTeam: {
              type: Object,
              value: {
                  'LastName': '',
                  'FirstName': '',
                  'Nihii': '',
                  'Speciality': '',
                  'Email': '',
                  'Niss': '',
                  'Invite': false
              }
          },

          currentInternalCareTeam: {
              type: Array,
              value: [],
              notify: true
          },

          currentExternalCareTeam: {
              type: Array,
              value: [],
              notify: true
          },

          currentExternalPatientCareTeam: {
              type: Array,
              value: [],
              notify: true
          },

          currentDMGOwner: {
              type: Array,
              value: [],
              notify: true
          },

          currentHcp: {
              type: Array,
              value: []
          },
          selectedCareProvider: {
              type: Object
          },
          selectedPerson: {
              type: Object
          },
          hcpSelectedForTeam: {
              type: Object,
              notify: true,
              value: () => []
          },
          invitedHcpLink: {
              type: String,
              value: ""
          },
          tabs: {
              type: Number,
              value: 0
          },
          tabIndex: {
              type: Number,
              value: 0,
              observer: '_tabIndexChanged'
          },
          cardData: {
              type: Object,
              value: {}
          }
      };
  }

  static get observers() {
      return ['patientChanged(api,user,patient)', 'partnershipsChanged(patient.partnerships.*)', 'medicalPostitChanged(medicalPostit)', 'administrativePostitChanged(administrativePostit)'];
  }

  constructor() {
      super();
  }

  detached() {
      this.flushSave();
  }

  ready() {
      super.ready();
  }

  printMutualVignette() {
      const insur = ((this.patient || {}).insurabilities || []).find(a => !a.endDate && a.insuranceId && a.insuranceId !== "") || null
      if (insur) {
          this.api.insurance().getInsurance(insur.insuranceId).then(ins => {
              const home = this.patient.addresses.find(a => a.addressType === "home") || null
              const mutName = this.localizeContent(ins.name)
              const mutCode = this.localizeContent(ins.code)
              const patName = _.get(this, "patient.lastName", "") + " " + _.get(this, "patient.firstName", "") + " " + this.api.moment(_.trim(_.get(this, "patient.dateOfBirth", 0))).format('DD/MM/YYYY')
              const oa = mutCode && insur.parameters && insur.parameters.tc1 && insur.parameters.tc2 && mutName && mutName.length ? mutCode + " " + insur.parameters.tc1 + "-" + insur.parameters.tc2 : "no OA"
              const ssin = this.patient.ssin
              const addr = home ? home.street + " " + home.houseNumber + ((home.postboxNumber && home.postboxNumber.length) ? (!home.postboxNumber.startsWith('/') ? "/" : "") + home.postboxNumber : "") : "no Addr"
              const cp = home ? home.postalCode + " " + home.city : "no CP"
              const vignetteBody = `<html><head>
          <style>
              * {margin:0;padding:0;font-size:12px;}
              /*div.sticker {transform:rotate(-90deg);transform-origin:bottom;}*/
              p.patName {font-size:14px;font-weight:bold;}
              p, pre {overflow: hidden; text-overflow: ellipsis; white-space: nowrap;} /* inverted size for rotation */
          </style></head>
          <body>
              <div class="sticker">
                  <p class="patName">${patName}</p>
                  <pre class="oa"><b>OA${oa}</b> ${mutName}</pre>
                  <pre class="ssin">   ${ssin}</pre>
                  <pre class="addr">   ${addr}</pre>
                  <pre class="cp">   ${cp}</pre>
              </div>
          </body></html>`
              this.api.pdfReport(vignetteBody, {
                  type: "sticker-mut",
                  paperWidth: 90,
                  paperHeight: 29,
                  marginLeft: 0, marginRight: 0, marginTop: 0, marginBottom: 0
              }).then(({pdf: data, printed: printed}) => {
                  if (!printed) {
                      let blob = new Blob([data], {type: 'application/pdf'});

                      let url = window.URL.createObjectURL(blob)

                      let a = document.createElement("a");
                      document.body.appendChild(a);
                      a.style = "display: none";

                      a.href = url;
                      a.download = this.patient.firstName + "-" + this.patient.lastName + "-" + moment() + ".pdf";
                      a.click();
                      window.URL.revokeObjectURL(url);
                  }
              }).catch(e => {
                  console.log('Print error ', e)
              })
          }).catch(e => {
              console.log('cannot resolve insurance', e)
          })
      } else {
          console.log('cannot find insurance')
      }
  }

  printMutualVignetteGrid() {
      const rowCount = 13
      const columnCount = 3
      const insur = ((this.patient || {}).insurabilities || []).find(a => !a.endDate && a.insuranceId && a.insuranceId !== "") || null
      if (insur) {
          this.api.insurance().getInsurance(insur.insuranceId).then(ins => {
              const home = this.patient.addresses.find(a => a.addressType === "home") || null
              const mutName = this.localizeContent(ins.name)
              const mutCode = this.localizeContent(ins.code)
              const patName = _.get(this, "patient.lastName", "") + " " + _.get(this, "patient.firstName", "") + " " + this.api.moment(_.trim(_.get(this, "patient.dateOfBirth", 0))).format('DD/MM/YYYY')
              const oa = mutCode && insur.parameters && insur.parameters.tc1 && insur.parameters.tc2 && mutName && mutName.length ? mutCode + " " + insur.parameters.tc1 + "-" + insur.parameters.tc2 : "no OA"
              const ssin = this.patient.ssin
              const addr = home ? home.street + " " + home.houseNumber + ((home.postboxNumber && home.postboxNumber.length) ? (!home.postboxNumber.startsWith('/') ? "/" : "") + home.postboxNumber : "") : "no Addr"
              const cp = home ? home.postalCode + " " + home.city : "no CP"
              const vignetteCard = `
              <div class="sticker">
                  <p class="patName">${patName}</p>
                  <pre class="oa"><b>OA${oa}</b> ${mutName}</pre>
                  <pre class="ssin">   ${ssin}</pre>
                  <pre class="addr">   ${addr}</pre>
                  <pre class="cp">   ${cp}</pre>
              </div>
      `
              const cells = _.times(columnCount, cellidx => {
                  return `<td>${vignetteCard}</td>`
              }).join("\n")
              const rows = _.times(rowCount, rowidx => {
                  return `<tr>${cells}</tr>`
              }).join("\n")
              const vignetteBody = `<html><head>
          <style>
              * {margin:0;padding:0;font-size:12px;}
              /*div.sticker {transform:rotate(-90deg);transform-origin:bottom;}*/
              td { padding: 15px; }
              p.patName {font-size:14px;font-weight:bold;}
              p, pre {overflow: hidden; text-overflow: ellipsis; white-space: nowrap;} /* inverted size for rotation */
          </style></head>
          <body>
              <table>
                  ${rows}
              </table>
          </body></html>`
              this.api.pdfReport(vignetteBody, {
                  type: "sticker-mut-a4",
                  paperWidth: 210,
                  paperHeight: 297,
                  marginLeft: 5, marginRight: 5, marginTop: 10, marginBottom: 0
              }).then(({pdf: data, printed: printed}) => {
                  if (!printed) {
                      let blob = new Blob([data], {type: 'application/pdf'});

                      let url = window.URL.createObjectURL(blob)

                      let a = document.createElement("a");
                      document.body.appendChild(a);
                      a.style = "display: none";

                      a.href = url;
                      a.download = this.patient.firstName + "-" + this.patient.lastName + "-" + moment() + ".pdf";
                      a.click();
                      window.URL.revokeObjectURL(url);
                  }
              }).catch(e => {
                  console.log('Print error ', e)
              })
          }).catch(e => {
              console.log('cannot resolve insurance', e)
          })
      } else {
          console.log('cannot find insurance')
      }
  }

  medicalPostitChanged(medical) {
      if (this.patient && this.patient.note !== medical) {
          this.patient.note = medical
          this.scheduleSave(this.patient)
      }
  }

  administrativePostitChanged(administrative) {
      if (this.patient && this.patient.administrativeNote !== administrative) {
          this.patient.administrativeNote = administrative
          this.scheduleSave(this.patient)
      }
  }

  patientChanged() {
      if (!this.api || !this.user) {
          return
      }

      this.set('dataProvider', this.patientDataProvider({}, '', '', null, []));
      this.set('patientMap', {});


      if (this.patient) {

          this.set('administrativePostit', this.patient.administrativeNote || "")
          this.set('medicalPostit', this.patient.note || '')

          this.api.getRegistry('patient').listeners['ht-pat-admin'] = {
              target: this,
              pool: [this.patient.id],
              callbacks: [this.partnershipsChanged.bind(this)]
          }

          this.initCurrentCareTeam();

          this.api.code().getCodes((this.patient.languages || []).map(l => 'ISO-639-1|' + l + '|1').join(',') || "ISO-639-1|en|1").then(codes => {
              if (this.patient.partnerships && this.patient.partnerships.length) {
                  ;(this.patient.partnerships.length ? this.api.patient().getPatientsWithUser(this.user, {ids: this.patient.partnerships.map(ps => ps.partnerId)}) : Promise.resolve([]))
                      .then(ppss => ppss.map(p => this.api.register(p, 'patient')))
                      .then(ppss =>
                          this.set('patient.partnerships', this.patient.partnerships.map(pp => {
                              return Object.assign({}, pp, {partnerInfo: ppss.find(ps => ps.partnerId === pp.id) || {id: pp.partnerId}})
                          }))
                      ).finally(() => {
                          this.dataProvider = this.patientDataProvider(this.patient, '', '', this.patient && this.patient.id, codes);
                          this.set('patientMap', _.cloneDeep(this.patient));

                          if (!this.root.activeElement) {
                              this.$['dynamic-form-administrative'].loadDataMap();
                          } else {
                              this.$[this.root.activeElement.id].loadDataMap();
                          }
                      })
              } else {
                  this.dataProvider = this.patientDataProvider(this.patient, '', '', this.patient && this.patient.id, codes);
                  this.set('patientMap', _.cloneDeep(this.patient));

                  if (!this.root.activeElement) {
                      this.$['dynamic-form-administrative'].loadDataMap();
                  } else {
                      this.$[this.root.activeElement.id].loadDataMap();
                  }
              }
          })
      }
  }

  partnershipsChanged() {
      if (this.patient) {
          const tbc = this.patient.partnerships.filter(p => p.partnerId && !p.partnerInfo)
          if (tbc.length) {
              this.api.patient().getPatientsWithUser(this.user, {ids: tbc.map(ps => ps.partnerId)})
                  .then(ppss => ppss.map(p => this.api.register(p, 'patient')))
                  .then(ppss => ppss.forEach(pps => {
                      const idx = _.findIndex(this.patient.partnerships, pp => pps.id === pp.partnerId)
                      this.set(`patient.partnerships.${idx}.partnerInfo`, pps)
                  }))
          }
      }
  }

  scheduleSave(patient) {
      if (!patient) {
          return
      }
      const rev = patient.rev

      if (this.saveTimeout) {
          clearTimeout(this.saveTimeout);
          this.saveTimeout = undefined
      }

      this.saveAction = () => {
          this.api.queue(patient, 'patient').then(([pat, defer]) => {
              if (pat.rev !== rev) {
                  defer.resolve(patient);
                  return
              }

              ((patient.partnerships && patient.partnerships.length) ?
                  Promise.all(patient.partnerships.map((partner, index) => {

                      if (!partner.partnerId || !partner.partnerInfo.rev) {
                          //patient not present
                          partner.partnerInfo.active = false
                          partner.partnerInfo.id = partner.partnerId

                          return this.api.patient().newInstance(this.user, partner.partnerInfo)
                              .then(np => {
                                  partner.partnerId = np.id
                                  return this.api.patient().createPatientWithUser(this.user, np).then(np => this.api.register(np, 'patient')).then(np => {
                                      this.set('patient.partnerships.' + index + '.partnerInfo', np)
                                  })
                              })
                              .catch(e => {
                                  console.log("Cannot save " + e.message);
                                  return null
                              })
                      } else {
                          //patient present
                          return this.api.patient().modifyPatientWithUser(this.user, partner.partnerInfo)
                              .then(p => {
                                  this.api.register(p, 'patient')
                              })
                              //  .then(partner => {
                              //      this.set('patient.partnerships.' + index + '.partnerInfo', partner)
                              //      return partner
                              //  })
                              .catch(e => {
                                  console.log("Cannot save " + e.message);
                                  return null
                              })
                      }
                  }))
                  : Promise.resolve([]))
                  .finally(() =>
                      this.api.patient().modifyPatientWithUser(this.user, patient)
                          .catch(() => defer.resolve(patient))
                          .then(p => this.api.register(p, 'patient', defer))
                          .then(p => this.dispatchEvent(new CustomEvent("patient-saved", {
                              detail: p,
                              bubbles: true,
                              composed: true
                          })))
                          .catch(e => {
                              if (this.patient) {
                                  return this.api.patient().getPatientWithUser(this.user, this.patient.id).then(p => this.api.register(p, 'patient')).then(p => {
                                      this.patient = p
                                      this.saveTimeout = undefined
                                      this.saveAction = undefined
                                      throw e
                                  })
                              } else {
                                  throw e
                              }
                          })
                  )
          })
      }

      this.saveTimeout = setTimeout(this.saveAction, 5000);
  }

  flushSave() {
      if (this.saveTimeout) {
          clearTimeout(this.saveTimeout)
          this.saveTimeout = undefined
          return this.saveAction()
      }
  }

  forceSaveAdmin() {
      this.saveAction()
  }

  patientDataProvider(oroot, subPath, rootPath, id, codes) {
      const root = () => subPath && subPath.length ? _.get(oroot, subPath) : oroot;
      const getValue = function (key) {
          return root() ? _.get(root(), key) : null;
      };
      const setValue = (key, value) => {
          let resolvedRoot = root();

          if (resolvedRoot && !_.isEqual(_.get(resolvedRoot, key), value)) {
              resolvedRoot === this.patient ? this.set('patient.' + key, value) : _.set(resolvedRoot, key, value);
              this.scheduleSave(this.patient);
          }
      };
      return {
          getStringValue: getValue,
          getNumberValue: getValue,
          getMeasureValue: getValue,
          getDateValue: getValue,
          getBooleanValue: key => root() ? _.get(root(), key) && _.get(root(), key) !== 'false' : null,
          setStringValue: setValue,
          setNumberValue: setValue,
          setMeasureValue: setValue,
          setDateValue: setValue,
          setBooleanValue: setValue,
          getValueContainers: (key) => {
              return (getValue(key) || []).map((l, idx) => {
                  const code = codes.find(c => c.code === l)
                  return {
                      id: this.api.crypto().randomUuid(),
                      index: idx,
                      content: (code && code.label && _.fromPairs(_.toPairs(code.label).map(([k, v]) => [k, {stringValue: v}]))) || _.fromPairs([[this.language, {stringValue: l}]]),
                      codes: code ? [code] : []
                  }
              })
          },
          setValueContainers: (key, value) => setValue(key, value.map(s => (s.codes && s.codes[0] || {}).code || (this.api.contact().preferredContent(s, this.language) || {}).stringValue)),
          getSubForms: key => {
              return (_.get(root(), key) || []).map((a, idx) => {
                  return {
                      dataMap: a,
                      dataProvider: key === 'partnerships' ?
                          this.patientDataProvider(a, '', (rootPath.length ? rootPath + '.' : '') + key + '.' + idx, a.partnerId) :
                          this.patientDataProvider(oroot, (subPath && subPath.length ? subPath + '.' : '') + key + '[' + idx + ']', (rootPath.length ? rootPath + '.' : '') + key + '.' + idx, a.id || (a.id = this.api.crypto().randomUuid()))
                      ,
                      template:
                          key === 'telecoms' ?
                              this.telecomForm :
                              (key === 'addresses' || key === 'partnerInfo.addresses') ?
                                  this.addressForm :
                                  key === 'partnerships' ?
                                      this.partnershipsForm :

                                      key === 'medicalHouseContracts' ?
                                          this.medicalHouseContractsForm :
                                          this.insuranceForm
                  };
              });
          },
          getId: () => id,
          deleteSubForm: (key, id, index) => {
              this.flushSave();
              _.pullAt(_.get(root(), key), [index]);
              this.$[this.root.activeElement.id].notify((rootPath.length ? rootPath + '.' : '') + key + '.*');
              this.scheduleSave(this.patient);
          },
          addSubForm: (key, guid) => {
              this.flushSave(); //Important
              (_.get(root(), key) || _.get(_.set(root(), key, []), key)).push(key === 'partnerships' ? {
                  partnerId: this.api.crypto().randomUuid(),
                  partnerInfo: {}
              } : {});

              this.$[this.root.activeElement.id].notify((rootPath.length ? rootPath + '.' : '') + key + '.*');
              this.scheduleSave(this.patient);
          },
          filter: (data, text, uuid, id) => {
              if (data.source === 'insurances') {
                  return (text || '').length >= 2 ?
                      (text.match(/^[0-9]+$/) ? this.api.insurance().listInsurancesByCode(text) : this.api.insurance().listInsurancesByName(text))
                          .then(res => res.map(i => ({
                              'codeId': i.id,
                              'id': i.id,
                              'name': i.code + " - " + this.localizeContent(i.name, this.language)
                          }))) : id ? this.api.insurance().getInsurance(id)
                          .then(i => ({
                              'codeId': i.id,
                              'id': i.id,
                              'name': i.code + " - " + this.localizeContent(i.name, this.language)
                          })) : Promise.resolve([]);
              } else if (data.source === 'users') {
                  const s = text && text.toLowerCase()
                  return Promise.resolve(s ? Object.values(this.api.users).filter(u => (u.login && u.login.toLowerCase().includes(s.toLowerCase())) ||
                      (u.name && u.name.toLowerCase().includes(s.toLowerCase())) || (u.email && u.email.toLowerCase().includes(s.toLowerCase())))
                      .map(u => ({id: u.id, name: u.name || u.login || u.email})) : [])
              } else if (data.source === "codes" && data.types.length && (id || (text && text.length > 1))) {
                  return id ?
                      Promise.all(data.types.map(ct => this.api.code().getCodeWithParts(ct.type, id, '1')))
                          .then(x => _.compact(x)[0])
                          .then(c => {
                              const typeLng = this.api.code().languageForType(c.type, this.language)
                              return {id: c.code, name: c.label[typeLng]}
                          }) :
                      Promise.all(data.types.map(ct => {
                          const typeLng = this.api.code().languageForType(ct.type, this.language)
                          const words = text.toLowerCase().split(/\s+/)
                          const sorter = x => [x.name && x.name.toLowerCase().startsWith(words[0]) ? 0 : 1, x.name]

                          return this.api.code().findPaginatedCodesByLabel('be', ct.type, typeLng, words[0], null, null, 200).then(results => _.sortBy(results.rows.filter(c => c.label[typeLng] && words.every(w => c.label[typeLng].toLowerCase().includes(w))).map(code => ({
                              id: code.code,
                              name: code.label[typeLng],
                              stringValue: code.label[typeLng],
                              codes: [code]
                          })), sorter))
                      })).then(responses => _.flatMap(responses))
              } else if (data.source === "mh") {
                  return (id || '').length >= 1 ?
                      this.api.hcparty().getHealthcareParty(id).then(results => {
                          return {
                              'id': results.id,
                              'name': _.upperFirst(_.lowerCase(results.name)) + ' ' + (typeof results.nihii === 'undefined' || !results.nihii ? '' : ' - ' + this.localize('nihii', 'INAMI', language) + ': ' + results.nihii)
                          }
                      }) :
                      (text || '').length >= 2 ? Promise.all([this.api.hcparty().findBySsinOrNihii(text), this.api.hcparty().findByName(text)]).then(results => {
                          return _.flatten(_.chain(_.concat(results[0].rows, results[1].rows)).uniqBy('id').filter({type: 'medicalhouse'}).value().map(i => ({
                              'id': i.id,
                              'name': _.upperFirst(_.lowerCase(i.name)) + ' ' + (typeof i.nihii === 'undefined' || !i.nihii ? '' : ' - ' + this.localize('nihii', 'INAMI', language) + ': ' + i.nihii) + ' ' + ''
                          })));

                      }) : Promise.resolve([]);
              } else if (data.source === "insuranceTitularies") {
                  return (id || '').length >= 1 ?
                      this.api.patient().getPatientWithUser(this.user, id).then(p => this.api.register(p, 'patient')).then(results => {
                          return {
                              'id': results.id,
                              'name': _.upperFirst(_.lowerCase(_.get(results, "firstName", ""))) + ' ' + _.upperFirst(_.lowerCase(_.get(results, "lastName", ""))) + ' ' + this.api.formatSsinNumber(_.get(results, "ssin", ""))
                          }
                      }) :

                      (text || '').length >= 2 ? Promise.all([this.api.patient().filterByWithUser(this.user, null, null, null, null, null, null, {
                          filter: {
                              $type: "PatientByHcPartyNameContainsFuzzyFilter",
                              healthcarePartyId: this.user.healthCarePartyId,
                              searchString: text
                          }
                      })]).then(results => {
                          return _.flatten(_.chain(results[0].rows).uniqBy('ssin').filter((i) => {
                              return i &&
                                  !!_.trim(_.get(i, "ssin", "")) &&
                                  !!_.get(i, "active", false) &&
                                  parseInt(_.size(_.get(i, "insurabilities", []))) &&
                                  parseInt(_.size(_.filter(_.map(
                                      _.get(i, "insurabilities", []),
                                      (ins => ins &&
                                              _.size(ins) &&
                                              !_.trim(_.get(ins, "titularyId", "")) &&
                                              !!_.trim(_.get(ins, "insuranceId", "")) &&
                                              !!_.trim(_.get(ins, "identificationNumber", "")) &&
                                              (moment(_.get(ins, "startDate", 0), 'YYYYMMDD').isBefore(moment(), 'date') || !parseInt(_.get(ins, "startDate", 0))) &&
                                              (moment(_.get(ins, "endDate", 0), 'YYYYMMDD').isAfter(moment(), 'date') || !parseInt(_.get(ins, "endDate", 0)))
                                      )))))
                          }).value().map(i => ({
                              'id': i.id,
                              'name': _.upperFirst(_.lowerCase(_.get(i, "firstName", ""))) + ' ' + _.upperFirst(_.lowerCase(_.get(i, "lastName", ""))) + ' ' + this.api.formatSsinNumber(_.get(i, "ssin", ""))
                          })));

                      }) : Promise.resolve([]);
              }
              return Promise.resolve(id ? null : [])
          }
      };
  }

  localizeContent(e, lng) {
      return this.api && this.api.contact().localize(e, lng) || e;
  }

  showAddPersonToCareTeam() {
      this.$['add-person-to-care-team'].open()
      this.set('currentHcp', _.values(this.api.hcParties))
  }

  showAddNewPersonToCareTeamForm() {
      this.$['add-person-to-care-team'].close()
      this.$['add-new-person-to-care-team'].open()
  }

  addNewExternalPersonToCareTeam() {
      const careProvider = this.newHcpCareTeam

      this.api.hcparty().createHealthcareParty({
          "name": careProvider.LastName + " " + careProvider.FirstName,
          "lastName": careProvider.LastName,
          "firstName": careProvider.FirstName,
          "nihii": careProvider.Nihii,
          "ssin": careProvider.Niss
      }).then(hcp => {
          this.api.user().createUser({
              "healthcarePartyId": hcp.id,
              "name": careProvider.LastName + " " + careProvider.FirstName,
              "email": careProvider.Email,
              "applicationTokens": {"tmpFirstLogin": this.api.crypto().randomUuid()},
              "status": "ACTIVE",
              "type": "database"
          }).then(usr => {
              this.api.queue(this.patient, 'patient').then(([patient, defer]) => {
                  var phcp = patient.patientHealthCareParties
                  var newPhcp = {}
                  newPhcp.healthcarePartyId = hcp.id
                  newPhcp.referral = false
                  newPhcp.sendFormats = {}
                  phcp.push(newPhcp)

                  this.api.patient().modifyPatientWithUser(this.user, patient).catch(e => defer.resolve(patient))
                      .then(p => this.api.register(p, 'patient', defer))
                      .then(() => {
                          this.set('patient.patientHealthCareParties', phcp)
                          this.$['add-new-person-to-care-team'].close()
                          this.initCurrentCareTeam()

                          if (careProvider.Invite === true) {
                              this.$['ht-invite-hcp-link'].open()
                              this.invitedHcpLink = window.location.origin + window.location.pathname + '/?userId=' + usr.id + '&token=' + usr.applicationTokens.tmpFirstLogin
                          }
                      })
              })
          })
      })
  }

  initCurrentCareTeam() {
      var internalTeam = []
      var externalTeam = []
      var externalPatientHcpTeam = []
      //var dmgOwner = []

      this.api.patient().getPatientWithUser(this.user, this.patient.id).then(p => this.api.register(p, 'patient')).then(patient => {
          const internalHcp = patient.delegations
          const externalHcp = patient.patientHealthCareParties

          Promise.all([
                  Promise.all(
                      _.keys(internalHcp).map(hcpId =>
                          this.api.hcparty().getHealthcareParty(hcpId).then(hcp =>
                              internalTeam.push(hcp)
                          )
                      )
                  ),
                  Promise.all(
                      externalHcp.map(patientHcp =>
                          this.api.hcparty().getHealthcareParty(patientHcp.healthcarePartyId).then(hcp => {
                                  patientHcp.firstName = hcp.firstName;
                                  patientHcp.lastName = hcp.lastName;
                                  patientHcp.name = hcp.name;
                                  patientHcp.nihii = hcp.nihii;
                                  patientHcp.ssin = hcp.ssin;
                                  patientHcp.isDmg = patientHcp.referral;
                                  externalTeam.push(hcp);
                                  externalPatientHcpTeam.push(patientHcp);
                              }
                          )
                      )
                  )
              ]
          ).then(([,]) => {
              this.set('currentInternalCareTeam', internalTeam);
              this.set('currentExternalCareTeam', externalTeam);
              this.set('currentExternalPatientCareTeam', externalPatientHcpTeam);
          }).then(
              () => {
                  //this.set('currentDMGOwner', dmgOwner);
                  if (this.patient.ssin && this.api.tokenId) {
                      this.api.hcparty().getHealthcareParty(this.user.healthcarePartyId)
                          .then(hcp =>
                              this.api.fhc().Dmgcontroller().consultDmgUsingGET(this.api.keystoreId, this.api.tokenId, this.api.credentials.ehpassword, hcp.nihii, hcp.ssin, hcp.firstName, hcp.lastName, this.patient.ssin)
                          )
                          .then(dmgConsultResp => {
                              const dmgNihii = dmgConsultResp.hcParty && dmgConsultResp.hcParty.ids.find(id => id.s === 'ID_HCPARTY') ? dmgConsultResp.hcParty.ids.find(id => id.s === 'ID_HCPARTY').value : ''
                              if (dmgNihii && internalTeam.find(h => h.nihii === dmgNihii)) {
                                  // 3.1 Update user/party if exists
                                  console.log('dmg owner in internal team')
                                  const hcpI = internalTeam.find(h => h.nihii === dmgNihii)
                                  //TODO: show status
                                  return hcpI
                              } else if (dmgNihii && externalTeam.find(h => h.nihii === dmgNihii)) {
                                  // 3.1 Update user/party if exists
                                  console.log('dmg owner in external team')
                                  let hcpE = externalTeam.find(h => h.nihii === dmgNihii)
                                  hcpE.name = (!dmgConsultResp.hcParty.name) && dmgConsultResp.hcParty.name === '' ? dmgConsultResp.hcParty.familyname + ' ' + dmgConsultResp.hcParty.firstname : dmgConsultResp.hcParty.name
                                  hcpE.lastName = dmgConsultResp.hcParty.familyname
                                  hcpE.firstName = dmgConsultResp.hcParty.firstname
                                  hcpE.nihii = dmgConsultResp.hcParty.ids.find(id => id.s === 'ID_HCPARTY').value

                                  hcpE.addresses = []
                                  if (dmgConsultResp.hcParty && dmgConsultResp.hcParty.addresses) {
                                      dmgConsultResp.hcParty.addresses.map(addr => {
                                          let hcAddr = {}
                                          hcAddr.addressType = addr.cds.find(cd => cd.s === 'CD_ADDRESS') ? addr.cds.find(cd => cd.s === 'CD_ADDRESS').value : ''
                                          hcAddr.street = addr.street ? addr.street : ''
                                          hcAddr.city = addr.city ? addr.city : ''
                                          hcAddr.postalCode = addr.zip ? addr.zip : ''
                                          hcAddr.houseNumber = addr.housenumber ? addr.housenumber : ''
                                          hcAddr.postboxNumber = addr.postboxnumber ? addr.postboxnumber : ''
                                          hcAddr.country = addr.country && addr.country.cd && addr.country.cd.value ? addr.country.cd.value : ''
                                          hcpE.addresses.push(hcAddr)
                                      })
                                  }

                                  if (dmgConsultResp.hcParty && dmgConsultResp.hcParty.cds) {
                                      const cd = dmgConsultResp.hcParty.cds.find(cd => cd.s === 'CD_HCPARTY')
                                      if (cd) {
                                          hcpE.speciality = cd.value ? cd.value : ''
                                      }
                                  }
                                  hcpE.referral = true
                                  hcpE.isDmg = true
                                  hcpE.referralPeriods = [{
                                      startDate: dmgConsultResp.from,
                                      endDate: dmgConsultResp.to
                                  }]

                                  return this.api.hcparty().modifyHealthcareParty(hcpE)
                                      .then(hcpE => {
                                          this.api.queue(this.patient, 'patient')
                                              .then(([patient, defer]) => {
                                                  let phcpE = patient.patientHealthCareParties.find(phcp => phcp.healthcarePartyId === hcpE.id)
                                                  if (!phcpE) {
                                                      patient.patientHealthCareParties.push(phcpE = {
                                                          healthcarePartyId: hcpE.id,
                                                          referralPeriods: []
                                                      })
                                                  }
                                                  const currentReferralPeriod = phcpE.referralPeriods.find(rp => !rp.endDate)
                                                  let type = "other"
                                                  if (dmgConsultResp.hcParty && dmgConsultResp.hcParty.cds) {
                                                      const cd = dmgConsultResp.hcParty.cds.find(cd => cd.s === 'CD_HCPARTY')
                                                      if (cd.value === 'orgprimaryhealthcarecenter') {
                                                          type = "medicalhouse"
                                                      } else if (cd.value === 'persphysician') {
                                                          type = "doctor"
                                                      }
                                                  }
                                                  if (!currentReferralPeriod || !phcpE.referral || phcpE.type !== type) {
                                                      phcpE.referralPeriods = [{
                                                          startDate: dmgConsultResp.from,
                                                          endDate: null
                                                      }]
                                                      phcpE.referral = true
                                                      phcpE.isDmg = true

                                                      return this.api.patient().modifyPatientWithUser(this.user, patient).catch(e => defer.resolve(patient)).then(p => this.api.register(p, 'patient', defer)).then(p => this.patientChanged())
                                                  } else {
                                                      defer.resolve(patient)
                                                      return patient
                                                  }
                                              })
                                              .then(() => hcpE)
                                      })
                              } else if (dmgNihii) {
                                  console.log('dmg owner not yet in patientHcParties')
                                  return this.api.hcparty().createHealthcareParty({
                                      "name": (!dmgConsultResp.hcParty.name) && dmgConsultResp.hcParty.name === '' ? dmgConsultResp.hcParty.familyname + ' ' + dmgConsultResp.hcParty.firstname : dmgConsultResp.hcParty.name,
                                      "lastName": dmgConsultResp.hcParty.familyname,
                                      "firstName": dmgConsultResp.hcParty.firstname,
                                      "nihii": dmgConsultResp.hcParty.ids.find(id => id.s === 'ID_HCPARTY').value,
                                      "ssin": '' //TODO: get SSIN from dmgConsultResp
                                  }).then(hcp2 => {
                                      var newPhcp = {}
                                      newPhcp.firstName = hcp2.firstName
                                      newPhcp.lastName = hcp2.lastName
                                      newPhcp.name = hcp2.name
                                      newPhcp.nihii = hcp2.nihii
                                      newPhcp.ssin = hcp2.ssin
                                      newPhcp.healthcarePartyId = hcp2.id
                                      if (dmgConsultResp.hcParty && dmgConsultResp.hcParty.cds) {
                                          const cd = dmgConsultResp.hcParty.cds.find(cd => cd.s === 'CD_HCPARTY')
                                          if (cd.value === 'orgprimaryhealthcarecenter') {
                                              newPhcp.type = "medicalhouse"
                                          } else if (cd.value === 'persphysician') {
                                              newPhcp.type = "doctor"
                                          } else {
                                              newPhcp.type = "other"
                                          }
                                      }
                                      newPhcp.isDmg = true
                                      newPhcp.referral = true
                                      newPhcp.referralPeriods = [{
                                          startDate: dmgConsultResp.from,
                                          endDate: dmgConsultResp.to
                                      }]
                                      hcp2.addresses = []
                                      if (dmgConsultResp.hcParty && dmgConsultResp.hcParty.addresses) {
                                          dmgConsultResp.hcParty.addresses.map(addr => {
                                              let hcAddr = {}
                                              hcAddr.addressType = addr.cds.find(cd => cd.s === 'CD_ADDRESS') ? addr.cds.find(cd => cd.s === 'CD_ADDRESS').value : ''
                                              hcAddr.street = addr.street ? addr.street : ''
                                              hcAddr.city = addr.city ? addr.city : ''
                                              hcAddr.postalCode = addr.zip ? addr.zip : ''
                                              hcAddr.houseNumber = addr.housenumber ? addr.housenumber : ''
                                              hcAddr.postboxNumber = addr.postboxnumber ? addr.postboxnumber : ''
                                              hcAddr.country = addr.country && addr.country.cd && addr.country.cd.value ? addr.country.cd.value : ''
                                              hcp2.addresses.push(hcAddr)
                                          })
                                      }

                                      if (dmgConsultResp.hcParty && dmgConsultResp.hcParty.cds) {
                                          const cd = dmgConsultResp.hcParty.cds.find(cd => cd.s === 'CD_HCPARTY')
                                          if (cd) {
                                              hcp2.speciality = cd.value ? cd.value : ''
                                          }
                                      }

                                      hcp2.pphc = newPhcp
                                      hcp2.referral = true
                                      hcp2.referralPeriods = [{
                                          startDate: dmgConsultResp.from,
                                          endDate: dmgConsultResp.to
                                      }]

                                      console.log('dmg owner pushed to external team')
                                      //externalTeam.push(hcp2);
                                      externalPatientHcpTeam.push(hcp2)
                                      this.api.queue(this.patient, 'patient').then(([patient, defer]) => {
                                          patient.patientHealthCareParties = this.patient.patientHealthCareParties
                                          this.push('patient.patientHealthCareParties', newPhcp)
                                          // 4 save data
                                          return this.api.patient().modifyPatientWithUser(this.user, patient).catch(e => defer.resolve(patient)).then(p => this.api.register(p, 'patient', defer))
                                      })

                                  })
                              }
                          })
                          .then(() => {
                              this.set('currentInternalCareTeam', internalTeam)
                              this.set('currentExternalCareTeam', externalTeam)
                              this.set('currentExternalPatientCareTeam', externalPatientHcpTeam)
                          })
                          .catch(e => {
                              console.log(e)
                              this.set('currentInternalCareTeam', internalTeam)
                              this.set('currentExternalCareTeam', externalTeam)
                              this.set('currentExternalPatientCareTeam', externalPatientHcpTeam)
                          })
                  }
              })

      })
  }

  getHcpName(hcp) {
      if (hcp.name && hcp.name !== '') {
          return hcp.name
      } else {
          return hcp.firstName + ' ' + hcp.lastName
      }
  }

  formatDate(date) {
      if (date) {
          return this.api.moment(date).format('DD/MM/YYYY')
      } else {
          return ''
      }
  }

  getStartDate(item) {
      if (item.referralPeriods && item.referralPeriods[0]) {
          return this.formatDate(item.referralPeriods[0].startDate)
      } else {
          return null;
      }
  }

  getEndDate(item) {
      if (item.referralPeriods && item.referralPeriods[0]) {
          return this.formatDate(item.referralPeriods[0].endDate)
      } else {
          return null;
      }
  }

  showInfoSelectedHcp(e) {
      //TODO: catch the case no hcp is selected

      let tmp = this.selectedCareProvider;

      this.$['showHcpInfo'].open();

      const pphcTab = this.patient.patientHealthCareParties;
      const pphcTarget = pphcTab.find(pphc => pphc.healthcarePartyId === this.selectedCareProvider.id);

      //Comparer les dates pour le detenteur du dmg
      if (pphcTarget) {
          pphcTarget.referralPeriods.map(rp => rp);
      }

      if (this.selectedCareProvider && this.selectedCareProvider.isDmg) {

          this.selectedCareProvider.pphc = _.cloneDeep(this.selectedCareProvider);
          this.set('selectedPerson', this.selectedCareProvider);
      } else {
          if (pphcTarget) this.selectedCareProvider.pphc = pphcTarget;
          this.set('selectedPerson', this.selectedCareProvider);
      }

  }

  _timeFormat(date) {
      return date && this.api.moment(date).format(date > 99991231 ? 'DD/MM/YYYY HH:mm' : 'DD/MM/YYYY') || '';
  }

  _sharingHcp(item) {
      if (item) {
          const mark = this.hcpSelectedForTeam.find(m => m.id === item.id)
          return mark && mark.check
      } else {
          return false
      }
  }

  _checkHcp(e) {
      if (e.target.id !== "") {
          const mark = this.hcpSelectedForTeam.find(m => m.id === e.target.id)
          if (!mark) {
              this.push('hcpSelectedForTeam', {id: e.target.id, check: true})
          } else {
              mark.check = !mark.check
              this.notifyPath('hcpSelectedForTeam.*')
          }
      }

  }

  confirmSharing() {
      let pPromise = Promise.resolve([])
      const hcpId = this.user.healthcarePartyId

      pPromise = pPromise.then(pats =>
          this.api.patient().share(this.api.user, this.patient.id, hcpId, this.hcpSelectedForTeam.filter(hcp =>
              hcp.check && hcp.id).map(hcp => hcp.id))
              .then(pat => {
                      _.concat(pats, pat)
                      this.initCurrentCareTeam()
                  }
              )
      )
      return pPromise
  }

  formatNihiiNumber(nihii) {
      return nihii ? ("" + nihii).replace(/([0-9]{1})([0-9]{5})([0-9]{2})([0-9]{3})/, '$1-$2-$3-$4') : ''
  }

  formatNissNumber(niss) {
      return niss ? ("" + niss).replace(/([0-9]{2})([0-9]{2})([0-9]{2})([0-9]{3})([0-9]{2})/, '$1.$2.$3-$4.$5') : ''
  }

  chckInvite(e) {
      if (e.target.checked) {
          this.newHcpCareTeam.Invite = true
      } else {
          this.newHcpCareTeam.Invite = false
      }
  }

  fillWithCard() {
      if (Object.keys(this.cardData).length !== 0 && this.patient.ssin === this.cardData.nationalNumber) {
          let streetData = _.trim(this.cardData.street).split(" ")
          const number = streetData.find(str => str.match(/\d/g))
          const boxNumber = streetData[streetData.length - 1] !== number ? streetData[streetData.length - 1] : ""
          const street = streetData.reduce((tot, str) => {
              if (!tot) tot = "";
              if (!(str === number || str === boxNumber))
                  tot = tot.concat(" ", str)
              return tot;
          })

          this.set("patient.lastName", this.cardData.surname)
          this.set("patient.firstName", this.cardData.firstName)
          this.set("patient.placeOfBirth", this.cardData.locationOfBirth)
          this.set("patient.dateOfBirth", parseInt(this.api.moment(this.cardData.dateOfBirth * 1000).format('YYYYMMDD')))
          this.set("patient.nationality", this.cardData.nationality)
          this.set("patient.picture", this.cardData.picture)
          this.set("patient.gender", this.cardData.gender === 'M' ? 'male' : 'female')

          if (!this.patient.addresses.find(adr => adr.addressType === "home")) {
              this.push("patient.addresses", {
                  addressType: "home",
                  street: street,
                  houseNumber: number,
                  postboxNumber: boxNumber,
                  postalCode: this.cardData.zipCode,
                  city: this.cardData.municipality,
                  country: this.cardData.country
              })
          } else {
              this.set("patient.addresses." + this.patient.addresses.findIndex(adr => adr.addressType === "home"), {
                  street: street,
                  houseNumber: number,
                  postboxNumber: boxNumber,
                  postalCode: this.cardData.zipCode,
                  city: this.cardData.municipality,
                  country: this.cardData.country
              })
          }

          this.api.patient().modifyPatientWithUser(this.user, this.patient)
              .then(p => this.api.register(p, 'patient'))
              .then(p => {
                  this.set('patient', p)
                  this.patientChanged()
              })
      } else if (Object.keys(this.cardData).length === 0) {
          fetch('http://127.0.0.1:16042/read')
              .then((response) => {
                  return response.json()
              })
              .then(res => {
                  if (res.cards[0]) {
                      this.set('cardData', res.cards[0])
                      this.fillWithCard()
                      this.dispatchEvent(new CustomEvent('card-changed', {
                          detail: {cardData: this.cardData},
                          composed: true,
                          bubbles: true
                      }));
                  }
              })
      } else {
          console.log("mauvaise carte inserer")
      }
  }

  _tabIndexChanged() {
      if (this.tabIndex >= 0 && this.tabs >= 0 && this.tabIndex != this.tabs) {
          this.set('tabs', this.tabIndex)
      }
  }
}

customElements.define(HtPatAdminCard.is, HtPatAdminCard);
