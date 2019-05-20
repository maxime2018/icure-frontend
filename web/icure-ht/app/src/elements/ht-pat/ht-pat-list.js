import '@polymer/iron-icon/iron-icon.js'
import '@polymer/iron-input/iron-input.js'
import '@polymer/iron-pages/iron-pages.js'
import '@polymer/paper-button/paper-button.js'
import '@polymer/paper-checkbox/paper-checkbox.js'
import '@polymer/paper-dialog/paper-dialog.js'
import '@polymer/paper-fab/paper-fab.js'
import '@polymer/paper-icon-button/paper-icon-button.js'
import '@polymer/paper-input/paper-input.js'
import '@polymer/paper-input/paper-input-container.js'
import '@polymer/paper-item/paper-item.js'
import '@polymer/paper-listbox/paper-listbox.js'
import '@polymer/paper-menu-button/paper-menu-button.js'
import '@polymer/paper-tabs/paper-tab.js'
import '@polymer/paper-tabs/paper-tabs.js'
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
import '../ht-spinner/ht-spinner.js';

import '../dynamic-form/ckmeans-grouping.js';
import '../../dialog-style.js';
import '../../notification-style.js';

import moment from 'moment/src/moment'
import _ from 'lodash/lodash'
import filterExParser from '../../../scripts/filterExParser'
import {FilterExPrinter} from '../icc-x-api/filterExPrinter'

// To generate download xlsx file
import {XLSX} from "xlsx/dist/xlsx"

import {TkLocalizerMixin} from "../tk-localizer";

import {PolymerElement,html} from '@polymer/polymer/polymer-element.js';
class HtPatList extends TkLocalizerMixin(PolymerElement) {
  static get template() {
    return html`
        <style include="dialog-style notification-style"></style>
        <custom-style>
            <style include="custom-style">
                :host {
                    display: block;
                    height: 100%;
                    @apply --padding-right-left-32;
                }

                :host #patients-list {
                    height: calc(100% - 200px);
                    outline: none;
                    flex-grow: 1;
                }

                #scroller tbody#item {
                    cursor: pointer;
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

                .horizontal {
                    display: flex;
                    flex-direction: row;
                    flex-wrap: wrap;
                    flex-basis: 100%;
                    align-items: center;
                    width: 100%
                }

                .horizontal paper-input {
                    @apply --padding-right-left-16
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

                vaadin-grid.material {

                    font-family: Roboto, sans-serif;
                    --divider-color: rgba(0, 0, 0, var(--dark-divider-opacity));

                    --vaadin-grid-cell: {
                        padding: 8px;
                    };

                    --vaadin-grid-header-cell: {
                        height: 64px;
                        color: rgba(0, 0, 0, var(--dark-secondary-opacity));
                        font-size: var(--font-size-large);
                    };

                    --vaadin-grid-body-cell: {
                        height: 48px;
                        color: rgba(0, 0, 0, var(--dark-primary-opacity));
                        font-size: var(--font-size-normal);
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
                    padding-right: 0;
                }

                vaadin-grid.material .cell.last {
                    padding-right: 24px;
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

                .show-all-patients {
                    bottom: 20px;
                    width: 24px;
                }

                span.show-all-patients-txt {
                    max-width: 70%;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    font-size: var(--font-size-normal);
                }

                .progress-bar {
                    width: 20%;
                    right: 312px;
                    position: absolute;
                    bottom: 20px;
                }

                .add-btn-mobileonly {
                    display: block;
                    position: fixed;
                    bottom: 0;
                    right: 0;
                }

                .toggle-btn {
                    position: relative;
                }

                .closed {
                    display: none;
                }

                .line {
                    display: flex;
                    flex-flow: row nowrap;
                    align-items: center;
                    justify-content: space-between;
                    margin: 8px 0;
                }

                .line.bottom-line {
                    justify-content: flex-start;
                }

                .add-btn-container {
                    /*right: 28px;*/
                    /*position: absolute;*/
                    /*bottom: 16px;*/
                    display: flex;
                    flex-direction: row;
                    justify-content: flex-end;
                    align-items: center;
                    margin: 4px auto;

                    flex-grow: 1;
                }

                .cancel-btn {
                    --paper-button-ink-color: var(--app-text-color);
                    color: var(--app-text-color);
                    font-weight: bold;
                    font-size: 14px;
                    height: 40px;
                    min-width: 100px;
                    padding: 10px 1.2em;
                    text-transform: capitalize;
                }

                .add-btn, .exportcsv-btn {
                    --paper-button-ink-color: var(--app-secondary-color-dark);
                    color: var(--app-text-color);
                    font-weight: 700;
                    font-size: var(--font-size-normal);
                    height: 28px;
                    min-width: 100px;
                    padding: 0 12px;
                    text-transform: capitalize;
                    background: var(--app-secondary-color);
                    margin: 0 4px;
                    @apply --shadow-elevation-2dp;
                    text-transform: capitalize;
                }

                .save-btn-container {
                    width: 20%;
                    left: 0;
                    position: absolute;
                    bottom: 16px;

                    display: flex;
                    flex-direction: row;
                    justify-content: center;
                    align-items: center;
                    margin-top: 2px;
                }

                .save-btn {
                    --paper-button-ink-color: var(--app-secondary-color-dark);
                    background: var(--app-secondary-color);
                    color: var(--app-text-color);
                    font-weight: bold;
                    font-size: 14px;
                    height: 40px;
                    min-width: 100px;
                    @apply --shadow-elevation-2dp;
                    padding: 10px 1.2em;
                }

                .patient-photo {
                    background: rgba(0, 0, 0, 0.1);
                    height: 26px;
                    width: 26px;
                    min-width: 26px;
                    border-radius: 50%;
                    margin-right: 8px;
                    overflow: hidden !important;
                    padding-right: 0 !important;
                }

                .patient-photo img {
                    width: 100%;
                    margin: 50%;
                    transform: translate(-50%, -50%);
                }

                .container {
                    width: 100%;
                    height: calc(100vh - 64px - 20px);
                    position: fixed;
                    top: 64px;
                    left: 0;
                    bottom: 0;
                    right: 0;
                }

                .first-filter-panel {
                    height: 100%;
                    background: var(--app-background-color-dark);
                    top: 64px;
                    left: 0;
                    @apply --shadow-elevation-3dp;
                    grid-column: 1 / 1;
                    grid-row: 1 / 1;
                    z-index: 3;
                    overflow: hidden;
                    padding: 5px;
                }

                .second-filter-panel {
                    height: 100%;
                    background: var(--app-background-color);
                    top: 64px;
                    left: 20%;
                    @apply --shadow-elevation-2dp;
                    margin: 0;
                    grid-column: 2 / 4;
                    grid-row: 1 / 1;

                    z-index: 2;
                    @apply --padding-right-left-32;

                    display: flex;
                    flex-direction: column;
                }

                .display-left-menu {
                    display: inherit;
                }

                .submenus-container {
                    overflow-x: auto;
                    height: calc(100% - 140px);
                    margin-bottom: 16px;
                }

                collapse-button > .menu-item.iron-selected {
                    @apply --padding-right-left-16;
                    color: var(--app-text-color-light);
                    background: var(--app-primary-color);
                    @apply --text-shadow;
                }

                .menu-item {
                    @apply --padding-right-left-16;
                    height: 48px;
                    @apply --paper-font-button;
                    text-transform: inherit;
                    justify-content: space-between;
                    cursor: pointer;
                    @apply --transition;
                }

                .menu-item:hover {
                    background: var(--app-dark-color-faded);
                    @apply --transition;
                }

                .menu-item .iron-selected {
                    background: var(--app-primary-color);
                }

                .deleteFilterIcon {
                    color: var(--app-text-color-disabled);
                }

                .deleteFilterIcon:hover {
                    color: var(--app-text-color);
                    transition: all 0.24s ease-in-out;
                }

                .deleteFilterIcon iron-icon {
                    height: 14px;
                    width: 14px;
                }

                paper-item.iron-selected {
                    background-color: var(--app-primary-color);
                    color: var(--app-text-color-light);
                }

                paper-item.iron-selected:hover {
                    background: #5a6d75;
                }

                #selectPatientOption {
                    height: calc(58px + 78px);
                    box-sizing: border-box;
                    padding: 14px;
                    background: var(--app-background-color-dark);
                    -webkit-transition: background .15s;
                    transition: background .15s;
                    z-index: 2;
                    display: flex;
                    border-left: 1px solid rgba(0, 0, 0, .05);
                    border-right: 1px solid rgba(0, 0, 0, .05);
                    display: flex;
                    flex-flow: row wrap;
                    align-items: center;
                }

                #selectPatientOption_back {
                    min-width: 80px;
                    cursor: pointer;
                    line-height: 35px;
                }

                #selectPatientOption_text {
                    margin: auto;
                }

                #selectPatientOption_option {
                    cursor: pointer;
                }

                paper-listbox {
                    background: none;
                }

                #sharePatientDialog {
                    width: 1000px;
                    height: 60vh;
                }

                #sharePatientDialog .content {
                    padding-bottom: 24px;
                }

                #sharePatientDialog vaadin-grid {
                    min-height: 400px;
                    margin-top: 24px;
                }

                #sharePatientDialog #hcpFilter, #hcp-list {
                    margin: 0;
                }

                #sharePatientDialog #hcpFilter {
                    max-height: 62px;
                }

                #sharePatientDialog #hcp-list {
                    height: calc(100% - 24px - 64px);
                }

                #sharePatientDialog .buttons paper-checkbox {
                    --paper-checkbox-checked-color: var(--app-secondary-color);
                }

                #inputGender {
                    border: none;
                    width: calc(100% - 24px);
                    outline: 0;
                    background: none;
                    font-size: var(--form-font-size);
                }

                #fusionPatSelect {
                    border: none;
                    width: calc(100% - 24px);
                    outline: 0;
                    background: none;
                    font-size: var(--form-font-size);
                }

                #fusionDialog {
                    width: 50%;
                }

                #fusionDialog .content {
                    padding-top: 24px;
                    padding-bottom: calc(24px + 52px);
                }

                #fusionDialog .content paper-input-container {
                    --paper-input-container-focus-color: var(--app-primary-color);
                }

                #duplicate-list {
                    max-height: 200px;
                }

                #sharePatientDelegationDialog {
                    width: 50%;
                }

                #sharePatientDelegationDialog .content {
                    padding-bottom: calc(52px + 24px);
                    padding-top: 24px;
                }

                #importPatientStatus {
                    width: 50%;
                    display: flex;
                    flex-direction: column;
                }

                #importPatientStatus .content {
                    padding-top: 24px;
                    padding-bottom: calc(24px + 52px);
                }

                #sharingPatientStatus {
                    width: 50%;
                    display: flex;
                    flex-direction: column;
                }

                #sharingPatientStatus vaadin-grid {
                    width: calc(100% - 96px);
                    margin: auto;
                }

                .delegationCheckBox {
                    width: 220px;
                }

                .filter-panel-title {
                    display: block;
                    @apply --paper-font-body2;
                    @apply --padding-32;
                    padding-top: 8px;
                    padding-bottom: 8px;
                    margin: 0;
                }


                paper-button.filter-tag.iron-selected {
                    background: var(--app-secondary-color);
                    color: var(--app-primary-color-dark);
                }

                paper-dialog > div:not(.buttons) {
                    margin-top: 0;
                    flex-grow: 1;
                }

                paper-dialog {
                    width: 50%;
                }

                paper-input {
                    --paper-input-container-focus-color: var(--app-primary-color);
                    font-size: var(--form-font-size);
                }

                #saveFilterDialog {
                    align-items: center;
                }

                #saveFilterDialog .buttons {
                    padding: 8px 24px;
                }

                .saved-filters {
                    display: flex;
                    flex-flow: row wrap;
                    justify-content: flex-start;
                    align-items: flex-start;
                    width: 100%;
                }

                .filter-tag {
                    background: rgba(0, 0, 0, .1);
                    color: var(--exm-token-input-badge-text-color, --text-primary-color);
                    height: 34px;
                    font-size: 13px;
                    min-width: initial;
                    margin: 0 8px 8px 0;
                    border-radius: 5px;
                    text-transform: capitalize;
                }

                .del-filter {
                    height: 16px;
                    width: 16px;
                    margin-left: 8px;
                }

                .add-btn-mobile {
                    display: none;
                }

                .status-green {
                    background: #07f8804d;
                }

                .status-red {
                    background: #ff4d4d4d;
                }

                pre.recap-filter {
                    flex-grow: 1;
                    margin: 4px;
                    background: var(--app-background-color-dark);
                    padding: 4px;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    box-sizing: border-box;
                    max-width: 90%;
                }

                paper-button[disabled] {
                    background-color: var(--app-secondary-color-dark);
                    color: var(--app-text-color-disabled);
                    box-shadow: none;
                }

                @media screen and (max-width: 1120px) {
                    div.container {
                        display: inherit;
                    }

                    .add-btn-container {
                        width: 100%;
                        left: inherit;
                        position: initial;
                        justify-content: initial;
                        padding-top: 15px;
                        overflow-x: scroll;
                        height: 100px;
                        border-left: 1px dashed lightgrey;
                        border-right: 1px dashed lightgrey;
                        box-sizing: border-box;
                    }

                    .add-btn-container paper-button.add-btn,
                    .add-btn-container .exportcsv-btn {
                        height: 60px;
                    }

                    .add-btn-container {
                        display: none;
                    }

                    .add-btn-mobile {
                        display: block;
                        position: fixed;
                        bottom: 4px;
                        right: 36px;
                    }

                    .add-list-mobile {
                        position: fixed;
                        bottom: 48px;
                        right: 40px;

                        background: var(--app-background-color-light);
                        width: 200px;
                        border: 1px solid rgba(0, 0, 0, .1);
                        border-radius: 2px;
                        z-index: 99;
                        padding: 8px 0;

                        transition: .25s cubic-bezier(0.075, 0.82, 0.165, 1);
                        transform: scaleY(0);
                        transform-origin: bottom;
                    }

                    .shown-menu {
                        transform: scaleY(1);
                    }

                    .toggle-btn {
                        color: var(--app-text-color);
                        background: var(--app-secondary-color);
                        width: 32px;
                        height: 32px;
                    }

                    .add-elem-mobile {
                        cursor: pointer;
                        padding: 10px;
                    }

                    .add-elem-mobile:hover {
                        background: rgba(0, 0, 0, .1);
                    }

                    .eid {
                        padding-top: 12px;
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

                    .horizontal paper-input {
                        @apply --padding-right-left-16;
                        height: 65px;
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

                    .dialog {
                        width: 80%;
                        min-height: 320px;
                        display: flex;
                        flex-flow: row wrap;
                        justify-content: space-between;
                        align-items: flex-start;
                    }

                    .add-pat-dialog {
                        display: initial;
                    }
                }

                ht-spinner {
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    z-index: 9999;
                    transform: translate(-50%, -50%);
                    height: 42px;
                    width: 42px;
                }

                import-spinner {
                    position: fixed;
                    top: 210px;
                    left: 50%;
                    z-index: 9999;
                    transform: translateX(-60%);
                }

                #add-patient-dialog {
                    border-radius: 2px;
                }

                #add-patient-dialog .administrative-panel {
                    padding: 0;
                    margin-bottom: calc(52px + 24px);
                }

                #add-patient-dialog .administrative-panel paper-tabs {
                    border-radius: 2px 2px 0 0;

                }

                #add-patient-dialog .administrative-panel iron-pages {
                    padding: 0 24px;
                }

                #add-patient-dialog .administrative-panel .horizontal {
                    justify-content: space-between;
                }

                #add-patient-dialog .administrative-panel .horizontal paper-input {
                    flex-grow: 1;
                }

                #add-patient-dialog .administrative-panel .horizontal paper-icon-button {
                    margin-top: 8px;
                }

                .extra-info {
                    color: var(--app-text-color-disabled);
                    font-style: italic;
                    font-size: 80%;
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

                vaadin-upload {
                    overflow-y: auto;
                    margin-top: 24px;
                    margin-bottom: calc(24px + 52px);
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

                .doNotDisplay {
                    display: none;
                }

                .eid-notification-panel {
                    display: none;
                    flex-direction: column;
                    position: fixed;
                    top: 84px;
                    right: -264px;
                    padding: 0;
                    background: var(--app-background-color);
                    color: var(--app-text-color);
                    font-size: 13px;
                    width: 460px;
                    opacity: 0;
                    z-index: 1000;
                    border-radius: 3px 0 0 3px;
                    box-shadow: var(--app-shadow-elevation-1);
                    overflow: hidden;
                    transition: all .5s ease-in;
                    z-index: 2;
                }


                .notification {
                    display: flex;
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
                    justify-content: flex-end;
                }

                div.panel-bottom-btns > paper-button {
                    margin: 4px;
                    transition: .25s ease;
                }

                div.panel-bottom-btns > paper-button > iron-icon {
                    padding: 4px;
                    box-sizing: border-box;
                    opacity: .7;
                }

                div.panel-bottom-btns > paper-button:hover {
                    box-shadow: var(--app-shadow-elevation-2);
                }

                paper-icon-button.save-filter {
                    z-index: 1000;
                }

                .search-field-container {
                    display: flex;
                    flex-flow: row nowrap;
                    justify-content: space-between;
                    align-items: center;
                    z-index: 1;
                }

                .search-field-container paper-input {
                    flex-grow: 1;
                }

                .search-field-container paper-button {
                    margin: 20px 24px 0 0;
                }
            </style>
        </custom-style>

        <div class="container">

            <paper-item id="eidOpenPatientMessage" class="eid-notification-panel">
                <div class="panel-header">
                    <iron-icon icon="vaadin:health-card"></iron-icon>
                    [[localize('inv_pat','Patient',language)]]
                </div>
                <vaadin-grid id="eid-patients-list" class="material eid-patients-list" items="[[eidPatientsList]]" on-tap="openWithEid" active-item="{{activeItem}}">
                    <vaadin-grid-column flex-grow="0" width="25%">
                        <template class="header">
                            <div class="cell frozen">[[localize('pic','Picture',language)]]</div>
                        </template>
                        <template>
                            <div class="cell frozen patient-photo"><img src\$="[[picture(item)]]"></div>
                        </template>
                    </vaadin-grid-column>
                    <vaadin-grid-column flex-grow="1">
                        <template class="header">
                            <vaadin-grid-sorter path="lastName">[[localize('las_nam','Last name',language)]]
                            </vaadin-grid-sorter>
                        </template>
                        <template>
                            <div class="cell frozen">[[item.lastName]]</div>
                        </template>
                    </vaadin-grid-column>
                    <vaadin-grid-column flex-grow="0" width="25%">
                        <template class="header">
                            <vaadin-grid-sorter path="firstName">[[localize('fir_nam','First name',language)]]
                            </vaadin-grid-sorter>
                        </template>
                        <template>
                            <div class="cell frozen">[[item.firstName]]</div>
                        </template>
                    </vaadin-grid-column>
                </vaadin-grid>
                <div class="panel-bottom-btns">
                    <paper-button on-tap="confirm">
                        <iron-icon icon="add-circle"></iron-icon>
                        [[localize('create_new_pat','Create New Patient',language)]]
                    </paper-button>
                    <paper-button on-tap="closeEidPanel" panel="eidOpenPatientMessage">
                        <iron-icon icon="cancel" panel="eidOpenPatientMessage"></iron-icon>
                        [[localize('clo','Close',language)]]
                    </paper-button>
                </div>
            </paper-item>
            <paper-item id="eidFound" class="notification-container">
                <iron-icon class="notification-icn" icon="vaadin:health-card"></iron-icon>
                <div class="notification-msg">[[localize('eid_found','eid found',language)]],
                    [[localize('open_pat','open patient',language)]] ?
                </div>
                <paper-button class="notification-btn" on-tap="closeEidPanel" panel="eidFound">
                    <iron-icon icon="cancel" panel="eidFound"></iron-icon>
                    [[localize('no','No',language)]]
                </paper-button>
                <paper-button class="notification-btn" on-tap="checkNiss">
                    <iron-icon icon="check-circle"></iron-icon>
                    [[localize('yes','Yes',language)]]
                </paper-button>
            </paper-item>

            <div class="second-filter-panel">

                <template is="dom-if" if="{{_isPatientsSelected(nbPatientSelected.*)}}">
                    <div id="selectPatientOption">
                        <div id="selectPatientOption_back" on-tap="_deselectAllSelectedPatients">
                            <iron-icon icon="vaadin:arrow-left"></iron-icon>
                            <span>[[localize('can','Cancel',language)]]</span>
                        </div>
                        <div id="selectPatientOption_text">
                            [[nbPatientSelected]] [[localize('pat','Patients',language)]]
                            [[localize('multiple_selected','Selected',language)]]
                        </div>
                    </div>
                </template>
                <template is="dom-if" if="{{!_isPatientsSelected(nbPatientSelected.*)}}">
                    <div class="search-field-container">
                        <!--paper-button class="modal-button modal-button--save" on-tap="displayAllPatients">View All Patients</paper-button-->
                        <paper-input id="filter" label="[[localize('search','Search',language)]]" value="{{filterValue}}" autofocus="">
                            <div slot="suffix">
                                <paper-icon-button icon="star" id="save-filter" class="save-filter" on-tap="_saveFilter" disabled="[[!filterValue.length]]"></paper-icon-button>
                                <paper-tooltip for="save-filter" position="left">[[localize('save_filter','Save
                                    filter',language)]]
                                </paper-tooltip>
                            </div>
                        </paper-input>
                    </div>
                    <div id="saved-filters" class="saved-filters">
                        <paper-listbox id="filters" selectable="paper-button" multi="" toggle-shift="" selected-values="{{selectedFilterIndexes}}">
                            <template is="dom-repeat" items="[[_activeFilters(user.properties.*)]]" as="filter" id="filterMenu">
                                <paper-button class="filter-tag" id="[[filter.name]]" api="[[api]]" user="[[user]]" language="[[language]]">
                                    <div class="one-line-menu list-title">
                                        [[filter.name]]
                                    </div>
                                    <div>
                                        <iron-icon class="del-filter" icon="clear" id="[[filter.name]]" on-tap="deleteFilter"></iron-icon>
                                    </div>
                                </paper-button>
                            </template>
                        </paper-listbox>
                    </div>
                </template>


                <ht-spinner class="center" active="[[isLoadingPatient]]"></ht-spinner>
                <vaadin-grid id="patients-list" class="material" multi-sort="[[multiSort]]" active-item="{{activeItem}}" on-tap="clickOnRow">
                    <template is="dom-if" if="[[onElectron]]">
                        <vaadin-grid-column flex-grow="0" width="64px">
                            <template class="header">
                                <div class="cell frozen"></div>
                            </template>
                            <template>
                                <div class="cell frozen">
                                    <template is="dom-if" if="[[!_optionsChecked(shareOption.*,exportOption.*,fusionOption.*)]]">
                                        <paper-icon-button id="new-window-[[item.id]]" icon="icons:open-in-new" on-tap="openPatientOnElectron" data-item\$="[[item.id]]"></paper-icon-button>
                                        <paper-tooltip for="new-window-[[item.id]]" position="right" style="white-space: nowrap;">[[localize('new_win','New
                                            window',language)]]
                                        </paper-tooltip>
                                    </template>
                                </div>
                            </template>
                        </vaadin-grid-column>
                    </template>


                    <vaadin-grid-column flex-grow="0" width="52px">
                        <template class="header">
                            <!-- <div class="cell frozen">[[localize('pic','Picture',language)]]</div> -->
                        </template>
                        <template>
                            <template is="dom-if" if="[[!_optionsChecked(shareOption.*,exportOption.*,fusionOption.*)]]">
                                <div class="cell frozen patient-photo">
                                    <img src\$="[[picture(item)]]">
                                </div>
                            </template>
                            <template is="dom-if" if="[[_optionsChecked(shareOption.*,exportOption.*,fusionOption.*)]]">
                                <vaadin-checkbox id="[[item.id]]" patient="[[item]]" checked="[[_patientSelected(item, patientSelected.*)]]" on-checked-changed="_checkSharePatient"></vaadin-checkbox>
                            </template>
                        </template>
                    </vaadin-grid-column>
                    <vaadin-grid-column flex-grow="0" width="100px">
                        <template class="header">
                            <vaadin-grid-sorter path="fileNumber">[[localize('ext_id_short', 'File N°', language)]]
                            </vaadin-grid-sorter>
                        </template>
                        <template>
                            <div class="cell frozen">[[item.fileNumber]]</div>
                        </template>
                    </vaadin-grid-column>
                    <vaadin-grid-column flex-grow="0" width="10%">
                        <template class="header">
                            <vaadin-grid-sorter path="lastName">[[localize('las_nam','Last name',language)]]
                            </vaadin-grid-sorter>
                        </template>
                        <template>
                            <div class="cell frozen">[[item.lastName]]</div>
                        </template>
                    </vaadin-grid-column>
                    <vaadin-grid-column flex-grow="0" width="10%">
                        <template class="header">
                            <vaadin-grid-sorter path="firstName">[[localize('fir_nam','First name',language)]]
                            </vaadin-grid-sorter>
                        </template>
                        <template>
                            <div class="cell frozen">[[item.firstName]]</div>
                        </template>
                    </vaadin-grid-column>
                    <vaadin-grid-column flex-grow="0" width="104px">
                        <template class="header">
                            <vaadin-grid-sorter path="dateOfBirth">[[localize('dat_of_bir','Date of birth',language)]]
                            </vaadin-grid-sorter>
                        </template>
                        <template>
                            <div class="cell frozen">[[formatDateOfBirth(item.dateOfBirth)]]</div>
                        </template>
                    </vaadin-grid-column>

                    <vaadin-grid-column flex-grow="0" width="100px">
                        <template class="header">
                            <div class="cell numeric">[[localize('pho','Phone',language)]]</div>
                        </template>
                        <template>
                            <div class="cell numeric">[[item.phone]]</div>
                        </template>
                    </vaadin-grid-column>
                    <!-- <vaadin-grid-column flex-grow="0" width="150px">
                        <template class="header">
                            <div class="cell numeric">[[localize('mob','Mobile',language)]]</div>
                        </template>
                        <template>
                            <div class="cell numeric">[[item.mobile]]</div>
                        </template>
                    </vaadin-grid-column> -->
                    <vaadin-grid-column flex-grow="1">
                        <template class="header">
                            <div class="cell frozen">[[localize('postalAddress','Address',language)]]</div>
                        </template>
                        <template>
                            <div class="cell frozen">[[item.postalAddress]]</div>
                        </template>
                    </vaadin-grid-column>
                    <vaadin-grid-column flex-grow="0" width="17%">
                        <template class="header">
                            <div class="cell frozen">[[localize('ema','Email',language)]]</div>
                        </template>
                        <template>
                            <div class="cell frozen">[[item.email]]</div>
                        </template>
                    </vaadin-grid-column>
                </vaadin-grid>

                <div class="add-btn-mobile">
                    <paper-fab mini="" icon="more-vert" id="add-btn-mobile-btn" class="toggle-btn" on-tap="toggleMobileMenu"></paper-fab>
                    <paper-tooltip position="left" for="add-btn-mobile-btn">[[localize('more','More',language)]]
                    </paper-tooltip>
                    <div id="add-list-mobile" class\$="add-list-mobile [[isShown]]">
                        <template is="dom-if" if="[[!_optionsChecked(shareOption.*,exportOption.*,fusionOption.*)]]">
                            <div class="add-elem-mobile" on-tap="_addPatient">[[localize('add_pat','Add
                                Patient',language)]]
                            </div>
                            <template is="dom-if" if="[[btnSelectionPatient]]">
                                <div class="add-elem-mobile" on-tap="_sharePatient">[[localize('share_pat','Share
                                    patients',language)]]
                                </div>
                                <div class="add-elem-mobile" on-tap="_exportPatient">[[localize('export_pat','Export
                                    patients',language)]]
                                </div>
                                <div class="add-elem-mobile" on-tap="_fusionPatient">[[localize('fus_pat','Fusion
                                    patients',language)]]
                                </div>
                            </template>
                            <div class="add-elem-mobile" on-tap="_sharePatientAll">[[localize('share_all_pat','Share all
                                patients',language)]]
                            </div>
                            <div class="add-elem-mobile" on-tap="_exportListToXls">[[localize('export_xls','Export to
                                XLS',language)]]
                            </div>
                            <div class="add-elem-mobile" on-tap="_openImportPatientFromMfDialog">
                                [[localize('import_mf','Import patient from PMF/SMF',language)]]
                            </div>
                        </template>
                        <template is="dom-if" if="[[_optionsChecked(shareOption.*,exportOption.*,fusionOption.*)]]">
                            <div class="add-elem-mobile" on-tap="_cancelSelecting">
                                [[localize('canc','Cancel',language)]]
                            </div>
                            <div class="add-elem-mobile" on-tap="_openPatientActionDialog">
                                [[localize('sel','Select',language)]]</div>
                            <template is="dom-if" if="[[taskProgress]]">
                                <vaadin-progress-bar class="progress-bar" value="[[taskProgress]]"></vaadin-progress-bar>
                            </template>
                        </template>
                    </div>
                </div>

                <div class="line bottom-line">
                    <vaadin-checkbox class="show-all-patients" checked="{{showInactive}}">
                    </vaadin-checkbox>
                    <span class="show-all-patients-txt">[[localize('show_inactive_patients','Show inactive patients',language)]]</span>
                    <div class="add-btn-container">
                        <template is="dom-if" if="[[!_optionsChecked(shareOption.*,exportOption.*,fusionOption.*)]]">
                            <paper-button class="add-btn" on-tap="_addPatient">[[localize('add_pat','Add
                                Patient',language)]]
                            </paper-button>

                            <template is="dom-if" if="[[btnSelectionPatient]]">
                                <paper-button class="add-btn" on-tap="_sharePatient">[[localize('share_pat','Share
                                    patients',language)]]
                                </paper-button>
                                <paper-button class="add-btn" on-tap="_exportPatient">[[localize('export_pat','Export
                                    patients',language)]]
                                </paper-button>
                                <paper-button class="add-btn" on-tap="_fusionPatient">[[localize('fus_pat','Fusion
                                    patients',language)]]
                                </paper-button>
                            </template>

                            <paper-button class="add-btn" on-tap="_sharePatientAll">[[localize('share_all_pat','Share
                                all patients',language)]]
                            </paper-button>
                            <paper-button class="exportcsv-btn" on-tap="_exportListToXls">
                                [[localize('export_xls','Export to XLS',language)]]
                            </paper-button>
                            <paper-button class="exportcsv-btn" on-tap="_openImportPatientFromMfDialog">
                                [[localize('import_mf','Import patient from PMF/SMF',language)]]
                            </paper-button>
                        </template>
                        <template is="dom-if" if="[[_optionsChecked(shareOption.*,exportOption.*,fusionOption.*)]]">
                            <paper-button class="cancel-btn" on-tap="_cancelSelecting">
                                [[localize('canc','Cancel',language)]]
                            </paper-button>
                            <paper-button class="add-btn" on-tap="_openPatientActionDialog">
                                <iron-icon icon="icons:check" on-tap="_openPatientActionDialog"></iron-icon>
                                [[localize('sel','Select',language)]]
                            </paper-button>
                            <template is="dom-if" if="[[taskProgress]]">
                                <vaadin-progress-bar class="progress-bar" value="[[taskProgress]]"></vaadin-progress-bar>
                            </template>
                        </template>
                    </div>
                </div>
            </div>
        </div>

        <paper-dialog id="patient-import-dialog">
            <h2 class="modal-title">[[localize('upl_mffil','Upload SMF/PMF files',language)]]<span class="extra-info">[[localize('xml_files', '(XML files)', language)]]</span>
            </h2>
            <div class="content">
                <vaadin-upload id="vaadin-upload" no-auto="" files="{{files}}" accept="text/xml,application/xml" target="[[api.host]]/document/{documentId}/attachment/multipart;jsessionid=[[api.sessionId]]" method="PUT" form-data-name="attachment" on-upload-success="_mfFileUploaded"></vaadin-upload>
            </div>
            <div class="buttons">
                <paper-button class="modal-button" dialog-dismiss="">[[localize('can','Cancel',language)]]</paper-button>
            </div>
        </paper-dialog>

        <paper-dialog id="add-patient-dialog" class="dialog add-pat-dialog">
            <h2 class="modal-title">[[localize('add_pat','Add a patient',language)]]</h2>
            <div class="administrative-panel" style="width:100%">
                <paper-tabs selected="{{tabs}}" style="background: var(--app-secondary-color); --paper-tabs-selection-bar-color: var(--app-text-color-disabled)">
                    <paper-tab class="adm-tab">
                        <iron-icon style="margin-right:10px" icon="icons:assignment-ind"></iron-icon>
                        [[localize('subscription_form_physical_person','Physical person',language)]]
                    </paper-tab>
                    <paper-tab class="adm-tab doNotDisplay" id="medicalHouseTabView">
                        <iron-icon style="margin-right:10px" icon="vaadin:family"></iron-icon>
                        [[localize('subscription_form_medical_house','Medical houses',language)]]
                    </paper-tab>
                </paper-tabs>

                <div class="content">
                    <iron-pages selected="[[tabs]]">
                        <page>
                            <div class="content-block horizontal">
                                <paper-icon-button icon="vaadin:health-card" id="read-eid" class="eid" on-tap="_readEid"></paper-icon-button>
                                <paper-tooltip for="read-eid" position="top">[[localize('fill_with_eid','Fill with
                                    eID',language)]]
                                </paper-tooltip>
                                <paper-input label="[[localize('las_nam','Last name',language)]]" style="min-width:200px" value="{{lastName}}"></paper-input>
                                <paper-input label="[[localize('fir_nam','First name',language)]]" value="{{firstName}}"></paper-input>
                                <vaadin-date-picker label="[[localize('dat_of_bir','Date of birth',language)]]" i18n="[[i18n]]" value="{{dateAsString}}"></vaadin-date-picker>
                                <paper-input label="[[localize('niss','Ssin',language)]]" value="{{ssin}}" on-keyup="_searchDuplicate"></paper-input>
                                <paper-input-container>
                                    <label slot="label">[[localize("gender","Gender",language)]]
                                    </label>
                                    <iron-input slot="input" bind-value="{{valueGender}}">
                                        <input id="inputGender" readonly="" value="{{valueGender::input}}" on-tap="_openPopupMenu">
                                    </iron-input>
                                    <paper-menu-button id="paper-menu-button" slot="suffix" horizontal-offset="[[listBoxOffsetWidth]]">
                                        <iron-icon icon="paper-dropdown-menu:arrow-drop-down" slot="dropdown-trigger"></iron-icon>
                                        <paper-listbox id="dropdown-listbox" slot="dropdown-content" selected="{{selected}}" selected-item="{{selectedItem}}">
                                            <paper-item id="unknown">[[localize('unknown','unknown',language)]]
                                            </paper-item>
                                            <paper-item id="male">[[localize('male','male',language)]]</paper-item>
                                            <paper-item id="female">[[localize('female','female',language)]]
                                            </paper-item>
                                            <paper-item id="indeterminate">
                                                [[localize('indeterminate','indeterminate',language)]]
                                            </paper-item>
                                            <paper-item id="changed">[[localize('changed','changed',language)]]
                                            </paper-item>
                                        </paper-listbox>
                                    </paper-menu-button>
                                </paper-input-container>
                            </div>
                        </page>
                        <page>
                            <!--Medical houses-->
                            <div class="content-block horizontal" style="margin-top:20px">

                                <vaadin-combo-box id="mh-search" filtered-items="[[mhListItem]]" item-label-path="hrLabel" style="width:30%" item-value-path="id" on-filter-changed="_mhSearch" on-keydown="" label="[[localize('mh','Medical house',language)]]" value="{{medicalHouseContract.hcpId}}">
                                </vaadin-combo-box>

                                <vaadin-date-picker label="[[localize('sub_dat','Subscription date',language)]]" value="{{medicalHouseContract.startOfContract}}" i18n="[[i18n]]" id="startOfContract" always-float-label="" on-value-changed="updateStartOfCoverage" style="width:20%"></vaadin-date-picker>
                                <paper-input label="[[localize('sub_eva_mon','Subscription evaluation months',language)]]" value="" i18n="[[i18n]]" id="evalutationMonths" on-value-changed="updateStartOfCoverage" type="number" always-float-label="" min="0" step="3" max="3" style="min-width: 20%"></paper-input>
                                <vaadin-date-picker label="[[localize('cov_sta','Coverage start',language)]]" value="{{medicalHouseContract.startOfCoverage}}" i18n="[[i18n]]" id="startOfCoverage" always-float-label="" readonly="" style="width:20%"></vaadin-date-picker>
                            </div>
                            <div class="horizontal" style="margin-top:30px">
                                <label style="font-weight: 700; display:inline-block; margin-right:30px;">
                                    <iron-icon icon="icons:check" style="margin-right:10px; color:var(--app-secondary-color);"></iron-icon>
                                    [[localize('patient_subscriptions','Patient subscriptions',language)]]:</label>
                                <paper-checkbox value="{{medicalHouseContract.gp}}" checked="{{medicalHouseContract.gp}}" id="medicalHouseContractGpCheckBox" label="[[localize('has_m','Has doctor subscription',language)]]" always-float-label="" style="margin-right:30px">[[localize('has_m','Has doctor
                                    subscription',language)]]?
                                </paper-checkbox>
                                <paper-checkbox value="{{medicalHouseContract.kine}}" checked="{{medicalHouseContract.kine}}" id="medicalHouseContractKineCheckBox" label="[[localize('has_k','Has physiotherapist subscription',language)]]" always-float-label="" style="margin-right:30px">[[localize('has_k','Has physiotherapist
                                    subscription',language)]]?
                                </paper-checkbox>
                                <paper-checkbox value="{{medicalHouseContract.nurse}}" checked="{{medicalHouseContract.nurse}}" id="medicalHouseContractNurseCheckBox" label="[[localize('has_i','Has nurse subscription',language)]]" always-float-label="">[[localize('has_i','Has nurse subscription',language)]]?
                                </paper-checkbox>
                            </div>
                        </page>
                    </iron-pages>


                    <div>
                        <template is="dom-if" if="[[displayResult]]">
                            <vaadin-grid id="duplicate-list" class="material" items="[[listResultPatients]]">
                                <vaadin-grid-column>
                                    <template class="header">
                                        [[localize('las_nam','Last name',language)]]
                                    </template>
                                    <template>
                                        <div>[[item.lastName]]</div>
                                    </template>
                                </vaadin-grid-column>
                                <vaadin-grid-column>
                                    <template class="header">
                                        [[localize('fir_nam','First name',language)]]
                                    </template>
                                    <template>
                                        <div>[[item.firstName]]</div>
                                    </template>
                                </vaadin-grid-column>
                                <vaadin-grid-column>
                                    <template class="header">
                                        [[localize('dat_of_bir','Date of birth',language)]]
                                    </template>
                                    <template>
                                        <div>[[formatDateOfBirth(item.dateOfBirth)]]</div>
                                    </template>
                                </vaadin-grid-column>
                                <vaadin-grid-column>
                                    <template class="header">
                                        [[localize('ssin','SSIN',language)]]
                                    </template>
                                    <template>
                                        <div>[[item.ssin]]</div>
                                    </template>
                                </vaadin-grid-column>
                                <vaadin-grid-column>
                                    <template class="header">
                                        [[localize('remark','Remarks',language)]]
                                    </template>
                                    <template>
                                        <div>[[item.remarks]]</div>
                                    </template>
                                </vaadin-grid-column>
                            </vaadin-grid>
                        </template>
                    </div>
                </div>
            </div>
            <div class="buttons">
                <paper-button class="modal-button modal-button--cancel" dialog-dismiss="">
                    [[localize('can','Cancel',language)]]
                </paper-button>
                <paper-button class="modal-button modal-button--save" dialog-confirm="" autofocus="" on-tap="confirm" disabled="[[!canAddPat]]">[[localize('cre','Create',language)]]
                </paper-button>
            </div>
            
        </paper-dialog>


        <paper-dialog id="saveFilterDialog">
            <h2 class="modal-title">[[localize('save_filter','Save Filter',language)]]</h2>
            <div>
                <paper-input class="filterNameInput" label="[[localize('filter_name','Filter name',language)]]" value="{{filterName}}"></paper-input>
            </div>
            <div class="line">
                <span>[[localize('fil','Filter',language)]] : </span>
                <pre class="recap-filter">[[filterValue]]</pre>
            </div>
            <div class="buttons">
                <paper-button class="modal-button" dialog-dismiss="">[[localize('can','Cancel',language)]]</paper-button>
                <paper-button class="modal-button modal-button--save" dialog-confirm="" autofocus="" on-tap="confirmFilter">
                    [[localize('cre','Create',language)]]
                </paper-button>
            </div>
        </paper-dialog>

        <paper-dialog id="sharePatientDialog">
            <h2 class="modal-title">[[localize('share_to_what_hcp','With which provider do you want to share these
                patients',language)]] ?</h2>
            <div class="content">
                <paper-input id="hcpFilter" label="[[localize('fil','Filter',language)]]" value="{{hcpFilterValue}}"></paper-input>
                <vaadin-grid id="hcp-list" class="material" multi-sort="[[multiSort]]" items="[[hcp]]" active-item="{{activeHcp}}">
                    <vaadin-grid-column width="40px">
                        <template class="header">
                            <vaadin-checkbox on-checked-changed="_toggleBoxes"></vaadin-checkbox>
                        </template>
                        <template>
                            <vaadin-checkbox class="checkbox" id="[[item.id]]" checked="[[_sharingHcp(item, hcp.*)]]" on-checked-changed="_checkHcp" disabled="[[shareAll]]"></vaadin-checkbox>
                        </template>
                    </vaadin-grid-column>
                    <vaadin-grid-column width="100px">
                        <template class="header">
                            <vaadin-grid-sorter path="lastName">[[localize('las_nam','Last name',language)]]
                            </vaadin-grid-sorter>
                        </template>
                        <template>
                            <div class="cell frozen">[[_any(item.lastName, item.name, item)]]</div>
                        </template>
                    </vaadin-grid-column>
                    <vaadin-grid-column width="100px">
                        <template class="header">
                            <vaadin-grid-sorter path="firstName">[[localize('fir_nam','First name',language)]]
                            </vaadin-grid-sorter>
                        </template>
                        <template>
                            <div class="cell frozen">[[item.firstName]]</div>
                        </template>
                    </vaadin-grid-column>
                    <vaadin-grid-column width="100px">
                        <template class="header">
                            <vaadin-grid-sorter path="speciality">[[localize('spe','Speciality',language)]]
                            </vaadin-grid-sorter>
                        </template>
                        <template>
                            <div class="cell frozen">[[item.speciality]]</div>
                        </template>
                    </vaadin-grid-column>
                    <vaadin-grid-column width="100px">
                        <template class="header">
                            <vaadin-grid-sorter path="email">[[localize('ema','Email',language)]]
                            </vaadin-grid-sorter>
                        </template>
                        <template>
                            <div class="cell frozen">[[item.email]]</div>
                        </template>
                    </vaadin-grid-column>
                </vaadin-grid>
            </div>
            <div class="buttons">
                <paper-checkbox on-checked-changed="displayAllHcps">[[localize('disp_all_hcps','Display all HCPs',
                    language)]]
                </paper-checkbox>
                <paper-button class="modal-button" dialog-dismiss="">[[localize('can','Cancel',language)]]</paper-button>
                <paper-button class="modal-button modal-button--save" dialog-confirm="" autofocus="" on-tap="confirmSharingNextStep">[[localize('share_pat','Share
                    patients',language)]]
                </paper-button>
            </div>
        </paper-dialog>

        <paper-dialog id="sharePatientDelegationDialog">
            <h2 class="modal-title">[[localize("titleSharPatDelDia","Quels sont les droits d'accès à partager
                ?",language)]]</h2>
            <div class="content">
                <vaadin-grid items="[[hcpSelectedForSharing]]">
                    <vaadin-grid-column width="150px">
                        <template class="header">
                            [[localize('hcp_ident','HCP',language)]]
                        </template>
                        <template>
                            [[getNamesWithHcpId(item.id)]]
                        </template>
                    </vaadin-grid-column>
                    <vaadin-grid-column width="700px">
                        <template class="header">
                            [[localize('access_rights','Access rights',language)]]
                        </template>
                        <template>
                            <div>
                                <template is="dom-repeat" items="[[delegation]]" as="delegationTag">
                                    <template is="dom-if" if="{{_showAllDelegation(delegationTag,item.id,hcpSelectedForSharing.*)}}">
                                        <vaadin-checkbox class="delegationCheckBox" id="[[item.id]][[delegationTag]]" checked="{{checkingDelegation(delegationTag,item.delegation,hcpSelectedForSharing.*)}}" on-checked-changed="_checkDelegation">
                                            [[localize(delegationTag,delegationTag,language)]]
                                        </vaadin-checkbox>
                                        <template is="dom-if" if="{{_neededBr(delegationTag)}}">
                                            <br>
                                        </template>
                                    </template>
                                </template>
                            </div>
                        </template>
                    </vaadin-grid-column>
                </vaadin-grid>
            </div>
            <div class="buttons">
                <paper-button class="modal-button" dialog-dismiss="">[[localize('can','Cancel',language)]]</paper-button>
                <paper-button class="modal-button modal-button--save" dialog-confirm="" autofocus="" on-tap="confirmSharing">
                    [[localize('share_pat','Share patients',language)]]
                </paper-button>
            </div>
        </paper-dialog>

        <paper-dialog id="sharingPatientStatus">
            <h2 class="modal-title">[[localize("pat_sha_sta","Patient sharing status",language)]]</h2>
            <div class="content">
                <ht-spinner class="sharePatSpinner" active="[[isSharingPatient]]"></ht-spinner>
                <vaadin-grid items="[[patientShareStatuses]]">
                    <vaadin-grid-column width="150px">
                        <template class="header">
                            [[localize('pati','Patient',language)]]
                        </template>
                        <template>
                            [[item.patient.firstName]] [[item.patient.lastName]]
                        </template>
                    </vaadin-grid-column>
                    <vaadin-grid-column width="70px">
                        <template class="header">
                            [[localize('pati','Patient',language)]]
                        </template>
                        <template>
                            <span class\$="[[_statusDetailClass(item.statuses.patient)]]">[[_statusDetail(item.statuses.patient)]]</span>
                        </template>
                    </vaadin-grid-column>
                    <vaadin-grid-column width="70px">
                        <template class="header">
                            [[localize('contacts','Contacts',language)]]
                        </template>
                        <template>
                            <span class\$="[[_statusDetailClass(item.statuses.contacts)]]">[[_statusDetail(item.statuses.contacts)]]</span>
                        </template>
                    </vaadin-grid-column>
                    <vaadin-grid-column width="70px">
                        <template class="header">
                            Health elements
                        </template>
                        <template>
                            <span class\$="[[_statusDetailClass(item.statuses.healthElements)]]">[[_statusDetail(item.statuses.healthElements)]]</span>
                        </template>
                    </vaadin-grid-column>
                    <vaadin-grid-column width="70px">
                        <template class="header">
                            Invoices
                        </template>
                        <template>
                            <span class\$="[[_statusDetailClass(item.statuses.invoices)]]">[[_statusDetail(item.statuses.invoices)]]</span>
                        </template>
                    </vaadin-grid-column>
                    <vaadin-grid-column width="70px">
                        <template class="header">
                            [[localize('files','Files',language)]]
                        </template>
                        <template>
                            <span class\$="[[_statusDetailClass(item.statuses.documents)]]">[[_statusDetail(item.statuses.documents)]]</span>
                        </template>
                    </vaadin-grid-column>
                </vaadin-grid>
            </div>
            <div class="buttons">
                <paper-button class="modal-button modal-button--save" dialog-dismiss="">
                    [[localize('done','Done',language)]]
                </paper-button>
            </div>
        </paper-dialog>

        <paper-dialog id="importPatientStatus">
            <h2 class="modal-title">[[localize("pat_import_sta","Patient import status",language)]] <span>([[remainingPatientImports.length]] [[localize("file_import_remaining", "remaining files")]])</span>
            </h2>
            <div class="content">
                <vaadin-grid items="[[patientImportStatuses]]">
                    <vaadin-grid-column width="150px">
                        <template class="header">
                            [[localize('file','File',language)]]
                        </template>
                        <template>
                            [[item.filename]]
                        </template>
                    </vaadin-grid-column>
                    <vaadin-grid-column width="150px">
                        <template class="header">
                            [[localize('pati','Patient',language)]]
                        </template>
                        <template>
                            [[item.patient.firstName]] [[item.patient.lastName]]
                        </template>
                    </vaadin-grid-column>
                    <vaadin-grid-column width="70px">
                        <template class="header">
                            [[localize('folder','Folder',language)]]
                        </template>
                        <template>
                            <span class\$="[[_statusDetailClass(item.statuses.patient)]]">[[_statusDetail(item.statuses.patient)]]</span>
                        </template>
                    </vaadin-grid-column>
                    <vaadin-grid-column width="70px">
                        <template class="header">
                            [[localize('contacts','Contacts',language)]]
                        </template>
                        <template>
                            <span class\$="[[_statusDetailClass(item.statuses.contacts)]]">[[_statusDetail(item.statuses.contacts)]]</span>
                        </template>
                    </vaadin-grid-column>
                    <vaadin-grid-column width="70px">
                        <template class="header">
                            Health elements
                        </template>
                        <template>
                            <span class\$="[[_statusDetailClass(item.statuses.healthElements)]]">[[_statusDetail(item.statuses.healthElements)]]</span>
                        </template>
                    </vaadin-grid-column>
                    <vaadin-grid-column width="70px">
                        <template class="header">
                            Invoices
                        </template>
                        <template>
                            <span class\$="[[_statusDetailClass(item.statuses.invoices)]]">[[_statusDetail(item.statuses.invoices)]]</span>
                        </template>
                    </vaadin-grid-column>
                    <vaadin-grid-column width="70px">
                        <template class="header">
                            [[localize('files','Files',language)]]
                        </template>
                        <template>
                            <span class\$="[[_statusDetailClass(item.statuses.documents)]]">[[_statusDetail(item.statuses.documents)]]</span>
                        </template>
                    </vaadin-grid-column>
                </vaadin-grid>
            </div>
            <div class="buttons">
                <ht-spinner class="import-spinner" active="[[isImportingPatients]]"></ht-spinner>
                <paper-button dialog-dismiss="">[[localize('clo','Close',language)]]</paper-button>
                <paper-button on-click="abortImport">[[localize('abort','Abort',language)]]</paper-button>
                <paper-button on-click="saveImportLog">[[localize('save_import_log','Save import log',language)]]
                </paper-button>
            </div>
        </paper-dialog>

        <paper-dialog id="fusionDialog">
            <h2 class="modal-title">[[localize('fus_pat','Fusion patients',language)]]</h2>
            <div class="content">
                <paper-input-container>
                    <label slot="label">[[localize('fir_pat_fus','Selectionner le patient qui
                        restera',language)]]</label>
                    <iron-input slot="input">
                        <input id="fusionPatSelect" value="{{getNamePat(idFusionPat,idFusionPat.*)}}" readonly="" on-tap="_openPopupMenu">
                    </iron-input>
                    <paper-menu-button id="paper-menu-button" slot="suffix" horizontal-offset="[[listBoxOffsetWidth]]">
                        <iron-icon icon="paper-dropdown-menu:arrow-drop-down" slot="dropdown-trigger"></iron-icon>
                        <paper-listbox id="dropdown-listbox" slot="dropdown-content" selected="{{fusionSelected}}">
                            <template is="dom-repeat" items="{{patientSelected}}">
                                <paper-item>{{item.names}}</paper-item>
                            </template>
                        </paper-listbox>
                    </paper-menu-button>
                </paper-input-container>
            </div>
            <div class="buttons">
                <paper-button class="modal-button" dialog-dismiss="">[[localize('can','Cancel',language)]]</paper-button>
                <paper-button class="modal-button modal-button--save" dialog-confirm="" autofocus="" on-tap="confirmFusion">
                    [[localize('fus_pat','Fusion patients',language)]]
                </paper-button>
            </div>
        </paper-dialog>
`;
  }

  static get is() {
      return 'ht-pat-list'
  }

  static get properties() {
      return {
          api: {
              type: Object
          },
          user: {
              type: Object
          },
          selectedPatient: {
              type: Object,
              notify: true
          },
          activeItem: {
              type: Object
          },
          hcp: {
              type: Object
          },
          hcpSelectedForSharing: {
              type: Object,
              notify: true,
              value: () => []
          },
          showInactive: {
              type: Boolean,
              value: false
          },
          shareOption: {
              type: Boolean,
              value: false
          },
          btnSelectionPatient: {
              type: Boolean,
              value: false,
              notify: true
          },
          nbPatientSelected: {
              type: Number,
              value: 0
          },
          taskProgress: {
              type: Number,
              value: 0
          },
          i18n: {
              Type: Object,
              value: function () {
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
                      formatDate: function (d) {
                          //return moment(d).format(moment.localeData().longDateFormat('L'))
                          return moment(d).format('DD/MM/YYYY')
                      },
                      parseDate: function (s) {
                          return moment(s, 'DD/MM/YYYY').toDate()
                      },
                      formatTitle: function (monthName, fullYear) {
                          return monthName + ' ' + fullYear
                      }
                  }
                  return res
              }
          },
          selectedFilters: {
              type: Array,
              notify: true,
              value: () => []
          },
          selectedFilterIndexes: {
              type: Array,
              notify: true,
              value: () => []
          },
          files: {
              type: Array
          },
          patientSelected: {
              type: Array,
              notify: true,
              value: () => []
          },
          displayResult: {
              type: Boolean,
              value: false
          },
          listResultPatients: {
              type: Object,
              value: () => []
          },
          listBoxOffsetWidth: {
              type: Number,
              value: -100
          },
          selected: {
              type: Number,
              observer: '_selectedChanged'
          },
          valueGender: {
              type: String,
              notify: true
          },
          filterValue: {
              type: String,
              value: ''
          },
          filter: {
              type: Object,
              value: null
          },
          lastName: {
              type: String,
              value: null,
              observer: '_searchDuplicate'
          },
          firstName: {
              type: String,
              value: null,
              observer: '_searchDuplicate'
          },
          dateAsString: {
              type: String,
              value: null,
              observer: '_searchDuplicate'
          },
          ssin: {
              type: String,
              value: null,
              observer: '_searchDuplicate'
          },
          delegation: {
              type: Array,
              value: [
                  "all",
                  "administrativeData",
                  "generalInformation",
                  "financialInformation",
                  "medicalInformation",
                  "sensitiveInformation",
                  "confidentialInformation",
                  "cdItemRisk",
                  "cdItemFamilyRisk",
                  "cdItemHealthcareelement",
                  "cdItemAllergy",
                  "cdItemDiagnosis",
                  "cdItemLab",
                  "cdItemResult",
                  "cdItemParameter",
                  "cdItemMedication",
                  "cdItemTreatment",
                  "cdItemVaccine"
              ]
          },
          exportOption: {
              type: Boolean,
              value: false
          },
          fusionOption: {
              type: Boolean,
              value: false
          },
          idFusionPat: {
              type: String,
              notify: true
          },
          fusionSelected: {
              type: Number,
              observer: '_fusionSelectedChanged'
          },
          hcpFilterValue: {
              type: String
          },
          mobileMenuHidden: {
              type: Boolean,
              value: true
          },
          isShown: {
              type: String,
              value: ""
          },
          tabs: {
              type: Number,
              value: 0
          },
          medicalHouseContract: {
              type: Object,
              value: () => ({
                  mmNihii: '',
                  startOfContract: '',
                  startOfCoverage: '',
                  endOfContract: '',
                  endOfCoverage: '',
                  kine: false,
                  gp: false,
                  nurse: false,
                  hcpId: ''
              })
          },
          isLoadingPatient: {
              type: Boolean,
              value: false
          },
          hcpParentMedicalHouseData: {
              type: Object,
              value: null
          },
          mhListItem: {
              type: Array,
              value: function () {
                  return []
              }
          },
          isImportingPatients: {
              type: Boolean,
              value: false
          },
          importPromiseChain: {
              type: Object,
              value: Promise.resolve([])
          },
          remainingPatientImports: {
              type: Array,
              value: []
          },
          isSharingPatient: {
              type: Boolean,
              value: true
          },
          shareAll: {
              type: Boolean,
              value: false
          },
          cardData: {
              type: Object,
              value: {}
          },
          canAddPat: {
              type: Boolean,
              value: false
          },
          socket: {
              type: Object,
              value: {}
          },
          eidPatientsList: {
              type: Array,
              value: []
          },
          onElectron: {
              type: Boolean,
              value: false
          }
      }
  }

  static get observers() {
      return [
          '_hcpChanged(hcp)', '_selectedFilterIndexesChanged(selectedFilterIndexes.splices)', '_filterValueChanged(filterValue)', '_showInactivePatientsChanged(showInactive)', '_hcpFilterChanged(hcpFilterValue, _allHcpsChecked)', '_filesChanged(files.*)', '_canAddPat(lastName,firstName,dateAsString)',
          '_resetSearchField(selectedPatient)'
      ]
  }

  constructor() {
      super()
  }

  _showInactivePatientsChanged() {
      const grid = this.$['patients-list']
      grid.innerCache = []
      grid.clearCache()
  }

  _any(a, b, c) {
      return a || b
  }

  ready() {
      super.ready()

      this.api.isElectronAvailable().then(electron => this.set('onElectron', electron))

      this.medicalHouseContractShadowObject = {
          hcpId: null,
          mmNihii: null,
          startOfContract: null,
          startOfCoverage: null,
          kine: false,
          gp: false,
          nurse: false
      }

      var grid = this.$['patients-list']

      grid.lastParams = null //Used to prevent double calls
      grid.lastParamsWithIdx = null //Used to prevent double calls
      grid.size = 0
      grid.pageSize = 50
      grid.innerCache = []

      grid.dataProvider = (params, callback) => {
          const sort = params.sortOrders && params.sortOrders[0] && params.sortOrders[0].path || 'lastName'
          const desc = params.sortOrders && params.sortOrders[0] && params.sortOrders[0].direction === 'desc' || false

          const pageSize = params.pageSize || grid.pageSize
          const startIndex = (params.page || 0) * pageSize
          const endIndex = ((params.page || 0) + 1) * pageSize

          const thisParams = this.filterValue + "|" + sort + "|" + (desc ? "<|" : ">|") + pageSize + ":" + JSON.stringify(this.selectedFilters || [])
          const thisParamsWithIdx = thisParams + ":" + startIndex

          //100ms cooldown period

          let latestSearchValue = this.filterValue
          this.latestSearchValue = latestSearchValue

          if ((!latestSearchValue || latestSearchValue.length < 2) && !(this.selectedFilters && this.selectedFilters.length)) {
              console.log("Cancelling empty search")
              this.btnSelectionPatient = false
              this.shareOption = false
              this.exportOption = false
              this.fusionOption = false
              grid.set("size", 0)
              callback([])
              return
          }

          let svcFilter = null
          this.api.hcparty().getHealthcareParty(this.user.healthcarePartyId).then(currentHcp => {
              if (this.selectedFilters && this.selectedFilters.length) {
                  svcFilter = this.selectedFilters.length > 1 ? {
                      "$type": "IntersectionFilter",
                      filters: this.selectedFilters.map(f => f.filter)
                  } : this.selectedFilters[0].filter
              } else {
                  try {
                      svcFilter = filterExParser.parse(latestSearchValue, {hcpId: currentHcp.parentId || this.user.healthcarePartyId})
                  } catch (ignored) {
                  }
              }

              const filter = svcFilter ? null : {
                  '$type': 'IntersectionFilter',
                  'healthcarePartyId': currentHcp.parentId || this.user.healthcarePartyId,
                  'filters': _.compact(latestSearchValue.split(/[ ,;:]+/).filter(w => w.length >= 2).map(word => /^[0-9]{11}$/.test(word) ? {
                      '$type': 'PatientByHcPartyAndSsinFilter',
                      'healthcarePartyId': currentHcp.parentId || this.user.healthcarePartyId,
                      'ssin': word
                  } : /^[0-3]?[0-9][\/-](1[0-2]|0?[0-9])[\/-]([1-2][89012])?[0-9][0-9]$/.test(word) ? {
                      '$type': 'PatientByHcPartyDateOfBirthFilter',
                      'healthcarePartyId': currentHcp.parentId || this.user.healthcarePartyId,
                      'dateOfBirth': word.replace(/([0-3]?[0-9])[\/-](1[0-2]|0?[0-9])[\/-]((?:[1-2][89012])?[0-9][0-9])/g, (correspondance, p1, p2, p3) => (p3.length === 4 ? p3 : (p3 > 20) ? "19" + p3 : "20" + p3) + (p2.length === 2 ? p2 : "0" + p2) + (p1.length === 2 ? p1 : "0" + p1))
                  } : /^[0-9]{3}[0-9]+$/.test(word) ? {
                      '$type': 'UnionFilter',
                      'healthcarePartyId': currentHcp.parentId || this.user.healthcarePartyId,
                      'filters': [
                          {
                              '$type': 'PatientByHcPartyDateOfBirthBetweenFilter',
                              'healthcarePartyId': currentHcp.parentId || this.user.healthcarePartyId,
                              'minDateOfBirth': word.length >= 8 ? Number(word.substr(0, 8)) : word.length >= 6 ? Number(word.substr(0, 6) + '00') : Number(word.substr(0, 4) + '0000'),
                              'maxDateOfBirth': word.length >= 8 ? Number(word.substr(0, 8)) : word.length >= 6 ? Number(word.substr(0, 6) + '99') : Number(word.substr(0, 4) + '9999')
                          },
                          {
                              '$type': 'PatientByHcPartyAndExternalIdFilter',
                              'healthcarePartyId': currentHcp.parentId || this.user.healthcarePartyId,
                              'externalId': word
                          }
                      ]
                  } : word.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z]/g, '').length >= 2 ? {
                      '$type': 'PatientByHcPartyNameContainsFuzzyFilter',
                      'healthcarePartyId': currentHcp.parentId || this.user.healthcarePartyId,
                      'searchString': word
                  } : null))
              }

              const predicates = svcFilter ? [] : latestSearchValue.split(/[ ,;:]+/).filter(w => w.length >= 2).map(word =>
                  /^[0-9]{11}$/.test(word) ? (() => true) :
                      /^[0-3]?[0-9][\/-](1[0-2]|0?[0-9])[\/-]([1-2][89012])?[0-9][0-9]$/.test(word) ? (() => true) :
                          /^[0-9]{3}[0-9]+$/.test(word) ? ((p) => (p.dateOfBirth && (`${p.dateOfBirth}`.includes(word))) || (p.externalId && p.externalId.includes(word))) :
                              (p => {
                                  const w = word.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z]/g, '')
                                  return w.length < 2 ? true : (p.firstName && p.firstName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z]/g, '').includes(w)) ||
                                      (p.lastName && p.lastName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z]/g, '').includes(w))
                              })
              )


              if (grid.lastParamsWithIdx !== thisParamsWithIdx) {
                  grid.lastParamsWithIdx = thisParamsWithIdx
                  console.log("Starting search for " + thisParamsWithIdx)

                  this.set('hideSpinner', false)
                  this.set('isLoadingPatient', true)

                  if (thisParams !== grid.lastParams) {
                      grid.lastParams = thisParams
                      grid.innerCache = []
                  }

                  grid.lastParamsWithIdxProm = (svcFilter ? this.api.contact().filterServicesBy(null, null, 10000, {filter: svcFilter})
                              .then(out => {
                                  let rows = out.rows

                                  const svcDict = rows.reduce((acc, s) => {
                                      const cs = acc[s.id]
                                      if (!cs || !cs.modified || s.modified && this.api.after(s.modified, cs.modified)) {
                                          acc[s.id] = s
                                      }
                                      return acc
                                  }, {})
                                  const services = _.sortBy(Object.values(svcDict).filter(s => !s.endOfLife), [s => +this.api.moment(s.modified || s.created || s.valueDate)])
                                  const hcpId = this.user.healthcarePartyId

                                  return Promise.all(services.map(s => this.api.crypto().extractKeysFromDelegationsForHcpHierarchy(hcpId, document.id, s.cryptedForeignKeys)
                                      .then(({extractedKeys: cfks}) => cfks)))
                                      .then(cfksLists => this.api.patient().filterByWithUser(this.user, null, null, endIndex, params.index, sort, desc, {
                                          filter: {
                                              '$type': 'PatientByIdsFilter',
                                              'ids': _.uniqBy(_.compact(_.flatMap(cfksLists)))
                                          }
                                      }))
                              }).then(res => res.rows.filter(p => this.showInactive || p.active).slice(startIndex, endIndex)) :
                          this.api.getRowsUsingPagination((key, docId, pageSize) =>
                              this.api.patient().filterByWithUser(this.user, key, docId, pageSize || 50, 0, sort, desc, {
                                  filter: _.assign({}, filter, {filters: filter.filters})
                              })
                                  .then(pl => {
                                      const filteredRows = pl.rows.filter(p => predicates.every(f => f(p)))
                                      this.set('searchHint', filteredRows.length > 20 ? this.localize('add_criteria', 'Add search criteria (year, part of file id, part of firstname, separated by spaces to improve the precision of your search') : '')
                                      return {
                                          rows: filteredRows,
                                          nextKey: pl.nextKeyPair && pl.nextKeyPair.startKey,
                                          nextDocId: pl.nextKeyPair && pl.nextKeyPair.startKeyDocId,
                                          done: !pl.nextKeyPair
                                      }
                                  })
                                  .catch(() => {
                                      return Promise.resolve()
                                  }), p => this.showInactive || p.active, startIndex, endIndex, grid.innerCache || ((grid.innerCache = [])))
                  )

                  grid.lastParamsWithIdxProm.then(res => {
                      if (grid.lastParams !== thisParams) {
                          console.log("Cancelling obsolete search")
                          return
                      }
                      if (res.length > 0 || startIndex > 0) {
                          this.btnSelectionPatient = true
                      }
                      callback(res.map(this.pimpPatient), res.length >= endIndex - startIndex ? res.length + startIndex + pageSize : res.length + startIndex)
                  }).finally(() => {
                      this.set('hideSpinner', true)
                      this.set('isLoadingPatient', false)
                  })
              } else {
                  grid.lastParamsWithIdxProm.then(res => {
                      if (grid.lastParams !== thisParams) {
                          console.log("Cancelling obsolete search")
                          return
                      }
                      if (res.length > 0 || startIndex > 0) {
                          this.btnSelectionPatient = true
                      }
                      callback(res.map(this.pimpPatient), res.length >= endIndex - startIndex ? res.length + startIndex + pageSize : res.length + startIndex)
                  })
              }
          })

      }


      // reset to tab one
      this.tabs = 0

      this.api.hcparty().getHealthcareParty(this.user.healthcarePartyId).then(myHcp => {
          if (!!(myHcp && myHcp.parentId) || _.trim(_.get(myHcp, "type", "")).toLowerCase() === "medicalhouse") {
              this.api.hcparty().getHealthcareParty(_.get(myHcp, "parentId", _.trim(myHcp.id))).then(parentHcp => {
                  const parent = _.trim(_.get(myHcp, "type", "")).toLowerCase() === "medicalhouse" ? myHcp : parentHcp;
                  this.mhListItem = parent ? [{
                      id: parent.id,
                      name: _.upperFirst(_.lowerCase(parent.name)),
                      hrLabel:
                          _.upperFirst(_.lowerCase(parent.name)) + ' ' +
                          (typeof parent.nihii === 'undefined' || !parent.nihii ? '' : ' - ' + this.localize('nihii', 'INAMI', language) + ': ' + parent.nihii) + ' ' +
                          ''
                  }] : []
                  this.set('medicalHouseContract.hcpId', parent.id)

                  // Pre-check vs NIHII number, last 3 digits (MKI) === 1 (Respectively for "médecin", "kiné", "infirmière"
                  this.set('medicalHouseContract.gp', !!(parent && _.trim(_.get(parent, "nihii", "")).slice(-3, -2) === '1'));
                  this.set('medicalHouseContract.kine', !!(parent && _.trim(_.get(parent, "nihii", "")).slice(-2, -1) === '1'));
                  this.set('medicalHouseContract.nurse', !!(parent && _.trim(_.get(parent, "nihii", "")).slice(-1) === '1'));

              })
          } else {
              this.mhListItem = []
          }
      })
  }

  displayAllHcps(checked) {
      this._allHcpsChecked = checked.detail.value
  }

  displayAllPatients() {
      this.filterValue = "  "
  }

  _hcpFilterChanged(e) {
      let latestSearchValue = this.hcpFilterValue
      this.latestSearchValue = latestSearchValue

      if (!latestSearchValue || latestSearchValue.length < 2) {
          console.log("Cancelling empty search")
          const hcps = (_.values(this.api.hcParties || {}) || []).filter(hcp => hcp.publicKey && (!hcp.parentId || this._allHcpsChecked) && ((hcp.lastName || '').length || (hcp.name || '').length))
          this.set('hcp', _.orderBy(hcps, ['lastName'], ['asc']))
          return
      }
      this._hcpDataProvider() && this._hcpDataProvider().filter(latestSearchValue).then(res => {
          if (latestSearchValue !== this.latestSearchValue) {
              console.log("Cancelling obsolete search")
              return
          }
          this.set('hcp', res.rows)
      })
  }

  _hcpDataProvider() {
      return {
          filter: (hcpFilterValue) => {
              const desc = 'desc'
              let count = 15
              return Promise.all([this.api.hcparty().findByName(hcpFilterValue, null, null, count, desc)]).then(results => {
                  const hcpList = results[0]
                  const filtered = _.flatten(hcpList.rows.filter(hcp => hcp.publicKey && ((hcp.lastName || '').length || (hcp.name || '').length)).map(hcp => ({
                      id: hcp.id,
                      lastName: hcp.lastName,
                      firstName: hcp.firstName,
                      speciality: hcp.speciality,
                      email: hcp.email
                  })))
                  return {totalSize: filtered.length, rows: filtered}
              })

          }
      }
  }

  toggleMobileMenu() {
      this.set('mobileMenuHidden', !this.mobileMenuHidden)
      this.set('isShown', !this.mobileMenuHidden ? "shown-menu" : "")
  }


  formatDateOfBirth(dateOfBirth) {
      return dateOfBirth ? ("" + dateOfBirth).replace(/([0-9]{4})([0-9]{2})([0-9]{2})/, '$3/$2/$1') : 'N/A'
  }

  refresh() {
      const previousValue = this.filterValue
      setTimeout(() => {
          if (previousValue === this.filterValue) {
              console.log("Triggering search for " + this.filterValue)
              const grid = this.$['patients-list']
              grid.innerCache = []
              grid.clearCache()
          } else {
              console.log("Skipping search for new value " + this.filterValue + " != " + previousValue)
          }
      }, 500) //Wait for the user to stop typing
  }


  pimpPatient(p) {
      p.email = p.addresses && p.addresses.map(a => a.telecoms && a.telecoms.filter(t => t.telecomType === 'email').map(t => t.telecomNumber).join()).filter(a => a).join() || ''
      p.phone = p.addresses && p.addresses.map(a => a.telecoms && a.telecoms.filter(t => t.telecomType === 'phone').map(t => t.telecomNumber).join()).filter(a => a).join() || ''
      p.mobile = p.addresses && p.addresses.map(a => a.telecoms && a.telecoms.filter(t => t.telecomType === 'mobile').map(t => t.telecomNumber).join()).filter(a => a).join() || ''
      return p
  }

  clickOnRow(e) {
      if (this.shareOption || this.exportOption || this.fusionOption) return

      // Must click on a row
      if (e.path[0].nodeName === 'TABLE') return
      if (this.activeItem) {
          const selected = this.activeItem
          console.log('selected ', selected, ' - ' + this.latestSelected)
          this.api.patient().getPatientWithUser(this.user, selected.id).then(p => this.api.register(p, 'patient')).then(p => {
              this.set('selectedPatient', p)
              this.set('isLoadingPatient', false)
          })
      }
  }

  _addPatient() {
      this.checkForParentMedicalHouse()

      this.set('firstName', null)
      this.set('lastName', null)
      this.set('dateAsString', null)
      this.set('ssin', null)
      this.set('valueGender', null)

      this.$['add-patient-dialog'].open()
  }

  _readEid() {
      fetch('http://127.0.0.1:16042/read')
          .then((response) => {
              return response.json()
          })
          .then(res => {
              if (res.cards[0]) {
                  this.set('firstName', res.cards[0].firstName)
                  this.set('lastName', res.cards[0].surname)
                  this.set('dateAsString', this.api.moment(res.cards[0].dateOfBirth * 1000).format('YYYY-MM-DD'))
                  this.set('ssin', res.cards[0].nationalNumber)
                  this.set('valueGender', res.cards[0].gender === 'M' ? 'male' : 'female')
                  this.set('cardData', res.cards[0])
              }
          })
  }

  _exportListToCsv() {
      var columns = ["lastName", "firstName", "gender", "dateOfBirth", "ssin", "email", "phone", "mobile"]
      var csv = columns.join(";") + "\n"
      var grid = this.$['patients-list']
      grid.dataProvider({pageSize: 10000}, (items) => {
          items.forEach(item =>
              csv += columns.map(col => item[col]).join(";") + '\n'
          )

          var file = new Blob([csv], {type: "text/csv"})
          var a = document.createElement("a")
          document.body.appendChild(a)
          a.style = "display: none"

          var url = window.URL.createObjectURL(file)
          a.href = url
          a.download = "patients-list.csv"
          a.click()
          window.URL.revokeObjectURL(url)
      })

  }

  _exportListToCsv() {
      // Data mapping
      var dataColumns = [
          "lastName",
          "firstName",
          "gender",
          "dateOfBirth",
          "ssin",
          "email",
          "phone",
          "mobile"
      ]

      // Human readable columns
      var hrColumns = [
          this.localize('lastname', 'Last name'),
          this.localize('firstname', 'First name'),
          this.localize('gender', 'Gender'),
          this.localize('birthdate', 'Birthdate'),
          this.localize('ssin', 'SSIN'),
          this.localize('email_address', 'Email address'),
          this.localize('phone_number', 'Phone number'),
          this.localize('mobile_number', 'Mobile number')
      ]

      // Define csv content, header = column names
      var csvFileContent = hrColumns.join(";") + "\n\n"

      // Get grid / we're going to read data from it
      var grid = this.$['patients-list']

      // Loop grid with a max of X results (csv)
      grid.dataProvider({pageSize: 10000}, function (items) {

          // Rewrite date for HR, input = yyyymmdd, output = dd/mm/yyyy
          items.forEach(item => item.dateOfBirth = item.dateOfBirth ? ("" + item.dateOfBirth).replace(/([0-9]{4})([0-9]{2})([0-9]{2})/, '$3/$2/$1') : this.localize('na_short', 'N/A'))

          // Populate / collect
          items.forEach(item => csvFileContent += dataColumns.map(col => item[col]).join(";") + '\n')

          var fileBlob = new Blob([csvFileContent], {type: "text/csv"})
          var downloadLink = document.createElement("a")
          document.body.appendChild(downloadLink)
          downloadLink.style = "display: none"

          var urlObject = window.URL.createObjectURL(fileBlob)

          downloadLink.href = urlObject
          downloadLink.download = "patients-list.csv"
          downloadLink.click()
          window.URL.revokeObjectURL(urlObject)
      })

  }


  getAllPatients() {

      return this.api.getRowsUsingPagination(
          (key, docId) => this.api.patient().listPatientsByHcPartyWithUser(this.user, this.user.healthcarePartyId, null, (key && JSON.stringify(key) || null), docId || null, 1000, null).then(pl => ({
              rows: pl.rows.map(
                  p => (
                      p.languages = p.languages.join(' / '),
                          p.dateOfBirth = (p.dateOfBirth ? ("" + p.dateOfBirth).replace(/([0-9]{4})([0-9]{2})([0-9]{2})/, '$3/$2/$1') : this.localize('na_short', 'N/A')),
                          _.assign(
                              _.pick(p, ['lastName'], ['firstName'], ['dateOfBirth'], ['gender'], ['languages'], ['ssin']),
                              _.fromPairs(
                                  _.flatMap(
                                      p.addresses,
                                      a => [
                                          [a.addressType + '_street', a.street],
                                          [a.addressType + '_number', a.houseNumber],
                                          [a.addressType + '_zip', a.postalCode],
                                          [a.addressType + '_city', a.city]
                                      ]
                                          .concat(
                                              _.map(
                                                  a.telecoms,
                                                  t => [
                                                      a.addressType + '_' + t.telecomType, t.telecomNumber
                                                  ]
                                              )
                                          )
                                  )
                              )
                          )
                  )
              ),
              nextKey: pl.nextKeyPair && pl.nextKeyPair.startKey,
              nextDocId: pl.nextKeyPair && pl.nextKeyPair.startKeyDocId,
              done: !pl.nextKeyPair
          }))
      )
  }

  _exportListToXls() {
      this.getAllPatients().then(
          pl => ({
              rows: this.generateXlsFile(pl),
              nextKey: pl.nextKeyPair && pl.nextKeyPair.startKey,
              nextDocId: pl.nextKeyPair && pl.nextKeyPair.startKeyDocId,
              done: !pl.nextKeyPair
          })
      )
  }

  _filesChanged() {
      const vaadinUpload = this.$['vaadin-upload']
      let prom = Promise.resolve(null)
      const allFiles = this.files.filter(f => !f.attached)
      _.chunk(allFiles, 10).forEach(files =>
          Promise.all(files.map(f => {
                  f.attached = true
                  return this.api.document().newInstance(this.user, null, {
                      documentType: 'result',
                      mainUti: this.api.document().uti(f.type),
                      name: f.name
                  }).then(d => this.api.document().createDocument(d)).then(d => {
                      f.doc = d
                      f.uploadTarget = (f.uploadTarget || vaadinUpload.target).replace(/;jsessionid=.*$/, `;jsessionid=${this.api.sessionId}`).replace(/\{documentId\}/, d.id)
                      return f
                  })
              })
          ).then(files => {
              files.length && vaadinUpload.uploadFiles(files)
          })
      )
  }

  _mfFileUploaded(e) {
      const vaadinUpload = this.$['vaadin-upload']
      const f = e.detail.file
      const d = f.doc
      this.push('remainingPatientImports', d)
      this.importPromiseChain = this.importPromiseChain.then(() => this.importPatientFromDocument(d))
      this.$['importPatientStatus'].open()
      console.log("file uploaded: " + d.name)
  }

  _openImportPatientFromMfDialog() {
      const vaadinUpload = this.$['vaadin-upload']
      vaadinUpload.set('i18n.addFiles.many', this.localize('upl_fil', 'Upload file', this.language))
      vaadinUpload.set('i18n.dropFiles.many', this.localize('uplabel', 'Drop files here...', this.language))
      if (this.remainingPatientImports === undefined || this.remainingPatientImports.length === 0) {
          this.remainingPatientImports = []
          this.patientImportStatuses = []
          this.importPromiseChain = Promise.resolve([])
          this.importAborted = false
          this.$['patient-import-dialog'].open()
      } else {
          this.$['importPatientStatus'].open()
      }
  }

  removeFromRemainingPatientImports(doc) {
      this.remainingPatientImports = this.remainingPatientImports.filter(item => {
          return item.id !== doc.id
      })
      console.log("remaining: " + this.remainingPatientImports.length)
      if (this.remainingPatientImports.length === 0) {
          this.importAborted = false
          console.log("ALL IMPORT DONE")
          this.set('hideSpinner', true)
          this.set('isLoadingPatient', false)
          this.set('isImportingPatients', false)
      }
  }

  abortImport() {
      if (this.remainingPatientImports.length) {
          this.importAborted = true
      }
  }

  saveImportLog() {
      this.generateXlsFile(this.patientImportStatuses.map(stat => {
          return {
              filename: stat.filename,
              firstName: stat.patient.firstName,
              lastName: stat.patient.lastName,
              folder: this._statusDetail(stat.statuses.patient),
              contacts: this._statusDetail(stat.statuses.contacts),
              healthElements: this._statusDetail(stat.statuses.healthElements),
              invoices: this._statusDetail(stat.statuses.invoices),
              documents: this._statusDetail(stat.statuses.documents),
          }
      }))
  }

  importPatientFromDocument(document) {
      if (this.importAborted) {
          console.log("import aborted: " + document.name)
          this.set('hideSpinner', true)
          this.set('isLoadingPatient', false)
          this.set('isImportingPatients', false)
          let fakepat = {
              firstName: "Document",
              lastName: document.name
          }
          this.push('patientImportStatuses', {
              patient: fakepat, filename: document.name, statuses: {
                  contacts: {success: null, error: null},
                  healthElements: {success: null, error: null},
                  invoices: {success: null, error: null},
                  documents: {success: null, error: null},
                  patient: {success: false, error: {message: "Aborted"}}
              }
          })
          this.removeFromRemainingPatientImports(document)
          return Promise.resolve()
      }
      this.set('hideSpinner', false)
      this.set('isLoadingPatient', true)
      this.set('isImportingPatients', true)
      console.log("importing: " + document.name)
      this.dispatchEvent(new CustomEvent('idle', {bubbles: true, composed: true}))

      this.startTime = Date.now()
      return this.api.bekmehr().importSmf(document.id, "123245", null, this.user.language, {}).then(results => {
          console.log("done importSmf", (Date.now() - this.startTime) / 1000)
          let patpromises = results.map(result => {
              return this.api.patient().modifyPatientWithUser(this.user, result.patient).then(pat => {
                  let prolist = [
                      Promise.all(result.forms.map(form => {
                          return this.api.form().newInstance(this.user, pat, form)
                      })).then(forms => this.api.form().modifyForms(forms)),
                      Promise.all(result.ctcs.map(ctc => {
                          return this.api.contact().newInstance(this.user, pat, ctc)
                      })).then(c => {
                          return this.api.contact().modifyContactsWithUser(this.user, c)
                      }),
                      Promise.all(result.hes.map(he => {
                          return this.api.helement().newInstance(this.user, pat, he)
                      })).then(h => {
                          return this.api.helement().modifyHealthElements(h)
                      }),
                      Promise.all(result.documents.map(doc => {
                          return this.api.document().newInstance(this.user, pat, doc)
                      })).then(d => {
                          return this.api.document().modifyDocuments(d)
                      })
                  ]
                  return prolist.reduce((acc, prom) => acc.then(res => prom.then(innerRes => res.concat(innerRes))), Promise.resolve([]))
                      .then(
                          datastatus => {
                              console.log("done import: " + document.name + ":" + pat.firstName + " " + pat.lastName + "; " + pat.id)
                              console.log(datastatus)

                              this.push('patientImportStatuses', {
                                  patient: pat, filename: document.name, statuses: {
                                      contacts: {success: null, error: null},
                                      healthElements: {success: null, error: null},
                                      invoices: {success: null, error: null},
                                      documents: {success: null, error: null},
                                      patient: {success: true, error: null}
                                  }
                              })
                              return Promise.resolve()
                          },
                          // patient imported but error importing patient data
                          err => {
                              // TODO: check specific error for contacts, he, etc
                              console.log(err)
                              this.push('patientImportStatuses', {
                                  patient: pat, filename: document.name, statuses: {
                                      contacts: {success: null, error: null},
                                      healthElements: {success: null, error: null},
                                      invoices: {success: null, error: null},
                                      documents: {success: null, error: null},
                                      patient: {success: false, error: err}
                                  }
                              })
                              return Promise.resolve()
                          }
                      )
              })
          })
          return Promise.all(patpromises)
      }).then(
          () => {
              // import status already pushed at patient level
              this.removeFromRemainingPatientImports(document)
              console.log("done encrypt", (Date.now() - this.startTime) / 1000)
              return Promise.resolve()
          },
          err => {
              console.log(err)
              let fakepat = {
                  firstName: "Document",
                  lastName: document.name
              }
              this.push('patientImportStatuses', {
                  patient: fakepat, filename: document.name, statuses: {
                      contacts: {success: null, error: null},
                      healthElements: {success: null, error: null},
                      invoices: {success: null, error: null},
                      documents: {success: null, error: null},
                      patient: {success: false, error: err}
                  }
              })
              this.removeFromRemainingPatientImports(document)
              return Promise.resolve()
          }
      )
  }

  generateXlsFile(data) {

      // Create xls work book and assign properties
      const xlsWorkBook = {SheetNames: [], Sheets: {}}
      xlsWorkBook.Props = {Title: "Patients list", Author: "iCure"}

      // Create sheet based on json data collection
      var xlsWorkSheet = XLSX.utils.json_to_sheet(data)

      // Link sheet to workbook
      XLSX.utils.book_append_sheet(xlsWorkBook, xlsWorkSheet, 'Patients list')

      // Virtual data output
      var xlsWorkBookOutput = new Buffer(XLSX.write(xlsWorkBook, {bookType: 'xls', type: 'buffer'}))

      // Put output to virtual "file"
      var fileBlob = new Blob([xlsWorkBookOutput], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"})

      // Create download link and append to page's body
      var downloadLink = document.createElement("a")
      document.body.appendChild(downloadLink)
      downloadLink.style = "display: none"

      // Create url
      var urlObject = window.URL.createObjectURL(fileBlob)

      // Link to url
      downloadLink.href = urlObject
      downloadLink.download = "patients-list.xls"

      // Trigger download and drop object
      downloadLink.click()
      window.URL.revokeObjectURL(urlObject)

      // Free mem
      fileBlob = false
      xlsWorkBookOutput = false

      return
  }

  confirm() {
      if (this.lastName.length && this.firstName.length && this.dateAsString.length) { // name and birthdate are needed
          // Trigger update
          let newPatient = {
              lastName: this.lastName,
              firstName: this.firstName,
              active: true,
              dateOfBirth: this.dateAsString && this.dateAsString.length && parseInt(this.dateAsString.replace(/-/g, '')) || null,
              ssin: this.ssin,
              gender: this.valueGender,
              medicalHouseContracts: [this.medicalHouseContractShadowObject]
          }
          if (Object.keys(this.cardData).length !== 0 && this.ssin === this.cardData.nationalNumber) {
              let streetData = _.trim(this.cardData.street).split(" ")
              const number = streetData.find(str => str.match(/\d/g))
              const boxNumber = streetData[streetData.length - 1] !== number ? streetData[streetData.length - 1] : ""
              const street = streetData.reduce((tot, str) => {
                  if (!tot) tot = "";
                  if (!(str === number || str === boxNumber))
                      tot = tot.concat(" ", str)
                  return tot;
              })
              _.merge(newPatient, {
                  placeOfBirth: this.cardData.locationOfBirth,
                  nationality: this.cardData.nationality,
                  picture: this.cardData.picture,
                  addresses: [
                      {
                          addressType: "home",
                          street: street,
                          houseNumber: number,
                          postboxNumber: boxNumber,
                          postalCode: this.cardData.zipCode,
                          city: this.cardData.municipality,
                          country: this.cardData.country
                      }
                  ]
              })
          }
          this.updateStartOfCoverage()
          newPatient.medicalHouseContracts[0] = this.medicalHouseContractShadowObject;
          this.api.patient().newInstance(this.user, newPatient).then(
              p => this.api.patient().createPatientWithUser(this.user, p)
          ).then(
              p => this.api.register(p, 'patient')
          ).then(
              p => {
                  this.resetNewPatientDialog()
                  this.set('selectedPatient', p)
              }
          )
      }
  }

  _canAddPat() {
      this.set('canAddPat', (this.lastName && this.firstName && this.dateAsString && this.lastName.length && this.firstName.length && this.dateAsString.length) ? true : false)
  }

  _resetSearchField() {
      this.set('filterValue', "")
  }

  resetNewPatientDialog() {
      this.lastName = null
      this.firstName = null
      this.dateAsString = null
      this.ssin = null
      this.valueGender = null
      this.medicalHouseContractShadowObject = {
          hcpId: null,
          mmNihii: null,
          startOfContract: null,
          startOfCoverage: null,
          kine: false,
          gp: false,
          nurse: false
      }
  }

  confirmFilter() {
      const filtersProperty = this.user.properties.find(p => p.type && p.type.identifier === 'org.taktik.icure.datafilters') ||
          (this.user.properties[this.user.properties.length] = {
              type: {identifier: 'org.taktik.icure.datafilters'},
              typedValue: {type: 'STRING', stringValue: '{}'}
          })

      if (!filtersProperty.typedValue) {
          filtersProperty.typedValue = {type: 'STRING', stringValue: '{}'}
      }
      if (!filtersProperty.typedValue.stringValue) {
          filtersProperty.typedValue.type = 'STRING'
          filtersProperty.typedValue.stringValue = '{}'
      }

      const key = this.filterName.length ? this.filterName : this.filterValue.substring(0, 5) + '...'

      const filters = JSON.parse(filtersProperty.typedValue.stringValue)
      try {
          filters[key] = filterExParser.parse(this.filterValue, {hcpId: this.user.healthcarePartyId})
      } catch (e) {
          filters[key] = {
              '$type': 'PatientByHcPartyNameContainsFuzzyFilter',
              'healthcarePartyId': this.user.healthcarePartyId,
              'searchString': this.filterValue
          }
      }

      filtersProperty.typedValue.stringValue = JSON.stringify(filters)

      this.set('user.properties', this.user.properties.map(x => x))

      this.api.user().modifyUser(this.user).then(user => this.dispatchEvent(new CustomEvent('user-saved', {
          detail: user,
          bubbles: true,
          composed: true
      })))
  }

  picture(pat) {
      if (!pat) {
          return require('../../../images/male-placeholder.png')
      }
      return pat.picture ? 'data:image/jpeg;base64,' + pat.picture : pat.gender === 'female' ? require('../../../images/female-placeholder.png') : require('../../../images/male-placeholder.png')
  }

  _saveFilter(e) {
      this.$['saveFilterDialog'].open()
  }

  deleteFilter(e) {
      e.stopPropagation()

      const filtersProperty = this.user.properties.find(p => p.type && p.type.identifier === 'org.taktik.icure.datafilters') ||
          (this.user.properties[this.user.properties.length] = {
              type: {identifier: 'org.taktik.icure.datafilters'},
              typedValue: {type: 'STRING', stringValue: '{}'}
          })

      const filters = JSON.parse(filtersProperty.typedValue.stringValue)
      delete (filters[e.target.id])

      filtersProperty.typedValue.stringValue = JSON.stringify(filters)

      this.set('user.properties', this.user.properties.map(x => x))

      this.api.user().modifyUser(this.user).then(user => this.dispatchEvent(new CustomEvent('user-saved', {
          detail: user,
          bubbles: true,
          composed: true
      })))
  }

  _activeFilters() {
      const filters = this.user && this.user.properties.find(p => p.type && p.type.identifier === 'org.taktik.icure.datafilters')
      if (filters) {
          const parsedFilters = JSON.parse(filters.typedValue.stringValue)
          return _.sortBy(Object.keys(parsedFilters).map(k => ({name: k, filter: parsedFilters[k]})))
      }
      return []
  }

  _selectedFilterIndexesChanged() {
      const activeFilters = this._activeFilters()
      this.set('selectedFilters', this.selectedFilterIndexes.map(i => activeFilters[i]))
      if (this.selectedFilters.length) {
          this.set('filterValue', this._selectedFiltersAsString())
          const grid = this.$['patients-list']
          grid.innerCache = []
          grid.clearCache()
      }
  }

  _selectedFilterIndexes() {
      const activeFilters = this._activeFilters()
      return this.selectedFilters ? this.selectedFilters.map(f => activeFilters.map(ff => ff.name).indexOf(f.name)) : []
  }

  _selectedFiltersAsString() {
      const filterPrinter = new FilterExPrinter()
      return filterPrinter.print(this.selectedFilters.length > 1 ?
          {"$type": "IntersectionFilter", filters: this.selectedFilters.map(f => f.filter)} :
          this.selectedFilters[0].filter)
  }

  _filterValueChanged(filterValue, oldValue) {
      if (this.selectedFilters[0] && this._selectedFiltersAsString() !== filterValue) {
          this.set('selectedFilterIndexes', [])
      } else if (!this.selectedFilters.length && filterValue !== oldValue) {
          this.refresh()
      }
  }

  _sharePatient(e) {
      e.stopPropagation()
      this.set('hideSpinner', true)
      this.set('shareOption', true)
      this.set('exportOption', false)
      this.set('fusionOption', false)

  }

  _exportPatient(e) {
      e.stopPropagation()
      this.set('hideSpinner', true)
      this.set('exportOption', true)
      this.set('shareOption', false)
      this.set('fusionOption', false)
  }

  _fusionPatient(e) {
      e.stopPropagation()
      this.set('hideSpinner', true)
      this.set('fusionOption', true)
      this.set('shareOption', false)
      this.set('exportOption', false)
  }

  _checkSharePatient(e) {
      const targetId = e.target.id

      if (targetId !== "") {
          const mark = this.patientSelected.find(m => m.id === targetId)
          if (!mark) {
              this.api.patient().getPatientWithUser(this.user, targetId).then(result => {
                  this.push('patientSelected', {
                      id: targetId,
                      check: true,
                      names: result.firstName + " " + result.lastName
                  })
                  this.set('nbPatientSelected', this.patientSelected.filter(patient => patient.check).length)
              })
          } else {
              mark.check = !mark.check
              this.notifyPath('patientSelected.*')
              this.set('nbPatientSelected', this.patientSelected.filter(patient => patient.check).length)
          }
      }

  }

  _patientSelected(item) {

      if (item) {
          const mark = this.patientSelected.find(m => m.id === item.id)
          return mark && mark.check
      } else {
          return false
      }
  }

  _sharePatientAll() {
      this.set('isImportingPatients', true)
      let retry = 0
      this.api.getRowsUsingPagination(
          (key, docId) => this.api.patient().listPatientsIds(this.user.healthcarePartyId, key || null, docId || null, 1000).then(pl => {
              retry = 0
              return {
                  rows: pl.rows.map(id => ({id})),
                  nextKey: pl.nextKeyPair && JSON.stringify(pl.nextKeyPair.startKey),
                  nextDocId: pl.nextKeyPair && pl.nextKeyPair.startKeyDocId,
                  done: !pl.nextKeyPair
              }
          }).catch((e) => {
              console.log(`retry: ${e.message}`)
              retry++
              return retry <= 3 ? Promise.resolve({
                  rows: [],
                  nextKey: key,
                  nextDocId: docId,
                  done: false
              }) : Promise.reject(e)
          })
      ).then(pats => {
          this.set('shareOption', true)
          this.selectedPatientsForSharing = pats
          this.$['sharePatientDialog'].open()
      }).finally(() => {
          this.set('isImportingPatients', false)
      })
  }

  _openPatientActionDialog() {
      if (this.shareOption) {
          this.$['sharePatientDialog'].open()
          this.set('hcp', _.orderBy(_.values(this.api.hcParties), ['lastName'], ['asc']))
          this.selectedPatientsForSharing = this.patientSelected.filter(pat => pat.check && pat.id)
      }
      if (this.exportOption) {
          //export here
          this.set('taskProgress', 0.001)
          let p = Promise.resolve([])
          this.patientSelected.forEach((patient, pidx) => {
              p = p.then(acc =>
                  this.api.patient().getPatientWithUser(this.user, patient.id)
                      .then(patientDto => {
                          return this.api.crypto()
                              .extractDelegationsSFKs(patientDto, this.user.healthcarePartyId)
                              .then(secretForeignKeys => {
                                  return this.api.bekmehr().generateSmfExportWithEncryptionSupport(patientDto.id, this.user.healthcarePartyId, "fr", {
                                      secretForeignKeys: secretForeignKeys.extractedKeys,
                                      comment: null
                                  }, (progress) => this.set('taskProgress', (pidx + progress) / this.patientSelected.length), this.api.sessionId).then(output => {
                                      //creation of the xml file
                                      var file = typeof output === "string" ? new Blob([output], {type: "application/xml"}) : output

                                      //creation the downloading link
                                      var a = document.createElement("a")
                                      document.body.appendChild(a)
                                      a.style = "display: none"

                                      //download the new file
                                      var url = window.URL.createObjectURL(file)
                                      a.href = url
                                      a.download = patient.names.replace(" ", "_") + "_" + (moment().format("x")) + ".xml"
                                      a.click()
                                      window.URL.revokeObjectURL(url)

                                      document.body.removeChild(a)

                                  }).catch(error => console.log(error))
                              })
                      }))
          })
          p.finally(() => this.set('taskProgress', 0))
      }
      if (this.fusionOption) {
          this.set("patientSelected", this.patientSelected.filter(element => element.check === true))
          if (this.patientSelected.length > 1)
              this.$['fusionDialog'].open()
      }
  }

  _deselectAllSelectedPatients() {
      this.set('patientSelected', [])
      this.notifyPath('patientSelected.*')

      this.set('nbPatientSelected', 0)
  }

  _cancelSelecting() {
      this._deselectAllSelectedPatients()
      this.set('shareOption', false)
      this.set('exportOption', false)
      this.set('fusionOption', false)
  }

  _toggleBoxes(e) {
      const checked = e.target.getAttribute('checked') != null ? true : false
      console.log('checked ?', checked)
      let boxList = this.shadowRoot.querySelector('#hcp-list');
      let allCheckBoxes = boxList ? boxList.querySelectorAll('.checkbox') : [];
      allCheckBoxes.forEach(box => {
          box.checked = !box.checked;
      })
      this.set('shareAll', checked)
  }

  _checkHcp(e) {
      if (e.target.id !== "") {
          const mark = this.hcpSelectedForSharing.find(m => m.id === e.target.id)
          if (!mark) {
              this.push('hcpSelectedForSharing', {
                  id: e.target.id,
                  check: true,
                  delegation: ["all"]
              })
          } else {
              mark.check = !mark.check
              this.notifyPath('hcpSelectedForSharing.*')
          }
      }

  }

  _statusDetail(status) {
      return status.success === null ? 'N/A' : status.success ? 'OK' : status.error && status.error.message || 'NOK'
  }

  _statusDetailClass(status) {
      return status.success === null ? '' : status.success ? 'status-green' : 'status-red'
  }

  _sharingHcp(item) {
      if (this.shareAll == true) {
          return true
      } else if (item) {
          const mark = this.hcpSelectedForSharing.find(m => m.id === item.id)
          return mark && mark.check
      } else {
          return false
      }
  }

  confirmSharingAllNextStep() {
      this.confirmSharingNextStep(true)
  }

  confirmSharingNextStep(allHcp) {
      this.$['sharePatientDialog'].close()

      //erase uncheck user
      if (this.shareAll || (allHcp === true)) {
          this.set('hcpSelectedForSharing', this.hcp)
      } else {
          const tab = _.differenceBy(this.hcpSelectedForSharing, [{'check': false}], 'check')
          this.set("hcpSelectedForSharing", tab)
      }

      //loading existing delegation of shared users
      this.hcpSelectedForSharing.forEach((userShared, index) => {
          let delegationTag = []
          const keys = Object.keys(this.user.autoDelegations)
          keys.forEach(key => {
              if (this.user.autoDelegations[key].find(x => x === userShared.id))
                  delegationTag.push(key)
          })
          if (delegationTag.length !== 0)
              this.set("hcpSelectedForSharing." + index + ".delegation", delegationTag)
      })

      this.$['sharePatientDelegationDialog'].open()
  }

  confirmSharing() {
      this.updateDelegation()

      this.$['sharePatientDelegationDialog'].close()
      this.$['sharingPatientStatus'].open()

      this._sharePatients(this.selectedPatientsForSharing)
  }

  _hashCode(str) {
      return str.split('').reduce((prevHash, currVal) =>
          (((prevHash << 5) - prevHash) + currVal.charCodeAt(0)) | 0, 0)
  }

  _sharePatients(patients) {
      this.set('patientShareStatuses', [])
      this.set('isSharingPatient', true)

      const hcpId = this.user.healthcarePartyId
      const delegates = this.hcpSelectedForSharing.filter(hcp => hcp.check && hcp.id)
      const delegationTags = _.fromPairs(delegates.map(hcp => [hcp.id, _.sortBy(hcp.delegation)]))
      const sig = this._hashCode(JSON.stringify(_.sortBy(delegationTags, x => x[0])))
      const locStoTag = `org.taktik.icure.${this.user.id}.share.${sig}.progress`

      const prevRunIds = JSON.parse(localStorage.getItem(locStoTag) || '[]')

      this.patientSharePromise = Promise.resolve([[], prevRunIds])

      _.chunk(patients.filter(p => !prevRunIds.includes(p.id)), 16).forEach(chunk => {
          this.patientSharePromise = this.patientSharePromise.then(([prevStatuses, treatedIds]) => Promise.all(chunk.map(pat =>
                  this.api.patient().share(this.user, pat.id, hcpId, delegates.map(hcp => hcp.id), delegationTags)
                      .catch(e => {
                          console.log(e)
                          return {
                              patient: pat, statuses: {
                                  contacts: {success: null, error: null},
                                  healthElements: {success: null, error: null},
                                  invoices: {success: null, error: null},
                                  documents: {success: null, error: null},
                                  patient: {success: false, error: e}
                              }
                          }
                      })
              )).then(statuses => {
                  const newStatuses = prevStatuses.concat(statuses)
                  const newTreatedIds = treatedIds.concat(statuses.filter(s => !_.values(s.statuses).some(s => !s.success)).map(s => s.patient.id))
                  localStorage.setItem(locStoTag, JSON.stringify(newTreatedIds))
                  this.push('patientShareStatuses', ...statuses)

                  this.dispatchEvent(new CustomEvent('idle', {bubbles: true, composed: true}))

                  return [newStatuses, newTreatedIds]
              })
          )
      });
      this.patientSharePromise.then(() => this.set('isSharingPatient', false))
  }

  _openPopupMenu() {
      if (this.readOnly) {
          return
      }
      this.shadowRoot.querySelector('#paper-menu-button').open()
  }

  _selectedChanged(selected) {
      if (this.readOnly) {
          return
      }
      this.set('valueGender', this.selectedItem && this.selectedItem.id || null)
  }

  _searchDuplicate() {
      if (!this.user) return
      const fingerPrint = this.firstName + '|' + this.lastName + '|' + this.dateAsString + '|' + this.ssin
      //creation of filters
      const totalChars = (this.firstName && this.firstName.length || 0) + (this.lastName && this.lastName.length || 0)
      const firstNameFilter = this.firstName && this.firstName.length >= 2 && totalChars >= 4 && ({
          '$type': 'PatientByHcPartyNameContainsFuzzyFilter',
          'healthcarePartyId': this.user.healthcarePartyId,
          'searchString': this.firstName
      })
      const lastNameFilter = this.lastName && this.lastName.length >= 2 && totalChars >= 4 && ({
          '$type': 'PatientByHcPartyNameContainsFuzzyFilter',
          'healthcarePartyId': this.user.healthcarePartyId,
          'searchString': this.lastName
      })
      const dateOfBirthFilter = (/^[0-9]{4}-[0-1][0-9]-[0-3][0-9]$/.test(this.dateAsString)) && ({
          '$type': 'PatientByHcPartyDateOfBirthFilter',
          'healthcarePartyId': this.user.healthcarePartyId,
          'dateOfBirth': this.dateAsString.replace(/-/g, "")
      })
      const ssinFilter = /^[0-9]{11}$/.test(this.ssin) && ({
          '$type': 'PatientByHcPartyAndSsinFilter',
          'healthcarePartyId': this.user.healthcarePartyId,
          'ssin': this.ssin
      })

      const intersectionFilters = [firstNameFilter, lastNameFilter, dateOfBirthFilter].filter(x => !!x)
      const unionFilters = [intersectionFilters.length > 1 ? ({
          '$type': 'IntersectionFilter',
          filters: intersectionFilters
      }) : intersectionFilters[0], ssinFilter].filter(x => !!x)

      const unionFilter = unionFilters.length > 1 ? ({
          '$type': 'UnionFilter',
          filters: unionFilters
      }) : unionFilters[0]

      clearTimeout(this.checkDuplicateTimeout)
      if (unionFilter) {
          this.checkDuplicateTimeout = setTimeout(() => {
              if (fingerPrint !== this.firstName + '|' + this.lastName + '|' + this.dateAsString + '|' + this.ssin) {
                  return
              }
              console.log(unionFilter)
              //research
              this.api.patient().filterByWithUser(this.user, null, null, 50, 0, 1, 'desc', {filter: unionFilter}).then(tb => {
                  console.log("result of the research : " + JSON.stringify(tb))

                  //construct of the table
                  if (tb["totalSize"] !== 0) {
                      tb["rows"].map(row => {
                          row["remarks"] = this.localize("rem_Ty5_CreatPat", "Ressemblance !", language)
                          let flagRem = false
                          if (row["firstName"].toUpperCase() === this.firstName.toUpperCase() && row["lastName"].toUpperCase() === this.lastName.toUpperCase()) {
                              row["remarks"] = this.localize("rem_Ty1_CreatPat", "Même nom et prénom!", language)

                              if (row["dateOfBirth"].toString() === this.dateAsString.replace(/-/g, '')) {
                                  flagRem = true
                                  row["remarks"] = this.localize("rem_Ty4_CreatPat", "Même nom, prénom et date de naissance!", language)
                              }
                          }

                          if (row["ssin"] === this.ssin && this.ssin != "") {
                              row["remarks"] = this.localize("rem_Ty2_CreatPat", "Même NISS!", language)
                              if (flagRem) {
                                  row["remarks"] = this.localize("rem_Ty3_CreatPat", "Même patient!", language)
                              }
                          }

                      })

                      this.set("listResultPatients", tb["rows"])
                      this.set("displayResult", true)
                  } else {
                      this.set("listResultPatients", [])
                      this.set("displayResult", false)
                  }
              })
          }, 300)
      } else {
          this.set("listResultPatients", [])
          this.set("displayResult", false)
      }
  }

  getNamesWithHcpId(id) {
      const element = this.hcp.find(x => x.id === id)
      return element.lastName + " " + element.firstName
  }

  _checkDelegation(event) {

      const index = this.hcpSelectedForSharing.indexOf(event.model.__data.item)
      const tag = event.target.id.substr(event.model.__data.item.id.length)
      const value = event.detail.value

      //idem of checkingDelegation

      if (this.hcpSelectedForSharing[index].delegation.find(x => x === 'all')) {
          this.set("hcpSelectedForSharing." + index + ".delegation", this.delegation.map(x => x))
          this.hcpSelectedForSharing[index].delegation.shift()
      }
      if (value === true) {//check
          if (tag === "all") {
              this.set("hcpSelectedForSharing." + index + ".delegation", [])
          }
          this.push("hcpSelectedForSharing." + index + ".delegation", tag)

          if (this.hcpSelectedForSharing[index].delegation.filter(x => x.includes("cdItem")).length === 12) {
              this.push("hcpSelectedForSharing." + index + ".delegation", "medicalInformation")
          }

          if (this.hcpSelectedForSharing[index].delegation.find(x => x === "medicalInformation")) {
              this.set("hcpSelectedForSharing." + index + ".delegation", this.hcpSelectedForSharing[index].delegation.filter(x => !x.includes("cdItem")))
          }

          if (this.hcpSelectedForSharing[index].delegation.filter(element => !(element.includes("cdItem") || element === "all")).length === 6) {
              this.set("hcpSelectedForSharing." + index + ".delegation", ["all"])
          }
      } else {//uncheck
          if (tag === "all") {
              this.set("hcpSelectedForSharing." + index + ".delegation", this.delegation.filter((element, index, array) => (index <= 4 && element !== "all")))
          } else {
              this.set("hcpSelectedForSharing." + index + ".delegation",
                  this.hcpSelectedForSharing[index].delegation.filter(x => x !== tag))
          }
      }
  }

  checkingDelegation(tagInput, delegations) {
      if (!delegations) return
      return delegations.find(x => x === tagInput)
  }

  updateDelegation() {
      if (!this.user) return
      let userDelegation = this.user.autoDelegations

      this.hcpSelectedForSharing.forEach(userShared => {
              //delete old delegations for this user
              Object.keys(userDelegation).forEach(key => {
                  userDelegation[key] = userDelegation[key].filter(x => x !== userShared.id)
                  if (userDelegation[key].length === 0) delete userDelegation[key]
              })

              userShared.delegation.forEach(delegationTag => {
                  //add news delegations for this user
                  if (userDelegation.hasOwnProperty(delegationTag)) {
                      userDelegation[delegationTag].push(userShared.id)
                  } else {
                      userDelegation[delegationTag] = [userShared.id]
                  }
              })
          }
      )
      this.set("user.autoDelegations", userDelegation)

      this.api.user().modifyUser(this.user).then(user => {
          this.dispatchEvent(new CustomEvent('user-saved', {
              detail: user,
              bubbles: true,
              composed: true
          }))
      }).catch(e => {
          console.log(e)
      }).finally(e => {
          this.api.user().getUser(this.user.id).then(x => {
              this.set("user", x)
          })
      })
  }

  _neededBr(tag) {
      return tag === "all"
  }

  _showAllDelegation(tag, id) {

      if (tag === "all") return true
      const index = this.hcpSelectedForSharing.findIndex(x => x.id === id)
      if (index === -1) return false

      let value = !this.hcpSelectedForSharing[index].delegation.find(x => x === "all")
      if (tag.includes("cdItem") && this.hcpSelectedForSharing[index].delegation.find(x => x === "medicalInformation"))
          value = false
      return value
  }

  _optionsChecked() {
      return this.shareOption || this.exportOption || this.fusionOption
  }

  _fusionSelectedChanged(selected) {
      if (this.readOnly) {
          return
      }
      this.set('idFusionPat', this.patientSelected[selected].id || null)
  }

  getNamePat(id) {
      const pat = this.patientSelected.find(patient => patient.id === id)
      return pat.names
  }

  confirmFusion() {
      let listIds = ""
      this.patientSelected.forEach(patient => {
          if (patient.id !== this.idFusionPat)
              listIds += patient.id + ","
      })
      listIds = listIds.substring(0, listIds.length - 1)
      //console.log(listIds)
      if (this.idFusionPat)
          this.api.patient().mergeIntoWithUser(this.user, this.idFusionPat, listIds).then(response => {
              console.log(response)
              this.set('selectedPatient', response)
          })
  }

  _isPatientsSelected() {
      return this.patientSelected.filter(x => x.check == true).length
  }


  updateStartOfCoverage(event, object) {

      // Busy status
      this.updateStartOfCoverageBusy = this.updateStartOfCoverageBusy || false

      // Already busy ?
      if (this.updateStartOfCoverageBusy) return

      // Set to busy
      this.updateStartOfCoverageBusy = true

      // Grab final object
      let startOfContractObject = this.$['startOfContract']
      let startOfCoverageObject = this.$['startOfCoverage']
      let evalutationMonthsObject = this.$['evalutationMonths']

      // No value defined yet (first call), set to today
      if (!object || (object && object.value == "")) startOfContractObject.value = moment().format('YYYY-MM-DD')

      // By default, start of coverage date = 1st day of next month
      startOfCoverageObject.value = moment(startOfContractObject.value).add((1 + parseInt(evalutationMonthsObject.value || 0)), 'months').startOf('month').format('YYYY-MM-DD')

      // Cast values
      this.medicalHouseContractShadowObject = {
          hcpId: this.medicalHouseContract.hcpId,
          mmNihii: this.medicalHouseContract.mmNihii,
          startOfContract: this.medicalHouseContract.startOfContract.replace(/-/g, ''),
          startOfCoverage: this.medicalHouseContract.startOfCoverage.replace(/-/g, ''),
          kine: this.$['medicalHouseContractKineCheckBox'].checked,
          gp: this.$['medicalHouseContractGpCheckBox'].checked,
          nurse: this.$['medicalHouseContractNurseCheckBox'].checked
      }

      // We're finished
      this.updateStartOfCoverageBusy = false

  }


  checkForParentMedicalHouse() {
      if (this.user && this.user.healthcarePartyId) {
          this.api.hcparty().getHealthcareParty(this.user.healthcarePartyId).then(hcp => {
              if (!!(hcp && hcp.parentId) || _.trim(_.get(hcp, "type", "")).toLowerCase() === "medicalhouse") {
                  this.api.hcparty().getHealthcareParty(_.get(hcp, "parentId", _.trim(hcp.id))).then(parentHcp => {
                      if (_.trim(_.get(parentHcp, "type", "")).toLowerCase() === "medicalhouse" || _.trim(_.get(hcp, "type", "")).toLowerCase() === "medicalhouse") {
                          this.shadowRoot.getElementById("medicalHouseTabView").classList.remove("doNotDisplay")
                          this.hcpParentMedicalHouseData = parentHcp
                      } else {
                          this.shadowRoot.getElementById("medicalHouseTabView").classList.add("doNotDisplay")
                      }
                  })
              } else {
                  this.shadowRoot.getElementById("medicalHouseTabView").classList.add("doNotDisplay")
              }
          })
      } else {
          this.shadowRoot.getElementById("medicalHouseTabView").classList.add("doNotDisplay")
      }
  }


  _mhSearch(e) {
      let mhLatestSearchValue = e && e.detail.value
      this.mhLatestSearchValue = mhLatestSearchValue

      if (!mhLatestSearchValue || mhLatestSearchValue.length < 2) {
          this.set('mhListItem', [])
          return
      }
      this._mhDataProvider() && this._mhDataProvider().filter(mhLatestSearchValue).then(res => {
          if (mhLatestSearchValue !== this.mhLatestSearchValue) return
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

                      return {
                          totalSize: dataProviderResults.length,
                          rows: _.sortBy(dataProviderResults, 'name')
                      }
                  }
              )

          }.bind(this)
      }
  }

  setSocket() {
      if (!this.socket) return;
      this.socket.on("auto-read-card-eid", cards => {
          const res = JSON.parse(cards)
          if (res.cards[0]) {
              this.set('firstName', res.cards[0].firstName)
              this.set('lastName', res.cards[0].surname)
              this.set('dateAsString', this.api.moment(res.cards[0].dateOfBirth * 1000).format('YYYY-MM-DD'))
              this.set('ssin', res.cards[0].nationalNumber)
              this.set('valueGender', res.cards[0].gender === 'M' ? 'male' : 'female')
              this.set('cardData', res.cards[0])
              this.$['eidFound'].classList.add('notification');
          }


      })
  }

  searchPatientsEid() {
      this.api.hcparty().getHealthcareParty(this.user.healthcarePartyId).then(currentHcp => {

          //creation of filters
          const firstNameFilter = this.firstName && this.firstName.length >= 2 && ({
              '$type': 'PatientByHcPartyNameContainsFuzzyFilter',
              'healthcarePartyId': currentHcp.parentId || this.user.healthcarePartyId,
              'searchString': this.firstName
          })
          const lastNameFilter = this.lastName && this.lastName.length >= 2 && ({
              '$type': 'PatientByHcPartyNameContainsFuzzyFilter',
              'healthcarePartyId': currentHcp.parentId || this.user.healthcarePartyId,
              'searchString': this.lastName
          })
          const dateOfBirthFilter = (/^[0-9]{4}-[0-1][0-9]-[0-3][0-9]$/.test(this.dateAsString)) && ({
              '$type': 'PatientByHcPartyDateOfBirthFilter',
              'healthcarePartyId': currentHcp.parentId || this.user.healthcarePartyId,
              'dateOfBirth': this.dateAsString.replace(/-/g, "")
          })
          const ssinFilter = /^[0-9]{11}$/.test(this.ssin) && ({
              '$type': 'PatientByHcPartyAndSsinFilter',
              'healthcarePartyId': currentHcp.parentId || this.user.healthcarePartyId,
              'ssin': this.ssin
          })

          const intersectionFilters = [firstNameFilter, lastNameFilter, dateOfBirthFilter].filter(x => !!x)
          const unionFilters = [(intersectionFilters.length > 1 ? ({
              '$type': 'IntersectionFilter',
              filters: intersectionFilters
          }) : {}), intersectionFilters[0], intersectionFilters[1], intersectionFilters[2], ssinFilter].filter(x => !!x)

          const unionFilter = unionFilters.length > 1 ? ({
              '$type': 'UnionFilter',
              filters: unionFilters
          }) : unionFilters[0]

          console.log("filters", unionFilter)
          if (unionFilter) {
              //research
              this.api.patient().filterByWithUser(this.user, null, null, 50, 0, 1, 'desc', {filter: unionFilter})
                  .then(patients => {
                      this.set("eidPatientsList", patients.rows)
                      this.$['eidOpenPatientMessage'].classList.add('notification');
                      setTimeout(() => {
                          if (this.hasNotificationEidMessage !== 0) {
                              this.$['eidOpenPatientMessage'].classList.remove('notification');
                          }
                      }, 60000);
                  })
          }
      })
  }

  checkNiss() {
      this.api.hcparty().getHealthcareParty(this.user.healthcarePartyId).then(currentHcp => {
          const ssinFilter = /^[0-9]{11}$/.test(this.ssin) && ({
              '$type': 'PatientByHcPartyAndSsinFilter',
              'healthcarePartyId': currentHcp.parentId || this.user.healthcarePartyId,
              'ssin': this.ssin
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
                              this.set('selectedPatient', p)
                              return this.selectedPatient
                          })
                          .then(p => {
                              this.api.hcparty().getHealthcareParty(this.user.healthcarePartyId).then(hcp => {
                                  this.api.fhc().Therlinkcontroller().registerTherapeuticLinkUsingPOST1(this.api.keystoreId, this.api.tokenId, this.api.credentials.ehpassword,
                                      hcp.nihii, hcp.ssin, hcp.firstName, hcp.lastName,
                                      this.cleanNiss(p.ssin), p.firstName, p.lastName, this.cardData.logicalNumber, "", null, null, null, null, null)

                              })
                          })
                  } else {
                      this.searchPatientsEid()
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

  openWithEid(e) {
      // Must click on a row
      if (e.path[0].nodeName === 'TABLE') return
      if (this.activeItem) {
          const selected = this.activeItem
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
                  this.set('selectedPatient', p)
                  this.set('isLoadingPatient', false)
                  this.$['eidOpenPatientMessage'].classList.remove('notification');
                  return this.selectedPatient
              })
              .then(p => {
                  this.api.hcparty().getHealthcareParty(this.user.healthcarePartyId).then(hcp => {
                      this.api.fhc().Therlinkcontroller().registerTherapeuticLinkUsingPOST1(this.api.keystoreId, this.api.tokenId, this.api.credentials.ehpassword,
                          hcp.nihii, hcp.ssin, hcp.firstName, hcp.lastName,
                          this.cleanNiss(p.ssin), p.firstName, p.lastName, this.cardData.logicalNumber, "", null, null, null, null, null)

                  })
              })
      }
  }

  openPatientOnElectron(e) {
      e.stopPropagation()
      e.preventDefault();

      if (this.shareOption || this.exportOption || this.fusionOption) return

      // Must click on a row
      if (e.path[0].nodeName === 'TABLE') return
      console.log(e.target.dataset.item)
      fetch('http://127.0.0.1:16042/getPatient', {
          method: "POST",
          headers: {
              "Content-Type": "application/json; charset=utf-8"
          },
          body: JSON.stringify({
              "patientId": e.target.dataset.item
          })
      })
          .then((response) => {
              console.log(response.json())
          })
  }

  cleanNiss(niss) {
      return niss.replace(/ /g, "").replace(/-/g, "").replace(/\./g, "").replace(/_/g, "").replace(/\//g, "")
  }
}

customElements.define(HtPatList.is, HtPatList)
