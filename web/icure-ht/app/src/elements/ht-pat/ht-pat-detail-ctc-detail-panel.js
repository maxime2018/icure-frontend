import '@polymer/iron-icon/iron-icon.js'
import '@polymer/paper-button/paper-button.js'
import '@polymer/paper-dialog/paper-dialog.js'
import '@polymer/paper-fab/paper-fab.js'
import '@polymer/paper-icon-button/paper-icon-button.js'
import '@polymer/paper-input/paper-input.js'
import '@polymer/paper-item/paper-item.js'
import '@polymer/paper-tooltip/paper-tooltip.js'
import '../filter-panel/filter-panel.js';
import '../dynamic-form/dynamically-loaded-form.js';
import './dialogs/ht-pat-invoicing-dialog.js';
import './dialogs/ht-pat-prescription-dialog.js';
import './ht-pat-detail-table.js';
import '../dynamic-form/ht-services-list.js';
import '../dynamic-form/dynamic-doc.js';
import '../dynamic-form/entity-selector.js';
import '../ht-spinner/ht-spinner.js';
import '../dynamic-form/dynamic-subcontact-type-selector.js';

import _ from 'lodash/lodash';
import moment from 'moment/src/moment';
//import '../prose-editor/prose-editor/prose-editor';
import * as evaljs from "evaljs";
import * as models from 'icc-api/dist/icc-api/model/models';
import {TkLocalizerMixin} from "../tk-localizer";

import {PolymerElement,html} from '@polymer/polymer/polymer-element.js';
class HtPatDetailCtcDetailPanel extends TkLocalizerMixin(PolymerElement) {
  static get template() {
    return html`
        <style>
            .notification-panel {
                position: fixed;
                top: 50%;
                right: 0;
                z-index: 1000;
                color: white;
                font-size: 13px;
                background: rgba(255, 0, 0, 0.55);
                height: 96px;
                padding: 0 8px 0 12px;
                border-radius: 3px 0 0 3px;
                overflow: hidden;
                white-space: nowrap;
                width: 0;
                opacity: 0;
            }

            .notification {
                animation: notificationAnim 7.5s ease-in;
            }

            @keyframes notificationAnim {
                0% {
                    width: 0;
                    opacity: 0;
                }
                5% {
                    width: 440px;
                    opacity: 1;
                }
                7% {
                    width: 420px;
                    opacity: 1;
                }
                95% {
                    width: 420px;
                    opacity: 1;
                }
                100% {
                    width: 0;
                    opacity: 0;
                }
            }

            .details-panel {
                /*width: calc(50% + 1px);*/
                height: 100%;
                background: var(--app-background-color-light);
                /*position: fixed;*/
                top: 64px;
                width: 100%;
                /*left: calc(50% - 1px);
				grid-column: 3 / 3;
				grid-row:1 / 1;*/
                z-index: 1;
            }

            .contact-card-frame {
                padding-bottom: 24px;
            }

            .ctc-header {
                position: relative;
                background: var(--app-background-color-dark);
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                width: 100%;
                margin-bottom: 16px;
            }

            .ctc-header .contact-title {
                flex-grow: 1;
            }

            .ctc-header .save {
                background: var(--app-secondary-color);
                border-radius: 50%;
                margin: 12px 36px;
                padding: 4px;
                cursor: pointer;
                box-shadow: var(--shadow-elevation-2dp_-_box-shadow);
                transition: .25s ease;
                width: 24px;
                height: 24px;
                text-align: center;
                line-height: 24px;
            }

            .ctc-header .save iron-icon {
                width: 20px;
                margin-top: -3px;
            }

            .ctc-header .save:hover {
                transform: scale(1.05);
            }

            .ctc-header .save:active {
                background: var(--app-secondary-color-dark);
                box-shadow: none;
                transform: scale(.9);
            }

            .contact-title {
                display: block;
                @apply --paper-font-body2;
                @apply --padding-32;
                padding-bottom: 8px;
                padding-top: 16px;
            }

            /*.contact-title:first-child{
				padding-top:0;
			}*/
            .pat-details-card > .card-content {
                padding: 16px 16px 32px !important;
            }

            .pat-details-card {
                width: calc(100% - 64px);
                margin: 0 32px 32px;
            }

            .horizontal {
                display: flex;
                flex-direction: row;
                flex-wrap: wrap;
                flex-basis: 100%;
            }

            .justified {
                justify-content: space-between;
            }

            .pat-details-input {
                flex-grow: 1;
                margin: 16px;
            }

            input {
                border: none;
                width: 100%;
            }

            .contact-card-container {
                position: relative;
                overflow-y: auto;
                height: calc(100% - 80px);
                padding-bottom: 32px;
            }

            .extra-info {
                color: var(--app-text-color-disabled);
                font-style: italic;
                font-size: 80%;
            }

            vaadin-upload {
                margin: 16px;
                margin-bottom: 0;
                min-height: 280px;
                background: var(--app-background-color);
                --vaadin-upload-buttons-primary: {
                    padding: 16px;
                };
                --vaadin-upload-button-add: {
                    background: var(--app-secondary-color);
                    color: var(--app-text-color);
                };
                --vaadin-upload-file-progress: {
                    --paper-progress-active-color: var(--app-secondary-color);
                };
                --vaadin-upload-file-commands: {
                    color: var(--app-primary-color);
                }

            }

            .close-button-icon {
                position: absolute;
                top: 0;
                right: 0;
                margin: 0;
                transform: translate(50%, -50%);
                height: 32px;
                width: 32px;
                padding: 8px;
                background: var(--app-primary-color);
            }

            paper-dialog {
                width: 80%;
                min-width: 30%;
                margin: 0;
            }

            paper-input {
                --paper-input-container-focus-color: var(--app-primary-color);
            }

            .modal-title {
                background: var(--app-background-color-dark);
                margin-top: 0;
                padding: 16px 24px;
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

            .modal-button--cancel,
            .modal-button--bordered {
                background: transparent;
                color: black;
                border: 1px solid var(--app-background-color-dark);
            }

            .modal-button--save {
                box-shadow: var(--shadow-elevation-2dp_-_box-shadow);
                background: var(--app-secondary-color);
                color: var(--app-primary-color-dark);
                font-weight: 700;
                text-transform: capitalize;
            }

            filter-panel {
                flex-grow: 9;
                /* --panel-width: 60%; */
            }

            .layout-bar {
                flex-grow: 1;
                display: inline-flex;
                flex-flow: row nowrap;
                align-items: center;
                justify-content: space-around;
                height: 48px;
                background: var(--app-secondary-color);
                border-left: 1px solid var(--app-secondary-color-dark);
            }

            .layout-bar .list, .layout-bar .graphique, .layout-bar .doc, .layout-bar .table {
                height: 32px;
                width: 32px;
                color: var(--app-text-color-disabled);
            }

            .layout-bar .list {
                padding: 0;
            }

            .layout-bar .doc {
                padding: 4px;
            }

            .layout-bar .table {
                padding: 6px;
            }

            .icn-selected {
                color: var(--app-primary-color-dark) !important;
            }

            .floating-action-bar {
                display: flex;
                position: absolute;
                height: 40px;
                bottom: 16px;
                background: var(--app-secondary-color);
                border-radius: 3px;
                grid-column: 3/3;
                grid-row: 1/1;
                z-index: 10;
                left: 50%;
                transform: translate(-50%, 0);
                box-shadow: var(--app-shadow-elevation-2);
            }

            .add-forms-container {
                text-align: right;
                position: absolute;
                bottom: 48px;
                right: 0;
                background-color: var(--app-background-color-light);
                opacity: .8;
                padding: 8px 0;
                border-radius: 2px;
                max-width: 253px;
            }

            .floating-action-bar paper-fab-speed-dial-action {
                --paper-fab-speed-dial-action-label-background: transparent;
                --paper-fab-iron-icon: {
                    transform: scale(0.8);

                };
                --paper-fab: {
                    background: var(--app-primary-color-dark);
                }
            }

            .floating-action-bar paper-button {
                --paper-button-ink-color: var(--app-secondary-color-dark);
                background: var(--app-secondary-color);
                color: var(--app-text-color);
                font-weight: bold;
                font-size: 12px;
                height: 40px;
                min-width: 130px;
                padding: 10px 1.2em;
                border-radius: 0;
                margin: 0;
                text-transform: capitalize;
            }

            .floating-action-bar paper-button:hover {
                background: var(--app-dark-color-faded);
                transition: var(--transition_-_transition);
            }

            .floating-action-bar paper-button:not(:first-child) {
                border-left: 1px solid var(--app-secondary-color-dark);
            }

            .close-add-forms-btn {
                background: var(--app-secondary-color-dark) !important;
            }

            .fleft {
                position: absolute;
                left: 8px;
            }

            .fright {
                position: absolute;
                right: 8px;
            }

            .floating-action-bar iron-icon {
                box-sizing: border-box;
                padding: 2px;
                margin-right: 8px;
            }

            .horizontal {
                flex-flow: row nowrap;
            }

            .action-btn {
                white-space: nowrap;
            }

            ht-spinner.center {
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translateX(-50%) translateY(-50%);
                height: 42px;
                width: 42px;
            }

            .paper-fab-container {
                position: relative;
            }

            #prose-editor, #prose-editor-linking-letter {
                width: 90%;
                height: calc(90% - 64px);
                max-width: 1024px;
            }

            #prose-editor > prose-editor, #prose-editor-linking-letter > prose-editor {
                height: calc(100% - 60px - 56px);
                width: 100%;
                display: block;
                padding: 0;
                margin: 0;
            }

            .buttons {
                display: flex;
                flex-grow: 1;
                box-sizing: border-box;
                justify-content: flex-end;
                padding: 16px 12px 8px 16px;
            }

            #dynamicallyListForm,
            #dynamicallyTableForm {
                display: flex;
                flex-direction: column;
                height: 100%;
            }

            .mobile-only {
                display: none;
            }

            @media screen and (max-width: 952px) {
                paper-dialog#prescriptionDialog {
                    position: fixed;
                    max-height: none;
                    max-width: none !important;
                    top: 64px !important;
                    left: 0 !important;
                    height: calc(100vh - 84px) !important; /* 84 = app-header and log */
                    width: 100% !important;
                }

                .floating-action-bar paper-button {
                    min-width: 0 !important;
                }

                .floating-action-bar .no-mobile {
                    display: none;
                }

                .mobile-only {
                    display: initial;
                }
            }

            #templateSavedIndicator {
                position: fixed;
                top: 50%;
                right: -200px;
                z-index: 1000;
                color: white;
                font-size: 13px;
                background: rgba(0, 0, 0, 0.42);
                height: 24px;
                padding: 0 8px 0 12px;
                border-radius: 3px 0 0 3px;
                width: 170px;
                opacity: 1;
                transition: all 400ms ease;
                -moz-transition: all 400ms ease;
                -webkit-transition: all 400ms ease;
                -o-transition: all 400ms ease;
                -ms-transition: all 400ms ease;
            }

            .templateSaved {
                right: 0 !important;
            }

            #template-description-dialog {
                width: 60%;
                padding-bottom: 20px;
            }

            #template-description-dialog h2 {
                margin: 0 -24px
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

            .mr5 {
                margin-right: 5px
            }

            .smallIcon {
                width: 16px;
                height: 16px;
            }

            @media screen and (max-width: 672px) {
                .modal-button {
                    margin: 4px 0;
                }
            }

            @media screen and (max-height: 744px) {
                #entities-list {
                    flex-grow: 1;
                    height: auto !important;
                }
            }

            #chooseSizePrintFormDialog {
                width: 300px
            }

        </style>

        <paper-item id="prescriptionError" class="notification-panel prescriptionError">
            <template is="dom-if" if="[[!api.tokenId]]">[[localize('you_mus_be_con_to_ehe_to_be_all_to_pre','You must be
                connected to eHealth to be allowed to prescribe',language)]]<br></template>
            <template is="dom-if" if="[[!_validSsin(patient.ssin)]]">
                [[localize('the_ni_of_the_pat_is_not_val_or_mis','The niss of the patient is not valid or missing
                ',language)]]([[patient.ssin]])<br></template>
            <template is="dom-if" if="[[!_hasDrugsToBePrescribed(servicesMap.*,currentContact,currentContact.services,currentContact.services.*)]]">
                [[localize('add_pre_dru_to_cur_con_to_pre','Add prescription drugs to current contact to
                prescribe',language)]]
            </template>
            <iron-icon icon="icons:warning"></iron-icon>
        </paper-item>

        <div class="details-panel" on-dragover="_onDrag">
            <div class="layout horizontal">
                <filter-panel id="serviceFilterPanel" selected-filters="{{serviceFilters}}" items="[[detailPanelItems]]" i18n="[[i18n]]" language="[[language]]" resources="[[resources]]"></filter-panel>
                <div class="layout-bar">
                    <paper-icon-button id="list_icn" class\$="list [[_activeIconClass(list)]]" icon="icons:view-list" on-tap="_list"></paper-icon-button>
                    <paper-icon-button id="table_icn" class\$="table [[_activeIconClass(table)]]" icon="vaadin:table" on-tap="_table"></paper-icon-button>
                    <!--<paper-icon-button id="graph_icn" class\$="graph [[_activeIconClass(graph)]]" icon="icons:timeline" on-tap="_graphique"></paper-icon-button>-->
                    <paper-icon-button id="form_icn" class\$="doc [[_activeIconClass(doc)]]" icon="icons:assignment" on-tap="_default"></paper-icon-button>

                    <paper-tooltip for="list_icn" position="bottom" animation-delay="0">[[localize('lis_vie','List
                        view',language)]]
                    </paper-tooltip>
                    <paper-tooltip for="table_icn" position="bottom" animation-delay="0">[[localize('tab_vie','Table
                        view',language)]]
                    </paper-tooltip>
                    <paper-tooltip for="graph_icn" position="bottom" animation-delay="0">[[localize('gra','Graph
                        view',language)]]
                    </paper-tooltip>
                    <paper-tooltip for="form_icn" position="bottom" animation-delay="0">[[localize('form_view','Forms
                        view',language)]]
                    </paper-tooltip>
                </div>
            </div>
            <div class="contact-card-container">
                <ht-spinner class="center" active="[[isLoadingDoc]]"></ht-spinner>
                <template is="dom-if" if="[[list]]">
                    <div class="ctc-header">
						<span class="contact-title"> [[_selectedContactsHeaderLabel(contacts, currentContact.tags.*)]]
                        </span>
                    </div>
                    <ht-services-list id="dynamicallyListForm" api="[[api]]" user="[[user]]" patient="[[patient]]" contact="[[dof.ctc]]" health-elements="[[healthElements]]" contacts="[[contacts]]" i18n="[[i18n]]" language="[[language]]" resources="[[resources]]"></ht-services-list>
                </template>
                <template is="dom-if" if="[[table]]">
                    <div class="ctc-header">
						<span class="contact-title"> [[_selectedContactsHeaderLabel(contacts, currentContact.tags.*)]]
                        </span>
                    </div>
                    <ht-pat-detail-table id="dynamicallyTableForm" api="[[api]]" user="[[user]]" patient="[[patient]]" contact="[[dof.ctc]]" health-elements="[[healthElements]]" contacts="[[contacts]]" i18n="[[i18n]]" language="[[language]]" resources="[[resources]]"></ht-pat-detail-table>
                </template>
                <template is="dom-if" if="[[graphique]]">
                    <div class="ctc-header">
						<span class="contact-title">[[_selectedContactsHeaderLabel(contacts, currentContact.tags.*)]]
                            <template is="dom-if" if="[[_hasCurrentContact()]]">
                                <dynamic-subcontact-type-selector id="subctc-type-c" subcontact-type="[[contactTypeList]]" language="[[language]]" resources="[[resources]]" on-link-to-subcontact-type="_contactTypeChange"></dynamic-subcontact-type-selector>
                            </template>
                        </span>
                        <template is="dom-if" if="[[_hasCurrentContact()]]">
                            <paper-button on-tap="forceSaveCtc">
                                <iron-icon id="force-save-ctc-graph" icon="save"></iron-icon>
                            </paper-button>
                            <paper-tooltip position="left" for="force-save-ctc-graph">[[localize('save_ctc','Save
                                contact',language)]]
                            </paper-tooltip>
                        </template>
                    </div>
                </template>
                <template is="dom-if" if="[[doc]]">
                    <div class="contact-card-frame">
                        <template is="dom-if" if="[[!contactsFormsAndDocuments.length]]">
                            <div class="ctc-header">
                                <span class="contact-title">[[_contactHeaderLabel(currentContact, currentContact.tags.*)]]
                                    <template is="dom-if" if="[[_hasCurrentContact(contacts)]]">
                                        <dynamic-subcontact-type-selector id="subctc-type-b" subcontact-type="[[contactTypeList]]" language="[[language]]" resources="[[resources]]" on-link-to-subcontact-type="_contactTypeChange"></dynamic-subcontact-type-selector>
                                    </template>
                                </span>
                                <template is="dom-if" if="[[_hasCurrentContact(contacts)]]">
                                    <paper-button on-tap="forceSaveCtc">
                                        <iron-icon id="force-save-ctc-graph" icon="save"></iron-icon>
                                    </paper-button>
                                    <paper-tooltip position="left" for="force-save-ctc-table">
                                        [[localize('save_ctc','Save contact',language)]]
                                    </paper-tooltip>
                                </template>
                            </div>
                        </template>
                        <template is="dom-repeat" items="[[contactsFormsAndDocuments]]" as="dof">
                            <div class="ctc-header">
                            <span class="contact-title">[[_contactHeaderLabel(dof.ctc, currentContact.tags.*)]]
								<template is="dom-if" if="[[_isCurrentContact(dof.ctc)]]">
                                    <dynamic-subcontact-type-selector id="subctc-type-d" subcontact-type="[[contactTypeList]]" language="[[language]]" resources="[[resources]]" on-link-to-subcontact-type="_contactTypeChange"></dynamic-subcontact-type-selector>
								</template>
							</span>
                                <template is="dom-if" if="[[_isCurrentContact(dof.ctc)]]">
                                    <paper-button on-tap="forceSaveCtc">
                                        <iron-icon id="force-save-ctc-graph" icon="save"></iron-icon>
                                    </paper-button>
                                    <paper-tooltip position="left" for="force-save-ctc-forms">
                                        [[localize('save_ctc','Save contact',language)]]
                                    </paper-tooltip>
                                </template>
                            </div>
                            <template id="formsRepeat" is="dom-repeat" items="[[dof.forms]]" as="form">
                                <template is="dom-if" if="[[form.id]]">
                                    <dynamically-loaded-form id="dynamicallyLoadedForm" api="[[api]]" user="[[user]]" patient="[[patient]]" form-id="[[form.id]]" contact="[[dof.ctc]]" current-contact="[[currentContact]]" on-open-prescription-dialog="_prescribe" main-health-elements="[[mainHealthElements]]" health-elements="[[healthElements]]" contacts="[[allContacts]]" services-map="[[servicesMap]]" i18n="[[i18n]]" language="[[language]]" resources="[[resources]]" on-edit-form="edit" on-form-deleted="formDeleted" on-new-service="_newService" on-data-change="_refreshFromServices" on-new-report="newReport" on-print-subform="printSubForm" subcontact-type="[[subcontactType]]"></dynamically-loaded-form>
                                </template>
                                <template is="dom-repeat" items="[[form.docs]]">
                                    <dynamic-doc api="[[api]]" user="[[user]]" patient="[[patient]]" document-id="[[_documentId(item)]]" i18n="[[i18n]]" language="[[language]]" resources="[[resources]]" title="[[item.label]]" downloadable="true" preview="true" is-pat-detail="true"></dynamic-doc>
                                </template>
                            </template>
                            <template is="dom-if" if="[[dof.unmappedServices.length]]">
                                <dynamically-loaded-form api="[[api]]" user="[[user]]" patient="[[patient]]" contact="[[dof.ctc]]" current-contact="[[currentContact]]" form="[[_virtualForm(dof.unmappedServices)]]" main-health-elements="[[mainHealthElements]]" health-elements="[[healthElements]]" contacts="[[allContacts]]" services-map="[[servicesMap]]" i18n="[[i18n]]" language="[[language]]" resources="[[resources]]"></dynamically-loaded-form>
                            </template>
                        </template>
                    </div>
                </template>
            </div>
            <div id="floating-action-bar" class="floating-action-bar">
                <template is="dom-if" if="[[_hasCurrentContact(contacts)]]">
                    <template is="dom-if" if="[[!showAddFormsContainer]]">
                        <paper-button id="newFormBtn" class="add-forms-btn action-btn" on-tap="_toggleAddActions">
                            <iron-icon icon="[[_actionIcon(showAddFormsContainer)]]"></iron-icon>
                            <span class="no-mobile">[[localize('add_for','Add forms',language)]]</span>
                        </paper-button>
                    </template>
                    <template is="dom-if" if="[[showAddFormsContainer]]">
                        <div class="paper-fab-container">
                            <paper-button class="close-add-forms-btn action-btn" on-tap="_toggleAddActions">
                                <iron-icon icon="[[_actionIcon(showAddFormsContainer)]]"></iron-icon>
                                <span class="no-mobile">[[localize('clo','Close',language)]]</span>
                            </paper-button>
                            <div class="add-forms-container">
                                <!--<paper-fab-speed-dial-action icon="vaadin:chart-line" on-tap="addMedicalHistory">[[localize('med_his','Medical history',language)]]</paper-fab-speed-dial-action>-->
                                <paper-fab-speed-dial-action icon="vaadin:doctor-briefcase" on-tap="addConsultation">
                                    [[localize('con_mso','Consultation MSOAP',language)]]
                                </paper-fab-speed-dial-action>
                                <paper-fab-speed-dial-action icon="vaadin:pill" on-tap="addPrescriptionForm">
                                    [[localize('presc_of_med','Ordonnance',language)]]
                                </paper-fab-speed-dial-action>
                                <!--<paper-fab-speed-dial-action icon="vaadin:file-o" on-tap="newReport">[[localize('new_rep','Nouveau rapport',language)]]</paper-fab-speed-dial-action>-->
                                <!--<paper-fab-speed-dial-action icon="vaadin:stethoscope" on-tap="addFirstContact">[[localize('first_ctc','First contact',language)]]</paper-fab-speed-dial-action>-->
                                <paper-fab-speed-dial-action icon="vaadin:records" on-tap="addOther">
                                    [[localize('oth_for','Other form',language)]]
                                </paper-fab-speed-dial-action>
                                <paper-fab-speed-dial-action icon="editor:attach-file" on-tap="addDocument">
                                    [[localize('add_doc','Add document',language)]]
                                </paper-fab-speed-dial-action>
                                <paper-fab-speed-dial-action icon="vaadin:clipboard-text" on-tap="writeLinkingLetter">
                                    [[localize('linkingLetter','Lettre de liaison',language)]]
                                </paper-fab-speed-dial-action>
                            </div>
                        </div>
                    </template>
                    <div id="prescribeBtnCtnr" on-tap="_displayPrescriptionError">
                        <!--<paper-button id="prescribeBtn" class="prescribe-btn action-btn" on-tap="_prescribe" disabled="[[!_canPrescribe(api.tokenId,patient.ssin,servicesMap.*,currentContact.services.*,_drugsRefresher)]]">-->
                        <paper-button id="prescribeBtn" class="prescribe-btn action-btn" on-tap="_prescribe">
                            <iron-icon icon="vaadin:pills"></iron-icon>
                            <span class="no-mobile">[[localize('pri_pre','Print prescription',language)]]</span>
                        </paper-button>
                    </div>
                    <div id="procedureBtnCtnr">
                        <paper-button id="procedureBtn" class="procedure-btn action-btn" on-tap="_planAction">
                            <iron-icon icon="vaadin:tools"></iron-icon>
                            <span class="no-mobile">[[localize('proc','Procedure',language)]]</span>
                        </paper-button>
                    </div>
                    <div id="invoicingBtnCtnr">
                        <paper-button id="invoicingBtn" class="invoicing-btn ac.detail-panel div.paragraph-contenttion-btn" on-tap="_invoicing">
                            <iron-icon icon="vaadin:invoice"></iron-icon>
                            <span class="no-mobile">[[localize('inv','Invoice',language)]]</span>
                        </paper-button>
                    </div>
                </template>
            </div>
            <div class="floating-action-bar-tooltips mobile-only">
                <paper-tooltip for="newFormBtn" position="top">[[localize('add_for','Add forms',language)]]
                </paper-tooltip>
                <paper-tooltip for="prescribeBtn" position="top">[[localize('pri_pre','Print prescription',language)]]
                </paper-tooltip>
                <paper-tooltip for="procedureBtn" position="top">[[localize('proc','Procedure',language)]]
                </paper-tooltip>
                <paper-tooltip for="invoicingBtn" position="top">[[localize('inv','Invoice',language)]]</paper-tooltip>
            </div>
            <paper-tooltip for="prescribeBtnCtnr" position="top">
                <template is="dom-if" if="[[_canPrescribe(api.tokenId,patient.ssin,servicesMap.*,currentContact,currentContact.services,currentContact.services.*)]]">
                    [[localize('pre_thi_but_to_pre','Press this button to prescribe',language)]]<br></template>
                <template is="dom-if" if="[[!api.tokenId]]">[[localize('you_mus_be_con_to_ehe_to_be_all_to_pre','You
                    must be connected to eHealth to be allowed to prescribe',language)]]<br></template>
                <template is="dom-if" if="[[!_validSsin(patient.ssin)]]">
                    [[localize('the_ni_of_the_pat_is_not_val_or_mis','The niss of the patient is not valid or missing
                    ',language)]]([[patient.ssin]])<br></template>
                <template is="dom-if" if="[[!_hasDrugsToBePrescribed(servicesMap.*,currentContact,currentContact.services,currentContact.services.*)]]">
                    [[localize('add_pre_dru_to_cur_con_to_pre','Add prescription drugs to current contact to
                    prescribe',language)]]
                </template>
            </paper-tooltip>
        </div>

        <entity-selector id="load-template-dialog" i18n="[[i18n]]" language="[[language]]" resources="[[resources]]" columns="[[reportTemplatesSelectorColumns()]]" data-provider="[[reportCustomTemplatesSelectorDataProvider()]]" entity-icon="vaadin:doctor" entity-type="[[localize('template','Template',language)]]" on-entity-selected="_reportTemplateSelected"></entity-selector>
        <entity-selector id="add-form-dialog" i18n="[[i18n]]" language="[[language]]" resources="[[resources]]" columns="[[formTemplatesSelectorColumns()]]" data-provider="[[formTemplatesSelectorDataProvider()]]" on-entity-selected="_addedFormSelected"></entity-selector>

        <paper-dialog id="upload-dialog">
            <h2>[[localize('upl_fil','Upload files',language)]]<span class="extra-info">(PDF, images and videos)</span>
            </h2>
            <!--<paper-fab class="close-button-icon" icon="icons:close" dialog-dismiss></paper-fab>-->
            <vaadin-upload id="vaadin-upload" no-auto="" files="{{files}}" accept="video/*,image/*,application/pdf,text/xml,application/xml,text/plain" target="[[api.host]]/document/{documentId}/attachment/multipart;jsessionid=[[api.sessionId]]" method="PUT" form-data-name="attachment" on-upload-success="_fileUploaded"></vaadin-upload>
            <div class="buttons">
                <paper-button class="modal-button modal-button--cancel" dialog-dismiss="">
                    [[localize('clo','Close',language)]]
                </paper-button>
            </div>
        </paper-dialog>

        <ht-pat-prescription-dialog id="prescriptionDialog" api="[[api]]" user="[[user]]" i18n="[[i18n]]" language="[[language]]" patient="[[patient]]" resources="[[resources]]" current-contact="[[currentContact]]" services-map="[[servicesMap]]" drugs-refresher="[[_drugsRefresher]]" global-hcp="[[globalHcp]]" on-save-document-as-service="[[_handleSaveDocumentAsService]]" on-pdf-report="_handlePdfReport"></ht-pat-prescription-dialog>

        <ht-pat-invoicing-dialog id="invoicingForm" api="[[api]]" user="[[user]]" language="[[language]]" patient="[[patient]]" current-contact="[[currentContact]]" i18n="[[i18n]]" resources="[[resources]]"></ht-pat-invoicing-dialog>

        <paper-dialog id="prose-editor-dialog" no-cancel-on-outside-click="" no-cancel-on-esc-key="">
            <paper-item id="templateSavedIndicator">
                [[localize('saved_template','Template saved',language)]] &nbsp;
                <iron-icon icon="icons:check"></iron-icon>
            </paper-item>
            <h2 class="modal-title">[[localize('new_rep','New report',language)]]</h2>
            <prose-editor id="prose-editor" on-refresh-context="_refreshContext"></prose-editor>

            <paper-dialog id="template-description-dialog" no-cancel-on-outside-click="" no-cancel-on-esc-key="">
                <h2 class="modal-title">[[localize('template_description','Template description',language)]]</h2>
                <paper-input label="[[localize('template_description','Template description',language)]]" autofocus="" value="" id="templateDescription" style="padding:0"></paper-input>
                <div class="fright">
                    <paper-button class="modal-button" dialog-dismiss="">[[localize('can','Cancel',language)]]
                    </paper-button>
                </div>
                <template is="dom-if" if="[[!savedDocTemplateId]]">
                    <paper-button class="modal-button modal-button--save" dialog-confirm="" on-tap="saveTemplate">
                        [[localize('save','Save',language)]]
                    </paper-button>
                </template>
                <template is="dom-if" if="[[savedDocTemplateId]]">
                    <paper-button class="modal-button modal-button--save" dialog-confirm="" on-tap="saveTemplate">
                        [[localize('save_current_version','Save current version',language)]]
                    </paper-button>
                    <paper-button class="modal-button modal-button--save" dialog-confirm="" on-tap="saveTemplate" data-version="new">[[localize('save_new_version','Save new version',language)]]
                    </paper-button>
                </template>
            </paper-dialog>

            <div class="buttons">
                <div class="fleft">
                    <paper-button class="modal-button modal-button--bordered" on-tap="_openTemplateDescriptionDialog">
                        [[localize('sav_temp','Save template',language)]]
                    </paper-button>
                    <paper-button class="modal-button modal-button--bordered" on-tap="loadTemplate">
                        [[localize('load_temp','Load template',language)]]
                    </paper-button>
                    <paper-button class="modal-button modal-button--bordered" on-tap="printDocument">
                        [[localize('print','Print',language)]]
                    </paper-button>
                </div>
                <paper-button class="modal-button modal-button--cancel" dialog-dismiss="">
                    [[localize('can','Cancel',language)]]
                </paper-button>
                <paper-button class="modal-button modal-button--save" dialog-confirm="" autofocus="" on-tap="_saveReport">
                    [[localize('save','Save',language)]]
                </paper-button>
            </div>
        </paper-dialog>

        <paper-dialog id="prose-editor-dialog-linking-letter" no-cancel-on-outside-click="" no-cancel-on-esc-key="">
            <h2 class="modal-title">[[localize('linkingLetter','Lettre de liaison',language)]]</h2>
            <prose-editor id="prose-editor-linking-letter" on-refresh-context="_refreshContextLinkingLetter"></prose-editor>
            <div class="buttons">
                <div class="fleft">
                    <paper-button class="modal-button modal-button--save" on-tap="_printLinkingLetter">
                        <iron-icon icon="icons:print" class="mr5 smallIcon"></iron-icon>
                        [[localize('print','Print',language)]]
                    </paper-button>
                </div>
                <paper-button class="modal-button modal-button--cancel" dialog-dismiss="">
                    <iron-icon icon="icons:close" class="mr5 smallIcon"></iron-icon>
                    [[localize('clo','Close',language)]]
                </paper-button>
                <paper-button class="modal-button modal-button--save" autofocus="" on-tap="_saveLinkingLetter">
                    <iron-icon icon="icons:save" class="mr5 smallIcon"></iron-icon>
                    [[localize('saveToPatFile','Save to patient file',language)]]
                </paper-button>
            </div>
        </paper-dialog>

        <template is="dom-if" if="[[busySpinner]]">
            <div id="busySpinner">
                <div id="busySpinnerContainer">
                    <ht-spinner class="spinner" active=""></ht-spinner>
                </div>
            </div>
        </template>
`;
  }

  static get is() {
      return 'ht-pat-detail-ctc-detail-panel';
  }

  static get properties() {
      return {
          contacts: {
              type: Array,
              value: function () {
                  return [];
              },
              observer: '_servicesFilter'
          },
          allContacts: {
              type: Array,
              value: function () {
                  return [];
              }
          },
          servicesMap: {
              type: Object,
              value: null
          },
          api: {
              type: Object
          },
          list: {
              type: Boolean,
              value: false
          },
          table: {
              type: Boolean,
              value: false
          },
          graphique: {
              type: Boolean,
              value: false
          },
          doc: {
              type: Boolean,
              value: true
          },
          user: {
              type: Object
          },
          patient: {
              type: Object
          },
          currentContact: {
              type: Object,
              value: null
          },
          contactTypeList: {
              type: Array,
              value: function () {
                  return [];
              }
          },
          contactsFormsAndDocuments: {
              type: Array,
              value: function () {
                  return [];
              }
          },
          healthElements: {
              type: Array,
              value: function () {
                  return [];
              }
          },
          showDetailsFiltersPanel: {
              type: Boolean,
              value: false
          },
          detailPanelItems: {
              type: Array,
              value: function () {
                  return [{
                      icon: "icure-svg-icons:laboratory",
                      filter: [{type: 'CD-ITEM', code: ['parameter']}],
                      title: {en: "Lab Results", fr: "Résultats de laboratoire", nl: "Lab Results"},
                      id: "LabResults"
                  },
                      {
                          icon: "icure-svg-icons:prescription",
                          filter: [{type: 'CD-ITEM', code: ['treatment']}],
                          title: {en: "Prescription", fr: "Prescription", nl: "Prescription"},
                          id: "Prescription"
                      },
                      {
                          icon: "icure-svg-icons:blood-sugar",
                          filter: [{type: 'CD-PARAMETER', code: ['bloodsugar']}],
                          title: {en: "BloodSugar", fr: "Analyse de sang", nl: "BloodSugar"},
                          id: "BloodSugar"
                      },
                      {
                          icon: "icure-svg-icons:blood-pressure",
                          filter: [{type: 'CD-PARAMETER', code: ['sbp', 'dbp']}],
                          title: {en: "BloodPressure", fr: "Pression sanguine", nl: "BloodPressure"},
                          id: "BloodPressure"
                      },
                      {
                          icon: "icure-svg-icons:blood-pressure",
                          filter: [{type: 'CD-PARAMETER', code: ['weight', 'height', 'bmi']}],
                          title: {en: "Biometries", fr: "Biométries", nl: "Biometries"},
                          id: "Biometry"
                      }];
              }
          },
          files: {
              type: Array
          },
          showAddFormsContainer: {
              type: Boolean,
              value: false
          },
          _drugsRefresher: {
              type: Number,
              value: 0
          },
          hiddenSubContactsId: {
              type: Object,
              value: {}
          },
          isLoadingDoc: {
              type: Boolean,
              value: false
          },
          globalHcp: {
              type: Object,
              value: null
          },
          documentMetas: {
              type: Object,
              value: null
          },
          selectedFormat: {
              type: String,
              value: 'presc'
          },
          subcontactType: {
              type: Array,
              value: () => []
          },
          savedDocTemplateId: {
              type: String,
              value: ""
          },
          busySpinner: {
              type: Boolean,
              value: false
          },
          ehealthSession: {
              type: Boolean,
              value: false
          },
          fullProfile: {
              type: Boolean,
              value: false
          },
          proseEditorLinkingLetterTemplateAlreadyApplied: {
              type: Boolean,
              value: false
          },
          linkingLetterDataProvider: {
              type: Object
          },
          linkingLetterDpData: {
              type: Object,
              value: {}
          },
          serviceFilters: {
              type: Array,
              value: () => ([])
          },
          filteredServiceIds: {
              type: Array,
              value: () => ([])
          },
          sizePrintSubForm: {
              type: Number,
              value: 0,
              observer: 'sizePrintSubFormChanged'
          }
      };
  }

  static get observers() {
      return ['ifRecipeAvailable(user)', '_filesChanged(files.*)', '_servicesFilter(serviceFilters)', '_allContactsChanged(allContacts.*, currentContact, currentContact._rev)'];
  }

  constructor() {
      super();
  }

  ready() {
      super.ready();
      this.api.hcparty().getHealthcareParty(this.user.healthcarePartyId).then(tempHcp => {
          this.set('globalHcp', tempHcp)
      })
  }

  _servicesFilter() {
      if (!this.contacts) {
          return;
      }

      if (!this.serviceFilters || !this.serviceFilters.length) {
          this.set('filteredServiceIds', []);
          this._contactsChanged()
          return
      }

      const filterCodesByType = {}
      _.flatten(this.serviceFilters).forEach(filter => {
          const codesArray = filterCodesByType[filter.type] || []
          filterCodesByType[filter.type] = codesArray.concat(filter.code)
      })

      this.set('filteredServiceIds', _.flatten(this.contacts.map(contact =>
          (contact.services.filter(service =>
              service.tags.some(tag => filterCodesByType[tag.type] && filterCodesByType[tag.type].includes(tag.code)) &&
              Object.values(this.api.contact().preferredContent(service, this.language) || {}).some(value => value)
          ) || []).map(service =>
              service.id
          )
      )))

      this._contactsChanged()


  }

  ifRecipeAvailable() {
      this.user && this.user.healthcarePartyId && this.api.hcparty().getHealthcareParty(this.user.healthcarePartyId).then(hcp => {
          this.set("ehealthSession", this.api.tokenId ? true : false)
          if (hcp.addresses && hcp.addresses.length > 0) {

              const addresses = hcp && hcp.addresses || null
              const workAddresses = addresses.find(adr => adr.addressType === "work") || null
              const telecoms = workAddresses && workAddresses.telecoms
              const workMobile = telecoms && telecoms.find(tel => tel.telecomType === "mobile" || tel.telecomType === "phone") || null
              const workEmail = telecoms && telecoms.find(tel => tel.telecomType === "email") || null

              this.set('fullProfile', workMobile && workMobile.telecomNumber !== "" && workEmail && workEmail.telecomNumber !== "" ? true : false)
          }
      })

  }

  _activeIconClass(selected) {
      return selected ? 'icn-selected' : ''
  }

  _setPrintSize() {
      localStorage.setItem('prefillFormat', this.selectedFormat)
  }

  _onDrag(e) {
      if (this._hasCurrentContact(this.contacts) && e && e.dataTransfer && e.dataTransfer.items && _.find(e.dataTransfer.items, i => i.kind === 'file')) {
          this.addDocument();
      }
  }

  _myProfile() { // open profile
      this.dispatchEvent(new CustomEvent("open-utility", {
          composed: true,
          bubbles: true,
          detail: {panel: 'my-profile', tab: 1}
      }))
  }

  _importKeychain() { // open keychain importation window
      this.$.prescriptionDialog.close()
      this.dispatchEvent(new CustomEvent("open-utility", {
          composed: true,
          bubbles: true,
          detail: {panel: 'import-keychain'}
      }))
  }

  _toggleAddActions() {
      this.showAddFormsContainer = !this.showAddFormsContainer;
  }

  _refreshFromServices() {
      this.set('_drugsRefresher', this._drugsRefresher + 1)
  }

  _actionIcon(showAddFormsContainer) {
      return showAddFormsContainer ? 'icons:close' : 'icons:add';
  }

  shouldSave() {
      const dynamicallyLoadedForm = this.shadowRoot.querySelector('#dynamicallyLoadedForm');
      return dynamicallyLoadedForm && dynamicallyLoadedForm.shouldSave();
  }

  flushSave() {
      const dynamicallyLoadedForm = this.shadowRoot.querySelector('#dynamicallyLoadedForm');
      return dynamicallyLoadedForm && dynamicallyLoadedForm.flushSave();
  }

  _dateFormat(date) {
      return date ? this.api.moment(date).format('DD/MM/YYYY') : '';
  }

  _documentId(svc) {
      const content = this.api.contact().preferredContent(svc, this.language)
      return content && content.documentId
  }

  _planAction() {
      this.dispatchEvent(new CustomEvent("plan-action", {
          composed: true,
          bubbles: true,
          detail: this.currentContact.services.filter(svc => svc.label === "Actes")[0]
      }))
  }

  _filesChanged() {
      if (!this.currentContact) {
          return;
      }
      const files = _.clone(this.files);
      const vaadinUpload = this.$['vaadin-upload'];

      Promise.all(files.filter(f => !f.attached).map(f => {
          f.attached = true;
          console.log(f)
          return this.api.document().newInstance(this.user, null, {
              documentType: 'result',
              mainUti: this.api.document().uti(f.type, f.name && f.name.replace(/.+\.(.+)/, '$1')),
              name: f.name
          })
              .then(d => this.api.document().createDocument(d))

              .then(createdDocument => {
                  return this.api.crypto()
                      .extractKeysFromDelegationsForHcpHierarchy(
                          this.user.healthcarePartyId,
                          createdDocument.id,
                          _.size(createdDocument.encryptionKeys) ? createdDocument.encryptionKeys : createdDocument.delegations
                      )
                      .then(({extractedKeys: enckeys}) => [createdDocument, enckeys])
              })
              .then(([d, enckeys]) => {
                  f.doc = d;
                  f.uploadTarget = (f.uploadTarget || vaadinUpload.target).replace(/\{documentId\}/, d.id) + "?ts=" + new Date().getTime() + (enckeys ? "&enckeys=" + enckeys : "");
                  return f;
              });
      })).then(files => {
          files.length && vaadinUpload.uploadFiles(files);
      });
  }

  _fileUploaded(e) {
      if (!this.currentContact) {
          return;
      }
      const vaadinUpload = this.$['vaadin-upload'];
      const f = e.detail.file;
      const d = f.doc;

      let sc = this.currentContact.subContacts.find(sbc => (sbc.status || 0) & 64);
      if (!sc) {
          sc = {status: 64, services: []};
          this.currentContact.subContacts.push(sc);
      }
      const svc = this.api.contact().service().newInstance(this.user, {
          content: _.fromPairs([[this.language, {
              documentId: d.id,
              stringValue: f.name
          }]]), label: 'document'
      });
      this.currentContact.services.push(svc);
      sc.services.push({serviceId: svc.id});
      if (!vaadinUpload.files.find(f => !f.complete && !f.error)) {
          this.saveCurrentContact().then(c => this._contactsChanged());
      }
      console.log(vaadinUpload.files)
  }

  _invoicing() {
      this.$.invoicingForm.open()
  }

  _ch4() {
      this.$.ch4Form.open()
  }

  addForm(templateGuid) {
      this.set('showAddFormsContainer', false);
      this.api.hcparty().getCurrentHealthcareParty().then(hcp => this.api.form().getFormTemplatesByGuid(templateGuid, ((hcp.specialityCodes || [])[0] && hcp.specialityCodes[0].code || 'deptgeneralpractice').replace(/persphysician/, 'deptgeneralpractice'))).then(formTemplates => {
          console.log("FTs: " + formTemplates.size + " FTs loaded");
          const activeFormTemplates = formTemplates.filter(f => f.disabled !== "true")
          if (activeFormTemplates[0] && activeFormTemplates[0].id) {
              //Create a new form and link it to the currentContact
              this.api.form().newInstance(this.user, this.patient, {
                  contactId: this.currentContact.id,
                  formTemplateId: activeFormTemplates[0].id,
                  descr: activeFormTemplates[0].name
              }).then(f => this.api.form().createForm(f)).then(f => {
                  this.currentContact.subContacts.push({formId: f.id, services: []});
                  return this.saveCurrentContact();
              }).then(c => this._contactsChanged());
          }
      }).catch(e => console.log("FTs: error " + e));
  }

  addConsultation() {
      this.set('showAddFormsContainer', false);
      const prefForms = this.user.properties.find(p => p.type.identifier === 'org.taktik.icure.preferred.forms');
      if (prefForms && prefForms.typedValue) {
          const formsMap = JSON.parse(prefForms.typedValue.stringValue);
          this.addForm(formsMap['org.taktik.icure.form.standard.consultation']);
      } else {
          this.addForm("FFFFFFFF-FFFF-FFFF-FFFF-CONSULTATION");
      }
  }

  addPrescriptionForm() {
      this.set('showAddFormsContainer', false);
      // TODO: maybe check prefForms before
      this.addForm("FFFFFFFF-FFFF-FFFF-FFFF-PRESCRIPTION");
  }

  addFirstContact() {
      this.set('showAddFormsContainer', false);
      this.addForm("FFFFFFFF-FFFF-FFFF-FFFF-DOSSMED00000");
  }

  addMedicalHistory() {
      this.set('showAddFormsContainer', false);
      const prefForms = this.user.properties.find(p => p.type.identifier === 'org.taktik.icure.preferred.forms');
      if (prefForms && prefForms.typedValue) {
          const formsMap = JSON.parse(prefForms.typedValue.stringValue);
          this.addForm(formsMap['org.taktik.icure.form.standard.medicalhistory']);
      }
  }

  addOther() {
      this.set('showAddFormsContainer', false);
      this.$['add-form-dialog'].open();
  }

  addDocument() {
      this.set('showAddFormsContainer', false);
      const vaadinUpload = this.$['vaadin-upload'];
      vaadinUpload.set('i18n.addFiles.many', this.localize('upl_fil', 'Upload file', this.language))
      vaadinUpload.set('i18n.dropFiles.many', this.localize('uplabel', 'Drop files here...', this.language))
      this.set('files', [])
      this.$['upload-dialog'].open();
  }

  _validSsin(ssin) {
      return ssin && ssin.length > 9;
  }

  _hasDrugsToBePrescribed(ssin) {
      return this._drugsToBePrescribed().length > 0;
  }

  _hasDrugsAlreadyPrescribed(ssin) {
      return this._drugsAlreadyPrescribed().length > 0;
  }

  _canPrescribe(tokenId, ssin) {
      return tokenId && this._validSsin(ssin) && this._hasDrugsToBePrescribed();
  }

  _canReprint(tokenId, ssin) {
      return this._validSsin(ssin) && this._hasDrugsAlreadyPrescribed();
  }

  _drugsToBePrescribed() {

      let tbp = this.api && this.currentContact && this.currentContact.services && this.currentContact.services.filter(s => s.tags && s.tags.find(t => (t.type === 'CD-ITEM' && t.code === 'treatment') || (t.type === 'ICURE' && t.code === 'PRESC')) && !s.endOfLife && !s.tags.find(t => t.type === 'CD-LIFECYCLE' && ['ordered', 'completed', 'delivered'].includes(t.code)) && this.api.contact().medicationValue(s, this.language)) || [];
      return tbp.length > 0 ? tbp : this._drugsAlreadyPrescribed();
  }

  _drugsAlreadyPrescribed() {
      return this.api && this.currentContact && this.currentContact.services && this.currentContact.services.filter(s => s.tags && s.tags.find(t => (t.type === 'CD-ITEM' && t.code === 'treatment') || (t.type === 'ICURE' && t.code === 'PRESC')) && !s.endOfLife && s.tags.find(t => t.type === 'CD-LIFECYCLE' && ['ordered', 'completed', 'delivered'].includes(t.code)) && this.api.contact().medicationValue(s, this.language)) || [];
  }

  _prescribe(e) {
      e.stopPropagation();
      this.$.prescriptionDialog.open();
  }

  _handlePdfReport(e) {
      if (!e.detail) {
          if (e.detail.loading) {
              this.busySpinner = true;
          } else if (e.detail.success) {
              this.saveCurrentContact().then(() => { // event here
                  this._refreshFromServices()
                  this.busySpinner = false;
              })
          }
      }

  }

  hideAll() {
      this.set('list', false);
      this.set('table', false);
      this.set('doc', false);
      this.set('graphique', false);
  }

  _list(e) {
      this.hideAll();
      this.set('list', true);
  }

  _table(e) {
      this.hideAll();
      this.set('table', true);
  }

  _graphique(e) {
      this.hideAll();
      this.set('graphique', true);
  }

  _default(e) {
      this.hideAll();
      this.set('doc', true);

      setTimeout(() => this._setPdfSizes(), 2000)
  }

  _setPdfSizes() {
      if (this.doc) this.root.querySelectorAll('.contact-card-container').forEach(card => { // get contact cards
          card.querySelectorAll('dynamic-doc').forEach(dynas => { // get dynamic-doc
              dynas.root.querySelectorAll('pdf-element').forEach(pdf => pdf.dispatchEvent(new CustomEvent('iron-resize', {detail: {}}))) // force resize
          })
      })
  }

  _displayPrescriptionError() {
      this.$.prescriptionError.classList.add("notification");
      setTimeout(() => this.$.prescriptionError.classList.remove("notification"), 8000);
  }

  isAuth() {
      return (this.patient.ssin && this.api.tokenId)
  }

  saveCurrentContact() {
      return this.flushSave() || (this.currentContact.rev ? this.api.contact().modifyContactWithUser(this.user, this.currentContact) : this.api.contact().createContactWithUser(this.user, this.currentContact)).then(c => this.api.register(c, 'contact')).then(c => (this.currentContact.rev = c.rev) && c);
  }

  forceSaveCtc() {
      this.flushSave()
  }

  _reportTemplateSelected(e, reportTemplate) {
      this.savedDocTemplateId = reportTemplate.id;
      this.$.templateDescription.value = _.trim(_.get(reportTemplate, "descr", _.get(reportTemplate, "name", this.localize('rep', this.language))))

      this.api.doctemplate().getAttachmentText(reportTemplate.id, reportTemplate.attachmentId).then(attach => {
          const prose = this.root.querySelector("#prose-editor")
          prose.setJSONContent(this.api.crypto().utils.ua2utf8(attach))
          this._applyContext(prose, this.editedReportDataProvider)
      })
  }

  confirmSaved(event) {
      setTimeout(() => this.$.templateSavedIndicator.classList.remove("templateSaved"), 4000);
      this.$.templateSavedIndicator.classList.add("templateSaved");
  }

  _addedFormSelected(e, formTemplate) {
      formTemplate && this.addForm(e.detail.guid);
  }

  edit(e, form) {
      if (!this.currentContact.subContacts.find(sc => sc.formId === form.id)) {
          this.push('currentContact.subContacts', {
              formId: form.id,
              services: [],
              healthElementId: form.healthElementId,
              planOfActionId: form.planOfActionId
          });
      }
  }

  _selectedContactsHeaderLabel() {
      if (this.contacts.length > 1) {
          return this.contacts.length.toString() + " " + this.localize("selected_contacts", "contacts sélectionnés", this.language)
      } else {
          if (this.contacts.length === 1) {
              return this._contactHeaderLabel(this.currentContact)
          } else {
              return "no contact selected" // should not happen
          }
      }
  }

  _contactHeaderLabel(ctc) {
      if (ctc) {
          const cod = this._isCurrentContact(ctc) && (this.localize('contact_of_the_day', "contact du jour", this.language) + " : ") || ""
          return cod + this.contactTypeLabel(ctc) + " " + (ctc.descr || "") + " (" + this._dateFormat(ctc.openingDate) + ")"
      } else {
          return ""
      }
  }

  contactTypeLabel(ctc) {
      if (ctc) {
          const tag = ctc.tags && ctc.tags.find(tag => tag.type == "BE-CONTACT-TYPE")
          const code = tag && this.contactTypeList.find(sct => sct.code == tag.code)
          if (code && code.label) {
              return code.label[this.language || "fr"]
          } else {
              console.log("invalid contact type", ctc, code)
              return ""
          }
      } else {
          return ""
      }
  }

  _contactTypeChange(e) {
      if (e.detail) {
          const idx = this.currentContact.tags.indexOf(this.currentContact.tags.find(t => t.type === "BE-CONTACT-TYPE"))
          if (idx != -1) {
              this.currentContact.tags.splice(idx, 1);
          }
          this.currentContact.tags.push(e.detail.type);
          this.notifyPath('currentContact.tags')
          this.saveCurrentContact()
              .then(ctc => this.dispatchEvent(new CustomEvent('contact-saved', {
                  detail: {contact: ctc},
                  bubbles: true
              })))
      }
  }

  formDeleted(e, form) {
      this.saveCurrentContact().then(c => this._contactsChanged());
  }

  _hasCurrentContact() {
      //console.log("_hasCurrentContact: ", this.contacts.find(c => !c.closingDate) && true);
      return this.contacts.find(c => !c.closingDate) && true;
  }

  _isCurrentContact(ctc) {
      return !ctc.closingDate && true;
  }

  _newService(event, detail) {
      if (detail && detail.svc) {
          if (this.servicesMap[detail.svc.label]) {
              this.push(`servicesMap.${detail.svc.label}`, detail);
          } else {
              this.set(`servicesMap.${detail.svc.label}`, [detail]);
          }
      }
  }

  _allContactsChanged() {
      this.set('servicesMap', (this.currentContact && !this.allContacts.find(c => c === this.currentContact) ? this.allContacts.concat(this.currentContact) : this.allContacts).reduce((map, ctc) => {
          const svcMap = ctc.subContacts.reduce((svcMap, subContact) => {
              subContact.services.reduce((svcMap, svcLink) => {
                  ;(svcMap[svcLink.serviceId] || (svcMap[svcLink.serviceId] = [])).push(subContact);
                  return svcMap;
              }, svcMap);
              return svcMap;
          }, {});

          ctc.services.reduce((map, svc) => {
              ;(map[svc.label] || (map[svc.label] = [])).push({
                  svc: svc,
                  scs: svcMap[svc.id] || [],
                  ctc: ctc
              });
              return map;
          }, map);

          Object.values(map).forEach(arr => arr.sort((a, b) => b.svc.modified - a.svc.modified));

          return map;
      }, {}));
  }

  _virtualForm(services) {
      return {
          id: null,
          template: {name: this.localize('service_mod_del', 'Modified or deleted service', this.language)}
      }
  }

  _contactsChanged() {
      this.set('contactsFormsAndDocuments', [])
      if (!this.contacts || (this.serviceFilters && this.serviceFilters.length && !(this.filteredServiceIds && this.filteredServiceIds.length))) {
          return
      }

      this.set('isLoadingDoc', true)

      const seenForms = {}
      const formGroups = this.contacts.reduce((contacts, contact) => {
          const subContacts = contact.subContacts.map(x => x)

          const orphanedServices = contact.services.filter(s => !subContacts.some(sc => sc.services.some(lnk => (lnk.id === s.id))))
          if (orphanedServices.length) {
              subContacts.push({services: orphanedServices.map(s => ({serviceId: s.id}))})
          }
          const forms = ((this.serviceFilters && this.serviceFilters.length ?
              subContacts.filter(sc => !(sc.formId && seenForms[sc.formId]) && sc.services.some(s => this.filteredServiceIds.find(fsId => fsId === s.serviceId))) :
              subContacts.filter(sc => !(sc.formId && seenForms[sc.formId]))) || [])
              .map(sc => {
                  const serviceIds = sc.services.map(s => s.serviceId)
                  return {
                      id: sc.formId,
                      docs: contact.services.filter(s => serviceIds.includes(s.id) && ((this.api.contact().preferredContent(s, this.language) || {}).documentId || []).length)
                  }
              })

          const docIds = _.flatMap(forms, f => f.docs.map(d => d.id))

          const unmappedServices = this.serviceFilters && this.serviceFilters.length ?
              _.sortBy(contact.services.filter(svc => !docIds.includes(svc.id) && !subContacts.some(sc => sc.formId && sc.services.some(ssc => ssc.serviceId === svc.id)) && this.filteredServiceIds.some(fsId => fsId === svc.id)), 'created') :
              _.sortBy(contact.services.filter(svc => !docIds.includes(svc.id) && !subContacts.some(sc => sc.formId && sc.services.some(ssc => ssc.serviceId === svc.id))), 'created')

          if ((forms && forms.length) || (unmappedServices && unmappedServices.length)) {
              contacts.push({
                  ctc: contact,
                  forms: _.sortBy(forms, f => -f.created),
                  unmappedServices
              })
          }

          return contacts

      }, [])

      const climbFormHierarchy = function (formIds, formsCache) {
          return (formIds.length ? this.api.form().getForms({ids: formIds}) : Promise.resolve([])).then(forms => {
              forms.forEach(f => {
                  formsCache[f.id] = f;
              });
              const formIds = _.uniq(_.flatten(formGroups.map(fg => fg.forms.filter(f => f.id).map(f => {
                  const theForm = formsCache[f.id];
                  if (theForm.parent) {
                      f.id = theForm.parent;
                  } else {
                      f.form = formsCache[f.id];
                  }
                  return f;
              }).filter(f => !f.form).map(f => f.id))));

              return formIds.length ? climbFormHierarchy(formIds.filter(id => !formsCache[id]), formsCache) : formsCache;
          });
      }.bind(this);

      climbFormHierarchy(_.chain(formGroups).map(fg => fg.forms.filter(f => f.id).map(f => f.id)).flatten().uniq().value(), {}).then(() => {
          formGroups.forEach(fg => {
              fg.forms = _.chain(fg.forms.reduce((acc, form) => {
                  const slot = acc.find(f => f.id === form.id);
                  if (slot) {
                      _.concat(slot.docs, form.docs);
                  } else {
                      acc.push(form);
                  }
                  return acc;
              }, [])).sortBy(f => -f.created).value()
          });
          this.set('contactsFormsAndDocuments', _.sortBy(formGroups, fg => -fg.ctc.openingDate));
      }).finally(() => {
          console.log('contactsFormsAndDocuments', this.contactsFormsAndDocuments)
          if (!this.contactsFormsAndDocuments.some(c => c.forms && c.forms.some(f => f.form && f.form.formTemplateId))
              && (!this.contactsFormsAndDocuments.some(f => f.ctc && f.ctc.services && f.ctc.services.some(s => _.values(s.content).some(c => c.documentId))))
              && (this.contactsFormsAndDocuments.some(f => f.ctc && f.ctc.services && f.ctc.services.length) || this.contactsFormsAndDocuments.some(f => f.unmappedServices && f.unmappedServices.length))
              && (!this.contactsFormsAndDocuments.some(f => f.ctc === this.currentContact)) && (this.contactsFormsAndDocuments.some(f => f.ctc && f.ctc.services && f.ctc.services.length) || this.contactsFormsAndDocuments.some(f => f.unmappedServices && f.unmappedServices.length))) {
              this._list()
          } else {
              this._default()
          }
          this.set('isLoadingDoc', false)
      });

  }

  toggleDetailsFiltersPanel() {
      this.showDetailsFiltersPanel = !this.showDetailsFiltersPanel;
      this.root.querySelector('#detailsFiltersPanel').classList.toggle('filters-panel--collapsed');
  }

  loadTemplate() {
      this.$['load-template-dialog'].open();
      this.$['load-template-dialog'].filterValue = "  ";
      this.$['load-template-dialog'].refresh();
      window.setTimeout(() => {
          this.$['load-template-dialog'].filterValue = ""
      }, 1000);
  }

  reportTemplatesSelectorColumns() {
      return [{key: 'name', title: this.localize('name', this.language)}, {
          key: 'descr',
          title: this.localize('des', this.language)
      }, {key: 'createdHr', title: this.localize('creation', this.language)}];
  }

  reportCustomTemplatesSelectorDataProvider() {
      return {
          filter: function (filterValue, limit, offset, sortKey, descending) {
              const regExp = _.trim(filterValue) && new RegExp(_.trim(filterValue), "i");

              const all = this.allTemplates || (this.allTemplates = Promise.all([
                  this.api.doctemplate().findDocumentTemplatesByDocumentType('template'),
              ]).then(res => _.chain(res[0]).uniqBy(x => x.id).sortBy(['name', 'descr']).value()))

              return all
                  .then(fts => {
                      _.map(fts, (ft) => {
                          ft.createdHr = moment(ft.created).format('DD/MM/YYYY - HH:mm:ss');
                          return ft
                      })
                      const filtered = fts.filter(ft => ft.mainUti === "prose.template.json" && (!regExp || ft.name && ft.name.match(regExp) || ft.descr && ft.descr.match(regExp) || ft.id && ft.id.match(regExp)));
                      return {
                          totalSize: filtered.length,
                          rows: (descending ? _.reverse(_.sortBy(filtered, sortKey)) : _.sortBy(filtered, sortKey)).slice(0, limit)
                      };
                  });
          }.bind(this)
      };
  }

  reportTemplatesSelectorDataProvider() {
      return {
          filter: function (filterValue, limit, offset, sortKey, descending) {
              const regExp = filterValue && new RegExp(filterValue, "i");

              const all = this.allTemplates || (this.allTemplates = Promise.all([
                  this.api.doctemplate().findDocumentTemplatesBySpeciality('deptgeneralpractice'),
                  this.api.doctemplate().findDocumentTemplates()
              ]).then(res => _.chain(res[0].concat(res[1])).uniqBy(x => x.id).sortBy(['group', 'name']).value()))

              return all
                  .then(fts => {
                      const filtered = fts.filter(ft => !regExp || ft.name && ft.name.match(regExp) || ft.group && ft.group.name && ft.group.name.match(regExp) || ft.guid && ft.guid.match(regExp));
                      return {
                          totalSize: filtered.length,
                          rows: (descending ? _.reverse(_.sortBy(filtered, sortKey)) : _.sortBy(filtered, sortKey)).slice(0, limit)
                      };
                  });
          }.bind(this)
      };
  }

  formTemplatesSelectorColumns() {
      return [{key: 'group.name', title: 'Groupe'}, {key: 'name', title: 'Nom'}, {
          key: 'guid',
          title: 'GUID'
      }];
  }

  formTemplatesSelectorDataProvider() {
      return {
          filter: function (filterValue, limit, offset, sortKey, descending) {
              const regExp = filterValue && new RegExp(filterValue, "i");

              const all = this.allTemplates || (this.allTemplates = Promise.all([
                  this.api.form().findFormTemplates(),
                  this.api.form().findFormTemplatesBySpeciality(((this.api.hcParties[this.user.healthcarePartyId] || {}).specialityCodes || [])[0] || 'deptgeneralpractice')
              ]).then(res => _.chain(res[0].concat(res[1])).uniqBy(x => x.id).sortBy(['group', 'name']).value()))

              return all
                  .then(fts => {
                      const filtered = fts.filter(ft => (!regExp || ft.name && ft.name.match(regExp) || ft.group && ft.group.name && ft.group.name.match(regExp) || ft.guid && ft.guid.match(regExp)) && ft.disabled !== "true");
                      return {
                          totalSize: filtered.length,
                          rows: (descending ? _.reverse(_.sortBy(filtered, sortKey)) : _.sortBy(filtered, sortKey)).slice(0, limit)
                      };
                  });
          }.bind(this)
      };
  }

  refreshIcons() {
      this.root.querySelector("#serviceFilterPanel").refreshIcons();
  }

  dropVarsFromProseJsonContent(proseJsonContent, variablesPath) {
      if (!_.size(variablesPath)) return proseJsonContent;
      _.map(variablesPath, (v) => {
          _.set(proseJsonContent, v + ".content", [])
      })
      return proseJsonContent;
  }

  saveTemplate(e) {

      const prose = this.root.querySelector("#prose-editor");
      const proseJsonContent = prose.editorView.state.doc.toJSON();
      const variablesPath = this.api.findJsonObjectPathByPropNameAndPropValue(proseJsonContent, "type", "variable");
      const proseJsonContentWithoutVars = this.dropVarsFromProseJsonContent(proseJsonContent, variablesPath);

      const reportData = {
          "title": this.localize('rep', this.language) + " " + _.get(_.head(_.filter(_.get(this.contactsFormsAndDocuments, "[0].forms", []), {"id": this.editedReportDataProvider.getId()})), "form.descr", ""),
          "description": _.trim(this.$.templateDescription.value),
          "formId": this.editedReportDataProvider.getId(),
          "totalForms": _.size(_.get(this.contactsFormsAndDocuments, "[0].forms", [])),
          "totalVars": _.size(variablesPath),
          "totalPages": _.size(proseJsonContent.content),
          "created": "" + +new Date(),
      }
      reportData.description = _.get(reportData, "description", _.trim(reportData.title))

      if (!_.trim(this.savedDocTemplateId) || _.get(e, "target.dataset.version", "") === "new") {

          this.api.doctemplate().createDocumentTemplate({
              created: reportData.created,
              documentType: "template",
              mainUti: "prose.template.json",
              name: reportData.title,
              descr: reportData.description || reportData.title
          }).then(createDocTemplate => {
              this.api.doctemplate().setAttachment(createDocTemplate.id, JSON.stringify(proseJsonContentWithoutVars)).then(setAttachment => {
                  this.confirmSaved();
                  this.savedDocTemplateId = _.trim(createDocTemplate.id)
              })
          });

      } else {

          this.api.doctemplate().getDocumentTemplate(this.savedDocTemplateId).then(docTemplateLastDefinition => {
              this.api.doctemplate().updateDocumentTemplate(
                  _.trim(this.savedDocTemplateId), {
                      created: reportData.created,
                      documentType: "template",
                      mainUti: "prose.template.json",
                      name: reportData.title,
                      descr: reportData.description || reportData.title,
                      rev: docTemplateLastDefinition.rev
                  }).then(updateDocTemplate => {
                  this.api.doctemplate().setAttachment(_.trim(this.savedDocTemplateId), JSON.stringify(proseJsonContentWithoutVars)).then(setAttachment => {
                      this.confirmSaved();
                  })
              });
          });

      }

  }

  _refreshContext() {
      const prose = this.root.querySelector("#prose-editor")
      this._applyContext(prose, this.editedReportDataProvider)
  }

  _applyContext(prose, dataProvider) {
      //This fn creates the function that return the subContexts (like the context but corresponding to a subForm)
      const makeSubContexts = (ctx) => ((key) =>
              ctx.dataProvider.getSubForms(key).map(sf => {
                      const subCtx = _.assign({}, ctx, {dataProvider: sf.dataProvider})
                      subCtx.subContexts = makeSubContexts(subCtx)
                      return subCtx
                  }
              )
      )

      const ctx = {
          formatDate: (date) => this.api.moment(date).format('DD/MM/YYYY'),
          patient: this.patient,
          user: this.user,
          hcp: this.globalHcp,
          contact: this.currentContact,
          contacts: this.contacts,
          healthElements: this.healthElements,
          servicesMap: this.servicesMap,
          language: this.language,
          dataProvider: dataProvider
      }
      ctx.subContexts = makeSubContexts(ctx)

      prose.applyContext((expr, ctx) => {
          return new Promise(function (resolve, reject) {
              try {
                  const env = new evaljs.Environment(_.assign(ctx, {resolve, reject}));

                  const gen = (env.gen(expr)())
                  let status = {done: false}
                  while (!status.done) {
                      try {
                          status = gen.next() //Execute lines one by one
                      } catch (e) {
                          reject(e)
                          return
                      }
                  }

                  if (status.value && status.value.asynchronous) {
                      //Wait for internal resolution... it is the responsibility of the js to call resolve
                      // TODO: manage some timeout
                  } else {
                      resolve(status.value)
                  }
              } catch (e) {
                  reject(e)
              }
          })
      }, ctx)
  }

  _refreshContextLinkingLetter(e, eventDetails) {
      if (!_.size(this.linkingLetterDataProvider)) this._getLinkingLetterDataProvider();

      // Something is really wrong here...
      if (!this.linkingLetterDataProvider && !_.size(this.linkingLetterDataProvider)) return

      const prose = this.root.querySelector("#prose-editor-linking-letter")
      this._applyContext(prose, this.linkingLetterDataProvider || {})
  }

  _openTemplateDescriptionDialog() {
      this.$['template-description-dialog'].open();
  }

  newReport(e) {
      this.editedReportDataProvider = e.detail.dataProvider
      this.$['prose-editor-dialog'].open()
      const prose = this.root.querySelector("#prose-editor")

      const globalVars = [{
          type: 'global',
          name: 'Healthcare party',
          nodes: [
              {
                  type: 'paragraph',
                  attrs: {},
                  content: [
                      {type: 'text', marks: [{type: 'strong'}], text: 'Docteur '},
                      {type: 'variable', marks: [{type: 'strong'}], attrs: {expr: 'hcp.firstName'}},
                      {type: 'text', marks: [{type: 'strong'}], text: ' '},
                      {type: 'variable', marks: [{type: 'strong'}], attrs: {expr: 'hcp.lastName'}}
                  ]
              },
              {
                  type: 'paragraph',
                  attrs: {},
                  content: [{type: 'variable', attrs: {expr: 'hcp.addresses[0].street'}}, {
                      type: 'text',
                      marks: [{type: 'strong'}],
                      text: ' '
                  }, {type: 'variable', attrs: {expr: 'hcp.addresses[0].houseNumber'}}]
              },
              {
                  type: 'paragraph',
                  attrs: {},
                  content: [{type: 'variable', attrs: {expr: 'hcp.addresses[0].postalCode'}}, {
                      type: 'text',
                      marks: [{type: 'strong'}],
                      text: ' '
                  }, {type: 'variable', attrs: {expr: 'hcp.addresses[0].city'}}]
              },
              {
                  type: 'paragraph',
                  attrs: {},
                  content: [{type: 'text', text: 'INAMI: '}, {type: 'variable', attrs: {expr: 'hcp.nihii'}}]
              }
          ],
          subVars: [
              {name: 'First name', nodes: [{type: 'variable', attrs: {expr: 'hcp.firstName'}}]},
              {name: 'Last name', nodes: [{type: 'variable', attrs: {expr: 'hcp.lastName'}}]},
              {name: 'Nihii', nodes: [{type: 'variable', attrs: {expr: 'hcp.nihii'}}]}
          ]
      }]
      const patientVars = [{
          type: 'patient',
          name: 'Patient',
          nodes: [
              {
                  type: 'paragraph',
                  attrs: {},
                  content: [
                      {type: 'variable', marks: [{type: 'strong'}], attrs: {expr: 'patient.firstName'}},
                      {type: 'text', marks: [{type: 'strong'}], text: ' '},
                      {type: 'variable', marks: [{type: 'strong'}], attrs: {expr: 'patient.lastName'}},
                      {type: 'text', text: '°'},
                      {
                          type: 'variable',
                          marks: [{type: 'strong'}],
                          attrs: {expr: 'formatDate(patient.dateOfBirth)'}
                      },
                  ]
              },
              {
                  type: 'paragraph',
                  attrs: {},
                  content: [{type: 'variable', attrs: {expr: 'patient.addresses[0].street'}}, {
                      type: 'text',
                      marks: [{type: 'strong'}],
                      text: ' '
                  }, {type: 'variable', attrs: {expr: 'patient.addresses[0].houseNumber'}}]
              },
              {
                  type: 'paragraph',
                  attrs: {},
                  content: [{
                      type: 'variable',
                      attrs: {expr: 'patient.addresses[0].postalCode'}
                  }, {type: 'text', marks: [{type: 'strong'}], text: ' '}, {
                      type: 'variable',
                      attrs: {expr: 'patient.addresses[0].city'}
                  }]
              }
          ],
          subVars: [
              {name: 'First name', nodes: [{type: 'variable', attrs: {expr: 'patient.firstName'}}]},
              {name: 'Last name', nodes: [{type: 'variable', attrs: {expr: 'patient.lastName'}}]},
              {
                  name: 'Date of birth',
                  nodes: [{type: 'variable', attrs: {expr: 'formatDate(patient.dateOfBirth)'}}]
              }

          ]
      }]
      const formVars = _.sortBy(_.map(e.detail.dataProvider.sortedItems().filter(i => i.type !== 'TKAction'), k => {
          return {
              type: 'form',
              name: k.label,
              nodes: [
                  k.isSubForm ?
                      {
                          type: 'template',
                          attrs: {
                              expr: `subContexts("${k.name}")`,
                              template: {
                                  'default': [{
                                      type: 'variable',
                                      attrs: {expr: `dataProvider.form().template.name`}
                                  }]
                              }
                          }
                      } :
                      {type: 'variable', attrs: {expr: `dataProvider.getValue("${k.name}")`}}
              ]
          }
      }), "name")

      prose.set("dynamicVars", globalVars.concat(patientVars).concat(formVars));

      this._refreshContext();
  }

  printSubForm(e) {
      const subFormDataProvider = _.get(e.detail, "dataProvider", false);
      const subFormid = subFormDataProvider && _.trim(subFormDataProvider.getId())
      this.api.form().getForm(subFormid).then(subFormObject => {
          this.api.form().getFormTemplate(_.trim(subFormObject.formTemplateId)).then(subFormTemplateObject => {

              // Todo: continue here and print other subforms. Assign default pdf render template ?
              // Todo: Make sure we have all subFormTemplateObject.guid / works for everyone

              // Hard coded, work incapacity
              if (["FFFFFFFF-FFFF-FFFF-FFFF-INCAPACITY00"].indexOf(subFormTemplateObject.guid) > -1) this.printIncapacityForm(subFormDataProvider, subFormObject, subFormTemplateObject);
              // if( ["FFFFFFFF-FFFF-FFFF-FFFF-INCAPACITY00"].indexOf(subFormTemplateObject.guid) >-1 ) this.printIncapacityForm_v2(subFormDataProvider, subFormObject, subFormTemplateObject);

              // Hard coded, imaging
              if (["0AAC53CF-793F-45D2-ACA9-E0B79E1A1376", "B4F2B274-10FF-4018-BC48-3ED3CADCED57"].indexOf(subFormTemplateObject.guid) > -1) this.printImagingPrescriptionForm_v2(subFormDataProvider, subFormObject, subFormTemplateObject);

              // Hard coded, Kine
              if (["AEFED10A-9A72-4B40-981B-1D79ADB05516"].indexOf(subFormTemplateObject.guid) > -1) this.printKinePrescriptionForm(subFormDataProvider, subFormObject, subFormTemplateObject);

              // Hard coded, Nurse prescription
              if (["64DAB551-B007-4B5C-BD64-F886301F5326"].indexOf(subFormTemplateObject.guid) > -1) this.printNursePrescriptionForm(subFormDataProvider, subFormObject, subFormTemplateObject);

          })
      })
  }

  _getA5PdfHeader() {

      // <link href="https://fonts.googleapis.com/css?family=Open+Sans" rel="stylesheet">

      return `
          <html>
              <head>

                  <style>
                      @page{size:A5;margin:0;padding:0;}
                      html {margin:0;padding:0;box-sizing:border-box;}
                      body {margin: 0; padding: 0; font-family: Arial, Helvetica, sans-serif;box-sizing:border-box; }
                      .page {width:148mm;height:209mm; overflow:hidden; color:#000000; font-size:12px; padding: 4mm; margin:0; box-sizing: border-box; }

                      p {margin-top:0}
                      p.title {font-weight: bold;font-size: 18px;}
                      p.comment {height: 20mm;}

                      .alignCenter {text-align: center;}
                      .alignLeft {text-align: left;}
                      .alignRight {text-align: right;}

                      .bold { font-weight:700 }
                      .italic { font-style: italic }
                      .fs1em { font-size:1em; } .fs11em { font-size:1.1em; } .fs12em { font-size:1.2em; } .fs13em { font-size:1.3em; } .fs14em { font-size:1.4em; } .fs15em { font-size:1.5em; } .fs16em { font-size:1.6em; } .fs17em { font-size:1.7em; } .fs18em { font-size:1.8em; } .fs19em { font-size:1.9em; } .fs2em { font-size:2em; }

                      .mt0 {margin-top: 0px!important;} .mt1 {margin-top: 1px!important;} .mt2 {margin-top: 2px!important;} .mt3 {margin-top: 3px!important;} .mt4 {margin-top: 4px!important;} .mt5 {margin-top: 5px!important;} .mt10 {margin-top: 10px!important;} .mt15 {margin-top: 15px!important;} .mt20 {margin-top: 20px!important;}
                      .mr0 {margin-right: 0px!important;} .mr1 {margin-right: 1px!important;} .mr2 {margin-right: 2px!important;} .mr3 {margin-right: 3px!important;} .mr4 {margin-right: 4px!important;} .mr5 {margin-right: 5px!important;} .mr10 {margin-right: 10px!important;} .mr15 {margin-right: 15px!important;} .mr20 {margin-right: 20px!important;}
                      .mb0 {margin-bottom: 0px!important;} .mb1 {margin-bottom: 1px!important;} .mb2 {margin-bottom: 2px!important;} .mb3 {margin-bottom: 3px!important;} .mb4 {margin-bottom: 4px!important;} .mb5 {margin-bottom: 5px!important;} .mb10 {margin-bottom: 10px!important;} .mb15 {margin-bottom: 15px!important;} .mb20 {margin-bottom: 20px!important;}
                      .ml0 {margin-left: 0px!important;} .ml1 {margin-left: 1px!important;} .ml2 {margin-left: 2px!important;} .ml3 {margin-left: 3px!important;} .ml4 {margin-left: 4px!important;} .ml5 {margin-left: 5px!important;} .ml10 {margin-left: 10px!important;} .ml15 {margin-left: 15px!important;} .ml20 {margin-left: 20px!important;}

                      .pt0 {padding-top: 0px!important;} .pt1 {padding-top: 1px!important;} .pt2 {padding-top: 2px!important;} .pt3 {padding-top: 3px!important;} .pt4 {padding-top: 4px!important;} .pt5 {padding-top: 5px!important;} .pt10 {padding-top: 10px!important;} .pt15 {padding-top: 15px!important;} .pt20 {padding-top: 20px!important;}
                      .pr0 {padding-right: 0px!important;} .pr1 {padding-right: 1px!important;} .pr2 {padding-right: 2px!important;} .pr3 {padding-right: 3px!important;} .pr4 {padding-right: 4px!important;} .pr5 {padding-right: 5px!important;} .pr10 {padding-right: 10px!important;} .pr15 {padding-right: 15px!important;} .pr20 {padding-right: 20px!important;}
                      .pb0 {padding-bottom: 0px!important;} .pb1 {padding-bottom: 1px!important;} .pb2 {padding-bottom: 2px!important;} .pb3 {padding-bottom: 3px!important;} .pb4 {padding-bottom: 4px!important;} .pb5 {padding-bottom: 5px!important;} .pb10 {padding-bottom: 10px!important;} .pb15 {padding-bottom: 15px!important;} .pb20 {padding-bottom: 20px!important;}
                      .pl0 {padding-left: 0px!important;} .pl1 {padding-left: 1px!important;} .pl2 {padding-left: 2px!important;} .pl3 {padding-left: 3px!important;} .pl4 {padding-left: 4px!important;} .pl5 {padding-left: 5px!important;} .pl10 {padding-left: 10px!important;} .pl15 {padding-left: 15px!important;} .pl20 {padding-left: 20px!important;}

                      .doctorDetails { padding-left:15px; padding-right:15px; border:1px solid #000000;}

                  </style>
                  </head>
                  <body>
      `
  }

  _getDLPdfHeader() {

      // <link href="https://fonts.googleapis.com/css?family=Open+Sans" rel="stylesheet">

      return `
          <html>
              <head>

                  <style>
                      html {margin:0;padding:0;box-sizing:border-box;}
                      body {margin: 0; padding: 0; font-family: Arial, Helvetica, sans-serif;box-sizing:border-box; }
                      .page {width: 90%;height:90%; overflow:hidden; color:#000000; font-size:12px; padding: 4mm; margin:5%; box-sizing: border-box; }

                      p {margin-top:0}
                      p.title {font-weight: bold;font-size: 18px;}
                      p.comment {height: 20mm;}

                      .alignCenter {text-align: center;}
                      .alignLeft {text-align: left;}
                      .alignRight {text-align: right;}

                      .bold { font-weight:700 }
                      .italic { font-style: italic }
                      .fs1em { font-size:1em; } .fs11em { font-size:1.1em; } .fs12em { font-size:1.2em; } .fs13em { font-size:1.3em; } .fs14em { font-size:1.4em; } .fs15em { font-size:1.5em; } .fs16em { font-size:1.6em; } .fs17em { font-size:1.7em; } .fs18em { font-size:1.8em; } .fs19em { font-size:1.9em; } .fs2em { font-size:2em; }

                      .mt0 {margin-top: 0px!important;} .mt1 {margin-top: 1px!important;} .mt2 {margin-top: 2px!important;} .mt3 {margin-top: 3px!important;} .mt4 {margin-top: 4px!important;} .mt5 {margin-top: 5px!important;} .mt10 {margin-top: 10px!important;} .mt15 {margin-top: 15px!important;} .mt20 {margin-top: 20px!important;}
                      .mr0 {margin-right: 0px!important;} .mr1 {margin-right: 1px!important;} .mr2 {margin-right: 2px!important;} .mr3 {margin-right: 3px!important;} .mr4 {margin-right: 4px!important;} .mr5 {margin-right: 5px!important;} .mr10 {margin-right: 10px!important;} .mr15 {margin-right: 15px!important;} .mr20 {margin-right: 20px!important;}
                      .mb0 {margin-bottom: 0px!important;} .mb1 {margin-bottom: 1px!important;} .mb2 {margin-bottom: 2px!important;} .mb3 {margin-bottom: 3px!important;} .mb4 {margin-bottom: 4px!important;} .mb5 {margin-bottom: 5px!important;} .mb10 {margin-bottom: 10px!important;} .mb15 {margin-bottom: 15px!important;} .mb20 {margin-bottom: 20px!important;}
                      .ml0 {margin-left: 0px!important;} .ml1 {margin-left: 1px!important;} .ml2 {margin-left: 2px!important;} .ml3 {margin-left: 3px!important;} .ml4 {margin-left: 4px!important;} .ml5 {margin-left: 5px!important;} .ml10 {margin-left: 10px!important;} .ml15 {margin-left: 15px!important;} .ml20 {margin-left: 20px!important;}

                      .pt0 {padding-top: 0px!important;} .pt1 {padding-top: 1px!important;} .pt2 {padding-top: 2px!important;} .pt3 {padding-top: 3px!important;} .pt4 {padding-top: 4px!important;} .pt5 {padding-top: 5px!important;} .pt10 {padding-top: 10px!important;} .pt15 {padding-top: 15px!important;} .pt20 {padding-top: 20px!important;}
                      .pr0 {padding-right: 0px!important;} .pr1 {padding-right: 1px!important;} .pr2 {padding-right: 2px!important;} .pr3 {padding-right: 3px!important;} .pr4 {padding-right: 4px!important;} .pr5 {padding-right: 5px!important;} .pr10 {padding-right: 10px!important;} .pr15 {padding-right: 15px!important;} .pr20 {padding-right: 20px!important;}
                      .pb0 {padding-bottom: 0px!important;} .pb1 {padding-bottom: 1px!important;} .pb2 {padding-bottom: 2px!important;} .pb3 {padding-bottom: 3px!important;} .pb4 {padding-bottom: 4px!important;} .pb5 {padding-bottom: 5px!important;} .pb10 {padding-bottom: 10px!important;} .pb15 {padding-bottom: 15px!important;} .pb20 {padding-bottom: 20px!important;}
                      .pl0 {padding-left: 0px!important;} .pl1 {padding-left: 1px!important;} .pl2 {padding-left: 2px!important;} .pl3 {padding-left: 3px!important;} .pl4 {padding-left: 4px!important;} .pl5 {padding-left: 5px!important;} .pl10 {padding-left: 10px!important;} .pl15 {padding-left: 15px!important;} .pl20 {padding-left: 20px!important;}

                      .doctorDetails { padding-left:15px; padding-right:15px; border:1px solid #000000;}

                  </style>
                  </head>
                  <body>
      `
  }

  _saveReport() {

      this.busySpinner = true;

      let resourcesObject = {}
      const prose = this.root.querySelector("#prose-editor");
      const proseJsonContent = prose.editorView.state.doc.toJSON();
      const proseHtmlContent = prose.$.container.innerHTML;
      const variablesPath = this.api.findJsonObjectPathByPropNameAndPropValue(proseJsonContent, "type", "variable");
      const reportData = {
          "title": this.localize('rep', this.language) + " " + _.get(_.head(_.filter(_.get(this.contactsFormsAndDocuments, "[0].forms", []), {"id": this.editedReportDataProvider.getId()})), "form.descr", ""),
          "description": _.trim(this.$.templateDescription.value),
          "formId": this.editedReportDataProvider.getId(),
          "totalForms": _.size(_.get(this.contactsFormsAndDocuments, "[0].forms", [])),
          "totalVars": _.size(variablesPath),
          "totalPages": _.size(proseJsonContent.content),
          "created": "" + +new Date(),
      }
      reportData.description = _.get(reportData, "description", _.trim(reportData.title))

      this.api.message().newInstanceWithPatient(this.user, this.patient)
          .then(newMessageInstance => _.assign({newMessageInstance: newMessageInstance}, resourcesObject))
          .then(resourcesObject => this.api.message().createMessage(
              _.merge(
                  resourcesObject.newMessageInstance,
                  {
                      transportGuid: "DOC:REPORT:ARCHIVE",
                      recipients: [_.get(this.user, 'healthcarePartyId', _.trim(this.user.id))],
                      metas: reportData,
                      toAddresses: [_.get(this.user, 'email', _.get(this.user, 'healthcarePartyId', _.trim(this.user.id)))],
                      subject: reportData.title + " " + reportData.description
                  }
              )
          ).then(createMessageResponse => _.assign({createMessageResponse: createMessageResponse}, resourcesObject)))
          .then(resourcesObject => this.api.document().newInstance(
              this.user, resourcesObject.createMessageResponse,
              {
                  documentType: 'report',
                  mainUti: this.api.document().uti("application/pdf"),
                  name: reportData.title + " " + reportData.description
              }
              ).then(newDocumentInstance => _.assign({newDocumentInstance: newDocumentInstance}, resourcesObject))
          )
          .then(resourcesObject => this.api.document().createDocument(resourcesObject.newDocumentInstance).then(createDocumentResponse => _.assign({createDocumentResponse: createDocumentResponse}, resourcesObject)))
          .then(resourcesObject => this.api.pdfReport(this._getProsePdfHeader() + this.api.rewriteTableColumnsWidth(proseHtmlContent) + this._getPdfFooter()).then(pdfFileContent => _.assign({pdfFileContent: pdfFileContent}, resourcesObject)))
          .then(resourcesObject => this.api.encryptDecryptFileContentByUserHcpIdAndDocumentObject("encrypt", this.user, resourcesObject.createDocumentResponse, resourcesObject.pdfFileContent).then(encryptedFileContent => _.assign({encryptedFileContent: encryptedFileContent}, resourcesObject)))
          .then(resourcesObject => this.api.document().setAttachment(resourcesObject.createDocumentResponse.id, null, resourcesObject.encryptedFileContent).then(setAttachmentResponse => _.assign({setAttachmentResponse: setAttachmentResponse}, resourcesObject)))
          .then(resourcesObject => this._saveDocumentAsService({
              documentId: _.trim(_.get(resourcesObject, "createDocumentResponse.id", "")),
              stringValue: _.trim(reportData.title) + " " + _.trim(reportData.description),
              formId: reportData.formId,
              contactId: _.trim(this.currentContact.id)
          }))
          .catch((e) => {
              console.log(e)
          })
          .finally(() => {
              this.busySpinner = false;
              this._closeReportMenu();
              this.confirmSaved();
          })

  }

  _handleSaveDocumentAsService(e) {
      if (e.detail) {
          this._saveDocumentAsService(e.detail)
      }
  }

  _saveDocumentAsService(inputConfig) {

      const svc = this.api.contact().service().newInstance(
          this.user,
          {
              content: _.fromPairs([[this.language, {
                  documentId: inputConfig.documentId,
                  stringValue: inputConfig.stringValue
              }]]),
              label: 'document',
              formId: inputConfig.formId,
              contactId: inputConfig.contactId
          }
      )

      let newServiceData = {
          ctc: this.currentContact,
          svc: svc,
          scs: this.currentContact.subContacts.filter(sc => sc.formId === inputConfig.formId)
      }

      if (Array.isArray(_.get(newServiceData, "scs.services", false))) {
          newServiceData.scs.services.push({serviceId: svc.id});
      } else {
          newServiceData.scs["services"] = [{serviceId: svc.id}];
      }

      this._newService({}, newServiceData)

      this.currentContact.services.push(svc);

      this.saveCurrentContact().then(() => this._contactsChanged());

  }

  _getProsePdfHeader(additionalCssStyles = "") {

      return `<html>
                          <head>
                              <style>

                                  body {margin: 0;}
                                  @page {size: A4; margin: 0; }

                                  :host {
                                      background:#ffffff;
                                      height: 100%;
                                      width: 100%;
                                      font-family: 'Roboto', sans-serif;
                                      font-size: 11px;
                                      min-height: 100vw;

                                  }

                                  .container {
                                      left: 50%;
                                      transform: translateX(-50%);
                                      position: absolute;
                                  }

                                  .page {
                                      padding: 40px;
                                      outline: 0;
                                      background: #ffffff;
                                      font-family: 'Roboto', sans-serif;
                                      font-size: 14px;
                                      line-height: 2em;
                                      width: 210mm;
                                      height: calc(297mm - 40px);
                                      overflow:hidden;
                                  }

                                  h1 { font-size: 1.8em; font-weight: bold; }
                                  h2 { font-size: 1.5em; font-weight: bold; }
                                  h3 { font-size: 1.3em; font-weight: bold; }
                                  h4 { font-size: 1em; font-weight: bold; text-decoration: underline; }
                                  h5 { font-size: 1em; text-decoration: underline; }

                                  .ProseMirror {
                                      outline: 0;
                                      position: relative;
                                      word-wrap: break-word;
                                      white-space: pre-wrap;
                                      -webkit-font-variant-ligatures: none;
                                      font-variant-ligatures: none;
                                  }

                                  .ProseMirror pre { white-space: pre-wrap; }
                                  .ProseMirror li { position: relative; }
                                  .ProseMirror .tableWrapper { overflow-x: auto; }

                                  .ProseMirror table {
                                      border-collapse: collapse;
                                      table-layout: fixed;
                                      width: 100%;
                                      overflow: hidden;
                                      margin: 0;
                                      font-size: 11px;
                                  }

                                  .ProseMirror td, .ProseMirror th {
                                      vertical-align: top;
                                      box-sizing: border-box;
                                      position: relative;
                                      font-size: 11px;
                                  }

                                  /* Give selected cells a blue overlay */
                                  .ProseMirror .selectedCell:after {
                                      z-index: 2;
                                      position: absolute;
                                      content: "";
                                      left: 0; right: 0; top: 0; bottom: 0;
                                      background: rgba(200, 200, 255, 0.4);
                                      pointer-events: none;
                                  }

                                  .ProseMirror th, .ProseMirror td {
                                      min-width: 1em;
                                      border: 1px solid #ddd;
                                      padding: 3px 5px;
                                      font-size: 11px;
                                  }

                                  .ProseMirror-hideselection *::selection { background: transparent; }
                                  .ProseMirror-hideselection *::-moz-selection { background: transparent; }
                                  .ProseMirror-hideselection { caret-color: transparent; }
                                  .ProseMirror-selectednode { outline: 2px solid #8cf; }
                                  li.ProseMirror-selectednode { outline: none; }

                                  li.ProseMirror-selectednode:after {
                                      content: "";
                                      position: absolute;
                                      left: -32px;
                                      right: -2px;
                                      top: -2px;
                                      bottom: -2px;
                                      border: 2px solid #8cf;
                                      pointer-events: none;
                                  }

                                  .divider{
                                      display: block;
                                      border-left: 1px solid #e0e0e0;
                                      height: 100%;
                                      margin: 0 4px;
                                      padding: 0;
                                  }

                                  .ProseMirror table { margin: 0; }
                                  .ProseMirror th, .ProseMirror td {
                                      min-width: 1em;
                                      border: 1px solid #ddd;
                                      padding: 15px 10px;
                                  }
                                  .ProseMirror .tableWrapper { margin: 1em 0; }

                                  ` + _.trim(additionalCssStyles) + `

                              </style>
                              </head>
                              <body>`
  }

  _getPdfFooter() {
      return "</body></html>";
  }

  _closeReportMenu() {
      try {
          this.shadowRoot.querySelector('#dynamicallyLoadedForm').shadowRoot.querySelector('#dynamic-form').reportsListDisplayed = false
      } catch (e) {
      }
  }

  printDocument() {
      this.busySpinner = true;
      const prose = this.root.querySelector("#prose-editor");
      const proseHtmlContent = prose.$.container.innerHTML;
      this.api.pdfReport(this._getProsePdfHeader() + this.api.rewriteTableColumnsWidth(proseHtmlContent) + this._getPdfFooter()).then(({pdf: pdfFileContent, printed: printed}) =>
          !printed && this.api.triggerFileDownload(pdfFileContent, "application/pdf", this.localize('rep', this.language) + '-' + this.user.healthcarePartyId + "-" + +new Date())
      ).finally(() => {
          this.busySpinner = false
          this.$['prose-editor-dialog'].close()
          this._closeReportMenu();
      });
  }

  printIncapacityForm(subFormDataProvider, subFormObject, subFormTemplateObject) {
      this.busySpinner = true;

      const patientName = _.compact([
          (_.trim(_.get(this.patient, "gender", "")) ? _.trim(this.localize("abrv_" + _.trim(_.get(this.patient, "gender", ""), this.language))) ? _.trim(this.localize("abrv_" + _.trim(_.get(this.patient, "gender", ""), this.language))) : "" : ""),
          _.get(this.patient, "lastName", ""),
          _.get(this.patient, "firstName", "")
      ]).join(" ");

      const downloadFileName = _.kebabCase(_.compact([this.localize("certificate_stop_activity", this.language), patientName, +new Date()]).join(" ")) + ".pdf"
      const hcpAddress = _.chain(this.globalHcp.addresses).filter({"addressType": "work"}).head().value()

      const subFormServiceNameAndValues = _.compact(
          _.map(
              (subFormDataProvider && subFormDataProvider.servicesMap ? subFormDataProvider.servicesMap : []), (v, k) => {
                  return _.size(v) && {
                      name: k,
                      value: subFormDataProvider.getValue(k),
                      valueObject: _.get(v, "[0][0].svc.content." + this.language, "") ? _.get(v, "[0][0].svc.content." + this.language, "") : _.get(v, "[0][0].svc.content." + "fr", "")
                  }
              }
          )
      ) || []

      const incapacityStart = _.trim(_.get(_.head(_.filter(subFormServiceNameAndValues, {name: "du"})), "valueObject.fuzzyDateValue", "")) + ""
      const incapacityEnd = _.trim(_.get(_.head(_.filter(subFormServiceNameAndValues, {name: "au"})), "valueObject.fuzzyDateValue", "")) + ""
      let incapacityDuration = incapacityStart && incapacityEnd ? this.api.moment(incapacityEnd).diff(this.api.moment(incapacityStart), "days") : "-"
      const incapacityPartiallyFinished = _.trim(_.get(_.head(_.filter(subFormServiceNameAndValues, {name: "reprise d'activité partielle"})), "valueObject.fuzzyDateValue", "")) + ""
      const incapacityCompletelyFinished = _.trim(_.get(_.head(_.filter(subFormServiceNameAndValues, {name: "totale"})), "valueObject.fuzzyDateValue", "")) + ""
      const includedExcludedLabel = _.get(_.head(_.filter(subFormServiceNameAndValues, {name: "inclus/exclus"})), "value", this.localize("included", this.language)) !== "null" ? _.get(_.head(_.filter(subFormServiceNameAndValues, {name: "inclus/exclus"})), "value", this.localize("included", this.language)) : this.localize("included", this.language)
      const doctorComment = _.trim(_.get(_.head(_.filter(subFormServiceNameAndValues, {name: "Commentaire"})), "value", ""))
      const precentageValue = _.get(_.head(_.filter(subFormServiceNameAndValues, {name: "pourcentage"})), "valueObject.measureValue.value", "100");
      const precentageUnit = _.trim(_.get(_.head(_.filter(subFormServiceNameAndValues, {name: "pourcentage"})), "valueObject.measureValue.unit", "%")) ? _.trim(_.get(_.head(_.filter(subFormServiceNameAndValues, {name: "pourcentage"})), "valueObject.measureValue.unit", "%")) : "%";
      const precentageValueAndUnit = precentageValue + " " + precentageUnit
      const prolong = _.get(_.head(_.filter(subFormServiceNameAndValues, {name: "extension"})), "valueObject.booleanValue", false)

      this.documentMetas = {
          title: _.trim(this.localize("certificate_stop_activity", this.language)),
          formId: _.trim(_.get(subFormObject, "id", "")),
          created: "" + +new Date(),
          patientId: _.trim(_.get(this.patient, "id", "")),
          patientName: _.trim(patientName),
      }


      this.api.code().findCodes("be", "CD-INCAPACITY").then(incapacityCodes => {
          return {incapacityCodes: incapacityCodes}
      })
          .then(resourcesObject => this.api.code().findCodes("be", "CD-INCAPACITYREASON").then(incapacityReasons => _.assign({incapacityReasons: incapacityReasons}, resourcesObject)))
          .then(resourcesObject => {

              let incapacityValue = _.trim(_.get(_.head(_.filter(subFormServiceNameAndValues, {name: "incapacité de"})), "value", "")).toLowerCase() === "ok" ? "" : _.trim(_.get(_.head(_.filter(subFormServiceNameAndValues, {name: "incapacité de"})), "value", ""));
              let incapacityReason = _.trim(_.get(_.head(_.filter(subFormServiceNameAndValues, {name: "pour cause de"})), "value", "")).toLowerCase() === "ok" ? "" : _.trim(_.get(_.head(_.filter(subFormServiceNameAndValues, {name: "pour cause de"})), "value", ""));

              if (_.trim(incapacityValue)) incapacityValue = _.trim(_.get(_.head(_.filter(resourcesObject.incapacityCodes, {id: incapacityValue})), "label." + this.language, incapacityValue)) || _.trim(_.get(_.head(_.filter(resourcesObject.incapacityCodes, {id: incapacityValue})), "label.fr", incapacityValue))
              if (_.trim(incapacityReason)) incapacityReason = _.trim(_.get(_.head(_.filter(resourcesObject.incapacityReasons, {id: incapacityReason})), "label." + this.language, incapacityReason)) || _.trim(_.get(_.head(_.filter(resourcesObject.incapacityReasons, {id: incapacityReason})), "label.fr", incapacityReason)) || _.trim(_.get(_.head(_.filter(subFormServiceNameAndValues, {name: "autres"})), "value", incapacityReason))

              if (includedExcludedLabel.toLowerCase() === "inclus" || includedExcludedLabel.toLowerCase() === "included" || includedExcludedLabel.toLowerCase() === "inbegrepen") incapacityDuration = parseInt(incapacityDuration) ? incapacityDuration + 1 : 1;

              const pdfContent = `
              <div class="page">
                  <p class="title">${this.localize("certificate_stop_activity", this.language)}</p>
                  <p>` + this.localize("date", this.language) + `: ` + moment().format('DD/MM/YYYY') + `</p>
                  <p class="italic">` + this.localize("csa_txt001", this.language) + `:</p>
                  <p class="bold fs15em mt15 mb20">` + patientName + `</p>
                  <p><span class="italic">` + this.localize("csa_txt002", this.language) + `:</span><br />` + incapacityValue + `</p>
                  <p><span class="italic">` + this.localize("csa_txt003", this.language) + `:</span><br />` + incapacityReason + (!prolong ? "" : this.localize("csa_txt011", this.language)) + `</p>
                  <p>
                      <span class="italic">` + this.localize("csa_txt004", this.language) + `:</span> ` + incapacityDuration + ` ` + this.localize("days", this.language) + `<br />
                      ` +
                  this.localize("from2", this.language) + ` ` +
                  (incapacityStart ? this.api.moment(incapacityStart).format("DD/MM/YYYY") : "-") + ` ` +
                  this.localize("till", this.language) + ` ` +
                  (incapacityEnd ? this.api.moment(incapacityEnd).format("DD/MM/YYYY") : "-") + ` ` +
                  includedExcludedLabel + `
                  </p>
                  <p><span class="italic">` + this.localize("csa_txt005", this.language) + `:</span> ` + _.get(_.head(_.filter(subFormServiceNameAndValues, {name: "Sortie"})), "value", "-") + `</p>
                  <p>` +
                  `<span class="italic">` + this.localize("csa_txt006", this.language) + `:</span> ` +
                  (incapacityPartiallyFinished ? this.api.moment(incapacityPartiallyFinished).format("DD/MM/YYYY") : "-") + ` ` +
                  this.localize("csa_txt007", this.language) + ` ` + precentageValueAndUnit + `
                          ` + (incapacityCompletelyFinished ? "<br /><span class='italic'>" + this.localize("csa_txt010", this.language) + ":</span> " + this.api.moment(incapacityCompletelyFinished).format("DD/MM/YYYY") : "") + `
                  </p>` +
                  (doctorComment ? `<p class="comment"><span class="italic">${doctorComment}</span></p>` : "") +
                  `<p class="mb5">${this.localize("csa_txt008", this.language)}</p>
                  <div class="doctorDetails ml5 mr5">
                      <p class="mb3 mt5">` + this.localize("csa_txt009", this.language) + ` ` + _.trim(_.get(this.globalHcp, "lastName", "")).toUpperCase() + ` ` + _.trim(_.get(this.globalHcp, "firstName", "")) + `</p>
                      <p class="mb3">` + _.trim(_.get(hcpAddress, "street", "")) + `` + (_.trim(_.get(hcpAddress, "houseNumber", "")) ? ", " + _.trim(_.get(hcpAddress, "houseNumber", "")) : "") + `` + (_.trim(_.get(hcpAddress, "postboxNumber", "")) ? "/" + _.trim(_.get(hcpAddress, "postboxNumber", "")) : "") + `</p>
                      <p class="mb3">` + _.trim(_.get(hcpAddress, "postalCode", "")) + ` ` + _.trim(_.get(hcpAddress, "city", "")) + `</p>
                      <p class="mb5">` + this.localize("inami", this.language) + `: ` + this.api.formatInamiNumber(_.trim(_.get(this.globalHcp, "nihii", ""))) + `</p>
                  </div>
              </div>
          ` +
                  '<' + 'script' + '>' + 'document.fonts.ready.then(() => { setInterval(() => {document.body.dispatchEvent(new CustomEvent("pdfDoneRenderingEvent"))}, 500); }); <' + '/script' + '>'

              return _.assign({pdfContent: pdfContent}, resourcesObject)

          })
          .then(resourcesObject => this.api.pdfReport(this._getDLPdfHeader() + _.trim(resourcesObject.pdfContent) + this._getPdfFooter(), {
              type: "recipe",
              completionEvent: "pdfDoneRenderingEvent",
              option: 'a5',
              paperWidth: 148,
              paperHeight: 210,
              marginLeft: 0,
              marginRight: 0,
              marginTop: 0,
              marginBottom: 0
          }).then(({pdf: pdfFileContent, printed: printed}) => _.assign({
              pdfFileContent: pdfFileContent,
              printed: printed
          }, resourcesObject)))
          .then(resourcesObject => this.api.message().newInstanceWithPatient(this.user, this.patient)
              .then(newMessageInstance => _.assign({newMessageInstance: newMessageInstance}, resourcesObject))
              .then(resourcesObject => this.api.message().createMessage(
                  _.merge(
                      resourcesObject.newMessageInstance,
                      {
                          transportGuid: "PRESCRIPTION:ITT:ARCHIVE",
                          recipients: [_.get(this.user, 'healthcarePartyId', _.trim(this.user.id))],
                          metas: this.documentMetas,
                          toAddresses: [_.get(this.user, 'email', _.get(this.user, 'healthcarePartyId', _.trim(this.user.id)))],
                          subject: this.documentMetas.title
                      }
                  )
                  ).then(createMessageResponse => _.assign({createMessageResponse: createMessageResponse}, resourcesObject))
              )
          )
          .then(resourcesObject => this.api.document().newInstance(
              this.user, resourcesObject.createMessageResponse,
              {
                  documentType: 'report',
                  mainUti: this.api.document().uti("application/pdf"),
                  name: this.documentMetas.title + " - " + this.documentMetas.patientName
              }
              ).then(newDocumentInstance => _.assign({newDocumentInstance: newDocumentInstance}, resourcesObject))
          )
          .then(resourcesObject => this.api.document().createDocument(resourcesObject.newDocumentInstance).then(createDocumentResponse => _.assign({createDocumentResponse: createDocumentResponse}, resourcesObject)))
          .then(resourcesObject => this.api.encryptDecryptFileContentByUserHcpIdAndDocumentObject("encrypt", this.user, resourcesObject.createDocumentResponse, resourcesObject.pdfFileContent).then(encryptedFileContent => _.assign({encryptedFileContent: encryptedFileContent}, resourcesObject)))
          .then(resourcesObject => this.api.document().setAttachment(resourcesObject.createDocumentResponse.id, null, resourcesObject.encryptedFileContent).then(setAttachmentResponse => _.assign({setAttachmentResponse: setAttachmentResponse}, resourcesObject)))
          .then(resourcesObject => {
              this._saveDocumentAsService({
                  documentId: _.trim(_.get(resourcesObject, "createDocumentResponse.id", "")),
                  stringValue: this.documentMetas.title,
                  formId: this.documentMetas.formId,
                  contactId: _.trim(this.currentContact.id)
              })
              return resourcesObject
          })
          .then(resourcesObject => !resourcesObject.printed && this.api.triggerFileDownload(resourcesObject.pdfFileContent, "application/pdf", downloadFileName))
          .catch(e => {
              console.log(e)
          })
          .finally(() => {
              this.busySpinner = false;
              this._closeReportMenu();
          })

  }

  printIncapacityForm_v2(subFormDataProvider, subFormObject, subFormTemplateObject) {

      this.busySpinner = true;

      const subFormFieldsAndValues = _.map(_.get(subFormTemplateObject, "layout.sections[0].formColumns[0].formDataList", {}), (v) => {
          return {
              name: _.trim(_.get(v, "name")),
              label: _.trim(_.get(v, "label")),
              type: _.trim(_.get(v, "type")),
              value:
                  v.type === "TKString" ? _.trim(subFormDataProvider.getStringValue(_.trim(_.get(v, "name", "")))) :
                      v.type === "TKNumber" ? subFormDataProvider.getNumberValue(_.trim(_.get(v, "name", ""))) :
                          v.type === "TKMeasure" ? _.flatMap(subFormDataProvider.getMeasureValue(_.trim(_.get(v, "name", "")))).join(" ") :
                              v.type === "TKBoolean" ? !!subFormDataProvider.getBooleanValue(_.trim(_.get(v, "name", ""))) :
                                  v.type === "TKAction" ? subFormDataProvider.getValue(_.trim(_.get(v, "name", ""))) :
                                      v.type === "TKDate" ? subFormDataProvider.getDateValue(_.trim(_.get(v, "name", ""))) :
                                          v.type === "TKHCParty" ? subFormDataProvider.getValue(_.trim(_.get(v, "name", ""))) :
                                              "",
              valueTKMeasure: v.type === "TKMeasure" ? subFormDataProvider.getMeasureValue(_.trim(_.get(v, "name", ""))) : {}
          }
      })

      this._getPdfPrintingCommonData({
          downloadFileName: _.kebabCase([this.localize("certificate_stop_activity", this.language), _.get(this.patient, "lastName", ""), _.get(this.patient, "firstName", ""), +new Date()].join(" ")) + ".pdf",
          todayDate: moment().format("DD/MM/YYYY"),
          incapacityStart: _.get(_.filter(subFormFieldsAndValues, {name: "du"}), "[0].value", false),
          incapacityEnd: _.get(_.filter(subFormFieldsAndValues, {name: "au"}), "[0].value", false),
          incapacityPartiallyFinished: _.get(_.filter(subFormFieldsAndValues, {name: "reprise d'activité partielle"}), "[0].value", false),
          incapacityCompletelyFinished: _.get(_.filter(subFormFieldsAndValues, {name: "totale"}), "[0].value", false),
          includedExcludedLabel: _.trim(_.get(_.filter(subFormFieldsAndValues, {name: "inclus/exclus"}), "[0].value", "")) ? _.trim(_.get(_.filter(subFormFieldsAndValues, {name: "inclus/exclus"}), "[0].value", "")) : this.localize("included", this.language),
          precentageValueAndUnits: _.get(_.filter(subFormFieldsAndValues, {name: "pourcentage"}), "[0].valueTKMeasure.value", "100") + " " + (_.trim(_.get(_.filter(subFormFieldsAndValues, {name: "pourcentage"}), "[0].valueTKMeasure.unit", "")) || "%"),
          sortie: _.trim(_.get(_.filter(subFormFieldsAndValues, {name: "Sortie"}), "[0].value", "")) || "-",
          comment: _.trim(_.get(_.filter(subFormFieldsAndValues, {name: "Commentaire"}), "[0].value", "")),
          incapacityData: [],
          incapacityReasonData: [],
          codesToFind: ["CD-INCAPACITY", "CD-INCAPACITYREASON"]
      }).then(pdfPrintingData => {

          const incapacityFormValue = _.get(_.filter(subFormFieldsAndValues, {name: "incapacité de"}), "[0].value", "")
          _.get(_.filter(pdfPrintingData.foundCodes, {code: "CD-INCAPACITY"}), "[0].values", []).map(i => {
              pdfPrintingData.incapacityData.push({
                  name: _.trim(_.get(i, "label." + this.language, "")) || _.trim(_.get(i, "label.en", "")) || _.trim(_.get(i, "label.fr", "")) || _.trim(_.get(i, "label.nl", "")),
                  label: _.trim(_.get(i, "label." + this.language, "")) || _.trim(_.get(i, "label.en", "")) || _.trim(_.get(i, "label.fr", "")) || _.trim(_.get(i, "label.nl", "")),
                  type: "TKBoolean",
                  value: !!(_.trim(i.id) === _.trim(incapacityFormValue))
              })
          })

          const incapacityReasonFormValue = _.get(_.filter(subFormFieldsAndValues, {name: "pour cause de"}), "[0].value", "")
          _.get(_.filter(pdfPrintingData.foundCodes, {code: "CD-INCAPACITYREASON"}), "[0].values", []).map(i => {
              pdfPrintingData.incapacityReasonData.push({
                  name: _.trim(_.get(i, "label." + this.language, "")) || _.trim(_.get(i, "label.en", "")) || _.trim(_.get(i, "label.fr", "")) || _.trim(_.get(i, "label.nl", "")),
                  label: _.trim(_.get(i, "label." + this.language, "")) || _.trim(_.get(i, "label.en", "")) || _.trim(_.get(i, "label.fr", "")) || _.trim(_.get(i, "label.nl", "")),
                  type: "TKBoolean",
                  value: !!(_.trim(i.id) === _.trim(incapacityReasonFormValue))
              })
          })

          pdfPrintingData.incapacityDuration = pdfPrintingData.incapacityStart && pdfPrintingData.incapacityEnd ? moment(pdfPrintingData.incapacityEnd + "").diff(moment(pdfPrintingData.incapacityStart + ""), "days") : "X";
          if (pdfPrintingData.includedExcludedLabel.toLowerCase() === "inclus" || pdfPrintingData.includedExcludedLabel.toLowerCase() === "included" || pdfPrintingData.includedExcludedLabel.toLowerCase() === "inbegrepen") pdfPrintingData.incapacityDuration = parseInt(pdfPrintingData.incapacityDuration) ? pdfPrintingData.incapacityDuration + 1 : 1;

          const pdfContent = `
              <div class="page">
                  <h1 class="">` + this.localize("certificate_stop_activity", this.language) + `</h1>
                  <h2 class="">` + pdfPrintingData.todayDate + `</h2>

                  ` + this._getPatientVignetteHtmlCode(pdfPrintingData.patientData) + `

                  <div class="borderedBox">` +
              `<p class="italic">` + this.localize("csa_txt001", this.language) + `:</p>` +
              `<p class="bold fs15em mt15 mb20">` + _.trim(_.get(pdfPrintingData, "patientData.lastName", "")) + ` ` + _.trim(_.get(pdfPrintingData, "patientData.firstName", "")) + `</p> ` +
              `</div>

                  <div class="boxLabel">` + this.localize("csa_txt002", this.language) + `</div>
                  <div class="borderedBox">` + this._getFormCheckboxesAndLabelHtmlCode(pdfPrintingData.incapacityData, 2) + `</div>

                  <div class="boxLabel">` + this.localize("csa_txt003", this.language) + `</div>
                  <div class="borderedBox">` + this._getFormCheckboxesAndLabelHtmlCode(pdfPrintingData.incapacityReasonData, 2) + `</div>

                  <div class="boxLabel">` + this.localize("csa_txt004", this.language) + `</div>
                  <div class="borderedBox">` +
              "<p>" +
              pdfPrintingData.incapacityDuration + " " + this.localize("days", this.language) + ", " +
              _.trim(this.localize("from2", this.language)).toLowerCase() + " " + (pdfPrintingData.incapacityStart ? moment(pdfPrintingData.incapacityStart + "").format("DD/MM/YYYY") : "-") + " " +
              this.localize("till", this.language) + " " + (pdfPrintingData.incapacityEnd ? moment(pdfPrintingData.incapacityEnd + "").format("DD/MM/YYYY") : "-") + " " + pdfPrintingData.includedExcludedLabel + "<br />" +
              this.localize("csa_txt005", this.language) + ": " + pdfPrintingData.sortie +
              "</p>" +
              `</div>

                  <div class="boxLabel">` + this.localize("csa_txt006", this.language) + `</div>
                  <div class="borderedBox"><p>` +
              (pdfPrintingData.incapacityPartiallyFinished ? moment(pdfPrintingData.incapacityPartiallyFinished + "").format("DD/MM/YYYY") : "-") + " " + this.localize("csa_txt007", this.language) + ` ` + pdfPrintingData.precentageValueAndUnits +
              (pdfPrintingData.incapacityCompletelyFinished ? "<br />" + this.localize("csa_txt010", this.language) + ": " + moment(pdfPrintingData.incapacityCompletelyFinished + "").format("DD/MM/YYYY") : "") +
              `</p></div>` +

              (_.trim(pdfPrintingData.comment) ? `<div class="boxLabel">` + this.localize("com", this.language) + `</div><div class="borderedBox"><p>` + _.trim(pdfPrintingData.comment) + `</p></div>` : "") +

              this._getDoctorDetailsHtmlCode(pdfPrintingData.hcpData) + `
              </div> ` +
              '<' + 'script' + '>' + 'document.fonts.ready.then(() => { setInterval(() => {document.body.dispatchEvent(new CustomEvent("pdfDoneRenderingEvent"))}, 500); }); <' + '/script' + '>'

          // console.log(this._getPdfHeader() + pdfContent + this._getPdfFooter());

          this.api.pdfReport(this._getPdfHeader() + pdfContent + this._getPdfFooter(), {
              type: "recipe",
              completionEvent: "pdfDoneRenderingEvent"
          }).then(({pdf: pdfFileContent, printed: printed}) =>
              !printed && this.api.triggerFileDownload(pdfFileContent, "application/pdf", pdfPrintingData.downloadFileName)
          ).finally(() => {
              this.busySpinner = false;
          });

      }).catch((e) => {
          console.log(e);
          this.busySpinner = false;
      });

  }

  printImagingPrescriptionForm(subFormDataProvider, subFormObject, subFormTemplateObject) {

      this.busySpinner = true;

      // Todo: missing fields: Informations cliniques pertinentes (InfoClinPert), Explication de la demande de diagnostic (ExplicationDemandeDiag) & Informations supplémentaires pertinentes (unknown key)

      const subFormFieldsAndValues = _.map(
          _.map(_.chain(_.get(subFormTemplateObject, "layout.sections[0].formColumns[0].formDataList", {})).filter({type: "TKSubConsult"}).value(), (i) => {
              return {
                  name: _.trim(_.get(i, "name")),
                  label: _.trim(_.get(i, "label")),
                  subSubForm: _.head(subFormDataProvider.getSubForms(i.name))
              }
          }),
          (i) => {
              return _.assign(
                  {
                      subFormFieldsAndValues: _.map(_.get(i, "subSubForm.template.sections[0].formColumns[0].formDataList", {}), (v) => {
                          const subSubFormDataProvider = _.get(i, "subSubForm.dataProvider", {});
                          return subSubFormDataProvider && _.size(subSubFormDataProvider) ? {
                              name: _.trim(_.get(v, "name")),
                              label: _.trim(_.get(v, "label")),
                              type: _.trim(_.get(v, "type")),
                              value:
                                  v.type === "TKString" ? _.trim(subSubFormDataProvider.getStringValue(_.trim(_.get(v, "name", "")))) :
                                      v.type === "TKNumber" ? subSubFormDataProvider.getNumberValue(_.trim(_.get(v, "name", ""))) :
                                          v.type === "TKMeasure" ? _.flatMap(subSubFormDataProvider.getMeasureValue(_.trim(_.get(v, "name", "")))).join(" ") :
                                              v.type === "TKBoolean" ? !!subSubFormDataProvider.getBooleanValue(_.trim(_.get(v, "name", ""))) :
                                                  v.type === "TKAction" ? subSubFormDataProvider.getValue(_.trim(_.get(v, "name", ""))) :
                                                      v.type === "TKDate" ? subSubFormDataProvider.getDateValue(_.trim(_.get(v, "name", ""))) :
                                                          v.type === "TKHCParty" ? subSubFormDataProvider.getValue(_.trim(_.get(v, "name", ""))) :
                                                              ""
                          } : {}
                      })
                  }
                  , i
              )
          }
      )

      this._getPdfPrintingCommonData({
          downloadFileName: _.kebabCase([this.localize("requestForImagingExam_header1", this.language), _.get(this.patient, "lastName", ""), _.get(this.patient, "firstName", ""), +new Date()].join(" ")) + ".pdf",
          subFormData: _.compact(
              _.map(
                  (subFormDataProvider && subFormDataProvider.servicesMap ? subFormDataProvider.servicesMap : []), (v, k) => {
                      return _.size(v) && {
                          name: k,
                          value: subFormDataProvider.getValue(k),
                          valueObject: _.get(v, "[0][0].svc.content." + this.language, "") ? _.get(v, "[0][0].svc.content." + this.language, "") : _.get(v, "[0][0].svc.content." + "fr", "")
                      }
                  }
              )
          ) || [],
          suggestedExams: _.get(_.head(_.filter(subFormFieldsAndValues, {name: "F6986527-5C56-4233-8BC7-38D01659D582"})), "subFormFieldsAndValues", {}),
          previouslySuggestedExams: _.get(_.head(_.filter(subFormFieldsAndValues, {name: "16BD8C81-48D3-4E38-B213-B73E2A30A6F8"})), "subFormFieldsAndValues", {}),

      }).then(pdfPrintingData => {

          const pdfContent = `
              <div class="page">
                  <h1>` + this.localize("requestForImagingExam_header1", this.language) + `</h1>
                  <h2>` + this.localize("requestForImagingExam_header2", this.language) + `</h2>

                  ` + this._getPatientVignetteHtmlCode(pdfPrintingData.patientData) + `

                  <div class="boxLabel">` + this.localize("requestForImagingExam_box2_clinicalInfo", this.language) + `</div>
                  <div class="borderedBox"></div>

                  <div class="boxLabel">` + this.localize("requestForImagingExam_box3_explanationRequestForImaging", this.language) + `</div>
                  <div class="borderedBox"></div>

                  <div class="boxLabel">` + this.localize("requestForImagingExam_box4_additionalInfo", this.language) + `</div>
                  <div class="borderedBox"></div>

                  <div class="boxLabel">` + this.localize("requestForImagingExam_box5_suggestedExams", this.language) + `</div>
                  <div class="borderedBox">` + this._getFormCheckboxesAndLabelHtmlCode(pdfPrintingData.suggestedExams, 3) + `</div>

                  <div class="boxLabel">` + this.localize("requestForImagingExam_box6_previousExamsRelatedToRequestForImaging", this.language) + `</div>
                  <div class="borderedBox">` + this._getFormCheckboxesAndLabelHtmlCode(pdfPrintingData.previouslySuggestedExams, 3) + `</div>

                  ` + this._getDoctorDetailsHtmlCode(pdfPrintingData.hcpData) + `
              </div>` +
              '<' + 'script' + '>' + 'document.fonts.ready.then(() => { setInterval(() => {document.body.dispatchEvent(new CustomEvent("pdfDoneRenderingEvent"))}, 500); }); <' + '/script' + '>'

          // console.log(this._getPdfHeader() + pdfContent + this._getPdfFooter());
          this.api.pdfReport(this._getPdfHeader() + pdfContent + this._getPdfFooter(), {
              type: "imagerie",
              completionEvent: "pdfDoneRenderingEvent"
          }).then(({pdf: pdfFileContent, printed: printed}) =>
              !printed && this.api.triggerFileDownload(pdfFileContent, "application/pdf", pdfPrintingData.downloadFileName)
          ).finally(() => {
              this.busySpinner = false;
          });

      }).catch((e) => {
          console.log(e);
          this.busySpinner = false;
      });

  }

  printImagingPrescriptionForm_v2(subFormDataProvider, subFormObject, subFormTemplateObject) {

      this.busySpinner = true;

      const subFormFieldsAndValues = _.compact(
          _.map(_.get(subFormTemplateObject, "layout.sections[0].formColumns[0].formDataList", {}), (v) => {
              return v.type === "TKLabelSeparator" ? false : {
                  name: _.trim(_.get(v, "name")),
                  label: _.trim(_.get(v, "label")),
                  type: _.trim(_.get(v, "type")),
                  value:
                      v.type === "TKString" ? _.trim(subFormDataProvider.getStringValue(_.trim(_.get(v, "name", "")))) :
                          v.type === "TKNumber" ? subFormDataProvider.getNumberValue(_.trim(_.get(v, "name", ""))) :
                              v.type === "TKMeasure" ? _.flatMap(subFormDataProvider.getMeasureValue(_.trim(_.get(v, "name", "")))).join(" ") :
                                  v.type === "TKBoolean" ? !!subFormDataProvider.getBooleanValue(_.trim(_.get(v, "name", ""))) :
                                      v.type === "TKAction" ? subFormDataProvider.getValue(_.trim(_.get(v, "name", ""))) :
                                          v.type === "TKDate" ? subFormDataProvider.getDateValue(_.trim(_.get(v, "name", ""))) :
                                              v.type === "TKHCParty" ? subFormDataProvider.getValue(_.trim(_.get(v, "name", ""))) :
                                                  ""
              }
          })
      )

      this._getPdfPrintingCommonData({
          downloadFileName: _.kebabCase([this.localize("requestForImagingExam_header1", this.language), _.get(this.patient, "lastName", ""), _.get(this.patient, "firstName", ""), +new Date()].join(" ")) + ".pdf",
          subFormData: _.compact(
              _.map(
                  (subFormDataProvider && subFormDataProvider.servicesMap ? subFormDataProvider.servicesMap : []), (v, k) => {
                      return _.size(v) && {
                          name: k,
                          value: subFormDataProvider.getValue(k),
                          valueObject: _.get(v, "[0][0].svc.content." + this.language, "") ? _.get(v, "[0][0].svc.content." + this.language, "") : _.get(v, "[0][0].svc.content." + "fr", "")
                      }
                  }
              )
          ) || [],
          suggestedExams: _.filter(subFormFieldsAndValues, (i => {
              return i.name === "CT Scan" || i.name === "RMN" || i.name === "RX" || i.name === "Echographie" || i.name === "Scintigraphie" || i.name === "Inconnu" || i.name === "ExamProp" || i.name === "Autre_exam_bis"
          })),
          previouslySuggestedExams: _.filter(subFormFieldsAndValues, (i => {
              return i.name === "Allergy" || i.name === "Diabetes" || i.name === "RenalFailure" || i.name === "Grossesse" || i.name === "Implant" || i.name === "Autre examen"
          })),
          documentMetas: {
              title: _.trim(this.localize("requestForImagingExam_header1", this.language)),
              formId: _.trim(_.get(subFormObject, "id", "")),
              created: "" + +new Date(),
              patientId: _.trim(_.get(this.patient, "id", "")),
              patientName: _.compact([_.get(this.patient, "lastName", ""), _.get(this.patient, "firstName", "")]).join(" "),
          }
      }).then(pdfPrintingData => {

          const pdfContent = `
              <div class="page">
                  <h1>` + this.localize("requestForImagingExam_header1", this.language) + `</h1>
                  <h2>` + this.localize("requestForImagingExam_header2", this.language) + `</h2>

                  ` + this._getPatientVignetteHtmlCode(pdfPrintingData.patientData) + `

                  <div class="boxLabel">` + this.localize("requestForImagingExam_box2_clinicalInfo", this.language) + `</div>
                  <div class="borderedBox">` + _.trim(_.get(_.filter(subFormFieldsAndValues, {name: "InfoClinPert"}), "[0].value", "")) + `</div>

                  <div class="boxLabel">` + this.localize("requestForImagingExam_box3_explanationRequestForImaging", this.language) + `</div>
                  <div class="borderedBox">` + _.trim(_.get(_.filter(subFormFieldsAndValues, {name: "ExplicationDemandeDiag"}), "[0].value", "")) + `</div>

                  <div class="boxLabel">` + this.localize("requestForImagingExam_box4_additionalInfo", this.language) + `</div>
                  <div class="borderedBox">` + this._getFormCheckboxesAndLabelHtmlCode(pdfPrintingData.previouslySuggestedExams, 3) + `</div>

                  <div class="boxLabel">` + this.localize("requestForImagingExam_box6_previousExamsRelatedToRequestForImaging", this.language) + `</div>
                  <div class="borderedBox">` + this._getFormCheckboxesAndLabelHtmlCode(pdfPrintingData.suggestedExams, 3) + `</div>

                  ` + this._getDoctorDetailsHtmlCode(pdfPrintingData.hcpData) + `
              </div>` +
              '<' + 'script' + '>' + 'document.fonts.ready.then(() => { setInterval(() => {document.body.dispatchEvent(new CustomEvent("pdfDoneRenderingEvent"))}, 500); }); <' + '/script' + '>'

          return _.assign({pdfContent: pdfContent}, pdfPrintingData)

      })
          .then(pdfPrintingData => this.api.pdfReport(this._getPdfHeader() + pdfPrintingData.pdfContent + this._getPdfFooter(), {
              type: "imagerie",
              completionEvent: "pdfDoneRenderingEvent"
          }).then(({pdf: pdfFileContent, printed: printed}) => _.assign({
              pdfFileContent: pdfFileContent,
              printed: printed
          }, pdfPrintingData)))
          .then(pdfPrintingData => this.api.message().newInstanceWithPatient(this.user, this.patient)
              .then(newMessageInstance => _.assign({newMessageInstance: newMessageInstance}, pdfPrintingData))
              .then(pdfPrintingData => this.api.message().createMessage(
                  _.merge(
                      pdfPrintingData.newMessageInstance,
                      {
                          transportGuid: "PRESCRIPTION:IMAGING:ARCHIVE",
                          recipients: [_.get(this.user, 'healthcarePartyId', _.trim(this.user.id))],
                          metas: pdfPrintingData.documentMetas,
                          toAddresses: [_.get(this.user, 'email', _.get(this.user, 'healthcarePartyId', _.trim(this.user.id)))],
                          subject: pdfPrintingData.documentMetas.title
                      }
                  )
                  ).then(createMessageResponse => _.assign({createMessageResponse: createMessageResponse}, pdfPrintingData))
              )
          )
          .then(pdfPrintingData => this.api.document().newInstance(
              this.user, pdfPrintingData.createMessageResponse,
              {
                  documentType: 'report',
                  mainUti: this.api.document().uti("application/pdf"),
                  name: pdfPrintingData.documentMetas.title + " - " + pdfPrintingData.documentMetas.patientName
              }
              ).then(newDocumentInstance => _.assign({newDocumentInstance: newDocumentInstance}, pdfPrintingData))
          )
          .then(pdfPrintingData => this.api.document().createDocument(pdfPrintingData.newDocumentInstance).then(createDocumentResponse => _.assign({createDocumentResponse: createDocumentResponse}, pdfPrintingData)))
          .then(pdfPrintingData => this.api.encryptDecryptFileContentByUserHcpIdAndDocumentObject("encrypt", this.user, pdfPrintingData.createDocumentResponse, pdfPrintingData.pdfFileContent).then(encryptedFileContent => _.assign({encryptedFileContent: encryptedFileContent}, pdfPrintingData)))
          .then(pdfPrintingData => this.api.document().setAttachment(pdfPrintingData.createDocumentResponse.id, null, pdfPrintingData.encryptedFileContent).then(setAttachmentResponse => _.assign({setAttachmentResponse: setAttachmentResponse}, pdfPrintingData)))
          .then(pdfPrintingData => {
              this._saveDocumentAsService({
                  documentId: _.trim(_.get(pdfPrintingData, "createDocumentResponse.id", "")),
                  stringValue: pdfPrintingData.documentMetas.title,
                  formId: pdfPrintingData.documentMetas.formId,
                  contactId: _.trim(this.currentContact.id)
              })
              return pdfPrintingData
          })
          .then(pdfPrintingData => !pdfPrintingData.printed && this.api.triggerFileDownload(pdfPrintingData.pdfFileContent, "application/pdf", pdfPrintingData.downloadFileName))
          .catch(e => {
              console.log(e)
          })
          .finally(() => {
              this.busySpinner = false;
          })

  }

  printKinePrescriptionForm(subFormDataProvider, subFormObject, subFormTemplateObject) {

      this.busySpinner = true;

      const subFormFieldsAndValues = _.map(_.get(subFormTemplateObject, "layout.sections[0].formColumns[0].formDataList", {}), (v) => {
          return {
              name: _.trim(_.get(v, "name")),
              label: _.trim(_.get(v, "label")),
              type: _.trim(_.get(v, "type")),
              value:
                  v.type === "TKString" ? _.trim(subFormDataProvider.getStringValue(_.trim(_.get(v, "name", "")))) :
                      v.type === "TKNumber" ? subFormDataProvider.getNumberValue(_.trim(_.get(v, "name", ""))) :
                          v.type === "TKMeasure" ? _.flatMap(subFormDataProvider.getMeasureValue(_.trim(_.get(v, "name", "")))).join(" ") :
                              v.type === "TKBoolean" ? !!subFormDataProvider.getBooleanValue(_.trim(_.get(v, "name", ""))) :
                                  v.type === "TKAction" ? subFormDataProvider.getValue(_.trim(_.get(v, "name", ""))) :
                                      v.type === "TKDate" ? subFormDataProvider.getDateValue(_.trim(_.get(v, "name", ""))) :
                                          v.type === "TKHCParty" ? subFormDataProvider.getValue(_.trim(_.get(v, "name", ""))) :
                                              ""
          }
      })

      this._getPdfPrintingCommonData({
          downloadFileName: _.kebabCase([this.localize("requestForKineCare_header1", this.language), _.get(this.patient, "lastName", ""), _.get(this.patient, "firstName", ""), +new Date()].join(" ")) + ".pdf",
          healthCarTypeData: [
              _.get(_.filter(subFormFieldsAndValues, {name: "Prescription de kinésithérapie"}), "[0]", {}),
              _.get(_.filter(subFormFieldsAndValues, {name: "Le patient ne peut se déplacer"}), "[0]", {}),
              _.get(_.filter(subFormFieldsAndValues, {name: "Demande d'avis consultatif kiné"}), "[0]", {}),
              _.get(_.filter(subFormFieldsAndValues, {name: "Demande d'avis"}), "[0]", {})
          ],
          treatmentModalityData: [
              _.get(_.filter(subFormFieldsAndValues, {name: "Massage"}), "[0]", {}),
              _.get(_.filter(subFormFieldsAndValues, {name: "Mobilisation"}), "[0]", {}),
              _.get(_.filter(subFormFieldsAndValues, {name: "Genre de séances"}), "[0]", {}),
              _.get(_.filter(subFormFieldsAndValues, {name: "Thermotherapie"}), "[0]", {}),
              _.get(_.filter(subFormFieldsAndValues, {name: "Electrotherapie"}), "[0]", {}),
              _.get(_.filter(subFormFieldsAndValues, {name: "Ultra son"}), "[0]", {}),
              _.get(_.filter(subFormFieldsAndValues, {name: "Ondes courtes"}), "[0]", {}),
              _.get(_.filter(subFormFieldsAndValues, {name: "Tapotage et gymnastique respiratoire"}), "[0]", {}),
              _.get(_.filter(subFormFieldsAndValues, {name: "Rééducation"}), "[0]", {}),
              _.get(_.filter(subFormFieldsAndValues, {name: "Localisation"}), "[0]", {}),
              _.get(_.filter(subFormFieldsAndValues, {name: "Fango"}), "[0]", {}),
              _.get(_.filter(subFormFieldsAndValues, {name: "Kiné respiratoire tapotements"}), "[0]", {}),
              _.get(_.filter(subFormFieldsAndValues, {name: "Drainage lymphatique"}), "[0]", {}),
              _.get(_.filter(subFormFieldsAndValues, {name: "Gymnastique"}), "[0]", {}),
              _.get(_.filter(subFormFieldsAndValues, {name: "Infra-rouge"}), "[0]", {}),
              _.get(_.filter(subFormFieldsAndValues, {name: "Manipulations"}), "[0]", {}),
              _.get(_.filter(subFormFieldsAndValues, {name: "Ionisations"}), "[0]", {})
          ],
          frequencyData: [
              _.get(_.filter(subFormFieldsAndValues, {name: "Nombre de séances"}), "[0]", {}),
              _.get(_.filter(subFormFieldsAndValues, {name: "Fréquence"}), "[0]", {}),
              _.get(_.filter(subFormFieldsAndValues, {name: "Code d'intervention"}), "[0]", {}),
              _.get(_.filter(subFormFieldsAndValues, {name: "Diagnostic"}), "[0]", {}),
              _.get(_.filter(subFormFieldsAndValues, {name: "Date intervention"}), "[0]", {})
          ],
          complementaryMedicalInfoData: [
              _.get(_.filter(subFormFieldsAndValues, {name: "Imagerie kiné"}), "[0]", {}),
              _.get(_.filter(subFormFieldsAndValues, {name: "Biologie kiné"}), "[0]", {}),
              _.get(_.filter(subFormFieldsAndValues, {name: "Avis spécialisé kiné"}), "[0]", {}),
              _.get(_.filter(subFormFieldsAndValues, {name: "Autre avis kiné"}), "[0]", {})
          ],
          feedbackData: [
              _.get(_.filter(subFormFieldsAndValues, {name: "Evolution pendant tt"}), "[0]", {}),
              _.get(_.filter(subFormFieldsAndValues, {name: "Evolution fin tt"}), "[0]", {}),
              _.get(_.filter(subFormFieldsAndValues, {name: "Communication par courrier"}), "[0]", {}),
              _.get(_.filter(subFormFieldsAndValues, {name: "Communication par téléphone"}), "[0]", {}),
              _.get(_.filter(subFormFieldsAndValues, {name: "Communication autre"}), "[0]", {})
          ],
          documentMetas: {
              title: _.trim(this.localize("requestForKineCare_header1", this.language)),
              formId: _.trim(_.get(subFormObject, "id", "")),
              created: "" + +new Date(),
              patientId: _.trim(_.get(this.patient, "id", "")),
              patientName: _.compact([_.get(this.patient, "lastName", ""), _.get(this.patient, "firstName", "")]).join(" ")
          }
      }).then(pdfPrintingData => {

          const pdfContent = `
              <div class="page">
                  <h1 class="mb40">` + this.localize("requestForKineCare_header1", this.language) + `</h1>

                  ` + this._getPatientVignetteHtmlCode(pdfPrintingData.patientData) + `

                  <div class="boxLabel">` + this.localize("requestForKineCare_box1_title", this.language) + `</div>
                  <div class="borderedBox">` + this._getFormCheckboxesAndLabelHtmlCode(pdfPrintingData.healthCarTypeData, 3) + `</div>

                  <div class="boxLabel">` + this.localize("requestForKineCare_box2_title", this.language) + `</div>
                  <div class="borderedBox">` + this._getFormCheckboxesAndLabelHtmlCode(pdfPrintingData.treatmentModalityData, 3) + `</div>

                  <div class="boxLabel">` + this.localize("requestForKineCare_box3_title", this.language) + `</div>
                  <div class="borderedBox">` + this._getFormCheckboxesAndLabelHtmlCode(pdfPrintingData.frequencyData, 3) + `</div>

                  <div class="boxLabel">` + this.localize("requestForKineCare_box4_title", this.language) + `</div>
                  <div class="borderedBox">` + this._getFormCheckboxesAndLabelHtmlCode(pdfPrintingData.complementaryMedicalInfoData, 3) + `</div>

                  <div class="boxLabel">` + this.localize("requestForKineCare_box5_title", this.language) + `</div>
                  <div class="borderedBox">` + this._getFormCheckboxesAndLabelHtmlCode(pdfPrintingData.feedbackData, 1) + `</div>

                  ` + this._getDoctorDetailsHtmlCode(pdfPrintingData.hcpData) + `
              </div> ` +
              '<' + 'script' + '>' + 'document.fonts.ready.then(() => { setInterval(() => {document.body.dispatchEvent(new CustomEvent("pdfDoneRenderingEvent"))}, 500); }); <' + '/script' + '>'

          return _.assign({pdfContent: pdfContent}, pdfPrintingData)

      })
          .then(pdfPrintingData => this.api.pdfReport(this._getPdfHeader() + pdfPrintingData.pdfContent + this._getPdfFooter(), {
              type: "recipe-kine-inf",
              completionEvent: "pdfDoneRenderingEvent"
          }).then(({pdf: pdfFileContent, printed: printed}) => _.assign({
              pdfFileContent: pdfFileContent,
              printed: printed
          }, pdfPrintingData)))
          .then(pdfPrintingData => this.api.message().newInstanceWithPatient(this.user, this.patient)
              .then(newMessageInstance => _.assign({newMessageInstance: newMessageInstance}, pdfPrintingData))
              .then(pdfPrintingData => this.api.message().createMessage(
                  _.merge(
                      pdfPrintingData.newMessageInstance,
                      {
                          transportGuid: "PRESCRIPTION:KINE:ARCHIVE",
                          recipients: [_.get(this.user, 'healthcarePartyId', _.trim(this.user.id))],
                          metas: pdfPrintingData.documentMetas,
                          toAddresses: [_.get(this.user, 'email', _.get(this.user, 'healthcarePartyId', _.trim(this.user.id)))],
                          subject: pdfPrintingData.documentMetas.title
                      }
                  )
                  ).then(createMessageResponse => _.assign({createMessageResponse: createMessageResponse}, pdfPrintingData))
              )
          )
          .then(pdfPrintingData => this.api.document().newInstance(
              this.user, pdfPrintingData.createMessageResponse,
              {
                  documentType: 'report',
                  mainUti: this.api.document().uti("application/pdf"),
                  name: pdfPrintingData.documentMetas.title + " - " + pdfPrintingData.documentMetas.patientName
              }
              ).then(newDocumentInstance => _.assign({newDocumentInstance: newDocumentInstance}, pdfPrintingData))
          )
          .then(pdfPrintingData => this.api.document().createDocument(pdfPrintingData.newDocumentInstance).then(createDocumentResponse => _.assign({createDocumentResponse: createDocumentResponse}, pdfPrintingData)))
          .then(pdfPrintingData => this.api.encryptDecryptFileContentByUserHcpIdAndDocumentObject("encrypt", this.user, pdfPrintingData.createDocumentResponse, pdfPrintingData.pdfFileContent).then(encryptedFileContent => _.assign({encryptedFileContent: encryptedFileContent}, pdfPrintingData)))
          .then(pdfPrintingData => this.api.document().setAttachment(pdfPrintingData.createDocumentResponse.id, null, pdfPrintingData.encryptedFileContent).then(setAttachmentResponse => _.assign({setAttachmentResponse: setAttachmentResponse}, pdfPrintingData)))
          .then(pdfPrintingData => {
              this._saveDocumentAsService({
                  documentId: _.trim(_.get(pdfPrintingData, "createDocumentResponse.id", "")),
                  stringValue: pdfPrintingData.documentMetas.title,
                  formId: pdfPrintingData.documentMetas.formId,
                  contactId: _.trim(this.currentContact.id)
              })
              return pdfPrintingData
          })
          .then(pdfPrintingData => !pdfPrintingData.printed && this.api.triggerFileDownload(pdfPrintingData.pdfFileContent, "application/pdf", pdfPrintingData.downloadFileName))
          .catch(e => {
              console.log(e)
          })
          .finally(() => {
              this.busySpinner = false;
          })

  }

  printNursePrescriptionForm(subFormDataProvider, subFormObject, subFormTemplateObject) {

      this.busySpinner = true;

      const formsData = {
          subForm: {
              id: _.get(subFormObject, "id", ""),
              name: _.get(subFormTemplateObject, "layout.name", ""),
              guid: _.get(subFormTemplateObject, "layout.guid", ""),
              fieldsAndValues: _.map(
                  _.filter(
                      _.get(subFormTemplateObject, "layout.sections[0].formColumns[0].formDataList", []),
                      (singleField => {
                          return _.get(singleField, "type", "") !== "TKAction" && _.get(singleField, "type", "") !== "TKSubConsult"
                      })
                  ),
                  (singleField => {
                      return {
                          name: _.trim(_.get(singleField, "name")),
                          label: _.trim(_.get(singleField, "label")),
                          type: _.trim(_.get(singleField, "type")),
                          value:
                              singleField.type === "TKString" ? _.trim(subFormDataProvider.getStringValue(_.trim(_.get(singleField, "name", "")))) :
                                  singleField.type === "TKNumber" ? subFormDataProvider.getNumberValue(_.trim(_.get(singleField, "name", ""))) :
                                      singleField.type === "TKMeasure" ? _.flatMap(subFormDataProvider.getMeasureValue(_.trim(_.get(singleField, "name", "")))).join(" ") :
                                          singleField.type === "TKBoolean" ? !!subFormDataProvider.getBooleanValue(_.trim(_.get(singleField, "name", ""))) :
                                              singleField.type === "TKDate" ? subFormDataProvider.getDateValue(_.trim(_.get(singleField, "name", ""))) :
                                                  singleField.type === "TKHCParty" ? subFormDataProvider.getValue(_.trim(_.get(singleField, "name", ""))) :
                                                      singleField.type === "TKMedication" ? subFormDataProvider.getValueContainers(_.trim(_.get(singleField, "name", ""))) :
                                                          singleField.type === "TKMedicationTable" ? subFormDataProvider.getValueContainers(_.trim(_.get(singleField, "name", ""))) :
                                                              ""
                      }
                  })
              ),
              subSubFormsStructure: {
                  label: _.map(
                      _.filter(_.get(subFormTemplateObject, "layout.sections[0].formColumns[0].formDataList", []), {type: "TKSubConsult"}),
                      (singleTKSubConsult => _.get(singleTKSubConsult, "label"))
                  ).join(" - "),
                  fieldsAndValues: _.head(
                      _.map(
                          _.filter(_.get(subFormTemplateObject, "layout.sections[0].formColumns[0].formDataList", []), {type: "TKSubConsult"}),
                          (subForm => {
                              return _.map(subFormDataProvider.getSubForms(subForm.name), (singleSubSubForm => {
                                  return {
                                      name: _.get(singleSubSubForm, "template.name", ""),
                                      label: _.get(singleSubSubForm, "template.name", ""),
                                      type: "TKBoolean",
                                      value: true
                                  }
                              }))
                          })
                      )
                  )
              }
          },
          subSubForms: _.head(
              _.map(
                  _.chain(_.get(subFormTemplateObject, "layout.sections[0].formColumns[0].formDataList", [])).filter({type: "TKSubConsult"}).value(),
                  (subForm => {
                      return _.map(subFormDataProvider.getSubForms(subForm.name), (singleSubSubForm => {

                          const subSubFormDataProvider = _.get(singleSubSubForm, "dataProvider", {});
                          const subSubFormDataList = _.get(singleSubSubForm, "template.sections[0].formColumns[0].formDataList", []);

                          return {
                              name: _.get(singleSubSubForm, "template.name", ""),
                              guid: _.get(singleSubSubForm, "template.guid", ""),
                              columnsCount:
                                  _.trim(_.get(singleSubSubForm, "template.guid", "")) === "6B7E72D1-9FE4-4F05-A9AB-42191480D1E4" ? 1 :       // Constipation
                                      _.trim(_.get(singleSubSubForm, "template.guid", "")) === "09BBA6AB-F79C-45AA-BA1C-934D8D7A060A" ? 2 :       // Nutrition entérale
                                          _.trim(_.get(singleSubSubForm, "template.guid", "")) === "6A3B31CF-5350-4A30-8919-065F4382787C" ? 1 :       // Thérapie de compression
                                              _.trim(_.get(singleSubSubForm, "template.guid", "")) === "F25A53D3-31F1-4A51-975C-74DFD70A645B" ? 1 :       // Administration ou application de médicaments
                                                  _.trim(_.get(singleSubSubForm, "template.guid", "")) === "6DE82F31-5D4C-41A7-B54B-DAFA00BF30CA" ? 2 :       // Soins de plaie
                                                      _.trim(_.get(singleSubSubForm, "template.guid", "")) === "244D262F-6F8C-48C3-8975-B39159AAAB94" ? 2 :       // Sondes
                                                          false,
                              fieldsAndValues: _.map(
                                  subSubFormDataList,
                                  (subSubFormSingleField => {
                                      return {
                                          name: _.trim(_.get(subSubFormSingleField, "name")),
                                          label: _.trim(_.get(singleSubSubForm, "template.guid", "")) === "244D262F-6F8C-48C3-8975-B39159AAAB94" && _.trim(_.get(subSubFormSingleField, "name")).slice(0, 4) === "Qté " ?
                                              _.trim(_.get(subSubFormSingleField, "name")) :
                                              _.trim(_.get(subSubFormSingleField, "label")),
                                          type: _.trim(_.get(subSubFormSingleField, "type")),
                                          value:
                                              subSubFormSingleField.type === "TKString" ? _.trim(subSubFormDataProvider.getStringValue(_.trim(_.get(subSubFormSingleField, "name", "")))) :
                                                  subSubFormSingleField.type === "TKNumber" ? subSubFormDataProvider.getNumberValue(_.trim(_.get(subSubFormSingleField, "name", ""))) :
                                                      subSubFormSingleField.type === "TKMeasure" ? _.flatMap(subSubFormDataProvider.getMeasureValue(_.trim(_.get(subSubFormSingleField, "name", "")))).join(" ") :
                                                          subSubFormSingleField.type === "TKBoolean" ? !!subSubFormDataProvider.getBooleanValue(_.trim(_.get(subSubFormSingleField, "name", ""))) :
                                                              subSubFormSingleField.type === "TKAction" ? subSubFormDataProvider.getValue(_.trim(_.get(subSubFormSingleField, "name", ""))) :
                                                                  subSubFormSingleField.type === "TKDate" ? subSubFormDataProvider.getDateValue(_.trim(_.get(subSubFormSingleField, "name", ""))) :
                                                                      subSubFormSingleField.type === "TKHCParty" ? subSubFormDataProvider.getValue(_.trim(_.get(subSubFormSingleField, "name", ""))) :
                                                                          subSubFormSingleField.type === "TKMedication" ? subSubFormDataProvider.getValueContainers(_.trim(_.get(subSubFormSingleField, "name", ""))) :
                                                                              subSubFormSingleField.type === "TKMedicationTable" ? subSubFormDataProvider.getValueContainers(_.trim(_.get(subSubFormSingleField, "name", ""))) :
                                                                                  ""
                                      }
                                  })
                              )
                          }
                      }))
                  })
              )
          )
      }

      this._getPdfPrintingCommonData({
          downloadFileName: _.kebabCase([this.localize("requestForNurseCare_header1", this.language), _.get(this.patient, "lastName", ""), _.get(this.patient, "firstName", ""), +new Date()].join(" ")) + ".pdf",
          formsData: formsData,
          documentMetas: {
              title: _.trim(this.localize("requestForNurseCare_header1", this.language)),
              formId: _.trim(_.get(subFormObject, "id", "")),
              created: "" + +new Date(),
              patientId: _.trim(_.get(this.patient, "id", "")),
              patientName: _.compact([_.get(this.patient, "lastName", ""), _.get(this.patient, "firstName", "")]).join(" ")
          }
      }).then(pdfPrintingData => {
          const pdfContent = `
              <div class="page">
                  <h1 class="mb40">` + this.localize("requestForNurseCare_header1", this.language) + `</h1>

                  ` + this._getPatientVignetteHtmlCode(pdfPrintingData.patientData) + `

                  <div class="boxLabel">` + pdfPrintingData.formsData.subForm.subSubFormsStructure.label + `</div>
                  <div class="borderedBox">` + this._getFormCheckboxesAndLabelHtmlCode(pdfPrintingData.formsData.subForm.subSubFormsStructure.fieldsAndValues, 2) + `</div>

                  <div class="boxLabel">` + pdfPrintingData.formsData.subForm.name + `</div>
                  <div class="borderedBox">` + this._getFormCheckboxesAndLabelHtmlCode(pdfPrintingData.formsData.subForm.fieldsAndValues, 1) + "</div>" +

              _.map(pdfPrintingData.formsData.subSubForms, (singleSubSubForm => {
                  return "" +
                      '<div class="boxLabel">' + singleSubSubForm.name + '</div>' +
                      '<div class="borderedBox">' + this._getFormCheckboxesAndLabelHtmlCode(singleSubSubForm.fieldsAndValues, singleSubSubForm.columnsCount) + '</div>'
              })).join(" ") +

              this._getDoctorDetailsHtmlCode(pdfPrintingData.hcpData) + `
              </div>` +
              '<' + 'script' + '>' + 'document.fonts.ready.then(() => { setInterval(() => {document.body.dispatchEvent(new CustomEvent("pdfDoneRenderingEvent"))}, 500); }); <' + '/script' + '>'

          return _.assign({pdfContent: pdfContent}, pdfPrintingData)
      })
          .then(pdfPrintingData => this.api.pdfReport(this._getPdfHeader({pageOverflowHidden: false}) + pdfPrintingData.pdfContent + this._getPdfFooter(), {
              type: "recipe-kine-inf",
              completionEvent: "pdfDoneRenderingEvent"
          }).then(({pdf: pdfFileContent, printed: printed}) => _.assign({
              pdfFileContent: pdfFileContent,
              printed: printed
          }, pdfPrintingData)))
          .then(pdfPrintingData => this.api.message().newInstanceWithPatient(this.user, this.patient)
              .then(newMessageInstance => _.assign({newMessageInstance: newMessageInstance}, pdfPrintingData))
              .then(pdfPrintingData => this.api.message().createMessage(
                  _.merge(
                      pdfPrintingData.newMessageInstance,
                      {
                          transportGuid: "PRESCRIPTION:NURSE:ARCHIVE",
                          recipients: [_.get(this.user, 'healthcarePartyId', _.trim(this.user.id))],
                          metas: pdfPrintingData.documentMetas,
                          toAddresses: [_.get(this.user, 'email', _.get(this.user, 'healthcarePartyId', _.trim(this.user.id)))],
                          subject: pdfPrintingData.documentMetas.title
                      }
                  )
              ).then(createMessageResponse => _.assign({createMessageResponse: createMessageResponse}, pdfPrintingData)))
          )
          .then(pdfPrintingData => this.api.document().newInstance(
              this.user, pdfPrintingData.createMessageResponse,
              {
                  documentType: 'report',
                  mainUti: this.api.document().uti("application/pdf"),
                  name: pdfPrintingData.documentMetas.title + " - " + pdfPrintingData.documentMetas.patientName
              }
              ).then(newDocumentInstance => _.assign({newDocumentInstance: newDocumentInstance}, pdfPrintingData))
          )
          .then(pdfPrintingData => this.api.document().createDocument(pdfPrintingData.newDocumentInstance).then(createDocumentResponse => _.assign({createDocumentResponse: createDocumentResponse}, pdfPrintingData)))
          .then(pdfPrintingData => this.api.encryptDecryptFileContentByUserHcpIdAndDocumentObject("encrypt", this.user, pdfPrintingData.createDocumentResponse, pdfPrintingData.pdfFileContent).then(encryptedFileContent => _.assign({encryptedFileContent: encryptedFileContent}, pdfPrintingData)))
          .then(pdfPrintingData => this.api.document().setAttachment(pdfPrintingData.createDocumentResponse.id, null, pdfPrintingData.encryptedFileContent).then(setAttachmentResponse => _.assign({setAttachmentResponse: setAttachmentResponse}, pdfPrintingData)))
          .then(pdfPrintingData => {
              this._saveDocumentAsService({
                  documentId: _.trim(_.get(pdfPrintingData, "createDocumentResponse.id", "")),
                  stringValue: pdfPrintingData.documentMetas.title,
                  formId: pdfPrintingData.documentMetas.formId,
                  contactId: _.trim(this.currentContact.id)
              })
              return pdfPrintingData
          })
          .then(pdfPrintingData => !pdfPrintingData.printed && this.api.triggerFileDownload(pdfPrintingData.pdfFileContent, "application/pdf", pdfPrintingData.downloadFileName))
          .catch(e => {
              console.log(e)
          })
          .finally(() => {
              this.busySpinner = false;
          })


  }

  _getPdfHeader(layoutAttributes = false) {

      layoutAttributes = _.merge(
          {
              pageOverflowHidden: true
          },
          (layoutAttributes || {})
      )

      return `
          <html>
              <head>

                  <style>

                      @page {size: A4; width: 210mm; height: 297mm; margin: 0; padding: 0 }
                      body {margin: 0; padding: 0; font-family: Arial, Helvetica, sans-serif; line-height:1em; }
                      .page { width: 210mm; ` + (layoutAttributes.pageOverflowHidden ? "height: 297mm; overflow:hidden;" : "") + ` color:#000000; font-size:12px; padding:15mm; }

                      h1 { font-size:18px; text-align: center; margin:0; padding:0; }
                      h2 { font-size:16px; font-weight:400; font-style: italic; text-align: center; padding:0; margin:10px 0 30px 0; }
                      p {}

                      .clear { clear:both; height:0px; line-height:0px; }

                      .alignCenter {text-align: center!important;}
                      .alignLeft {text-align: left;}
                      .alignRight {text-align: right;}

                      .fl {float:left} .fr {float:right} .fn {float:none}

                      .ttn { text-transform:none; }

                      .bold { font-weight:700 }
                      .fw400 { font-weight:400 }
                      .italic { font-style: italic }
                      .fs1em { font-size:1em; } .fs11em { font-size:1.1em; } .fs12em { font-size:1.2em; } .fs13em { font-size:1.3em; } .fs14em { font-size:1.4em; } .fs15em { font-size:1.5em; } .fs16em { font-size:1.6em; } .fs17em { font-size:1.7em; } .fs18em { font-size:1.8em; } .fs19em { font-size:1.9em; } .fs2em { font-size:2em; }

                      .mt0 {margin-top: 0px!important;} .mt1 {margin-top: 1px!important;} .mt2 {margin-top: 2px!important;} .mt3 {margin-top: 3px!important;} .mt4 {margin-top: 4px!important;} .mt5 {margin-top: 5px!important;} .mt10 {margin-top: 10px!important;} .mt15 {margin-top: 15px!important;} .mt20 {margin-top: 20px!important;} .mt25 {margin-top: 25px!important;} .mt30 {margin-top: 30px!important;} .mt35 {margin-top: 35px!important;} .mt40 {margin-top: 40px!important;}
                      .mr0 {margin-right: 0px!important;} .mr1 {margin-right: 1px!important;} .mr2 {margin-right: 2px!important;} .mr3 {margin-right: 3px!important;} .mr4 {margin-right: 4px!important;} .mr5 {margin-right: 5px!important;} .mr10 {margin-right: 10px!important;} .mr15 {margin-right: 15px!important;} .mr20 {margin-right: 20px!important;} .mr25 {margin-right: 25px!important;} .mr30 {margin-right: 30px!important;} .mr35 {margin-right: 35px!important;} .mr40 {margin-right: 40px!important;}
                      .mb0 {margin-bottom: 0px!important;} .mb1 {margin-bottom: 1px!important;} .mb2 {margin-bottom: 2px!important;} .mb3 {margin-bottom: 3px!important;} .mb4 {margin-bottom: 4px!important;} .mb5 {margin-bottom: 5px!important;} .mb10 {margin-bottom: 10px!important;} .mb15 {margin-bottom: 15px!important;} .mb20 {margin-bottom: 20px!important;} .mb25 {margin-bottom: 25px!important;} .mb30 {margin-bottom: 30px!important;} .mb35 {margin-bottom: 35px!important;} .mb40 {margin-bottom: 40px!important;}
                      .ml0 {margin-left: 0px!important;} .ml1 {margin-left: 1px!important;} .ml2 {margin-left: 2px!important;} .ml3 {margin-left: 3px!important;} .ml4 {margin-left: 4px!important;} .ml5 {margin-left: 5px!important;} .ml10 {margin-left: 10px!important;} .ml15 {margin-left: 15px!important;} .ml20 {margin-left: 20px!important;} .ml25 {margin-left: 25px!important;} .ml30 {margin-left: 30px!important;} .ml35 {margin-left: 35px!important;} .ml40 {margin-left: 40px!important;}

                      .pt0 {padding-top: 0px!important;} .pt1 {padding-top: 1px!important;} .pt2 {padding-top: 2px!important;} .pt3 {padding-top: 3px!important;} .pt4 {padding-top: 4px!important;} .pt5 {padding-top: 5px!important;} .pt10 {padding-top: 10px!important;} .pt15 {padding-top: 15px!important;} .pt20 {padding-top: 20px!important;} .pt25 {padding-top: 25px!important;} .pt30 {padding-top: 30px!important;} .pt35 {padding-top: 35px!important;} .pt40 {padding-top: 40px!important;}
                      .pr0 {padding-right: 0px!important;} .pr1 {padding-right: 1px!important;} .pr2 {padding-right: 2px!important;} .pr3 {padding-right: 3px!important;} .pr4 {padding-right: 4px!important;} .pr5 {padding-right: 5px!important;} .pr10 {padding-right: 10px!important;} .pr15 {padding-right: 15px!important;} .pr20 {padding-right: 20px!important;} .pr25 {padding-right: 25px!important;} .pr30 {padding-right: 30px!important;} .pr35 {padding-right: 35px!important;} .pr40 {padding-right: 40px!important;}
                      .pb0 {padding-bottom: 0px!important;} .pb1 {padding-bottom: 1px!important;} .pb2 {padding-bottom: 2px!important;} .pb3 {padding-bottom: 3px!important;} .pb4 {padding-bottom: 4px!important;} .pb5 {padding-bottom: 5px!important;} .pb10 {padding-bottom: 10px!important;} .pb15 {padding-bottom: 15px!important;} .pb20 {padding-bottom: 20px!important;} .pb25 {padding-bottom: 25px!important;} .pb30 {padding-bottom: 30px!important;} .pb35 {padding-bottom: 35px!important;} .pb40 {padding-bottom: 40px!important;}
                      .pl0 {padding-left: 0px!important;} .pl1 {padding-left: 1px!important;} .pl2 {padding-left: 2px!important;} .pl3 {padding-left: 3px!important;} .pl4 {padding-left: 4px!important;} .pl5 {padding-left: 5px!important;} .pl10 {padding-left: 10px!important;} .pl15 {padding-left: 15px!important;} .pl20 {padding-left: 20px!important;} .pl25 {padding-left: 25px!important;} .pl30 {padding-left: 30px!important;} .pl35 {padding-left: 35px!important;} .pl40 {padding-left: 40px!important;}

                      .borderedBox { padding:5px 10px; border:1px solid #000000; margin-bottom:20px; min-height:40px; }
                      .boxLabel { font-weight:700; margin-bottom:5px; text-transform:uppercase; }
                      .boxRemark { margin-top:-10px;font-style:italic; }

                      .checkBoxContainer { padding:0; display:inline-block; margin:3px 30px 3px 0; position:relative; height:25px; min-width:160px; }
                      .checkBoxContainer.columnsCount_1 { min-width:100%; margin-right:0; }
                      .checkBoxContainer.columnsCount_2 { min-width:380px; margin-right:0; }
                      .checkBoxContainer.columnsCount_3 { min-width:255px; margin-right:0; }

                      .singleCheckBox { padding:0; width:10mm; height:6mm; border:1px solid #000000; display:inline-block; margin:0 2mm 0 0; position:absolute; top:0; left:0; text-align:center; line-height:22px; font-size:21px; font-weight:700; color:#0b8200; }
                      .singleCheckBoxLabel { display: inline-block; position: absolute; top: 4px; left: 12mm; }

                      .medicationTable { margin-top:20px; }
                      .medicationTableHeader { text-transform:uppercase; font-weight:700; margin-bottom:10px; margin-top:20px; }

                      .medicationsContainer {}
                      .singleMedicationContainer { margin-bottom:10px;  border:2px solid #2b4e8d; /* background-color:#f7fbf7; */ }

                      .medicationPosology { border:1px dashed #000; }
                      .posologyHeader { text-transform:uppercase; }
                      .posologyFrequency { text-decoration:underline }

                      .posologyContent {}
                      .posologyTable { width:100%; padding:0; margin:0; font-family: Arial, Helvetica, sans-serif; line-height:1em; font-size:12px; border-collapse: collapse; }
                      .posologyTable tr { padding:0; margin:0 }
                      .posologyTable tr th, .posologyTable tr td { padding:5px; margin:0; vertical-align:top; border:1px solid #007504; }
                      .posologyTable tr th { text-align:left; background-color:#e0e0e0; padding:10px 5px 10px 5px; }

                  </style>
                  </head>
                  <body>
      `
  }

  _getPdfPrintingCommonData(inputData) {

      let pdfPrintingData = {
          patientData: {
              id: _.trim(_.get(this.patient, "id", "")),
              lastName: _.get(this.patient, "lastName", ""),
              firstName: _.get(this.patient, "firstName", ""),
              addressData:
                  _.chain(_.get(this.patient, "addresses", {})).filter({addressType: "home"}).head().value() ||
                  _.chain(_.get(this.patient, "addresses", {})).filter({addressType: "work"}).head().value() ||
                  _.chain(_.get(this.patient, "addresses", {})).head().value() ||
                  {},
              ssin: this.api.formatSsinNumber(_.get(this.patient, "ssin", "")),
              insuranceData: _
                  .chain(_.get(this.patient, "insurabilities", {}))
                  .filter((i) => {
                      return i &&
                          !!moment(_.trim(_.get(i, "startDate", "0")), "YYYYMMDD").isBefore(moment()) &&
                          (!!moment(_.trim(_.get(i, "endDate", "0")), "YYYYMMDD").isAfter(moment()) || !_.trim(_.get(i, "endDate", ""))) &&
                          !!_.trim(_.get(i, "insuranceId", "")) &&
                          !!_.trim(_.get(i, "identificationNumber", ""))
                  })
                  .head()
                  .value(),
              gender: this.localize(_.trim(_.get(this.patient, "gender", "male")) + "GenderLong", this.language),
              birthDate: parseInt(_.get(this.patient, "dateOfBirth", 0)) ? moment(_.trim(_.get(this.patient, "dateOfBirth")), "YYYYMMDD").format("DD/MM/YYYY") : "-"
          },
          hcpData: {
              id: _.trim(_.get(this.globalHcp, "id", "")),
              address:
                  _.chain(_.get(this.globalHcp, "addresses", {})).filter({addressType: "work"}).head().value() ||
                  _.chain(_.get(this.globalHcp, "addresses", {})).filter({addressType: "home"}).head().value() ||
                  _.chain(_.get(this.globalHcp, "addresses", {})).head().value() ||
                  {},
              lastName: _.trim(_.get(this.globalHcp, "lastName", "")).toUpperCase(),
              firstName: _.trim(_.get(this.globalHcp, "firstName", "")),
              nihii: this.api.formatInamiNumber(_.trim(_.get(this.globalHcp, "nihii", ""))),
              telecoms: _.assign(
                  {},
                  _.filter(
                      _
                          .chain(
                              _.chain(_.get(this.globalHcp, "addresses", {})).filter({addressType: "work"}).head().value() ||
                              _.chain(_.get(this.globalHcp, "addresses", {})).filter({addressType: "home"}).head().value() ||
                              _.chain(_.get(this.globalHcp, "addresses", {})).head().value() ||
                              {}
                          )
                          .get("telecoms", [])
                          .value(),
                      (telecom) => {
                          return {
                              type: _.get(telecom, "telecomType", ""),
                              value: _.get(telecom, "telecomNumber", "")
                          }
                      }
                  )
              )
          }
      }

      return new Promise((resolve) => {

          return Promise.all(_.map(_.get(inputData, "codesToFind", []), (i) => this.api.code().findCodes("be", i)))
              .then(codesResults => {
                  pdfPrintingData.foundCodes = _.get(pdfPrintingData, "foundCodes", []);
                  _.map(codesResults, (nthPromiseResults, k) => {
                      pdfPrintingData.foundCodes.push({
                          code: _.get(inputData, "codesToFind[" + k + "]", false),
                          values: nthPromiseResults
                      })
                  });
              })
              .catch(e => {
                  console.log("CATCH");
                  console.log(e)
              })
              .finally(() => {
                  pdfPrintingData = _.assign(inputData, pdfPrintingData)
                  return new Promise((resolve) => {
                      return new Promise((resolve) => {
                          return this.api.insurance().getInsurance(_.get(pdfPrintingData, "patientData.insuranceData.insuranceId", ""))
                              .then(singleInsuranceData => {
                                  pdfPrintingData.patientData.insuranceData = _.assign(
                                      {
                                          code: _.get(singleInsuranceData, "code", "<NA>"),
                                          name: _.get(singleInsuranceData, "name." + this.language, "") || _.trim(_.head(_.filter(_.get(singleInsuranceData, "name", ""), _.trim))) || "<NA>"
                                      },
                                      pdfPrintingData.patientData.insuranceData
                                  )
                                  return resolve({})
                              })
                              .catch((e) => {
                                  return resolve({});
                              });
                      })
                          .then(() => resolve(_.assign(inputData, pdfPrintingData)))
                          .catch(() => resolve(_.assign(inputData, pdfPrintingData)));
                  })
              }).then(() => resolve(pdfPrintingData))
      })

  }

  _getFormCheckboxesAndLabelHtmlCode(inputData, columnsCount = false) {
      return _.trim(
          _.map((_.filter(inputData, (i) => {
              return _.trim(_.get(i, "type", "")) !== "TKString" && _.trim(_.get(i, "type", "")) !== "TKMedicationTable" && _.trim(_.get(i, "type", "")) !== "TKMedication"
          }) || []), (v) => {
              return '<div class="checkBoxContainer columnsCount_' + parseInt(columnsCount) + '">' +
                  '<span class="singleCheckBox">' +
                  (
                      (
                          (_.trim(_.get(v, "type", "")) === "TKBoolean" && !!v.value) ? "X" :
                              (_.trim(_.get(v, "type", "")) !== "TKBoolean" && _.trim(v.value) && _.trim(v.value) !== '-' && _.trim(v.value) !== 'NA') ? "X" :
                                  ""
                      )
                  ) +
                  '</span>' +
                  '<span class="singleCheckBoxLabel">' +
                  v.label +
                  (_.trim(v.type) === "TKNumber" ? ": " + _.trim(_.get(v, "value", "")) : "") +
                  (_.trim(v.type) === "TKMeasure" ? ": " + _.trim(_.get(v, "value", "")) : "") +
                  (_.trim(v.type) === "TKDate" ? ": " + moment(_.trim(_.get(v, "value", "")), "YYYYMMDD").format("DD/MM/YYYY") : "") +
                  '</span>' +
                  '</div>'
          }).join("") +
          _.map((_.filter(inputData, (i) => {
              return _.trim(_.get(i, "type", "")) === "TKString"
          }) || []), (v) => {
              return (_.trim(_.get(v, "value", "")) && _.trim(_.get(v, "value", "")) !== '-') ? "<p class='otherChoiceFreeText mt5 mb0 pb0'><b>" + (_.trim(_.get(v, "label", "")) ? _.trim(_.get(v, "label", "")) : _.trim(_.get(v, "name", ""))) + ":</b> " + _.trim(_.get(v, "value", "")) + "</p>" : ""
          }).join("") +
          _.trim(this._getMedicationTableHtmlCode(_.head((_.filter(inputData, (i) => {
              return _.trim(_.get(i, "type", "")) === "TKMedicationTable" || _.trim(_.get(i, "type", "")) === "TKMedication"
          }) || []))))
      )
  }

  _getMedicationTableHtmlCode(inputData) {

      if (!inputData || !_.size(inputData) || !_.size(_.get(inputData, "value"))) return;

      let contentToReturn = `
          <div class="medicationTable">
              <div class="medicationTableHeader">` + _.get(inputData, "label", "") + `</div>
              <div class="medicationsContainer">
      `;

      contentToReturn += _.compact(
          _.map(
              _.get(inputData, "value", []),
              (TKMedicationTable => {

                  const medicationValue = _.get(TKMedicationTable, "content." + this.language + ".medicationValue", false) || _.get(TKMedicationTable, "content.en.medicationValue", false) || _.get(TKMedicationTable, "content.fr.medicationValue", false) || _.get(TKMedicationTable, "content.nl.medicationValue", false)
                  const medictionIntendedName = _.get(medicationValue, "medicinalProduct.intendedname", "")
                  const medictionIntendedCdsCode = _.get(medicationValue, "medicinalProduct.intendedcds[0].code", "")
                  const beginMoment = parseInt(_.get(medicationValue, "beginMoment", 0)) ? moment(_.get(medicationValue, "beginMoment") + "").format("DD/MM/YYYY") : false;
                  const endMoment = parseInt(_.get(medicationValue, "endMoment", 0)) ? moment(_.get(medicationValue, "endMoment") + "").format("DD/MM/YYYY") : false;

                  if (!medicationValue || !medictionIntendedName) return false;

                  const regimenDailyFrequencies = _.filter(_.get(medicationValue, "regimen", []), {frequency: "daily"});
                  const regimenWeeklyFrequencies = _.filter(_.get(medicationValue, "regimen", []), {frequency: "weekly"});
                  const regimenMonthlyFrequencies = _.filter(_.get(medicationValue, "regimen", []), {frequency: "monthly"});

                  return `
                      <div class="singleMedicationContainer pt10 pr10 pb10 pl10">
                          <div class="medicationHeader">
                              <p class="mt0 mb10"><span class="bold">- ` + medictionIntendedName + ` <em class="fw400 ml5">(code: ` + (_.trim(medictionIntendedCdsCode) || "-") + `)</em></span></p>
                              ` + (((beginMoment || beginMoment) && beginMoment !== beginMoment) ? '<p class="mt5 mb10"><span class="bold">- ' + this.localize("date", this.language) + ':</span> ' + this.localize("startingFrom", this.language) + ' ' + (beginMoment || '-') + (endMoment ? ', ' + this.localize("endingOn", this.language) + ' ' + endMoment : '') + '</p>' : '') + `
                              ` + (_.size(_.get(medicationValue, "renewal", [])) ? '<p class="mt5 mb10"><span class="bold">- ' + this.localize("renewal", this.language) + ':</span> ' + _.get(medicationValue, "renewal.decimal", 1) + 'x / ' + _.get(medicationValue, "renewal.duration.value", 1) + ' ' + _.get(medicationValue, "renewal.duration.unit.label." + this.language, _.get(medicationValue, "renewal.duration.unit.label.en", "-")) + '</p>' : '') + `
                              <p class="mt5 mb10"><span class="bold">- ` + this.localize("substitution", this.language) + `:</span> ` + (_.get(medicationValue, "substitutionAllowed", false) ? this.localize("subtitutionForbidden", this.language) : this.localize("subtitutionAllowed", this.language)) + `</p>
                          </div>` +
                      (
                          !_.size(regimenDailyFrequencies) && !_.size(regimenWeeklyFrequencies) && !_.size(regimenMonthlyFrequencies) ?
                              "" :
                              '<div class="medicationPosology mt10 pt10 pr10 pb10 pl10 ">' +
                              (
                                  !_.size(regimenDailyFrequencies) ?
                                      "" :
                                      `
                                              <div class="posologyHeader bold mt10 mb5 fl">` + this.localize("dailyPosology", this.language) + `:</div><div class="fr mt10"><em>` + medictionIntendedName + `</em></div><div class="clear"></div>
                                              <div class="posologyContent mb10">
                                                  <table class="posologyTable" cellspacing="0" cellpadding="0">
                                                      <thead><tr><th style="width:120px" class="alignCenter">` + this.localize("qua", this.language) + `</th><th style="width:120px" class="alignCenter">` + this.localize("uni", this.language) + `</th><th>` + this.localize("momentHour", this.language) + `</th></tr></thead>
                                                      <tbody>` + _.map(
                                      regimenDailyFrequencies,
                                      (singleFrequency => {
                                          return "<tr><td class='alignCenter'>" +
                                              (_.trim(_.get(singleFrequency, "administratedQuantity.quantity", "")) || "-") + "</td><td class='alignCenter'>" +
                                              (_.trim(_.get(singleFrequency, "administratedQuantity.unit", "")) || "-") + "</td><td>" +
                                              (
                                                  _.trim(_.get(singleFrequency, "dayPeriod.code", "")) === "custom" ?
                                                      _.trim(_.get(singleFrequency, "timeOfDay", "")).slice(0, 2) + ":" + _.trim(_.get(singleFrequency, "timeOfDay", "")).slice(2, 4) :
                                                      _.trim(this.localize("ms_" + _.trim(_.get(singleFrequency, "dayPeriod.code", "")), this.language)) || _.trim(_.get(singleFrequency, "dayPeriod.code", "")) || "-"
                                              ) + "</td></tr>"
                                      })
                                      ).join(" ") + `
                                                      </tbody>
                                                  </table>
                                              </div>
                                          `
                              ) + (
                                  !_.size(regimenWeeklyFrequencies) ?
                                      "" :
                                      `
                                              <div class="posologyHeader bold mt10 mb5 fl">` + this.localize("weeklyPosology", this.language) + `:</div><div class="fr mt10"><em>` + medictionIntendedName + `</em></div><div class="clear"></div>
                                              <div class="posologyContent mb10">
                                                  <table class="posologyTable" cellspacing="0" cellpadding="0">
                                                      <thead><tr><th style="width:120px" class="alignCenter">` + this.localize("qua", this.language) + `</th><th style="width:120px" class="alignCenter">` + this.localize("uni", this.language) + `</th><th style="width:140px">` + this.localize("dayOfWeek", this.language) + `</th><th>` + this.localize("momentHour", this.language) + `</th></tr></thead>
                                                      <tbody>` + _.map(
                                      regimenWeeklyFrequencies,
                                      (singleFrequency => {
                                          return "<tr><td class='alignCenter'>" +
                                              (_.trim(_.get(singleFrequency, "administratedQuantity.quantity", "")) || "-") + "</td><td class='alignCenter'>" +
                                              (_.trim(_.get(singleFrequency, "administratedQuantity.unit", "")) || "-") + "</td><td class='alignCenter'>" +
                                              (_.trim(_.get(singleFrequency, "administratedQuantity.day", "")) && this.localize(_.trim(_.get(singleFrequency, "administratedQuantity.day", "")), this.language) ? this.localize(_.trim(_.get(singleFrequency, "administratedQuantity.day", "")), this.language) : _.trim(_.get(singleFrequency, "administratedQuantity.day", ""))) + "</td><td>" +
                                              (_.trim(_.get(singleFrequency, "dayPeriod.code", "")) ? _.trim(this.localize("ms_" + _.trim(_.get(singleFrequency, "dayPeriod.code", "")), this.language)) : _.trim(_.get(singleFrequency, "dayPeriod.code", "")) || "-") + "</td></tr>"
                                      })
                                      ).join(" ") + `
                                                      </tbody>
                                                  </table>
                                              </div>
                                          `
                              ) + (
                                  !_.size(regimenMonthlyFrequencies) ?
                                      "" :
                                      `
                                              <div class="posologyHeader bold mt10 mb5 fl">` + this.localize("monthlyPosology", this.language) + `:</div><div class="fr mt10"><em>` + medictionIntendedName + `</em></div><div class="clear"></div>
                                              <div class="posologyContent mb10">
                                                  <table class="posologyTable" cellspacing="0" cellpadding="0">
                                                      <thead><tr><th style="width:120px" class="alignCenter">` + this.localize("qua", this.language) + `</th><th style="width:120px" class="alignCenter">` + this.localize("uni", this.language) + `</th><th style="width:140px" class="alignCenter">` + this.localize("dayOfMonth", this.language) + `</th><th>` + this.localize("momentHour", this.language) + `</th></tr></thead>
                                                      <tbody>` + _.map(
                                      regimenMonthlyFrequencies,
                                      (singleFrequency => {
                                          return "<tr><td class='alignCenter'>" +
                                              (_.trim(_.get(singleFrequency, "administratedQuantity.quantity", "")) || "-") + "</td><td class='alignCenter'>" +
                                              (_.trim(_.get(singleFrequency, "administratedQuantity.unit", "")) || "-") + "</td><td class='alignCenter'>" +
                                              (parseInt(_.get(singleFrequency, "administratedQuantity.time", 0)) ? moment(_.trim(_.get(singleFrequency, "administratedQuantity.time")) + "").format("DD") : "-") + "</td><td>" +
                                              (_.trim(_.get(singleFrequency, "dayPeriod.code", "")) ? _.trim(this.localize("ms_" + _.trim(_.get(singleFrequency, "dayPeriod.code", "")), this.language)) : _.trim(_.get(singleFrequency, "dayPeriod.code", "")) || "-") + "</td></tr>"
                                      })
                                      ).join(" ") + `
                                                      </tbody>
                                                  </table>
                                              </div>
                                          `
                              ) +
                              '</div>'
                      ) +
                      "</div>"
              })
          )
      ).join(" ")

      contentToReturn += `
              </div>
          </div>
      `;

      return contentToReturn;

  }

  _getPatientVignetteHtmlCode(inputData) {
      return `
          <div class="boxLabel">` + this.localize("idPatient", this.language) + ` <span class="fw400">(<i>` + this.localize("fillInOrVignette", this.language) + `</i>)</span></div>
          <div class="borderedBox">
              <b>` + this.localize("lastAndFirstName", this.language) + `:</b> ` + inputData.lastName + ` ` + inputData.firstName + ` &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <b>` + this.localize("adrAbreviation", this.language) + `:</b> ` +
          _.trim(_.compact([
              _.get(inputData.addressData, "street", "") + " ",
              _.get(inputData.addressData, "houseNumber", "") + (_.trim(_.get(inputData.addressData, "postboxNumber", "")) ? "/" + _.trim(_.get(inputData.addressData, "postboxNumber", "")) : ""),
              " - " + _.get(inputData.addressData, "postalCode", "") + " ",
              _.get(inputData.addressData, "city", "") + " ",
          ]).join(" "))
          + `<div class="clear mb10"></div>
              <b>` + this.localize("natNumber", this.language) + `:</b> ` + inputData.ssin + ` &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <b>` + this.localize("ct1ct2", this.language) + `:</b> ` + _.get(inputData.insuranceData, "parameters.tc1", "") + _.get(inputData.insuranceData, "parameters.tc2", "") + ` &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <b>` + this.localize("insNumber", this.language) + `:</b> ` + _.get(inputData.insuranceData, "code", "<NA>") + " - " + _.get(inputData.insuranceData, "name", "<NA>") + `<div class="clear mb10"></div>
              <b>` + this.localize("insMembershipNumber", this.language) + `:</b> ` + _.get(inputData.insuranceData, "identificationNumber") + ` &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <b>` + this.localize("sexLitteral", this.language) + `:</b> ` + _.get(inputData, "gender") + ` &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <b>` + this.localize("birthDate", this.language) + `:</b> ` + _.get(inputData, "birthDate") + `
          </div>
      `
  }

  _getDoctorDetailsHtmlCode(inputData) {
      return `
          <div class="boxLabel">` + this.localize("doctorDetails", this.language) + ` *</div>
          <div class="borderedBox">
              <div class="fl">
                  <b>` + this.localize("doctorAbreviation", this.language) + `</b> ` + inputData.lastName + ` ` + inputData.firstName + `<div class="clear mb10"></div>
                  <b>` + this.localize("postalAddress", this.language) + `</b>: ` + _.get(inputData.address, "street", "") + ` ` + _.get(inputData.address, "houseNumber", "") + (_.trim(_.get(inputData.address, "postboxNumber", "")) ? "/" + _.get(inputData.address, "postboxNumber", "") : "") + `<div class="clear mb10"></div>
                  <b>` + this.localize("zipHyphenCity", this.language) + `</b>: ` + _.get(inputData.address, "postalCode", "") + ` - ` + _.get(inputData.address, "city", "") + `<div class="clear mb10"></div>
                  <b>` + this.localize("inami", this.language) + `</b>: ` + _.trim(inputData.nihii) + `<div class="clear mb10"></div>
                  <b>` + this.localize("date", this.language) + `</b>: ` + moment().format('DD/MM/YYYY') + `
              </div>
              <div class="fr">
                  <b>` + this.localize("telAbreviation", this.language) + `</b>: ` + _.trim(_.get(_.head(_.filter(inputData.telecoms, {telecomType: "phone"})), "telecomNumber", "-")) + `<div class="clear mb10"></div>
                  <b>` + this.localize("mobile", this.language) + `</b>: ` + _.trim(_.get(_.head(_.filter(inputData.telecoms, {telecomType: "mobile"})), "telecomNumber", "-")) + `<div class="clear mb10"></div>
                  <b>E-mail</b>: ` + _.trim(_.get(_.head(_.filter(inputData.telecoms, {telecomType: "email"})), "telecomNumber", "-")) + `<div class="clear mb0"></div>
              </div>
              <div class="clear mb0"></div>
          </div>
          <div class="boxRemark">* ` + this.localize("doctorDetailsRemark", this.language) + `</div>
      `
  }

  _insertPageBreak(inputConfig) {
      return (
          this._getDoctorDetailsHtmlCode(inputConfig.hcpData) +
          '</div><div class="page"><h1 class="mb40">' + _.trim(inputConfig.h1) + '</h1>' +
          this._getPatientVignetteHtmlCode(inputConfig.patientData)
      );
  }

  _getLinkingLetterCssStyles() {
      return `
          .linkingLetter h1 { margin-bottom:5px }
          .linkingLetter h5 { margin-top:0px; text-decoration:none; font-weight:400 }
          .linkingLetter p { padding:0; margin:10px 0 10px 0; }
          .linkingLetter .tableWrapper { margin:-10px 0 0 0!important; }
          .linkingLetter table { border:0; border-collapse: collapse; }
          .linkingLetter table tr td { border:1px solid #000; font-size:13px; padding-top:0; padding-bottom:0 }
          .linkingLetter table tr td p { padding:0; margin:10px 0 10px 0; }
          .linkingLetter p:last-child { margin-top:-10px!important; }
          .linkingLetter table tr td p:last-child { margin-top:10px!important; }
      `
  }

  _createLinkingLettersProseTemplate() {
      const templateContent = '{"type":"doc","content":[{"type":"page","attrs":{"id":0},"content":[{"type":"heading","attrs":{"level":1,"align":"center"},"content":[{"type":"text","marks":[{"type":"strong"},{"type":"color","attrs":{"color":"rgb(13, 71, 161)"}},{"type":"font","attrs":{"font":"Roboto"}},{"type":"size","attrs":{"size":"24px"}}],"text":"LETTRE DE LIAISON"}]},{"type":"heading","attrs":{"level":5,"align":"center"},"content":[{"type":"variable","attrs":{ "expr":"dataProvider.getVariableValue(\\"todaysDate\\")" },"content":[]}]},{"type":"paragraph","attrs":{"align":"inherit"}},{"type":"table","content":[{"type":"table_row","content":[{"type":"table_cell","attrs":{"colspan":1,"rowspan":1,"colwidth":null,"borderColor":null,"background":null},"content":[{"type":"paragraph","attrs":{"align":"inherit"},"content":[{"type":"text","marks":[{"type":"strong"}],"text":"MÉDECIN ÉMETEUR"}]},{"type":"paragraph","attrs":{"align":"inherit"},"content":[{"type":"variable","attrs":{ "expr":"dataProvider.getLocalizedText(\\"doctorAbreviation\\")" },"content":[]},{ "type":"text", "text":" " },{"type":"variable","attrs":{ "expr":"dataProvider.getVariableValue(\\"senderHcpFirstName\\")" },"content":[]},{ "type":"text", "text":" " },{"type":"variable","attrs":{ "expr":"dataProvider.getVariableValue(\\"senderHcpLastName\\")" },"content":[]}]},{"type":"paragraph","attrs":{"align":"inherit"},"content":[{"type":"variable","attrs":{ "expr":"dataProvider.getVariableValue(\\"senderHcpAddress\\")" },"content":[]}]},{"type":"paragraph","attrs":{"align":"inherit"},"content":[{"type":"variable","attrs":{ "expr":"dataProvider.getVariableValue(\\"senderHcpZipCity\\")" },"content":[]}]},{"type":"paragraph","attrs":{"align":"inherit"},"content":[{"type":"text","text":"INAMI: "},{"type":"variable","attrs":{ "expr":"dataProvider.getVariableValue(\\"senderHcpNihii\\")" },"content":[]}]},{"type":"paragraph","attrs":{"align":"inherit"},"content":[{"type":"text","text":"Tel: "},{"type":"variable","attrs":{ "expr":"dataProvider.getVariableValue(\\"senderHcpTelOrMobile\\")" },"content":[]}]},{"type":"paragraph","attrs":{"align":"inherit"},"content":[{"type":"text","text":"E-mail: "},{"type":"variable","attrs":{ "expr":"dataProvider.getVariableValue(\\"senderHcpEmail\\")" },"content":[]}]}]},{"type":"table_cell","attrs":{"colspan":1,"rowspan":1,"colwidth":null,"borderColor":null,"background":null},"content":[{"type":"paragraph","attrs":{"align":"inherit"},"content":[{"type":"text","marks":[{"type":"strong"}],"text":"MÉDECIN RECEVEUR"}]},{"type":"paragraph","attrs":{"align":"inherit"},"content":[{"type":"text","text":" "}]}]}]}]},{"type":"paragraph","attrs":{"align":"inherit"}},{"type":"paragraph","attrs":{"align":"inherit"},"content":[{"type":"text","marks":[{"type":"strong"}],"text":"IDENTIFICATION DU PATIENT"}]},{"type":"table","content":[{"type":"table_row","content":[{"type":"table_cell","attrs":{"colspan":1,"rowspan":1,"colwidth":null,"borderColor":null,"background":null},"content":[{"type":"paragraph","attrs":{"align":"inherit"},"content":[{"type":"text","marks":[{"type":"strong"}],"text":"Nom et prénom: "},{"type":"variable","attrs":{ "expr":"dataProvider.getVariableValue(\\"patientLastName\\")" },"content":[]},{"type":"text","text":" "},{"type":"variable","attrs":{ "expr":"dataProvider.getVariableValue(\\"patientFirstName\\")" },"content":[]},{"type":"text","marks":[{"type":"strong"}],"text":" - Adresse: "},{"type":"variable","attrs":{ "expr":"dataProvider.getVariableValue(\\"patientAddress\\")" },"content":[]}]},{"type":"paragraph","attrs":{"align":"inherit"},"content":[{"type":"text","marks":[{"type":"strong"}],"text":"N° nat: "},{"type":"variable","attrs":{ "expr":"dataProvider.getVariableValue(\\"patientNiss\\")" },"content":[]},{"type":"text","marks":[{"type":"strong"}],"text":" - Ct1/Ct2: "},{"type":"variable","attrs":{ "expr":"dataProvider.getVariableValue(\\"patientCt1Ct2\\")" },"content":[]},{"type":"text","marks":[{"type":"strong"}],"text":" - N° mut: "},{"type":"variable","attrs":{ "expr":"dataProvider.getVariableValue(\\"patientInsCodeAndName\\")" },"content":[]}]},{"type":"paragraph","attrs":{"align":"inherit"},"content":[{"type":"text","marks":[{"type":"strong"}],"text":"N° aff mut: "},{"type":"variable","attrs":{ "expr":"dataProvider.getVariableValue(\\"patientInsMembershipNumber\\")" },"content":[]},{"type":"text","marks":[{"type":"strong"}],"text":" - Sexe: "},{"type":"variable","attrs":{ "expr":"dataProvider.getVariableValue(\\"patientSex\\")" },"content":[]},{"type":"text","marks":[{"type":"strong"}],"text":" - Date de naissance: "},{"type":"variable","attrs":{ "expr":"dataProvider.getVariableValue(\\"patientBirthDate\\")" },"content":[]}]}]}]}]},{"type":"paragraph","attrs":{ "align":"inherit" }},{"type":"paragraph","attrs":{ "align":"inherit" }},{"type":"paragraph","attrs":{ "align":"inherit" }},{"type":"paragraph","attrs":{ "align":"inherit" }},{"type":"paragraph","attrs":{ "align":"inherit" }},{"type":"paragraph","attrs":{ "align":"inherit" }},{"type":"paragraph","attrs":{ "align":"inherit" }},{"type":"paragraph","attrs":{ "align":"inherit" }},{"type":"paragraph","attrs":{ "align":"inherit" }},{"type":"paragraph","attrs":{"align":"right"},"content":[{"type":"variable","attrs":{ "expr":"dataProvider.getLocalizedText(\\"doctorAbreviation\\")" },"content":[]},{ "type":"text", "text":" " },{"type":"variable","attrs":{ "expr":"dataProvider.getVariableValue(\\"senderHcpFirstName\\")" },"content":[]},{ "type":"text", "text":" " },{"type":"variable","attrs":{ "expr":"dataProvider.getVariableValue(\\"senderHcpLastName\\")" },"content":[]}]},{"type":"paragraph","attrs":{"align":"right"},"content":[{"type":"text","marks":[{"type":"strong"}],"text":"INAMI: "},{"type":"variable","attrs":{ "expr":"dataProvider.getVariableValue(\\"senderHcpNihii\\")" },"content":[]}]}]}]}'
      this.api.doctemplate().createDocumentTemplate({
          created: "" + +new Date(),
          documentType: "template",
          mainUti: "proseTemplate.linkingLetter." + this.language,
          name: "Prose template (json) for linking letters between hcps",
      }).then(createDocTemplate => this.api.doctemplate().setAttachment(createDocTemplate.id, templateContent))
  }

  _printLinkingLetter(e) {

      // ONLY meant to create the doc template we'll be using
      // this._createLinkingLettersProseTemplate(); return;

      this.busySpinner = true;

      const proseEditor = this.root.querySelector("#prose-editor-linking-letter")
      const proseHtmlContent = proseEditor.$.container.innerHTML;

      this.api.pdfReport(this._getProsePdfHeader(this._getLinkingLetterCssStyles()) + this.api.rewriteTableColumnsWidth(proseHtmlContent) + this._getPdfFooter(), {type: "rapp-mail"})
          .then(({pdf: pdfFileContent, printed: printed}) => !printed && this.api.triggerFileDownload(
              pdfFileContent,
              "application/pdf",
              _.kebabCase(_.compact([
                  this.localize("linkingLetter", this.language),
                  this.linkingLetterDataProvider.getVariableValue("patientFirstName"),
                  this.linkingLetterDataProvider.getVariableValue("patientLastName"),
                  +new Date()
              ]).join(" ")) + ".pdf"
          ))
          .catch((e) => {
              console.log(e)
          })
          .finally(() => {
              this.busySpinner = false
          })

  }

  _saveLinkingLetter(e) {

      this.busySpinner = true;

      const proseEditor = this.root.querySelector("#prose-editor-linking-letter")
      const proseHtmlContent = proseEditor.$.container.innerHTML;
      const resourcesObject = {
          fileName: _.kebabCase(_.compact([
              this.localize("linkingLetter", this.language),
              this.linkingLetterDataProvider.getVariableValue("patientFirstName"),
              this.linkingLetterDataProvider.getVariableValue("patientLastName"),
              +new Date()
          ]).join(" ")) + ".pdf",
          documentMetas: {
              title: this.localize("linkingLetter", this.language),
              contactId: _.trim(_.get(this, "currentContact.id", "")),
              created: "" + +new Date(),
              patientId: _.trim(_.get(this.patient, "id", "")),
              hcpId: _.trim(this.linkingLetterDataProvider.getVariableValue("senderHcpId")),
              patientName: _.compact([this.linkingLetterDataProvider.getVariableValue("patientFirstName"), this.linkingLetterDataProvider.getVariableValue("patientLastName")]).join(" ")
          }
      }

      this.api.pdfReport(this._getProsePdfHeader(this._getLinkingLetterCssStyles()) + this.api.rewriteTableColumnsWidth(proseHtmlContent) + this._getPdfFooter(), {type: "rapp-mail"})
          .then(({pdf: pdfFileContent, printed: printed}) => !printed && _.assign({pdfFileContent: pdfFileContent}, resourcesObject))
          .then(resourcesObject => this.api.message().newInstanceWithPatient(this.user, this.patient)
              .then(newMessageInstance => _.assign({newMessageInstance: newMessageInstance}, resourcesObject))
              .then(resourcesObject => this.api.message().createMessage(
                  _.merge(
                      resourcesObject.newMessageInstance,
                      {
                          transportGuid: "LINKING-LETTER:PATIENT:ARCHIVE",
                          recipients: [_.get(this.user, 'healthcarePartyId', _.trim(this.user.id))],
                          metas: resourcesObject.documentMetas,
                          toAddresses: [_.get(this.user, 'email', _.get(this.user, 'healthcarePartyId', _.trim(this.user.id)))],
                          subject: resourcesObject.documentMetas.title
                      }
                  )
              ).then(createMessageResponse => _.assign({createMessageResponse: createMessageResponse}, resourcesObject)))
          )
          .then(resourcesObject => this.api.document().newInstance(
              this.user,
              resourcesObject.createMessageResponse,
              {
                  documentType: 'report',
                  mainUti: this.api.document().uti("application/pdf"),
                  name: resourcesObject.documentMetas.title + " - " + resourcesObject.documentMetas.patientName
              }
              ).then(newDocumentInstance => _.assign({newDocumentInstance: newDocumentInstance}, resourcesObject))
          )
          .then(resourcesObject => this.api.document().createDocument(resourcesObject.newDocumentInstance).then(createDocumentResponse => _.assign({createDocumentResponse: createDocumentResponse}, resourcesObject)))
          .then(resourcesObject => this.api.encryptDecryptFileContentByUserHcpIdAndDocumentObject("encrypt", this.user, resourcesObject.createDocumentResponse, resourcesObject.pdfFileContent).then(encryptedFileContent => _.assign({encryptedFileContent: encryptedFileContent}, resourcesObject)))
          .then(resourcesObject => this.api.document().setAttachment(resourcesObject.createDocumentResponse.id, null, resourcesObject.encryptedFileContent).then(setAttachmentResponse => _.assign({setAttachmentResponse: setAttachmentResponse}, resourcesObject)))
          .then(resourcesObject => {
              this._saveDocumentAsService({
                  documentId: _.trim(_.get(resourcesObject, "createDocumentResponse.id", "")),
                  stringValue: resourcesObject.documentMetas.title,
                  formId: "",
                  contactId: _.trim(_.get(this, "currentContact.id", ""))
              })
              return resourcesObject
          })
          .catch(e => {
              console.log(e)
          })
          .finally(() => {
              this.$['prose-editor-dialog-linking-letter'].close();
              this.busySpinner = false;
          })

  }

  writeLinkingLetter(e) {

      this.busySpinner = true;

      this.$['prose-editor-dialog-linking-letter'].open()
      const proseEditor = this.root.querySelector("#prose-editor-linking-letter")
      proseEditor.set("additionalCssClasses", "linkingLetter");

      this._getPdfPrintingCommonData({})
          .then(dpData => _.assign({dpData: dpData}, {}))
          .then(resourceObject => {

              this.linkingLetterDpData = resourceObject.dpData
              if (this.proseEditorLinkingLetterTemplateAlreadyApplied) return;

              return this.api.doctemplate().findDocumentTemplatesByDocumentType('template')
                  .then(docTemplates => _.get(_.filter(docTemplates, i => _.get(i, "mainUti", "") === "proseTemplate.linkingLetter." + this.language), "[0]", false) || _.get(_.filter(docTemplates, i => _.get(i, "mainUti", "") === "proseTemplate.linkingLetter.fr"), "[0]", {}))
                  .then(dt => {
                      return (dt && dt.id && dt.attachmentId) ? this.api.doctemplate().getAttachmentText(dt.id, dt.attachmentId).then(proseTemplate => {
                          this.proseEditorLinkingLetterTemplateAlreadyApplied = true;
                          proseEditor.setJSONContent(this.api.crypto().utils.ua2utf8(proseTemplate) || {})
                      }) : {}
                  })
                  .catch(e => console.log(e))

          })
          .catch(e => console.log(e))
          .finally(() => {
              this._refreshContextLinkingLetter();
              this._toggleAddActions();
              this.busySpinner = false;
          })

  }

  _getLinkingLetterDataProvider() {

      this.linkingLetterDataProvider = {

          getVariableValue: (value) => {
              return _.trim(
                  value === "todaysDate" ? this.localize('day_' + parseInt(moment().day()), this.language) + ` ` + moment().format('DD') + ` ` + (this.localize('month_' + parseInt(moment().format('M')), this.language)).toLowerCase() + ` ` + moment().format('YYYY') :
                      value === "senderHcpId" ? _.get(this.linkingLetterDpData, "hcpData.id", "") :
                          value === "senderHcpFirstName" ? _.get(this.linkingLetterDpData, "hcpData.firstName", "") :
                              value === "senderHcpLastName" ? _.get(this.linkingLetterDpData, "hcpData.lastName", "") :
                                  value === "senderHcpAddress" ? _.get(this.linkingLetterDpData, "hcpData.address.street", "") + " " + _.get(this.linkingLetterDpData, "hcpData.address.houseNumber", "") + (_.trim(_.get(this.linkingLetterDpData, "hcpData.address.postboxNumber", "")) ? " / " + _.get(this.linkingLetterDpData, "hcpData.address.postboxNumber", "") : "") :
                                      value === "senderHcpZipCity" ? _.get(this.linkingLetterDpData, "hcpData.address.postalCode", "") + " " + _.get(this.linkingLetterDpData, "hcpData.address.city", "") :
                                          value === "senderHcpNihii" ? _.get(this.linkingLetterDpData, "hcpData.nihii", "") :
                                              value === "senderHcpTelOrMobile" ? _.trim(_.get(_.filter(_.get(this.linkingLetterDpData, "hcpData.address.telecoms", {}), {telecomType: "phone"}), "[0].telecomNumber", "")) || _.trim(_.get(_.filter(_.get(this.linkingLetterDpData, "hcpData.address.telecoms", {}), {telecomType: "mobile"}), "[0].telecomNumber", "")) :
                                                  value === "senderHcpEmail" ? _.trim(_.get(_.filter(_.get(this.linkingLetterDpData, "hcpData.address.telecoms", {}), {telecomType: "email"}), "[0].telecomNumber", "-")) :
                                                      value === "patientFirstName" ? _.get(this.linkingLetterDpData, "patientData.firstName", "") :
                                                          value === "patientLastName" ? _.get(this.linkingLetterDpData, "patientData.lastName", "") :
                                                              value === "patientAddress" ? _.trim(_.compact([
                                                                      _.get(this.linkingLetterDpData, "patientData.addressData.street", "") + " ",
                                                                      _.get(this.linkingLetterDpData, "patientData.addressData.houseNumber", "") + (_.trim(_.get(this.linkingLetterDpData, "patientData.addressData.postboxNumber", "")) ? "/" + _.trim(_.get(this.linkingLetterDpData, "patientData.addressData.postboxNumber", "")) : ""),
                                                                      " - " + _.get(this.linkingLetterDpData, "patientData.addressData.postalCode", "") + " ",
                                                                      _.get(this.linkingLetterDpData, "patientData.addressData.city", "") + " ",
                                                                  ]).join(" ")) :
                                                                  value === "patientNiss" ? _.get(this.linkingLetterDpData, "patientData.ssin", "") :
                                                                      value === "patientCt1Ct2" ? _.get(this.linkingLetterDpData, "patientData.insuranceData.parameters.tc1", "") + "/" + _.get(this.linkingLetterDpData, "patientData.insuranceData.parameters.tc2", "") :
                                                                          value === "patientInsMembershipNumber" ? _.get(this.linkingLetterDpData, "patientData.insuranceData.identificationNumber", "") :
                                                                              value === "patientInsCodeAndName" ? _.get(this.linkingLetterDpData, "patientData.insuranceData.code", "") + " - " + _.get(this.linkingLetterDpData, "patientData.insuranceData.name", "") :
                                                                                  value === "patientSex" ? _.get(this.linkingLetterDpData, "patientData.gender", "") :
                                                                                      value === "patientBirthDate" ? _.get(this.linkingLetterDpData, "patientData.birthDate", "") :
                                                                                          ""
              )
          },

          getLocalizedText: (value) => {
              return this.localize(_.trim(value), "", this.language)
          }

      }

  }

  _openPopupMenu() {
      if (this.readOnly) {
          return;
      }
      this.shadowRoot.querySelector('#paper-menu-button').open();
  }

  sizePrintSubFormChanged(value) {
      const tab = ["DL", "A5"]
      this.set('traductValue', this.localize(tab[value], tab[value], this.language))
  }
}

customElements.define(HtPatDetailCtcDetailPanel.is, HtPatDetailCtcDetailPanel);
