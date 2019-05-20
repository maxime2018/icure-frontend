import '@polymer/paper-button/paper-button.js'
import '@polymer/paper-dialog/paper-dialog.js'
import '@polymer/paper-dropdown-menu/paper-dropdown-menu-light.js'
import '@polymer/paper-input/paper-input.js'
import '@polymer/paper-item/paper-item.js'
import '@polymer/paper-listbox/paper-listbox.js'
import '@polymer/paper-radio-button/paper-radio-button.js'
import '@polymer/paper-radio-group/paper-radio-group.js'
import '../../vaadin-icure-theme.js';
import '../../dialog-style.js';
import '../../scrollbar-style.js';
import '../../dropdown-style.js';
import '../../vaadin-icure-theme.js';
import '../../paper-input-style.js';
import '../../tk-token-field-style.js';

import _ from 'lodash/lodash';
import moment from 'moment/src/moment';
import {TkLocalizerMixin} from "../tk-localizer";

import {PolymerElement,html} from '@polymer/polymer/polymer-element.js';
class HealthProblemSelector extends TkLocalizerMixin(PolymerElement) {
  static get template() {
    return html`
        <style include="dialog-style scrollbar-style dropdown-style vaadin-icure-theme paper-input-style tk-token-field-style">
            :host {
                --paper-font-caption: {
                    line-height: 0;
                }
            }

            paper-dialog {
                width: 840px;
                max-width: 1024px;
                max-height: 700px;
                height: 609px;
            }

            paper-dropdown-menu-light {
                width: 140px;
                height: 22px;
            }

            vaadin-combo-box {
                width: 100%;
            }

            .grid {
                display: grid;
                grid-template-columns: 110px 1fr;
                grid-template-rows: 1fr;
                margin-bottom: 12px;
                grid-column-gap: 12px;
            }

            .flex {
                display: flex;
                flex-flow: row wrap;
                justify-content: flex-start;
                align-items: center;
            }

            .label {
                color: var(--app-primary-color-dark);
                font-size: var(--font-size-normal);
                justify-content: space-between;
                place-self: center start;
            }

            paper-radio-group {
                --paper-radio-group-item-padding: 8px;
            }

            paper-radio-button {
                --paper-radio-button-checked-color: var(--app-secondary-color-dark);
                --paper-radio-button-size: 12px;
                --paper-radio-button-label: {
                    font-size: var(--font-size-normal)
                };
                padding: 4px 8px;
            }

            .reorder::before, .reorder::after {
                content: '';
                width: 100%;
                order: 1;
            }

            .reorder paper-radio-button:nth-child(n + 4) {
                order: 1;
            }

            .reorder paper-radio-button:nth-child(n + 7) {
                order: 2;
            }

            vaadin-date-picker {
                height: 22px;
                width: 120px;
            }

            .content {
                padding: 12px;
            }

            .margin-left-right-6 {
                margin-left: 6px;
                margin-right: 6px;
            }

            .nowrap {
                flex-wrap: nowrap;
            }
        </style>

        <paper-dialog id="dialog">
            <h2 class="modal-title">[[entityType]]</h2>
            <div class="content">
                <div class="grid">
                    <div class="label">[[localize('nat','Nature',language)]] *</div>
                    <paper-radio-group selected="[[_nature(entity, entity.tags, entity.tags.*)]]" class="flex reorder" on-selected-changed="_natureChanged">
                        <paper-radio-button name="healthcareelement">
                            [[localize('healthcareelement','Problem',language)]]
                        </paper-radio-button>
                        <paper-radio-button name="surgery">[[localize('surg_abr','Surgery',language)]]
                        </paper-radio-button>
                        <paper-radio-button name="familyrisk">[[localize('familyrisk','Family Risk',language)]]
                        </paper-radio-button>
                        <paper-radio-button name="risk">[[localize('risk','Risk',language)]]</paper-radio-button>
                        <paper-radio-button name="socialrisk">[[localize('socialrisk','Social risk',language)]]
                        </paper-radio-button>
                        <paper-radio-button name="professionallrisk">[[localize('professionallrisk','Professional
                            risk',language)]]
                        </paper-radio-button>
                        <paper-radio-button name="allergy">[[localize('allergy','Allergy',language)]]
                        </paper-radio-button>
                        <paper-radio-button name="adr">[[localize('adr','Adverse drug reaction',language)]]
                        </paper-radio-button>
                    </paper-radio-group>
                </div>
                <div class="grid">
                    <div class="label">[[localize('lab-sta','Standard Label',language)]] *</div>
                    <template is="dom-if" if="[[!searchSurgery]]">
                        <vaadin-combo-box id="entities-list" filtered-items="[[items]]" on-filter-changed="_filterChanged" item-label-path="descr" selected-item="{{selectedItem}}" item-value-path="id"></vaadin-combo-box>
                    </template>
                    <template is="dom-if" if="[[searchSurgery]]">
                        <vaadin-combo-box id="entities-list" filtered-items="[[surgeryItems]]" on-filter-changed="_surgeryFilterChanged" item-label-path="descr" selected-item="{{surgerySelectedItem}}" item-value-path="id"></vaadin-combo-box>
                    </template>
                </div>
                <template is="dom-if" if="[[searchAllergen]]">
                    <div class="grid">
                        <div class="label">[[localize('allergen','Allergen',language)]]</div>
                        <vaadin-combo-box id="entities-list" filtered-items="[[allergenItems]]" on-filter-changed="_allergenFilterChanged" item-label-path="descr" selected-item="{{allergenSelectedItem}}" item-value-path="id"></vaadin-combo-box>
                    </div>
                </template>

                <template is="dom-if" if="[[searchDrug]]">
                    <div class="grid">
                        <div class="label">[[localize('drugs','Drugs',language)]]</div>
                        <vaadin-combo-box id="entities-list" filtered-items="[[drugItems]]" on-filter-changed="_drugFilterChanged" item-label-path="name" selected-item="{{drugSelectedItem}}" item-value-path="id.id"></vaadin-combo-box>
                    </div>
                </template>
                <template is="dom-if" if="[[searchFamilyLink]]">
                    <div class="grid">
                        <div class="label">[[localize('fam-ris','Family Risks',language)]]</div>
                        <vaadin-combo-box id="entities-list" filtered-items="[[familyLinkItems]]" on-filter-changed="_familyRiskFilterChanged" item-label-path="descr" selected-item="{{familyRiskSelectedItem}}" item-value-path="id"></vaadin-combo-box>
                    </div>
                </template>
                <div class="grid">
                    <div class="label">[[localize('lab-per','Personal Label',language)]]</div>
                    <paper-input value="{{entity.descr}}" no-label-float=""></paper-input>
                </div>
                <div class="grid">
                    <div class="label">[[localize('sta','Status',language)]]</div>
                    <paper-radio-group selected="[[_status(entity, entity.tags, entity.tags.*, entity.status, entity.closingDate)]]" class="flex" on-selected-changed="_statusChanged">
                        <paper-radio-button name="active-relevant">[[localize('act_rel','Active relevant',language)]]
                        </paper-radio-button>
                        <paper-radio-button name="active-irrelevant">[[localize('act_irr','Active
                            irrelevant',language)]]
                        </paper-radio-button>
                        <paper-radio-button name="inactive">[[localize('ina','Inactive',language)]]</paper-radio-button>
                        <paper-radio-button name="archived">[[localize('archiv','Archived',language)]]
                        </paper-radio-button>
                    </paper-radio-group>
                </div>
                <div class="grid">
                    <div class="label">[[localize('cert','Certainty',language)]]</div>
                    <paper-radio-group selected="[[_certainty(entity, entity.tags, entity.tags.*, entity.status, entity.closingDate)]]" class="flex" on-selected-changed="_certaintyChanged">
                        <paper-radio-button name="proven">[[localize('proven','Proven',language)]]</paper-radio-button>
                        <paper-radio-button name="probable">[[localize('probable','Probable',language)]]
                        </paper-radio-button>
                        <paper-radio-button name="unprobable">[[localize('unprobable','improbable',language)]]
                        </paper-radio-button>
                        <paper-radio-button name="excluded">[[localize('excluded','Excluded',language)]]
                        </paper-radio-button>
                    </paper-radio-group>
                </div>
                <div class="grid">
                    <div class="label">[[localize('sev','Severity',language)]]</div>
                    <paper-radio-group selected="[[_severity(entity, entity.tags, entity.tags.*, entity.status, entity.closingDate)]]" class="flex" on-selected-changed="_severityChanged">
                        <paper-radio-button name="normal">[[localize('normal','No problem',language)]]
                        </paper-radio-button>
                        <paper-radio-button name="verylow">[[localize('verylow','Light',language)]]</paper-radio-button>
                        <paper-radio-button name="low">[[localize('low','Moderate',language)]]</paper-radio-button>
                        <paper-radio-button name="high">[[localize('high','Severe',language)]]</paper-radio-button>
                        <paper-radio-button name="veryhigh">[[localize('veryhigh','Total',language)]]
                        </paper-radio-button>
                    </paper-radio-group>
                </div>
                <div class="grid">
                    <div class="label">[[localize('ext_temp','Extra temporality',language)]]</div>
                    <paper-radio-group selected="[[_extraTemporality(entity, entity.tags, entity.tags.*, entity.status, entity.closingDate)]]" class="flex" on-selected-changed="_extraTemporalityChanged">
                        <!--<paper-radio-button name="chronic">[[localize('chronic','Chronic',language)]]</paper-radio-button>
                        <paper-radio-button name="subbacute">[[localize('subbacute','Sub-acute',language)]]</paper-radio-button>
                        <paper-radio-button name="acute">[[localize('acute','Acute',language)]]</paper-radio-button>-->
                        <paper-radio-button name="remission">[[localize('remission','Remission',language)]]
                        </paper-radio-button>
                        <paper-radio-button name="relapse">[[localize('relapse','Relapse',language)]]
                        </paper-radio-button>
                    </paper-radio-group>
                </div>

                <div class="flex nowrap">
                    <div class="grid">
                        <div class="label">[[localize('st_da','Start Date',language)]] *</div>
                        <vaadin-date-picker i18n="[[i18n]]" value="{{_openingDateAsString}}"></vaadin-date-picker>
                    </div>
                    <div class="grid margin-left-right-6">
                        <div class="label">[[localize('en_da','End Date',language)]]</div>
                        <vaadin-date-picker i18n="[[i18n]]" value="{{_closingDateAsString}}"></vaadin-date-picker>
                    </div>

                    <div class="grid margin-left-right-6">
                        <div class="label">Rémanence</div>
                        <paper-dropdown-menu-light id="temporality" no-label-float="">
                            <paper-listbox slot="dropdown-content" class="dropdown-temporality" selected="{{temporalityItemIdx}}" selected-item="{{temporalityItem}}">
                                <template is="dom-repeat" items="[[temporalityList]]" as="tp">
                                    <paper-item id="[[tp.code]]">[[_getTpLabel(tp)]]</paper-item>
                                </template>
                            </paper-listbox>
                        </paper-dropdown-menu-light>
                    </div>
                </div>

                <div class="grid">
                    <div class="label">[[localize('co','Code',language)]]</div>
                    <tk-token-field value="{{entity.codes}}" data-value-path="id" label-path="[[_label(language)]]" data-label-path="[[_label(language)]]" no-label-float=""></tk-token-field>
                </div>

                <div class="grid">
                    <div class="label">[[localize('pl_of_ac','Plans of action',language)]]</div>
                    <tk-token-field value="{{entity.plansOfAction}}" data-value-path="id" data-label-path="descr" no-label-float=""></tk-token-field>
                </div>


                <slot name="suffix"></slot>
            </div>
            <div class="buttons">
                <paper-button class="modal-button" dialog-dismiss="">[[localize('can','Cancel',language)]]</paper-button>
                <template is="dom-if" if="[[isValid]]">
                    <paper-button class="modal-button modal-button--save" dialog-confirm="" autofocus="" on-tap="confirm">
                        [[localize('save','Save',language)]]
                    </paper-button>
                </template>
            </div>
        </paper-dialog>
`;
  }

  static get is() {
      return 'health-problem-selector';
  }

  static get properties() {
      return {
          columns: {
              type: Array,
              value: function () {
                  return [];
              }
          },

          entityType: {
              type: String,
              value: 'entity'
          },

          entity: {
              type: Object,
              value: () => ({plansOfAction: []}),
              notify: true
          },

          okLabel: {
              type: String
          },

          filterValue: {
              type: String
          },

          dataProvider: {
              type: Object,
              value: null
          },

          allergenDataProvider: {
              type: Object,
              value: null
          },

          i18n: {
              type: Object
          },

          selectedItem: {
              type: Object,
              value: null
          },
          surgerySelectedItem: {
              type: Object,
              value: null
          },
          allergenSelectedItem: {
              type: Object,
              value: null
          },
          drugSelectedItem: {
              type: Object,
              value: null
          },
          familyRiskSelectedItem: {
              type: Object,
              value: null
          },
          items: {
              type: Array,
              value: () => []
          },
          allergenItems: {
              type: Array,
              value: () => []
          },
          familyLinkItems: {
              type: Array,
              value: () => []
          },
          _openingDateAsString: {
              type: String
          },
          _closingDateAsString: {
              type: String
          },
          searchAllergen: {
              type: Boolean,
              value: false
          },
          searchDrug: {
              type: Boolean,
              value: false
          },
          searchFamilyLink: {
              type: Boolean,
              value: false
          },
          allergenFilterValue: {
              type: String
          },
          drugFilterValue: {
              type: String
          },
          familyLinkFilterValue: {
              type: String
          },
          searchSurgery: {
              type: Boolean,
              value: false
          },
          surgeryItems: {
              type: Array,
              value: () => []
          },
          surgeryFilterValue: {
              type: String
          },
          temporalityItemIdx: {
              type: Number,
              value: 0
          },
          temporalityList: {
              type: Array,
              value: () => []
          },
          temporalityItem: {
              type: Object,
              value: () => {
              }
          },
          isValid: {
              type: Boolean,
              value: false
          }
      };
  }

  static get observers() {
      return [
          '_selectedTemporalityItemChanged(temporalityItem)',
          '_filterChanged(filterValue)',
          '_selectedItemChanged(selectedItem)',
          '_allergenItemChanged(allergenSelectedItem)',
          '_familyRiskItemChanged(familyRiskSelectedItem)',
          '_drugChanged(drugSelectedItem)',
          '_selectSurgerySelectedItem(surgerySelectedItem)',
          '_updateDescription(selectedItem, allergenSelectedItem, familyRiskSelectedItem, surgerySelectedItem, drugSelectedItem)',
          '_ehDateChanged(entity.openingDate, entity.closingDate)',
          '_openingDateChanged(entity.openingDate)',
          '_closingDateChanged(entity.closingDate)',
          '_openingDateAsStringChanged(_openingDateAsString)',
          '_closingDateAsStringChanged(_closingDateAsString)',
          '_checkValidity(entity.codes)'
      ];
  }

  constructor() {
      super();
  }

  _filterChanged(e) {
      let latestSearchValue = this.filterValue || e && e.detail.value;
      this.latestSearchValue = latestSearchValue;

      if (!latestSearchValue || latestSearchValue.length < 2) {
          console.log("Cancelling empty search");
          this.set('items', []);
          return;
      }

      this.dataProvider && this.dataProvider.filter(latestSearchValue, 500, 0, 'descr', false).then(res => {
          if (latestSearchValue !== this.latestSearchValue) {
              console.log("Cancelling obsolete search");
              return;
          }
          this.set('items', res.rows);
      });
  }

  _updateDescription() {
      if (this.selectedItem || this.surgerySelectedItem || this.allergenSelectedItem || this.familyRiskSelectedItem || this.drugSelectedItem) {
          this.set('entity.descr', (this.searchAllergen && this.allergenSelectedItem) ? `${this.selectedItem.descr} (${this.allergenSelectedItem.descr})` : (this.searchFamilyRisk && this.familyRiskSelectedItem) ? `${this.selectedItem.descr} (${this.familyRiskSelectedItem.descr})` : (this.searchDrug && this.drugSelectedItem) ? `${this.selectedItem.descr} (${this.drugSelectedItem.name})` : (this.searchSurgery && this.surgerySelectedItem) ? `${this.surgerySelectedItem.descr}` : this.selectedItem.descr);
      }
  }

  _selectedItemChanged() {
      if (this.selectedItem) {
          this.set('entity.plansOfAction', this.selectedItem.plansOfAction || []);
          this.api.code().getCodes(this.selectedItem.codes.join(',')).then(codes => {
              this.set('entity.codes', _.union(this._stripCodesByTypes(this.entity.codes, ["ICD", "ICPC", "BE-THESAURUS"]), codes));
          });
      }
  }

  _allergenItemChanged() {
      if (this.allergenSelectedItem) {
          this.api.code().getCodes(this.allergenSelectedItem.codes.join(',')).then(codes => {
              this.set('entity.codes', _.union(this._stripCodesByTypes(this.entity.codes, ["CD-ATC"]), codes));
          });
      }
  }

  _familyRiskItemChanged() {
      if (this.familyRiskSelectedItem) {
          this.api.code().getCodes(this.familyRiskSelectedItem.codes.join(',')).then(codes => {
              this.set('entity.codes', _.union(this._stripCodesByTypes(this.entity.codes, ["BE-FAMILY-LINK"]), codes));
          });
      }
  }

  _drugChanged() {
      if (this.drugSelectedItem) {
          this._fillMedecineCodes(this.drugSelectedItem).then(() => {
              this.api.code().getCodes(this.drugSelectedItem.codes.map(c => this.api.code().normalize(c).id).join(',')).then(codes => {
                  this.set('entity.codes', _.union(this._stripCodesByTypes(this.entity.codes, ["CD-ATC", "CD-DRUG-CNK"]), codes));
              });
          })
      }
  }

  _fillMedecineCodes(med) {
      return Promise.resolve([]).then(() => {
          //med.codes = [{type: "CD-ATC", code: 123213}];
          if (med.id && med.id.id) {
              //by productName
              return this.api.bedrugs().getMppInfos(med.id.id, this.language === 'en' ? 'fr' : this.language || 'fr').then(mppInfos => {

                  med.id.id && (((med.codes || (med.codes = [])).find(c => c.type === 'CD-DRUG-CNK') || (med.codes[med.codes.length] = {
                      type: 'CD-DRUG-CNK',
                      version: '0.0.1'
                  })).code = med.id.id)
                  mppInfos.atcCode && (((med.codes || (med.codes = [])).find(c => c.type === 'CD-ATC') || (med.codes[med.codes.length] = {
                      type: 'CD-ATC',
                      version: '0.0.1'
                  })).code = mppInfos.atcCode)

              })
          } else {
              //by molecule
              if (med.inncluster) {

                  med.inncluster && (((med.codes || (med.codes = [])).find(c => c.type === 'CD-INNCLUSTER') || (med.codes[med.codes.length] = {
                      type: 'CD-INNCLUSTER',
                      version: '0.0.1'
                  })).code = med.inncluster)
                  med.atcCode && (((med.codes || (med.codes = [])).find(c => c.type === 'CD-ATC') || (med.codes[med.codes.length] = {
                      type: 'CD-ATC',
                      version: '0.0.1'
                  })).code = med.atcCode)
              } else {
                  //Compound prescription

              }
          }
          return med
      })

  }

  _selectSurgerySelectedItem() {
      if (this.surgerySelectedItem) {
          this.set('entity.plansOfAction', this.surgerySelectedItem.plansOfAction || []);
          this.api.code().getCodes(this.surgerySelectedItem.codes.join(',')).then(codes => {
              this.set('entity.codes', codes); // no need for additional codes, can replace all codes
          });
      }
  }


  _allergenFilterChanged(e) {

      let latestSearchValue = e && e.detail.value;
      this.latestSearchValue = latestSearchValue;
      if (!latestSearchValue || latestSearchValue.length < 2) {
          console.log("Cancelling empty search");
          this.set('allergenItems', []);
          return;
      }
      this.dataProvider && this.dataProvider.filter(latestSearchValue, 500, 0, 'descr', false, ['BE-ALLERGEN', 'CD-ATC']).then(res => {
          if (latestSearchValue !== this.latestSearchValue) {
              console.log("Cancelling obsolete search");
              return;
          }
          this.set('allergenItems', res.rows);
      });
  }

  _drugFilterChanged(e) {
      let latestSearchValue = e && e.detail.value;
      this.latestSearchValue = latestSearchValue;
      if (!latestSearchValue || latestSearchValue.length < 2) {
          console.log("Cancelling empty search");
          this.set('drugItems', []);
          return;
      }


      const search = this.dataProvider && (() => this.dataProvider.filterDrugs(latestSearchValue, 500, 0, 'name', false))

      if (this.drugFilterTimeout) {
          clearTimeout(this.drugFilterTimeout)
      }

      this.drugFilterTimeout = setTimeout(() => search().then(res => {
          if (latestSearchValue !== this.latestSearchValue) {
              console.log("Cancelling obsolete search");
              return;
          }

          this.drugFilterTimeout = null
          this.set('drugItems', res.rows);
      }), 500)

  }

  _familyRiskFilterChanged(e) {
      let latestSearchValue = e && e.detail.value;
      this.latestSearchValue = latestSearchValue;
      if (!latestSearchValue || latestSearchValue.length < 2) {
          console.log("Cancelling empty search");
          this.set('familyLinkItems', []);
          return;
      }
      this.dataProvider && this.dataProvider.filter(latestSearchValue, 500, 0, 'descr', false, ['BE-FAMILY-LINK']).then(res => {
          if (latestSearchValue !== this.latestSearchValue) {
              console.log("Cancelling obsolete search");
              return;
          }
          this.set('familyLinkItems', res.rows);
      });
  }

  _surgeryFilterChanged(e) {
      let latestSearchValue = e && e.detail.value;
      this.latestSearchValue = latestSearchValue;
      if (!latestSearchValue || latestSearchValue.length < 2) {
          console.log("Cancelling empty search");
          this.set('surgeryItems', []);
          return;
      }
      this.dataProvider && this.dataProvider.filter(latestSearchValue, 500, 0, 'descr', false, ['BE-THESAURUS-SURGICAL-PROCEDURES']).then(res => {
          if (latestSearchValue !== this.latestSearchValue) {
              console.log("Cancelling obsolete search");
              return;
          }
          this.set('surgeryItems', res.rows);
      });
  }

  _tagForEntity(e, type, code) {
      const tags = e && (e.tags || (e.tags = []));
      return tags.find(t => t.type === type) || code && (tags[tags.length] = {
          type: type,
          code: code,
          version: '1'
      });
  }

  _cdItemTagForEntity(e, create) {
      return this._tagForEntity(e, 'CD-ITEM', create && 'healthcareelement');
  }

  _nature() {
      const code = this._cdItemTagForEntity(this.entity, true);
      return code && code.code;
  }

  _status() {
      //possible returns
      //entity === null --> null
      //status & 3 === 3 -- x11 --> 'archived' !!! not 2
      //status & 2 === 2 -- x10 --> 'active-irrelevant'
      // && if closingdate before now -- x11 --> 'archived'
      //status & 1 === 1 -- x01 --> 'inactive'
      //status & 3 === 0 -- x00 --> 'active-relevant'
      // && if closingdate before now -- x01 --> 'inactive'
      return !this.entity ? null :
          ((this.entity.status || 0) & 3) === 3 ? 'archived' :
              ((this.entity.status || 0) & 2) === 2 && (this.entity.closingDate && this.api.moment(this.entity.closingDate).isBefore()) ? 'archived' :
                  ((this.entity.status || 0) & 2) === 2 ? 'active-irrelevant' :
                      ((this.entity.status || 0) & 1) === 1 ? 'inactive' :
                          ((this.entity.status || 0) & 3) === 0 && (this.entity.closingDate && this.api.moment(this.entity.closingDate).isBefore()) ? 'inactive' :
                              'active-relevant';
  }

  _severity() {
      const code = this._tagForEntity(this.entity, 'CD-SEVERITY');
      return code && code.code;
  }

  _extraTemporality() {
      const code = this._tagForEntity(this.entity, 'CD-EXTRA-TEMPORALITY');
      return code && code.code;
  }

  _certainty() {
      const code = this._tagForEntity(this.entity, 'CD-CERTAINTY');
      return code && code.code;
  }

  _natureChanged(e) {
      this._cdItemTagForEntity(this.entity, true).code = e.detail.value;

      e.detail.value === "allergy" ? this.set("searchAllergen", true) : this.set("searchAllergen", false)
      e.detail.value === "adr" ? this.set("searchDrug", true) : this.set("searchDrug", false)
      e.detail.value === "familyrisk" ? this.set("searchFamilyLink", true) : this.set("searchFamilyLink", false)
      e.detail.value === "surgery" ? this.set("searchSurgery", true) : this.set("searchSurgery", false)
  }

  _statusChanged(e) {
      switch (e.detail.value) {
          // case 'active': //will never be hit !
          // 	this.set('entity.closingDate', null);
          // 	((this.entity.status || 0) & 1) === 1 && this.set('entity.status', (this.entity.status || 0) - 1);
          // 	((this.entity.status || 0) & 2) === 1 && this.set('entity.status', (this.entity.status || 0) - 2);
          // 	break;
          case 'active-relevant': //set status to x00
              this.set('entity.closingDate', null);
              this.set('entity.status', (this.entity.status & 4 || 0));
              break;
          case 'active-irrelevant': //set status to x10
              this.set('entity.closingDate', null);
              this.set('entity.status', (this.entity.status & 4 || 0) | 2);
              break;
          case 'inactive': //set status to x01
              this.set('entity.status', (this.entity.status & 4 || 0) | 1);
              break;
          case 'archived': //set status to x11
              this.set('entity.status', (this.entity.status & 4 || 0) | 3);
              break;
      }
      console.log('status : ', this.entity.status)
  }

  _severityChanged(e) {
      this._tagForEntity(this.entity, 'CD-SEVERITY', 'normal').code = e.detail.value
  }

  _extraTemporalityChanged(e) {
      this._tagForEntity(this.entity, 'CD-EXTRA-TEMPORALITY', 'oneshot').code = e.detail.value
  }

  _certaintyChanged(e) {
      this._tagForEntity(this.entity, 'CD-CERTAINTY', 'probable').code = e.detail.value
  }

  _cellContent(item, column) {
      return _.isFunction(column.key) ? column.key(item) : _.get(item, column.key);
  }

  _key(column) {
      return _.isFunction(column.key) ? column.sortKey : column.key;
  }

  _label(language) {
      return `type:label.${['fr', 'nl'].includes(language) ? language : 'fr'}`;
  }

  click(e) {
      const selected = this.activeItem;

      console.log('selected ' + selected + ' - ' + this.latestSelected);
      if (this.inDoubleClick && (this.latestSelected === selected || this.latestSelected && !selected || !this.latestSelected && selected)) {
          this.select(this.latestSelected || selected);
      } else {
          this.latestSelected = selected;
          this.inDoubleClick = true;
          this.set('entity', _.assign(_.assign({}, this.entity || {}), selected));
          setTimeout(() => {
              delete this.inDoubleClick;
          }, 500);
      }
  }

  refresh() {
      //Give the gui the time to update the field
      setTimeout(function () {
          let currentValue = this.filterValue;

          if (this.latestSearchValue === currentValue) {
              return;
          }
          setTimeout(function () {
              if (currentValue === this.filterValue) {
                  console.log("Triggering search for " + this.filterValue);
                  this.$['entities-list'].clearCache();
              } else {
                  console.log("Skipping search for " + this.filterValue + " != " + currentValue);
              }
          }.bind(this), 500); //Wait for the user to stop typing
      }.bind(this), 100);
  }

  confirm() {
      if (this.entity || this.activeItem) {
          console.log(this.entity)
          this.select(this.entity || this.activeItem);
      }
  }

  select(item) {
      if (item) {
          this.dispatchEvent(new CustomEvent('entity-selected', {detail: item, composed: true}));
          this.$.dialog.close();
      }
  }

  open() {
      this.flushComboData()
      this.set("isValid", false)
      this.api.code().findPaginatedCodes('be', 'CD-TEMPORALITY', '')
          .then(c => this.set("temporalityList", c.rows.filter(c => c.code === "acute" || c.code === "subacute" || c.code === "chronic")))
          .finally(() => {
              this.$.dialog.open();
              this.$.dialog.scrollTop = 0;

              const type = this.entity.tags.find(t => t.type === "CD-ITEM")
              type && type.code === "allergy" ? this.set("searchAllergen", true) : this.set("searchAllergen", false)
              type && type.code === "familyrisk" ? this.set("searchFamilyLink", true) : this.set("searchFamilyLink", false)
              type && type.code === "adr" ? this.set("searchDrug", true) : this.set("searchDrug", false)
              type && type.code === "surgery" ? this.set("searchSurgery", true) : this.set("searchSurgery", false)

              this.dispatchEvent(new CustomEvent('open-health-problem', {
                  bubbles: true,
                  composed: true,
                  detail: {entity: this.entity}
              }));
              this._checkValidity();
          })

  }

  flushComboData() {
      this.set('filterValue', '')
      this.set('selectedItem', null)
      this.set('allergenFilterValue', '')
      this.set('allergenSelectedItem', null)
      this.set('drugFilterValue', '')
      this.set('drugSelectedItem', null)
      this.set('familyLinkFilterValue', '')
      this.set('familyRiskSelectedItem', null)
      this.set('surgeryFilterValue', '')
      this.set('surgerySelectedItem', null)
  }

  _closingDateChanged(date) {
      const dateString = date && this.api.moment(date).format('YYYY-MM-DD') || '';
      if (dateString !== this._openingDateAsString) {
          this.set('_closingDateAsString', dateString);
      }
  }

  _openingDateChanged(date) {
      const dateString = date && this.api.moment(date).format('YYYY-MM-DD') || '';
      if (dateString !== this._openingDateAsString) {
          this.set('_openingDateAsString', dateString);
      }
  }

  _ehDateChanged(startingDate, closingDate) {

      if (startingDate) {
          let startingDateAsString = this.api.moment(startingDate).format('YYYY-MM-DD') || ''
          let closingDateAsString = closingDate ? this.api.moment(closingDate).format('YYYY-MM-DD') : closingDate = moment().format("YYYY-MM-DD")

          this._isChronical(startingDateAsString, closingDateAsString) === true ? this.set("temporalityItemIdx", this.temporalityList.indexOf(this.temporalityList.find(c => c.code === "chronic"))) :
              this._isSubAcute(startingDateAsString, closingDateAsString) === true ? this.set("temporalityItemIdx", this.temporalityList.indexOf(this.temporalityList.find(c => c.code === "subacute"))) :
                  this._isAcute(startingDateAsString, closingDateAsString) === true ? this.set("temporalityItemIdx", this.temporalityList.indexOf(this.temporalityList.find(c => c.code === "acute"))) :
                      console.log("bug")
      }
  }

  _isChronical(start, end) {
      return moment(start).isSameOrBefore(moment(end).subtract(6, "month"))
  }

  _isSubAcute(start, end) {
      return moment(start).isBetween(moment(end).subtract(6, "month"), moment(end).subtract(1, "month"))
  }

  _isAcute(start, end) {
      return moment(start).isSameOrAfter(moment(end).subtract(1, "month"))
  }

  _closingDateAsStringChanged(dateAsString) {
      if (!dateAsString) {
          this.entity && this.set('entity.closingDate', null);
          return;
      }
      const date = parseInt(dateAsString.replace(/(....)-(..)-(..)/, '$1$2$3')) * (this.displayTime ? 1000000 : 1);
      if (date !== this.value) {
          this.entity && this.set('entity.closingDate', date);
      }
  }

  _openingDateAsStringChanged(dateAsString) {
      if (!dateAsString) {
          this.entity && this.set('entity.openingDate', null);
          return;
      }
      const date = parseInt(dateAsString.replace(/(....)-(..)-(..)/, '$1$2$3')) * (this.displayTime ? 1000000 : 1);
      if (date !== this.value) {
          this.entity && this.set('entity.openingDate', date);
      }
  }

  _selectedTemporalityItemChanged(item) {
      if (item && item.id && this.entity) {
          const selectedItem = this.temporalityList.find(c => c.code === item.id)

          if (this.entity.tags.find(t => t.type === "CD-TEMPORALITY")) {
              this.entity.tags.splice(this.entity.tags.indexOf(this.entity.tags.find(t => t.type === "CD-TEMPORALITY")), 1);
              this.entity.tags.push(selectedItem);
          } else {
              this.entity.tags.push(selectedItem);
          }

          console.log(this.entity.tags)


      }
  }

  _getTpLabel(item) {
      return item.label[this.language] ? item.label[this.language] : item.label.en
  }

  _stripCodesByTypes(codes, types) {
      return (codes || []).filter(c => !types.includes(c.type))
  }

  _checkValidity() {
      if (this.entity.codes) {
          this.set("isValid", true)
      } else {
          this.set("isValid", false)
      }
  }
}

customElements.define(HealthProblemSelector.is, HealthProblemSelector);
