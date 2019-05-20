import '@polymer/paper-button/paper-button.js'
import '@polymer/paper-dialog/paper-dialog.js'
import '@polymer/paper-input/paper-input.js'
import '../../dynamic-form/dynamic-link.js';
import '../../dynamic-form/dynamic-pills.js';
import '../../../dialog-style.js';

import moment from 'moment/src/moment';
import {TkLocalizerMixin} from "../../tk-localizer";

import {PolymerElement,html} from '@polymer/polymer/polymer-element.js';
import {mixinBehaviors} from '@polymer/polymer/lib/legacy/class'
import {IronResizableBehavior} from '@polymer/iron-resizable-behavior/iron-resizable-behavior.js';

class HtPatActionPlanDialog extends TkLocalizerMixin(mixinBehaviors([IronResizableBehavior], PolymerElement)) {
  static get template() {
    return html`
        <style include="dialog-style">
            #dialog {
                min-height: 480px;
                min-width: 800px;
                max-height: calc(90vh - 64px) !important;
            }

            .title {
                position: absolute;
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

            vaadin-date-picker#date-picker {
                padding: 0 !important;
            }

            vaadin-combo-box {
                width: 100%;
            }

            vaadin-text-area {
                width: 100%;
            }

            .content {
                max-height: calc(100% - 52px);
                margin-bottom: 52px;
                padding-bottom: 24px;
            }

            p.errmsg {
                color: var(--app-error-color);
            }

            .buttons {
                position: absolute;
                bottom: 0;

                box-sizing: border-box;
                width: 100%;

                /* border-top: 1px solid var(--app-background-color-dark); */

                color: black;
            }

            paper-button[disabled] {
                background-color: var(--app-secondary-color-dark);
                color: var(--app-text-color-disabled);
                box-shadow: none;
            }

            paper-input {
                --paper-input-container-focus-color: var(--app-primary-color);
            }

            @media screen and (max-width: 936px) {
                paper-dialog#dialog {
                    min-height: 0 !important;
                    min-width: 0 !important;
                    max-height: none !important;
                    max-width: none !important;
                    height: calc(100vh - 84px) !important;
                    width: 100%;
                    margin: 0;
                    top: 64px !important;
                    left: 0 !important;
                    transform: none !important;
                }
            }
        </style>

        <paper-dialog id="dialog" opened="{{opened}}">
            <div class="links">
                <template is="dom-if" if="[[!readonly]]">
                    <dynamic-link i18n="[[i18n]]" language="[[language]]" resources="[[resources]]" linkables="[[linkables]]" represented-object="[[key]]" on-link-to-health-element="linkToHealthElement" api="[[api]]" no-status=""></dynamic-link>
                </template>
                <div class="pills">
                    <dynamic-pills health-elements="[[linkedHes]]"></dynamic-pills>
                </div>
            </div>
            <h3 class="modal-title">[[localize('plan_act','Plan an action',language)]]</h3>
            <div class="content">
                <vaadin-form-layout>
                    <vaadin-form-item colspan="1">
                        <vaadin-date-picker id="date-picker" label="Date d'échéance*" value="{{plannedAction.Deadline}}" i18n="[[i18n]]" on-value-changed="_checkIsDeadline"></vaadin-date-picker>
                    </vaadin-form-item>
                    <vaadin-form-item colspan="1">
                        <vaadin-combo-box filtered-items="[[comboStatus]]" item-label-path="label.[[language]]" item-value-path="id" on-filter-changed="" label="Statut*" value="{{plannedAction.Status}}" on-value-changed="analyzeStatus" readonly="[[readonly]]"></vaadin-combo-box>
                    </vaadin-form-item>
                </vaadin-form-layout>
                <vaadin-form-layout>
                    <vaadin-form-item colspan="2">
                        <vaadin-combo-box filtered-items="[[proceduresListItem]]" item-label-path="label.[[language]]" item-value-path="code" id="procedures-list" on-filter-changed="_proceduresFilterChanged" on-value-changed="procedureChanged" label="Procédure*" value="{{plannedAction.ProcedureId}}" readonly="[[readonly]]"></vaadin-combo-box>
                    </vaadin-form-item>
                </vaadin-form-layout>
                <template is="dom-if" if="[[isVaccineProcedure]]">
                    <vaadin-form-layout>
                        <vaadin-form-item colspan="2">
                            <vaadin-combo-box id="vaccine" filtered-items="[[drugsListItem]]" item-label-path="name" item-value-path="id" on-filter-changed="_drugsFilterChanged" selected-item="{{selectedVaccineItem}}" label="[[localize('commercial_name','Commercial name',language)]]" readonly="[[readonly]]"></vaadin-combo-box>
                        </vaadin-form-item>
                        <vaadin-form-item>
                            <paper-input label="N° de la dose" value="{{plannedAction.DoseNumber}}" readonly="[[readonly]]"></paper-input>
                        </vaadin-form-item>
                        <vaadin-form-item>
                            <paper-input label="N° de lot" value="{{plannedAction.BatchNumber}}" readonly="[[readonly]]"></paper-input>
                        </vaadin-form-item>
                    </vaadin-form-layout>
                </template>
                <vaadin-form-layout>
                    <vaadin-form-item colspan="2">
                        <vaadin-text-area class="textarea-style" id="cpa_description" label="Description" value="{{plannedAction.Description}}" readonly="[[readonly]]"></vaadin-text-area>
                    </vaadin-form-item>
                    <vaadin-form-item colspan="2">
                        <vaadin-combo-box class="full-width" filtered-items="[[hcpListItem]]" id="hcp-list" item-label-path="name" item-value-path="id" on-filter-changed="_hcpFilterChanged" selected-item="{{selectedHcpItem}}" label="Prestataire lié" readonly="[[readonly]]"></vaadin-combo-box>
                    </vaadin-form-item>
                    <vaadin-form-item colspan="2">
                        <vaadin-combo-box filtered-items="[[hcpartyTypeListFiltered]]" item-label-path="label.[[language]]" item-value-path="id" on-filter-changed="" label="Profession liée" selected-item="{{selectedProfessionItem}}" readonly="[[readonly]]"></vaadin-combo-box>
                    </vaadin-form-item>
                </vaadin-form-layout>
                <template is="dom-if" if="[[isStatusRefusal]]">
                    <div>
                        <vaadin-text-area id="cpa_description" label="Motif de refus" value="{{plannedAction.ReasonOfRef}}" readonly="[[readonly]]"></vaadin-text-area>
                    </div>
                </template>
                <vaadin-form-layout>
                    <vaadin-form-item colspan="2">
                        <template is="dom-if" if="[[isStatusComplete]]">
                            <vaadin-checkbox on-checked-changed="_isSurgical" readonly="[[_checkReadonlySurgical]]">
                                Chirurgical
                            </vaadin-checkbox>
                        </template>
                    </vaadin-form-item>
                </vaadin-form-layout>
            </div>
            <div class="buttons">
                <p class="errmsg">[[errMsg]]</p>
                <paper-button class="modal-button" dialog-dismiss="">[[localize('can','Cancel',language)]]</paper-button>
                <paper-button class="modal-button modal-button--save" autofocus="" on-tap="planAction" disabled="[[!isValid]]">[[localize('save','Save',language)]]
                </paper-button>
            </div>
        </paper-dialog>
`;
  }

  static get is() {
      return 'ht-pat-action-plan-dialog';
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
          currentContact: {
              type: Object,
              value: null
          },
          linkables: {
              type: Array
          },
          linkedHes: {
              type: Array,
              value: () => []
          },
          plannedAction: {
              type: Object,
              value: () => ({
                  Status: "pending",
                  Deadline: "",
                  HcpId: "",
                  ProcedureId: "",
                  ProfessionId: "",
                  ReasonOfRef: "",
                  isSendMail: false,
                  isDeadline: false,
                  isSurgical: false,
                  VaccineCommercialNameId: "",
                  DoseNumber: "",
                  BatchNumber: "",
                  ProcedureInfo: {},
                  Description: "",
                  ProfessionInfo: {},
                  VaccineInfo: {}
              })
          },
          comboStatus: {
              type: Array,
              value: () => [
                  {
                      "id": "aborted",
                      "label": {
                          "fr": "Abandonné / Contre-indiqué",
                          "nl": "Verlaten / Niet aangegeven",
                          "en": "Abandoned / Against indicated"
                      }
                  },
                  {
                      "id": "aborted",
                      "label": {"fr": "Abandonné / Décès", "nl": "Verlaten / ", "en": "Abandoned / Death"}
                  },
                  {
                      "id": "aborted",
                      "label": {
                          "fr": "Abandonné / Désabonné",
                          "nl": "Verlaten / Afgemeld",
                          "en": "Abandoned / Unsubscribed"
                      }
                  },
                  {
                      "id": "error",
                      "label": {"fr": "Abandonné / Erreur", "nl": "Verlaten /", "en": "Abandoned / Error"}
                  },
                  {
                      "id": "aborted",
                      "label": {
                          "fr": "Abandonné / Non pertient",
                          "nl": "Verlaten / Irrelevant",
                          "en": "Abandoned / Not relevant"
                      }
                  },
                  {
                      "id": "refused",
                      "label": {
                          "fr": "Abandonné / Refus patient",
                          "nl": "Verlaten / Weigering van de patiënt",
                          "en": "Abandoned / Patient refusal"
                      }
                  },
                  {
                      "id": "aborted",
                      "label": {
                          "fr": "Abandonné / Trop tard",
                          "nl": "Verlaten / ",
                          "en": "Abandoned / Too late"
                      }
                  },
                  {
                      "id": "aborted",
                      "label": {
                          "fr": "Abandonné par le patient",
                          "nl": "Verlaten / erwachting",
                          "en": "Abandoned by patient"
                      }
                  },
                  {
                      "id": "pending",
                      "label": {"fr": "En attente", "nl": "Verwachting", "en": "Waiting"}
                  },
                  {
                      "id": "planned",
                      "label": {
                          "fr": "En attente planifié",
                          "nl": "Gepland wachten",
                          "en": "Scheduled waiting"
                      }
                  },
                  {
                      "id": "completed",
                      "label": {"fr": "Fait", "nl": "Geëxecuteerd", "en": "Done"}
                  },
                  {
                      "id": "proposed",
                      "label": {"fr": "Rappel envoyé", "nl": "Herinnering verzonden", "en": "Reminder sent"}
                  }
              ]
          },
          proceduresFilterValue: {
              type: String
          },
          selectedItem: {
              type: Object,
              value: null
          },
          isDeadline: {
              type: Boolean,
              value: false
          },
          hcpartyTypeList: {
              type: Array,
              value: []
          },
          hcpartyTypeListFiltered: {
              type: Array,
              value: []
          },
          isStatusComplete: {
              type: Boolean,
              value: false
          },
          isStatusRefusal: {
              type: Boolean,
              value: false
          },
          proceduresListItem: {
              type: Array,
              value: []
          },
          isVaccineProcedure: {
              type: Boolean,
              value: false
          },
          contact: {
              type: Object,
              value: null
          },
          opened: {
              type: Boolean,
              value: false
          },
          professionId: {
              type: String,
              value: ""
          },
          isExistingSvc: {
              type: Boolean,
              value: false
          },
          selectedHcpItem: {
              type: Object,
              value: ""
          },
          selectedVaccineItem: {
              type: Object,
              value: ""
          },
          selectedProfessionItem: {
              type: Object,
              value: ""
          },
          service: {
              type: Object,
              value: {}
          },
          readonly: {
              type: Boolean,
              value: false
          },
          hasSurgical: {
              type: Boolean,
              value: false
          },
          errMsg: {
              type: String,
              value: ''
          },
          isValid: {
              type: Boolean,
              value: false
          }
      };
  }

  static get observers() {
      return ["hcpItemChanged(selectedHcpItem)", "vaccineItemChanged(selectedVaccineItem)", "professionItemChanged(selectedProfessionItem)", "_checkValidity(plannedAction.*,selectedVaccineItem,selectedProfessionItem)"];
  }

  ready() {
      super.ready();
      this.addEventListener('iron-resize', () => this.onWidthChange());
      try {
          this.set('plannedAction.HcpId', this.user.healthcarePartyId)
          this.api.cacheRowsUsingPagination(
              'CD-HCPARTY-pers',
              (key, docId) =>
                  this.api.code().findPaginatedCodesByLabel('be', 'CD-HCPARTY', 'fr', 'pers', key && JSON.stringify(key), docId, 100)
                      .then(pl => ({
                          rows: pl.rows,
                          nextKey: pl.nextKeyPair && pl.nextKeyPair.startKey,
                          nextDocId: pl.nextKeyPair && pl.nextKeyPair.startKeyDocId,
                          done: !pl.nextKeyPair
                      }))
          ).then(rows => {
              this.set('hcpartyTypeList', _.orderBy(rows, ['label.fr'], ['asc']))
              this.set('hcpartyTypeListFiltered', this.hcpartyTypeList)
              this.set('plannedAction.ProfessionId', this.professionId)
          })
      } catch (e) {
          console.log(e);
      }
  }

  attached() {
      super.attached();
      this.async(this.notifyResize, 1);
  }

  _checkIsDeadline() {
      if (this.plannedAction.Deadline !== "") {
          this.set('plannedAction.isDeadline', true)
      } else {
          this.set('plannedAction.isDeadline', false)
      }

  }

  _isSendMailCheck(e) {
      this.set('plannedAction.isSendMail', e.target.checked)
  }

  _isSurgical(e) {
      this.set('plannedAction.isSurgical', e.target.checked)
  }

  analyzeStatus(e) {
      const status = e.detail.value

      if (status === "completed") {
          this.set("isStatusComplete", true)
      } else {
          this.set("isStatusComplete", false)
      }

      if (status === "refused") {
          this.set("isStatusRefusal", true)
      } else {
          this.set("isStatusRefusal", false)
      }

      if (status === "completed" && !this.selectedHcpItem && !this.plannedAction.HcpId) {
          this.api.hcparty().getHealthcareParty(this.user.healthcarePartyId).then(hcp => {
              if (hcp.type) {
                  this.set("selectedHcpItem", hcp)
                  this.set("plannedAction.HcpId", this.selectedHcpItem.id)
              }
          })
      }
  }

  procedureChanged(e) {
      if (!(e && e.detail && e.detail.value)) return;
      const code = e && e.detail && e.detail.value
      let codeExp = code.split(".");
      let CISPType = codeExp[0].substr(1, 3)

      if (CISPType === "44") {
          this.set("isVaccineProcedure", true)
      } else {
          this.set("isVaccineProcedure", false)
      }

      let listFiltered = []
      const procedureCode = this.proceduresListItem.find(p => p.code === code)
      if (procedureCode) {
          procedureCode.links.filter(link => link.includes("CD-HCPARTY|")).map(link => {
              const info = link.split('|')
              listFiltered.push(this.hcpartyTypeList.find(type => type.code === info[1]))
          })
      }
      this.set("hcpartyTypeListFiltered", listFiltered)
  }

  _hcpFilterChanged(e) {
      let latestSearchValue = e && e.detail.value;
      this.latestSearchValue = latestSearchValue;
      if (!latestSearchValue || latestSearchValue.length < 2) {
          console.log("Cancelling empty search");
          this.set('hcpListItem', []);
          return;
      }
      this._hcpDataProvider() && this._hcpDataProvider().filter(latestSearchValue).then(res => {
          if (latestSearchValue !== this.latestSearchValue) {
              console.log("Cancelling obsolete search");
              return;
          }
          this.set('hcpListItem', res.rows);
      });
  }

  _proceduresFilterChanged(e) {
      let latestSearchValue = e && e.detail.value;
      this.latestSearchValue = latestSearchValue;
      if (!latestSearchValue || latestSearchValue.length < 2) {
          console.log("Cancelling empty search");
          this.set('proceduresListItem', []);
          return;
      }
      this._proceduresDataProvider() && this._proceduresDataProvider().filter(latestSearchValue).then(res => {
          if (latestSearchValue !== this.latestSearchValue) {
              console.log("Cancelling obsolete search");
              return [];
          }
          if (!(res && res.rows && res.rows.length)) {
              return [];
          }
          return this.api.code().getCodes(res.rows.map(code => code.id))
      })
          .then(codes => {
              this.set('proceduresListItem', codes);
          });
  }

  _drugsFilterChanged(e) {
      let latestSearchValue = e && e.detail && e.detail.value;
      this.latestSearchValue = latestSearchValue;
      if (!latestSearchValue || latestSearchValue.length < 2) {
          console.log("Cancelling empty search");
          this.set('drugsListItem', []);
          return;
      }
      this._drugsDataProvider() && this._drugsDataProvider().filter(latestSearchValue).then(res => {
          if (latestSearchValue !== this.latestSearchValue) {
              console.log("Cancelling obsolete search");
              return;
          }
          this.set('drugsListItem', res.rows);
      });
  }

  _hcpDataProvider() {
      return {
          filter: function (filterValue) {
              const desc = 'desc';
              let count = 15;
              return Promise.all([this.api.hcparty().findByName(filterValue, null, null, count, desc)]).then(results => {
                  const hcpList = results[0];
                  const filtered = _.flatten(hcpList.rows.filter(hcp => hcp.lastName && hcp.lastName !== "" || hcp.firstName && hcp.firstName !== "").map(hcp => ({
                      id: hcp.id,
                      name: hcp.lastName + ' ' + hcp.firstName
                  })));
                  return {totalSize: filtered.length, rows: filtered};
              });

          }.bind(this)
      };
  }

  _proceduresDataProvider() {
      return {
          filter: function (proceduresFilterValue) {
              let count = 15;
              return Promise.all([this.api.code().findPaginatedCodesByLabel('be', 'BE-THESAURUS-PROCEDURES', 'fr', proceduresFilterValue, null, null, count)]).then(results => {
                  const procedureList = results[0];
                  const profCode = (this.selectedProfessionItem && this.selectedProfessionItem.id)
                  let filtered = procedureList.rows
                  if (profCode) {
                      filtered = filtered.filter(proc => {
                          return proc.links && proc.links.some(link => {
                              return link == profCode
                          })
                      })
                  }
                  filtered = _.flatten(filtered.map(procedure => ({
                      id: procedure.id,
                      label: procedure.label,
                      code: procedure.code,
                      searchTerms: procedure.searchTerms
                  })))
                  return {totalSize: filtered.length, rows: filtered};
              })

          }.bind(this)
      };
  }

  _drugsDataProvider() {
      return {
          filter: function (drugsFilterValue) {
              let count = 15;
              return Promise.all([this.api.bedrugs().getMedecinePackages(drugsFilterValue, this.language, null, 0, count)]).then(results => {
                  const drugsList = results[0];
                  const filtered = _.flatten(drugsList.map(drugs => ({name: drugs.name, id: drugs.id.id})));
                  return {totalSize: filtered.length, rows: filtered};
              });

          }.bind(this)
      };
  }

  planAction() {
      console.log('planAction', this.plannedAction)
      if (this.plannedAction && this.plannedAction.ProcedureId && this.plannedAction.Status !== '') {
          const tabProfession = this.plannedAction.ProfessionId ? this.plannedAction.ProfessionId.split("|") : []
          Promise.all(
              [
                  this.api.code().findPaginatedCodesByLabel('be', 'BE-THESAURUS-PROCEDURES', 'fr', this.plannedAction.ProcedureId, null, null, 10),
                  tabProfession.length && this.api.code().findPaginatedCodesByLabel('be', 'CD-HCPARTY', 'fr', tabProfession[1], null, null, 10) || Promise.resolve({rows: []})
              ]).then(
              ([results, code]) => {
                  if (!(results.rows[0])) {
                      console.log('Procédure/profession non trouvé !');
                      this.set('errMsg', this.localize('proc_or_prof_not_exist', 'Procédure/Profession inexistante', this.language))
                      return;
                  }
                  if (this.plannedAction.VaccineCommercialNameId && this.plannedAction.VaccineCommercialNameId !== "") {
                      this.api.bedrugs().getMppInfos(this.plannedAction.VaccineCommercialNameId, this.language).then(
                          mpp => {
                              this.set('plannedAction.VaccineInfo', mpp)
                              this.set('plannedAction.ProcedureInfo', results.rows[0])
                              this.set('plannedAction.ProfessionInfo', code.rows.length && code.rows[0])
                              if (this.plannedAction.ProcedureInfo) {
                                  this._planAction()
                              } else {
                                  this.set('errMsg', this.localize('mandat_fields', 'All fields are mandatory', this.language))
                              }
                          }
                      )
                  } else {
                      this.set('plannedAction.ProcedureInfo', results.rows[0])
                      this.set('plannedAction.ProfessionInfo', code.rows.length && code.rows[0] || "")
                      if (this.plannedAction.ProcedureInfo) {
                          this._planAction()
                      } else {
                          this.set('errMsg', this.localize('mandat_fields', 'All fields are mandatory', this.language))
                      }
                  }
              });

      } else {
          console.log('empty fields !');
          this.set('errMsg', this.localize('mandat_fields', 'All fields are mandatory', this.language))
      }
  }

  _planAction() {
      console.log('_planAction', this.plannedAction)

      const action = this.plannedAction
      const contactId = this.currentContact.id
      const responsible = action.HcpId !== "" ? action.HcpId : this.user.healthcarePartyId
      const valueDate = action.Deadline && action.Deadline !== "" ? this.api.moment(action.Deadline).format('YYYYMMDD') : ""

      if (!action || !contactId || !valueDate) {
          this.set('errMsg', this.localize('some_mandat_fields', 'Some fields are mandatory', this.language))
          return
      }

      const medication = action.VaccineInfo && {
          medicinalProduct: {
              intendedcds: [
                  {
                      code: action.VaccineInfo.id.id,
                      type: "CD-DRUG-CNK"
                  }
              ],
              intendedname: action.VaccineInfo.name
          },
          regimen: [],
          batch: action.BatchNumber,
          options: {
              doseNumber: {
                  stringValue: action.DoseNumber
              }
          }
      }

      this.service.label = "Actes"
      this.service.modified = +new Date()
      this.service.responsible = responsible
      this.service.content = {
          fr: {
              stringValue: action.ProcedureInfo.label.fr,
              medicationValue: action.ProcedureId.startsWith('A44') ? medication : null
          },
          nl: {
              stringValue: action.ProcedureInfo.label.nl,
              medicationValue: action.ProcedureId.startsWith('A44') ? medication : null
          },
          en: {
              stringValue: action.ProcedureInfo.label.nl,
              medicationValue: action.ProcedureId.startsWith('A44') ? medication : null
          }
      }
      this.service.codes = [action.ProcedureInfo]
      action.ProfessionInfo && this.service.codes.push(action.ProfessionInfo)

      this.service.comment = action.Description
      this.service.valueDate = valueDate
      this.service.tags = []

      const status = {
          type: "CD-LIFECYCLE",
          code: action.Status,
          version: "1.0",
      }
      if (action.Status === "refused") status.label = {fr: action.ReasonOfRef}
      this.service.tags.push(status)

      if (action.VaccineCommercialNameId) {

          const vaccine = {
              region: ["be", action.VaccineInfo.id.lang],
              type: "CD-ITEM",
              code: "vaccine",
              version: "1.0",
              id: "CD-ITEM|vaccine|1.0"
          }

          this.service.tags.push(vaccine)
      }

      if (action.isSurgical) {
          this.service.content.isSurgical = {
              booleanValue: action.isSurgical
          }
      }

      console.log(this.service)
      if (!this.isExistingSvc) {
          this.service.created = +new Date()

          this.dispatchEvent(new CustomEvent("create-service", {
              detail: {
                  service: this.service, hes: this.linkedHes, function: (svc) => {
                      svc.responsible = responsible;
                      return svc
                  }
              },
              bubbles: true,
              composed: true
          }))
      } else {
          this.dispatchEvent(new CustomEvent("update-service", {
              detail: {
                  service: this.service, hes: this.linkedHes, function: (svc) => {
                      svc.responsible = responsible;
                      return svc
                  }
              },
              bubbles: true,
              composed: true
          }))
      }


      if (!this.hasSurgical && action.isSurgical) {

      }

      this.close()
  }

  linkToHealthElement(e) {
      this.push('linkedHes', e.detail.healthElement)
  }

  onWidthChange() {
      const offsetWidth = this.$.dialog.offsetWidth;
      const offsetHeight = this.$.dialog.offsetHeight;
      if (!offsetWidth || !offsetHeight) {
          return;
      }
      this.set('qrCodeWidth', Math.min(offsetWidth - 32, offsetHeight - 160));
  }

  open(svc, readonly) {

      if (!readonly) readonly = false;
      this.set("readonly", readonly)

      this.set('errMsg', '')
      this.set("plannedAction", {})
      this.set('drugsListItem', []);
      this.set("selectedHcpItem", "")
      this.set("selectedVaccineItem", "")
      this.set("selectedProfessionItem", "")
      this.set("isExistingSvc", false)
      this.set("hasSurgical", false)

      if (svc && svc.tags && (svc.tags.some(t => t.type == "SOAP" && t.code == "Plan") && svc.tags.some(t => t.type == 'CD-ITEM-TASK'))) {
          this.convertMedispringPlan(svc)
      }

      const service = svc

      if (service && service.id) {
          this.set("isExistingSvc", true);
          this.set("service", service);

          const codeProcedure = (service.codes || []).find(code => code.type === "BE-THESAURUS-PROCEDURES")
          const codeProfession = (service.codes || []).find(code => code.type === "CD-HCPARTY")
          const codeVaccine = (service.tags || []).find(code => code.type === "CD-ITEM")
          const codeStatus = (service.tags || []).find(code => code.type === "CD-LIFECYCLE")

          const content = this.api.contact().preferredContent(service, this.language)
          const codeMedication = content && content.medicationValue && content.medicationValue.medicinalProduct && ((content.medicationValue.medicinalProduct.intendedcds || []).find(code => code.type === "CD-DRUG-CNK") || {})
          Promise.all([
              this.api.hcparty().getHealthcareParty(service.responsible),
              (codeProcedure && codeProcedure.id ? this.api.code().getCode(codeProcedure.id) : this.api.code().getCode(codeProcedure.type + '|' + codeProcedure.code + '|' + codeProcedure.version)) || Promise.resolve({}),
              codeProfession && codeProfession.id ? this.api.code().findPaginatedCodesByLabel('be', 'CD-HCPARTY', 'fr', codeProfession.code, null, null, 10) : Promise.resolve({}),
              codeVaccine && codeVaccine.id && codeMedication && codeMedication.code ? this.api.bedrugs().getMppInfos(codeMedication.code, this.language) : Promise.resolve({})
          ]).then(([hcp, resultProced, resultProf, resultVaccine]) => {
              this.push("hcpListItem", {id: hcp.id, name: hcp.lastName + ' ' + hcp.firstName});

              const date = this.api.moment(service.valueDate).format("YYYY-MM-DD");

              this.set("proceduresListItem", [resultProced])
              this.procedureChanged({detail: {value: (codeProcedure && codeProcedure.code)}})

              this.professionId = (codeProfession && codeProfession.code && codeProfession.type && codeProfession.version) ? [codeProfession.type, codeProfession.code, codeProfession.version].join("|") : ""
              const medicationValue = this.api.contact().preferredContent(service, this.language).medicationValue

              this.set("plannedAction", {
                  Status: codeStatus && codeStatus.code,
                  Deadline: date,
                  HcpId: service.responsible,
                  ProcedureId: codeProcedure && codeProcedure.code || null,
                  ProfessionId: this.professionId,
                  ReasonOfRef: codeStatus && codeStatus.code === "refused" ? codeStatus.label : "",
                  isDeadline: (date ? true : false),
                  isSurgical: this.api.contact().preferredContent(service, this.language).booleanValue ? true : false,//creer un antecedent
                  VaccineCommercialNameId: (this.isVaccineProcedure && medicationValue && medicationValue.medicinalProduct && medicationValue.medicinalProduct.intendedcds && medicationValue.medicinalProduct.intendedcds.length ? medicationValue.medicinalProduct.intendedcds.find(code => code.type === "CD-DRUG-CNK").code : ""),
                  DoseNumber: (this.isVaccineProcedure && medicationValue && medicationValue.options && medicationValue.options.doseNumber && medicationValue.options.doseNumber.stringValue ? medicationValue.options.doseNumber.stringValue : ""),
                  BatchNumber: (this.isVaccineProcedure && medicationValue && medicationValue.batch ? medicationValue.batch : ""),
                  ProcedureInfo: resultProced,
                  Description: service.comment,
                  ProfessionInfo: (resultProf && resultProf.rows && resultProf.rows[0]) || {},
                  VaccineInfo: (codeVaccine && codeVaccine.length ? resultVaccine : "")
              })

              this.set('drugsListItem', [resultVaccine]);
              this.set("selectedHcpItem", {
                  id: this.plannedAction.HcpId,
                  name: !hcp.name ? hcp.lastName + ' ' + hcp.firstName : hcp.name
              })

              if (this.plannedAction.VaccineCommercialNameId) {
                  this.set("selectedVaccineItem", {
                      id: this.plannedAction.VaccineCommercialNameId,
                      name: resultVaccine.name
                  })
              }
              this.set("selectedProfessionItem", this.hcpartyTypeList.find(type => type.id === this.plannedAction.ProfessionId))


              if (codeStatus && codeStatus.code === "completed") {
                  this.set("isStatusComplete", true)
              } else {
                  this.set("isStatusComplete", false)
              }

              if (codeStatus && codeStatus.code === "refused") {
                  this.set("isStatusRefusal", true)
              } else {
                  this.set("isStatusRefusal", false)
              }

              if (this.plannedAction.isSurgical) {
                  this.set("hasSurgical", true)
              }
          }).catch(err => {
              console.log("error", err)
              this.set('errMsg', err)
          })
      } else { // new action-plan, set default values
          this.api.hcparty().getHealthcareParty(this.user.healthcarePartyId).then(hcp => {
              if (hcp.type) {
                  // do not set prestataire by default
                  //this.set("selectedHcpItem", hcp)
                  //this.set("plannedAction.HcpId",this.selectedHcpItem.id)
                  this.set("plannedAction.ProfessionId", "CD-HCPARTY|" + hcp.type + "|1")
                  this.set("selectedProfessionItem", this.hcpartyTypeList.find(type => type.id === this.plannedAction.ProfessionId))
              }
          })
          this.set("plannedAction.Deadline", moment().format('YYYY-MM-DD'))
          this.set("plannedAction.Status", "pending")
      }
      this.$.dialog.open();
  }

  convertMedispringPlan(svc) {
      const service = _.cloneDeep(svc)
      const content = service.content
      if (content) {
          svc.comment = content.descr && content.descr.stringValue || ""
          svc.content = {}
          svc.content[this.language] = {}
          if (content.medication && content.medication.medicationValue) {
              svc.content[this.language].medicationValue = content.medication.medicationValue
          }

          _.remove(svc.tags, tag => tag.type == 'CD-ITEM-TASK')
          svc.label = "Actes"
      }
  }

  close() {
      this.$.dialog.close();
  }

  shortServiceDescription(svc, lng) {
      let rawDesc = svc && this.api && this.api.contact().shortServiceDescription(svc, lng);
      return rawDesc && '' + rawDesc || '';
  }

  vaccineItemChanged() {
      if (!(this.drugsListItem && this.drugsListItem.length)) return;
      this.set("plannedAction.VaccineCommercialNameId", this.selectedVaccineItem && this.selectedVaccineItem.id || "")
  }

  hcpItemChanged() {
      if (!(this.hcpListItem && this.hcpListItem.length) || typeof this.selectedHcpItem === "string") return;
      this.set("plannedAction.HcpId", this.selectedHcpItem && this.selectedHcpItem.id || "")
  }

  professionItemChanged() {
      if (!(this.hcpartyTypeListFiltered && this.hcpartyTypeListFiltered.length)) return;
      this.set("plannedAction.ProfessionId", this.selectedProfessionItem && this.selectedProfessionItem.id || "")
  }

  _checkReadonlySurgical() {
      return this.hasSurgical && this.readonly;
  }

  _checkValidity() {
      this.set("isValid", false);
      console.log(this.plannedAction)
      if (this.plannedAction.Deadline && this.plannedAction.Deadline != "" && this.plannedAction.ProcedureId && this.plannedAction.ProcedureId != "" && this.plannedAction.Status != '') {
          this.set("isValid", true);
      }
  }
}

customElements.define(HtPatActionPlanDialog.is, HtPatActionPlanDialog);
