import '@polymer/iron-icon/iron-icon.js'
import '@polymer/paper-button/paper-button.js'
import '@polymer/paper-dialog/paper-dialog.js'
import '@polymer/paper-input/paper-input.js'
import '../qrcode-manager/qrcode-printer.js';
import '../../dialog-style.js';
import 'node-forge/dist/forge.min.js';
import {TkLocalizerMixin} from "../tk-localizer";
import {PolymerElement,html} from '@polymer/polymer/polymer-element.js';
import {mixinBehaviors} from '@polymer/polymer/lib/legacy/class'
import {IronResizableBehavior} from '@polymer/iron-resizable-behavior/iron-resizable-behavior.js';

class HtImportKeychain extends TkLocalizerMixin(mixinBehaviors([IronResizableBehavior], PolymerElement)) {
  static get template() {
    return html`
        <style include="dialog-style">
            paper-dialog {
                width: 60%;
                min-height: 300px;
                height: 50%;
            }

            paper-input {
                --paper-input-container-focus-color: var(--app-primary-color);
                --paper-input-container-label: {
                    color: var(--app-text-color);
                    opacity: 1;
                };
            }

            .remove-msgKeystore-btn {
                background: var(--app-status-color-nok);
            }

            h4 {
                margin: 8px 0;
            }

            h5 {
                margin: 4px 0;
            }

            #errorKeystorePassword {
                color: var(--app-error-color);
            }

            #successKeystorePassword, #successKeystorePasswordMultiple {
                color: var(--app-status-color-ok);
            }

            #successKeystorePasswordMultiple {
                padding-right: 16px;
            }

            #currentEhKeychainList {
                height: 350px;
            }

            #ehKeychainFileInput {
                margin-bottom: 8px;
                padding: 0 8px;
                border: 1px solid var(--app-background-color-darker);
            }

            #ehKeychainFileInput:hover,
            #ehKeychainFileInput:focus {
                background: var(--app-background-color-dark);
            }

            paper-button.modal-button--cancel {
                background: transparent;
                border: 1px solid var(--app-background-color-dark);
            }

            @media screen and (max-width: 376px) {
                paper-dialog {
                    position: fixed;
                    max-height: initial !important;
                    max-width: initial !important;
                    margin: 0 !important;
                    left: 0 !important;
                    top: 0 !important;
                    height: 100% !important;
                    width: 100% !important;
                }
            }
        </style>

        <paper-dialog id="dialog" opened="{{opened}}" style="overflow: auto">
            <h2 class="modal-title">[[localize('ehe_key','eHealth keychain',language)]]</h2>
            <div class="content">
                <form is="form" id="keys-form">
                    <div class="layout vertical center">
                        <h4>[[localize('ple_sel_the_ehe_key','Please select the eHealth keychain',language)]]</h4>
                        <h5>[[localize('it_is_usu_loc_in_the_ehe_dir','it is usually located in the eHeath
                            directory',language)]]</h5>
                        <paper-input type="file" id="ehKeychainFileInput" on-change="ehKeychainSelected" multiple="true"></paper-input>

                        <vaadin-grid id="currentEhKeychainList" items="[[CurrentEhKeychains]]">
                            <vaadin-grid-column flex-grow="15">
                                <template class="header">
                                    <div>[[localize('name','Name',language)]]</div>
                                </template>
                                <template>
                                    <div class="cell frozen">[[item.keystore.name]]</div>
                                </template>
                            </vaadin-grid-column>
                            <vaadin-grid-column flex-grow="4">
                                <template class="header">
                                    <div>[[localize('set_active_keystore','Set the active keystore',language)]]</div>
                                </template>
                                <template>
                                    <paper-button on-tap="_SetMainKeystore" keystore\$="[[index]]">
                                        <iron-icon icon="[[getActiveButtonIconName(item.onlyDecrypt)]]" keystore\$="[[index]]"></iron-icon>
                                    </paper-button>
                                </template>
                            </vaadin-grid-column>
                            <vaadin-grid-column flex-grow="4">
                                <template class="header">
                                    <div>[[localize('set_mh_keystore','Set as MH keystore',language)]]</div>
                                </template>
                                <template>
                                    <paper-button on-tap="_SetMHKeystore" keystore\$="[[index]]">
                                        <iron-icon icon="[[getActiveMMButtonIconName(item.personalKeystore)]]" keystore\$="[[index]]"></iron-icon>
                                    </paper-button>
                                </template>
                            </vaadin-grid-column>
                            <vaadin-grid-column flex-grow="4">
                                <template class="header">
                                    <div>[[localize('set_keystore_pass','Set the keystore password',language)]]</div>
                                </template>
                                <template>
                                    <paper-button on-tap="_openKeystorePasswordDialog" index\$="[[index]]">
                                        <iron-icon icon="[[getPasswordButtonIconName(item.hasPassword)]]" index\$="[[index]]"></iron-icon>
                                    </paper-button>
                                </template>
                            </vaadin-grid-column>
                            <vaadin-grid-column flex-grow="1">
                                <template class="header">
                                    <div>[[localize('del','Delete',language)]]</div>
                                </template>
                                <template>
                                    <div class="cell frozen">
                                        <paper-button hidden="[[_displayAltDeleteButton(item)]]">
                                            <iron-icon icon="delete" on-tap="_removeKeystore" keystore\$="[[item.keystore.name]]"></iron-icon>
                                        </paper-button>
                                        <!--<paper-button class="unset-msgMMKeystore-btn" on-tap="_unsetMMKeystore" hidden='[[item.personalKeystore]]'>[[localize('unsetMHKeychain','Unset MH keystore',language)]]</paper-button>-->
                                    </div>
                                </template>
                            </vaadin-grid-column>
                        </vaadin-grid>

                    </div>
                    <div>{{message}}</div>
                </form>
            </div>

            <div class="buttons">
                <paper-button dialog-confirm="" autofocus="" class="modal-button modal-button--save">
                    [[localize('done','Done',language)]]
                </paper-button>
            </div>
        </paper-dialog>
        <paper-dialog id="keystorePasswordDialog">
            <h2 class="modal-title">[[localize('mdp','Password',language)]]</h2>
            <div class="content">
                <h5 id="passwordDialogSubtitle"></h5>

                <span id="errorKeystorePassword"></span>
                <paper-input id="newPasswordKeystore" label="Set password" type="password"></paper-input>
            </div>

            <div class="buttons">
                <paper-button dialog-dismiss="" class="modal-button modal-button--cancel">
                    [[localize('can','Cancel',language)]]
                </paper-button>
                <paper-button autofocus="" on-tap="_setPassword" class="modal-button modal-button--save">
                    [[localize('save','Save',language)]]
                </paper-button>
            </div>
        </paper-dialog>
`;
  }

  static get is() {
      return 'ht-import-keychain';
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
          opened: {
              type: Boolean,
              value: false
          },
          CurrentEhKeychains: {
              type: Array,
              value: []
          },
          SelectedEhKeychains: {
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

  apiReady() {
      if (!this.api || !this.user || !this.user.id || !this.opened) return;
  }

  ehKeychainSelected() {

      const actifKeystore = localStorage.getItem(this.api.crypto().keychainLocalStoreIdPrefix + this.user.healthcarePartyId) || "";
      const prefixMMH = this.api.crypto().keychainLocalStoreIdPrefix + "MMH.";
      const mmhKeystore = localStorage.getItem(prefixMMH + this.user.healthcarePartyId) || "";

      if (this.$.ehKeychainFileInput.inputElement && this.$.ehKeychainFileInput.inputElement.inputElement) {
          Object.values(this.$.ehKeychainFileInput.inputElement.inputElement.files).forEach(item => {

              const fr = new FileReader();
              fr.onload = function (e) {
                  const keychain = e.target.result;
                  this.api.crypto().saveKeychainInBrowserLocalStorage(this.user.healthcarePartyId + "." + item.name, keychain);

                  let keystore = localStorage.getItem(this.api.crypto().keychainLocalStoreIdPrefix + this.user.healthcarePartyId + "." + item.name);
                  if (!this.CurrentEhKeychains.map(keychaine => keychaine.keystore.name).includes(item.name)) {
                      this.push('CurrentEhKeychains', {
                          keystore: {name: item.name, file: keystore},
                          onlyDecrypt: !(keystore !== "" && keystore === actifKeystore),
                          personalKeystore: !(keystore !== "" && keystore === mmhKeystore),
                          hasPassword: !!(localStorage.getItem(this.api.crypto().keychainLocalStoreIdPrefix + "password." + this.user.healthcarePartyId + "." + item.name))
                      });
                  }

              }.bind(this);
              fr.readAsArrayBuffer(item);

          })
      }

      //Clear control
      this.$.ehKeychainFileInput.value = '';

      this.dispatchEvent(new CustomEvent('file-selected', {
          detail: this.selectedEhKeychains,
          bubbles: true,
          composed: true
      }))
  }

  attached() {
      super.attached();
      this.async(this.notifyResize, 1);
  }

  onWidthChange() {
      const offsetWidth = this.$.dialog.offsetWidth;
      const offsetHeight = this.$.dialog.offsetHeight;
      if (!offsetWidth || !offsetHeight) {
          return;
      }
  }

  open() {
      this.$.dialog.open();
      this.set("CurrentEhKeychains", this.getCurrentEhKeychains());

  }

  close() {
      this.$.dialog.close();
  }

  _removeKeystore(e) {

      if (confirm(this.localize('del', 'Delete', this.language) + " ?")) {
          let keystore = e.target.getAttribute('keystore') || "";

          let keys = Object.keys(localStorage);
          const healthcarePartyId = this.user.healthcarePartyId;

          keys.forEach(k => {
              if (k = this.api.crypto().keychainLocalStoreIdPrefix + healthcarePartyId + "." + keystore) {
                  localStorage.removeItem(k);
                  localStorage.removeItem(k.replace("keychain.", "keychain.password."));
              }
          });

          this.refreshCurrentEhKeychainList();
      }
  }

  // _unsetMMKeystore(){
  // 	localStorage.removeItem(this.api.crypto().keychainLocalStoreIdPrefix + 'MMH.' + this.user.healthcarePartyId);
  // 	this.refreshCurrentEhKeychainList();
  // }

  _SetMainKeystore(e) {
      let keystore = e.target.getAttribute('keystore');
      localStorage.setItem(this.api.crypto().keychainLocalStoreIdPrefix + this.user.healthcarePartyId, this.CurrentEhKeychains[keystore].keystore.file);

      this.refreshCurrentEhKeychainList();
  }

  _SetMHKeystore(e) {
      let keystore = e.target.getAttribute('keystore');

      let currentKeystore = localStorage.getItem(this.api.crypto().keychainLocalStoreIdPrefix + 'MMH.' + this.user.healthcarePartyId);

      if (currentKeystore && currentKeystore == this.CurrentEhKeychains[keystore].keystore.file) {
          localStorage.removeItem(this.api.crypto().keychainLocalStoreIdPrefix + 'MMH.' + this.user.healthcarePartyId);
      } else {
          localStorage.setItem(this.api.crypto().keychainLocalStoreIdPrefix + 'MMH.' + this.user.healthcarePartyId, this.CurrentEhKeychains[keystore].keystore.file);
      }

      this.refreshCurrentEhKeychainList();
  }

  getCurrentEhKeychains() {

      let EhKeychains = [];
      let keys = Object.keys(localStorage);
      const prefixMMH = this.api.crypto().keychainLocalStoreIdPrefix + "MMH.";
      const healthcarePartyId = this.user.healthcarePartyId;
      const actifKeystore = localStorage.getItem(this.api.crypto().keychainLocalStoreIdPrefix + healthcarePartyId) || "";
      const mmhKeystore = localStorage.getItem(prefixMMH + healthcarePartyId) || "";

      keys.forEach(k => {
          if (k.includes(this.api.crypto().keychainLocalStoreIdPrefix + healthcarePartyId + ".")) {
              let Keystore = localStorage.getItem(k);
              EhKeychains.push({
                  keystore: {
                      name: k.replace(this.api.crypto().keychainLocalStoreIdPrefix, "").replace(healthcarePartyId + ".", ""),
                      file: Keystore
                  }, onlyDecrypt: !(Keystore !== "" && Keystore === actifKeystore),
                  personalKeystore: !(Keystore !== "" && Keystore === mmhKeystore),
                  hasPassword: !!(localStorage.getItem(k.replace(this.api.crypto().keychainLocalStoreIdPrefix, this.api.crypto().keychainLocalStoreIdPrefix + "password.")))
              });
          }
      })

      return EhKeychains;
  }

  refreshCurrentEhKeychainList() {
      this.set("CurrentEhKeychains", this.getCurrentEhKeychains());
      let currentEhKeychainList = this.shadowRoot.querySelector('#currentEhKeychainList');
      currentEhKeychainList.clearCache();
  }

  _openKeystorePasswordDialog(e) {
      let index = e.target.getAttribute('index');
      const keystore = this.CurrentEhKeychains[index];
      this.set("SelectedEhKeychains", keystore)

      this.$.errorKeystorePassword.innerHTML = "";
      this.$.passwordDialogSubtitle.innerHTML = this.localize('ehe_key', 'eHealth keychain', language) + " " + keystore.keystore.name;

      this.$.newPasswordKeystore.value = "";
      this.$.keystorePasswordDialog.open();
  }

  _setPassword() {

      //TODO: displace dependence at right place
      const forge = require('node-forge');

      const keystore = this.SelectedEhKeychains;
      const value = this.$.newPasswordKeystore.value;
      const healthcarePartyId = this.user.healthcarePartyId;
      const prefix = this.api.crypto().keychainLocalStoreIdPrefix + "password.";

      try {
          let p12Der = forge.util.decode64(keystore.keystore.file);
          let p12Asn1 = forge.asn1.fromDer(p12Der);


          try {
              //Check keystore password
              let p12 = forge.pkcs12.pkcs12FromAsn1(p12Asn1, value);

              this.$.errorKeystorePassword.innerHTML = "";
              this.$.newPasswordKeystore.value = "";

              //Encrypt and store password
              try {
                  this._setCryptedValueInLocalstorage(healthcarePartyId, prefix + this.user.healthcarePartyId + "." + keystore.keystore.name, value)
                      .then(p => this.refreshCurrentEhKeychainList());
                  this.$.keystorePasswordDialog.close();
              } catch (ex) {
                  this.$.errorKeystorePassword.innerHTML = this.localize('una_store_password', 'Unable to store the password', language);
                  console.log(ex);
              }

          } catch (ex) {
              this.$.errorKeystorePassword.innerHTML = this.localize('inv_pas', 'Invalid password', language);
              console.log(ex);
          }
      } catch (ex) {
          this.$.errorKeystorePassword.innerHTML = this.localize('inv_keychain_file', 'Invalid keystore file', language);
          console.log(ex);
      }

  }

  getActiveButtonIconName(AlternateKeystore) {
      return AlternateKeystore ? "radio-button-unchecked" : "radio-button-checked"
  }

  getActiveMMButtonIconName(personalKeystore) {
      return personalKeystore ? "check-box-outline-blank" : "check-box"
  }

  getPasswordButtonIconName(havePassword) {
      return havePassword ? "check-circle" : "create"
  }

  _displayAltDeleteButton(item) {
      return !item.onlyDecrypt || !item.personalKeystore
  }

  _setCryptedValueInLocalstorage(healthcarePartyId, key, value) {
      return this.api.crypto().hcpartyBaseApi.getHcPartyKeysForDelegate(healthcarePartyId)
          .then(encryptedHcPartyKey =>
              this.api.crypto().decryptHcPartyKey(healthcarePartyId, healthcarePartyId, encryptedHcPartyKey[healthcarePartyId], true)
          )
          .then(importedAESHcPartyKey =>
              this.api.crypto().AES.encrypt(importedAESHcPartyKey.key, this.api.crypto().utils.text2ua(value))
          )
          .then(data =>
              this.api.crypto().utils.ua2text(data)
          )
          .then(encryptedData =>
              localStorage.setItem(key, encryptedData)
          );
  }
}

customElements.define(HtImportKeychain.is, HtImportKeychain);
