import '@polymer/iron-autogrow-textarea/iron-autogrow-textarea.js'
import '@polymer/iron-pages/iron-pages.js'
import '@polymer/paper-button/paper-button.js'
import '@polymer/paper-dialog/paper-dialog.js'
import '@polymer/paper-tabs/paper-tab.js'
import '@polymer/paper-tabs/paper-tabs.js'
import '../../../dynamic-form/dynamic-link.js';
import '../../../dynamic-form/dynamic-pills.js';
import '../../../ht-spinner/ht-spinner.js';
import * as models from 'icc-api/dist/icc-api/model/models';
import {TkLocalizerMixin} from "../../../tk-localizer";

import {PolymerElement,html} from '@polymer/polymer/polymer-element.js';
import {mixinBehaviors} from '@polymer/polymer/lib/legacy/class'
import {IronResizableBehavior} from '@polymer/iron-resizable-behavior/iron-resizable-behavior.js';

class HtPatHubTransactionView extends TkLocalizerMixin(mixinBehaviors([IronResizableBehavior], PolymerElement)) {
  static get template() {
    return html`
        <style>

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
                min-height: 600px;
                min-width: 800px;
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
                position: absolute;
                right: 15px;
                bottom: 15px;
                margin: 0;
                padding: 0;
            }

            .modal-button--save {
                background: var(--app-secondary-color);
                box-shadow: var(--shadow-elevation-2dp_-_box-shadow);
            }

            ht-spinner {
                position: relative;
                top: 10px;
                height: 42px;
                width: 42px;
            }

            #kmehr_slot {
                overflow-y: scroll;
                height: 90%;
            }
        </style>

        <paper-dialog id="dialog" opened="{{opened}}">
            <h2 class="modal-title">[[localize('hub_doc','Document',language)]]</h2>
            <ht-spinner active="[[isLoading]]"></ht-spinner>
            <paper-tabs class="tab-selector" selected="{{tabs}}">
                <paper-tab>[[localize('tra_vwr','Viewer',language)]]</paper-tab>
                <paper-tab>[[localize('tra_vwr','Viewer 2',language)]]</paper-tab>
                <paper-tab>[[localize('xml_vwr','XML View',language)]]</paper-tab>
            </paper-tabs>
            <iron-pages selected="[[tabs]]" class="">
                <page>
                    <div class="hub-cons">
                        <div class="hub-info">
                            <div><p><b>[[localize('tra_typ','Type',language)]]</b>[[_transactionType(transInfo)]]</p>
                            </div>
                            <div><p><b>[[localize('tra_dat','Date',language)]]</b>[[_transactionDate(transInfo)]]</p>
                            </div>
                            <div><p><b>[[localize('tra_aut','Author',language)]]</b>[[_transactionAuthor(transInfo)]]
                            </p></div>
                        </div>
                        <div>
                            <div id="kmehr_slot"></div>
                        </div>
                    </div>
                </page>
                <page>
                    <div>


                    </div>
                </page>
                <page>
                    <div class="hub-cons"> <!-- Notification input -->
                        <div>
                            <iron-autogrow-textarea class="paper-input-input" slot="input" id="transactionText" value="{{message}}"></iron-autogrow-textarea>
                        </div>

                    </div>
                </page>
            </iron-pages>
            <div class="end-buttons">
                <paper-button class="modal-button" dialog-dismiss="">[[localize('clo','Close',language)]]</paper-button>
            </div>
            <!--<div class="buttons">-->
            <!--<paper-button class="modal-button" dialog-dismiss>[[localize('can','Cancel',language)]]</paper-button>-->
            <!--<paper-button class="modal-button&#45;&#45;save" dialog-confirm autofocus on-tap="planAction">[[localize('save','Save',language)]]</paper-button>-->
            <!--</div>-->
        </paper-dialog>
`;
  }

  static get is() {
      return 'ht-pat-hub-transaction-view';
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
          transactionXml: {
              type: String,
              value: ''
          },
          transInfo: {
              type: Object,
              value: null
          },
          message: {
              type: Object,
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
      // this.set('qrCodeWidth', Math.min(offsetWidth - 32, offsetHeight - 160));
  }


  _yesOrNo(b) {
      return b ? this.localize('yes', 'yes', this.language) : this.localize('no', 'no', this.language)
  }

  isEven(n) {
      return n % 2 == 0;
  }

  getGender(niss) {
      if (niss && niss.length === 11) {
          const c9 = niss.substring(8, 9);
          const even = this.isEven(parseInt(c9));
          if (even) {
              return 'female';
          } else {
              return 'male';
          }
      } else {
          return '';
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


  open(transInfo, tranRespPromise) {
      this.$.dialog.open();
      this.set('transInfo', transInfo);
      this.set('isLoading', true);
      this.set('transactionXml', '');
      tranRespPromise.then(tranResp => {
          if (tranResp) {
              this.set('transactionXml', tranResp);
              this.set('message', JSON.stringify(tranResp));
              // this.formatResponse(transInfo, tranResp);
              // this.saveMedicationSchemeAsDocument("12345", tranResp).then(doc => {
              //     const docId = doc.id;
              //     console.log("docId = " + docId);
              // });
          }
          this.set('isLoading', false);
      }).catch(error => {
          console.log('getTransaction failed : ' + error);
          this.set('isLoading', false);
      })
  }

  saveMedicationSchemeAsDocument(transactionSetId, sXml) {
      return this.api.document().newInstance(this.user, null, {
          documentType: 'medicationscheme',
          mainUti: "public.xml",
          name: "medicationscheme.xml"
      }).then(
          doc => this.api.document().createDocument(doc)).then(
          doc => this.api.document().setAttachment(doc.id, undefined, this.api.crypto().utils.ua2ArrayBuffer(this.api.crypto().utils.utf82ua(sXml))).then(() => doc)
      ).catch(error => console.log(error))
  }

  _getNodeList(msg, tagName) {
      return msg ? msg.querySelectorAll(tagName) : null;
  }

  _getAuthorDesc(trn, type) {
      const auth = this._getAuthor(trn, type);
      if (auth) {
          let nm = auth.querySelector('name') ? auth.querySelector('name').innerHTML : '';
          nm += auth.querySelector('firstname') ? ' ' + auth.querySelector('firstname').innerHTML : ''
          nm += auth.querySelector('familyname') ? ' ' + auth.querySelector('familyname').innerHTML : ''
          return nm
      } else {
          return '';
      }
  }

  _getAuthor(trn, type) {
      //msg.querySelectorAll(tagName)[0].querySelectorAll('author')[0].querySelectorAll('hcparty')
      const hcps = Array.from(trn.querySelectorAll('author')[0].querySelectorAll('hcparty'));
      const auth = hcps ? hcps.find(hcp => hcp.querySelectorAll('cd')[0].innerHTML === type) : null;
      return auth;
  }

  _isSumehr(transInfo) {
      return this._transactionType(transInfo) === 'sumehr';
  }

  _isMedicationScheme(transInfo) {
      return this._transactionType(transInfo) === 'medicationscheme';
  }

  _isDiaryNote(transInfo) {
      return this._transactionType(transInfo) === 'diarynote';
  }

  _isOther(transInfo) {
      return !(this._isSumehr(transInfo) || this._isMedicationScheme(transInfo) || this._isDiaryNote(transInfo));
  }

  _transactionId(tr) {
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

  _transactionDate(tr) {
      if (tr && tr.date) {
          var d = new Date(0);
          d.setUTCMilliseconds(tr.date);
          return d.toDateString();
      } else {
          return "";
      }
  }

  _transactionAuthor(tr) {
      if (tr) {
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
      } else {
          return "";
      }
  }

  _transactionType(tr) {
      if (tr) {
          const cdTransType = tr.cds.find(cd => cd.s === "CD-TRANSACTION");
          if (cdTransType) {
              return cdTransType.value;
          } else {
              return "--";
          }
      } else {
          return "";
      }
  }

  formatResponse(transInfo, tranResp) {
      const slot = this.shadowRoot.querySelector("#kmehr_slot");
      if (tranResp) {
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(tranResp, "text/xml");
          const req = new XMLHttpRequest();
          req.onreadystatechange = function (event) {
              if (this.readyState === XMLHttpRequest.DONE) {
                  if (this.status === 200) {
                      const xsltProcessor = new XSLTProcessor();
                      const xslStylesheet = this.responseXML;
                      xsltProcessor.importStylesheet(xslStylesheet);
                      const fragment = xsltProcessor.transformToFragment(xmlDoc, document);
                      slot.innerHTML = "";
                      slot.appendChild(fragment);
                  } else {
                      slot.innerHTML = "ERROR: XSLT not found";
                  }
              }
          };

          const transtype = this._transactionType(transInfo);
          if (transtype == "sumehr") {
              req.open("GET", "sumehr_to_html.xslt", true);
              req.send(null);
          } else if (transtype == "medicationscheme") {
              req.open("GET", "sumehr_to_html.xslt", true);
              req.send(null);
          } else {
              slot.innerHTML = "No visualizer implemented for transaction of type " + transtype + ":" + tranResp
          }

      } else {
          slot.innerHTML = "No transaction found";
      }
  }

  close() {
      this.$.dialog.close();
  }
}

customElements.define(HtPatHubTransactionView.is, HtPatHubTransactionView);
