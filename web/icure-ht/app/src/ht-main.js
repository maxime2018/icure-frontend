
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
import '@polymer/paper-button/paper-button.js'
import '@polymer/paper-dialog/paper-dialog.js'
import '@polymer/paper-icon-button/paper-icon-button.js'
import '@polymer/paper-input/paper-input.js'
import '@polymer/paper-item/paper-item.js'
import '@polymer/paper-listbox/paper-listbox.js'
import '@polymer/paper-menu-button/paper-menu-button.js'
import '@polymer/paper-tooltip/paper-tooltip.js'


import './elements/ht-spinner/ht-spinner.js';

import './shared-styles.js';
import './scrollbar-style.js';
import './spinner-style.js';
import './dialog-style.js';

// TODO 1 : collapse card

import moment from 'moment/src/moment';
import _ from 'lodash/lodash';
import * as models from 'icc-api/dist/icc-api/model/models';
import {TkLocalizerMixin} from "./elements/tk-localizer";
import {PolymerElement,html} from '@polymer/polymer/polymer-element.js';

class HtMain extends TkLocalizerMixin(PolymerElement) {
  static get template() {
    return html`
        <style include="iron-flex iron-flex-alignment"></style>
        <style include="shared-styles scrollbar-style spinner-style dialog-style">
            :host {
                display: block;
                padding: 12px 24px 24px;
                height: calc(100vh - 64px - 20px);
                box-sizing: border-box;
                --grid-columns: 1fr 1fr;
                --grid-rows: 1fr 1fr 1fr;
            }

            .grid-container {
                display: grid;
                width: 100%;
                height: calc(100% - 52px);
                grid-template-columns: var(--grid-columns);
                grid-template-rows: var(--grid-rows);

                grid-template-areas: var(--grid-layout);
                grid-column-gap: 24px;
                grid-row-gap: 24px;
            }

            .row {
                cursor: pointer;
            }

            .card {
                color: var(--app-text-color);
                background: var(--app-background-color);
                border-radius: 2px;
                @apply --shadow-elevation-2dp;
                overflow: auto;
                position: relative;
                z-index: 0;
                transition: all .24s cubic-bezier(0.075, 0.82, 0.165, 1);
            }

            .card-title-container {
                background: #ffffff;
                padding: 0 16px;
                display: flex;
                flex-flow: row wrap;
                justify-content: space-between;
                align-items: center;
                height: 56px;
                box-sizing: border-box;
            }

            .card-title {
                display: flex;
                flex-grow: 1;
                padding: 0;
                margin: 0;
                font-size: 16px;
                font-weight: bold;
                text-align: center;
                color: var(--app-text-color);
            }

            .card-title-container paper-icon-button {
                color: rgba(0, 0, 0, 0);
                height: 20px;
                width: 20px;
                padding: 2px;
                transition: all .24s cubic-bezier(0.075, 0.82, 0.165, 1);
            }

            .card:hover .card-title-container paper-icon-button {
                color: var(--app-text-color-disabled);
                padding: 0;
            }

            .card-body {
                display: block;
                padding: 16px;
                height: calc(100% - 88px);
                overflow: auto;
                position: relative;
            }

            .consultations-list {
                margin: 8px;
                width: calc(100% - 16px);
            }

            .row {
                width: 100%;
                display: flex;
                flex-direction: row;
                justify-content: space-around;
                align-items: center;
                flex-wrap: nowrap;
                margin-bottom: 24px;
            }

            .row:last-child {
                margin-bottom: 0;
            }

            .consultations-patient-photo {
                background: rgba(0, 0, 0, 0.1);
                height: 26px;
                width: 26px;
                border-radius: 50%;
                margin-right: 8px;
                overflow: hidden;
            }

            .consultations-patient-photo img {
                width: 100%;
                margin: 50%;
                transform: translate(-50%, -50%);
            }

            .consultations-patient-name {
                font-size: 14px;
                font-weight: bold;
                margin-right: 16px;
                text-transform: capitalize;
            }

            .consultations-message-texte {
                font-size: 14px;
                margin-right: 16px;
            }

            .consultations-patient-type {
                color: var(--app-secondary-color);
                font-size: 14px;
                margin-right: 16px;
            }

            .divider {
                border-bottom: 1px solid lightgrey;
                flex-grow: 7;
            }

            .consultations-time {
                font-size: 14px;
                text-align: right;
                margin-left: 16px;
            }

            .card-table-header {
                font-size: 10px;
                text-transform: uppercase;
                text-align: left;
            }

            .card-table-header.row {
                margin-bottom: 12px;
                position: sticky;
                top: -16px;
                background: var(--app-background-color);
                z-index: 1;
                border-bottom: 1px dotted var(--app-background-color-dark);
                padding: 4px 0;
            }

            .card-table-header div, .card-table-cell {
                width: 50%;
            }

            .card-header-cell--date, .card-table-cell--date {
                width: 20% !important;
            }


            .card-table-row {
                width: 100%;
            }

            .todo-card paper-listbox paper-item {
                padding: 0;
            }

            .card-table-cell {
                font-size: 14px;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
                text-align: left;
                padding-right: 8px;
            }

            .card-table-header div.lab-name, .card-table-cell.lab-name {
                padding-left: 8px;
                box-sizing: border-box;
                width: 35%;
            }

            .card-table-header div.main-cell, .card-table-cell.main-cell {
                width: 55%;
            }

            .card-table-cell.main-cell, div.card-table-cell.unread {
                display: flex;
                flex-direction: row;
                flex-wrap: nowrap;
                align-items: center;
                font-size: 14px;
                font-weight: 600;
            }

            .card-table-cell:first-child {
                justify-content: flex-start;
            }

            .card-table-row {
                justify-content: space-around;
                flex-wrap: nowrap;
                height: 48px;
                margin: 0;
                border-bottom: 1px solid var(--app-background-color-dark);
            }

            .card-table-row:hover {
                background-color: var(--app-background-color-dark);
            }


            .latest-patients-row {
                justify-content: flex-start;
            }

            .latest-patients-row:hover .consultations-patient-name,
            .latest-patients-row:hover .consultations-time,
            .latest-consultations-row:hover .consultations-patient-name,
            .latest-consultations-row:hover .consultations-time {
                text-shadow: 0 0 1px rgba(0, 0, 0, 0.3);
            }

            .latest-consultations-row {
                justify-content: flex-start;
            }

            .patient-dateofbirth {
                color: var(--app-text-color-disabled);
                font-weight: 400;
                font-size: 14px;
                font-style: italic;
            }

            .patient-age {
                color: var(--app-text-color-disabled);
                font-weight: 400;
                font-size: 14px;
                font-style: italic;
                text-transform: lowercase;
            }

            #latestPatientsWidget, #todaysConsultationsWidget, #latestLabResultsWidget, #todoWidget {
                /* --columns: 1;
                --rows: 1;
                --row: 0;
                --col: 0; */
                /* grid-area: var(--row) / var(--col) / span var(--rows) / span var(--columns); */
                grid-area: var(--area);
            }

            a {
                text-decoration: none;
                color: var(--app-text-color);
            }

            paper-checkbox {
                --paper-checkbox-unchecked-color: var(--app-text-color);
                --paper-checkbox-label-color: var(--app-text-color);
                --paper-checkbox-checked-color: var(--app-secondary-color);
                --paper-checkbox-checked-ink-color: var(--app-secondary-color-dark);
            }

            paper-listbox {
                --paper-listbox-background-color: red;
                background: transparent;
                padding: 0;
            }

            paper-item {
                outline: 0;
                background: var(--app-background-color);
            }

            h1 span.notif {
                display: inline-block;
                margin-left: 6px;
                margin-bottom: 8px;
                border-radius: 4px;
                padding: 0 4px;
                color: white;
                background-color: var(--app-secondary-color);
            }


            @media (max-width: 1024px) {
                .grid-container {
                    /* display:grid; */
                    /* width:100%;
                    height:100%; */
                    /* grid-template-columns: 1fr 1fr 1fr 1fr;
                    grid-template-rows: 1fr 1fr; */
                    grid-column-gap: 12px;
                    grid-row-gap: 12px;
                }

                .card {
                    overflow: hidden;
                }

                .card-body {
                    overflow-x: hidden;
                    overflow-y: scroll;
                }

                .card-table-cell .consultations-patient-photo, .todays-consultations .consultations-patient-photo {
                    display: none;
                }

                .card-table-cell:first-child {
                    text-align: left;
                    display: block;
                    font-weight: 600;
                }

                .consultations-list {
                    width: 100%;
                    margin: 0;
                }

                .card-table-header.row {
                    top: 0;
                }

            }

            @media (max-width: 950px) {
                .grid-container {
                    height: calc(3 * 50%);
                    padding-bottom: 24px;
                }

                .layout-buttons paper-icon-button {
                    display: none;
                }
            }

            @media (max-width: 600px) {
                .grid-container {
                    height: calc(6 * 50%);
                }
            }

            .spinner {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
            }

            .layout-buttons {
                display: flex;
                flex-flow: row wrap;
                justify-content: flex-end;
                align-items: center;
                margin: 0 0 12px;
            }

            .layout-buttons paper-icon-button {
                --paper-icon-button: {
                    color: var(--app-text-color-disabled);
                    border-radius: 50%;
                };
                --paper-icon-button-hover: {
                    color: var(--app-text-color-dark);
                    background-color: var(--app-background-color-dark);
                }
            }


            #layoutDialog, #widgetSettingsDialog {
                height: 30%;
                width: 30%;
            }

            #layoutDialog .content {
                display: flex;
                flex-flow: row wrap;
                justify-content: space-around;
                align-items: center;
                padding: 24px;
            }

            .layout-button {
                height: 90%;
                width: calc((100% / 3) - 24px);
                border: 1px solid var(--app-background-color-dark);
                padding: 4px;
                display: grid;
                grid-column-gap: 4px;
                grid-row-gap: 4px;
                transition: all .12s cubic-bezier(0.075, 0.82, 0.165, 1);
            }

            .layout-button:hover {
                background: var(--app-background-color-light)
            }

            .layout-button.selected {
                margin-top: -1px;
                box-shadow: var(--app-shadow-elevation-1);
            }

            .layout-button.selected span:nth-child(3n+1) {
                background: var(--app-secondary-color-highlight);
            }

            .layout-button.selected span {
                background: var(--app-secondary-color);
            }


            .layout-button span:after {
                content: '';
                display: block;
                height: 100%;
                width: 0;
                position: absolute;
                background: rgba(218, 107, 107, 0.05);
                transition: all .24s cubic-bezier(0.075, 0.82, 0.165, 1);
            }

            .layout-button span:nth-child(2n+1):after {
                transition-delay: 0.06s;
            }

            .layout-button:hover span:after {
                width: 100%;
            }

            .layout-a {
                grid-template-columns: repeat(2, 1fr);
                grid-template-rows: repeat(3, 1fr);
            }

            .layout-b {
                grid-template-columns: repeat(3, 1fr);
                grid-template-rows: repeat(2, 1fr);
            }

            .layout-c {
                grid-template-columns: repeat(4, 1fr);
                grid-template-rows: repeat(2, 1fr);
            }

            .layout-a span, .layout-b span, .layout-c span {
                grid-column: span 1;
                grid-row: span 1;
            }

            .layout-button span {
                background: var(--app-background-color-dark);
                position: relative;
            }

            .layout-a span:first-child {
                grid-column: 1 / span 1;
                grid-row: 1 / span 3;
            }

            .layout-b span:last-child {
                grid-column: 3 / span 1;
                grid-row: 1 / span 2;
            }

            .layout-c span:first-child {
                grid-column: 1 / span 4;
                grid-row: span 1;
            }

            paper-menu-button.widget-settings-menu div {
                width: 160px;
                height: auto;
            }

            paper-menu-button.widget-settings-menu div paper-button {
                width: 100%;
                margin: 0;
                background-color: var(--app-secondary-color);
                color: var(--app-text-color);
                text-transform: capitalize;
                font-size: 14px;
                font-weight: 500;
                border-radius: 0;
            }

            paper-menu-button.widget-settings-menu div paper-input {
                margin: 0 8px;
                --paper-input-container-input: {
                    padding: 0;
                };
                --paper-input-container-focus-color: var(--app-secondary-color);
            }

            .card.dragging {
                opacity: 0.4;
                transform-origin: center center;
                transform: scale(.9);
            }

            .card.over {
                border: 3px dashed var(--app-text-color-disabled);
            }

            ht-spinner {
                height: 42px;
                width: 42px;
            }

            @media (max-width: 880px) {
                span.nomobile {
                    display: none;
                }
            }

            .eid-notification-panel {
                display: flex;
                flex-direction: column;
                position: fixed;
                top: 84px;
                right: -264px;
                padding: 0;
                background: var(--app-background-color);
                color: var(--app-text-color);
                font-size: 13px;
                min-width: 208px;
                opacity: 0;
                z-index: 1000;
                border-radius: 3px 0 0 3px;
                box-shadow: var(--app-shadow-elevation-1);
                overflow: hidden;
                transition: all .5s ease-in;
            }

            .notification {
                opacity: 1;
                right: 16px;
            }

            div.panel-header {
                background: var(--app-secondary-color-dark);
                margin-bottom: 8px;
                font-size: 1.5em;
                width: 100%;
                text-align: center;
                padding: 8px 16px;
                box-sizing: border-box;
            }

            vaadin-grid.eid-patients-list {
                width: 448px;
                max-height: 256px;
                overflow-y: auto;
                margin: 0 8px;
            }

            div.panel-bottom-btns {
                display: flex;
                flex-direction: row;
                width: 100%;
                justify-content: space-around;
            }

            div.panel-bottom-btns > paper-button {
                flex-grow: 1;
                height: 40px;
                margin: 4px;
                padding: 4px;
                text-align: center;
                cursor: pointer;
                border-radius: 2px;
                transition: .25s ease;
            }

            div.panel-bottom-btns > paper-button:hover {
                background: var(--app-secondary-color-dark);
            }

        </style>

        <paper-item id="eidFound" class="eid-notification-panel">
            <div class="panel-header">
                <iron-icon icon="vaadin:health-card"></iron-icon>
                [[localize('eid_found','eid found',language)]], [[localize('open_pat','open patient',language)]] ?
            </div>
            <div class="panel-bottom-btns">
                <paper-button on-tap="closeEidPanel" panel="eidFound">
                    <iron-icon icon="cancel" panel="eidFound"></iron-icon>
                    [[localize('no','No',language)]]
                </paper-button>
                <paper-button on-tap="checkNiss">
                    <iron-icon icon="check-circle"></iron-icon>
                    [[localize('yes','Yes',language)]]
                </paper-button>
            </div>
        </paper-item>

        <div class="layout-buttons">
            <!-- <paper-icon-button id="addWidgetButton" icon="add-box"></paper-icon-button> -->
            <paper-icon-button id="changeLayoutButton" icon="dashboard" on-tap="_layoutDialog"></paper-icon-button>
            <!-- <paper-tooltip  offset="4" for="addWidgetButton">Add a widget</paper-tooltip> -->
            <paper-tooltip offset="4" for="changeLayoutButton">[[localize('edit_layout','Edit layout',language)]]
            </paper-tooltip>
        </div>
        <div id="gridContainer" class="grid-container ">
            <template is="dom-repeat" items="{{widgets}}" as="widget">
                <template is="dom-if" if="[[_isEqual(widget.id,'latestPatientsWidget')]]">
                    <div id="[[widget.id]]" class="card latest-patients-card" style="--area:latestPatientsWidget;" draggable="true" on-dragstart="_dragWidgetStart" on-dragover="_dragWidgetOver" on-dragenter="_dragWidgetEnter" on-dragleave="_dragWidgetLeave" on-dragend="_dragWidgetEnd" on-drop="_dropWidget">
                        <div class="card-title-container">
                            <h1 class="card-title">[[localize('lat_pat','Latest Patients',language)]]</h1>
                            <paper-menu-button class="widget-settings-menu" horizontal-align="right" no-overlap="" no-animations="" focused="false">
                                <paper-icon-button id="settings-latestpat" icon="settings" slot="dropdown-trigger" alt="widget settings menu"></paper-icon-button>
                                <div slot="dropdown-content">
                                    <paper-input type="number" min="1" always-float-label="" label="[[localize('nr_of_col','Nr of columns',language)]]" value="{{widget.nrCols}}"></paper-input>
                                    <paper-input type="number" min="1" always-float-label="" label="[[localize('nr_of_row','Nr of rows',language)]]" value="{{widget.nrRows}}"></paper-input>
                                    <!-- <paper-button on-tap="_handleWidgetChange" data-item\$="{{widget}}">Apply settings</paper-button> -->
                                </div>
                            </paper-menu-button>
                            <paper-tooltip for="settings-latestpat">[[localize('settings','Settings',language)]]
                            </paper-tooltip>
                        </div>
                        <div class="card-body">
                            <div class="card-table-header row">
                                <div class="card-header-cell" on-tap="_sortList" list="accessLogs" sort="patient.lastName">[[localize('pati','Patient',language)]]
                                </div>
                                <div class="card-header-cell card-header-cell--date" on-tap="_sortList" list="accessLogs" sort="access.date">[[localize('last_edi','last edit',language)]]
                                </div>
                            </div>
                            <template is="dom-repeat" items="[[accessLogs]]" as="access">
                                <div class="row latest-patients-row" data-id\$="[[access.patient.id]]" on-tap="openPatient">
                                    <div class="consultations-patient-photo"><img src\$="[[picture(access.patient)]]">
                                    </div>
                                    <div class="consultations-patient-name">[[access.patient.lastName]]
                                        [[access.patient.firstName]] <span class="patient-dateofbirth">°[[_timeFormat(access.patient.dateOfBirth)]]</span>
                                        <span class="patient-age">°[[_ageFormat(access.patient.dateOfBirth)]]</span>
                                    </div>
                                    <div class="divider"></div>
                                    <div class="consultations-time">[[_timeFormat(access.access.date)]]</div>
                                </div>
                            </template>
                            <ht-spinner class="spinner" active="[[_isLoadingLatestPatients]]"></ht-spinner>
                        </div>
                    </div>
                </template>
                <template is="dom-if" if="[[_isEqual(widget.id,'todaysConsultationsWidget')]]">
                    <div id="[[widget.id]]" class="card todays-consultations" style="--area:todaysConsultationsWidget;" draggable="true" on-dragstart="_dragWidgetStart" on-dragover="_dragWidgetOver" on-dragenter="_dragWidgetEnter" on-dragleave="_dragWidgetLeave" on-dragend="_dragWidgetEnd" on-drop="_dropWidget">
                        <div class="card-title-container">
                            <h1 class="card-title">[[localize('tod_app','Today‘s Appointment',language)]]</h1>
                            <paper-menu-button class="widget-settings-menu" horizontal-align="right" close-on-activate="" no-overlap="" no-animations="" focused="false">
                                <paper-icon-button id="settings-todayconsult" icon="settings" slot="dropdown-trigger" alt="widget settings menu"></paper-icon-button>
                                <div slot="dropdown-content">
                                    <paper-input type="number" min="1" always-float-label="" label="[[localize('nr_of_col','Nr of columns',language)]]" value="{{widget.nrCols}}"></paper-input>
                                    <paper-input type="number" min="1" always-float-label="" label="[[localize('nr_of_row','Nr of rows',language)]]" value="{{widget.nrRows}}"></paper-input>
                                    <!-- <paper-button on-tap="_handleWidgetChange" data-item\$="[[widget]]">Apply settings</paper-button> -->
                                </div>
                            </paper-menu-button>
                            <paper-tooltip for="settings-todayconsult">[[localize('settings','Settings',language)]]
                            </paper-tooltip>
                        </div>
                        <div class="card-body">
                            <div class="card-table-header row">
                                <div class="card-header-cell" on-tap="_sortList" list="appointments" sort="patient.lastName">[[localize('pati','Patient',language)]]
                                </div>
                                <div class="card-header-cell" on-tap="_sortList" list="appointments" sort="type">
                                    [[localize('type','Type',language)]]
                                </div>
                                <div class="card-header-cell card-header-cell--date" on-tap="_sortList" list="appointments" sort="startTime">[[localize('hour','Hour',language)]]
                                </div>
                            </div>
                            <div class="consultations-list">
                                <template is="dom-repeat" items="[[appointments]]" as="appointment">
                                    <div class="row latest-consultations-row" data-id\$="[[appointment.patient.id]]" on-tap="openPatient">
                                        <div class="consultations-patient-photo"><img src\$="[[picture(appointment.patient)]]"></div>
                                        <div class="consultations-patient-name">[[appointment.patient.lastName]]
                                            [[appointment.patient.firstName]]
                                        </div>
                                        <div class="consultations-patient-type">#[[appointment.type]]</div>
                                        <div class="divider"></div>
                                        <div class="consultations-time">[[_shortTimeFormat(appointment.startTime)]]
                                        </div>
                                    </div>
                                </template>
                            </div>
                            <ht-spinner class="spinner" active="[[_isLoadingTodaysConsultations]]"></ht-spinner>
                        </div>
                    </div>
                </template>
                <template is="dom-if" if="[[_isEqual(widget.id,'latestLabResultsWidget')]]">
                    <div id="[[widget.id]]" class="card latest-lab-result" style="--area:latestLabResultsWidget;" draggable="true" on-dragstart="_dragWidgetStart" on-dragover="_dragWidgetOver" on-dragenter="_dragWidgetEnter" on-dragleave="_dragWidgetLeave" on-dragend="_dragWidgetEnd" on-drop="_dropWidget">
                        <div class="card-title-container">
                            <h1 class="card-title new-notif">[[localize('latest_lab_reports','Latest Lab and
                                Reports',language)]]
                                <template is="dom-if" if="[[!_isEqual(unreadCount,0)]]">
                                    <span class="notif">[[unreadCount]]<span class="nomobile"> [[localize('are_not_read','unread',language)]]</span></span>
                                </template>
                            </h1>
                            <paper-icon-button id="refresh-latestlabs" icon="refresh" on-tap="_updateLabResults"></paper-icon-button>
                            <paper-menu-button class="widget-settings-menu" horizontal-align="right" close-on-activate="" no-overlap="" no-animations="" focused="false">
                                <paper-icon-button id="settings-latestlabs" icon="settings" slot="dropdown-trigger" alt="widget settings menu"></paper-icon-button>
                                <div slot="dropdown-content">
                                    <paper-input type="number" min="1" always-float-label="" label="[[localize('nr_of_col','Nr of columns',language)]]" value="{{widget.nrCols}}"></paper-input>
                                    <paper-input type="number" min="1" always-float-label="" label="[[localize('nr_of_row','Nr of rows',language)]]" value="{{widget.nrRows}}"></paper-input>
                                </div>
                            </paper-menu-button>
                            <paper-tooltip for="refresh-latestlabs">[[localize('refresh','Refresh',language)]]
                            </paper-tooltip>
                            <paper-tooltip for="settings-latestlabs">[[localize('settings','Settings',language)]]
                            </paper-tooltip>
                        </div>
                        <div class="card-body">
                            <div class="card-table-header row">
                                <div class="card-header-cell card-header-cell--date" on-tap="_sortList" list="labResults" sort="created">[[localize('dat','Date',language)]]
                                </div>
                                <div class="card-header-cell" on-tap="_sortList" list="labResults" sort="patient.lastName">[[localize('pat_ident','Patient',language)]]
                                </div>
                                <div class="card-header-cell lab-name" on-tap="_sortList" list="labResults" sort="descr">[[localize('sender','sender',language)]]
                                </div>
                            </div>
                            <template is="dom-repeat" items="[[labResults]]" as="result">
                                <div class="row card-table-row" data-id\$="[[result.patient.id]]" on-tap="openPatient">
                                    <div class\$="card-table-cell [[_isUnreadResult(result, isLoadingLabResults)]] card-table-cell--date">
                                        [[_timeFormat(result.created)]]
                                    </div>
                                    <div class\$="card-table-cell [[_isUnreadResult(result, isLoadingLabResults)]]">
                                        [[result.patient.lastName]] [[result.patient.firstName]]
                                    </div>
                                    <div class\$="card-table-cell [[_isUnreadResult(result, isLoadingLabResults)]] lab-name">
                                        [[result.descr]]
                                    </div>
                                </div>
                            </template>
                            <ht-spinner class="spinner" active="[[isLoadingLabResults]]"></ht-spinner>
                        </div>
                    </div>
                </template>
                <template is="dom-if" if="[[_isEqual(widget.id,'todoWidget')]]">
                    <div id="[[widget.id]]" class="card todo-card" style="--area:todoWidget;" draggable="true" on-dragstart="_dragWidgetStart" on-dragover="_dragWidgetOver" on-dragenter="_dragWidgetEnter" on-dragleave="_dragWidgetLeave" on-dragend="_dragWidgetEnd" on-drop="_dropWidget">
                        <div class="card-title-container">
                            <h1 class="card-title">[[localize('pla','Planning',language)]]</h1>
                            <paper-menu-button class="widget-settings-menu" horizontal-align="right" close-on-activate="" no-overlap="" no-animations="" focused="false">
                                <paper-icon-button id="settings-todo" icon="settings" slot="dropdown-trigger" alt="widget settings menu"></paper-icon-button>
                                <div slot="dropdown-content">
                                    <paper-input type="number" min="1" always-float-label="" label="[[localize('nr_of_col','Nr of columns',language)]]" value="{{widget.nrCols}}"></paper-input>
                                    <paper-input type="number" min="1" always-float-label="" label="[[localize('nr_of_row','Nr of rows',language)]]" value="{{widget.nrRows}}"></paper-input>
                                    <!-- <paper-button on-tap="_handleWidgetChange" data-item\$="[[widget]]">Apply settings</paper-button> -->
                                </div>
                            </paper-menu-button>
                            <paper-tooltip for="settings-todo">[[localize('settings','Settings',language)]]
                            </paper-tooltip>
                        </div>
                        <div class="card-body">
                            <div class="card-table-header row">
                                <div class="card-header-cell" on-tap="_sortList" list="services" sort="patient.lastName">[[localize('pati','Patient',language)]]
                                </div>
                                <div class="card-header-cell card-header-cell--date" on-tap="_sortList" list="services" sort="service.valueDate">[[localize('due_dat','Due date',language)]]
                                </div>
                                <div class="card-header-cell" on-tap="_sortList" list="services" sort="service.content.language.stringValue">
                                    [[localize('des','Description',language)]]
                                </div>
                            </div>
                            <template is="dom-repeat" items="[[services]]" as="service">
                                <paper-listbox>
                                    <paper-item>
                                        <div class="row card-table-row" data-id\$="[[service.service.id]]">
                                            <div class="card-table-cell main-cell">
                                                <div class="consultations-patient-photo"><img src\$="[[picture(service.patient)]]"></div>
                                                <div class="consultations-patient-name">[[service.patient.lastName]]
                                                    [[service.patient.firstName]]
                                                </div>
                                            </div>
                                            <div class="card-table-cell card-table-cell--date">
                                                [[_timeFormat(service.service.valueDate)]]
                                            </div>
                                            <div class="card-table-cell">
                                                [[service.service.content.language.stringValue]]
                                            </div>
                                        </div>
                                    </paper-item>
                                </paper-listbox>
                            </template>
                            <ht-spinner class="spinner" active="[[_isLoadingLatestPatients]]"></ht-spinner>
                        </div>
                    </div>
                </template>
                <template is="dom-if" if="[[_contains(widget.id,'empty')]]">
                    <div id="[[widget.id]]" class="card empty-card" on-dragstart="_dragWidgetStart" on-dragover="_dragWidgetOver" on-dragenter="_dragWidgetEnter" on-dragleave="_dragWidgetLeave" on-dragend="_dragWidgetEnd" on-drop="_dropWidget" style="--area:[[widget.id]];">
                    </div>
                </template>
            </template>
        </div>

        <paper-dialog id="layoutDialog">
            <h2 class="modal-title">[[localize('edit_layout','Edit layout',language)]]</h2>
            <div class="content">
                <div id="layoutA" class\$="layout-button layout-a [[_isSelected(selectedLayout, 'layoutA')]]" on-tap="setSelectedLayout">
                    <span style="--area:latestPatientsWidget;"></span>
                    <span style="--area:todaysConsultationsWidget;"></span>
                    <span style="--area:latestLabResultsWidget;"></span>
                    <span style="--area:todoWidget;"></span>
                </div>
                <div id="layoutB" class\$="layout-button layout-b [[_isSelected(selectedLayout, 'layoutB')]]" on-tap="setSelectedLayout">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
                <div id="layoutC" class\$="layout-button layout-c [[_isSelected(selectedLayout, 'layoutC')]]" on-tap="setSelectedLayout">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
                <slot name="suffix"></slot>
            </div>
            <div class="buttons">
                <paper-button class="modal-button" on-tap="setFromSavedLayout" dialog-dismiss="">
                    [[localize('can','Cancel',language)]]
                </paper-button>
                <paper-button class="modal-button modal-button--save" on-tap="saveSelectedLayout" dialog-dismiss="">
                    [[localize('save','Save',language)]]
                </paper-button>
            </div>
        </paper-dialog>
`;
  }

  static get is() {
      return 'ht-main';
  }

  static get properties() {
      return {
          api: {
              type: Object,
              noReset: true
          },
          user: {
              type: Object,
              noReset: true
          },
          accessLogs: {
              type: Array,
              value: function () {
                  return [];
              }
          },
          appointments: {
              type: Array,
              value: function () {
                  return [];
              }
          },
          labResults: {
              type: Array,
              value: function () {
                  return [];
              }
          },
          labres: {
              type: Array,
              value: function () {
                  return [];
              }
          },
          services: {
              type: Array,
              value: function () {
                  return [];
              }
          },
          selectedLayout: {
              type: String,
              value: "layoutA"
          },
          layoutGrid: {
              type: Object,
              value: new GridLayout()
          },
          dragSrcEl: {
              type: Object,
              value: null
          },
          widgets: {
              type: Array,
              value: () => [
                  {
                      id: "latestPatientsWidget",
                      nrRows: 3,
                      nrCols: 1,
                      posRow: 0,
                      posCol: 0
                  },
                  {
                      id: "todaysConsultationsWidget",
                      nrRows: 1,
                      nrCols: 1,
                      posRow: 0,
                      posCol: 1
                  },
                  {
                      id: "latestLabResultsWidget",
                      nrRows: 1,
                      nrCols: 1,
                      posRow: 1,
                      posCol: 1
                  },
                  {
                      id: "todoWidget",
                      nrRows: 1,
                      nrCols: 1,
                      posRow: 2,
                      posCol: 1
                  }
              ],
              notify: true,
              observers: this._applySettings,
          },
          isLoadingLabResults: {
              type: Boolean,
              value: false
          },
          unreadCount: {
              type: Number,
              value: 0
          },
          route: {
              type: Object,
              notify: true
          },
          socket: {
              type: Object,
              value: null
          },
          cardData: {
              type: Object,
              value: {}
          }
      };
  }

  static get observers() {
      return ['apiReady(user,api)', 'widgetsChanged(widgets.*)', '_routeChanged(route,route.*,socket,socket.*)'];
  }

  constructor() {
      super();
  }

  reset() {
      const props = HtMain.properties
      Object.keys(props).forEach(k => {
          if (!props[k].noReset) {
              this.set(k, (typeof props[k].value === 'function' ? props[k].value() : (props[k].value || null)))
          }
      })
  }

  _routeChanged() {
      if (this.route.prefix === "/main" && this.socket) {
          if (this.socket) {
              this.socket.removeAllListeners("auto-read-card-eid")
              this.notifyPath("socket")
          }
          this.setSocket();
      }
  }

  setSocket() {
      this.socket.on("auto-read-card-eid", cards => {
          const res = JSON.parse(cards)
          if (res.cards[0]) {
              this.set('cardData', res.cards[0])
              this.$['eidFound'].classList.add('notification');
          }
      })
  }

  ready() {

      super.ready();

      window.addEventListener('resize', this.handleResize.bind(this))
      this.setFromSavedLayout()

  }

  _sortList(e) {
      const list = e && e.target && e.target.getAttribute('list') || ''
      const sort = e && e.target && e.target.getAttribute('sort') || ''
      const target =
          list == 'accessLogs' ? this.accessLogs :
              list == 'appointments' ? this.appointments :
                  list == 'labResults' ? this.labResults :
                      list == 'services' ? this.services :
                          []
      const dir = sort == 'created' || sort == 'startTime' || sort == 'service.valueDate' || sort == 'access.date' ?
          'desc' : 'asc'
      const ordered = _.orderBy(target, sort, dir)
      this.set(list, ordered)
  }

  replaceAll(target, search, replacement) {
      return target.split(search).join(replacement);
  }

  apiReady() {
      if (!this.user || !this.api) {
          return
      }

      this._isLoadingLatestPatients = true;
      this.set('isLoadingLabResults', true)
      this._isLoadingTodaysConsultations = true;
      this._isLoadingToDoList = true;
      this.api.hcparty().getCurrentHealthcareParty().then(hcp => {
          const language = (hcp.languages || ['fr']).find(lng => lng && lng.length === 2);
          language && this.set('language', language);
          return hcp;
      }).then(hcp => {
          this.api.accesslog().findByUserAfterDate(this.user.id, 'USER_ACCESS', +new Date() - 1000 * 3600 * 24 * 365, null, null, 100, true).then(accessLogs => {
              const accesses = accessLogs.rows.reduce((acc, access) => {
                  const latestAccessForPatId = acc[access.patientId] || (acc[access.patientId] = {access: access});
                  if (latestAccessForPatId.access.date < access.date) {
                      latestAccessForPatId.access = access;
                  }
                  return acc;
              }, {});
              return this.api.patient().getPatientsWithUser(this.user, {ids: Object.keys(accesses)}).then(patients => {
                  patients.forEach(p => accesses[p.id] && (accesses[p.id].patient = p));
                  this._isLoadingLatestPatients = false;
                  return accesses;
              });
          }).then(accesses => this.set('accessLogs', _.sortBy(Object.values(accesses), a => -a.access.date)));

          this._updateLabResults()

          this.api.bemikrono().appointments(parseInt(moment().format('YYYYMMDD'))).then(appointments => {
              return appointments && this.api.patient().getPatientsWithUser(this.user, new models.ListOfIdsDto({ids: appointments.map(a => a.patientId)})).then(patients => {
                  //todo wtf JSON not valid
                  patients.forEach((p, idx) => appointments[idx].patient = p);
                  this._isLoadingTodaysConsultations = false;
                  return appointments;
              });
          }).then(appointments => this.set('appointments', appointments || []));

          const start = parseInt(moment().subtract(1, 'month').format('YYYYMMDD'));
          const end = parseInt(moment().add(1, 'month').format('YYYYMMDD'));
          const maxplanningsize = 10;
          const sort = 'valueDate';
          const desc = 'desc';

          const planningFilter = {
              '$type': 'UnionFilter',
              'filters': [{
                  '$type': 'ServiceByHcPartyTagCodeDateFilter',
                  healthcarePartyId: hcp.id,
                  tagCode: 'planned',
                  tagType: 'CD-LIFECYCLE',
                  startValueDate: start,
                  endValueDate: end
              }, {
                  '$type': 'ServiceByHcPartyTagCodeDateFilter',
                  healthcarePartyId: hcp.id,
                  tagCode: 'planned',
                  tagType: 'CD-LIFECYCLE',
                  startValueDate: start * 1000000,
                  endValueDate: end * 1000000
              }]
          };
          this.api.contact().filterServicesBy(null, null, 1000, new models.FilterChain({filter: planningFilter})) //todo wtf JSON not valid
              .then(planningList => {
                  const svcDict = planningList.rows.reduce((acc, s) => {
                      const cs = acc[s.id];
                      if (!cs || !cs.modified || s.modified && this.api.after(s.modified, cs.modified)) {
                          acc[s.id] = s;
                      }
                      return acc;
                  }, {});
                  const services = _.sortBy(Object.values(svcDict).filter(s => !s.endOfLife), [s => +this.api.moment( /*s.modified||s.created||*/s.valueDate)]);
                  const hcpId = this.user.healthcarePartyId;

                  const ownersOfDelegations = services.reduce((acc, s) => {
                      s.cryptedForeignKeys[hcpId].forEach(d => acc[d.owner] = 1);
                      return acc;
                  }, {});
                  const importedAESHcPartyKeys = {};

                  return this.api.hcparty().getHcPartyKeysForDelegate(hcpId).then(keys => Promise.all(Object.keys(ownersOfDelegations).map(ownerId => this.api.crypto().decryptHcPartyKey(ownerId, hcpId, keys[ownerId]).then(importedAESHcPartyKey => importedAESHcPartyKeys[ownerId] = importedAESHcPartyKey)))).then(() => Promise.all(services.map(s => Promise.all(s.cryptedForeignKeys[hcpId].map(k => this.api.crypto().AES.decrypt(importedAESHcPartyKeys[k.owner].key, this.api.crypto().utils.hex2ua(k.key)))).then(patIds => {
                      const decodedPatIds = patIds.map(ua => this.api.crypto().utils.ua2text(ua).split(':')[1]);
                      s.patId = decodedPatIds.find(id => id != null);
                      return decodedPatIds;
                  })))).then(arraysOfArraysOfPatIdsAsUa => {
                      return this.api.patient().filterByWithUser(this.user, null, null, maxplanningsize, /*index*/null, sort, desc, {
                          filter: {
                              '$type': 'PatientByIdsFilter',
                              'ids': _.uniqBy(_.compact(_.flatMap(arraysOfArraysOfPatIdsAsUa)))
                          }
                      });
                  }).then(patients => {
                      return services.map(s => ({
                          service: s,
                          patient: patients.rows.find(p => p.id === s.patId)
                      }))
                  });
              }).then(services => this.set('services', (services || []).filter(it => it.patient)));
          this._isLoadingToDoList = false;

      });
  }

  _updateLabResults() {
      console.log('update Lab Results')
      this.set('isLoadingLabResults', true)
      const start = Number(moment().subtract(15, 'days').format('YYYYMMDDHHmmss'))
      const labsFilter = {
          '$type': 'UnionFilter',
          'filters': [
              {
                  '$type': 'ServiceByHcPartyTagCodeDateFilter',
                  healthcarePartyId: this.user.healthcarePartyId,
                  tagCode: 'labresult',
                  tagType: 'CD-TRANSACTION',
                  startValueDate: start
              },
              {
                  '$type': 'ServiceByHcPartyTagCodeDateFilter',
                  healthcarePartyId: this.user.healthcarePartyId,
                  tagCode: 'report',
                  tagType: 'CD-TRANSACTION',
                  startValueDate: start
              },
          ]
      }
      this.api.contact().filterServicesBy(null, null, 50, new models.FilterChain({filter: labsFilter}))
          .then(services => {
              return Promise.all(services.rows.map(s => this.api.crypto().extractKeysFromDelegationsForHcpHierarchy(this.user.healthcarePartyId, document.id, s.cryptedForeignKeys).then(({extractedKeys: cfks}) => [s, cfks])))
                  .then(cfksLists => this.api.patient().filterByWithUser(this.user, null, null, 50, null, null, null, {
                      filter: {
                          '$type': 'PatientByIdsFilter',
                          'ids': _.uniqBy(_.compact(_.flatMap(cfksLists.map(x => x[1]))))
                      }
                  }).then(pats =>
                      cfksLists.map(x => {
                          const pat = pats.rows.find(p => x[1].includes(p.id))
                          return ({
                              patient: pat,
                              created: x[0].valueDate,
                              patientName: pat.firstName + ' ' + pat.lastName,
                              contactId: x[0].contactId,
                              descr: (this.api.contact().preferredContent(x[0], this.language) || {}).stringValue
                          })
                      })
                  ))
          })
          .then(results => {
              this.set('labResults', _.orderBy(results, 'created', 'desc') || [])
              return this.api.message().findMessagesByTransportGuid('INBOX:*', null, null, null, 1000)
                  .then(messages => {
                      this.set('unreadCount', _.filter(messages.rows, m => {
                          return ((m.status & (1 << 1)) !== 0) && (m.assignedResults && Object.keys(m.assignedResults).length)
                      }).length)
                      this.messagesByContactId = {}
                      messages.rows && messages.rows.forEach(mes => {
                          mes.assignedResults && Object.keys(mes.assignedResults).forEach(conid => {
                              this.messagesByContactId[conid] = mes
                          })
                      })
                  })
          })
          .finally(() => {
              this.set('isLoadingLabResults', false)
          })
  }

  _isUnreadResult(res) {
      return this.messagesByContactId && this.messagesByContactId[res.contactId] && ((this.messagesByContactId[res.contactId].status & 1 << 1) !== 0) ? 'unread' : ''
  }

  _timeFormat(date) {
      return date && this.api.moment(date).format(date > 99991231 ? 'DD/MM/YYYY HH:mm' : 'DD/MM/YYYY') || '';
  }

  _ageFormat(date) {
      if (this.language) {
          return this.api.getCurrentAgeFromBirthDate(date, (id, placeholder) => this.localize(id, placeholder, this.language))
      }
  }

  _shortTimeFormat(date) {
      return date && this.api.moment(date).format(date > 99991231 ? 'HH:mm' : 'DD/MM/YYYY') || '';
  }

  _isSelected(a, b) {
      return (a === b) ? 'selected' : ''
  }

  _isEqual(a, b) {
      return (a === b)
  }

  _contains(a, b) {
      return a.includes(b)
  }

  picture(pat) {
      if (!pat) {
          return require('../images/male-placeholder.png');
      }
      return pat.picture ? 'data:image/png;base64,' + pat.picture : pat.gender === 'female' ? require('../images/female-placeholder.png') : require('../images/male-placeholder.png');
  }

  openPatient(ev) {
      let target = ev.target;
      while (target && !target.dataset.id) {
          target = target.parentNode;
      }
      if (target.dataset.id != '0') location.replace(location.href.replace(/(.+?)#.*/, `$1#/pat/${target.dataset.id}`));
  }

  _layoutDialog(e) {
      e.stopPropagation()
      e.preventDefault()
      this.$['layoutDialog'].open()
  }

  _dragWidgetStart(e) {
      e.target.classList.add('dragging')
      this.dragSrcEl = e.target.id
  }

  _dragWidgetOver(e) {
      e.preventDefault()
      return false
  }

  _dragWidgetEnter(e) {
      e.target.closest(".card").classList.add('over')
  }

  _dragWidgetLeave(e) {
      e.target.parentNode.classList.remove('over')
  }

  _dragWidgetEnd() {
      this.shadowRoot.querySelectorAll('.card').forEach(card => card.classList.remove('over'))
      this.shadowRoot.querySelector('#' + this.dragSrcEl).classList.remove('dragging')
  }

  _dropWidget(e) {
      e.stopPropagation();
      this._swap(e.currentTarget.id)
      this.shadowRoot.querySelector('#' + this.dragSrcEl).classList.remove('dragging')
      return false;
  }

  setSelectedLayout(e) {

      this.set('selectedLayout', e.currentTarget.id)

      switch (this.selectedLayout) {
          case 'layoutA':
              this.widgets = WIDGETSA
              break;
          case 'layoutB':
              this.widgets = WIDGETSB
              break;
          case 'layoutC':
              this.widgets = WIDGETSC
              break;
          case 'layoutTab':
              this.widgets = WIDGETSTAB
              break;
          case 'layoutMobile':
              this.widgets = WIDGETSMOBILE
              break;
          default:
              this.widgets = WIDGETSA
              break;
      }

      this.updateGrid(false)

  }

  saveSelectedLayout(e) {

      e.preventDefault();

      this.updateGrid()

  }

  handleResize(e) {

      if (this.layoutGrid.setLayoutFromSize(e.target.innerWidth)) {

          this.setSelectedLayout({currentTarget: {id: this.layoutGrid.layout}})

          this.layoutGrid.save(this.user, this.widgets)
      }

  }

  setFromSavedLayout() {

      const storage = JSON.parse(localStorage.getItem(`org.taktik.icure.${this.user.id}.settings.main.grid`))

      if (storage) {
          this.set('selectedLayout', storage.layout)
          this.set('widgets', storage.widgets)
      }

      this.layoutGrid.setFromStorage(this.user, this.widgets)

      this.setStyles(this.layoutGrid.styleStrings)

  }

  updateGrid(save = true) {

      this.sanitizeEmpties()

      this.layoutGrid
          .setGridSize(this.selectedLayout)
          .init()
          .fill(this.widgets)

      const empties = this.layoutGrid.getEmptySpaces()
      this.push('widgets', ...empties)

      this.setStyles(this.layoutGrid.styleStrings)

      if (save) this.layoutGrid.save(this.user, this.widgets)
  }

  sanitizeEmpties() {


      this.set('widgets', this.widgets.filter(widget => {
          if (widget && widget.id) {
              return !widget.id.includes('empty')
          }
      }))
  }

  setStyles(styleStrings) {
      this.updateStyles({'--grid-columns': styleStrings.gridCol, '--grid-rows': styleStrings.gridRow})
      this.updateStyles({'--grid-layout': styleStrings.templateArea})
  }

  _swap(elToSwap) {

      const idx1 = this.widgets.findIndex(k => k.id === this.dragSrcEl)
      const idx2 = this.widgets.findIndex(k => k.id === elToSwap)

      const temp = this.widgets[idx1]
      this.widgets[idx1] = this.widgets[idx2]
      this.widgets[idx2] = temp

      this.widgets[idx1].id = this.dragSrcEl
      this.widgets[idx2].id = elToSwap

      this.updateGrid()
  }

  widgetsChanged(e) {

      const path = e.path

      const index = parseInt(path.split('.')[1])

      if ((index + 1)) {

          if (!this.widgets[index].nrRows || !this.widgets[index].nrCols) {
              return
          }

          const newWidget = this.layoutGrid.computeCardSize(this.widgets[index])

          const currentWidget = this.widgets[index];

          if (
              currentWidget.nrCols != newWidget.nrCols ||
              currentWidget.nrRows != newWidget.nrRows ||
              currentWidget.posCol != newWidget.posCol ||
              currentWidget.posRow != newWidget.posRow
          ) {

              this.set(['widgets', index], newWidget)

          } else {
              this.updateGrid()
          }


      }

  }


  checkNiss() {
      this.api.hcparty().getHealthcareParty(this.user.healthcarePartyId).then(currentHcp => {
          const ssinFilter = /^[0-9]{11}$/.test(this.cardData.nationalNumber) && ({
              '$type': 'PatientByHcPartyAndSsinFilter',
              'healthcarePartyId': currentHcp.parentId || this.user.healthcarePartyId,
              'ssin': this.cardData.nationalNumber
          })
          this.$['eidFound'].classList.remove('notification');
          this.api.patient().filterByWithUser(this.user, null, null, 50, 0, 1, 'desc', {filter: ssinFilter})
              .then(patients => {
                  if (patients.rows.length) {
                      const selected = patients.rows[0]
                      this.api.patient().getPatientWithUser(this.user, selected.id).then(p => {
                          p.ssin = p.ssin || this.cardData.nationalNumber
                          if (!p.addresses.find(ad => ad.addressType === "home")) {
                              let streetData = _.trim(this.cardData.street).split(" ")
                              const number = streetData.find(str => str.match(/\d/g))
                              const boxNumber = streetData[streetData.length - 1] !== number ? streetData[streetData.length - 1] : ""
                              const street = streetData.reduce((tot, str) => {
                                  if (!tot) tot = "";
                                  if (!(str === number || str === boxNumber))
                                      tot = tot.concat(" ", str)
                                  return tot;
                              })

                              p.addresses.push({
                                  addressType: "home",
                                  street: street,
                                  houseNumber: number,
                                  postboxNumber: boxNumber,
                                  postalCode: this.cardData.zipCode,
                                  city: this.cardData.municipality,
                                  country: this.cardData.country
                              })
                          }

                          p.gender = p.gender || this.cardData.gender === 'M' ? 'male' : 'female'
                          p.placeOfBirth = p.placeOfBirth || this.cardData.locationOfBirth
                          p.dateOfBirth = p.dateOfBirth || parseInt(this.api.moment(this.cardData.dateOfBirth * 1000).format('YYYYMMDD'))
                          p.nationality = p.nationality || this.cardData.nationality
                          p.picture = p.picture || this.cardData.picture
                          p.firstName = p.firstName || this.cardData.firstName
                          p.lastName = p.lastName || this.cardData.surname

                          return p
                      })
                          .then(p => this.api.patient().modifyPatientWithUser(this.user, p))
                          .then(p => this.api.register(p, 'patient'))
                          .then(p => {
                              location.replace(location.href.replace(/(.+?)#.*/, `$1#/pat/${p.id}`));
                              return p
                          })
                          .then(p => {
                              this.api.hcparty().getHealthcareParty(this.user.healthcarePartyId).then(hcp => {
                                  this.api.fhc().Therlinkcontroller().registerTherapeuticLinkUsingPOST1(this.api.keystoreId, this.api.tokenId, this.api.credentials.ehpassword,
                                      hcp.nihii, hcp.ssin, hcp.firstName, hcp.lastName,
                                      p.ssin, p.firstName, p.lastName, this.cardData.logicalNumber, "", null, null, null, null, null)

                              })
                          })
                  }
              })
      })
  }

  closeEidPanel(e) {
      const target = e && e.target && e.target.getAttribute('panel') || ''
      if (this.$[target] && this.$[target].classList.contains('notification')) {
          this.$[target].classList.remove('notification');
      }
  }
}


class GridLayout {

    constructor() {

        this.grid = []
        this.cols = 0;
        this.rows = 0;
        this.layout = 'layoutA';

    }

    init() {

        const grid = []

        for (let row = 0; row < this.rows; row++) {
            grid.push([])
            for (let col = 0; col < this.cols; col++) {
                grid[row][col] = 'empty'
            }
        }

        this.grid = grid

        return this;

    }

    fill(widgets) {

        const widgetsInOrder = widgets.sort((a, b) => a.order - b.order)

        widgetsInOrder.map((widget, index) => {

            for (let rowIndex = 0; rowIndex < widget.nrRows; rowIndex++) {

                for (let colIndex = 0; colIndex < widget.nrCols; colIndex++) {

                    this.grid[widget.posRow + rowIndex] && (this.grid[widget.posRow + rowIndex][widget.posCol + colIndex] = widget.id)

                }

            }

        })

        return this;

    }

    computeCardSize(w) {

        const widget = _.clone(w, true)

        if (widget) {

            // Calculate the available space around the card
            let rowSpace = 0;
            let spaceUnder = 0;
            let rowIsPartOfCard = false;

            let rowsData = [];

            for (let rowIndex = 0; rowIndex < this.grid.length; rowIndex++) {

                let colSpace = 0
                let spaceRight = 0

                let colIsPartOfCard = false


                // COLUMNS
                for (let colIndex = 0; colIndex < this.grid[widget.posRow].length; colIndex++) {

                    const widgetId = this.grid[rowIndex][colIndex]
                    if (widgetId.includes('empty') || widgetId == widget.id) {

                        if (colIsPartOfCard) {
                            spaceRight++
                        } else if (widget.posCol == colIndex) {
                            colIsPartOfCard = true
                        }

                        colSpace++

                    } else if (!colIsPartOfCard) {
                        colSpace = 0
                    } else {
                        break;
                    }

                }


                //We add column data for every row even if the row is not available
                const colData = {space: colSpace, rightSide: spaceRight};
                rowsData.push(colData)

                //ROWS
                if (colIsPartOfCard) {

                    if (rowIsPartOfCard) {
                        spaceUnder++
                    } else if (widget.posRow == rowIndex) {
                        rowIsPartOfCard = true
                    }

                    rowSpace++

                } else if (!rowIsPartOfCard) {

                    rowSpace = 0

                } else {

                    break;

                }


            }

            // Now scale or move vertically, according to need or possibility
            if (widget.nrRows > rowSpace) widget.nrRows = rowSpace
            if (widget.nrRows > spaceUnder + 1) widget.posRow -= widget.nrRows - (spaceUnder + 1)


            // calculate minimum available horizontal space for the above computed occupied rows
            let minSpace = Infinity,
                minRightSpace = Infinity

            for (let rowIndex = widget.posRow; rowIndex < widget.posRow + parseInt(widget.nrRows); rowIndex++) {

                minSpace = minSpace > rowsData[rowIndex].space ? rowsData[rowIndex].space : minSpace;
                minRightSpace = minRightSpace > rowsData[rowIndex].rightSide ? rowsData[rowIndex].rightSide : minRightSpace;

            }

            // Now scale or move horizontally, according to need or possibility
            if (widget.nrCols > minSpace) widget.nrCols = minSpace
            if (widget.nrCols <= minRightSpace + 1) return widget

            widget.posCol -= widget.nrCols - (minRightSpace + 1)

            return widget


        }


    }

    getEmptySpaces() {

        const empties = []

        for (let rowIndex in this.grid) {
            for (let colIndex in this.grid[rowIndex]) {

                if (this.grid[rowIndex][colIndex].includes('empty')) {

                    const idName = "empty" + empties.length
                    this.grid[rowIndex][colIndex] = idName;

                    empties.push({
                        id: idName,
                        nrRows: 1,
                        nrCols: 1,
                        posCol: parseInt(colIndex),
                        posRow: parseInt(rowIndex)
                    })

                }


            }
        }

        return empties

    }

    setFromStorage(user, widgets) {

        const savedGridLayout = localStorage.getItem(`org.taktik.icure.${user.id}.settings.main.grid`)

        if (savedGridLayout) {

            this.clone(JSON.parse(savedGridLayout))

            if (this.setLayoutFromSize(window.innerWidth)) {

                this.init().fill(widgets).save(user, widgets)

            }

        } else if (widgets) {

            this.setGridSize('layoutA').init().fill(widgets).save(user, widgets)

        }

        return this

    }

    clone(nGrid) {

        this.grid = nGrid.grid;
        this.cols = nGrid.cols;
        this.rows = nGrid.rows;
        this.layout = nGrid.layout;

        return this

    }

    save(user, widgets) {

        const data = {}

        Object.assign(data, this)
        data.widgets = widgets
        data.size = window.innerWidth

        localStorage.setItem(`org.taktik.icure.${user.id}.settings.main.grid`, JSON.stringify(data))

        return this

    }

    setGridSize(layout = this.layout) {

        switch (layout) {
            case 'layoutA':
                this.cols = 2;
                this.rows = 3;
                break;
            case 'layoutB':
                this.cols = 3;
                this.rows = 2;
                break;
            case 'layoutC':
                this.cols = 4;
                this.rows = 2;
                break;
            case 'layoutTab':
                this.cols = 2;
                this.rows = 3;
                break;
            case 'layoutMobile':
                this.cols = 1;
                this.rows = 6;
                break;
            default:
                this.cols = 2;
                this.rows = 3;
                break;
        }

        this.layout = layout

        return this;
    }

    setLayoutFromSize(size) {

        if (size >= 950) {

            if (this.layout == 'layoutTab' || this.layout == 'layoutMobile') {

                this.setGridSize('layoutA')
                return true

            }

            return false

        }

        if (size > 600) {

            this.setGridSize('layoutTab')
            return true
        }

        this.setGridSize('layoutMobile')
        return true
    }

    get styleStrings() {

        const layout = this.layout
        const gridCol = `repeat(${this.cols}, 1fr)`
        const gridRow = `repeat(${this.rows}, 1fr)`

        let templateArea = "";

        this.grid.map(row => {
            templateArea += "\'"
            row.forEach(area => {
                templateArea += area ? area + " " : ". "
            })
            templateArea += "\' "
        })

        return {layout, gridCol, gridRow, templateArea}

    }

}

const WIDGETSA = [
    {
        id: "latestPatientsWidget",
        nrRows: 3,
        nrCols: 1,
        posRow: 0,
        posCol: 0
    },
    {
        id: "todaysConsultationsWidget",
        nrRows: 1,
        nrCols: 1,
        posRow: 0,
        posCol: 1
    },
    {
        id: "latestLabResultsWidget",
        nrRows: 1,
        nrCols: 1,
        posRow: 1,
        posCol: 1
    },
    {
        id: "todoWidget",
        nrRows: 1,
        nrCols: 1,
        posRow: 2,
        posCol: 1
    }
]

const WIDGETSB = [
    {
        id: "latestPatientsWidget",
        nrRows: 1,
        nrCols: 1,
        posRow: 0,
        posCol: 0
    },
    {
        id: "todaysConsultationsWidget",
        nrRows: 1,
        nrCols: 1,
        posRow: 0,
        posCol: 1
    },
    {
        id: "latestLabResultsWidget",
        nrRows: 1,
        nrCols: 1,
        posRow: 1,
        posCol: 0
    },
    {
        id: "todoWidget",
        nrRows: 2,
        nrCols: 1,
        posRow: 0,
        posCol: 2
    }
]

const WIDGETSC = [
    {
        id: "latestPatientsWidget",
        nrRows: 1,
        nrCols: 4,
        posRow: 0,
        posCol: 0
    },
    {
        id: "todaysConsultationsWidget",
        nrRows: 1,
        nrCols: 1,
        posRow: 1,
        posCol: 2
    },
    {
        id: "latestLabResultsWidget",
        nrRows: 1,
        nrCols: 1,
        posRow: 1,
        posCol: 0
    },
    {
        id: "todoWidget",
        nrRows: 1,
        nrCols: 1,
        posRow: 1,
        posCol: 3
    }
]

const WIDGETSTAB = [
    {
        id: "latestPatientsWidget",
        nrRows: 2,
        nrCols: 1,
        posRow: 0,
        posCol: 0
    },
    {
        id: "todaysConsultationsWidget",
        nrRows: 1,
        nrCols: 1,
        posRow: 0,
        posCol: 1
    },
    {
        id: "latestLabResultsWidget",
        nrRows: 2,
        nrCols: 1,
        posRow: 1,
        posCol: 1
    },
    {
        id: "todoWidget",
        nrRows: 1,
        nrCols: 1,
        posRow: 2,
        posCol: 0
    }
]

const WIDGETSMOBILE = [
    {
        id: "latestPatientsWidget",
        nrRows: 1,
        nrCols: 1,
        posRow: 0,
        posCol: 0
    },
    {
        id: "todaysConsultationsWidget",
        nrRows: 1,
        nrCols: 1,
        posRow: 1,
        posCol: 0
    },
    {
        id: "latestLabResultsWidget",
        nrRows: 1,
        nrCols: 1,
        posRow: 2,
        posCol: 0
    },
    {
        id: "todoWidget",
        nrRows: 1,
        nrCols: 1,
        posRow: 3,
        posCol: 0
    }
]

customElements.define(HtMain.is, HtMain);
