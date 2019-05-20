import '@polymer/iron-icon/iron-icon.js'
import '@polymer/paper-button/paper-button.js'
import '@polymer/paper-dialog/paper-dialog.js'
import '@polymer/paper-dropdown-menu/paper-dropdown-menu.js'
import '@polymer/paper-input/paper-input.js'
import '@polymer/paper-item/paper-item.js'
import '@polymer/paper-listbox/paper-listbox.js'
import '../../../dynamic-form/dynamic-link.js';
import '../../../dynamic-form/dynamic-pills.js';
import '../../../ht-spinner/ht-spinner.js';
import '../../../../dropdown-style.js';
import * as models from 'icc-api/dist/icc-api/model/models';
import moment from 'moment/src/moment';
import _ from 'lodash/lodash';
import {TkLocalizerMixin} from "../../../tk-localizer";


import {PolymerElement,html} from '@polymer/polymer/polymer-element.js';
import {mixinBehaviors} from '@polymer/polymer/lib/legacy/class'
import {IronResizableBehavior} from '@polymer/iron-resizable-behavior/iron-resizable-behavior.js';

class HtPatHubDialog extends TkLocalizerMixin(mixinBehaviors([IronResizableBehavior], PolymerElement)) {
  static get template() {
    return html`
        <style include="iron-flex iron-flex-alignment"></style>
        <!--suppress CssUnusedSymbol -->
        <style include="icpc-styles scrollbar-style dropdown-style">

            #dialog .hub-cons {
                display: flex;
                flex-flow: row wrap;
                align-items: center;
                justify-content: flex-start;
                width: 100%;
                box-sizing: border-box;
            }

            #dialog paper-button.action {
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

            #dialog .hub-cons paper-button.action[disabled] {
                background-color: var(--app-secondary-color-dark);
                color: var(--app-text-color-disabled);
                box-shadow: none;
            }

            #dialog .hub-cons .buttons {
                right: 24px;
                position: absolute;
            }

            #dialog .hub-cons vaadin-date-picker {
                margin-right: 8px;
            }

            #dialog a {
                text-decoration: none;
                color: var(--app-secondary-color);
            }

            #dialog {
                position: fixed;
                min-height: 800px;
                min-width: 1024px;
                left: 50vw !important;
                top: 50vh !important;
                transform: translate(-50%, -50%);
            }

            .links {
                position: absolute;
                right: 0;
            }

            .pills {
                float: right;
            }

            dynamic-link {
                float: right;
                top: 4px;
            }

            vaadin-combo-box {
                width: 100%;
            }

            vaadin-text-area {
                width: 100%;
            }

            .containerHubCons {
                height: 58px;
                display: flex;
            }

            #par-search {
                flex: 1;
            }

            #dialog .hub-info {
                margin-top: 0;
                display: flex;
                flex-flow: row nowrap;
                justify-content: flex-start;
                align-items: flex-start;
            }

            #dialog .hub-info div {
                margin-right: 24px;
            }

            #dialog .hub-info div p {
                margin: 8px 0;
            }

            #dialog .hub-info div b {
                margin-right: 8px;
            }

            .modal-title {
                background: var(--app-background-color-dark);
                margin-top: 0;
                padding: 16px 24px;
            }

            paper-tabs {
                --paper-tabs-selection-bar-color: var(--app-secondary-color);
            }

            paper-tab {
                --paper-tab-ink: var(--app-secondary-color);
            }

            paper-tab.iron-selected {
                font-weight: bold;
            }

            paper-tab.iron-selected > iron-icon {
                color: var(--app-secondary-color);
            }

            .tab-selector {
                border-bottom: 1px solid var(--app-background-color-dark);
            }

            .end-buttons {
                display: flex;
                position: absolute;
                right: 0;
                bottom: 0;
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

            .modal-button--cancel {
                background: transparent;
                color: black;
                border: 1px solid var(--app-background-color-dark);
            }

            .modal-button--save {
                box-shadow: var(--shadow-elevation-2dp_-_box-shadow);
                background: var(--app-secondary-color);
                color: var(--app-primary-color-dark);
                font-weight: 700;
            }

            ht-spinner {
                position: relative;
                height: 42px;
                width: 42px;
            }

            #kmehr_slot {
                overflow-y: scroll;
                height: 90%;
            }
        </style>

        <paper-dialog id="dialog" opened="{{opened}}">
            <h2 class="modal-title">[[localize('hub','Hubs',language)]]</h2>
            <div>
                <paper-dropdown-menu id="preferredHub" label="[[localize('cur_hub','Current hub',language)]]">
                    <paper-listbox slot="dropdown-content" attr-for-selected="name" selected="{{curHub}}">
                        <paper-item name="rsb">[[localize('rsw','RSB',language)]]</paper-item>
                        <paper-item name="rsw">[[localize('rsb','RSW',language)]]</paper-item>
                        <paper-item name="vitalink">[[localize('vitalink','Vitalink',language)]]</paper-item>
                    </paper-listbox>
                </paper-dropdown-menu>
                <template is="dom-if" if="[[hubSupportsConsent]]">
                    <p><b>[[localize('hub_hcp_cs','Hcp hub consent',language)]] :</b>
                        [[_getHubHcpConsentDesc(hcpHubConsent)]]</p>
                </template>
            </div>
            <template is="dom-if" if="[[!_HcpHasHubConsent(hcpHubConsent, hubSupportsConsent)]]">
                <p>[[localize('hub_hcp_cs_nok','Hcp hub consent not OK',language)]]</p>
            </template>
            <template is="dom-if" if="[[_HcpHasHubConsent(hcpHubConsent, hubSupportsConsent)]]">
                <template is="dom-if" if="[[hubSupportsConsent]]">
                    <div>
                        <p><b>[[localize('pat_hub_info','Pat Hub info',language)]] : </b>[[_getHubPatientInfoDesc(patientHubInfo)]]
                        </p>
                        <p><b>[[localize('pat_hub_cons','Pat Hub consent',language)]] : </b>[[_getHubPatientConsentDesc(patientHubConsent)]]
                        </p>
                        <p><b>[[localize('hub_tl','Hub therapeutic link',language)]] : </b>[[_getHubPatientTherLinkDesc(patientHubTherLinks)]]
                        </p>
                    </div>
                </template>
                <template is="dom-if" if="[[supportBreakTheGlass]]">
                    <div>
                        <paper-input id="BTG" label="[[localize('BTG_rea','Break the glass reason',language)]]" value="{{breakTheGlassReason}}"></paper-input>
                        <paper-button on-tap="_runGetTransactionList">[[localize('get_lst','Get list',language)]]
                        </paper-button>
                    </div>
                </template>
                <template is="dom-if" if="[[_enableTransactionList(patientHubConsent, hubSupportsConsent)]]">

                    <vaadin-grid id="transaction-list" class="material" overflow="bottom" on-tap="click" items="[[hubTransactionList]]" active-item="{{activeItem}}">
                        <!--file-remove-->
                        <vaadin-grid-column width="30px">
                            <template class="header"></template>
                            <template>
                                <iron-icon class="icon type-icon" icon="vaadin:file-text-o" item="[[item]]" on-tap="_openTransactionViewer"></iron-icon>
                            </template>
                        </vaadin-grid-column>
                        <vaadin-grid-column width="30px">
                            <template class="header"></template>
                            <template>
                                <iron-icon class="icon type-icon" icon="vaadin:file-remove" item="[[item]]" on-tap="_runRevokeHubTransaction"></iron-icon>
                            </template>
                        </vaadin-grid-column>
                        <vaadin-grid-column width="120px">
                            <template class="header">[[localize('trans_typ','Type',language)]]</template>
                            <template>
                                <div class="cell frozen">[[_transactionType(item)]]</div>
                            </template>
                        </vaadin-grid-column>
                        <vaadin-grid-column width="120px">
                            <template class="header">
                                <vaadin-grid-sorter path="description">[[localize('trans_id','Id',language)]]
                                </vaadin-grid-sorter>
                            </template>
                            <template>
                                <div class="cell frozen">[[_transactionId(item)]]</div>
                            </template>
                        </vaadin-grid-column>
                        <vaadin-grid-column width="80px">
                            <template class="header">[[localize('trans_dat','Date',language)]]</template>
                            <template>
                                <div class="cell frozen">[[_transactionDate(item)]]</div>
                            </template>
                        </vaadin-grid-column>
                        <vaadin-grid-column width="80px">
                            <template class="header">[[localize('trans_aut','Author',language)]]</template>
                            <template>
                                <div class="cell frozen">[[_transactionAuthor(item)]]</div>
                            </template>
                        </vaadin-grid-column>
                    </vaadin-grid>
                    <!--<paper-input id="currentTrans" label="[[localize('hub_sel_tra','Selected transaction',language)]]" value="{{_transactionId(selectedTransaction)}}"></paper-input>-->
                    <!--<paper-button on-tap="_showTransaction">get transaction</paper-button>-->
                    <!--<paper-button on-tap="_openTransactionViewer">view transaction</paper-button>-->
                    <paper-button on-tap="_runGetHubPatient">Get Patient</paper-button>
                    <paper-button on-tap="_runPutHubPatient">Put Patient</paper-button>
                    <paper-button on-tap="_runPutSumehr">Put Sumehr</paper-button>
                    <paper-button on-tap="_getTSfromFileAndPut">Put TSet</paper-button>
                    <!--<paper-button on-tap="_runRevokeHubTransaction">Revoke transaction</paper-button>-->
                    <paper-button on-tap="_generateSumehr">Generate sumehr</paper-button>
                    <paper-button on-tap="_runGenerateMedicationScheme">Generate medicationscheme</paper-button>
                    <paper-button on-tap="_runPutMedicationScheme">Put medicationscheme</paper-button>
                </template>
                <template is="dom-if" if="[[_enableRegisterConsent(patientHubConsent, hubSupportsConsent)]]">
                    <paper-input id="idCardNo" label="[[localize('eid_no','eID Card Number',language)]]" value="{{eidCardNumber}}"></paper-input>
                    <paper-input id="isiCardNo" label="[[localize('isi_no','ISI+ Card Number',language)]]" value="{{isiCardNumber}}"></paper-input>
                </template>

                <!--<paper-button on-tap="_getConsent">[[localize('get_cons','Get consent',language)]]</paper-button>-->
                <div class="buttons">
                    <!--<paper-button on-tap="_revokeConsent" dialog-confirm>[[localize('revoke_cons','Revoke consent',language)]]</paper-button>-->
                    <template is="dom-if" if="[[_enableRegisterConsent(patientHubConsent, hubSupportsConsent)]]">
                        <paper-button class="modal-button" on-tap="_registerHubPatientConsent" dialog-confirm="">
                            [[localize('register_cons','Register consent',language)]]
                        </paper-button>
                        <paper-button class="modal-button" on-tap="_registerHubPatientTherapeuticLink" dialog-confirm="">
                            [[localize('register_therlink','Register therapeutic link',language)]]
                        </paper-button>
                        <paper-button class="modal-button" on-tap="_runRegisterHubPatient" dialog-confirm="">
                            [[localize('register','Register',language)]]
                        </paper-button>
                    </template>
                    <!--<template is="dom-if" if="[[_enableRevokeConsent(patientHubConsent, hubSupportsConsent)]]">-->
                    <!--<paper-button on-tap="_revokeHubPatientConsent" dialog-confirm>[[localize('revoke_cons','Revoke consent',language)]]</paper-button>-->
                    <!--<paper-button on-tap="_revokeHubPatientTherapeuticLink" dialog-confirm>[[localize('revoke_therlink','Revoke therapeutic link',language)]]</paper-button>-->
                    <!--</template>-->
                </div>
            </template>
            <div class="end-buttons">
                <ht-spinner active="[[isLoading]]"></ht-spinner>
                <paper-button class="modal-button--cancel" dialog-dismiss="" autofocus="">
                    [[localize('can','Cancel',language)]]
                </paper-button>
            </div>

        </paper-dialog>
        <ht-pat-hub-transaction-view id="transactionViewDialog" api="[[api]]" user="[[user]]" language="[[language]]" patient="[[patient]]" i18n="[[i18n]]" current-contact="[[currentContact]]" resources="[[resources]]"></ht-pat-hub-transaction-view>
`;
  }

  static get is() {
      return 'ht-pat-hub-dialog';
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
          language: {
              type: String
          },
          opened: {
              type: Boolean,
              value: false
          },
          tabs: {
              type: Number,
              value: 0
          },
          isLoading: {
              type: Boolean,
              value: false
          },
          activeItem: {
              type: Object,
              observer: '_activeItemChanged'
          },
          eidCardNumber: {
              type: String,
              value: '',
          },
          isiCardNumber: {
              type: String,
              value: '',
          },
          curHub: {
              type: String,
              value: null,
              observer: '_curHubChanged'
          },
          curEnv: {
              type: String,
              value: null
          },
          hubId: {
              type: Number,
              value: 0
          }
          ,
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
          hcpHubConsent: {
              type: Object
          },
          patientHubConsent: {
              type: Object
          },
          patientHubTherLinks: {
              type: Object
          },
          patientHubInfo: {
              type: Object
          },
          hcpZip: {
              type: String,
              value: '1000'
          },
          hubTransactionList: {
              type: Array,
              value: function () {
                  return [];
              }
          },
          selectedTransaction: {
              type: Object
          },
          revokeTransactionResp: {
              type: String,
              value: ""
          },
          supportBreakTheGlass: {
              type: Boolean,
              value: false
          },
          breakTheGlassReason: {
              type: String,
              value: null
          }
      };
  }

  static get observers() {
      return ['apiReady(api,user,opened)'];
  }

  ready() {
      super.ready();
      this.addEventListener('iron-resize', () => this.onWidthChange());
      document.addEventListener('xmlHubUpdated', () => this.xmlHubListener());
  }

  _dateFormat(date) {
      return date ? this.api.moment(date).format('DD/MM/YYYY') : '';
  }

  onWidthChange() {
      const offsetWidth = this.$.dialog.offsetWidth;
      const offsetHeight = this.$.dialog.offsetHeight;
      if (!offsetWidth || !offsetHeight) {
          return;
      }
  }

  apiReady() {
      if (!this.api || !this.user || !this.user.id || !this.opened) return;

      try {
      } catch (e) {
          console.log(e);
      }
  }

  attached() {
      super.attached();
      this.async(this.notifyResize, 1);
  }

  open() {
      this.$.dialog.open();
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
      this.set("curHub", propHub.typedValue.stringValue);
      this.set("curEnv", propEnv.typedValue.stringValue);
      this.set("supportBreakTheGlass", false);
      this._setHub();
  }

  _enableBreakTheGlass(btg) {
      return btg;
  }

  _enableTransactionList(hubconsent, supportConsent) {
      return this._patientHasHubConsent(hubconsent) || !supportConsent;
  }

  _enableRegisterConsent(hubconsent, supportConsent) {
      return !this._patientHasHubConsent(hubconsent) && supportConsent;
  }

  _enableRevokeConsent(hubconsent, supportConsent) {
      return this._patientHasHubConsent(hubconsent) && supportConsent;
  }


  _curHubChanged() {
      this._setHub();
  }

  _setHub() {
      this.set('isLoading', true);
      this.set('hcpHubConsent', null);
      this.set('patientHubConsent', null);
      this.set('patientHubTherLinks', null);
      this.set('hubTransactionList', null);
      this.set('patientHubInfo', null);
      this.set('breakTheGlassReason', null);
      switch (this.curHub) {
          case 'rsb':
              this.hubId = 1990000728;
              this.hubEndPoint = this.curEnv === 'acc' ? 'https://acchub.abrumet.be/hubservices/intrahub/v3/intrahub.asmx' : 'https://hub.abrumet.be/hubservices/intrahub/v3/intrahub.asmx';
              this.set("hubSupportsConsent", true);
              this.hubPackageId = null;
              this.hubApplication = "RSB";//TODO: verify value
              this.set("supportBreakTheGlass", false);
              break;
          case 'rsw':
              this.hubId = 1990000035;
              this.hubEndPoint = this.curEnv === 'acc' ? 'https://acchub.reseausantewallon.be/HubServices/IntraHub/V3/IntraHub.asmx' : 'https://hub.reseausantewallon.be/HubServices/IntraHub/V3/IntraHub.asmx';
              this.set("hubSupportsConsent", true);
              this.hubPackageId = null;
              this.hubApplication = "RSW";
              this.set("supportBreakTheGlass", false);
              break;
          case 'cozo':
              this.hubEndPoint = this.curEnv === 'acc' ? '' : '';
              this.set("hubSupportsConsent", true);
              this.hubPackageId = null;
              this.hubApplication = null;
              this.set("supportBreakTheGlass", false);
              break;
          case 'vitalink':
              this.hubId = 1990001916;
              this.hubEndPoint = this.curEnv === 'acc' ? 'https://vitalink-acpt.ehealth.fgov.be/vpmg/vitalink-gateway/IntraHubService' : 'https://vitalink.ehealth.fgov.be/vpmg/vitalink-gateway/IntraHubService';
              this.set("hubSupportsConsent", false);
              this.hubPackageId = this.curEnv === 'acc' ? "ACC_73424e1e-7eab-4b2c-9a8d-90a2bd1c078f" : "PROD_82fa1e06-7efc-4d84-8f4c-f88513009b9e"; //TODO: replace Pricare by TOPAZ Keys
              this.hubApplication = "VITALINKGATEWAY";
              this.set("supportBreakTheGlass", true);
              break
      }

      if (this.hubSupportsConsent) this._getHubHcpConsent().then(consentResp => this.set('hcpHubConsent', consentResp)).catch(error => {
          console.log(error);
      });
      if (this.hubSupportsConsent) this._getHubPatientConsent().then(consentResp => this.set('patientHubConsent', consentResp)).catch(error => {
          console.log(error);
      });
      if (this.hubSupportsConsent) this._getHubTherapeuticLinks().then(tlResp => this.set('patientHubTherLinks', tlResp)).catch(error => {
          console.log(error);
      });
      this._getHubTransactionList().then(tranResp => {
          this.set('hubTransactionList', tranResp);
          this.set('isLoading', false);
      }).catch(error => {
          this.set('isLoading', false);
          console.log(error);
      });

      if (this.hubSupportsConsent) {
          this.putHubPatient().then(putResp => {
              this.getHubPatient().then(hubPat => this.set('patientHubInfo', hubPat)).catch(error => {
                  console.log(error);
              })
          }).catch(error => {
              console.log(error);
          })
      }
  }

  close() {
      this.$.dialog.close();
  }

  _activeItemChanged(item) {

  }

  click(e) {
      const selected = this.activeItem;
      if (selected) {
          this.set('selectedTransaction', selected);
      }
      //this.dispatchEvent(new CustomEvent('selection-messages-change', { detail: { selection: { item: this.selectedMessages } } }));
      //console.log("selectedMessage",this.selectedMessages)
  }

  _runGetTransactionList() {
      this.set('isLoading', true);
      this._getHubTransactionList().then(tranResp => {
          this.set('isLoading', false);
          this.set('hubTransactionList', tranResp)
      }).catch(error => {
          console.log(error);
          this.set('isLoading', false);
      });
  }

  _runPutSumehr() {
      this.generateAndPutSumehr().then(putResp => {
          this.set('putTransactionResponse', putResp);
          this._getHubTransactionList().then(tranResp => this.set('hubTransactionList', tranResp));
      }).catch(error => {
          console.log(error);
      });
  }

  generateAndPutSumehr() {
      if (this.patient && this.patient.ssin && this.api.tokenId) {
          return this.api.hcparty().getHealthcareParty(this.user.healthcarePartyId).then(hcp =>
              this.api.patient().getPatientWithUser(this.user, this.patient.id)
                  .then(patientDto =>
                      this.api.crypto().extractDelegationsSFKs(patientDto, this.user.healthcarePartyId)
                          .then(secretForeignKeys =>
                              this.api.bekmehr().generateSumehrExportWithEncryptionSupport(patientDto.id, this.user.healthcarePartyId, "fr", {
                                  secretForeignKeys: secretForeignKeys.extractedKeys,
                                  recipient: hcp,
                                  comment: "mycomment"
                              }).then(output =>
                                  this.api.hcparty().getHealthcareParty(this.user.healthcarePartyId)
                                      .then(hcp => this.api.fhc().Hubcontroller().putTransactionUsingPOST(this.hubEndPoint,
                                          this.api.keystoreId, this.api.tokenId, this.api.credentials.ehpassword,
                                          hcp.lastName, hcp.firstName, hcp.nihii, hcp.ssin, this.hcpZip,
                                          this.hubId,
                                          this.patient.ssin,
                                          output,
                                          this.hubPackageId, this.hubApplication
                                          )
                                      ).then(putResp => {
                                          if (putResp) {
                                              return putResp;
                                          } else {
                                              return null;
                                          }
                                      }
                                  )
                              )
                          )
                  ))
      } else {
          return Promise.resolve(null)
      }
  }

  _generateSumehr() {
      if (this.patient) {
          this.api.hcparty().getHealthcareParty(this.user.healthcarePartyId).then(hcp =>
              this.api.patient().getPatientWithUser(this.user, this.patient.id)
                  .then(patientDto =>
                      this.api.crypto()
                          .extractDelegationsSFKs(patientDto, this.user.healthcarePartyId)
                          .then(secretForeignKeys => {
                              return this.api.bekmehr().generateSumehrExportWithEncryptionSupport(patientDto.id, this.user.healthcarePartyId, "fr", {
                                  secretForeignKeys: secretForeignKeys.extractedKeys,
                                  recipient: hcp,
                                  comment: "mycomment"
                              }).then(output => {
                                  //creation of the xml file
                                  let file = typeof output === "string" ? new Blob([output], {type: "application/xml"}) : output

                                  //creation the downloading link
                                  let a = document.createElement("a");
                                  document.body.appendChild(a);
                                  a.style = "display: none";

                                  //download the new file
                                  let url = window.URL.createObjectURL(file);
                                  a.href = url;
                                  a.download = (patientDto.lastName || "Doe").replace(" ", "_") + "_" + (patientDto.firstName || "John").replace(" ", "_") + "_" + (moment().format("x")) + "_sumehr.xml";
                                  a.click();
                                  window.URL.revokeObjectURL(url);

                                  document.body.removeChild(a);
                              }).catch(error => console.log(error))
                          })
                  ))
      }
  }

  _runGenerateMedicationScheme() {
      this._generateMedicationScheme(1)
  }

  //generateMedicationSchemeExport(patientId: string,language?: string,version?: number,body?: models.MedicationSchemeExportInfoDto
  _generateMedicationScheme(versionNumber) {
      if (this.patient) {
          this.api.hcparty().getHealthcareParty(this.user.healthcarePartyId).then(hcp =>
              this.api.patient().getPatientWithUser(this.user, this.patient.id)
                  .then(patientDto =>
                      this.api.crypto()
                          .extractDelegationsSFKs(patientDto, this.user.healthcarePartyId)
                          .then(secretForeignKeys => {
                              return this.api.bekmehr().generateMedicationSchemeWithEncryptionSupport(patientDto.id, this.user.healthcarePartyId, "fr", versionNumber, {
                                  secretForeignKeys: secretForeignKeys.extractedKeys,
                                  recipient: hcp,
                                  comment: "mycomment"
                              }).then(output => {
                                  //creation of the xml file
                                  let file = typeof output === "string" ? new Blob([output], {type: "application/xml"}) : output

                                  //creation the downloading link
                                  let a = document.createElement("a");
                                  document.body.appendChild(a);
                                  a.style = "display: none";

                                  //download the new file
                                  let url = window.URL.createObjectURL(file);
                                  a.href = url;
                                  a.download = (patientDto.lastName || "Doe").replace(" ", "_") + "_" + (patientDto.firstName || "John").replace(" ", "_") + "_" + (moment().format("x")) + "medicationscheme.xml";
                                  a.click();
                                  window.URL.revokeObjectURL(url);

                                  document.body.removeChild(a);
                              }).catch(error => console.log(error))
                          })
                  ))
      }
  }

  _runPutMedicationScheme() {
      const versionNumber = 23;
      this.generateAndPutMedicationScheme(versionNumber).then(putResp => {
          this.set('putTransactionSetResponse', putResp);
          //this._getHubTransactionList().then(tranResp => this.set('hubTransactionList', tranResp));
      }).catch(error => {
          console.log(error);
      });
  }

  generateAndPutMedicationScheme(versionNumber) {
      if (this.patient) {
          return this.api.hcparty().getHealthcareParty(this.user.healthcarePartyId).then(hcp =>
              this.api.patient().getPatientWithUser(this.user, this.patient.id)
                  .then(patientDto =>
                      this.api.crypto()
                          .extractDelegationsSFKs(patientDto, this.user.healthcarePartyId)
                          .then(secretForeignKeys => {
                              return this.api.bekmehr().generateMedicationSchemeWithEncryptionSupport(patientDto.id, this.user.healthcarePartyId, "fr", versionNumber, {
                                  secretForeignKeys: secretForeignKeys.extractedKeys,
                                  recipient: hcp,
                                  comment: "mycomment"
                              }).then(output => {
                                      return this.api.fhc().Hubcontroller().putTransactionSetUsingPOST(this.hubEndPoint,
                                          this.api.keystoreId, this.api.tokenId, this.api.credentials.ehpassword,
                                          hcp.lastName, hcp.firstName, hcp.nihii, hcp.ssin, this.hcpZip,
                                          this.hubId,
                                          this.patient.ssin,
                                          output,
                                          this.hubPackageId, this.hubApplication
                                      )
                                  }
                              )
                          })
                  ))
      }
  }

  _transactionId(tr) {
      this.set('selectedTransaction', tr); //is this needed ?
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
          let d = new Date(0);
          d.setUTCMilliseconds(tr.date);
          return d.toDateString();
      } else {
          return "";
      }
  }

  _transactionAuthor(tr) {
      let authorRes = "--";
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
  }

  _patientHasHubConsent(cs) {
      if ((cs && cs.author && cs.author.hcparties && cs.author.hcparties[0]) || !this.hubSupportsConsent) {
          return true;
      } else {
          return false;
      }
  }

  _HcpHasHubConsent(cs, consentSupport) {
      let betweendates = false;
      const currentdate = new Date().getTime();
      if (cs && cs.signdate) {
          betweendates = cs.signdate <= currentdate;
      }
      if (betweendates && cs && cs.revokedate) {
          betweendates = cs.revokedate >= currentdate;
      }
      return !consentSupport || betweendates;
  }

  _getHubHcpConsentDesc(cs) {
      let desc = '';
      //hub
      if (cs && cs.author && cs.author && cs.author.hcparties && cs.author.hcparties[0]) {
          desc += cs.author.hcparties[0].name + ' ';
      }
      if (cs && cs.hcparty && cs.hcparty.ids) {
          //hcp
          desc += this.localize("hcp", "Hcp", this.language) + " : " + "[" + cs.hcparty.ids.find(id => id.s === 'ID-HCPARTY').value + "] ";
          desc += cs.hcparty.ids.find(id => id.s === 'INSS').value + " ";
      }
      if (cs && cs.signdate) {
          //sign
          desc += this.localize("from", "From ", this.language) + " : " + this.api.moment(cs.signdate).format('DD/MM/YYYY') + " ";
      }
      if (cs && cs.revokedate) {
          //revoke
          desc += this.localize("to", "To", this.language) + " : " + this.api.moment(cs.revokedate).format('DD/MM/YYYY') + " ";
      }
      return desc;
  }

  getHubEndPoint() {
      return this.hubEndPoint;
  }

  _getHubHcpConsent() {
      //getHcpConsentUsingGET: function (endpoint, keystoreId, tokenId, passPhrase, hcpNihii, hcpSsin, hcpZip)
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

  _getHubPatientInfoDesc(pi) {
      if (pi) {
          return pi.firstName + " " + pi.lastName + " [" + this.localize(pi.gender, pi.gender, this.language) + "]";
      } else {
          return this.localize("pat_not_hub", "Patient does not exist on hub.", this.language);
      }
  }

  _getHubPatientTherLinkDesc(tl) {
      let desc = '';
      desc = tl;
      return desc;
  }

  _getHubPatientConsentDesc(cs) {
      let desc = '';
      // author - sign date - type
      // author - fname lname niss nihii

      if (cs && cs.cds && cs.cds.find(cd => cd.s === 'CD_CONSENTTYPE')) {
          desc += cs.cds.find(cd => cd.s === 'CD_CONSENTTYPE').value + " : ";
      }

      if (cs && cs.author && cs.author.hcparties && cs.author.hcparties[0]) {
          const hcp = cs.author.hcparties[0]
          desc += hcp.familyname + ' ' + hcp.firstname;
          desc += ' [' + hcp.ids.find(id => id.s === 'ID-HCPARTY').value + ']';
      }
      if (cs && cs.signdate) {
          desc += ' ' + this.api.moment(cs.signdate).format('DD/MM/YYYY');
      }
      return desc;
  }


  _runGetHubPatient() {
      this.getHubPatient().then(hubPat => this.set('patientHubInfo', hubPat));
  }

  //getPatientUsingGET(
  // endpoint: string,
  // xFHCKeystoreId: string, xFHCTokenId: string, xFHCPassPhrase: string,
  // hcpLastName: string, hcpFirstName: string, hcpNihii: string, hcpSsin: string, hcpZip: string,
  // patientSsin: string, hubPackageId?: string): Promise<models.Patient | any>;
  getHubPatient() {
      if (this.patient.ssin && this.api.tokenId) {
          return this.api.hcparty().getHealthcareParty(this.user.healthcarePartyId)
              .then(hcp =>
                  this.api.fhc().Hubcontroller().getPatientUsingGET(this.hubEndPoint,
                      this.api.keystoreId, this.api.tokenId, this.api.credentials.ehpassword,
                      hcp.lastName, hcp.firstName, hcp.nihii, hcp.ssin, this.hcpZip,
                      this.patient.ssin)
              ).then(patResp => {
                      if (patResp) {
                          return patResp;
                      } else {
                          return null;
                      }
                  }
              )
      } else {
          return Promise.resolve(null)
      }
  }

  _runPutHubPatient() {
      this.putHubPatient().then(hubPat => this.set('putPatientResult', hubPat));
  }

  //putPatientUsingPOST(
  // endpoint: string,
  // xFHCKeystoreId: string, xFHCTokenId: string, xFHCPassPhrase: string,
  // hcpLastName: string, hcpFirstName: string, hcpNihii: string, hcpSsin: string, hcpZip: string,
  // patientSsin: string, firstName: string, lastName: string, gender: string, dateOfBirth: number,
  // hubPackageId?: string): Promise<models.Patient | any>;
  putHubPatient() {
      if (this.patient.ssin && this.api.tokenId) {
          return this.api.hcparty().getHealthcareParty(this.user.healthcarePartyId)
              .then(hcp =>
                  this.api.fhc().Hubcontroller().putPatientUsingPOST(this.hubEndPoint,
                      this.api.keystoreId, this.api.tokenId, this.api.credentials.ehpassword,
                      hcp.lastName, hcp.firstName, hcp.nihii, hcp.ssin, this.hcpZip,
                      this.patient.ssin, this.patient.firstName, this.patient.lastName, this.patient.gender, this.patient.dateOfBirth)
              ).then(patResp => {
                      if (patResp) {
                          return patResp;
                      } else {
                          return null;
                      }
                  }
              )
      } else {
          return Promise.resolve(null)
      }
  }

  _getHubPatientConsent() {
      //getPatientConsentUsingGET1: function (endpoint, keystoreId, tokenId, passPhrase, hcpNihii, hcpSsin, hcpZip, patientSsin)
      if (this.patient.ssin && this.api.tokenId) {
          return this.api.hcparty().getHealthcareParty(this.user.healthcarePartyId)
              .then(hcp =>
                  this.api.fhc().Hubcontroller().getPatientConsentUsingGET1(this.hubEndPoint, this.api.keystoreId,
                      this.api.tokenId, this.api.credentials.ehpassword,
                      hcp.lastName, hcp.firstName, hcp.nihii, hcp.ssin, this.hcpZip,
                      this.patient.ssin)
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

  _runRegisterHubPatient() {
      this._registerHubPatientConsent().then(consResp => this.set('registerConsentResp', consResp)).catch(error => console.log(error))
      this._registerHubPatientTherapeuticLink().then(tlResp => this.set('registerTLResp', tlResp)).catch(error => console.log(error))
  }

  _registerHubPatientConsent() {
      //registerPatientConsentUsingPOST1(
      // endpoint: string,
      // xFHCKeystoreId: string, xFHCTokenId: string, xFHCPassPhrase: string,
      // hcpLastName: string, hcpFirstName: string, hcpNihii: string, hcpSsin: string, hcpZip: string,
      // patientSsin: string,
      // hubPackageId?: string,
      // patientEidCardNumber?: string): Promise<any | Boolean>;
      if (this.patient.ssin && this.api.tokenId) {
          return this.api.hcparty().getHealthcareParty(this.user.healthcarePartyId).then(hcp =>
              this.api.fhc().Hubcontroller().registerPatientConsentUsingPOST1(this.hubEndPoint,
                  this.api.keystoreId, this.api.tokenId, this.api.credentials.ehpassword,
                  hcp.lastName, hcp.firstName, hcp.nihii, hcp.ssin, this.hcpZip,
                  this.patient.ssin, this.hubPackageId, this.eidCardNumber)
          ).then(consResp => {
                  if (consResp.therapeuticLink) {
                      //this.showPatientTherLinkState()
                      return (consResp.therapeuticLink)
                  } else {
                      return Promise.resolve(null)
                  }
              }
          )
      } else {
          return Promise.resolve(null)
      }
  }

  _getHubTherapeuticLinks() {
      //getTherapeuticLinksUsingGET(
      // endpoint: string,
      // xFHCKeystoreId: string, xFHCTokenId: string, xFHCPassPhrase: string,
      // hcpLastName: string, hcpFirstName: string, hcpNihii: string, hcpSsin: string, hcpZip: string,
      // patientSsin: string,
      // hubPackageId?: string,
      // therLinkType?: string,
      // from?: Date,
      // to?: Date): Promise<Array<models.TherapeuticLink> | any>;
      if (this.patient.ssin && this.api.tokenId) {
          return this.api.hcparty().getHealthcareParty(this.user.healthcarePartyId)
              .then(hcp =>
                  this.api.fhc().Hubcontroller().getTherapeuticLinksUsingGET(this.hubEndPoint,
                      this.api.keystoreId, this.api.tokenId, this.api.credentials.ehpassword,
                      hcp.lastName, hcp.firstName, hcp.nihii, hcp.ssin, this.hcpZip,
                      this.patient.ssin,
                      this.hubPackageId)
              ).then(tlResp => {
                      if (tlResp) {
                          return tlResp;
                      } else {
                          return null;
                      }
                  }
              )
      } else {
          return Promise.resolve(null)
      }
  }

  _registerHubPatientTherapeuticLink() {
      //registerTherapeuticLinkUsingPOST(
      // endpoint: string,
      // xFHCKeystoreId: string, xFHCTokenId: string, xFHCPassPhrase: string,
      // hcpLastName: string, hcpFirstName: string, hcpNihii: string, hcpSsin: string, hcpZip: string,
      // patientSsin: string,
      // hubPackageId?: string,
      // patientEidCardNumber?: string): Promise<any | Boolean>;
      if (this.patient.ssin && this.api.tokenId) {
          return this.api.hcparty().getHealthcareParty(this.user.healthcarePartyId).then(hcp =>
              this.api.fhc().Hubcontroller().registerTherapeuticLinkUsingPOST(this.hubEndPoint,
                  this.api.keystoreId, this.api.tokenId, this.api.credentials.ehpassword,
                  hcp.lastName, hcp.firstName, hcp.nihii, hcp.ssin, this.hcpZip,
                  this.patient.ssin,
                  this.hubPackageId,
                  this.eidCardNumber)
          ).then(therLinkResp => {
                  if (therLinkResp.therapeuticLink) {
                      //this.showPatientTherLinkState()
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

  _revokeHubPatientTherapeuticLink() {
      //TODO: implement, does not exist in FHC
  }

  _getHubTransactionList() {
      //getTransactionsListUsingGET(
      // endpoint: string,
      // xFHCKeystoreId: string, xFHCTokenId: string, xFHCPassPhrase: string,
      // hcpLastName: string, hcpFirstName: string, hcpNihii: string, hcpSsin: string, hcpZip: string,
      // patientSsin: string,
      // hubPackageId?: string,
      // from?: number, to?: number,
      // authorNihii?: string, authorSsin?:  string,
      // isGlobal?: boolean, breakTheGlassReason?: string): Promise<Array<models.TransactionSummary> | any>;
      if (this.patient.ssin && this.api.tokenId) {
          return this.api.hcparty().getHealthcareParty(this.user.healthcarePartyId)
              .then(hcp =>
                  this.api.fhc().Hubcontroller().getTransactionsListUsingGET(
                      this.hubEndPoint,
                      this.api.keystoreId, this.api.tokenId, this.api.credentials.ehpassword,
                      hcp.lastName, hcp.firstName, hcp.nihii, hcp.ssin, this.hcpZip,
                      this.patient.ssin,
                      null,
                      null, null,
                      null, null,
                      null, this.breakTheGlassReason
                  )
              ).then(tranResp => {
                      if (tranResp) {
                          return tranResp;
                      } else {
                          return null;
                      }
                  }
              )
      } else {
          return Promise.resolve(null)
      }
  }

  _openTransactionViewer_old(e) {
      e.stopPropagation();
      if (e && e.target && e.target.item) {
          this.set("selectedTransaction", e.target.item)
          this.$.transactionViewDialog.open(e.target.item, this._getHubTransaction(e.target.item));
      }
  }

  _openTransactionViewer(e) {
      e.stopPropagation();
      if (e && e.target && e.target.item) {
          this.set("selectedTransaction", e.target.item)
          this.$.transactionViewDialog.open(e.target.item, this._getHubTransactionMessage(e.target.item));
      }
  }

  _isTransactionSet(tr) {
      let cd = tr.cds.find(cd => cd.value.toLowerCase() === 'gettransactionset');
      if (cd) {
          return true;
      } else {
          return false;
      }
  }

  _getHubTransaction(transaction) {
      //getTransactionUsingGET(
      // endpoint: string,
      // xFHCKeystoreId: string, xFHCTokenId: string, xFHCPassPhrase: string,
      // hcpLastName: string, hcpFirstName: string, hcpNihii: string, hcpSsin: string, hcpZip: string,
      // ssin: string, sv: string, sl: string, id: string,
      // hubPackageId?: string, breakTheGlassReason?: string): Promise<string | any>;
      if (transaction && this._isTransactionSet(transaction)) {
          return this._getHubTransactionSet(transaction);
      } else {
          if (this.patient.ssin && this.api.tokenId && transaction) {
              return this.api.hcparty().getHealthcareParty(this.user.healthcarePartyId)
                  .then(hcp =>
                      this.api.fhc().Hubcontroller().getTransactionUsingGET(this.hubEndPoint, this.api.keystoreId,
                          this.api.tokenId, this.api.credentials.ehpassword,
                          hcp.lastName, hcp.firstName, hcp.nihii, hcp.ssin, this.hcpZip,
                          this.patient.ssin,
                          transaction.ids.find(id => id.s === 'LOCAL').sv, transaction.ids.find(id => id.s === 'LOCAL').sl, transaction.ids.find(id => id.s === 'LOCAL').value,
                          this.hubPackageId, this.breakTheGlassReason
                      )
                  ).then(tranResp => {
                          if (tranResp) {
                              return tranResp;
                          } else {
                              return null;
                          }
                      }
                  )
          } else {
              return Promise.resolve(null)
          }
      }
  }

  _getHubTransactionMessage(transaction) {
      //getTransactionUsingGET(
      // endpoint: string,
      // xFHCKeystoreId: string, xFHCTokenId: string, xFHCPassPhrase: string,
      // hcpLastName: string, hcpFirstName: string, hcpNihii: string, hcpSsin: string, hcpZip: string,
      // ssin: string, sv: string, sl: string, id: string,
      // hubPackageId?: string, breakTheGlassReason?: string): Promise<string | any>;
      if (transaction && this._isTransactionSet(transaction)) {
          return this._getHubTransactionSetMessage(transaction);
      } else {
          if (this.patient.ssin && this.api.tokenId && transaction) {
              return this.api.hcparty().getHealthcareParty(this.user.healthcarePartyId)
                  .then(hcp =>
                      this.api.fhc().Hubcontroller().getTransactionMessageUsingGET(this.hubEndPoint, this.api.keystoreId,
                          this.api.tokenId, this.api.credentials.ehpassword,
                          hcp.lastName, hcp.firstName, hcp.nihii, hcp.ssin, this.hcpZip,
                          this.patient.ssin,
                          transaction.ids.find(id => id.s === 'LOCAL').sv, transaction.ids.find(id => id.s === 'LOCAL').sl, transaction.ids.find(id => id.s === 'LOCAL').value,
                          this.hubPackageId, this.breakTheGlassReason
                      )
                  ).then(tranResp => {
                          if (tranResp) {
                              return tranResp;
                          } else {
                              return null;
                          }
                      }
                  )
          } else {
              return Promise.resolve(null)
          }
      }
  }

  _runRevokeHubTransaction(e) {
      e.stopPropagation();
      if (e && e.target && e.target.item) {
          this.set("selectedTransaction", e.target.item);
          this._revokeHubTransaction(e.target.item).then(tranResp => {
              this.set("revokeTransactionResp", tranResp);
              this._getHubTransactionList().then(tranResp => this.set('hubTransactionList', tranResp));
          })
      }
  }

  //revokeTransactionUsingDELETE(
  // endpoint: string,
  // xFHCKeystoreId: string, xFHCTokenId: string, xFHCPassPhrase: string,
  // hcpLastName: string, hcpFirstName: string, hcpNihii: string, hcpSsin: string, hcpZip: string,
  // ssin: string,
  // sv: string, sl: string, id: string,
  // hubPackageId?: string, breakTheGlassReason?: string): Promise<string | any>;
  _revokeHubTransaction(transaction) {
      if (this.patient.ssin && this.api.tokenId && transaction) {
          return this.api.hcparty().getHealthcareParty(this.user.healthcarePartyId)
              .then(hcp => this.api.fhc().Hubcontroller().revokeTransactionUsingDELETE(this.hubEndPoint,
                  this.api.keystoreId, this.api.tokenId, this.api.credentials.ehpassword,
                  hcp.lastName, hcp.firstName, hcp.nihii, hcp.ssin, this.hcpZip,
                  this.patient.ssin,
                  transaction.ids.find(id => id.s === 'LOCAL').sv, transaction.ids.find(id => id.s === 'LOCAL').sl, transaction.ids.find(id => id.s === 'LOCAL').value,
                  this.hubPackageId, null
                  ) //TODO: add break the glass reason
              ).then(tranResp => {
                      if (tranResp) {
                          return tranResp;
                      } else {
                          return null;
                      }
                  }
              )
      } else {
          return Promise.resolve(null)
      }
  }

  //breakTheGlassReason
  _getHubTransactionSet(transaction) {
      //getTransactionSetUsingGET(
      // endpoint: string,
      // xFHCKeystoreId: string, xFHCTokenId: string, xFHCPassPhrase: string,
      // hcpLastName: string, hcpFirstName: string, hcpNihii: string, hcpSsin: string, hcpZip: string,
      // ssin: string, sv: string, sl: string, id: string,
      // hubPackageId?: string, breakTheGlassReason?: string): Promise<string | any>;
      if (this.patient.ssin && this.api.tokenId && transaction) {
          return this.api.hcparty().getHealthcareParty(this.user.healthcarePartyId)
              .then(hcp =>
                  this.api.fhc().Hubcontroller().getTransactionSetUsingGET(this.hubEndPoint, this.api.keystoreId,
                      this.api.tokenId, this.api.credentials.ehpassword,
                      hcp.lastName, hcp.firstName, hcp.nihii, hcp.ssin, this.hcpZip,
                      this.patient.ssin,
                      transaction.ids.find(id => id.s === 'LOCAL').sv, transaction.ids.find(id => id.s === 'LOCAL').sl, transaction.ids.find(id => id.s === 'LOCAL').value,
                      this.hubPackageId, this.breakTheGlassReason
                  )
              ).then(tranResp => {
                      if (tranResp) {
                          return tranResp;
                      } else {
                          return null;
                      }
                  }
              )
      } else {
          return Promise.resolve(null)
      }
  }

  _getHubTransactionSetMessage(transaction) {
      //getTransactionSetUsingGET(
      // endpoint: string,
      // xFHCKeystoreId: string, xFHCTokenId: string, xFHCPassPhrase: string,
      // hcpLastName: string, hcpFirstName: string, hcpNihii: string, hcpSsin: string, hcpZip: string,
      // ssin: string, sv: string, sl: string, id: string,
      // hubPackageId?: string, breakTheGlassReason?: string): Promise<string | any>;
      if (this.patient.ssin && this.api.tokenId && transaction) {
          return this.api.hcparty().getHealthcareParty(this.user.healthcarePartyId)
              .then(hcp =>
                  this.api.fhc().Hubcontroller().getTransactionSetMessageUsingGET(this.hubEndPoint, this.api.keystoreId,
                      this.api.tokenId, this.api.credentials.ehpassword,
                      hcp.lastName, hcp.firstName, hcp.nihii, hcp.ssin, this.hcpZip,
                      this.patient.ssin,
                      transaction.ids.find(id => id.s === 'LOCAL').sv, transaction.ids.find(id => id.s === 'LOCAL').sl, transaction.ids.find(id => id.s === 'LOCAL').value,
                      this.hubPackageId, this.breakTheGlassReason
                  )
              ).then(tranResp => {
                      if (tranResp) {
                          return tranResp;
                      } else {
                          return null;
                      }
                  }
              )
      } else {
          return Promise.resolve(null)
      }
  }

  _putHubTransactionSet(tsXML) {
      console.log('---_putHubTransactionSet---');
      console.log(tsXML);
      console.log(this.patient);
      console.log(this.patient.ssin);
      console.log(this.api.tokenId);
      //putTransactionSetUsingPOST(
      // endpoint: string,
      // xFHCKeystoreId: string, xFHCTokenId: string, xFHCPassPhrase: string,
      // hcpLastName: string, hcpFirstName: string, hcpNihii: string, hcpSsin: string, hcpZip: string,
      // hubId: number,
      // patientSsin: string,
      // essage: string,
      // hubPackageId?: string, hubApplication?: string): Promise<models.PutTransactionSetResponse | any>;
      const myblob = new Blob([tsXML]);
      if (this.patient && this.patient.ssin && this.api.tokenId) {
          return this.api.hcparty().getHealthcareParty(this.user.healthcarePartyId).then(hcp =>
              this.api.hcparty().getHealthcareParty(this.user.healthcarePartyId)
                  .then(hcp => this.api.fhc().Hubcontroller().putTransactionSetUsingPOST(this.hubEndPoint,
                      this.api.keystoreId, this.api.tokenId, this.api.credentials.ehpassword,
                      hcp.lastName, hcp.firstName, hcp.nihii, hcp.ssin, this.hcpZip,
                      this.hubId,
                      this.patient.ssin,
                      myblob,
                      this.hubPackageId, this.hubApplication
                      )
                  ).then(putResp => {
                      if (putResp) {
                          return putResp;
                      } else {
                          return null;
                      }
                  }
              )
          )
      } else {
          return Promise.resolve(null)
      }
  }

  xmlHubListener() {
      this._putHubTransactionSet(document.getElementById('putHubXml').value).then(resp => {
          console.log('---response _putHubTransactionSet---');
          console.log(resp);
          this.set("tsResp", resp);
      })
  }

  _getTSfromFileAndPut() {
      //TODO: this is testing code, not for production
      const req = new XMLHttpRequest();

      req.onreadystatechange = function (event) {
          if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
              const msSam = this.responseXML;
              const txtSam = new XMLSerializer().serializeToString(msSam.documentElement);
              const inputHidden = document.createElement("input");
              inputHidden.setAttribute('type', 'hidden');
              inputHidden.setAttribute('value', txtSam);
              inputHidden.setAttribute('id', 'putHubXml');
              document.body.appendChild(inputHidden);
              document.dispatchEvent(new Event("xmlHubUpdated", {
                  bubbles: true,
                  cancelable: false,
                  composed: false
              }))
          }
      };

      //req.open("GET", "http://www.figac.be/topaz_ms.xml", true);//"GET", "http://i-fab.be/ts_sam.xml", true);
      req.open("GET", "http://i-fab.be/ts_sam.xml", true);
      req.send(null);

  }
}

customElements.define(HtPatHubDialog.is, HtPatHubDialog);
