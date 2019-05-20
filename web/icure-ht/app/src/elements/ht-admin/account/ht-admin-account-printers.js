import '@polymer/iron-icon/iron-icon.js'
import '@polymer/paper-button/paper-button.js'
import '@polymer/paper-dialog/paper-dialog.js'
import '@polymer/paper-dropdown-menu/paper-dropdown-menu.js'
import '@polymer/paper-dropdown-menu/paper-dropdown-menu-light.js'
import '@polymer/paper-icon-button/paper-icon-button.js'
import '@polymer/paper-input/paper-input.js'
import '@polymer/paper-item/paper-item.js'
import '@polymer/paper-listbox/paper-listbox.js'
/**
@license
Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
import '../../../dropdown-style.js';

import '../../../paper-input-style.js';
import {TkLocalizerMixin} from "../../tk-localizer";

import {PolymerElement,html} from '@polymer/polymer/polymer-element.js';
class HtAdminAccountPrinters extends TkLocalizerMixin(PolymerElement) {
  static get template() {
    return html`
        <style include="shared-styles dropdown-style paper-input-style">
            :host {
                display: block;
                height: calc(100% - 20px);
                --paper-font-caption: {
                    line-height: 0;
                }
            }

            :host *:focus {
                outline: 0 !important;
            }

            .section-title {
                margin-top: 24px;
                margin-bottom: 0;
            }

            .printer-panel {
                width: 100%;
                height: 100%;
                grid-column-gap: 24px;
                grid-row-gap: 24px;
                padding: 0 24px;
                box-sizing: border-box;
                background: white;
            }

            .line {
                display: flex;
                flex-flow: row nowrap;
                justify-content: flex-start;
                align-items: center;
            }

            .col {
                flex-grow: 1;
                box-sizing: border-box;
                display: flex;
                flex-flow: row nowrap;
                justify-content: flex-start;
                align-items: center;
                margin-right: 12px;
                font-size: var(--font-size-normal);
            }

            .col:last-child {
                margin-right: 0;
            }

            .col > * {
                flex-grow: 1;
            }

            .col:first-child {
                width: 20%;
            }

            .col:nth-child(2) {
                width: 10%;
                min-width: 120px;
            }

            .col:last-child {
                width: 70%;
            }

            .edit {
                height: 90%;
                overflow: auto;
            }

            .buttons {
                display: flex;
                flex-flow: row-reverse;
                margin-bottom: 12px;
            }

            .modal-button {
                margin: 0;
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

            @media screen and (max-width: 375px) {
                .line:first-child {
                    display: none;
                }

                .line {
                    flex-flow: row wrap;
                }

                .col {
                    margin: 0;
                }

                .col:first-child {
                    width: 100%;
                }

                .col:nth-child(2) {
                    width: 100%;
                    min-width: 120px;
                }

                .col:last-child {
                    width: 100%;
                }
            }

        </style>

        <div class="printer-panel">

            <paper-item id="savedIndicator">[[localize('sav','SAVED',language)]]
                <iron-icon icon="icons:check"></iron-icon>
            </paper-item>

            <h4 class="section-title">[[localize('my_pro', 'My profil', language)]] - [[localize('acc_print_info',
                'Printers', language)]]</h4>

            <div class="edit">
                <div class="line">
                    <h5 class="col" style="width: 20%;">[[localize("type-doc","Type de documents",language)]]</h5>
                    <h5 class="col" style="width: 30%;">[[localize("format","Format d'impression",language)]]</h5>
                    <h5 class="col" style="width: 50%;">[[localize("printers","Imprimantes",language)]]</h5>
                </div>
                <template id="repeat" is="dom-repeat" items="[[listTypeDocument]]" as="preference">
                    <div class="line">
                        <div class="col">[[localize(preference.type,preference.typeLocalized,language)]]</div>
                        <div class="col">
                            <paper-dropdown-menu-light>
                                <label></label>
                                <paper-listbox slot="dropdown-content" selected="{{preference.formatSelected}}" attr-for-selected="name">
                                    <template is="dom-repeat" items="[[preference.formats]]">
                                        <paper-item name="[[item]]">[[item]]</paper-item>
                                    </template>
                                </paper-listbox>
                            </paper-dropdown-menu-light>
                        </div>
                        <div class="col">
                            <paper-dropdown-menu-light>
                                <label></label>
                                <paper-listbox slot="dropdown-content" selected="{{preference.printerSelected}}" attr-for-selected="name">
                                    <paper-item name="print-window">
                                        [[localize('print-window','print-window',language)]]
                                    </paper-item>
                                    <template is="dom-repeat" items="[[printers]]">
                                        <paper-item name="[[item.name]]">[[item.name]]</paper-item>
                                    </template>
                                </paper-listbox>
                            </paper-dropdown-menu-light>
                        </div>
                    </div>
                </template>
                <!--<div class="line">
                    <h5 class="col">[[localize("list-eti","Liste de vos étiquettes",language)]]</h5>
                </div>
                <vaadin-grid id="etiq" class="material" items="[[listStickers]]">
                    <vaadin-grid-column>
                        <template class="header">
                            [[localize('name-format','Nom du format',language)]]
                        </template>
                        <template>
                            <div>[[item.name]]</div>
                        </template>
                    </vaadin-grid-column>
                    <vaadin-grid-column>
                        <template class="header">
                            [[localize('format','Format',language)]]
                        </template>
                        <template>
                            <div>[[item.formatX]] mm - [[item.formatY]] mm</div>
                        </template>
                    </vaadin-grid-column>
                    <vaadin-grid-column>
                        <template class="header">
                            [[localize('printer','Printer',language)]]
                        </template>
                        <template>
                            <div>[[item.printer]]</div>
                        </template>
                    </vaadin-grid-column>
                    <vaadin-grid-column>
                        <template class="header">
                            <paper-icon-button class="mobile-menu-btn" icon="vaadin:plus" on-tap="_addSticker"></paper-icon-button>
                        </template>
                        <template>
                            <div>
                                <paper-icon-button class="mobile-menu-btn" icon="vaadin:edit" data-item\$="[[item.id]]" on-tap="_editSticker"></paper-icon-button>
                                <paper-icon-button class="mobile-menu-btn" icon="vaadin:trash" data-item\$="[[item.id]]" on-tap="_delSticker"></paper-icon-button>
                            </div>
                        </template>
                    </vaadin-grid-column>
                </vaadin-grid>-->
            </div>
            <div class="buttons">
                <paper-button on-tap="_savePrinters" class="modal-button modal-button--save">
                    [[localize('save','Save',language)]]
                </paper-button>
            </div>
        </div>

        <!--<paper-dialog id="sticker-dialog">
            <div>
                <paper-input label="[[localize('nam','name',language)]]" value="{{sticker.name}}" type="text"></paper-input>
                <paper-input label="[[localize('long-h','Longueur horizontal',language)]]" value="{{sticker.formatX}}" type="number"></paper-input>
                <paper-input label="[[localize('long-vert','Longueur verticale',language)]]" value="{{sticker.formatY}}" type="number"></paper-input>
                <paper-dropdown-menu class="flex">
                    <paper-listbox slot="dropdown-content" selected="{{sticker.printer}}" attr-for-selected="name">
                        <paper-item name="print-window">[[localize('print-window','print-window',language)]]</paper-item>
                        <template is="dom-repeat" items="[[printers]]">
                            <paper-item name="[[item.name]]">[[item.name]]</paper-item>
                        </template>
                    </paper-listbox>
                </paper-dropdown-menu>
            </div>
            <div class="buttons">
                <paper-button dialog-dismiss class="modal-button" >[[localize('clo','close',language)]]</paper-button>
                <paper-button dialog-confirm on-tap="_saveSticker" class="modal-button modal-button--save">[[localize('save','Save',language)]]</paper-button>
            </div>
        </paper-dialog>-->
`;
  }

  static get is() {
      return 'ht-admin-account-printers'
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
          printers: {
              type: Array,
              value: []
          },
          listTypeDocument: {
              type: Array,
              value: [
                  {type: "rapp-mail", typeLocalized: "rapport et courrier", formats: ["A4"]},
                  {type: "recipe", typeLocalized: "prescriptions et ITT", formats: ["A4", "DL"]},
                  {
                      type: "recipe-kine-inf",
                      typeLocalized: "prescription kiné et infi",
                      formats: ["A4", "DL"]
                  },
                  {type: "imagerie", typeLocalized: "demande d'imagerie", formats: ["A4"]},
                  {type: "doc-off-format", typeLocalized: "Document officiel", formats: ["A4"]},
                  {type: "sticker-mut", typeLocalized: "Etiquette mutuelle", formats: ["90 X 29"]},
                  {type: "sticker-mut-a4", typeLocalized: "Feuille d'étiquettes mutuelle", formats: ["A4"]},
                  {
                      type: "doc-little-format",
                      typeLocalized: "Autre document - petit format",
                      formats: ["A4", "A5", "DL"]
                  },
                  {
                      type: "doc-big-format",
                      typeLocalized: "Autre document - grand format",
                      formats: ["A4", "A5", "DL"]
                  }
              ]
          },
          electronAvailable: {
              type: Boolean,
              value: false
          },
          socket: {
              type: Object,
              value: {}
          }
      }
  }

  static get observers() {
      return ["_electronInit(electronAvailable)"];
  }

  constructor() {
      super()
  }

  ready() {
      super.ready()
      this.api.isElectronAvailable().then(elect => this.set('electronAvailable', elect))
  }

  _electronInit() {
      if (!this.electronAvailable) return;
      this.api.printers().then(prt => {
          this.set('printers', prt)
          fetch('http://localhost:16042/getPrinterSetting', {
              method: "POST",
              headers: {
                  "Content-Type": "application/json; charset=utf-8"
              },
              body: JSON.stringify({
                  userId: this.user.id
              })
          })
              .then(response => response.json())
              .then((responseParsed) => {
                  if (responseParsed.ok) {
                      const property = JSON.parse(responseParsed.data)
                      property.map(setting => {
                          const itemTypeDoc = this.listTypeDocument.findIndex(itemDoc => itemDoc.type === setting.type)
                          this.set("listTypeDocument." + itemTypeDoc + ".formatSelected", setting.format)
                          this.set("listTypeDocument." + itemTypeDoc + ".printerSelected", this.printers.find(printer => printer.name === setting.printer) ? setting.printer : "print-window")
                      })
                  } else {
                      console.log("error =>" + responseParsed.msg)
                  }
              })
      })
  }

  _savePrinters() {
      const printerSettingComplete = this.listTypeDocument.filter(type => (type.formatSelected || type.formatSelected === 0) && (type.printerSelected || type.printerSelected === 0))
          .map(x => {
              return {type: x.type, format: x.formatSelected, printer: x.printerSelected}
          })
      fetch('http://localhost:16042/setPrinterSetting', {
          method: "POST",
          headers: {
              "Content-Type": "application/json; charset=utf-8"
          },
          body: JSON.stringify({
              userId: this.user.id,
              settings: printerSettingComplete
          })
      })
          .then(answer => {
              answer = typeof answer === 'string' ? JSON.parse(_.trim(answer)) || {} : answer
              if (!!_.get(answer, "ok", false)) {
                  setTimeout(() => this.$.savedIndicator.classList.remove("saved"), 2000);
                  this.$.savedIndicator.classList.add("saved");
              }
          })
          .catch(error => {
              console.log("NOT SAVED");
          })
  }

  /** @ToDo Faire la gestion des stickers si nécessaire
   * _addSticker(){
      this.set("sticker",{
          id : 0,
          name : "",
          printer : "print-window",
          formatX : 0,
          formatY : 0
      })
      this.$["sticker-dialog"].open()
  }

   _editSticker(e){
      const stickTemp = this.listStickers.find(stick => stick.id===e.target.dataset.item)
      this.set("sticker",{
          id : stickTemp.id,
          name : stickTemp.name,
          printer : stickTemp.printer,
          formatX : stickTemp.formatX,
          formatY : stickTemp.formatY
      })
      this.$["sticker-dialog"].open()
  }

   _saveSticker(){
      const printerSetting =localStorage.getItem("stickersSetting") ? JSON.parse(localStorage.getItem("stickersSetting")) : []
      let stickTmp = {}
      if (this.sticker.id) {
          stickTmp = printerSetting.find(stick => stick.id === this.sticker.id)
          stickTmp.name = this.sticker.name
          stickTmp.printer = this.sticker.printer
          stickTmp.formatX = this.sticker.formatX
          stickTmp.formatY = this.sticker.formatY
          this.set("listStickers."+this.listStickers.findIndex(stick => stick.id===this.sticker.id),stickTmp)
      } else {
          stickTmp.id = this.api.crypto().randomUuid()
          stickTmp.name = this.sticker.name
          stickTmp.printer = this.sticker.printer
          stickTmp.formatX = this.sticker.formatX
          stickTmp.formatY = this.sticker.formatY
          this.push("listStickers",stickTmp)
      }

      localStorage.setItem("stickersSetting",JSON.stringify(this.listStickers))
  }

   _delSticker(e){
      const stickTemp = this.listStickers.filter(stick => stick.id!==e.target.dataset.item)
      this.set("listStickers",stickTemp)
      localStorage.setItem("stickersSetting",JSON.stringify(this.listStickers))
  }*/
}

customElements.define(HtAdminAccountPrinters.is, HtAdminAccountPrinters)
