import '@polymer/iron-icon/iron-icon.js'
import '@polymer/paper-button/paper-button.js'
import '@polymer/paper-dialog/paper-dialog.js'
import '@polymer/paper-fab/paper-fab.js'
import '@polymer/paper-icon-button/paper-icon-button.js'
import '@polymer/paper-input/paper-input.js'
import '@polymer/paper-item/paper-item.js'
import '@polymer/paper-listbox/paper-listbox.js'
//import '@polymer/paper-material/paper-material.js'
import '@polymer/paper-radio-button/paper-radio-button.js'
import '@polymer/paper-radio-group/paper-radio-group.js'
import '@polymer/paper-toast/paper-toast.js'
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
/*<link rel="import" href="dialogs/mycarenet/ht-pat-mcn-chapteriv-agreement.html">*/
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import '../filter-panel/filter-panel.js';

import '../collapse-button/collapse-button.js';
import './ht-pat-admin-card.js';
import './ht-pat-he-tree-detail.js';
import './ht-pat-he-tree-settings.js';
import './ht-pat-detail-ctc-detail-panel.js';
import '../icons/icure-icons.js';
import '../../icpc-styles.js';
import '../../atc-styles.js';
import '../../scrollbar-style.js';
import '../ht-spinner/ht-spinner.js';
import '../dynamic-form/entity-selector.js';
import '../dynamic-form/health-problem-selector.js';
import './dialogs/ht-pat-action-plan-dialog.js';
import './dialogs/ht-pat-list-plan-dialog.js';
import './dialogs/ht-pat-vaccine-history-dialog.js';
import '../dynamic-form/dialogs/medication-selection-dialog.js';
import '../dynamic-form/dialogs/medications-selection-dialog.js';
import '../dynamic-form/dialogs/medication-details-dialog.js';
import '../dynamic-form/dialogs/medication-plan-dialog.js';
import './dialogs/ht-pat-edmg-dialog.js';
import './dialogs/hubs/ht-pat-hub-dialog.js';
import './dialogs/hubs/ht-pat-hub-transaction-view.js';
import '../../dialog-style.js';
import '../../notification-style.js';
import moment from 'moment/src/moment';
import _ from 'lodash/lodash';
import styx from '../../../scripts/styx';
import {AccessLogDto} from "icc-api/dist/icc-api/model/AccessLogDto";
import {TkLocalizerMixin} from "../tk-localizer";

import {PolymerElement,html} from '@polymer/polymer/polymer-element.js';
class HtPatDetail extends TkLocalizerMixin(PolymerElement) {
  static get template() {
    return html`
        <style include="iron-flex iron-flex-alignment"></style>
        <!--suppress CssUnusedSymbol -->
        <style include="atc-styles icpc-styles scrollbar-style dialog-style notification-style">
            :host {
                height: 100%;
            }

            .container {
                width: 100%;
                height: calc(100vh - 64px - 20px);
                display: grid;
                grid-template-columns: 20% 20% 60%;
                grid-template-rows: 100%;
                position: fixed;
                top: 64px;
                left: 0;
                bottom: 0;
                right: 0;
            }

            .zone {
                display: flex;
                flex-direction: column;
                height: 100%;
            }

            .padding-0 {
                padding: 0;
            }

            .one-line-menu {
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                font-weight: 400;
                padding-left: 0;
            }

            .extra-button {
                padding: 2px;
                height: 20px;
                width: 20px;
                border-radius: 50%;
                background: var(--app-secondary-color);
                color: var(--app-text-color);
                margin-right: 4px;
            }

            #first {
                height: calc(100% - 36px);
            }

            paper-fab {
                --paper-fab-mini: {
                    height: 16px;
                    width: 16px;
                    padding: 2px;
                };

                margin-right: 4px;
            }

            .first-panel {
                display: flex;
                flex-direction: column;
                height: calc(100vh - 64px - 20px); /* 64px = app-header */
                background: var(--app-background-color-dark);
                top: 64px;
                left: 0;
                box-shadow: var(--app-shadow-elevation-2);
                grid-column: 1 / 1;
                grid-row: 1 / 1;
                z-index: 3;
                overflow: hidden;
                /*transition: .5s ease;*/
            }

            #_contacts_listbox {
                padding: 0;
            }

            .contact-text-row p {
                padding-right: 30px;
            }

            paper-listbox {
                background: transparent;
                padding: 0;
            }

            paper-item {
                background: transparent;
                outline: 0;
                --paper-item-selected: {

                };

                --paper-item-disabled-color: {
                    color: red;
                };

                --paper-item-focused: {
                    background: transparent;
                };
                --paper-item-focused-before: {
                    background: transparent;
                };

            }

            paper-listbox {
                outline: 0;
                --paper-listbox-selected-item: {
                    color: var(--app-text-color-light);
                    background: var(--app-primary-color);
                };
                --paper-listbox-disabled-color: {
                    color: red;
                };
            }

            #adminFileMenu paper-item.iron-selected {
                color: var(--app-text-color-light);
                background: var(--app-primary-color);
                @apply --text-shadow;
            }

            collapse-button {
                outline: 0;
                align-items: flex-start;
                --paper-listbox-selected-item: {
                    color: var(--app-text-color-light);
                    background: var(--app-primary-color);
                }
            }

            collapse-button > .menu-item.iron-selected {
                @apply --padding-menu-item;
                color: var(--app-text-color-light);
                background: var(--app-primary-color);
                @apply --text-shadow;
            }

            .opened {
                color: var(--app-text-color);
            }

            .opened.iron-selected {
                box-shadow: 0 -2px 0 0 var(--app-primary-color),
                0 2px 2px 0 rgba(0, 0, 0, 0.14),
                0 1px 5px 0 rgba(0, 0, 0, 0.12),
                0 3px 1px -2px rgba(0, 0, 0, 0.2);
            }

            .sublist {
                background: var(--app-light-color);
                margin: 0 0 0 -30px;
                padding: 0;
            }

            paper-item.sublist-footer {
                height: 48px;
                font-weight: normal;
            }

            .menu-item paper-icon-button.menu-item-icon--add, .list-info paper-icon-button.menu-item-icon {
                padding: 0px;
                height: 18px;
                width: 18px;
                border-radius: 50%;
                background: var(--app-secondary-color);
                color: var(--app-text-color);
                margin-right: 8px;
            }

            paper-item.list-info {
                font-weight: lighter;
                font-style: italic;
                height: 48px;
            }

            .list-title {
                flex-basis: calc(100% - 72px);
                font-weight: bold;
            }

            .menu-item {
                @apply --padding-menu-item;
                height: 24px;
                min-height: 24px;
                font-size: var(--font-size-normal);
                font-weight: bold;
                text-transform: inherit;
                justify-content: space-between;
                cursor: pointer;
                @apply --transition;
            }

            .sublist .menu-item {
                font-size: var(--font-size-normal);
                min-height: 20px;
                height: 20px;
            }

            .menu-item:hover {
                background: var(--app-dark-color-faded);
                @apply --transition;
            }

            .menu-item .iron-selected {
                background: var(--app-primary-color);

            }


            .menu-item-icon {
                height: 20px;
                width: 20px;
                padding: 0px;
            }

            .menu-item-icon--selected {
                width: 0;
            }

            .opened .menu-item-icon--selected {
                width: 18px;
            }

            collapse-button[opened] .menu-item-icon {
                transform: scaleY(-1);
            }

            .submenu-item {
                cursor: pointer;
            }

            .submenu-item.iron-selected {
                background: var(--app-primary-color-light);
                color: var(--app-text-color-light);
                @apply --text-shadow;
            }

            .submenu-item-icon {
                height: 14px;
                width: 14px;
                color: var(--app-text-color-light);
                margin-right: 10px;
            }

            .add-btn-container {
                position: relative;
                bottom: 12px;
                display: flex;
                flex-direction: row;
                justify-content: center;
                align-items: center;
            }

            .new-ctc-btn-container {
                width: 30%;
                left: 20%;
                position: absolute;
                bottom: 16px;
                /*display:none;*/
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
                font-size: var(--font-size-normal);
                height: 40px;
                min-width: 100px;
                @apply --shadow-elevation-2dp;
                padding: 10px 1.2em;
                text-transform: capitalize;
            }

            .patient-info-container {
                height: 72px;
                padding: 12px;
                cursor: pointer;
                box-sizing: border-box;
            }

            .patient-info-container:hover {
                background: var(--app-dark-color-faded);
                @apply --transition;
            }

            .patient-info {
                padding-left: 12px;
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                justify-content: center;
            }

            .patient-name {
                font-weight: 700;
                line-height: 14px;
                font-size: var(--font-size-large);
            }

            .patient-birthdate {
                font-size: var(--font-size-normal);
            }

            .patient-profession {
                font-size: var(--font-size-normal);
            }

            .btn-pat-close {
                position: absolute;
                left: 4px;
                top: 4px;
                background: var(--app-secondary-color);
                color: var(--app-text-color);
                height: 20px;
                width: 20px;
                z-index: 4;
            }

            .btn-pat-close:hover {
                @apply --transition;
                @apply --shadow-elevation-2dp;
            }

            .patient-picture-container {
                height: 52px;
                width: 52px;
                border-radius: 50%;
                overflow: hidden;
            }

            .patient-picture-container img {
                width: 100%;
                margin: 50%;
                transform: translate(-50%, -50%);
            }

            .submenus-container {
                overflow-y: auto;
                flex-grow: 1;
            }


            [hidden] {
                display: none !important;
            }

            /* END FIRST PANEL */

            /* SECOND PANEL  */
            .second-panel {
                /*width:30%;*/
                height: 100%;
                background: var(--app-background-color);
                /*position:fixed;*/
                top: 64px;
                left: 20%;
                @apply --shadow-elevation-2dp;
                margin: 0;
                grid-column: 2 / 2;
                grid-row: 1 / 1;

                z-index: 2;

            }


            .fit-bottom {
                bottom: 0;
                left: 20% !important;
                width: 30%;
                height: 48px;
                z-index: 4;
                @apply --padding-right-left-32;
                display: flex;
                flex-direction: row;
                justify-content: center;
                flex-wrap: nowrap;
                padding-top: 8px;
                margin-bottom: 20px;
            }

            .selection-toast-button {
                height: 32px;
                @apply --paper-font-button;
                text-transform: lowercase;
            }

            .selection-toast-icon {
                height: 16px;
                margin-right: 4px;
            }

            div.extraDialogFields {
                margin-top: 0;
            }

            .contact {
                margin: 0 32px 16px;
                background: var(--app-light-color);
                color: var(--app-text-color);
                outline: 0;
                padding: 0;
                align-items: flex-start !important;
                @apply --shadow-elevation-2dp;
                position: relative;
            }

            .contact.iron-selected {
                background: var(--app-primary-color);
                color: var(--app-light-color);
                @apply --text-shadow;
            }

            .contact h4 {
                font-size: var(--font-size-large);
                font-weight: 600;
                margin: 0;
                -webkit-user-select: none; /* Chrome/Safari */
                -moz-user-select: none; /* Firefox */
                -ms-user-select: none; /* IE10+ */

                max-width: 216px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;

                /* Rules below not implemented in browsers yet */
                -o-user-select: none;
                user-select: none;
            }

            .contact .contact-text-row {
                width: calc(100% - 32px);
                display: flex;
                flex-flow: row wrap;
                justify-content: flex-start;
                align-items: center;
                @apply --padding-right-left-16;
            }

            .contact:nth-of-type(1) .contact-text-row p {
                padding-right: 32px;
            }

            .contact .contact-text-row:first-child, .contact .contact-text-row:last-child {
                height: 24px;
            }

            /*.contact .contact-text-row:nth-child(2){
				height:48px;
			}*/

            .contact-text-row p {
                width: 100%;
                text-overflow: ellipsis;
                overflow-x: hidden;
                white-space: nowrap;
            }

            .contact-text-date {
                justify-content: space-between !important;
                position: relative;
                top: 0;
                left: 0;
                right: 0;
                background: rgba(0, 0, 0, .1);
                @apply --padding-right-left-16;
                color: var(--app-text-color-disabled);
                height: 24px;
            }

            .contact .label-container {
                display: flex;
                flex-flow: row nowrap;
            }

            .contact label {
                font-size: var(--font-size-normal);
                font-weight: 400;
                margin: 0;
                display: block;

                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;

                -webkit-user-select: none; /* Chrome/Safari */
                -moz-user-select: none; /* Firefox */
                -ms-user-select: none; /* IE10+ */

                /* Rules below not implemented in browsers yet */
                -o-user-select: none;
                user-select: none;

            }

            .contact label.hcp {
                position: absolute;
                right: 16px;
                max-width: 80px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }

            .colour-code {
                line-height: 12px;
                margin-right: 4px;
                color: black;
            }

            .iron-selected .colour-code {
                color: var(--app-light-color);
            }

            .iron-selected .colour-code span {
                background: var(--app-light-color);
            }

            .colour-code:hover {
                font-weight: 600;
            }

            .colour-code:hover:before {
                height: 8px;
                width: 8px;
                margin-bottom: 0;
                border-radius: 4px;
            }

            .colour-code span {
                content: '';
                display: inline-block;
                height: 6px;
                width: 6px;
                border-radius: 3px;
                margin-right: 3px;
                margin-bottom: 1px;
                background: lightgrey;
            }

            .contact .colour-code:not(:first-child) {
                margin-left: 4px;
            }

            .contact p {
                @apply --paper-font-body1;
                margin: 0;
                -webkit-user-select: none; /* Chrome/Safari */
                -moz-user-select: none; /* Firefox */
                -ms-user-select: none; /* IE10+ */

                /* Rules below not implemented in browsers yet */
                -o-user-select: none;
                user-select: none;
            }

            .contact-icon {
                position: absolute;
                right: 8px;
                margin: auto;
                top: 20px;
                height: 32px;
            }

            paper-material.iron-selected > .contact-icon {
                color: var(--app-text-color-light);
            }

            paper-material.iron-selected > .contact-text > .contact-text-date {
                color: var(--app-text-color-light) !important;
            }

            .current-contact {
                color: var(--app-secondary-color-dark);
                margin-bottom: 16px;
            }


            .current-contact.iron-selected {
                border-bottom: 1px solid var(--app-primary-color);
            }

            .contact--big {
                min-height: 96px;
                /*@apply --padding-16;*/
                /*border-bottom: 1px solid var(--app-background-color-dark);*/
            }

            .contact--small {
                min-height: 32px;
                /*@apply --padding-right-left-16;*/
                padding-bottom: 8px;
            }

            .contact--small .contact-text-row:nth-child(2) {
                justify-content: space-between;
            }

            .contact--small .contact-text-row:last-child {
                display: none;
            }

            .contact--small .he-dots-container {
                display: none;
            }

            .he-dots-container {
                display: flex;
                flex-flow: row wrap;
                justify-content: flex-end;
            }

            .contact-year {
                display: block;
                @apply --paper-font-body2;
                @apply --padding-32;
                padding-top: 16px;
                padding-bottom: 8px;
            }

            .contact-text {
                background: transparent;
                flex-direction: column;
                justify-content: space-between;
                align-items: flex-start;
                width: 100%;
                height: 100%;
                padding: 0;
            }

            .contact-text:focus::before, .contact-text:focus::after {
                background: transparent;
            }

            .contacts-container {
                overflow-y: overlay;
                height: calc(100% - 80px);
                padding-bottom: 32px;
            }

            .layout.vertical {
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                align-items: center;
                flex-wrap: nowrap;
            }

            .layout.vertical:hover {
                /*background: lightgreen;*/
                cursor: pointer;
            }

            .layout.vertical.iron-selected:hover {
                background: var(--app-primary-color);
                cursor: initial;
            }

            .todo-list {
                border: 1px dashed rgba(0, 0, 0, 0.1);
                margin: 0 32px;
                border-radius: 4px;
                max-height: 128px;
                overflow: auto;
            }

            .todo-item {
                font-size: 13px;
                --paper-item-min-height: 32px;
                color: var(--app-text-color);
                display: flex;
                flex-flow: row nowrap;
                align-items: center;
                justify-content: space-between;
            }

            .todo-item h4 {
                margin: 0;
                max-width: calc(100% - 52px);
                text-overflow: ellipsis;
                overflow-x: hidden;
                white-space: nowrap;
            }

            .todo-due-date {
                font-size: var(--font-size-normal);
                font-weight: 300;
                margin-right: 4px;
            }

            .todo-actions {
                background: var(--app-text-color);
                border-radius: 14px;
                display: inline-flex;
                flex-flow: row-reverse nowrap;
                justify-content: space-between;
                align-items: center;
                padding: 2px;
                width: 24px;
                height: 24px;
                overflow: hidden;
                transition: width .42s cubic-bezier(0.075, 0.82, 0.165, 1);
                cursor: pointer;
            }

            .todo-actions paper-icon-button {
                display: block;
                height: 24px;
                width: 24px;
                padding: 4px;
                color: var(--app-text-color-light);
                margin-right: 2px;
                margin-left: 2px;
                --paper-ink-color: var(--app-text-color-light);
            }

            .todo-actions paper-icon-button.hideable {
                display: none;
            }

            .todo-actions.open paper-icon-button.hideable {
                display: inline-flex;
            }

            .todo-actions.open {
                min-width: 90px;
            }

            .he-edit-btn-dark {
                color: var(--app-text-color);
                --paper-ink-color: var(--app-text-color);
            }

            .iron-selected .he-edit-btn {
                color: var(--app-text-color-light);
            }

            .todo-item--late {
                color: var(--paper-red-500)
            }

            /* END SECOND PANEL */

            .second-third-panel {
                grid-column: 2 / span 2;
                grid-row: 1 / 1;
                background: var(--app-background-color);

                z-index: 2;
            }

            ht-pat-detail-ctc-detail-panel {
                grid-column: 3 / 3;
                grid-row: 1 / 1;
            }

            .statusContainer {
                display: inline-flex;
                flex-flow: row nowrap;
                justify-content: space-between;
                align-items: center;
                width: 100%;
                height: 16px;
                overflow: hidden;
            }

            #insuranceStatus, #hubStatus, #tlStatus, #consentStatus, #edmgStatus, #ebmPracticeNet, #cbipLink {
                --paper-fab-background: var(--app-background-color-dark);
                --paper-fab-keyboard-focus-background: var(--app-background-color);
                color: var(--app-primary-color-dark);
                box-shadow: none;
                --paper-fab-iron-icon: {
                    height: 16px;
                    width: 16px;
                }

            }

            .edmg-hcps {
                position: fixed;
                top: 190px;
                left: 0;
                display: flex;
                flex-direction: column;
                background: rgba(69, 90, 100, .95); /* is --app-primary-color with opacity 95% */
                color: white;
                width: calc(20% - 16px); /* 20% is first col wdth, 16px is for margins */
                padding: 16px;
                margin: 0 8px;
                z-index: 10;
                border-radius: 8px;
                box-sizing: border-box;
            }

            .edmg-hcps > p {
                font-size: 1.3em;
                margin-top: 0;
                margin-bottom: 8px;
            }

            .edmg-hcps > p > span.ul {
                text-decoration: underline;
            }

            .edmg-hcps > p > small {
                margin: 8px 4px 12px 0;
                font-size: 1em;
                padding-left: 4px;
                display: block;
            }

            #insuranceStatus.medicalHouse, #edmgStatus.edmgPending {
                --paper-fab-background: var(--app-status-color-pending);
            }

            #insuranceStatus.noInsurance, #hubStatus.noAccess, #tlStatus.noTl, #consentStatus.noConsent, #edmgStatus.edmgNOk {
                --paper-fab-background: var(--app-status-color-nok);
            }

            #insuranceStatus.insuranceOk, #hubStatus.accessOk, #tlStatus.tlOk, #consentStatus.consentOk, #edmgStatus.edmgOk {
                --paper-fab-background: var(--app-status-color-ok);
            }

            #ebmPracticeNet {

            }

            #select-more-options-dialog {
                display: flex;
                flex-direction: column;
            }

            #select-more-options-dialog .buttons {
                position: initial;
            }


            .display-left-menu {
                display: none;
                position: fixed;
                top: 50%;
                left: 0;
                z-index: 120;
                background: var(--app-background-color-dark);
                transform: translateY(-50%) rotate(0);
                border-radius: 0 50% 50% 0;
                transition: .5s ease;
                box-shadow: var(--app-shadow-elevation-1);
            }

            .display-left-menu.open {
                left: 400px;
                border-radius: 0 50% 50% 0;
                transform: translateY(-50%);
            }

            @media screen and (max-width: 1168px) {
                .patient-info-container {
                    padding: 0;
                }

                .patient-picture-container {
                    display: none;
                }

                .btn-pat-close {
                    top: 16px;
                    left: 172px;
                }
            }

            @media screen and (max-width: 1025px) {
                .container {
                    grid-template-columns: 0% 25% 75%;
                }

                .container .fit-bottom {
                    left: 0% !important;
                    width: 40%;
                }

                .container.expanded {
                    /*grid-template-columns: 20% 30% 50%;*/
                }

                .container .first-panel {
                    transform: translateX(-100%);
                }

                .container.expanded .first-panel {
                    width: 400px;
                    z-index: 1001;
                    transform: none;
                }

                .container.expanded .fit-bottom {
                    /*left:20%!important;*/
                    width: 30%;
                }

                .selection-toast-button {
                    @apply --paper-font-caption;
                    text-transform: lowercase;
                }

                .second-third-panel {
                    grid-column: 1 / span 3;
                    grid-row: 1 / 1;
                }

                .display-left-menu {
                    display: inherit;
                }

                /* WIP */
                /*.display-left-menu.open iron-icon#icon {*/
                /*transform: rotate(180deg);*/
                /*}*/
                .floating-action-bar {
                    position: fixed;
                    left: 0;
                    bottom: 0;
                    width: 100vw;
                    transform: none;
                }
            }

            @media screen and (max-width: 1625px) {
                .wide .container {
                    grid-template-columns: 0% 25% 75%;
                }

                .wide .container .fit-bottom {
                    left: 0% !important;
                    width: 40%;
                }

                .wide .container.expanded {
                    /*grid-template-columns: 20% 30% 50%;*/
                }

                .wide .container .first-panel {
                    transform: translateX(-100%);
                }

                .wide .container.expanded .first-panel {
                    width: 400px;
                    z-index: 1001;
                    transform: none;
                }

                .wide .container.expanded .fit-bottom {
                    /*left:20%!important;*/
                    width: 30%;
                }

                .wide .selection-toast-button {
                    @apply --paper-font-caption;
                    text-transform: lowercase;
                }

                .wide .second-third-panel {
                    grid-column: 1 / span 3;
                    grid-row: 1 / 1;
                }

                .wide .display-left-menu {
                    display: inherit;
                }

                /* WIP */
                /*.display-left-menu.open iron-icon#icon {*/
                /*transform: rotate(180deg);*/
                /*}*/
                .wide .floating-action-bar {
                    position: fixed;
                    left: 0;
                    bottom: 0;
                    width: 100vw;
                    transform: none;
                }
            }

            @media screen and (max-width: 1218px) {
                .wide .container {
                    grid-template-columns: 0% 33% 67%;
                }
            }

            @media screen and (max-width: 800px) {
                .contact label {
                    max-width: 40% !important;
                }

                .contact h4 {
                    max-width: 80%;
                }

                .contact .contact-text-row {
                    padding: 0 4px;
                    width: 100%;
                    box-sizing: border-box;
                }
            }

            @media screen and (max-width: 456px) {
                .contact-year {
                    display: flex;
                    flex-direction: column;
                }

                .contact-year > div {
                    text-align: center;
                    display: flex;
                    flex-direction: row;
                    justify-content: space-around;
                }
            }

            .extraDialogFields paper-input, .extraDialogFields tk-token-field {
                --paper-input-container-focus-color: var(--app-primary-color);
            }

            .toast-detector {
                position: relative;
                height: 48px;
                bottom: 48px;
                width: 100%;
            }

            #savedIndicator {
                position: fixed;
                top: 50%;
                right: 0;
                z-index: 1000;
                color: white;
                font-size: 13px;
                background: rgba(0, 0, 0, 0.42);
                height: 24px;
                padding: 0 8px 0 12px;
                border-radius: 3px 0 0 3px;
                width: 0;
                opacity: 0;
            }

            .saved {
                animation: savedAnim 2.5s ease-in;
            }

            .saved iron-icon {
                margin-left: 4px;
                padding: 4px;
            }

            @keyframes savedAnim {
                0% {
                    width: 0;
                    opacity: 0;
                }
                20% {
                    width: 114px;
                    opacity: 1;
                }
                25% {
                    width: 96px;
                    opacity: 1;
                }
                75% {
                    width: 96px;
                    opacity: 1;
                }
                100% {
                    width: 0;
                    opacity: 0;
                }
            }

            #therLinkDialog, #hubDialog {
                width: 80%;
            }

            div.ther-container {
                height: 469px;
                margin: 0;
                flex-grow: 1;
                margin-bottom: 60px;
                overflow-y: auto;
            }

            #therLinkDialog .buttons {
                background: white;
            }

            #transactionDialog, #genInsDialog {
                width: 60%;
            }

            #genInsDialog .genIns-info {
                margin-top: 0;
                display: flex;
                flex-flow: row nowrap;
                justify-content: flex-start;
                align-items: flex-start;
            }

            #genInsDialog .genIns-info div {
                margin-right: 24px;
            }

            #genInsDialog .genIns-info div p {
                margin: 8px 0;
            }

            #genInsDialog .genIns-info div b {
                margin-right: 8px;
            }


            #transfers-list, #insurabilities-list {
                padding: 0;
                height: auto;
                margin: 0 24px 12px;
                border-bottom: 0;
                max-height: 200px;
                overflow-y: auto;
            }

            #genInsDialog .request-transfert {
                display: flex;
                flex-flow: row wrap;
                align-items: center;
                justify-content: flex-start;
                width: 100%;
                box-sizing: border-box;
                margin-bottom: 0;
                padding: 0;
            }

            #genInsDialog .request-transfert paper-button.action {
                --paper-button-ink-color: var(--app-secondary-color-dark);
                font-weight: 400;
                font-size: 12px;
                height: 32px;
                padding: 10px 1.2em;
                box-shadow: var(--shadow-elevation-2dp_-_box-shadow);
                background: var(--app-secondary-color);
                color: var(--app-primary-color-dark);
                justify-self: flex-end;
            }

            #genInsDialog .request-transfert .buttons {
                right: 24px;
                position: initial;
            }

            #genInsDialog .request-transfert vaadin-date-picker#picker {
                margin-right: 8px;
                padding-top: 0;
            }

            #genInsDialog .request-transfert paper-button.action[disabled] {
                background-color: var(--app-secondary-color-dark);
                color: var(--app-text-color-disabled);
                box-shadow: none;
            }

            #genInsDialog a {
                text-decoration: none;
                color: var(--app-secondary-color);
            }

            #kmehr_slot {
                overflow-y: scroll;
                height: 90%;
            }

            paper-tooltip {
                --paper-tooltip-delay-in: 100;
            }

            .history {
                height: 48px;
                width: calc(100% - 48px);
                color: var(--app-text-color);
                background-color: var(--app-background-color-dark);
                padding: 0 24px;
                font-weight: 700;
                display: flex;
                flex-flow: row wrap;
                justify-content: flex-start;
                align-items: center;
            }

            .history-icon {
                height: 24px;
                width: 24px;
                opacity: .5;
            }

            .history-txt {
                padding-left: 8px;
            }


            #consentDialog {
                max-width: 50vw !important;
                left: 50% !important;
                transform: translateX(-50%);
                height: 45%;
            }

            ht-spinner {
                margin-left: 15px;
                height: 42px;
                width: 42px;
            }

            .menu-item.iron-selected {
                background: var(--app-primary-color);
                color: white;
            }

            paper-item.iron-selected .he-edit-btn {
                display: inline-flex;
            }

            .he-edit-btn-container.open {
                width: 90px;
                display: inline-flex;
                flex-flow: row-reverse nowrap;
            }


            .he-edit-btn {
                height: 14px;
                width: 14px;
                padding: 1px;
                color: var(--app-text-color-light);
                margin-right: 2px;
                margin-left: 2px;
                --paper-ink-color: var(--app-text-color-light);
                box-sizing: border-box;
                display: none;
            }

            .he-edit-btn-dark {
                color: var(--app-text-color);
                --paper-ink-color: var(--app-text-color);
            }

            .modal-button--cancel {
                background: transparent;
                color: black;
                border: 1px solid var(--app-background-color-dark);
            }

            .icon-prof {
                height: 14px;
                width: 14px;
            }

            .icon-doc {
                height: 14px;
                width: 14px;
            }

            #legaltext {
                margin-top: 20px;
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

            div.planned {
                display: flex;
            }

            .button_list_vaccine_history {
                min-width: 0;
                width: 40px;
                height: 40px;
                padding: 8px;
                box-sizing: border-box;
            }

            img.button_list_vaccine_history-img {
                width: 24px;
                height: 24px;
            }

            .table-line-menu {
                display: flex;
                flex-flow: row nowrap;
                justify-content: space-between;
                align-items: center;
                height: 20px;
                width: 100%;
                font-size: var(--font-size-small);
                padding-left: 12px;
                box-sizing: border-box;
                font-weight: 500;
            }

            .table-line-menu:not(.table-line-menu-top) {
                font-size: var(--font-size-normal);
                padding-left: 0;
            }

            .table-line-menu div:not(:last-child) {
                border-right: 1px solid var(--app-background-color-dark);
                height: 20px;
                line-height: 20px;
            }

            .table-line-menu .code {
                min-width: 40px;
                padding-right: 4px;
            }

            .table-line-menu .descr {
                overflow: hidden;
                text-overflow: ellipsis;
                padding-left: 4px;
                padding-right: 4px;
                flex-grow: 1;
                white-space: nowrap;
            }

            .table-line-menu .sign {
                padding-left: 4px;
                padding-right: 4px;
                min-width: 8px;
                text-align: right;
            }

            .table-line-menu .date {
                min-width: 30px;
                padding-left: 4px;
                padding-right: 4px;
                text-align: center;
            }

            .table-line-menu .btns {
                min-width: 44px;
                display: flex;
                height: 20px;
                align-items: center;
                justify-content: center;
            }

            .items-number {
                font-size: var(--font-size-small);
                padding: 2px;
                border-radius: 50%;
                height: 14px;
                width: 14px;
                background: var(--app-background-color-light);
                color: var(--app-text-color);
                display: flex;
                flex-flow: row nowrap;
                justify-content: center;
                align-items: center;
                text-align: center;
                margin-right: 4px;
            }

            .items-number span {
                display: block;
            }


        </style>

        <div class\$="[[wideClass(user.rev)]]">
            <div class="container">
                <template is="dom-if" if="[[SpinnerActive]]">
                    <div id="busySpinner">
                        <div id="busySpinnerContainer">
                            <ht-spinner class="spinner" active=""></ht-spinner>
                        </div>
                    </div>
                </template>

                <paper-item id="postit-notification" class="notification-container dark">
                    <iron-icon class="notification-icn" icon="vaadin:edit"></iron-icon>
                    <div class="notification-msg">
                        <h4>[[localize('postit','Post-it',language)]]</h4>
                        <p>[[postitMsg]]</p>
                    </div>
                    <paper-button name="closePostit" class="notification-btn" on-tap="closePostit">
                        [[localize('clo','Close',language)]]
                    </paper-button>
                    <paper-button name="editPostit" class="notification-btn" on-tap="editPostit">
                        [[localize('edi','Edit',language)]]
                    </paper-button>
                </paper-item>

                <paper-item id="savedIndicator">[[localize('sav','SAVED',language)]]
                    <iron-icon icon="icons:check"></iron-icon>
                </paper-item>
                <template is="dom-if" if="[[isAdminSelected(selectedAdminOrCompleteFileIndex)]]">
                    <ht-pat-admin-card class="second-third-panel" id="pat-admin-card" api="[[api]]" user="[[user]]" patient="{{patient}}" i18n="[[i18n]]" resources="[[resources]]" language="[[language]]" tab-index="[[adminTabIndex]]" carddata="[[cardData]]" on-card-changed="_cardChanged" on-patient-saved="_patientSaved"></ht-pat-admin-card>
                </template>
                <template is="dom-if" if="[[!leftMenuOpen]]">
                    <paper-icon-button class="display-left-menu" icon="chevron-right" on-tap="_expandColumn"></paper-icon-button>
                </template>
                <template is="dom-if" if="[[leftMenuOpen]]">
                    <paper-icon-button class="display-left-menu open" icon="chevron-left" on-tap="_closeColumn"></paper-icon-button>
                </template>
                <paper-tooltip for="pat-close" position="right">[[localize('back_to_pat_list','Back to patients
                    list',language)]]
                </paper-tooltip>
                <div class="first-panel">
                    <paper-material class="zone compact-menu">
                        <paper-listbox class="padding-0" id="adminFileMenu" selected="{{selectedAdminOrCompleteFileIndex}}" selectable="paper-item">
                            <paper-fab id="pat-close" class="btn-pat-close" mini="" icon="close" on-tap="close"></paper-fab>
                            <paper-item id="_admin_info" class="horizontal layout patient-info-container" on-tap="_expandColumn">
                                <div class="patient-picture-container"><img src\$="[[picture(patient)]]"></div>
                                <div class="patient-info">
                                    <div class="patient-name">[[getGender(patient.gender)]] [[patient.firstName]]
                                        [[patient.lastName]]
                                    </div>
                                    <div class="patient-birthdate">°[[_timeFormat(patient.dateOfBirth)]]
                                        °[[_ageFormat(patient.dateOfBirth)]] [[patient.profession]]
                                    </div>
                                    <div class="statusContainer">
                                        <paper-fab id="insuranceStatus" mini="" icon="vaadin:umbrella" on-tap="_openGenInsDialog"></paper-fab>
                                        <paper-tooltip for="insuranceStatus">
                                            [[localize('gen_ins','assurability',language)]]
                                        </paper-tooltip>
                                        <paper-fab id="consentStatus" mini="" icon="icons:thumb-up" on-tap="_openConsentDialog"></paper-fab>
                                        <paper-tooltip for="consentStatus">[[localize('consent','consent',language)]]
                                        </paper-tooltip>
                                        <paper-fab id="tlStatus" mini="" icon="vaadin:specialist" on-tap="_openTherLinkDialog"></paper-fab>
                                        <paper-tooltip for="tlStatus">[[localize('tl','therapeutic link',language)]]
                                        </paper-tooltip>
                                        <paper-fab id="hubStatus" mini="" icon="hardware:device-hub" on-tap="_openHubDialog"></paper-fab>
                                        <paper-tooltip for="hubStatus">Hub</paper-tooltip>
                                        <paper-fab id="edmgStatus" mini="" icon="vaadin:clipboard-pulse" on-tap="_openEdmgDialog"></paper-fab>
                                        <paper-tooltip for="edmgStatus">[[localize('edmg','e-DMG',language)]]
                                            <template is="dom-if" if="[[refPeriods.length]]">
                                                <div class="edmg-hcps">
                                                    <template is="dom-repeat" items="[[_myReferralPeriods(patient.patientHealthCareParties)]]">
                                                        <p><span class="ul">[[localize('begin','Begin',language)]]: <b>[[_dateFormat(item.startDate)]]</b> - [[localize('end','End',language)]]: <b>[[_dateFormat(item.endDate)]]</b></span>
                                                            <template is="dom-if" if="[[item.comment.length]]"><br>
                                                                <small>[[item.comment]]</small>
                                                            </template>
                                                        </p>
                                                    </template>
                                                </div>
                                            </template>
                                        </paper-tooltip>
                                        <paper-fab id="ebmPracticeNet" mini="" on-tap="_linkToEbPracticeNet" src="[[_ebmPicture()]]"></paper-fab>
                                        <paper-tooltip for="ebmPracticeNet">
                                            [[localize('adm_ebm','ebmPracticeNet',language)]]
                                        </paper-tooltip>
                                        <paper-fab id="cbipLink" mini="" on-tap="_linkToCBIP" src="[[_cbipPicture()]]"></paper-fab>
                                        <paper-tooltip for="cbipLink">[[localize('cbip','CBIP',language)]]
                                        </paper-tooltip>
                                    </div>
                                </div>
                            </paper-item>
                            <paper-item class="menu-item" id="_complete_file" on-tap="_expandColumn">
                                [[localize('com_fil','Complete file',language)]]
                                <div>
                                    <paper-icon-button class="menu-item-icon menu-item-icon--add" icon="icons:add" on-tap="_addHealthElement"></paper-icon-button>
                                    <iron-icon class="menu-item-icon" icon="icons:arrow-forward"></iron-icon>
                                </div>
                            </paper-item>
                        </paper-listbox>
                        <div class="submenus-container">
                            <collapse-button id="cb_ahelb">
                                <paper-item slot="sublist-collapse-item" class="menu-trigger menu-item" id="_ht_active_hes" elevation="">
                                    <div class="one-line-menu list-title"><span>[[localize('act_hea_pro','Active Health Problems',language)]]</span>
                                    </div>
                                    <div style="display: flex; align-items: center;">
                                        <template is="dom-if" if="[[activeHealthElements.length]]">
                                            <div class="items-number"><span>[[activeHealthElements.length]]</span></div>
                                        </template>
                                        <!-- <ht-pat-he-tree-settings user="[[user]]" section="cb_ahelb" on-settings-changed="_settingsChanged"></ht-pat-he-tree-settings> -->
                                        <paper-icon-button class="menu-item-icon" icon="hardware:keyboard-arrow-down" on-tap="toggleMenu" hover="none"></paper-icon-button>
                                    </div>
                                </paper-item>
                                <paper-listbox id="ahelb" class="menu-content sublist" selectable="ht-pat-he-tree-detail" multi="" toggle-shift="" on-selected-items-changed="selectedMainElementItemsChanged">
                                    <!-- <template is="dom-if" if="[[!activeHealthElements.length]]">
                                        <paper-item class="menu-item  list-info"><div class="one-line-menu">[[localize('no_act_hea_ele','No active health elements',language)]]</div><paper-icon-button class="menu-item-icon" icon="icons:add" on-tap="_addHealthElement"></paper-icon-button></paper-item>
                                    </template> -->
                                    <div class="table-line-menu table-line-menu-top">
                                        <div class="code">Code</div>
                                        <div class="descr">Libellé</div>
                                        <div class="sign">S</div>
                                        <div class="date">Début</div>
                                        <div class="date">Fin</div>
                                        <div class="btns">&nbsp;</div>
                                    </div>
                                    <template id="activeHesDomRepeat" is="dom-repeat" items="[[_filterElements(activeHealthElements,cb_ahelb_sort,cb_ahelb_showInactive)]]" as="he">
                                        <ht-pat-he-tree-detail api="[[api]]" i18n="[[i18n]]" language="[[language]]" resources="[[resources]]" id="[[getHeId(he)]]" he="[[he]]" selected="[[_isItemInArray(he,selectedHealthcareElements,selectedHealthcareElements.*)]]" on-selection-change="handleSelectionChange" on-edit-he="_editHealthElement" on-activate-he="_activate" on-archive-he="_archive" on-inactivate-he="_inactivate"></ht-pat-he-tree-detail>
                                    </template>
                                    <!-- <template is="dom-if" if="[[activeHealthElements.length]]">
                                        <paper-item class="menu-item sublist-footer"><div class="one-line-menu">[[localize('add_hea_ele','Add health element',language)]]</div><paper-icon-button class="menu-item-icon" icon="icons:add" on-tap="_addHealthElement"></paper-icon-button></paper-item>
                                    </template> -->
                                </paper-listbox>
                            </collapse-button>
                            <collapse-button id="cb_ihelb">
                                <paper-item slot="sublist-collapse-item" class="menu-trigger menu-item" id="_ht_inactive_hes" elevation="">
                                    <div class="one-line-menu list-title"><span>[[localize('med_ant','Medical antecedents',language)]]</span>
                                    </div>
                                    <!-- <ht-pat-he-tree-settings user="[[user]]" section="cb_ihelb" on-settings-changed="_settingsChanged"></ht-pat-he-tree-settings> -->
                                    <div style="display: flex; align-items: center;">
                                        <template is="dom-if" if="[[inactiveHealthElements.length]]">
                                            <div class="items-number"><span>[[inactiveHealthElements.length]]</span>
                                            </div>
                                        </template>
                                        <paper-icon-button class="menu-item-icon" icon="hardware:keyboard-arrow-down" on-tap="toggleMenu"></paper-icon-button>
                                    </div>
                                </paper-item>
                                <paper-listbox id="ihelb" class="menu-content sublist" selectable="ht-pat-he-tree-detail" multi="" toggle-shift="" on-selected-items-changed="selectedMainElementItemsChanged">
                                    <!-- <template is="dom-if" if="[[!inactiveHealthElements.length]]">
                                        <paper-item class="menu-item list-info"><div class="one-line-menu">[[localize('no_med_ant','No medical antecedent',language)]]</div><paper-icon-button class="menu-item-icon" icon="icons:add" on-tap="_addInactiveHealthElement"></paper-icon-button></paper-item>
                                    </template> -->
                                    <div class="table-line-menu table-line-menu-top">
                                        <div class="code">Code</div>
                                        <div class="descr">Libellé</div>
                                        <div class="sign">S</div>
                                        <div class="date">Début</div>
                                        <div class="date">Fin</div>
                                        <div class="btns">&nbsp;</div>
                                    </div>
                                    <template id="inactiveHesDomRepeat" is="dom-repeat" items="[[_filterElements(inactiveHealthElements,cb_ihelb_sort,cb_ihelb_showInactive)]]" as="he">
                                        <ht-pat-he-tree-detail api="[[api]]" i18n="[[i18n]]" language="[[language]]" resources="[[resources]]" id="[[getHeId(he)]]" he="[[he]]" selected="[[_isItemInArray(he,selectedHealthcareElements,selectedHealthcareElements.*)]]" on-selection-change="handleSelectionChange" on-edit-he="_editHealthElement" on-activate-he="_activate" on-archive-he="_archive" on-inactivate-he="_inactivate"></ht-pat-he-tree-detail>
                                    </template>
                                    <!-- <template is="dom-if" if="[[inactiveHealthElements.length]]">
                                        <paper-item class="menu-item sublist-footer"><div class="one-line-menu">[[localize('add_med_ant','Add medical antecedent',language)]]</div><paper-icon-button class="menu-item-icon" icon="icons:add" on-tap="_addInactiveHealthElement"></paper-icon-button></paper-item>
                                    </template> -->
                                </paper-listbox>
                            </collapse-button>
                            <collapse-button id="cb_ishelb">
                                <paper-item slot="sublist-collapse-item" class="menu-trigger menu-item" id="_ht_surgical_hes" elevation="">
                                    <div class="one-line-menu list-title">
                                        <span>[[localize('surg','Surgical',language)]]</span></div>
                                    <!-- <ht-pat-he-tree-settings user="[[user]]" section="cb_ishelb" on-settings-changed="_settingsChanged"></ht-pat-he-tree-settings> -->
                                    <div style="display: flex; align-items: center;">
                                        <template is="dom-if" if="[[surgicalHealthElements.length]]">
                                            <div class="items-number"><span>[[surgicalHealthElements.length]]</span>
                                            </div>
                                        </template>
                                        <paper-icon-button class="menu-item-icon" icon="hardware:keyboard-arrow-down" on-tap="toggleMenu"></paper-icon-button>
                                    </div>
                                </paper-item>
                                <paper-listbox id="suhelb" class="menu-content sublist" selectable="ht-pat-he-tree-detail" multi="" toggle-shift="" on-selected-items-changed="selectedMainElementItemsChanged">
                                    <!-- <template is="dom-if" if="[[!surgicalHealthElements.length]]">
                                        <paper-item class="menu-item list-info"><div class="one-line-menu">[[localize('no_sur_hea_ele','No surgical history',language)]]</div></paper-item><paper-icon-button class="menu-item-icon" icon="icons:add" on-tap="_addInactiveHealthElement" data-tags="CD-ITEM|surgery|1.0"></paper-icon-button></paper-item>
                                    </template> -->
                                    <div class="table-line-menu table-line-menu-top">
                                        <div class="code">Code</div>
                                        <div class="descr">Libellé</div>
                                        <div class="sign">S</div>
                                        <div class="date">Début</div>
                                        <div class="date">Fin</div>
                                        <div class="btns">&nbsp;</div>
                                    </div>
                                    <template id="surgicalHesDomRepeat" is="dom-repeat" items="[[_filterElements(surgicalHealthElements,cb_ishelb_sort,cb_ishelb_showInactive)]]" as="he">
                                        <ht-pat-he-tree-detail api="[[api]]" i18n="[[i18n]]" language="[[language]]" resources="[[resources]]" id="[[getHeId(he)]]" he="[[he]]" selected="[[_isItemInArray(he,selectedHealthcareElements,selectedHealthcareElements.*)]]" on-selection-change="handleSelectionChange" on-edit-he="_editHealthElement" on-activate-he="_activate" on-archive-he="_archive" on-inactivate-he="_inactivate"></ht-pat-he-tree-detail>
                                    </template>
                                    <!-- <template is="dom-if" if="[[surgicalHealthElements.length]]">
                                        <paper-item class="menu-item sublist-footer"><div class="one-line-menu">[[localize('add_fam_ris','Add surgical history',language)]]</div><paper-icon-button class="menu-item-icon" icon="icons:add" on-tap="_addInactiveHealthElement" data-label="Surgery" data-tags="CD-ITEM|surgery|1.0"></paper-icon-button></paper-item>
                                    </template> -->
                                </paper-listbox>
                            </collapse-button>
                            <collapse-button id="cb_frhelb">
                                <paper-item slot="sublist-collapse-item" id="_svc_group_familyrisks" class="menu-trigger menu-item">
                                    <div class="one-line-menu list-title">[[localize('fam_ris','Family
                                        risks',language)]]
                                    </div>
                                    <!-- <ht-pat-he-tree-settings user="[[user]]" section="cb_frhelb" on-settings-changed="_settingsChanged"></ht-pat-he-tree-settings> -->
                                    <div style="display: flex; align-items: center;">
                                        <template is="dom-if" if="[[familyrisks.length]]">
                                            <div class="items-number"><span>[[familyrisks.length]]</span></div>
                                        </template>
                                        <paper-icon-button class="menu-item-icon" icon="hardware:keyboard-arrow-down" on-tap="toggleMenu"></paper-icon-button>
                                    </div>
                                </paper-item>
                                <paper-listbox id="frhelb" class="menu-content sublist" selectable="ht-pat-he-tree-detail" multi="" toggle-shift="" on-selected-items-changed="selectedMainElementItemsChanged">
                                    <!-- <template is="dom-if" if="[[!familyrisks.length]]">
                                        <paper-item class="menu-item list-info"><div class="one-line-menu">[[localize('no_fam_ris','No family risks',language)]]</div><paper-icon-button class="menu-item-icon" icon="icons:add" on-tap="_addHealthElement" data-label="Family risk" data-tags="CD-ITEM|familyrisk|1.0"></paper-icon-button></paper-item>
                                    </template> -->
                                    <div class="table-line-menu table-line-menu-top">
                                        <div class="code">Code</div>
                                        <div class="descr">Libellé</div>
                                        <div class="sign">S</div>
                                        <div class="date">Début</div>
                                        <div class="date">Fin</div>
                                        <div class="btns">&nbsp;</div>
                                    </div>
                                    <template is="dom-repeat" items="[[_filterElements(familyrisks, cb_frhelb_sort, cb_frhelb_showInactive)]]" as="risk">
                                        <ht-pat-he-tree-detail api="[[api]]" i18n="[[i18n]]" language="[[language]]" resources="[[resources]]" id="[[getHeId(risk)]]" he="[[risk]]" selected="[[_isItemInArray(risk,selectedHealthcareElements,selectedHealthcareElements.*)]]" on-selection-change="handleSelectionChange" on-edit-he="_editHealthElement" on-activate-he="_activate" on-archive-he="_archive" on-inactivate-he="_inactivate"></ht-pat-he-tree-detail>
                                    </template>
                                    <!-- <template is="dom-if" if="[[familyrisks.length]]">
                                        <paper-item class="menu-item sublist-footer"><div class="one-line-menu">[[localize('add_fam_ris','Add family risk',language)]]</div><paper-icon-button class="menu-item-icon" icon="icons:add" on-tap="_addHealthElement" data-label="Family risk" data-tags="CD-ITEM|familyrisk|1.0"></paper-icon-button></paper-item>
                                    </template> -->
                                </paper-listbox>
                            </collapse-button>
                            <collapse-button id="cb_rhelb">
                                <paper-item slot="sublist-collapse-item" id="_svc_group_risks" class="menu-trigger menu-item">
                                    <div class="one-line-menu list-title">[[localize('ris','Risks',language)]]</div>
                                    <!-- <ht-pat-he-tree-settings user="[[user]]" section="cb_rhelb" on-settings-changed="_settingsChanged"></ht-pat-he-tree-settings> -->
                                    <div style="display: flex; align-items: center;">
                                        <template is="dom-if" if="[[risks.length]]">
                                            <div class="items-number"><span>[[risks.length]]</span></div>
                                        </template>
                                        <paper-icon-button class="menu-item-icon" icon="hardware:keyboard-arrow-down" on-tap="toggleMenu"></paper-icon-button>
                                    </div>
                                </paper-item>
                                <paper-listbox id="rhelb" class="menu-content sublist" selectable="ht-pat-he-tree-detail" multi="" toggle-shift="" on-selected-items-changed="selectedMainElementItemsChanged">
                                    <!-- <template is="dom-if" if="[[!risks.length]]">
                                        <paper-item class="menu-item list-info"><div class="one-line-menu">[[localize('no_ris','No risks',language)]]</div><paper-icon-button class="menu-item-icon" icon="icons:add" on-tap="_addHealthElement" data-label="Risks" data-tags="CD-ITEM|risk|1.0"></paper-icon-button></paper-item>
                                    </template> -->
                                    <div class="table-line-menu table-line-menu-top">
                                        <div class="code">Code</div>
                                        <div class="descr">Libellé</div>
                                        <div class="sign">S</div>
                                        <div class="date">Début</div>
                                        <div class="date">Fin</div>
                                        <div class="btns">&nbsp;</div>
                                    </div>
                                    <template is="dom-repeat" items="[[_filterElements(risks, cb_rhelb_sort, cb_rhelb_showInactive)]]" as="risk">
                                        <ht-pat-he-tree-detail api="[[api]]" i18n="[[i18n]]" language="[[language]]" resources="[[resources]]" id="[[getHeId(risk)]]" he="[[risk]]" selected="[[_isItemInArray(risk,selectedHealthcareElements,selectedHealthcareElements.*)]]" on-selection-change="handleSelectionChange" on-edit-he="_editHealthElement" on-activate-he="_activate" on-archive-he="_archive" on-inactivate-he="_inactivate"></ht-pat-he-tree-detail>
                                    </template>
                                    <!-- <template is="dom-if" if="[[risks.length]]">
                                        <paper-item class="menu-item sublist-footer"><div class="one-line-menu">[[localize('add_ris','Add risk',language)]]</div><paper-icon-button class="menu-item-icon" icon="icons:add" on-tap="_addHealthElement" data-label="Risks" data-tags="CD-ITEM|risk|1.0"></paper-icon-button></paper-item>
                                    </template> -->
                                </paper-listbox>
                            </collapse-button>
                            <collapse-button id="cb_alhelb">
                                <paper-item slot="sublist-collapse-item" id="_svc_group_allergies" class="menu-trigger menu-item">
                                    <div class="one-line-menu list-title">[[localize('aller','Allergies',language)]]
                                        [[localize('and','and',language)]]
                                        [[localize('intolerances','intolerances',language)]]
                                    </div>
                                    <!-- <ht-pat-he-tree-settings user="[[user]]" section="cb_alhelb" on-settings-changed="_settingsChanged"></ht-pat-he-tree-settings> -->
                                    <div style="display: flex; align-items: center;">
                                        <template is="dom-if" if="[[allergies.length]]">
                                            <div class="items-number"><span>[[allergies.length]]</span></div>
                                        </template>
                                        <paper-icon-button class="menu-item-icon" icon="hardware:keyboard-arrow-down" on-tap="toggleMenu"></paper-icon-button>
                                    </div>
                                </paper-item>
                                <paper-listbox id="alhelb" class="menu-content sublist" selectable="ht-pat-he-tree-detail" multi="" toggle-shift="" on-selected-items-changed="selectedMainElementItemsChanged">
                                    <!-- <template is="dom-if" if="[[!allergies.length]]">
                                        <paper-item class="menu-item list-info"><div class="one-line-menu">[[localize('no_all','No allergies',language)]]</div><paper-icon-button class="menu-item-icon" icon="icons:add" on-tap="_addHealthElement" data-label="Allergies" data-tags="CD-ITEM|allergy|1.0"></paper-icon-button></paper-item>
                                    </template> -->
                                    <div class="table-line-menu table-line-menu-top">
                                        <div class="code">Code</div>
                                        <div class="descr">Libellé</div>
                                        <div class="sign">S</div>
                                        <div class="date">Début</div>
                                        <div class="date">Fin</div>
                                        <div class="btns">&nbsp;</div>
                                    </div>
                                    <template is="dom-repeat" items="[[_filterElements(allergies, cb_alhelb_sort, cb_alhelb_showInactive)]]" as="allergy">
                                        <ht-pat-he-tree-detail api="[[api]]" i18n="[[i18n]]" language="[[language]]" resources="[[resources]]" id="[[getHeId(allergy)]]" he="[[allergy]]" selected="[[_isItemInArray(allergy,selectedHealthcareElements,selectedHealthcareElements.*)]]" on-selection-change="handleSelectionChange" on-edit-he="_editHealthElement" on-activate-he="_activate" on-archive-he="_archive" on-inactivate-he="_inactivate"></ht-pat-he-tree-detail>
                                    </template>
                                    <!-- <template is="dom-if" if="[[allergies.length]]">
                                        <paper-item class="menu-item sublist-footer"><div class="one-line-menu">[[localize('add_all','Add allergy',language)]]</div><paper-icon-button class="menu-item-icon" icon="icons:add" on-tap="_addHealthElement" data-label="Allergies" data-tags="CD-ITEM|allergy|1.0"></paper-icon-button></paper-item>
                                    </template> -->
                                </paper-listbox>
                            </collapse-button>
                            <collapse-button id="cb_gmhelb">
                                <paper-item slot="sublist-collapse-item" id="_svc_group_medications" class="menu-trigger menu-item">
                                    <div class="one-line-menu list-title">[[localize('med','Medication',language)]]
                                    </div>
                                    <paper-tooltip position="left" offset="-1" for="med-edit-btn-plan">
                                        [[localize('med_plan','Medication Plan',language)]]
                                    </paper-tooltip>
                                    <div style="display: flex; align-items: center;">
                                        <paper-icon-button id="med-edit-btn-plan" class="extra-button" icon="icons:assignment" on-tap="_medicationPlan"></paper-icon-button>
                                        <template is="dom-if" if="[[medications.length]]">
                                            <div class="items-number"><span>[[medications.length]]</span></div>
                                        </template>
                                        <paper-icon-button class="menu-item-icon" icon="hardware:keyboard-arrow-down" on-tap="toggleMenu"></paper-icon-button>
                                    </div>
                                </paper-item>
                                <paper-listbox id="mhelb" class="menu-content sublist" multi="" toggle-shift="" selected-items="{{selectedMedications}}">
                                    <template is="dom-if" if="[[!medications.length]]">
                                        <paper-item class="menu-item list-info">
                                            <div class="one-line-menu">[[localize('no_med','No
                                                medications',language)]]
                                            </div>
                                            <paper-icon-button class="menu-item-icon" icon="icons:add" on-tap="_addMedication" data-label="Medications" data-tags="CD-ITEM|medication|1.0"></paper-icon-button>
                                        </paper-item>
                                    </template>
                                    <div class="table-line-menu table-line-menu-top" style="padding-right: 4px;">
                                        <div class="code">ATC</div>
                                        <div class="descr">Libellé</div>
                                        <div class="date">Début</div>
                                        <div class="date">Fin</div>
                                        <div class="btns">&nbsp;</div>
                                    </div>
                                    <template is="dom-repeat" items="[[medications]]" as="medication">
                                        <paper-item class="menu-item" id="_svc_[[medication.id]]">
                                            <div class="table-line-menu">
                                                <div class="code">
                                                    <template is="dom-if" if="[[medication.colour]]">
                                                        <label class\$="colour-code [[medication.colour]]"><span></span></label>
                                                    </template>
                                                    [[getAtc(medication)]]
                                                </div>
                                                <div class="descr">[[shortMedicationDescription(medication,
                                                    language)]]
                                                </div>
                                                <div class="date">[[_medicationStartDateLabel(medication)]]</div>
                                                <div class="date">[[_medicationEndDateLabel(medication)]]</div>
                                                <div class="btns">
                                                    <paper-icon-button id="med-edit-btn-edit_[[medication.id]]" class="he-edit-btn he-edit-btn-dark" icon="create" on-tap="_editMedication"></paper-icon-button>
                                                </div>
                                            </div>
                                        </paper-item>
                                    </template>
                                    <template is="dom-if" if="[[medications.length]]">
                                        <paper-item class="menu-item sublist-footer">
                                            <div class="one-line-menu">[[localize('add_med','Add
                                                medication',language)]]
                                            </div>
                                            <paper-icon-button class="menu-item-icon" icon="icons:add" on-tap="_addMedication" data-label="Medications" data-tags="CD-ITEM|medication|1.0"></paper-icon-button>
                                        </paper-item>
                                    </template>
                                </paper-listbox>
                            </collapse-button>
                            <collapse-button id="cb_archhelb">
                                <paper-item slot="sublist-collapse-item" class="menu-trigger menu-item" id="_ht_archived_hes" elevation="">
                                    <div class="one-line-menu list-title">
                                        <span>[[localize('arc','Archive',language)]]</span></div>
                                    <!-- <ht-pat-he-tree-settings user="[[user]]" section="cb_archhelb" on-settings-changed="_settingsChanged"></ht-pat-he-tree-settings> -->
                                    <div style="display: flex; align-items: center;">
                                        <template is="dom-if" if="[[archivedHealthElements.length]]">
                                            <div class="items-number"><span>[[archivedHealthElements.length]]</span>
                                            </div>
                                        </template>
                                        <paper-icon-button class="menu-item-icon" icon="hardware:keyboard-arrow-down" on-tap="toggleMenu"></paper-icon-button>
                                    </div>
                                </paper-item>
                                <paper-listbox id="arhelb" class="menu-content sublist" selectable="ht-pat-he-tree-detail" multi="" toggle-shift="" on-selected-items-changed="selectedMainElementItemsChanged">
                                    <template is="dom-if" if="[[!archivedHealthElements.length]]">
                                        <paper-item class="menu-item list-info">
                                            <div class="one-line-menu">[[localize('no_arc_hea_ele','No archived health
                                                elements',language)]]
                                            </div>
                                        </paper-item>
                                    </template>
                                    <div class="table-line-menu table-line-menu-top">
                                        <div class="code">Code</div>
                                        <div class="descr">Libellé</div>
                                        <div class="sign">S</div>
                                        <div class="date">Début</div>
                                        <div class="date">Fin</div>
                                        <div class="btns">&nbsp;</div>
                                    </div>
                                    <template id="archivedHesDomRepeat" is="dom-repeat" items="[[_filterElements(archivedHealthElements,cb_archhelb_sort)]]" as="he">
                                        <ht-pat-he-tree-detail api="[[api]]" i18n="[[i18n]]" language="[[language]]" resources="[[resources]]" id="[[getHeId(he)]]" he="[[he]]" selected="[[_isItemInArray(he,selectedHealthcareElements,selectedHealthcareElements.*)]]" on-selection-change="handleSelectionChange" on-edit-he="_editHealthElement" on-activate-he="_activate" on-archive-he="_archive" on-inactivate-he="_inactivate"></ht-pat-he-tree-detail>
                                    </template>
                                </paper-listbox>
                            </collapse-button>
                        </div>
                        <!--<div class="add-btn-container"><paper-button class="add-btn" on-tap="_addHealthElement">[[localize('add_heal_elem','Add Health Element',language)]]</paper-button></div>-->
                    </paper-material>
                </div>
                <template is="dom-if" if="[[!isAdminSelected(selectedAdminOrCompleteFileIndex)]]" restamp="">
                    <div class="second-panel">
                        <div>
                            <filter-panel id="contactFilterPanel" items="[[secondPanelItems]]" search-string="{{contactSearchString}}" selected-filters="{{contactFilters}}" i18n="[[i18n]]" language="[[language]]" resources="[[resources]]"></filter-panel>
                        </div>
                        <div class="contacts-container" on-scroll="openToast">
                            <paper-listbox id="_contacts_listbox" focused="" multi="" toggle-shift="" selectable="paper-material" selected-values="{{selectedContactIds}}" attr-for-selected="id">
                            <span class="contact-year" on-click="openToast">
                                <div>[[localize('to_do','To Do',language)]]</div>
                                <div class="planned">
                                    <paper-icon-button id="button_list_plan_of_action-eventslgt" icon="history" on-tap="showListPlanOfAction"></paper-icon-button>
                                    <paper-tooltip position="bottom" for="button_list_plan_of_action-eventslgt">[[localize('plan_of_act','Plan of action',language)]]</paper-tooltip>
                                    <!--<paper-icon-button id="button_list_vaccine_history" icon="maps:local-hospital" on-tap="showVaccineHistory"></paper-icon-button>-->
                                    <paper-button id="button_list_vaccine_history" class="button_list_vaccine_history" on-tap="showVaccineHistory"><img class="button_list_vaccine_history-img" src="./svg/syringe.svg" alt="vaccine-history"></paper-button>
                                    <paper-tooltip position="bottom" for="button_list_vaccine_history">[[localize('vacc_his','Vaccine history',language)]]</paper-tooltip>
                                </div>
                            </span>
                                <template is="dom-if" if="[[events.length]]">
                                    <paper-listbox id="_events_listbox" class="todo-list">
                                        <template is="dom-repeat" items="[[events]]" as="e">
                                            <paper-item id="_svc_[[e.id]]" class\$="todo-item [[_lateEventCssClass(e)]]">
                                                <h4><label class="todo-due-date">[[_dateFormat(e.valueDate)]]</label>[[shortServiceDescription(e)]]
                                                </h4>
                                                <div class="todo-actions">
                                                    <paper-icon-button id="event-btn-edit_[[e.id]]" class="action-edit-btn" icon="create" on-tap="_toggleActionButton"></paper-icon-button>
                                                    <paper-tooltip position="left" for="event-btn-edit_[[e.id]]">
                                                        [[localize('edi','Edit',language)]]
                                                    </paper-tooltip>
                                                    <paper-icon-button id="event-btn-close_[[e.id]]" class="action-edit-btn hideable" icon="done" on-tap="completeEvent"></paper-icon-button>
                                                    <paper-tooltip position="left" for="event-btn-close_[[e.id]]">
                                                        [[localize('arc','Archive',language)]]
                                                    </paper-tooltip>
                                                    <paper-icon-button id="event-btn-done_[[e.id]]" class="action-edit-btn hideable" icon="clear" on-tap="clearEvent"></paper-icon-button>
                                                    <paper-tooltip position="left" for="event-btn-done_[[e.id]]">
                                                        [[localize('mark_as_aborted','Marquer comme
                                                        abandonnée',language)]]
                                                    </paper-tooltip>
                                                </div>
                                            </paper-item>
                                        </template>
                                    </paper-listbox>
                                </template>
                                <template is="dom-repeat" items="[[contactYears]]" as="contactYear">
								<span class="contact-year" on-click="openToast">
									[[contactYear.year]]
								</span>
                                    <template is="dom-repeat" items="[[contactYear.contacts]]" as="contact" filter="[[contactFilter(selectedHealthcareElements, selectedHealthcareElements.*, timeSpanStart, timeSpanEnd, contactSearchString, contactFilters, contactFilters.*, currentContact,contactStatutChecked.*)]]" sort="compareContacts">
                                        <paper-material id="ctc_[[contact.id]]" elevation="0" class\$="layout vertical contact [[_isLatestYearContact(contactYear, contactYears)]] [[_contactClasses(contact, contact.closingDate, contact.author, contact.responsible)]]" on-click="openToast">
                                            <paper-item class="contact-text">
                                                <div class="contact-text-row contact-text-date">
                                                    <label>[[_timeFormat(contact.openingDate)]]
                                                        ([[_shortId(contact.id)]])</label>
                                                    <label class="hcp">[[hcp(contact)]]</label>
                                                </div>
                                                <div class="contact-text-row grey">
                                                    <h4>[[getTypeContact(contact,refreshServicesDescription)]]</h4>
                                                    <template is="dom-repeat" items="[[highlightedServiceLabels(user)]]" as="label">
                                                        <p>
                                                            <template is="dom-repeat" items="[[serviceDescriptions(contact,label)]]" as="svcDesc">
                                                                <template is="dom-if" if="[[!index]]">[[label]]:
                                                                </template>
                                                                <template is="dom-if" if="[[index]]"> ,</template>
                                                                [[svcDesc]]
                                                            </template>
                                                        </p>

                                                    </template>
                                                </div>
                                                <div class="contact-text-row label-container">
                                                    <template is="dom-repeat" items="[[contact.healthElements]]" as="he">
                                                        <label id="label_[[contact.id]]_[[getHeId(he)]]" class\$="colour-code [[he.colour]]"><span></span>[[he.descr]]</label>
                                                        <paper-tooltip for="label_[[contact.id]]_[[getHeId(he)]]">
                                                            [[he.descr]]
                                                        </paper-tooltip>
                                                    </template>
                                                </div>
                                            </paper-item>
                                            <template is="dom-if" if="[[!contact.closingDate]]">
                                                <paper-icon-button id="close-[[contact.id]]" class="menu-item-icon contact-icon close-ctc" icon="icons:lock" alt="[[localize('fin_ctc','Finalize contact',language)]]" on-tap="closeContact"></paper-icon-button>
                                                <paper-tooltip for="close-[[contact.id]]">[[localize('fin_ctc','Finalize
                                                    contact',language)]]
                                                </paper-tooltip>
                                            </template>
                                        </paper-material>
                                    </template>
                                </template>
                            </paper-listbox>
                        </div>
                        <div class="toast-detector" on-mousemove="openToast"></div>
                        <paper-toast id="selectionToast" class="fit-bottom">
                            <paper-button class="selection-toast-button" name="select-today" role="button" tabindex="0" animated="" aria-disabled="false" elevation="0" on-tap="_selectToday">
                                <iron-icon class="selection-toast-icon" icon="icure-svg-icons:select-today"></iron-icon>
                                [[localize('sel_tod','Select Today',language)]]
                            </paper-button>
                            <paper-button class="selection-toast-button" name="select-six-months" role="button" tabindex="0" animated="" aria-disabled="false" elevation="0" on-tap="_select6Months">
                                <iron-icon class="selection-toast-icon" icon="icure-svg-icons:select-six-months"></iron-icon>
                                [[localize('sel_last_6_month','Last 6 Months',language)]]
                            </paper-button>
                            <paper-button class="selection-toast-button" name="select-all" role="button" tabindex="0" animated="" aria-disabled="false" elevation="0" on-tap="_selectAll">
                                <iron-icon class="selection-toast-icon" icon="icure-svg-icons:select-all"></iron-icon>
                                [[localize('sel_all','Select All',language)]]
                            </paper-button>
                            <paper-button class="selection-toast-button" name="select-all" role="button" tabindex="0" animated="" aria-disabled="false" elevation="0" on-tap="_selectMoreOptions">
                                <iron-icon class="selection-toast-icon" icon="icons:add"></iron-icon>
                                {{localize("more","More",language)}}
                            </paper-button>
                        </paper-toast>
                        <template is="dom-if" if="[[!currentContact]]">
                            <div class="new-ctc-btn-container">
                                <paper-button class="add-btn" on-tap="newContact">[[localize('new_con','New
                                    Contact',language)]]
                                </paper-button>
                            </div>
                        </template>
                    </div>
                    <ht-pat-detail-ctc-detail-panel id="ctcDetailPanel" contacts="[[selectedContacts]]" all-contacts="[[contacts]]" health-elements="[[healthElements]]" main-health-elements="[[_concat(activeHealthElements, allergies, risks, inactiveHealthElements, familyrisks)]]" api="[[api]]" i18n="[[i18n]]" user="[[user]]" patient="[[patient]]" language="[[language]]" resources="[[resources]]" current-contact="[[currentContact]]" medications="[[medications]]" hidden-sub-contacts-id="[[hiddenSubContactsId]]" on-select-current-contact="_selectCurrentContact" on-plan-action="_planAction" on-close-contact="_closeContact" on-change="formsChanged" on-must-save-contact="_saveContact" on-medications-selection="_selectMultiMedication" on-medication-selection="_selectMedication" on-medication-detail="_medicationDetail" on-medications-detail="_medicationsDetail" contact-type-list="[[contactTypeList]]" on-contact-saved="contactChanged"></ht-pat-detail-ctc-detail-panel>
                </template>
            </div>
        </div>

        <health-problem-selector id="add-healthelement-dialog" api="[[api]]" i18n="[[i18n]]" resources="[[resources]]" language="[[language]]" data-provider="[[_healthElementsSelectorDataProvider()]]" on-entity-selected="_addedHealthElementSelected" entity-type="[[localize('hp','Health Problem',language)]]" entity="{{heEntity}}" ok-label="[[localize('cre','Create',language)]]">
            <div class="extraDialogFields" slot="suffix">

            </div>
        </health-problem-selector>

        <health-problem-selector id="edit-healthelement-dialog" api="[[api]]" i18n="[[i18n]]" resources="[[resources]]" language="[[language]]" on-open-health-problem="_composeHistory" data-provider="[[_healthElementsSelectorDataProvider()]]" on-entity-selected="_editedHealthElementSelected" entity-type="[[localize('hp','Health Problem',language)]]" entity="{{heEntity}}" ok-label="[[localize('save','Save',language)]]">
            <div class="extraDialogFields" slot="suffix">
                <div class="history">
                    <div class="history-icon">
                        <iron-icon icon="history"></iron-icon>
                    </div>
                    <div class="history-txt">
                        [[localize('his','History',language)]]
                    </div>
                </div>
                <template is="dom-repeat" items="[[historyElement]]" as="hhe">
                    <h4>{{hhe.modified}} {{hhe.descr}}</h4>
                    <div>
                        <b>[[localize('st_da','Start Date',language)]]:</b> {{hhe.openingDate}}
                        <template is="dom-if" if="[[_checkClosingDate(hhe.closingDate)]]">
                            <b>[[localize('en_da','End Date',language)]]:</b> {{hhe.closingDate}}
                        </template>

                    </div>
                    <div>
                        <template is="dom-if" if="[[_checkIfPresent(hhe.nature)]]">
                            <b>[[localize('nat','Nature',language)]]:</b> {{_getDataTrad(hhe.nature)}};
                        </template>

                        <template is="dom-if" if="[[_checkIfPresent(hhe.certainty)]]">
                            <b>[[localize('cert','Certainty',language)]]:</b> {{_getDataTrad(hhe.certainty)}};
                        </template>

                        <template is="dom-if" if="[[_checkIfPresent(hhe.severity)]]">
                            <b>[[localize('sev','Severity',language)]]:</b> {{_getDataTrad(hhe.severity)}};
                        </template>

                        <template is="dom-if" if="[[_checkIfPresent(hhe.temporality)]]">
                            <b>[[localize('temp','Temporality',language)]]:</b> {{_getDataTrad(hhe.temporality)}};
                        </template>

                        <template is="dom-if" if="[[_checkIfPresent(hhe.temporality)]]">
                            <b>[[localize('ext-temp','Extra temporality',language)]]:</b>
                            {{_getDataTrad(hhe.extraTemporality)}};
                        </template>

                    </div>
                </template>
            </div>
        </health-problem-selector>

        <entity-selector id="add-service-dialog" i18n="[[i18n]]" language="[[language]]" resources="[[resources]]" columns="[[_servicesSelectorColumns()]]" data-provider="[[_servicesSelectorDataProvider(editedSvcLabel)]]" on-entity-selected="_addedOrEditedServiceSelected" entity-type="[[editedSvcLabel]]" entity="{{svcEntity}}" ok-label="[[localize('cre','Create',language)]]">
            <div class="extraDialogFields" slot="suffix">
                <paper-input label="Description" value="[[shortServiceDescription(svcEntity, language)}}" on-value-changed="_svcEntityContentChanged"></paper-input>
            </div>
        </entity-selector>

        <entity-selector id="edit-service-dialog" i18n="[[i18n]]" language="[[language]]" resources="[[resources]]" columns="[[_servicesSelectorColumns()]]" data-provider="[[_servicesSelectorDataProvider(editedSvcLabel)]]" on-entity-selected="_addedOrEditedServiceSelected" entity-type="[[editedSvcLabel]]" entity="{{svcEntity}}" ok-label="[[localize('modify','Modify',language)]]">
            <div class="extraDialogFields" slot="suffix">
                <paper-input label="Description" value="[[shortServiceDescription(svcEntity, language)}}" on-value-changed="_svcEntityContentChanged"></paper-input>
            </div>
        </entity-selector>


        <paper-dialog id="genInsDialog">
            <h2 class="modal-title">[[localize('gen_ins','General insurability',language)]]</h2>
            <div class="genIns-info">
                <div>
                    <p><b>[[localize('ssin','SSIN',language)]]:</b> [[curGenInsResp.inss]]</p>
                    <p><b>[[localize('nam','Name',language)]]:</b> [[curGenInsResp.firstName]]
                        [[curGenInsResp.lastName]]</p>
                    <p><b>[[localize('sex','Gender',language)]]:</b>
                        [[localize(curGenInsResp.sex,curGenInsResp.sex,language)]]</p>
                    <p><b>[[localize('dat_of_bir','Birthdate',language)]]:</b>
                        [[_dateFormat2(curGenInsResp.dateOfBirth,'YYYYMMDD','DD/MM/YYYY')]]</p>

                    <template is="dom-if" if="{{curGenInsResp.deceased}}"><p><b>[[localize('deceased','Deceased',language)]]:</b>[[_dateFormat2(curGenInsResp.deceased,'YYYYMMDD','DD/MM/YYYY')]]
                    </p></template>
                    <template is="dom-if" if="{{curGenInsResp.hospitalizedInfo}}"><p><b>[[localize('hos_inf','Hospitalized',language)]]:</b>[[_formatHospitalizedInfo(curGenInsResp.hospitalizedInfo)]]
                    </p></template>
                </div>
                <div>
                    <p><b>[[localize('paymentByIo','paymentByIo',language)]]:</b>[[_yesOrNo(curGenInsResp.paymentByIo)]]
                    </p>
                    <p><b>[[localize('specialSocialCategory','specialSocialCategory',language)]]:</b>[[_yesOrNo(curGenInsResp.specialSocialCategory)]]
                    </p>
                    <template is="dom-if" if="{{curGenInsResp.generalSituation}}"><p><b>[[localize('generalSituation','generalSituation',language)]]:</b>[[localize(curGenInsResp.generalSituation,
                        curGenInsResp.generalSituation, language)]]</p></template>
                    <template is="dom-if" if="{{_hasErrors(curGenInsResp.errors)}}">
                        <p><b>[[localize('err','Error',language)]]:</b><br>
                            <template is="dom-repeat" items="[[curGenInsResp.errors]]" as="error">
                                <b>[[error.code]]</b> [[_formatError(error)]]<br>
                            </template>
                        </p>
                    </template>
                    <template is="dom-if" if="{{!_hasErrors(curGenInsResp.errors)}}">
                        <p>&nbsp;</p>
                        <template is="dom-if" if="{{curGenInsResp.faultMessage}}"><p><b>[[localize('faultMessage','faultMessage',language)]]:</b>[[curGenInsResp.faultMessage]]
                        </p></template>
                        <template is="dom-if" if="{{curGenInsResp.faultSource}}"><p><b>[[localize('faultSource','faultSource',language)]]:</b>[[curGenInsResp.faultSource]]
                        </p></template>
                        <template is="dom-if" if="{{curGenInsResp.faultCode}}"><p><b>[[localize('faultCode','faultCode',language)]]:</b>[[curGenInsResp.faultCode]]
                        </p></template>
                    </template>
                    <p><a href="" on-tap="_importGenIns"><b>Import data</b></a></p>
                </div>
                <div>
                    <template is="dom-if" if="{{curGenInsResp.medicalHouseInfo}}">
                        <p><b>[[localize('mmh_inf','Medical House',language)]]:</b></p>
                        <p><b>[[localize('per_sta','Start',language)]]:</b>
                            [[_dateFormat2(curGenInsResp.medicalHouseInfo.periodStart, 'YYYYMMDD', 'DD/MM/YYYY')]]</p>
                        <p><b>[[localize('per_end','End',language)]]:</b>
                            [[dateFormat2(curGenInsResp.medicalHouseInfo.periodEnd, 'YYYYMMDD', 'DD/MM/YYYY')]]</p>
                        <template is="dom-if" if="{{curGenInsResp.medicalHouseInfo.medical}}">
                            <p><b>[[localize('abo_med','Doctor',language)]]:</b>
                                [[_trueOrUnknown(curGenInsResp.medicalHouseInfo.medical)]]</p>
                        </template>
                        <template is="dom-if" if="{{curGenInsResp.medicalHouseInfo.nurse}}">
                            <p><b>[[localize('abo_nur','Nurse',language)]]:</b>
                                [[_trueOrUnknown(curGenInsResp.medicalHouseInfo.nurse)]]</p>
                        </template>
                        <template is="dom-if" if="{{curGenInsResp.medicalHouseInfo.kine}}">
                            <p><b>[[localize('abo_kin','Kine',language)]]:</b>
                                [[_trueOrUnknown(curGenInsResp.medicalHouseInfo.kine)]]</p>
                        </template>
                    </template>
                </div>
            </div>

            <vaadin-grid id="insurabilities-list" class="material" overflow="bottom" items="[[curGenInsResp.insurabilities]]" active-item="{{selectedInsurability}}">
                <vaadin-grid-column>
                    <template class="header">
                        <vaadin-grid-sorter path="mut">[[localize('mut','Mut. (Membership Nr)',language)]]
                        </vaadin-grid-sorter>
                    </template>
                    <template>
                        <div class="cell frozen">[[item.mutuality]] ([[item.regNrWithMut]])</div>
                    </template>
                </vaadin-grid-column>
                <vaadin-grid-column>
                    <template class="header">
                        <vaadin-grid-sorter path="periodStart">[[localize('per_sta','Start',language)]]
                        </vaadin-grid-sorter>
                    </template>
                    <template>
                        <div class="cell frozen">[[_dateFormat2(item.period.periodStart,'YYYYMMDD','DD/MM/YYYY')]]</div>
                    </template>
                </vaadin-grid-column>
                <vaadin-grid-column>
                    <template class="header">
                        <vaadin-grid-sorter path="periodEnd">[[localize('per_end','End',language)]]</vaadin-grid-sorter>
                    </template>
                    <template>
                        <div class="cell frozen">[[_dateFormat2(item.period.periodEnd,'YYYYMMDD','DD/MM/YYYY')]]</div>
                    </template>
                </vaadin-grid-column>
                <vaadin-grid-column>
                    <template class="header">
                        <vaadin-grid-sorter path="periodCT12">[[localize('ct12','CT1/2',language)]]</vaadin-grid-sorter>
                    </template>
                    <template>
                        <div class="cell frozen">[[item.ct1]]/[[item.ct2]]</div>
                    </template>
                </vaadin-grid-column>
                <vaadin-grid-column>
                    <template class="header">
                        <vaadin-grid-sorter path="elevated">[[localize('ele','Elevated',language)]]</vaadin-grid-sorter>
                    </template>
                    <template>
                        <div class="cell frozen">[[_isElevated(item.ct1)]]</div>
                    </template>
                </vaadin-grid-column>
                <vaadin-grid-column>
                    <template class="header">
                        <vaadin-grid-sorter path="paymentApproval">[[localize('pay_app','paymentApproval',language)]]
                        </vaadin-grid-sorter>
                    </template>
                    <template>
                        <div class="cell frozen">[[item.paymentApproval]]</div>
                    </template>
                </vaadin-grid-column>
                <vaadin-grid-column>
                    <template class="header">
                        <vaadin-grid-sorter path="insurabilityDate">
                            [[localize('ins_dat','insurabilityDate',language)]]
                        </vaadin-grid-sorter>
                    </template>
                    <template>
                        <div class="cell frozen">[[_dateFormat2(item.insurabilityDate,'YYYYMMDD','DD/MM/YYYY')]]</div>
                    </template>
                </vaadin-grid-column>
            </vaadin-grid>
            <template is="dom-if" if="{{_hasTransfers(curGenInsResp)}}">
                <vaadin-grid id="transfers-list" class="material" overflow="bottom" items="[[curGenInsResp.transfers]]" active-item="{{selectedTransfer}}">
                    <vaadin-grid-column>
                        <template class="header">
                            <vaadin-grid-sorter path="direction">[[localize('tra_dir','Direction',language)]]
                            </vaadin-grid-sorter>
                        </template>
                        <template>
                            <div class="cell frozen">[[localize(item.direction,item.direction,language)]]</div>
                        </template>
                    </vaadin-grid-column>
                    <vaadin-grid-column>
                        <template class="header">
                            <vaadin-grid-sorter path="io">[[localize('tra_io','IO',language)]]</vaadin-grid-sorter>
                        </template>
                        <template>
                            <div class="cell frozen">[[item.io]]</div>
                        </template>
                    </vaadin-grid-column>
                    <vaadin-grid-column>
                        <template class="header">
                            <vaadin-grid-sorter path="date">[[localize('tra_dat','Date',language)]]</vaadin-grid-sorter>
                        </template>
                        <template>
                            <div class="cell frozen">[[_dateFormat2(item.date,'YYYYMMDD','DD/MM/YYYY')]]</div>
                        </template>
                    </vaadin-grid-column>
                </vaadin-grid>
            </template>

            <div class="request-transfert">
                <template is="dom-if" if="{{!hasTokenMH}}">
                    <vaadin-date-picker id="picker" label="[[localize('req_dat','Request date',language)]]" value="{{genInsDateFrom}}" i18n="[[i18n]]"></vaadin-date-picker>
                    <vaadin-checkbox checked="{{genInsHospitalized}}">[[localize('pat_hos','Hospitalized',language)]]
                    </vaadin-checkbox>
                    <paper-button class="action" on-tap="_requestGenins" disabled="[[isLoading]]">
                        [[localize('gen_ins_req','Request',language)]]
                    </paper-button>
                    <ht-spinner active="[[isLoading]]"></ht-spinner>
                </template>
                <template is="dom-if" if="{{hasTokenMH}}">
                    <vaadin-date-picker label="[[localize('req_dat','Request date',language)]]" value="{{genInsDateFrom}}" i18n="[[i18n]]"></vaadin-date-picker>
                    <vaadin-date-picker label="[[localize('endDate','End date',language)]]" value="{{genInsDateTo}}" i18n="[[i18n]]"></vaadin-date-picker>
                    <vaadin-checkbox checked="{{genInsHospitalized}}">[[localize('pat_hos','Hospitalized',language)]]
                    </vaadin-checkbox>
                    <template is="dom-if" if="{{hasToken}}">
                        <paper-button class="action" on-tap="_requestGenins" disabled="[[isLoading]]">
                            [[localize('gen_ins_req','Request',language)]]
                        </paper-button>
                    </template>
                    <paper-button class="action" on-tap="_requestGeninsMMH" disabled="[[isLoading]]">
                        [[localize('gen_ins_req_mmh','Request MMH',language)]]
                    </paper-button>
                    <ht-spinner active="[[isLoading]]"></ht-spinner>

                </template>
                <div class="buttons">
                    <paper-button class="modal-button--cancel" dialog-dismiss="">[[localize('clo','Close',language)]]
                    </paper-button>
                </div>

            </div>

            <!--div class="buttons">
				<vaadin-checkbox id="switchBox" on-checked-changed="_switchTest" checked="{{showGeninsTest}}" id="testgenins">[[localize('tst','Test',language)]]</vaadin-checkbox>
			</div>
			<div id="geninstest" style="display: none">
				<paper-input id="genInsNiss" label="[[localize('niss','NISS',language)]]" value="{{genInsNiss}}"></paper-input>
				<paper-input id="genInsOA" label="[[localize('OA','Mut',language)]]" value="{{genInsOA}}"></paper-input>
				<paper-input id="genInsAFF" label="[[localize('AFF','Membership Nr',language)]]" value="{{genInsAFF}}"></paper-input>
			</div-->
        </paper-dialog>

        <paper-dialog id="consentDialog">
            <h2 class="modal-title">[[localize('cons_req','Patient informed consent',language)]]</h2>
            <div class="content">
                <template is="dom-if" if="{{!patientConsent.consent}}">
                    <div id="legaltext"></div>
                </template>
                <paper-input id="idCardNo" label="[[localize('eid_no','eID Card Number',language)]]" value="{{eidCardNumber}}"></paper-input>
                <paper-input id="isiCardNo" label="[[localize('isi_no','ISI+ Card Number',language)]]" value="{{isiCardNumber}}"></paper-input>
                <!--<paper-button on-tap="_getConsent">[[localize('get_cons','Get consent',language)]]</paper-button>-->
            </div>
            <div class="buttons">
                <paper-button class="modal-button--cancel" dialog-confirm="" autofocus="">
                    [[localize('can','Cancel',language)]]
                </paper-button>
                <template is="dom-if" if="{{patientConsent.consent}}">
                    <paper-button class="modal-button modal-button--save" on-tap="_revokeConsent" dialog-confirm="">
                        [[localize('revoke_cons','Revoke consent',language)]]
                    </paper-button>
                </template>
                <template is="dom-if" if="{{!patientConsent.consent}}">
                    <paper-button class="modal-button modal-button--save" on-tap="_registerNationalAndHubConsent" dialog-confirm="">[[localize('register_cons','Register consent',language)]]
                    </paper-button>
                </template>
            </div>
        </paper-dialog>

        <paper-dialog id="therLinkDialog">
            <h2 class="modal-title">[[localize('tl_req','Therapeutic Link',language)]]</h2>
            <div id="legaltextTL"></div>
            <div class="ther-container">
                <template is="dom-if" if="[[!haveTherLinks]]">
                    <paper-icon-button icon="vaadin:health-card" id="read-eid" class="eid" on-tap="_readEid"></paper-icon-button>
                    <paper-input id="idCardNo" label="[[localize('eid_no','eID Card Number',language)]]" value="{{eidCardNumber}}"></paper-input>
                    <paper-input id="isiCardNo" label="[[localize('isi_no','ISI+ Card Number',language)]]" value="{{isiCardNumber}}"></paper-input>
                </template>
                <vaadin-grid id="ther-link-list" class="material" overflow="bottom" items="[[currentTherLinks]]" active-item="{{selectedTherLink}}">
                    <vaadin-grid-column width="120px">
                        <template class="header">
                            <vaadin-grid-sorter path="description">[[localize('hcp_ident','Hcp',language)]]
                            </vaadin-grid-sorter>
                        </template>
                        <template>
                            <div class="cell frozen">[[_hcpIdent(item)]]</div>
                        </template>
                    </vaadin-grid-column>
                    <vaadin-grid-column width="120px">
                        <template class="header">[[localize('pat_ident','Patient',language)]]</template>
                        <template>#genInsDialog .request-transfert
                            <div class="cell frozen">[[_patIdent(item)]]</div>
                        </template>
                    </vaadin-grid-column>
                    <vaadin-grid-column width="80px">
                        <template class="header">[[localize('sta_dat','Start Date',language)]]</template>
                        <template>
                            <div class="cell frozen">[[_startDate(item)]]</div>
                        </template>
                    </vaadin-grid-column>
                    <vaadin-grid-column width="80px">
                        <template class="header">[[localize('end_dat','End Date',language)]]</template>
                        <template>
                            <div class="cell frozen">[[_endDate(item)]]</div>
                        </template>
                    </vaadin-grid-column>
                    <vaadin-grid-column width="80px">
                        <template class="header">[[localize('tl_type','Type',language)]]</template>
                        <template>
                            <div class="cell frozen">[[_tlType(item)]]</div>
                        </template>
                    </vaadin-grid-column>
                    <vaadin-grid-column width="80px">
                        <template class="header">[[localize('status','Status',language)]]</template>
                        <template>
                            <div class="cell frozen">[[_tlStatus(item)]]</div>
                        </template>
                    </vaadin-grid-column>
                </vaadin-grid>
            </div>
            <!--<paper-button on-tap="_getTherLinks">[[localize('get_TL','Get Therapeutic link',language)]]</paper-button>-->
            <div class="buttons">
                <paper-button class="modal-button--cancel" dialog-confirm="" autofocus="">
                    [[localize('can','Cancel',language)]]
                </paper-button>
                <paper-button class="modal-button--save" on-tap="_revokeTherLink" hidden="[[!haveTherLinks]]" dialog-confirm="">[[localize('revoke_tl','Revoke Therapeutic Link',language)]]
                </paper-button>
                <paper-button class="modal-button--save" enabled="false" on-tap="_registerNationalAndHubTherLink" hidden="[[haveTherLinks]]" dialog-confirm="">[[localize('reg_tl','Register Therapeutic
                    Link',language)]]
                </paper-button>
            </div>
        </paper-dialog>

        <paper-dialog id="select-more-options-dialog">
            <label><b>[[localize("slctBtw2Date","Select between 2 dates",language)]]</b></label>
            <div class="horizontal">
                <vaadin-date-picker label="[[localize('startDate','Start date',language)]]" i18n="[[i18n]]" value="{{dateStartAsString}}"></vaadin-date-picker>
                <vaadin-date-picker label="[[localize('endDate','End date',language)]]" i18n="[[i18n]]" value="{{dateEndAsString}}"></vaadin-date-picker>
            </div>
            <div class="horizontal">
                <label style="display:flex;"><b>[[localize('sta','Status',language)]]</b></label>
                <paper-radio-group selected="{{statutFilter}}">
                    <paper-radio-button name="all">[[localize('all','All',language)]]</paper-radio-button>
                    <paper-radio-button name="active-relevant">[[localize('act_rel','Active relevant',language)]]
                    </paper-radio-button>
                    <paper-radio-button name="active-irrelevant">[[localize('act_irr','Active irrelevant',language)]]
                    </paper-radio-button>
                    <paper-radio-button name="inactive">[[localize('ina','Inactive',language)]]</paper-radio-button>
                    <paper-radio-button name="archived">[[localize('archiv','Archived',language)]]</paper-radio-button>
                </paper-radio-group>
            </div>
            <div class="buttons">
                <paper-button class="modal-button--cancel" dialog-dismiss="">[[localize('clo','Close',language)]]
                </paper-button>
            </div>
        </paper-dialog>
        <ht-pat-list-plan-dialog id="listActions" api="[[api]]" user="[[user]]" resources="[[resources]]" language="[[language]]" i18n="[[i18n]]" contacts="[[contacts]]" on-open-action="openActionDialog"></ht-pat-list-plan-dialog>
        <ht-pat-action-plan-dialog id="planActionForm" api="[[api]]" user="[[user]]" resources="[[resources]]" language="[[language]]" i18n="[[i18n]]" linkables="[[_concat(activeHealthElements, allergies, risks, inactiveHealthElements, familyrisks)]]" current-contact="[[currentContact]]" on-create-service="_createService" on-update-service="_updateServices" readonly="false"></ht-pat-action-plan-dialog>
        <ht-pat-vaccine-history-dialog id="vaccineHistory" api="[[api]]" user="[[user]]" resources="[[resources]]" language="[[language]]" i18n="[[i18n]]" contacts="[[contacts]]"></ht-pat-vaccine-history-dialog>
        <medication-selection-dialog id="medication-selection" api="[[api]]" i18n="[[i18n]]" language="[[language]]" medications="[[medications]]" resources="[[resources]]" selected-medication-content-with-id="{{selectedMedicationContentWithId}}" on-value-changed="_medicationValueChanged" on-display-medication-details="_displayMedicationDetails" on-new-medication="_medicationCreated"></medication-selection-dialog>
        <medications-selection-dialog id="medications-selection" api="[[api]]" user="[[user]]" patient="[[patient]]" i18n="[[i18n]]" language="[[language]]" medications="[[medications]]" resources="[[resources]]" selected-medication-content-with-id="{{selectedMedicationContentWithId}}" on-value-changed="_medicationValueChanged" on-display-medication-details="_displayMedicationDetails" on-new-medications="_medicationsCreated"></medications-selection-dialog>
        <medication-details-dialog id="medication-detail" api="[[api]]" i18n="[[i18n]]" language="[[language]]" resources="[[resources]]" selected-medication-content-with-id="{{selectedMedicationContentWithId}}" on-value-changed="_medicationDetailValueChanged"></medication-details-dialog>
        <medication-plan-dialog id="medication-plan" api="[[api]]" i18n="[[i18n]]" language="[[language]]" resources="[[resources]]" medications="[[medications]]" user="[[user]]" patient="[[patient]]"></medication-plan-dialog>
        <!--<ht-pat-mcn-chapteriv-agreement id="chapterivdialog" api="[[api]]" user="[[user]]" patient="[[patient]]" i18n="[[i18n]]" language="[[language]]" resources="[[resources]]" medications="[[medications]]" on-create-service="_createService" on-update-services="_updateServices"></ht-pat-mcn-chapteriv-agreement>-->
        <ht-pat-edmg-dialog id="edmgDialog" api="[[api]]" user="[[user]]" language="[[language]]" patient="[[patient]]" i18n="[[i18n]]" current-contact="[[currentContact]]" resources="[[resources]]"></ht-pat-edmg-dialog>
        <!--<ht-pat-hub-transaction-view id="transactionViewDialog" api="[[api]]" user="[[user]]" language="[[language]]" patient="[[patient]]" i18n="[[i18n]]" current-contact="[[currentContact]]" i18n="[[i18n]]" resources="[[resources]]"></ht-pat-hub-transaction-view>-->
        <ht-pat-hub-dialog id="patHubDialog" api="[[api]]" user="[[user]]" language="[[language]]" patient="[[patient]]" i18n="[[i18n]]" current-contact="[[currentContact]]" resources="[[resources]]"></ht-pat-hub-dialog>
`;
  }

  static get is() {
      return 'ht-pat-detail';
  }

  static get properties() {
      return {
          api: {
              type: Object
          },
          user: {
              type: Object
          },
          patient: {
              type: Object,
              notify: true
          },
          patientInsurance: {
              type: Object,
              value: function () {
                  return {};
              }
          },
          patientInsurability: {
              type: Object,
              value: function () {
                  return {};
              }
          },
          patientConsent: {
              type: Object,
              value: function () {
                  return {};
              }
          },
          eidCardNumber: {
              type: String,
              value: '',
          },
          isiCardNumber: {
              type: String,
              value: '',
          },
          hubEndPoint: {
              type: String,
              value: 'https://acchub.reseausantewallon.be/HubServices/IntraHub/V3/IntraHub.asmx'
          },
          hubPackageId: {
              type: String,
              value: null
          },
          hubApplication: {
              type: String,
              value: null
          },
          hubSupportsConsent: {
              type: Boolean,
              value: false
          },
          hcpZip: {
              type: String,
              value: '1000'
          },
          curGenInsResp: {
              type: Object,
              value: null
          },
          genInsDateFrom: {
              type: Number,
              value: null
          },
          genInsDateTo: {
              type: Number,
              value: null
          },
          genInsNiss: {
              type: String,
              value: null
          },
          genInsOA: {
              type: String,
              value: null
          },
          genInsAFF: {
              type: String,
              value: null
          },
          genInsHospitalized: {
              type: Boolean,
              value: false
          },
          genInsDateStartAsString: {
              type: Number,
              value: null
          },
          hasToken: {
              type: Boolean,
              value: false
          },
          hasTokenMH: {
              type: Boolean,
              value: false
          },
          selectedTransaction: {
              type: Object
          },
          selectedAdminOrCompleteFileIndex: {
              type: Object,
              observer: 'selectedAdminFileChanged',
              value: null
          },
          selectedHealthcareElements: {
              type: Array,
              value: function () {
                  return [];
              }
          },
          selectedFamily: {
              type: Array,
              value: function () {
                  return [];
              }

          },
          events: {
              type: Array,
              value: function () {
                  return [];
              }

          },
          selectedRisks: {
              type: Array,
              value: function () {
                  return [];
              }

          },
          selectedAllergies: {
              type: Array,
              value: function () {
                  return [];
              }

          },
          selectedLocalize: {
              type: Array,
              value: function () {
                  return [];
              }
          },
          selected: {
              type: Boolean,
              value: false
          },
          showFiltersPanel: {
              type: Boolean,
              value: false
          },
          currentContact: {
              type: Object,
              value: null
          },
          contactSearchString: {
              type: String,
              value: null
          },
          showDetailsFiltersPanel: {
              type: Boolean,
              value: false
          },
          isLatestYear: {
              type: Boolean,
              value: false
          },
          selectedContactIds: {
              type: Array,
              value: function () {
                  return [];
              }
          },
          itemSelected: {
              type: Boolean,
              value: false
          },
          currentTherLinks: {
              type: Array,
              observer: 'currentTherLinksChanged',
              value: function () {
                  return [];
              }
          },
          haveTherLinks: {
              type: Boolean,
              value: false
          },
          selectedTherLink: {
              type: Object,
              value: null
          },
          secondPanelItems: {
              type: Array,
              value: function () {
                  return [{
                      icon: "icure-svg-icons:laboratory",
                      filter: [{type: 'CD-TRANSACTION', code: ['labresult']}],
                      title: {en: "Lab Results", fr: "Résultats de laboratoire", nl: "Lab Results"},
                      id: "LabResults"
                  },
                      {
                          icon: "icure-svg-icons:imaging",
                          filter: [{type: 'CD-TRANSACTION', code: ['result']}, {
                              type: 'CD-HCPARTY',
                              code: ['deptradiology']
                          }],
                          title: {en: "Imaging", fr: "Imagerie", nl: "Imaging"},
                          id: "Imaging"
                      },
                      {
                          icon: "icure-svg-icons:stethoscope",
                          filter: [{type: 'CD-ENCOUNTER', code: ['consultation']}],
                          title: {en: "Consultation", fr: "Consultation", nl: "Consultation"},
                          id: "Consultation"
                      },
                      {
                          icon: "editor:insert-drive-file",
                          filter: [{type: 'CD-TRANSACTION', code: ['contactreport']}],
                          title: {en: "Protocol", fr: "Protocole", nl: "Protocol"},
                          id: "Protocol"
                      },
                      {
                          icon: "icure-svg-icons:prescription",
                          filter: [{type: 'CD-ITEM', code: ['treatment']}],
                          title: {en: "Prescription", fr: "Prescription", nl: "Prescription"},
                          id: "Prescription"
                      }];
              }
          },
          i18n: {
              Type: Object,
              value() {
                  //const mym = moment
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
          dateStartAsString: {
              type: String,
              value: null,
              observer: '_selectBetweenTwoDates'
          },
          dateEndAsString: {
              type: String,
              value: null,
              observer: '_selectBetweenTwoDates'
          },
          statutFilter: {
              type: String,
              value: "all",
              observer: 'checkingStatus'
          },
          contactStatutChecked: {
              type: Array,
              value: []
          },
          hiddenSubContactsId: {
              type: Object,
              value: {}
          },
          historyElement: {
              type: Object
          },
          keyPairKeystore: {
              type: Array,
              value: () => []
          },
          MMHKeystoreId: {
              type: String,
              value: null
          },
          MMHPassPhrase: {
              type: String,
              value: null
          },
          MMHTokenId: {
              type: String,
              value: null
          },
          MMHNihii: {
              type: String,
              value: null
          },
          showGeninsTest: {
              type: Boolean,
              value: false
          },
          isLoading: {
              type: Boolean,
              value: false
          },
          currentSelectMedicationEventDetail: {
              type: Object,
              value: () => {
              }
          },
          currentMedicationDetailEventDetail: {
              type: Object,
              value: () => {
              }
          },
          contactTypeList: {
              type: Array,
              value: function () {
                  return [];
              }
          },
          SpinnerActive: {
              type: Boolean,
              value: false
          },
          postitMsg: {
              type: String,
              value: null
          },
          adminTabIndex: {
              type: Number,
              value: 0
          },
          cardData: {
              type: Object,
              value: {},
              observer: "cardDataChanged"
          },
          leftMenuOpen: {
              type: Boolean,
              value: false
          },
          socket: {
              type: Object,
              value: {}
          },
          refPeriods: {
              type: Array,
              value: []
          },
          refreshServicesDescription: {
              type: Number,
              value: 0
          }
      };
  }

  static get observers() {
      return ['patientOpened(patient.id,api,user)', 'postitChanged(postitMsg)', 'patientChanged(api,user,patient)', 'selectedHealthcareElementsSpliced(selectedHealthcareElements.splices)', 'selectedContactIdsChanged(selectedContactIds.*)'];
  }

  constructor() {
      super();
  }

  ready() {
      super.ready();
      this.set("SpinnerActive", true)

      this.api.isElectronAvailable().then(electron => {
          if (electron) {
              this._readEid()
          }
      })
      if (this.patientHealthCarePartiesById == null) {
          Promise.all(
              _.chunk(this.patient.patientHealthCareParties, 100).map(uChunk =>
                  this.api.hcparty().getHealthcareParties(uChunk.map(u => u.healthcarePartyId).filter(id => !!id).join(','))
              )
          ).then(hcps => {
              this.patientHealthCarePartiesById = _.flatMap(hcps).reduce((acc, hcp) => {
                  acc[hcp.id] = hcp
                  return acc
              }, {});
          })
      }

      this.api.code().findPaginatedCodes('be', 'BE-CONTACT-TYPE', '')
          .then(ct => this.set("contactTypeList", _.orderBy(ct.rows, ['code'], ['asc'])))
  }

  wideClass(rev) {
      return this.user && (((this.user.properties.find(p => p.type && p.type.identifier === 'org.taktik.icure.user.wideAspectRatio') || {typedValue: {}}).typedValue.booleanValue || false) ? 'wide' : '')
  }

  _switchTest(e) {
      //this.set('showGeninsTest', !this.showGeninsTest);
      e.stopPropagation();
      let cb = this.root.querySelector('#switchBox');
      const isChecked = cb.checked;
      let testdiv = this.root.querySelector('#geninstest')
      if (isChecked) {
          testdiv.style = '';
      } else {
          testdiv.style = 'display: none';
      }
  }

  selectedContactIdsChanged() {
      const ctcDetailPanel = this.shadowRoot.querySelector('#ctcDetailPanel');
      ctcDetailPanel && ctcDetailPanel.flushSave();

      const allContacts = _.concat(this.currentContact ? [this.currentContact] : [], this.contacts)
      this.set('selectedContacts', this.selectedContactIds.map(i => allContacts.find(c => c && c.id === i.substr(4) /* skip ctc_ */)))
  }

  _myReferralPeriods(refPeriods) {
      return refPeriods && (refPeriods.find(r => r.healthcarePartyId === this.user.healthcarePartyId) || {}).referralPeriods
  }

  _shortId(id) {
      return id && id.substr(0, 8);
  }

  _timeFormat(date) {
      return date ? this.api.moment(date).format(date > 99991231 ? 'DD/MM/YYYY HH:mm' : 'DD/MM/YYYY') : '';
  }

  _ageFormat(date) {
      return date ? this.api.getCurrentAgeFromBirthDate(date, (e, s) => this.localize(e, s, this.language)) : '';
  }

  _dateFormat(date) {
      return date ? this.api.moment(date).format('DD/MM/YYYY') : '';
  }

  _dateFormat2(date, fFrom, fTo) {
      return date ? this.api.moment(date, fFrom).format(fTo) : '';
  }

  _medicationStartDateLabel(med) {
      const medValue = this.api.contact().medicationValue(med)
      return this._shortDateFormat(medValue.beginMoment, med.openingDate)
  }

  _medicationEndDateLabel(med) {
      const medValue = this.api.contact().medicationValue(med)
      return this._shortDateFormat(medValue.endMoment)
  }

  _shortDateFormat(date, altDate) {
      return (date || altDate) && this.api.moment((date || altDate)).format('YY') || '';
  }

  _isElevated(CT) {
      return CT && CT.substring(2) !== '0' ? this._yesOrNo(true) : this._yesOrNo(false);
  }

  _contactClasses(contact, closingDate, author, responsible) {
      return (closingDate || (author !== this.user.id && responsible !== this.user.healthcarePartyId)) ? '' : 'current-contact';
  }

  _openGenInsDialog(e) {
      e.stopPropagation();
      this.set("hasToken", this.api.tokenId);
      this.set("hasTokenMH", this.api.tokenIdMH)
      const mym = moment;
      //this.set('curGenInsResp', null);
      this.set('genInsNiss', null);
      this.set('genInsOA', null);
      this.set('genInsAFF', null);
      this.set('genInsDateFrom', null);
      this.set('genInsDateTo', null);
      this.set('genInsHospitalized', false);
      //TODO: init MMH if possible
      this.$.genInsDialog.open();
      if (!this.curGenInsResp || this.curGenInsResp.inss !== this.cleanNiss(this.patient.ssin)) {
          this.set('curGenInsResp', null);
          this._requestGenins();
      }
  }

  _importGenIns() {
      if (this.curGenInsResp) {
          this.api.queue(this.patient, 'patient').then(([pat, defer]) => {
              this.set('patient.firstName', this.curGenInsResp.firstName);
              this.set('patient.lastName', this.curGenInsResp.lastName);
              this.set('patient.dateOfBirth', this.curGenInsResp.dateOfBirth);
              this.set('patient.gender', this.curGenInsResp.sex);

              this.api.patient().modifyPatientWithUser(this.user, this.patient).catch(e => defer.resolve(this.patient)).then(p => this.api.register(p, 'patient', defer)).then(p => {
                  this.dispatchEvent(new CustomEvent("patient-saved", {bubbles: true, composed: true}))
                  this.root.querySelector('#pat-admin-card').patientChanged();
                  //this.patient && (this.set('patient.rev', p.rev))
              })
          })
      }
  }

  _openConsentDialog(e) {
      e.stopPropagation();
      var legaltext = this.root.querySelector('#legaltext')
      if (legaltext != null) {
          legaltext.innerHTML = this.localize('cons_legal', 'Informed consent legal text ...', this.language)
      }
      this.$.consentDialog.open();
  }

  _openTherLinkDialog(e) {
      e.stopPropagation();
      this.selectedTherLink = null;
      this._getTherLinks();

      if (Object.keys(this.cardData).length && this.patient.ssin === this.cardData.nationalNumber) {
          this.set("eidCardNumber", this.cardData.logicalNumber)
      }

      //this.root.querySelector('#legaltext').innerHTML = this.localize('cons_legal', 'Informed consent legal text ...', this.language)
      this.$.therLinkDialog.open();
  }

  _openHubDialog(e) {
      e.stopPropagation();
      this.$.patHubDialog.open();
  }

  _openEdmgDialog(e) {
      e.stopPropagation();

      this.$.edmgDialog.open();
  }

  _trueOrUnknown(b) {
      return b ? this.localize('yes', 'yes', this.language) : '?'
  }

  _yesOrNo(b) {
      return b ? this.localize('yes', 'yes', this.language) : this.localize('no', 'no', this.language)
  }

  _formatHospitalizedInfo(hi) {
      let info = '';
      info += hi && hi.hospital ? this.localize('hosp', 'Hospital', this.language) + ':' + hi.hospital + ' ' : ''
      info += hi && hi.admissionDate ? this.localize('adm_dat', 'AdmissionDate', this.language) + ':' + this._dateFormat2(hi.admissionDate, 'YYYYMMDD', 'DD/MM/YYYY') + ' ' : ''
      info += hi && hi.admissionService ? this.localize('adm_svc', 'AdmissionService', this.language) + ':' + hi.admissionService + ' ' : ''
      return info;
  }

  _hasErrors(errs) {
      return errs && errs.length > 0;
      //return true;
  }

  _formatError(error) {
      return "[" + (this.language === 'nl' ? error.locNl : error.locFr) + '] ' + (error.value ? error.value + ' : ' : "") + (this.language === 'nl' ? error.msgNl : error.msgFr);
  }

  _hasTransfers(genins) {
      return genins && genins.transfers && genins.transfers.length > 0;
      //return true;
  }

  _requestGenins() {
      this.getGenIns(false).then(genInsResp => this.set('curGenInsResp', genInsResp));
  }

  _requestGeninsMMH() {
      this.getGenIns(true).then(genInsResp => this.set('curGenInsResp', genInsResp));
  }

  getGenIns(asMMH) {
      console.log("getGenIns(asMMH){")
      //TODO: add switch to get genins as MMH

      const dStart = Date.parse(this.genInsDateFrom);

      if (this.api.tokenId || (this.api.tokenIdMH && asMMH)) {
          this.set('isLoading', true)

          if (((this.genInsNiss && this.genInsNiss !== '') || (this.patient.ssin && this.patient.ssin !== '')) && !(this.genInsOA && this.genInsOA !== '')) {
              return this.api.hcparty().getHealthcareParty(this.user.healthcarePartyId)
                  .then(hcp => {
                          return this.api.fhc().Geninscontroller().getGeneralInsurabilityUsingGET(
                              this.genInsNiss ? this.genInsNiss.trim() : this.cleanNiss(this.patient.ssin),
                              asMMH ? this.api.tokenIdMH : this.api.tokenId, asMMH ? this.api.keystoreIdMH : this.api.keystoreId, asMMH ? this.api.credentials.ehpasswordMH : this.api.credentials.ehpassword,
                              asMMH ? this.api.nihiiMH : hcp.nihii, this.api.isMH ? this.api.MHContactPersonSsin : hcp.ssin, this.api.isMH ? this.api.MHContactPersonName : hcp.lastName + ' ' + hcp.firstName, asMMH ? 'medicalhouse' : 'doctor', dStart, asMMH ? Date.parse(this.genInsDateTo) : null, this.genInsHospitalized)
                      }
                  ).then(genInsResp => {
                          if (genInsResp) {
                              this.set('isLoading', false)
                              return genInsResp;
                          } else {
                              this.set('isLoading', false)
                              return null;
                          }
                      }
                  ).catch(e => {
                      console.log("genins failed " + e.message);
                      this.set('isLoading', false);
                      return null
                  })
          } else {
              //there is no niss
              let oa = this.genInsOA;
              let aff = this.genInsAFF;
              const pi = this.patient.insurabilities && _.assign({}, this.patient.insurabilities[0] || {});
              return this.api.insurance().getInsurance(pi.insuranceId).then(insu => {
                  return this.api.hcparty().getHealthcareParty(this.user.healthcarePartyId)
                      .then(hcp => {
                              return this.api.fhc().Geninscontroller().getGeneralInsurabilityByMembershipUsingGET(
                                  (this.genInsOA && this.genInsOA != '') ? this.genInsOA.trim() : insu.code,
                                  (this.genInsAFF && this.genInsAFF != '') ? this.genInsAFF.trim() : pi.identificationNumber,
                                  asMMH ? this.api.tokenIdMH : this.api.tokenId, asMMH ? this.api.keystoreIdMH : this.api.keystoreId, asMMH ? this.api.credentials.ehpasswordMH : this.api.credentials.ehpassword,
                                  asMMH ? this.api.nihiiMH : hcp.nihii, this.api.isMH ? this.api.MHContactPersonSsin : hcp.ssin, this.api.isMH ? this.api.MHContactPersonName : hcp.lastName + ' ' + hcp.firstName, asMMH ? 'medicalhouse' : 'doctor', dStart, asMMH ? Date.parse(this.genInsDateTo) : null, this.genInsHospitalized)
                          }
                      ).then(genInsResp => {
                          if (genInsResp) {
                              this.set('isLoading', false)
                              return genInsResp;
                          } else {
                              this.set('isLoading', false)
                              return null;
                          }
                      })
              }).catch(e => {
                  console.log("genins failed " + e.message);
                  this.set('isLoading', false);
                  return null
              })
          }
      } else {
          return Promise.resolve(null)
      }
  }

  getNihii8(nihii) {
      return nihii && nihii !== '' && nihii.length >= 8 ? nihii.substring(0, 8) : '';
  }

  getMMHKeystore() {
      const prefix = this.api.crypto().keychainLocalStoreIdPrefix;
      const prefixMMH = this.api.crypto().keychainLocalStoreIdPrefix + "MMH.";
      const healthcarePartyId = this.user.healthcarePartyId;
      const mmhKeystore = localStorage.getItem(prefixMMH + healthcarePartyId) || "";
      const storageKey = prefix + healthcarePartyId;


      return Promise.all(
          Object.keys(localStorage).filter(k => k.includes(storageKey) === true && localStorage.getItem(k) === mmhKeystore)
              .map(fk =>
                  this.getDecryptedValueFromLocalstorage(healthcarePartyId, fk.replace("keychain.", "keychain.password."))
                      .then(password =>
                          (this.keyPairKeystore[fk]) ?
                              // Get fhc keystore UUID in cache
                              new Promise(x => x(({uuid: this.keyPairKeystore[fk], passPhrase: password}))) :
                              // Upload new keystore
                              this.api.fhc().Stscontroller().uploadKeystoreUsingPOST(this.api.crypto().utils.base64toByteArray(localStorage.getItem(fk)))
                                  .then(res => this.addUUIDKeystoresInCache(fk, res.uuid, password))
                      )
              )
      )
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

  addUUIDKeystoresInCache(key, uuid, password) {
      return new Promise(x => {
          this.keyPairKeystore[key] = uuid;
          x(({uuid: uuid, passPhrase: password}))
      })

  }

  _hcpIdent(tl) {
      return tl && tl.therapeuticLink && tl.therapeuticLink.hcParty && tl.therapeuticLink.hcParty.nihii ? tl.therapeuticLink.hcParty.nihii : ''
  }

  _patIdent(tl) {
      return tl && tl.therapeuticLink && tl.therapeuticLink.patient && tl.therapeuticLink.patient.inss ? tl.therapeuticLink.patient.inss : ''
  }

  _startDate(tl) {
      return tl && tl.therapeuticLink && tl.therapeuticLink.startDate ? tl.therapeuticLink.startDate : ''
  }

  _endDate(tl) {
      return tl && tl.therapeuticLink && tl.therapeuticLink.endDate ? tl.therapeuticLink.endDate : ''
  }

  _tlStatus(tl) {
      return tl && tl.therapeuticLink && tl.therapeuticLink.status ? tl.therapeuticLink.status : ''
  }

  _tlType(tl) {
      return tl && tl.therapeuticLink && tl.therapeuticLink.type ? tl.therapeuticLink.type : ''
  }

  _transactionId(tr) {
      this.set('selectedTransaction', tr);
      if (tr) {
          const idLocal = tr.ids.find(id => id.s === "LOCAL");
          if (idLocal) {
              return idLocal.value;
          } else {
              return "--";
          }
      } else {
          return "";
      }
  }

  _transactionType(tr) {
      const cdTransType = tr.cds.find(cd => cd.s === "CD-TRANSACTION");
      if (cdTransType) {
          return cdTransType.value;
      } else {
          return "--";
      }
  }

  _transactionDate(tr) {
      if (tr.date) {
          var d = new Date(0);
          d.setUTCMilliseconds(tr.date);
          return d.toDateString();
      } else {
          return "";
      }
  }

  _transactionAuthor(tr) {
      var authorRes = "--";
      const author = tr.author.hcparties.find(hcp => hcp.familyname);
      if (author) {
          authorRes = author.familyname + ' ' + author.firstname;
      }

      const dept = tr.author.hcparties.find(hcp => hcp.cds.find(cd => cd.s === "CD-HCPARTY"))
      if (dept) {
          const cd = dept.cds.find(cd => cd.s === "CD-HCPARTY")
          authorRes += "/" + cd.value;
      }

      return authorRes;
      // if(tr.author.hcparties[1]){
      //     return tr.author.hcparties[1].familyname + ' ' + tr.author.hcparties[1].firstname;
      // }
      // else {
      //     return "author";
      // }
  }

  _getHubHcpConsent() {
      //getHcpConsentUsingGET(
      // endpoint: string,
      // xFHCKeystoreId: string, xFHCTokenId: string, xFHCPassPhrase: string,
      // hcpNihii: string, hcpLastName: string, hcpFirstName: string, hcpSsin: string, hcpZip: string,
      // hubPackageId?: string): Promise<models.HcPartyConsent | any>;
      if (this.patient.ssin && this.api.tokenId) {
          return this.api.hcparty().getHealthcareParty(this.user.healthcarePartyId)
              .then(hcp =>
                  this.api.fhc().Hubcontroller().getHcpConsentUsingGET(this.hubEndPoint,
                      this.api.keystoreId, this.api.tokenId, this.api.credentials.ehpassword,
                      hcp.nihii, hcp.lastName, hcp.firstName, hcp.ssin, this.hcpZip)
              ).then(consentResp => {
                      if (consentResp) {
                          return consentResp;
                      } else {
                          return null;
                      }
                  }
              )
      } else {
          return Promise.resolve(null)
      }
  }

  currentTherLinksChanged() {
      this.set('haveTherLinks', this.currentTherLinks.length > 0)
  }

  _getTherLinks() {
      if (this.patient.ssin && this.api.tokenId) {
          return this.api.hcparty().getHealthcareParty(this.user.healthcarePartyId)
              .then(hcp =>
                  this.api.fhc().Therlinkcontroller().getAllTherapeuticLinksUsingGET(this.api.keystoreId, this.api.tokenId, this.api.credentials.ehpassword,
                      hcp.nihii, hcp.ssin, hcp.firstName, hcp.lastName,
                      this.cleanNiss(this.patient.ssin), this.patient.firstName, this.patient.lastName, this.eidCardNumber, this.isiCardNumber,
                      null, null, null, null) //returns Array of therapeuticLink
              ).then(therLinkResp => {
                      if (therLinkResp) {
                          this.set('currentTherLinks', therLinkResp);
                          return therLinkResp;
                      } else {
                          return null;
                      }
                  }
              )
      } else {
          return Promise.resolve(null)
      }
  }

  _registerNationalAndHubTherLink() {
      this._registerTherLink().then(resp => this.showPatientTherLinkState()).catch(error => console.log(error));
      this.$.patHubDialog._registerHubPatientTherapeuticLink().then().catch(error => console.log(error));
  }

  _registerTherLink() {
      if (this.patient.ssin && this.api.tokenId) {
          return this.api.hcparty().getHealthcareParty(this.user.healthcarePartyId).then(hcp =>
              this.api.fhc().Therlinkcontroller().registerTherapeuticLinkUsingPOST1(this.api.keystoreId, this.api.tokenId, this.api.credentials.ehpassword,
                  hcp.nihii, hcp.ssin, hcp.firstName, hcp.lastName,
                  this.cleanNiss(this.patient.ssin), this.patient.firstName, this.patient.lastName, this.eidCardNumber, this.isiCardNumber, null, null, null, null, null)
          ).then(therLinkResp => {
                  if (therLinkResp.therapeuticLink) {
                      this.showPatientTherLinkState()
                      return (therLinkResp.therapeuticLink)
                  } else {
                      return Promise.resolve(null)
                  }
              }
          )
      } else {
          return Promise.resolve(null)
      }
  }

  _revokeTherLink() {
      if (this.patient.ssin && this.api.tokenId && this.selectedTherLink) {
          this.api.hcparty().getHealthcareParty(this.user.healthcarePartyId).then(hcp => {
              this.api.fhc().Therlinkcontroller().revokeLinkUsingPOST1(this.api.keystoreId, this.api.tokenId, this.api.credentials.ehpassword,
                  this.selectedTherLink.therapeuticLink, null)
          }).then(consentResp => {
                  this.showPatientTherLinkState()
                  return consentResp
              }
          )
      } else {
          return Promise.resolve(null)
      }
  }

  _getConsent() {
      if (this.patient.ssin && this.api.tokenId) {
          return this.api.hcparty().getHealthcareParty(this.user.healthcarePartyId)
              .then(hcp =>
                  this.api.fhc().Consentcontroller().getPatientConsentUsingGET(this.api.keystoreId, this.api.tokenId, this.api.credentials.ehpassword,
                      hcp.nihii, hcp.ssin, hcp.firstName, hcp.lastName,
                      this.patient.ssin, this.patient.firstName, this.patient.lastName)
              ).then(consentResp => {
                      this.set('patientConsent', consentResp);
                      if (consentResp.consent) {
                          return consentResp.consent;
                      } else {
                          return null;
                      }
                  }
              )
      } else {
          return Promise.resolve(null)
      }
  }

  _revokeConsent() {
      if (this.patient.ssin && this.api.tokenId) {
          this.api.hcparty().getHealthcareParty(this.user.healthcarePartyId).then(hcp =>
              this._getConsent().then(patientConsent => {
                      if (patientConsent) {
                          this.api.fhc().Consentcontroller().revokePatientConsentUsingPOST(this.api.keystoreId, this.api.tokenId, this.api.credentials.ehpassword,
                              hcp.nihii, hcp.ssin, hcp.firstName, hcp.lastName,
                              patientConsent, this.eidCardNumber, this.isiCardNumber).then(consentResp => {
                                  this.showPatientConsentState()
                                  return consentResp
                              }
                          )
                      } else {
                          return Promise.resolve(null)
                      }
                  }
              )
          )
      } else {
          return Promise.resolve(null)
      }
  }

  _registerNationalAndHubConsent() {
      this._registerConsent().then(resp => this.showPatientConsentState()).catch(error => console.log(error));
      this.$.patHubDialog._registerHubPatientConsent().then().catch(error => console.log(error));
  }

  _registerConsent() {
      if (this.patient.ssin && this.api.tokenId) {
          return this.api.hcparty().getHealthcareParty(this.user.healthcarePartyId).then(hcp =>
              this.api.fhc().Consentcontroller().registerPatientConsentUsingPOST(this.api.keystoreId, this.api.tokenId, this.api.credentials.ehpassword,
                  hcp.nihii, hcp.ssin, hcp.firstName, hcp.lastName,
                  this.cleanNiss(this.patient.ssin), this.patient.firstName, this.patient.lastName, this.eidCardNumber, this.isiCardNumber)
          ).then(consentResp => {
                  if (consentResp.consent) {
                      return (consentResp.consent)
                  } else {
                      return Promise.resolve(null)
                  }
              }
          )
      } else {
          return Promise.resolve(null)
      }
  }

  _toggleActionButton(e) {
      e.stopPropagation();
      e.preventDefault();

      let parentElement = e.target.parentElement;
      if (parentElement.classList.contains('open')) {
          const svcId = e.target.id.substr("event-btn-done_".length);
          const svc = this.get('events').find(s => s.id === svcId);

          this._planAction(svc)
      } else {
          parentElement.classList.add('open');
          setTimeout(() => parentElement.classList.remove('open'), 6000);
      }
  }

  _generateSumehr() {
      if (this.patient) {
          this.api.hcparty().getHealthcareParty(this.user.healthcarePartyId).then(hcp =>
              this.api.patient().getPatientWithUser(this.user, this.patient.id)
                  .then(patientDto => {
                      this.api.crypto()
                          .extractDelegationsSFKs(patientDto, this.user.healthcarePartyId)
                          .then(secretForeignKeys => {
                              this.api.bekmehr().generateSumehrExportWithEncryptionSupport(patientDto.id, this.user.healthcarePartyId, "fr", {
                                  secretForeignKeys: secretForeignKeys.extractedKeys,
                                  recipient: hcp,
                                  comment: "mycomment"
                              }).then(output => {
                                  //creation of the xml file
                                  var file = typeof output === "string" ? new Blob([output], {type: "application/xml"}) : output

                                  //creation the downloading link
                                  var a = document.createElement("a");
                                  document.body.appendChild(a);
                                  a.style = "display: none";

                                  //download the new file
                                  var url = window.URL.createObjectURL(file);
                                  a.href = url;
                                  a.download = (patientDto.lastName || "Doe").replace(" ", "_") + "_" + (patientDto.firstName || "John").replace(" ", "_") + "_" + (moment().format("x")) + "_sumehr.xml";
                                  a.click();
                                  window.URL.revokeObjectURL(url);

                                  document.body.removeChild(a);
                              }).catch(error => console.log(error))
                          })
                  }))
      }
  }

  clearEvent(el) {
      const svcId = el.target.id.substr("event-btn-done_".length);
      const svc = this.get('events').find(s => s.id === svcId);

      const t = svc.tags.find(t => t.type === 'CD-LIFECYCLE');
      if (t) {
          t.code = 'aborted';
          if (!this.currentContact) {
              return;
          }
          this.saveNewService(svc).then(c => this.filterEvents());
      }
  }

  completeEvent(el) {
      const svcId = el.target.id.substr("event-btn-close_".length);
      const svc = this.get('events').find(s => s.id === svcId);

      const t = svc.tags.find(t => t.type === 'CD-LIFECYCLE');
      if (t) {
          t.code = 'completed';
          if (!this.currentContact) {
              return;
          }
          this.saveNewService(svc).then(c => this.filterEvents());
      }
  }

  _planAction(svc) {
      this.$.planActionForm.open(svc)
  }

  _createService(e) {
      if (!this.currentContact) {
          return;
      }
      const hes = e.detail.hes || []
      const allContacts = (this.currentContact ? [this.currentContact] : []).concat(this.contacts)
      Promise.all(hes.map(he => he.id ? Promise.resolve(he) : this.contact().promoteServiceToHealthElement(he))).then(hes =>
          this.api.contact().promoteServiceInContact(this.currentContact, this.user, allContacts, this.api.contact().service().newInstance(this.user, e.detail.service), null, [], hes.map(he => he.id))
      ).then(() => this.saveContact(this.currentContact))
  }

  _updateServices(e) {
      if (!this.currentContact) {
          return;
      }
      const allContacts = (this.currentContact ? [this.currentContact] : []).concat(this.contacts)
      const services = (e.detail.services || (e.detail.service && [e.detail.service]) || [])
      services.forEach(svc => this.api.contact().promoteServiceInContact(this.currentContact, this.user, allContacts, svc, null, {}, [], e.detail.function || undefined))
      this.saveContact(this.currentContact)
  }

  saveNewService(svc) {
      svc.modified = +new Date();
      if (!svc.id) {
          svc.id = this.api.crypto().randomUuid();
      }
      if (!svc.valueDate) {
          svc.valueDate = parseInt(moment().format('YYYYMMDDHHmmss'));
      }
      if (!svc.openingDate) {
          svc.openingDate = svc.valueDate;
      }
      if (!svc.created) {
          svc.created = svc.modified;
      }
      const ctc = this.api.contact().contactOfService(this.get('contacts'), svc.id) || this.currentContact;
      let sc = this.currentContact.subContacts.find(sc => sc.services.find(sId => svc.id));
      if (!sc) {
          sc = ctc.subContacts.find(sc => sc.services.find(sId => svc.id)) || {};
          this.currentContact.subContacts.push(sc = {
              formId: sc.formId,
              planOfActionId: sc.planOfActionId,
              healthElementId: sc.healthElementId,
              services: []
          });
          sc.services.push({serviceId: svc.id});
      }
      const oldSvcIdx = this.currentContact.services.findIndex(s => s.id === svc.id);
      if (oldSvcIdx > -1) {
          this.currentContact.services.splice(oldSvcIdx, 1);
      }
      this.currentContact.services.push(svc);
      return this.saveCurrentContact();
  }

  _patientSaved() {
      setTimeout(() => this.$.savedIndicator.classList.remove("saved"), 2000);
      this.$.savedIndicator.classList.add("saved");
  }

  saveContact(ctc, preSave, postSave, postError) {
      return (preSave ? preSave() : Promise.resolve()).catch(e => console.log(e)).then(() => (ctc.rev ? this.api.contact().modifyContactWithUser(this.user, ctc) : this.api.contact().createContactWithUser(this.user, ctc))).then(c => {
          console.log('Registering ...', c)
          return this.api.register(c, 'contact')
      }).then(c => {
          ctc.rev = c.rev;
          console.log("contact saved: " + ctc.id + ":" + ctc.rev);

          setTimeout(() => this.$.savedIndicator.classList.remove("saved"), 2000);
          this.$.savedIndicator.classList.add("saved");
          this._refreshFromServices()

          postSave && postSave(c)
          return c;
      }).catch(e => {
          postError && postError(e)
          throw e
      })
  }

  saveCurrentContact() {
      return this.saveContact(this.currentContact);
  }

  _saveContact(event) {
      this.saveContact(event.detail.contact, event.detail.preSave, event.detail.postSave, event.detail.postError);
  }

  filterEvents() {
      const filteredEvents = this.api.contact().filteredServices(this.contacts, s => s.tags.some(t => t.type === 'CD-LIFECYCLE')).filter(s => s.tags.some(t => t.type === 'CD-LIFECYCLE' && (t.code === 'planned' || t.code === 'pending')))
      this.set('events', _.sortBy(filteredEvents, it => this.api.moment(it.valueDate)));
  }

  _lateEventCssClass(e) {
      return this.api.moment(e.valueDate).isBefore(moment()) ? 'todo-item--late' : '';
  }

  _isLatestYearContact(contactYear, contactYears) {
      if (!contactYear || !contactYears || !contactYears.length) {
          return "contact--small"
      }
      if (contactYear.year === contactYears[Object.keys(contactYears)[0]].year) {
          this.isLatestYear = true;
          return "contact--big";
      } else {
          this.isLatestYear = false;
          return "contact--small";
      }
  }

  openToast() {
      const fitbottom = this.root.querySelector('#selectionToast') || null
      if (fitbottom) {
          fitbottom.classList.add('open')
          setTimeout(() => fitbottom.classList.remove('open'), 10000)
      }
  }

  toggleFiltersPanel() {
      this.showFiltersPanel = !this.showFiltersPanel;
      this.root.querySelector('#filtersPanel').classList.toggle('filters-panel--collapsed');
  }

  selectedItemsSubmenu(list, selectedItems) {
      if (!selectedItems || selectedItems.length === 0) {
          return 'icons:check-box-outline-blank';
      } else if (selectedItems.length < list.length) {
          return 'icons:indeterminate-check-box';
      } else {
          return 'icons:check-box';
      }
  }

  checkedUncheckedIcon(item, selectedItems) {
      if (selectedItems && selectedItems.find(i => i && i.id && i.id.endsWith(item.id))) {
          return 'icons:check-box';
      } else {
          return 'icons:check-box-outline-blank';
      }
  }

  patientOpened(patientId, api, user) {
      if (api && user && patientId && patientId !== this.latestPatientId) {
          this.api.unregisterAll('contact')
          console.log('patientOpened', patientId, api, user)

          this.latestPatientId = patientId;
          this.api.accesslog().createAccessLog(new AccessLogDto({
              id: this.api.crypto().randomUuid(),
              patientId: patientId,
              user: user.id,
              date: +new Date(),
              accessType: 'USER_ACCESS'
          }));
      } else if (api && user) {
          this.api.unregisterAll('contact')
      }
  }

  patientChanged(api, user, patient) {
      this.set('curGenInsResp', null);
      this.set("SpinnerActive", true)
      this.set('healthTopics', [])

      this.set('healthElements', [])

      this.set('activeHealthElements', [])
      this.set('inactiveHealthElements', [])
      this.set('archivedHealthElements', [])
      this.set('allergies', [])
      this.set('risks', [])
      this.set('familyrisks', [])
      this.set('surgicalHealthElements', [])
      this.set('eidCardNumber', '')
      this.set('isiCardNumber', '')

      this.root.querySelector('#cb_ahelb').opened = false
      this.root.querySelector('#cb_ihelb').opened = false
      this.root.querySelector('#cb_alhelb').opened = false
      this.root.querySelector('#cb_rhelb').opened = false
      this.root.querySelector('#cb_gmhelb').opened = false
      this.root.querySelector('#cb_archhelb').opened = false
      this.root.querySelector('#cb_ishelb').opened = false
      this.root.querySelector('#cb_frhelb').opened = false

      this.root.querySelector('#medication-plan').reset()


      this.set('selectedHealthcareElements', [])
      this.set('contacts', [])
      this.set('contactYears', [])
      this.set('selectedContactIds', [])

      this.set('currentContact', null)

      this.set('adminTabIndex', 0);
      if (this.api && this.user && this.patient) {
          this.refreshPatient()
      }

      let cfp = this.root.querySelector("#contactFilterPanel");
      cfp && cfp.reset();
      this.set('refPeriods', patient && this._myReferralPeriods(patient.patientHealthCareParties) || [])
  }


  _makeHeFromSvc(svc) {
      return {
          created: svc.created,
          modified: svc.modified,
          endOfLife: svc.endOfLife,
          author: svc.author,
          responsible: svc.responsible,
          codes: svc.codes,
          tags: svc.tags,
          valueDate: svc.valueDate,
          openingDate: svc.openingDate,
          closingDate: svc.closingDate,
          descr: this.shortServiceDescription(svc, this.language),
          idService: svc.id,
          status: svc.status,
          svc: svc,
          plansOfAction: []
      }
  }

  _refreshFromServices() {
      const firstJanuary2018 = moment("2018-01-01")
      if (this.currentContact) {
          const combinedHes = (this.activeHealthElements || []).concat(this.inactiveHealthElements || []).concat(this.archivedHealthElements || []).concat(this.allergies || []).concat(this.risks || []).concat(this.familyrisks || []).concat(this.surgicalHealthElements || [])
          const idServicesInHes = combinedHes.map(he => he.idService)

          const hesAsServices = this.currentContact.services.filter(s => s.tags.find(c => c.type === 'CD-ITEM' && ['healthcareelement', 'healthissue', 'familyrisk', 'risk', 'socialrisk', 'allergy'].includes(c.code)) && !idServicesInHes.includes(s.id))
          const svcHes = hesAsServices.map(svc => this._makeHeFromSvc(svc))

          const now = moment()

          this.set('activeHealthElements', (this.activeHealthElements || []).concat(svcHes).filter(it => (!it.closingDate || (it.closingDate && this.api.moment(it.closingDate).isSameOrAfter(now))) && (it.status & 1) === 0 && ((it.status & 2) === 0 || (it.openingDate && this.api.moment(it.openingDate).isSameOrAfter(firstJanuary2018))) && it.tags.find(c => c.type === 'CD-ITEM' && (c.code === 'healthissue' || c.code === 'healthcareelement'))))
          this.set('inactiveHealthElements', (this.inactiveHealthElements || []).concat(svcHes).filter(it => ((it.closingDate && this.api.moment(it.closingDate).isBefore(now)) || (it.status & 1) === 1) && (it.status & 2) === 0 && it.tags.find(c => c.type === 'CD-ITEM' && (c.code === 'healthissue' || c.code === 'healthcareelement'))))
          this.set('archivedHealthElements', (this.archivedHealthElements || []).concat(svcHes).filter(it => (it.status & 2) === 2))
          this.set('allergies', (this.allergies || []).concat(svcHes).filter(it => (it.status & 2) === 0 && it.tags.find(c => c.type === 'CD-ITEM' && c.code === 'allergy')))
          this.set('risks', (this.risks || []).concat(svcHes).filter(it => (it.status & 2) === 0 && it.tags.find(c => c.type === 'CD-ITEM' && (c.code === 'risk' || c.code === 'socialrisk'))))
          this.set('familyrisks', (this.familyrisks || []).concat(svcHes).filter(it => (it.status & 2) === 0 && it.tags.find(c => c.type === 'CD-ITEM' && c.code === 'familyrisk')))
          this.set('surgicalHealthElements', (this.surgicalHealthElements || []).concat(svcHes).filter(it => (it.status & 2) === 0 && it.tags.find(c => c.type === 'CD-ITEM' && c.code === 'surgery')))
          this.filterEvents()
      }
  }

  refreshPatient() {
      const patient = this.patient

      const now = moment()

      const currentlySelectedContactsIds = (this.selectedContactIds || []).map(id => id && id.substr(4) /* format is ctc_... see DOM */)
      this.set('postitMsg', this.patient.note)
      //console.log("Before load "+(+new Date() - start))
      Promise.all([this.api.contact().findBy(this.user.healthcarePartyId, patient).then(ctcs => ctcs.map(ctc => this.api.register(ctc, 'contact'))), this.api.helement().findBy(this.user.healthcarePartyId, patient, true)]).then(([ctcs, allHes]) => {
          //console.log("After load "+(+new Date() - start))

          const hesByHeId = {}
          allHes.forEach(he => {
              if (he.healthElementId) {
                  ;(hesByHeId[he.healthElementId] || (hesByHeId[he.healthElementId] = [])).push(he)
              }
          })
          _.values(hesByHeId).forEach(a => a.sort((he1, he2) => (he2.modified || 0) - (he1.modified || 0)))
          const hes = _.values(hesByHeId).map(a => a[0]).filter((s) => s && !s.endOfLife)

          ctcs.sort((a, b) => (a.created || 0) - (b.created || 0))
          const sorter = x => [
              ((x.codes || []).find(c => c.type === 'ICPC' || c.type === 'ICPC2') || {}).code || "\uff0f",
              -(x.valueDate || x.openingDate || 0),
              -(x.closingDate || 0)
          ]
          const idServicesInHes = _.compact(hes.map(he => he.idService))
          //console.log("Before filter service "+(+new Date() - start))
          this.api.contact().filterServices(ctcs, s => s.tags.find(c => c.type === 'CD-ITEM' && ['healthcareelement', 'healthissue', 'familyrisk', 'risk', 'socialrisk', 'adr', 'allergy', 'medication', 'surgery', 'professionalrisk'].includes(c.code)) && !idServicesInHes.includes(s.id)).then(hesAsServices => {
              const svcHes = hesAsServices.filter(s => !s.tags.some(t => t.type === 'CD-ITEM' && t.code === 'medication')).map(svc => this._makeHeFromSvc(svc))

              const oneWeekAgo = moment().subtract(7, 'days')
              const yesterday = moment().subtract(1, 'days')
              //s.tags.some(c => c.type === 'CD-ITEM' && c.code === 'medication' && !_.values(s.content).some(c => c && c.medicationValue && c.medicationValue.endMomentAsString && this.api.moment(c.medicationValue.endMomentAsString).isBefore(oneWeekAgo)))
              this.set('medications', _.sortBy(hesAsServices.filter(s =>
                  s.tags.some(c => c.type === 'CD-ITEM' && c.code === 'medication' && !_.values(s.content).some(c => c && c.medicationValue && c.medicationValue.endMoment && this.api.moment(c.medicationValue.endMoment).isBefore(yesterday)))
              ).map(m => {
                  return Object.assign(m, {
                      colour: m.codes && m.codes.length && `ATC--${((m.codes.find(c => c.type === 'CD-ATC') || {code: 'V'}).code || 'V').substr(0, 1)}` || ""
                  })
              }), sorter))

              const combinedHes = _.sortBy(_.concat(svcHes, hes.filter(it => it.descr && !it.descr.startsWith('Etat g') && !it.descr.startsWith('Algemeen t') && it.descr !== 'INBOX')), sorter)
              const combinedHesWithHistory = _.sortBy(_.concat(svcHes, allHes.filter(it => it.descr && !it.descr.startsWith('Etat g') && !it.descr.startsWith('Algemeen t') && it.descr !== 'INBOX')), sorter)

              combinedHes.forEach(e => {
                  e.selectedItems = []
              })

              const firstJanuary2018 = moment("2018-01-01")
              this.api.code().icpcChapters(_.compact(combinedHesWithHistory.map(he => he.codes.find(c => c.type === 'ICPC' || c.type === 'ICPC2'))).map(x => x.code)).then(codes => {
                  codes.forEach(cc => {
                      cc.healthElements = _.sortBy(combinedHesWithHistory.filter(he => {
                          let heIcpc = he.codes.find(c => c.type === 'ICPC' || c.type === 'ICPC2')
                          return (he.healthElementId || he.svc && he.svc.id) && heIcpc && cc.subCodes.includes(heIcpc.code)
                      }), sorter)
                      cc.healthElements.forEach(he => he.colour = cc.descr.colour)
                  })
                  this.set('healthTopics', _.sortBy(codes.filter(ht => ht.healthElements.length > 1), it => this.api.contact().localize(it, this.language)))

                  this.set('healthElements', combinedHesWithHistory)

                  this.set('activeHealthElements', combinedHes.filter(it => (!it.closingDate || (it.closingDate && this.api.moment(it.closingDate).isSameOrAfter(now))) && (it.status & 1) === 0 && ((it.status & 2) === 0 || (it.openingDate && this.api.moment(it.openingDate).isSameOrAfter(firstJanuary2018))) && it.tags.find(c => c.type === 'CD-ITEM' && (c.code === 'healthissue' || c.code === 'healthcareelement' || c.code === 'diagnosis'))))
                  this.set('inactiveHealthElements', combinedHes.filter(it => (it.closingDate && this.api.moment(it.closingDate).isBefore(now) || (it.status & 1) === 1) && (it.status & 2) === 0 && it.tags.find(c => c.type === 'CD-ITEM' && (c.code === 'healthissue' || c.code === 'healthcareelement' || c.code === 'diagnosis'))))
                  this.set('archivedHealthElements', combinedHes.filter(it => (it.status & 2) === 2))
                  this.set('allergies', combinedHes.filter(it => (it.status & 2) === 0 && it.tags.find(c => (c.type === 'CD-ITEM' || c.type === 'CD-ITEM-EXT-CHARACTERIZATION') && (c.code === 'allergy' || c.code === 'adr'))))
                  this.set('risks', combinedHes.filter(it => (it.status & 2) === 0 && it.tags.find(c => c.type === 'CD-ITEM' && (c.code === 'risk' || c.code === 'socialrisk' || c.code === 'professionalrisk'))))
                  this.set('familyrisks', combinedHes.filter(it => (it.status & 2) === 0 && it.tags.find(c => c.type === 'CD-ITEM' && c.code === 'familyrisk')))
                  this.set('surgicalHealthElements', combinedHes.filter(it => (it.status & 2) === 0 && it.tags.find(c => c.type === 'CD-ITEM' && c.code === 'surgery')))

                  this.activeHealthElements.length && (this.root.querySelector('#cb_ahelb').opened = true)
                  this.inactiveHealthElements.length && (this.root.querySelector('#cb_ihelb').opened = false)
                  this.allergies.length && (this.root.querySelector('#cb_alhelb').opened = false)
                  this.risks.length && (this.root.querySelector('#cb_rhelb').opened = false)

                  this.set('selectedHealthcareElements', (this.selectedHealthcareElements || []).filter(he => this.activeHealthElements.concat(this.inactiveHealthElements).concat(this.archivedHealthElements).concat(this.allergies).concat(this.risks).concat(this.familyrisks).concat(this.surgicalHealthElements).includes(he)))
              })

              const unclosedContacts = ctcs.filter(c => !c.closingDate && (c.author === this.user.id || c.responsible === this.user.healthcarePartyId))

              //console.log("Before scan ctcs "+(+new Date() - start))
              ctcs.forEach(ctc => {
                  ctc.healthElements = _.uniq(ctc.subContacts.map(sc => sc.planOfActionId && combinedHesWithHistory.find(he => he.plansOfAction.find(poa => poa.id === sc.planOfActionId)) || sc.healthElementId && combinedHesWithHistory.find(he => he.id === sc.healthElementId)).map(he => he && he.healthElementId)).filter(id => !!id).map(id => hesByHeId[id][0])
                  ctc.services.forEach(s => {
                      if (!s.label) {
                          s.label = ((s.tags.find(t => t.type === 'SOAP') || {}).code || 'Other').replace(/ *: *$/, '')
                      }
                  })
              })

              //console.log("After scan ctcs "+(+new Date() - start))
              const youngest = unclosedContacts.map(c => c.openingDate && this.api.moment(c.openingDate)).reduce((y, mc) => (mc && mc.isAfter(y)) ? mc : y, moment().subtract(1, 'days'))
              Promise.all(unclosedContacts.map(unclosedContact => {
                      return (!unclosedContact.openingDate || this.api.moment(unclosedContact.openingDate).isBefore(youngest)) ?
                          this.api.contact().modifyContactWithUser(this.user, Object.assign(unclosedContact, {closingDate: parseInt(moment().format('YYYYMMDDHHmmss'))}))
                              .then(() => null).catch(() => null)
                          : Promise.resolve(unclosedContact)
                  })
              )
                  .then(ctcs =>
                      _.compact(ctcs)[0] || this.api.contact().newInstance(this.user, patient, {
                          tags: [{code: "1", type: "BE-CONTACT-TYPE", version: "1"}], // default contact type : consult
                          descr: "",
                          userDescr: "",
                          //descr: this.localize('contact_of_the_day', 'Contact of the day', this.language),
                          //userDescr: this.localize('contact_of_the_day', 'Contact of the day', this.language)
                      })
                  )
                  .then(newCtc => {
                      const thisYear = moment().year()

                      console.log("Before set contacts " + (+new Date() - start))

                      this.set('contacts', Object.values(ctcs.reduce((acc, it) => {
                          const prev = acc[it.groupId || it.id]
                          if (prev) {
                              const target = (it.created || it.modified) > (prev.created || prev.modified) ? it : prev
                              const source = (it.created || it.modified) > (prev.created || prev.modified) ? prev : it

                              acc[it.groupId || it.id] = target

                              target.subContacts = (target.subContacts || []).concat(source.subContacts)
                              target.services = (target.services || []).concat(source.services)
                          } else {
                              acc[it.groupId || it.id] = it
                          }
                          return acc
                      }, {})))

                      console.log("Before set contacts " + (+new Date() - start))

                      this.set('currentContact', newCtc)
                      const formIds = {}
                      this.hiddenSubContactsId = _.reduce(this.contacts, (acc, ctc) => {
                          ctc.subContacts.forEach(sc => {
                              if (sc.formId && formIds[sc.formId]) {
                                  if (!sc.id) {
                                      sc.id = this.api.crypto().randomUuid()
                                  }
                                  acc[sc.id] = 1
                              } else if (sc.formId) {
                                  formIds[sc.formId] = true
                              }
                          })
                          return acc
                      }, {})

                      if (this.currentContact && this.user) {
                          const noCodeMedications = this.medications.filter(m => !m.codes || !m.codes.length).map(m => {
                              const medValue = this.api.contact().medicationValue(m)
                              const codes = (medValue && medValue.medicinalProduct && medValue.medicinalProduct.intendedcds || []).reduce((map, cds) => (cds.code && cds.type && map.concat([{
                                  code: cds.code,
                                  type: cds.type,
                                  version: "1"
                              }]) || map), [])
                              return [m, codes]
                          }).filter((m, codes) => codes && codes.length).map((m, codes) => {
                              return Object.assign(m, {codes})
                          })

                          if (noCodeMedications && noCodeMedications.length) {
                              const allContacts = [this.currentContact].concat(this.contacts || [])
                              noCodeMedications.forEach(svc => this.api.contact().promoteServiceInContact(this.currentContact, this.user, allContacts, svc, null, {}, []))
                              this.saveContact(this.currentContact)
                          }
                      }

                      console.log("Before ctcs years" + (+new Date() - start))

                      this.set('contactYears', _.sortBy(_.values(_.reduce(this.contacts, (acc, ctc) => {
                          if (ctc.subContacts && ctc.subContacts.some(sc => !sc.id || !this.hiddenSubContactsId[sc.id]) ||
                              ctc.services.some(s => !ctc.subContacts.some(sc => sc.services.some(scs => scs.serviceId === s.id)) && _.values(s.content).find(this.contentHasData.bind(this)))) {
                              let year = parseInt((ctc.openingDate || 2000).toString().substr(0, 4))
                              const contacts = (acc[year] || (acc[year] = {
                                  year: year,
                                  contacts: []
                              })).contacts
                              if (!contacts.includes(ctc)) {
                                  contacts.push(ctc)
                              }
                          }
                          return acc
                      }, _.fromPairs([[thisYear, {year: thisYear, contacts: [newCtc]}]]))).map(x => {
                          x.contacts = _.sortBy(x.contacts, sorter)
                          return x
                      }), x => -x.year))

                      this.filterEvents()

                      console.log("After ctcs years" + (+new Date() - start))

                      if (currentlySelectedContactsIds.some(cId => !ctcs.some(c => c.id === cId))) {
                          this.set('selectedContactIds', _.compact(ctcs.filter(c => currentlySelectedContactsIds.includes(c.id)).map(c => `ctc_${c.id}`)))
                      } else {
                          this.set('selectedContactIds', ['ctc_' + newCtc.id])
                      }

                      setTimeout(() =>
                          this.selectedContactIds.forEach(cDomId => {
                              const pm = this.root.querySelector(`#${cDomId}`)
                              if (pm) {
                                  pm.setAttribute("aria-selected", "true")
                                  pm.classList.add('iron-selected')
                              }
                          }), 0)


                  })
          }) // icc contact then end

          this._updateFilterPanels()
      })

      //eHealth stuff
      //TODO: set hub and env preferences
      const propHub = this.user.properties.find(p => p.type && p.type.identifier === 'org.taktik.icure.user.preferredhub') ||
          (this.user.properties[this.user.properties.length] = {
              type: {identifier: 'org.taktik.icure.user.preferredhub'},
              typedValue: {type: 'STRING', stringValue: 'rsw'}
          })

      const propEnv = this.user.properties.find(p => p.type && p.type.identifier === 'org.taktik.icure.user.eHealthEnv') ||
          (this.user.properties[this.user.properties.length] = {
              type: {identifier: 'org.taktik.icure.user.eHealthEnv'},
              typedValue: {type: 'STRING', stringValue: 'prd'}
          })

      switch (propHub.typedValue.stringValue) {
          case 'rsb':
              this.hubId = 1990000728;
              this.hubEndPoint = propEnv.typedValue.stringValue === 'acc' ? 'https://acchub.abrumet.be/hubservices/intrahub/v3/intrahub.asmx' : 'https://hub.abrumet.be/hubservices/intrahub/v3/intrahub.asmx';
              this.set("hubSupportsConsent", true);
              this.hubPackageId = null;
              this.hubApplication = "RSB";//TODO: verify value
              this.set("supportBreakTheGlass", false);
              break;
          case 'rsw':
              this.hubId = 1990000035;
              this.hubEndPoint = propEnv.typedValue.stringValue === 'acc' ? 'https://acchub.reseausantewallon.be/HubServices/IntraHub/V3/IntraHub.asmx' : 'https://hub.reseausantewallon.be/HubServices/IntraHub/V3/IntraHub.asmx';
              this.set("hubSupportsConsent", true);
              this.hubPackageId = null;
              this.hubApplication = "RSW";
              this.set("supportBreakTheGlass", false);
              break;
          case 'cozo':
              this.hubEndPoint = propEnv.typedValue.stringValue === 'acc' ? '' : '';
              this.set("hubSupportsConsent", true);
              this.hubPackageId = null;
              this.hubApplication = null;
              this.set("supportBreakTheGlass", false);
              break;
          case 'vitalink':
              this.hubId = 1990001916;
              this.hubEndPoint = propEnv.typedValue.stringValue === 'acc' ? 'https://vitalink-acpt.ehealth.fgov.be/vpmg/vitalink-gateway/IntraHubService' : 'https://vitalink.ehealth.fgov.be/vpmg/vitalink-gateway/IntraHubService';
              this.set("hubSupportsConsent", false);
              this.hubPackageId = propEnv.typedValue.stringValue === 'acc' ? "ACC_73424e1e-7eab-4b2c-9a8d-90a2bd1c078f" : "PROD_82fa1e06-7efc-4d84-8f4c-f88513009b9e"; //TODO: replace Pricare by TOPAZ Keys
              this.hubApplication = "VITALINKGATEWAY";
              this.set("supportBreakTheGlass", true);
              break
      }
      if (patient.ssin && (this.api.tokenId || this.api.tokenIdMH)) {

          let dlg = this.root.querySelector('#genInsDialog')
          if (!dlg.opened) this.set('curGenInsResp', null)
          //api.MHContactPersonName
          //api.MHContactPersonSsin
          this.api.hcparty().getHealthcareParty(this.user.healthcarePartyId).then(hcp => this.api.fhc().Geninscontroller().getGeneralInsurabilityUsingGET(
              this.cleanNiss(patient.ssin),
              this.api.tokenId ? this.api.tokenId : this.api.tokenIdMH, this.api.tokenId ? this.api.keystoreId : this.api.keystoreIdMH, this.api.tokenId ? this.api.credentials.ehpassword : this.api.credentials.ehpasswordMH,
              this.api.tokenId ? hcp.nihii : this.api.nihiiMH, this.api.isMH ? this.api.MHContactPersonSsin : hcp.ssin, this.api.isMH ? this.api.MHContactPersonName : hcp.lastName + ' ' + hcp.firstName, this.api.tokenId ? "doctor" : "medicalhouse", null, null
          ).then(gi => {
              const genInsOk = !gi.faultCode && gi.insurabilities && gi.insurabilities.length && gi.insurabilities[0].ct1 && !(gi.generalSituation && gi.generalSituation.length)
              const medicalHouse = gi.medicalHouseInfo && gi.medicalHouseInfo.medical && this.api.before(gi.medicalHouseInfo.periodStart, +new Date()) && (!gi.medicalHouseInfo.periodEnd || this.api.after(gi.medicalHouseInfo.periodEnd + 24 * 3600 * 1000, +new Date()))

              if (!dlg.opened) this.set('curGenInsResp', gi)

              this.$.insuranceStatus.classList.remove('medicalHouse')
              this.$.insuranceStatus.classList.remove('noInsurance')
              this.$.insuranceStatus.classList.remove('insuranceOk')

              this.$.insuranceStatus.classList.add(genInsOk ? medicalHouse ? 'medicalHouse' : 'insuranceOk' : 'noInsurance')
              //Polymer.updateStyles(this.$.insuranceStatus)

              if (genInsOk) {
                  //TODO: expected behaviour:
                  //1. if same mut and CT1/2 -> do nothing
                  //2. if different mut or CT1/2 -> close previous insurability and create new insurability
                  const ins = gi.insurabilities[0];
                  this.api.insurance().listInsurancesByCode(ins.mutuality).then(out => {
                      if (out && out.length) {
                          //find all patient insurabilities where insuranceId = out[0].Id and endDate is null or > today
                          let insuFound = false;
                          insuFound = patient.insurabilities.filter(l => out.some(insu => l.insuranceId === insu.id) && (!l.endDate || l.endDate === ""))
                          if (insuFound && insuFound.length) {
                              insuFound.map(p => {
                                  //1 if found: check if CT1/2 is changed
                                  if (ins.ct1 && (!p.parameters || p.parameters.tc1 !== ins.ct1)) {
                                      console.log('Insurability: CT1/2 changed');//1.2 if changed: close the found ins and create new with startdate today
                                      const newP = {};
                                      newP.identificationNumber = ins.regNrWithMut;
                                      newP.insuranceId = out[0].id;
                                      newP.startDate = moment().format('YYYYMMDD');
                                      newP.parameters = {
                                          tc1: ins.ct1,
                                          preferentialstatus: parseInt(ins.ct1) % 2 === 1 ? true : false,
                                          tc2: ins.ct2,
                                          paymentapproval: !!ins.paymentApproval
                                      };
                                      //2.1 close all other
                                      this.patient.insurabilities.map(p => {
                                              if (!p.endDate) p.endDate = moment().format('YYYYMMDD');
                                          }
                                      );
                                      this.patient.insurabilities.push(newP);
                                      if (patient === this.patient) {
                                          this.api.queue(this.patient, 'patient').then(([pat, defer]) => {
                                              return this.api.patient().modifyPatientWithUser(this.user, this.patient).catch(e => defer.resolve(this.patient)).then(pt => this.api.register(pt, 'patient', defer)).then(p => {
                                                  this.dispatchEvent(new CustomEvent("patient-saved", {
                                                      bubbles: true,
                                                      composed: true
                                                  }));
                                                  this.root.querySelector('#pat-admin-card').patientChanged();
                                              })
                                          })
                                      }
                                  } else {
                                      //1.1 if not changed: do nothing
                                      console.log('Insurability: Nothing changed');
                                  }
                              })
                          } else {
                              console.log('Insurability: Mutuality changed');//2 if not found: create new with startdate today
                              const newP = {};
                              newP.identificationNumber = ins.regNrWithMut;
                              newP.insuranceId = out[0].id;
                              newP.startDate = moment().format('YYYYMMDD');
                              newP.parameters = {
                                  tc1: ins.ct1,
                                  preferentialstatus: parseInt(ins.ct1) % 2 === 1 ? true : false,
                                  tc2: ins.ct2,
                                  paymentapproval: !!ins.paymentApproval
                              };
                              //2.1 close all other
                              this.patient.insurabilities.map(p => {
                                      if (!p.endDate) p.endDate = moment().format('YYYYMMDD');
                                  }
                              );
                              this.push("patient.insurabilities", newP);
                              if (patient === this.patient) {
                                  this.api.queue(this.patient, 'patient').then(([pat, defer]) => {
                                      return this.api.patient().modifyPatientWithUser(this.user, this.patient).catch(e => defer.resolve(this.patient)).then(pt => this.api.register(pt, 'patient', defer)).then(p => {
                                          this.dispatchEvent(new CustomEvent("patient-saved", {
                                              bubbles: true,
                                              composed: true
                                          }))
                                          this.root.querySelector('#pat-admin-card').patientChanged();
                                      })
                                  })
                              }
                          }
                      }
                  })
              }

          }).catch(e => {
              console.log("genins failed " + e.message);
              this.set('isLoading', false);
              return null
          }))
          this.selectedTherLink = null
          this.showPatientConsentState()
          this.showPatientTherLinkState()
          this.showHubState()
          this.updateEdmgStatus()
      }
  }

  showPatientTherLinkState() {
      this._getTherLinks().then(therLinks => {
              var tlOk = false;
              this.$.tlStatus.classList.remove('noTl');
              this.$.tlStatus.classList.remove('tlOk');

              if (therLinks && therLinks[0]) {
                  tlOk = true;
              }
              this.$.tlStatus.classList.add(tlOk ? 'tlOk' : 'noTl');
              //Polymer.updateStyles(this.$.tlStatus)
          }
      )
  }

  cleanNiss(niss) {
      return niss && niss.replace(/ /g, "").replace(/-/g, "").replace(/\./g, "").replace(/_/g, "").replace(/\//g, "")
  }

  showPatientConsentState() {
      this._getConsent().then(patientConsent => {
              var consentOk = false;
              this.$.consentStatus.classList.remove('noConsent');
              this.$.consentStatus.classList.remove('consentOk');

              if (patientConsent) {
                  consentOk = !patientConsent.error;
              }
              this.$.consentStatus.classList.add(consentOk ? 'consentOk' : 'noConsent');
              //Polymer.updateStyles(this.$.consentStatus)
          }
      )
  }

  showHubState() {
      this.$.hubStatus.classList.remove('noAccess');
      this.$.hubStatus.classList.remove('accessOk');

      var hcpHubCons = false;
      if (!this.hubSupportsConsent) {
          this.$.hubStatus.classList.add('accessOk');
      } else {
          this.$.patHubDialog.putHubPatient().then(hubPat => this.set('putPatientResult', hubPat)).catch(error => console.log(error)).then(() => {
              this._getHubHcpConsent().then(consentResp => {
                      if (consentResp) {
                          this.set('hcpHubConsent', consentResp)
                          hcpHubCons = (consentResp.author && consentResp.author.hcparties[0])
                          this.$.hubStatus.classList.add(hcpHubCons ? 'accessOk' : 'noAccess');
                          //Polymer.updateStyles(this.$.hubStatus)
                      }
                  }
              )
          })
      }
  }

  unselectAdminFile() {
      this.$.adminFileMenu.select(null);
  }

  newContact(e) {
      this.refreshPatient();
  }

  closeContact(e) {
      e.stopPropagation();
      e.preventDefault();

      const ctcId = e.target.id.substr(6);
      const year = this.contactYears.find(y => y.contacts.find(c => c.id === ctcId));
      const contact = year.contacts.find(c => c.id === ctcId);

      const ctcDetailPanel = this.shadowRoot.querySelector('#ctcDetailPanel')

      ;(ctcDetailPanel && ctcDetailPanel.shouldSave() && this.saveCurrentContact() || Promise.resolve(this.currentContact)).then(() => {
          if (contact) {
              if (!contact.rev && (!contact.services || contact.services.length === 0)) {
                  const idx = this.contactYears[0].contacts.indexOf(this.currentContact);
                  if (idx >= 0) {
                      this.splice('contactYears.0.contacts', idx, 1);
                  }
                  this.set('currentContact', null);
              } else {
                  this.api.contact().getContactWithUser(this.user, contact.id).then(c => {
                      c.closingDate = parseInt(moment().format('YYYYMMDDHHmmss'));
                      (c.rev ? this.api.contact().modifyContactWithUser(this.user, c) : this.api.contact().createContactWithUser(this.user, c)).then(c => this.api.register(c, 'contact')).then(() => this.refreshPatient())
                      //this.notifyPath('currentContact.closingDate')
                  });
              }
          }
      })
  }

  _archive(event) {
      const model = event.detail;
      if (model.he.id) {
          this.api.helement().getHealthElement(model.he.id).then(he => {
              if (!he.closingDate && he.closingDate !== 0) {
                  he.closingDate = parseInt(moment().format('YYYYMMDDHHmmss'));
              }
              if ((he.status & 1) === 0) {
                  he.status = he.status | 1;
              }
              if ((he.status & 2) === 0) {
                  he.status = he.status | 2;
              }
              this.api.helement().modifyHealthElement(he).then(() => {
                  this.refreshPatient();
              });
          });
      } else if (model.he.idService) {
          if (!this.currentContact) {
              return;
          }
          const svc = model.he.svc;

          if (!svc.closingDate && svc.closingDate !== 0) {
              svc.closingDate = parseInt(moment().format('YYYYMMDDHHmmss'));
          }
          if ((svc.status & 2) === 0) {
              svc.status = svc.status | 2;
          }
          this.saveNewService(svc).then(c => this.refreshPatient());
      }
  }

  _activate(event) {
      const model = event.detail;
      if (model.he.id) {
          this.api.helement().getHealthElement(model.he.id).then(he => {
              if (he.closingDate || he.closingDate === 0) {
                  he.closingDate = null;
              }
              if ((he.status & 1) === 1) {
                  he.status = he.status - 1;
              } //activate
              if ((he.status & 2) === 2) {
                  he.status = he.status - 2;
              } //unarchive
              this.api.helement().modifyHealthElement(he).then(he => {
                  this.refreshPatient();
              });
          });
      } else if (model.he.idService) {
          if (!this.currentContact) {
              return;
          }
          const svc = model.he.svc;

          if (svc.closingDate || svc.closingDate === 0) {
              svc.closingDate = null;
          }
          if ((svc.status & 1) === 1) {
              svc.status = svc.status - 1;
          } //activate
          if ((svc.status & 2) === 2) {
              svc.status = svc.status - 2;
          } //unarchive
          this.saveNewService(svc).then(c => this.refreshPatient());
      }
  }

  _inactivate(event) {
      const model = event.detail;
      if (model.he.id) {
          this.api.helement().getHealthElement(model.he.id).then(he => {
              if (!he.closingDate && he.closingDate !== 0) {
                  he.closingDate = parseInt(moment().format('YYYYMMDDHHmmss'));
              }
              if ((he.status & 2) === 2) {
                  he.status = he.status - 2;
              } //unarchive
              this.api.helement().modifyHealthElement(he).then(he => {
                  this.refreshPatient();
              });
          });
      } else if (model.he.idService) {
          if (!this.currentContact) {
              return;
          }
          const svc = model.he.svc;

          if (!svc.closingDate && svc.closingDate !== 0) {
              svc.closingDate = parseInt(moment().format('YYYYMMDDHHmmss'));
          }
          if ((svc.status & 2) === 2) {
              svc.status = svc.status - 2;
          } //unarchive

          this.saveNewService(svc).then(c => this.refreshPatient());
      }
  }

  _selectToday() {
      this.$.adminFileMenu.select(1);

      this.set('timeSpanStart', parseInt(moment().startOf('day').format('YYYYMMDD')));
      this.set('timeSpanEnd', null);

      this.updateContactYears();
  }

  _select6Months() {
      this.set('timeSpanStart', parseInt(moment().subtract(6, 'month').format('YYYYMMDD')));
      this.set('timeSpanEnd', null);

      this.updateContactYears();
  }

  _selectAll() {
      this.set('timeSpanStart', null);
      this.set('timeSpanEnd', null);

      this.updateContactYears();
  }

  _selectMoreOptions() {
      this.$['select-more-options-dialog'].open()
  }

  _selectBetweenTwoDates() {

      this.set('timeSpanStart', moment(this.dateStartAsString).format('YYYYMMDD') === "Invalid date" ? null : parseInt(moment(this.dateStartAsString).format('YYYYMMDD')));
      this.set('timeSpanEnd', moment(this.dateEndAsString).format('YYYYMMDD') === "Invalid date" ? null : parseInt(moment(this.dateEndAsString).format('YYYYMMDD')));

      this.updateContactYears();
  }

  _selectCurrentContact() {
      this.currentContact && this.currentContact.id && this.shadowRoot.querySelector('#_contacts_listbox').set('selectedValues', [this.currentContact.id]);
  }

  updateContactYears() {
      this.notifyPath('contactYears');
  }

  getHeId(he) {
      return he.id ? `_he_${he.id}` : `_svc_${he.idService}`;
  }

  contactFilter() {
      return (ctc) => {
          const regExp = this.contactSearchString && new RegExp(this.contactSearchString, "i");

          const heHeIds = this.selectedHealthcareElements.map(he => he.healthElementId).filter(x => !!x);
          const heIds = _.uniq(this.selectedHealthcareElements.map(he => he.id).concat((this.healthElements || []).filter(h => h.healthElementId && heHeIds.includes(h.healthElementId)).map(he => he.id)));
          const poaIds = _.flatMap(this.selectedHealthcareElements, he => he.selectedPlansOfAction ? he.selectedPlansOfAction.map(p => p.id) : []);
          const svcIds = this.selectedHealthcareElements.filter(he => !he.id).map(he => he.idService);

          return this.api.after(ctc.openingDate, this.timeSpanStart)
              && this.api.before(ctc.openingDate, this.timeSpanEnd)
              && (!regExp || ctc.subContacts.some(sc => sc.descr && sc.descr.match(regExp) && sc.services.length)
                  || ctc.services.some(s => this.shortServiceDescription(s, this.language).match(regExp))
                  || this.hcp(ctc).match(regExp))
              && (!heIds.length && !poaIds.length && !svcIds.length
                  || ctc.subContacts.some(sc => (sc.healthElementId && heIds.includes(sc.healthElementId) || sc.planOfActionId && poaIds.includes(sc.planOfActionId)))
                  || ctc.services.some(s => svcIds.includes(s.id)))
              && (!this.contactFilters || !this.contactFilters.length
                  || ctc.services.some(s => s.tags && s.tags.some(t => this.contactFilters.some(cf =>
                      cf.every(f => f.code.some(c => f.type === t.type && c === t.code)))))
                  || ctc.tags.some(t => this.contactFilters.some(cf =>
                      cf.every(f => f.code.some(c => f.type === t.type && c === t.code))))
                  || ctc.subContacts.some(s => s.tags && s.tags.some(t => this.contactFilters.some(cf =>
                      cf.every(f => f.code.some(c => f.type === t.type && c === t.code)))))
              )
              && (
                  this.statutFilter === "all" || this.contactStatutChecked.some(id => id === ctc.id)
              )
              || !ctc.closingDate;

      }
  }

  compareContacts(a, b) {
      return b.openingDate - a.openingDate;
  }

  close() {
      this.set('patient', null);
  }


  _editHealthElement(event) {
      const model = event.detail;
      (model.he.codes && model.he.codes.length && this.api.code().getCodes(model.he.codes.map(c => this.api.code().normalize(c).id).join(',')) || Promise.resolve([])).then(codes => {
          this.editedHealthElementModel = model;
          this.$['edit-healthelement-dialog'].set('entity', _.assign(_.assign({plansOfAction: []}, model.he), {codes: codes}));
          this.$['edit-healthelement-dialog'].open();
      });
  }

  toggleMenu(e) {
      e.stopPropagation();
      e.preventDefault();
      styx.parent(e.target, el => el.tagName.toLowerCase() === 'collapse-button').toggle();
      styx.parent(e.target, el => el.tagName.toLowerCase() === 'paper-item').classList.toggle('opened');

      this._updateFilterPanels();
  }

  getPaperItemParentForEvent(e) {
      let tgt = e.target;
      while (tgt && tgt.tagName && tgt.tagName.toLowerCase() !== 'paper-item') {
          tgt = tgt.parentElement;
      }
      return tgt && tgt.tagName ? tgt : null;
  }

  getPaperListboxParent(tgt) {
      while (tgt && tgt.tagName && tgt.tagName.toLowerCase() !== 'paper-listbox') {
          tgt = tgt.parentElement;
      }
      return tgt && tgt.tagName ? tgt : null;
  }

  handleSelectionChange(e) {
      e.preventDefault()
      e.stopPropagation()
      document.getSelection().removeAllRanges();

      const selections = e.detail.selections;
      const selChanges = {}; // Map with new selected indexes for each listbox id

      selections.forEach(s => {
          if (s.action === 'unselect') {
              this.set('selectedAdminOrCompleteFileIndex', null);
          }
          ;(s.items || this.selectedHealthcareElements.map(he => this.getHeId(he))).forEach(id => {
              const item = this.root.querySelector('#' + id);
              if (item) {
                  const listBox = this.getPaperListboxParent(item);
                  if (listBox) {
                      const selChangesEntry = selChanges[listBox.id] || (selChanges[listBox.id] = {
                          el: listBox,
                          selectedValues: listBox.selectedValues
                      });
                      if (s.action === 'select') {
                          selChangesEntry.selectedValues = _.uniq(selChangesEntry.selectedValues.concat([listBox.items.indexOf(item)]));
                      } else if (s.action === 'extend') {
                          if (selChangesEntry.selectedValues && selChangesEntry.selectedValues.length) {
                              const min = Math.min(...selChangesEntry.selectedValues)
                              const max = Math.max(...selChangesEntry.selectedValues)
                              const idx = listBox.items.indexOf(item)
                              selChangesEntry.selectedValues = _.uniq(selChangesEntry.selectedValues.concat(idx < min ? _.range(idx, min) : _.range(max + 1, idx + 1)));
                          }
                      } else if (s.action === 'unselect') {
                          const delValue = listBox.items.indexOf(item);
                          selChangesEntry.selectedValues = selChangesEntry.selectedValues.filter(it => it !== delValue);
                      }
                  }
              }
          });
      });
      Object.values(selChanges).forEach(c => c.el.set('selectedValues', c.selectedValues));
      if (this.selectedHealthcareElements.length === 0 && this.selectedAdminOrCompleteFileIndex !== 0) {
          this.set('selectedAdminOrCompleteFileIndex', 1)
      }
  }

  selectedAdminFileChanged(el) {
      if (el && this.selectedHealthcareElements && this.selectedHealthcareElements.length && this.selectedAdminOrCompleteFileIndex === 1) {
          //this.set("selectedHealthcareElements", []);
          this.root.querySelectorAll('paper-listbox.menu-content').forEach(plb =>
              plb.set('selectedValues', [])
          )
      }
      this._updateFilterPanels();
  }

  selectedMainElementItemsChanged(event) {
      const domRepeat = event.target.querySelector("dom-repeat");
      const selectedModels = _.compact(event.target.selectedItems.map(el => {
          const model = domRepeat.modelForElement(el)
          return model && (model.he || model.risk || model.allergy)
      }));

      if (!domRepeat || !selectedModels) {
          return;
      }
      const allModels = domRepeat.items || [];

      let finalSelection = this.selectedHealthcareElements.filter(he => !allModels.includes(he)).concat(selectedModels)
      console.log(finalSelection.map(he => he.descr).join(","))
      this.set('selectedHealthcareElements', finalSelection);
  }

  _isItemInArray(item, selectedItems) {
      return selectedItems && selectedItems.includes(item);
  }

  selectedHealthcareElementsSpliced(changeRecord) {
      if (changeRecord) {
          this.updateContactYears();
      }
  }

  isNotEmpty(a) {
      return a && a.length > 0;
  }

  isEmpty(a) {
      return !a || a.length === 0;
  }

  isAdminSelected(el) {
      if (el === 0) {
          this.closePostit()
          return true;
      } else {
          if (this.patient) {
              this.set('postitMsg', this.patient.note)
          }
          return false;
      }
  }

  highlightedServiceLabels(user) {
      try {
          return user.properties.filter(p => p.type.identifier === 'org.taktik.icure.highlightedServiceLabels').map(p => JSON.parse(p.typedValue.stringValue))[0] || ['Examen clinique', 'Diagnostics', 'Prescription'];
      } catch (e) {
      }
      return ['Examen clinique', 'Diagnostics', 'Prescription'];
  }

  hcp(ctc) {
      const usr = this.api.users && this.api.users[ctc.author];
      //const hcp = usr ? this.api.hcParties[usr.healthcarePartyId] : null;
      const hcpid = ctc.responsible ? ctc.responsible : (usr ? usr.healthcarePartyId : null);
      let hcp = hcpid && this.patientHealthCarePartiesById ? this.patientHealthCarePartiesById[hcpid] : null;
      hcp = hcp ? hcp : (hcpid ? this.api.hcParties[hcpid] : null);
      let name
      if (hcp && hcp.name != null && hcp.name != "") {
          name = hcp && hcp.name
      } else {
          name = hcp && hcp.lastName + " " + (hcp.firstName && hcp.firstName.length && hcp.firstName.substr(0, 1) + ".")
      }
      return name || usr && usr.login || "N/A";
  }

  picture(pat) {
      if (!pat) {
          return require('../../../images/male-placeholder.png');
      }
      return pat.picture ? 'data:image/png;base64,' + pat.picture : (pat.gender && pat.gender.substr(0, 1).toLowerCase() === 'f') ? require('../../../images/female-placeholder.png') : require('../../../images/male-placeholder.png');
  }

  serviceDescriptions(ctc, label) {
      return this.api && this.api.contact().services(ctc, label).filter(s => !s.endOfLife).map(s => this.shortServiceDescription(s, this.language)).filter(desc => desc) || [];
  }

  shortServiceDescription(svc, lng) {
      let rawDesc
      if (svc && svc.tags && svc.tags.some(t => t.type == "SOAP" && t.code == "Plan")) {
          rawDesc = svc.content && svc.content.descr && svc.content.descr.stringValue || ""
      } else {
          rawDesc = this.api.contact().shortServiceDescription(svc, lng) || "";
      }
      return rawDesc && '' + rawDesc || '';
  }

  shortMedicationDescription(svc, lng) {
      let rawContent = svc && this.api && this.api.contact().preferredContent(svc, lng);
      return rawContent && rawContent.medicationValue && `${this.api.contact().medication().medicationNameToString(rawContent.medicationValue)} ${this.api.contact().medication().posologyToString(rawContent.medicationValue, lng)}` || '';
  }

  contentHasData(c) {
      return this.api && this.api.contact().contentHasData(c) || false;
  }

  _addHealthElement(e) {
      this.$['add-healthelement-dialog'].open();
      this.$['add-healthelement-dialog'].set('entity', {
          plansOfAction: [],
          tags: (e.target.dataset.tags ? e.target.dataset.tags.split(',') : []).map(c => ({
              id: c,
              type: c.split('|')[0],
              code: c.split('|')[1],
              version: c.split('|')[2]
          }))
      });
  }

  _addInactiveHealthElement(e) {
      this.$['add-healthelement-dialog'].open();
      this.$['add-healthelement-dialog'].set('entity', {
          plansOfAction: [],
          closingDate: parseInt(moment().format('YYYYMMDDHHmmss')),
          tags: (e.target.dataset.tags ? e.target.dataset.tags.split(',') : []).map(c => ({
              id: c,
              type: c.split('|')[0],
              code: c.split('|')[1],
              version: c.split('|')[2]
          }))
      });
  }

  _addMedication(e) {
      const id = this.api.crypto().randomUuid();
      const medicationValue = {regimen: []}
      const newMedication = {
          label: this.localize('medication', 'medication', this.language), id: id,
          content: _.fromPairs([[this.language, {medicationValue: medicationValue}]]),
          tags: (e.target.dataset.tags ? e.target.dataset.tags.split(',') : []).map(c => ({
              id: c,
              type: c.split('|')[0],
              code: c.split('|')[1],
              version: c.split('|')[2]
          }))
      };

      this.currentSelectMedicationEventDetail = null
      this.$['medication-selection'].open(newMedication, {
          id: id,
          medicationValue: medicationValue,
          isNew: true
      });
  }

  _editMedication(e) {
      const id = e.target.id.substr("med-edit-btn-edit_".length)
      const m = this.medications.find(s => s.id === id)
      this.currentSelectMedicationEventDetail = null
      this.currentMedicationDetailEventDetail = null
      this.$['medication-detail'].open(m);
  }

  _selectMedication(e) {
      this.currentSelectMedicationEventDetail = e.detail
      this.$['medication-selection'].open(e.detail.service, e.detail.content);
  }

  _selectMultiMedication(e) {
      this.currentSelectMedicationEventDetail = e.detail
      this.$['medications-selection'].open(e.detail.service, {isPrescription: true});
  }


  _medicationDetail(e) {
      this.currentMedicationDetailEventDetail = e.detail
      this.$['medication-detail'].open(e.detail.service, e.detail.content);
  }

  _medicationsDetail(e) {
      this.currentMedicationDetailEventDetail = e.detail
      this.$['medication-detail'].openList(e.detail.services);
  }

  _medicationCreated(e) {
      if (this.currentSelectMedicationEventDetail && this.currentSelectMedicationEventDetail.onCreate) {
          this.currentSelectMedicationEventDetail.onCreate(e)
      } else {
          if (!this.currentContact) {
              return;
          }
          this._displayMedicationDetails(e)
      }
  }

  _medicationsCreated(e) {
      if (this.currentSelectMedicationEventDetail && this.currentSelectMedicationEventDetail.onCreate) {
          this.currentSelectMedicationEventDetail.onCreate(e)
      } else {
          if (!this.currentContact) {
              return;
          }
          this._displayMedicationDetails(e)
      }
  }

  _medicationValueChanged(e) {
      if (this.currentSelectMedicationEventDetail && this.currentSelectMedicationEventDetail.onValueChanged) {
          this.currentSelectMedicationEventDetail.onValueChanged(e)
      }
  }

  _medicationDetailValueChanged(e) {
      //In case we get here coming from the prescription dialog by checking the checkbox
      if (this.currentMedicationDetailEventDetail && this.currentMedicationDetailEventDetail.onValueChanged) {
          this.currentMedicationDetailEventDetail.onValueChanged(e)

          const medicationArray = e.detail.medications && e.detail.medications.length > 1 ? e.detail.medications : [e.detail.medication];
          Promise.all(medicationArray.map(m => {
              if (m.options && (m.options.createMedication || !m.options.isPrescription)) {
                  const newMedication = _.cloneDeep(m.newMedication)
                  const medicationTag = 'CD-ITEM|medication|1.0'
                  newMedication.tags = [{
                      id: medicationTag,
                      type: medicationTag.split('|')[0],
                      code: medicationTag.split('|')[1],
                      version: medicationTag.split('|')[2]
                  }]
                  newMedication.label = this.localize('medication', 'medication', this.language)
                  newMedication.id = this.api.crypto().randomUuid()
                  return this.saveNewService(this.api.contact().service().newInstance(this.user, newMedication));
              }
              return null
          }))
              .then((results) => results.find(r => r) && this.refreshPatient())
      } else {
          //Standard behaviour: create from medication button in left panel
          this.saveNewService(this.api.contact().service().newInstance(this.user, e.detail.medication.newMedication)).then(() => this.refreshPatient())
      }

  }


  _displayMedicationDetails(e) {
      if (this.currentSelectMedicationEventDetail && this.currentSelectMedicationEventDetail.onShowDetails) {
          this.currentSelectMedicationEventDetail.onShowDetails(e)
      } else {
          const medicationService = e.detail.medication
          this.$['medication-detail'].open(e.detail.medication, {
              id: medicationService.id,
              medicationValue: (this.api.contact().preferredContent(medicationService, this.language) || (medicationService.content[this.language] = {medicationValue: {regimen: []}})).medicationValue,
              isNew: true,
              isPrescription: e.detail.isPrescription
          });
      }
  }

  _healthElementsSelectorColumns() {
      return [{key: 'descr', title: 'Description'}, {key: 'plansOfActionDescr', title: 'Plans of action'}];
  }

  _healthElementsSelectorDataProvider() {
      return {
          filter: function (filterValue, limit, offset, sortKey, descending, cds = ['BE-THESAURUS']) {
              const noDiacFilterValue = filterValue && filterValue.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "")

              const regExp = noDiacFilterValue && new RegExp(noDiacFilterValue.replace(/\s+/, '.*'), "i");
              const words = noDiacFilterValue && noDiacFilterValue.toLowerCase().split(/\s+/);
              const sorter = x => {
                  const key = (x.descr || x.name || '').normalize('NFD').replace(/[\u0300-\u036f ]/g, "").toLowerCase();
                  return [key.startsWith(words[0]), key]
              }

              const promises = [this.api.entitytemplate().findEntityTemplates(this.user.id, 'org.taktik.icure.entities.HealthElementTemplate', null, true)]
              cds.forEach(cd => promises.push(this.api.code().findPaginatedCodesByLabel('be', cd, 'fr', words[0], null, null, 1000)))

              return Promise.all(promises).then(results => {
                  const entityTemplates = results[0];
                  const codes = _.flatMap(results.slice(1), cs => cs.rows);
                  const filtered = _.flatten(entityTemplates.map(et => et.entity)).filter(he => [he].concat(he.plansOfAction || []).some(it => it.descr && it.descr.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").match(regExp) || it.name && it.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").match(regExp)))
                      .map(it => ({
                          descr: it.descr || it.name,
                          healthElement: it,
                          plansOfAction: it.plansOfAction || [],
                          plansOfActionDescr: (it.plansOfAction && it.plansOfAction.map(poa => poa.descr || poa.name) || []).join(',')
                      }))
                      .concat(codes.filter(c => words.every(w => this.api.localize(c.label).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").includes(w))).map(code => ({
                          descr: this.api.localize(code.label),
                          codes: [code.id].concat(code.links),
                          plansOfAction: [],
                          plansOfActionDescr: 'N/A'
                      })));
                  return {
                      totalSize: filtered.length,
                      rows: (descending ? _.reverse(_.sortBy(filtered, sorter)) : _.sortBy(filtered, sorter)).slice(offset, limit)
                  };
              });
          }.bind(this),
          filterDrugs: (filterValue, limit = 100, offset = 0, sortKey = name, descending) => {
              return Promise.all([
                  this.api.bedrugs().getMedecinePackages(filterValue, this.language.toLowerCase(), null, offset, limit),
                  this.api.bedrugs().getMedecinePackagesFromIngredients(filterValue, this.language.toLowerCase(), null, offset, limit)
              ])
                  .then(([packs, packsIng]) => {
                      const newItems = _.unionBy(packs, packsIng, 'id.id')
                      if (newItems.length > 0) {

                      }
                      return {rows: _.sortBy(newItems, sortKey)}
                  })
          }
      };
  }

  _normalizedHealthElement(healthElement) {
      return {
          descr: healthElement.descr,
          openingDate: healthElement.openingDate || +new Date(),
          closingDate: healthElement.closingDate,
          status: healthElement.status || 0,
          plansOfAction: (healthElement.plansOfAction || []).map(poa => _.extend(poa, {
              id: this.api.crypto().randomUuid(),
              openingDate: parseInt(moment().format('YYYYMMDDHHmmss'))
          })),
          tags: (healthElement.tags || []).map(c => this.api.code().normalize(c)),
          codes: (healthElement.codes || []).map(c => this.api.code().normalize(c)),
          idService: healthElement.idService
      };
  }

  _addedHealthElementSelected(event, healthElement) {
      this.api.helement().newInstance(this.user, this.patient, this._normalizedHealthElement(healthElement)).then(he => this.api.helement().createHealthElement(he)).then(() => this.refreshPatient());
  }

  _editedHealthElementSelected(event, healthElement) {
      if (this.editedHealthElementModel.he.id) {
          this.api.helement().getHealthElement(this.editedHealthElementModel.he.id).then(he => {
              delete healthElement.plansOfActionDescr;
              _.assign(he, this._normalizedHealthElement(healthElement));
              he.id = this.api.crypto().randomUuid();
              delete he.rev;
              return he;
          }).then(he => this.api.helement().createHealthElement(he)).then(he => this.refreshPatient());
      } else if (this.editedHealthElementModel.he.idService) {
          const svc = this.editedHealthElementModel.he.svc;
          return this.api.helement().serviceToHealthElement(this.user, this.patient, svc,
              this.api.contact().shortServiceDescription(svc, language)).then(he => {
              if (this.currentContact) {
                  this.api.contact().promoteServiceInContact(this.currentContact, this.user, this.contacts, svc, undefined, null, [he.id], null);
                  this.saveCurrentContact().then(c => this.refreshPatient());
              }

              this.editedHealthElementModel.he = he;
              return this._editedHealthElementSelected(event, healthElement);
          });
      }
  }

  _servicesSelectorColumns() {
      return [{
          key: svc => svc && svc.content && this.shortServiceDescription(svc, this.language) || '',
          sortKey: 'content.' + this.language + '.stringValue',
          title: 'Description'
      }, {
          key: svc => svc && svc.codes && svc.codes.map(c => (c.type || c.id && c.id.split('|')[0]) + ':' + (c.code || c.id && c.id.split('|')[1])).join(',') || '',
          sortKey: 'codes.0.code',
          title: 'Codes'
      }];
  }

  _servicesSelectorDataProvider(label) {
      return {
          filter: function (filterValue, limit, offset, sortKey, descending) {
              const regExp = filterValue && new RegExp(filterValue, "i");

              return this.api.code().findPaginatedCodesByLabel('be', 'BE-THESAURUS', 'fr', filterValue, null, null, 1000).then(results => {
                  const filtered = results.rows.map(code => ({
                      label: label,
                      content: _.mapValues(code.label, v => ({stringValue: v})),
                      codes: code.links && code.links.map(c => ({
                          id: c,
                          type: c.split('|')[0],
                          code: c.split('|')[1],
                          version: c.split('|')[2]
                      })) || []
                  }));
                  return {
                      totalSize: filtered.length,
                      rows: (descending ? _.reverse(_.sortBy(filtered, sortKey)) : _.sortBy(filtered, sortKey)).slice(offset, limit)
                  };
              });
          }.bind(this)
      };
  }

  _addedOrEditedServiceSelected(event, svc) {
      if (!this.currentContact) {
          return;
      }
      this.saveNewService(svc).then(c => this.refreshPatient());
  }

  _svcEntityContentChanged(e, value) {
      const svc = styx.parent(e.target, el => el.tagName.toLowerCase() === 'entity-selector').entity;
      const content = (this.api.contact().preferredContent(svc, this.language) || {}).stringValue = value;
  }

  _updateFilterPanels() {
      setTimeout(() => {
          const cfp = this.root.querySelector("#contactFilterPanel");
          cfp && cfp.refreshIcons();
          const hpd = this.root.querySelector("ht-pat-detail-ctc-detail-panel");
          hpd && hpd.refreshIcons();
          this.set("SpinnerActive", false)
      }, 10);
  }

  _expandColumn(e) {
      this.set('leftMenuOpen', true)
      this.root.querySelector('.container').classList.add('expanded');
      this._updateFilterPanels();
  }

  _closeColumn(e) {
      this.set('leftMenuOpen', false)
      this.root.querySelector('.container').classList.remove('expanded');
      this._updateFilterPanels();
  }

  _concat(a, b, c, d, e) {
      return (a || []).concat(b || []).concat(c || []).concat(d || []).concat(e || []);
  }

  _settingsChanged(e) {
      if (e.detail && e.detail.section) {
          this.set(`${e.detail.section}_${e.detail.type}`, e.detail.value)
      }
  }

  _filterElements(hes, sort, showInactive = true) {
      return _.sortBy(hes.filter(he => showInactive || (he.status & 2) === 0), (x) =>
          (sort === 'created') ? [
              (-(x.valueDate || x.openingDate || 0),
              (x.codes || []).find(c => c.type === 'ICPC' || c.type === 'ICPC2') || {}).code || "\uff0f",
              -(x.closingDate || 0)
          ] : [
              ((x.codes || []).find(c => c.type === 'ICPC' || c.type === 'ICPC2') || {}).code || "\uff0f",
              -(x.valueDate || x.openingDate || 0),
              -(x.closingDate || 0)
          ])
  }

  checkingStatus() {
      let promises = [];
      const table = ["all", "active-relevant", "active-irrelevant", "inactive", "archived"]

      this.set("contactStatutChecked", []);

      if (this.statutFilter !== "all") {
          this.contactYears.map(
              contactYear => {
                  contactYear.contacts.map(ctc => {
                      console.log('contact', ctc)
                      ctc.subContacts.map(sbct => {
                          let value;
                          if (sbct.healthElementId) {
                              this.api.helement().getHealthElement(sbct.healthElementId).then(element => {
                                  value = element.status === table.findIndex(row => row === this.statutFilter)
                                  if (value && !this.contactStatutChecked.find(id => id === ctc.id)) {
                                      this.push("contactStatutChecked", ctc.id);
                                  }
                              })
                          }

                      })
                  })
              }
          )
      }
  }

  _toggleEditSettings(e) {
      e.stopPropagation();
      e.preventDefault();

      let parentElement = e.target.parentElement;
      if (parentElement.classList.contains('open')) {
      } else {
          parentElement.classList.add('open');
          setTimeout(() => parentElement.classList.remove('open'), 4000);
      }
  }

  _composeHistory(e) {
      const heId = e.detail.entity.healthElementId

      let hhe = _.sortBy(this.healthElements.filter(eh => eh.healthElementId === heId), ['modified'])


      hhe.map(e => {

          e.modified ? e.modified = this.api.moment(e.modified).format('DD/MM/YYYY') : e.modified = ""
          e.openingDate ? e.openingDate = this.api.moment(e.openingDate).format('DD/MM/YYYY') : e.openingDate = ""
          e.closingDate ? e.closingDate = this.api.moment(e.closingDate).format('DD/MM/YYYY') : e.closingDate = ""

          let extraTemporality = e.tags.find(tmp => tmp.type === 'CD-EXTRA-TEMPORALITY')
          let temporality = e.tags.find(tmp => tmp.type === 'CD-TEMPORALITY')
          let severity = e.tags.find(sev => sev.type === 'CD-SEVERITY')
          let certainty = e.tags.find(cert => cert.type === 'CD-CERTAINTY')
          let nature = e.tags.find(nat => nat.type === 'CD-ITEM')

          e.nature = nature && nature.code ? nature.code : ""
          e.certainty = certainty && certainty.code ? certainty.code : ""
          e.temporality = temporality && temporality.code ? temporality.code : ""
          e.extraTemporality = extraTemporality && extraTemporality.code ? extraTemporality.code : ""
          e.severity = severity && severity.code ? severity.code : ""

      })

      this.set('historyElement', hhe)
  }

  _checkClosingDate(date) {
      return date !== "" ? true : false
  }

  _checkIfPresent(data) {
      return data !== "" && data !== 'null' && data !== null ? true : false
  }

  _getDataTrad(data) {
      return this.localize(data, data, this.language)
  }

  getGender(gender) {
      if (gender === "male") return "M.";
      if (gender === "female") return "Mme";
      else return "";
  }

  _chapter4(e) {
      e.stopPropagation()
      e.preventDefault()

      //this.$['chapterivdialog'].open()
  }


  _medicationPlan(e) {
      e.stopPropagation()
      e.preventDefault()

      this.$['medication-plan'].open()
  }

  updateEdmgClassList(cssClassToAssign) {
      this.$.edmgStatus.classList.remove('edmgPending');
      this.$.edmgStatus.classList.remove('edmgOk');
      this.$.edmgStatus.classList.remove('edmgNOk');
      this.$.edmgStatus.classList.add(cssClassToAssign || '');
  }


  updateEdmgStatus() {

      if (!this.api.tokenId || this.isLoading) return;

      this.set('isLoading', true);

      this.api.getUpdatedEdmgStatus(
          this.user,
          this.patient,
          null, // requestDate
          null, // edmgNiss,
          null, // edmgOA,
          this.genInsOA,
          this.genInsAFF
      ).then(edmgStatusResponse => {

          if (!edmgStatusResponse || (edmgStatusResponse.errors && edmgStatusResponse.errors.length > 0) || !edmgStatusResponse.hcParty) {
              this.set('isLoading', false);
              return;
          }

          // Get connected user's HCP.nihii (the only comparaison key with EDMG's result
          this.api.hcparty().getHealthcareParty(this.user.healthcarePartyId).then(
              thisHcp => {
                  this.set('isLoading', false);
                  const currentTstamp = moment().valueOf();
                  if (thisHcp.nihii !== (edmgStatusResponse.hcParty.ids.find(id => id.s === 'ID_HCPARTY') ? edmgStatusResponse.hcParty.ids.find(id => id.s === 'ID_HCPARTY').value : '')) {
                      this.updateEdmgClassList('edmgNOk');
                      console.log('EDMG Failed : patient is NOT mine (based on nihii) ');
                      return;
                  } // Connected doctor !== the one that has patient's EDMG
                  if (edmgStatusResponse.from <= currentTstamp && edmgStatusResponse.to >= currentTstamp) {
                      this.updateEdmgClassList('edmgOk');
                      console.log('EDMG OK: last consultation less than 1 year ago');
                      return;
                  } // Valid status (last consultation between start & end of eDMG)
                  if (edmgStatusResponse.from > currentTstamp && currentTstamp >= moment(edmgStatusResponse.from).subtract(1, 'year').valueOf()) {
                      this.updateEdmgClassList('edmgPending');
                      console.log('EDMG PENDING: last consultation less than 2 years ago (but more than one)');
                      return;
                  } // Pending status (last consultation more than a year ago but less than 2 years ago)
                  console.log('EDMG FAILED: last consultation more than 2 years ago'); // Anything else
              }
          ).catch(() => {
              this.set('isLoading', false);
          })
      }).catch(() => {
          this.set('isLoading', false);
      });

  }

  _linkToEbPracticeNet(e) {
      e.stopPropagation()
      window.open("https://www.ebpnet.be/fr/Pages/default.aspx", '_blank');
  }

  _linkToCBIP(e) {
      e.stopPropagation()
      window.open("http://www.cbip.be/fr/start", '_blank');
  }

  _ebmPicture() {
      return require('../../../images/EbpracticeNet-logo-square.png')
  }

  _cbipPicture() {
      return require('../../../images/cbip-logo.png')
  }

  showListPlanOfAction(e) {
      e.stopPropagation()
      this.$["listActions"].opened = true;
  }

  showVaccineHistory(e) {
      e.stopPropagation()
      this.$["vaccineHistory"].opened = true;
  }

  openActionDialog(e) {
      console.log("svcs", e.detail.service)
      const lifecycle = e.detail.service.tags.find(tag => tag.type === "CD-LIFECYCLE") || {}
      this.$["planActionForm"].open(e.detail.service, lifecycle.code === "cancelled" || lifecycle.code === "completed")
  }


  postitChanged(value) {
      const trimmedValue = value && value.trim()
      if (trimmedValue && trimmedValue.length) {
          this.$["postit-notification"].classList.add('notification')
          setTimeout(() => {
              this.closePostit()
          }, 60000);
      } else {
          this.closePostit()
      }
  }

  editPostit() {
      this.set('adminTabIndex', 3);
      this.set('selectedAdminOrCompleteFileIndex', 0);
  }

  closePostit() {
      this.$["postit-notification"].classList.remove('notification')
  }

  createEvent(codeId) {
      this.api.code().getCode(codeId).then(procedure => {
          const service = {
              label: "Actes",
              modified: +new Date(),
              responsible: this.hcp.id,
              content: {
                  fr: {
                      stringValue: procedure.label.fr,
                      medicationValue: null
                  },
                  nl: {
                      stringValue: procedure.label.nl,
                      medicationValue: null
                  },
                  en: {
                      stringValue: procedure.label.en,
                      medicationValue: null
                  }
              },
              codes: [
                  procedure
              ],
              valueDate: +new Date(),
              tags: [
                  {
                      type: "CD-LIFECYCLE",
                      code: "pending",
                      version: "1.0",
                  }
              ]
          }

          if (this.currentContact) {
              this._createService(new CustomEvent("create-service", {
                  detail: {service: service, hes: []},
                  bubbles: true,
                  composed: true
              }))
              this.events.push(service)
              this.set("events", _.sortBy(this.events, it => this.api.moment(it.valueDate)))
          }
      })
  }

  _readEid() {
      fetch('http://127.0.0.1:16042/read')
          .then((response) => {
              return response.json()
          })
          .then(res => {
              if (res.cards[0]) {
                  this.set('cardData', res.cards[0])
              }
          })
  }

  cardDataChanged() {
      if (this.$.therLinkDialog.opened) {
          if (Object.keys(this.cardData).length && this.patient.ssin === this.cardData.nationalNumber) {
              this.set("eidCardNumber", this.cardData.logicalNumber)
          }
      }
  }

  _cardChanged(e) {
      this.set("cardData", e.detail.cardData)
  }

  setSocket() {
      if (!this.socket) return;
      this.socket.on("auto-read-card-eid", cards => {
          const res = JSON.parse(cards)
          if (res.cards[0] && this.patient.ssin === res.cards[0].nationalNumber) {
              this.set('cardData', res.cards[0])
              this.set("eidCardNumber", this.cardData.logicalNumber)
              if (!this.haveTherLinks) {
                  this._registerNationalAndHubTherLink();
              }
          }
      })
  }

  contactChanged(e) {
      this.set("refreshServicesDescription", this.refreshServicesDescription + 1)
  }

  getTypeContact(ctc) {
      const descrPattern = this.user.properties.find(p => p.type.identifier === 'org.taktik.icure.preferred.contactDescription') || "{Motifs de contact}"
      const templateKeys = descrPattern.match(/\{.+?\}/g).map(s => s.substring(1, s.length - 1))
          .reduce((acc, s) => {
              acc[s] = true
              return acc
          }, {})

      ctc.userDescr = this.api.template(descrPattern, ctc.services.filter(s => templateKeys[s.label] && !s.endOfLife).reduce((acc, v) => {
          acc[v.label] = !acc[v.label] ? this.shortServiceDescription(v, this.language) : acc[v.label] + "," + this.shortServiceDescription(v, this.language)
          return acc
      }, {}))
      if (!ctc.userDescr || ctc.userDescr.length < 3) {
          ctc.userDescr = ctc.descr
      }
      const contacttype = ctc.tags.find(tag => tag.type === "BE-CONTACT-TYPE")
      if (contacttype) {
          const code = this.contactTypeList.find(sct => sct.code === contacttype.code)
          if (code && code.label) {
              if (ctc.userDescr && ctc.userDescr != "") {
                  ctc.userDescr = code.label[this.language || "fr"] + " : " + ctc.userDescr
              } else {
                  ctc.userDescr = code.label[this.language || "fr"]
              }
          } else {
              console.log("invalid contact type", ctc, code)
          }
      }

      return ctc.userDescr
  }

  getAtc(med) {
      return med && med.colour && med.colour.substr(med.colour.length - 1)
  }
}

customElements.define(HtPatDetail.is, HtPatDetail);
