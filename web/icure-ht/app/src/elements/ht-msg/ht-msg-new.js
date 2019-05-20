import '@polymer/iron-autogrow-textarea/iron-autogrow-textarea.js'
import '@polymer/iron-icon/iron-icon.js'
import '@polymer/paper-button/paper-button.js'
import '@polymer/paper-checkbox/paper-checkbox.js'
import '@polymer/paper-dialog/paper-dialog.js'
import '@polymer/paper-icon-button/paper-icon-button.js'
import '@polymer/paper-input/paper-input.js'
import '@polymer/paper-input/paper-input-container.js'
import '@polymer/paper-item/paper-item.js'
import '../ht-spinner/ht-spinner.js';
import '../../vaadin-icure-theme.js';
import '../filter-panel/filter-panel.js';
import '../dynamic-form/dynamically-loaded-form.js';
import '../dynamic-form/entity-selector.js';

import _ from 'lodash/lodash'
import moment from 'moment/src/moment'
import {TkLocalizerMixin} from "../tk-localizer";

import {PolymerElement,html} from '@polymer/polymer/polymer-element.js';
class HtMsgNew extends TkLocalizerMixin(PolymerElement) {
  static get template() {
    return html`
        <style>
            h2 {
                margin-block-start: 0;
            }

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

            .prescription-progress-bar {
                width: calc(100% - 40px);
            }

            .details-panel {
                box-sizing: border-box;
                padding: 0 16px;
                height: 100%;
                width: 100%;
            }

            .contact-title {
                display: block;
                @apply --paper-font-body2;
                @apply --padding-32;
                padding-bottom: 8px;
                padding-top: 32px;
            }

            /*.contact-title:first-child{
                padding-top:0;
            }*/
            .pat-details-card > .card-content {
                padding: 16px 16px 32px !important;
            }

            .pat-details-card {
                width: 100%;
                padding: 10px 15px;
            }

            .vertical {
                display: flex;
                flex-direction: column;
                flex-grow: 1;
            }

            .horizontal {
                display: flex;
                flex-direction: row;
                flex-wrap: wrap;
                flex-basis: 100%;
                align-items: center;
            }

            .horizontal.first-line {
                margin-top: 16px;
            }

            .cell {
                display: flex;
                flex-grow: 1;
            }

            .cell.colspan2 {
                flex-grow: 2;
            }

            .cell.colspan3 {
                flex-grow: 3;
            }

            .cell.colspan6 {
                flex-grow: 6;
            }

            .type-to {
                width: 160px;
            }

            .options-cell {
                padding-left: 8px;
                margin-left: 8px;
                border-left: 1px solid var(--app-background-color-dark);
            }

            .destinations-list {
                overflow-x: auto;
            }

            .horizontal--nowrap {
                flex-flow: row nowrap;
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

            paper-dialog {
                margin: 0;
                min-width: 30%;
                width: 80%;
                height: 80vh;
                overflow: hidden;
            }

            .contact-card-container {
                position: relative;
                overflow-y: auto;
                height: calc(100% - 48px);
                padding-bottom: 32px;
            }

            .extra-info {
                color: var(--app-text-color-disabled);
                font-style: italic;
                font-size: 80%;
            }

            vaadin-upload {
                margin: 16px 0;
                min-height: 280px;
                min-height: 0;
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
                };
                --vaadin-upload-file-meta: {
                    min-height: 36px;
                };

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

            vaadin-grid {
                height: 100%;
                --vaadin-grid-body-row-hover-cell: {
                    /* background-color: var(--app-primary-color); */
                    color: white;
                };
                --vaadin-grid-body-row-selected-cell: {
                    background-color: var(--app-primary-color);
                    color: white;
                };
            }

            paper-input, paper-input-container {
                --paper-input-container-focus-color: var(--app-primary-color);
            }

            .modal-title {
                background: var(--app-background-color-dark);
                margin-top: 0;
                padding: 16px 24px;
            }

            .modal-subtitle {
                margin: 8px 12px 8px 0;
                font-weight: bold;
            }

            .patLabel {
                padding-top: 12px;
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

            .modal-button--save {
                box-shadow: var(--shadow-elevation-2dp_-_box-shadow);
                background: var(--app-secondary-color);
                color: var(--app-primary-color-dark);
                font-weight: 700;
                text-transform: capitalize;
            }

            .modal-button:disabled {
                background: var(--app-secondary-color-dark);
                box-shadow: none;
            }

            .modal-button--delete {
                box-shadow: var(--shadow-elevation-2dp_-_box-shadow);
                background: var(--app-status-color-nok);
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

            .layout-bar .list, .layout-bar .graphique, .layout-bar .doc {
                height: 32px;
                width: 32px;
                padding: 5px;
                color: var(--app-primary-color-dark);
            }

            .layout-bar .table {
                height: 30px;
                width: 30px;
                padding: 0;
                color: var(--app-primary-color-dark);
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
                z-index: 1000;
                left: 50%;
                transform: translate(-50%, 0);
                box-shadow: var(--app-shadow-elevation-2);
            }

            .add-forms-container {
                position: absolute;
                bottom: 48px;
                left: 0;
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

            .floating-action-bar iron-icon {
                box-sizing: border-box;
                padding: 2px;
                margin-right: 8px;
            }


            .contact-card-container {
                position: relative;
                overflow-y: auto;
                height: calc(100% - 48px);
                padding-bottom: 32px;
            }

            .two-col {
                display: grid;
                grid-template-columns: 50% 50%;
            }

            #metadataDialog {
                width: 50%;
                top: 50% !important;
                transform: translateY(-50%);
            }

            paper-checkbox {
                margin-right: 16px;
            }

            vaadin-combo-box {
                width: 100%;
            }

            iron-autogrow-textarea {
                min-height: 80px;
                width: 100%;
                --paper-input-container-focus-color: var(--app-primary-color);
            }

            .form-disabled {
                opacity: .5;
                background: var(--app-background-color-darker);
            }

            iron-autogrow-textarea .floated-label-placeholder {
                display: none;
            }

            .buttons {
                display: flex;
                flex-direction: row;
            }

            .force-left {
                flex-grow: 1;
            }

            .clearb {
                clear: both
            }

            .scrollbox {
                height: calc(100% - 117px);
                overflow-y: auto;
                margin-top: 0;
                border-bottom: 1px solid rgba(0, 0, 0, 0.1);
            }

            .field {
                padding: 12px 0;
                box-shadow: inset 0 -1px 0 0 rgba(100, 121, 143, 0.122);
            }

            .destination-tag {
                background: rgba(0, 0, 0, .1);
                color: var(--exm-token-input-badge-text-color, --text-primary-color);
                height: 32px;
                min-height: 32px;
                font-size: 14px;
                min-width: initial;
                padding: 0;
                margin: 10px 8px 8px 0;
                border-radius: 5px;
                text-transform: capitalize;
                overflow: hidden;
            }

            .destination-type {
                background: var(--app-secondary-color);
                color: var(--app-text-color);
                display: flex;
                height: 100%;
                flex-flow: row wrap;
                padding: 4px;
                box-sizing: border-box;
                align-items: center;
                margin-right: 8px;
            }

            .del-destination {
                height: 22px;
                width: 22px;
                margin: 0 4px 0 8px;
                padding: 2px;
            }

            paper-checkbox {
                --paper-checkbox-unchecked-color: var(--app-text-color);
                --paper-checkbox-label-color: var(--app-text-color);
                --paper-checkbox-checked-color: var(--app-secondary-color);
                --paper-checkbox-checked-ink-color: var(--app-secondary-color-dark);
            }

            #newMsg-From {
                width: calc(100% - 29px);
            }

            #customMetasList {
                height: 200px;
                overflow-y: auto;
            }

            .col-half {
                width: 45%;
            }

            .col-half:nth-child(2n) {
                border-left: 1px solid var(--app-background-color-dark);
                padding-left: 15px;
            }

            #messageBodyText {
                min-height: 200px;
            }

            #new-msg {
                display: flex;
                flex-direction: column;
                top: 70px !important;
                right: 7px !important;
                left: initial !important;
                position: fixed;
                max-width: initial !important;
                width: 83vw !important;
                max-height: initial !important;
                height: calc(100vh - 78px);
            }

            .spinner {
                display: flex;
                flex-grow: 1;
                width: 47px; /* force circle */
                transform: translateY(16px);
            }

            .sendingSpinner {
                display: block;
                float: right;
            }

            #success,
            #failed {
                display: flex;
                position: fixed;
                top: 50vh;
                right: 0;
                transform: translate(100vw, -50%);
                z-index: 999;
                padding: 16px;
                border-radius: 4px 0 0 4px;
                transition: 1s ease-in;
                flex-flow: row wrap;
                align-items: center;
                justify-content: flex-start;
                background: rgba(0, 0, 0, .42);
                color: var(--app-text-color-light);
                box-shadow: 0 9px 12px 1px rgba(0, 0, 0, .14),
                0 3px 16px 2px rgba(0, 0, 0, .12),
                0 5px 6px 0 rgba(0, 0, 0, .2);
            }

            #success iron-icon, #failed iron-icon {
                border-radius: 50%;
                padding: 2px;
                margin-right: 8px;
                box-sizing: border-box;
            }

            #success iron-icon {
                background: var(--app-status-color-ok);
            }

            #failed iron-icon {
                background: var(--app-status-color-nok);
            }

            .displayNotif {
                animation: displaySent 7.5s cubic-bezier(0.075, 0.82, 0.165, 1);
            }

            .modal-button--cancel {
                background: transparent;
                color: black;
                border: 1px solid var(--app-background-color-dark);
            }

            @keyframes displaySent {
                0% {
                    transform: translate(100vw, -50%);
                }
                10% {
                    transform: translate(0, -50%);
                }
                88% {
                    transform: translate(0, -50%);
                }
                100% {
                    transform: translate(100vw, -50%);
                }
            }

            @media screen and (max-width: 1030px) {
                #new-msg {
                    top: 64px !important;
                    left: 0 !important;
                    width: 100vw !important;
                    height: calc(100vh - 64px - 20px) !important;
                }
            }

            ht-spinner {
                height: 42px;
                width: 42px;
            }

        </style>

        <paper-dialog id="new-msg">
            <h2 class="modal-title">[[localize('new_mes','New message',language)]] [[isForwardOrReply]]</h2>
            <div class="scrollbox">

                <div class="horizontal first-line">
                    <div class="cell colspan6">
                        <div class="vertical">
                            <!--<div class="cell collspan2">-->
                            <!--<div class="modal-subtitle">[[localize('from','From',language)]]</div>-->
                            <!--<paper-input id="newMsg-From" value="[[user.name]]" no-label-float readonly></paper-input>-->
                            <div class="cell collspan2">
                                <div class="horizontal">
                                    <div class="modal-subtitle">[[localize('to','To',language)]]</div>
                                    <div class="cell">
                                        <vaadin-combo-box class="type-to" id="type-To" items="[[type]]" value="NIHII" required="" error-message="This field is required" label="[[localize('sch_by', 'Search by', language)]]" selected-item="{{recipientType}}"></vaadin-combo-box>
                                        <vaadin-combo-box id="newMsg-To" label="[[localize('rec','Destinataire',language)]]" filter="{{recipientFilter}}" filtered-items="[[hcpList]]" item-label-path="displayName" allow-custom-value="" on-change="_AddDestinations">
                                            <template>[[item.displayName]]</template>
                                        </vaadin-combo-box>
                                        <ht-spinner class="spinner" active="[[isLoadingDestinations]]" hidden="[[!isLoadingDestinations]]"></ht-spinner>
                                    </div>
                                </div>
                            </div>
                            <div class="cell">
                                <div class="modal-subtitle patLabel">[[localize('pati','Patient',language)]]</div>
                                <vaadin-combo-box id="newMsg-SSIN" label="[[localize('sel','Select',language)]]" filter="{{patientFilter}}" filtered-items="[[patientList]]" item-label-path="displayName" allow-custom-value="" on-change="_AddSSIN">
                                    <template>[[item.displayName]]</template>
                                </vaadin-combo-box>
                                <ht-spinner class="spinner" active="[[isAddingNiss]]" hidden="[[!isAddingNiss]]"></ht-spinner>
                            </div>
                        </div>
                    </div>
                    <div class="cell options-cell">
                        <div class="vertical">
                            <div class="modal-subtitle">[[localize('options','Options',language)]]</div>
                            <div class="cell">
                                <div>
                                    <paper-checkbox checked="[[newMessage.encrypted]]" on-change="_isCryptedMessage">
                                        [[localize('encrypted','encrypted',language)]]
                                    </paper-checkbox>
                                    <paper-checkbox checked="[[newMessage.important]]" on-change="_isImportant">
                                        [[localize('significant','significant',language)]]
                                    </paper-checkbox>
                                </div>
                            </div>
                            <div class="modal-subtitle">[[localize('accused','Accused',language)]]</div>
                            <div class="cell">
                                <div>
                                    <paper-checkbox checked="[[newMessage.usePublicationReceipt]]" on-checked-changed="_isPublicationReceipt">
                                        [[localize('publication','publication',language)]]
                                    </paper-checkbox>
                                    <paper-checkbox checked="[[newMessage.useReceivedReceipt]]" on-checked-changed="_isReceicedReceipt">
                                        [[localize('reception','reception',language)]]
                                    </paper-checkbox>
                                    <paper-checkbox checked="[[newMessage.useReadReceipt]]" on-checked-changed="_isReadReceipt">
                                        [[localize('read','read',language)]]
                                    </paper-checkbox>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="field horizontal destinations-list">
                    <div class="cell">
                        <template is="dom-if" if="[[newMessage.destinations]]">
                            <template is="dom-repeat" items="[[newMessage.destinations]]" as="destination" id="destinationsList">
                                <paper-item class="destination-tag" id="[[destination.displayName]]">
                                    <div class="destination-type">[[destination.type]]</div>
                                    <div class="one-line-menu list-title">
                                        [[destination.displayName]]
                                    </div>

                                    <paper-icon-button class="del-destination" icon="clear" id="[[destination.displayName]]" on-tap="_removeDestinations" indexed\$="[[index]]"></paper-icon-button>
                                </paper-item>
                            </template>
                        </template>
                    </div>
                </div>
                <div class="field">
                    <div class="modal-subtitle">[[localize('msg','Message',language)]]</div>
                    <div>
                        <paper-input id="newMsg-Subject" label="[[localize('sub','Subject',language)]]" value="{{newMessage.document.title}}" always-float-label=""></paper-input>
                        <paper-input-container alway-float-label="true">
                            <iron-autogrow-textarea slot="input" class="paper-input-input" id="messageBodyText" placeholder="[[localize('write_msg', 'Write a message', language)]]" value="{{newMessage.document.textContent}}"></iron-autogrow-textarea>
                        </paper-input-container>
                    </div>
                    <div>
                        <div class="modal-subtitle">[[localize('attachments','Attachments',language)]]</div>
                        <vaadin-upload id="vaadin-upload" no-auto="" files="{{files}}" target\$="[[api.host]]/document/{documentId}/attachment/multipart;jsessionid=[[api.sessionId]]" method="PUT" form-data-name="attachment" on-upload-success="_fileUpload" on-file-remove="_fileUploadRemove"></vaadin-upload>
                    </div>
                </div>
            </div>
            <div class="buttons">
                <div class="force-left">
                    <paper-button class="modal-button" on-tap="manageMetadata">Metadatas</paper-button>
                    <!--[[localize('manage','Manage',language)]]-->
                </div>
                <div class="fright">
                    <paper-button class="modal-button--cancel" on-tap="_cancel">[[localize('can','Cancel',language)]]
                    </paper-button>
                    <paper-button class="modal-button--save" on-tap="_SendNewMessage" hidden="[[hideSendBtn]]">
                        [[localize('send','Send',language)]]
                    </paper-button>
                    <template is="dom-if" if="[[isSendingMsg]]">
                        <ht-spinner class="sendingSpinner" active="[[isSendingMsg]]"></ht-spinner>
                    </template>
                </div>
            </div>
        </paper-dialog>

        <div id="success">
            <iron-icon icon="check"></iron-icon>
            [[localize('sen_succ','Success',language)]] !
        </div>
        <div id="failed">
            <iron-icon icon="clear"></iron-icon>
            [[localize('inv_err','Error',language)]]
        </div>

        <paper-dialog id="metadataDialog">
            <h3 class="modal-subtitle">[[localize('metadatas','Metadatas',language)]]</h3>
            <div>
                <paper-input id="newMsgMetadataKey" label="[[localize('key','Key',language)]]"></paper-input>
                <paper-input id="newMsgMetadataValue" label="[[localize('val','Value',language)]]"></paper-input>
                <paper-button class="modal-button fright" on-tap="addMetadata">[[localize('add','Add',language)]]
                </paper-button>
            </div>

            <vaadin-grid id="customMetasList" class="clearb" items="[[customMetas]]">
                <vaadin-grid-column>
                    <template class="header">
                        <div>[[localize('key','Key',language)]]</div>
                    </template>
                    <template>
                        <div class="cell frozen">[[item.0]]</div>
                    </template>
                </vaadin-grid-column>
                <vaadin-grid-column>
                    <template class="header">
                        <div>[[localize('val','Value',language)]]</div>
                    </template>
                    <template>
                        <div class="cell frozen">[[item.1]]</div>
                    </template>
                </vaadin-grid-column>
                <vaadin-grid-column>
                    <template>
                        <div class="cell frozen">
                            <paper-button class="remove-customMetas-btn" indexed\$="[[item.0]]">
                                <iron-icon icon="icons:clear" on-tap="_removeCustomMetas" indexed\$="[[item.0]]"></iron-icon>
                            </paper-button>
                        </div>
                    </template>
                </vaadin-grid-column>
            </vaadin-grid>

        </paper-dialog>
`;
  }

  static get is() {
      return 'ht-msg-new'
  }

  static get properties() {
      return {
          api: {
              type: Object
          },
          user: {
              type: Object
          },
          credentials: {
              type: Object
          },
          newMessage: {
              type: Object,
              value: {
                  customMetas: {},
                  document: {
                      textContent: '',
                      title: '',
                      mimeType: 'text/plain',
                      filename: ''
                  },
                  encrypted: false,
                  patientInss: '',
                  annex: [],
                  destinations: [],
                  useReceivedReceipt: false,
                  useReadReceipt: false,
                  usePublicationReceipt: false
              }
          },
          type: {
              type: [],
              value: ["CBE", "EHP", "INSS", "NIHII", "NIHII-HOSPITAL", "NIHII-PHARMACY"]
          },
          hcpList: {
              type: []
          },
          patientList: {
              type: []
          },
          customMetas: {
              type: [],
              value: []
          },
          isLoadingDestinations: {
              type: Boolean,
              value: false
          },
          isAddingNiss: {
              type: Boolean,
              value: false
          },
          currentContact: {
              type: Object,
              value: {
                  subContacts: [],
                  services: []
              }
          },
          files: {
              type: Array
          },
          isSendingMsg: {
              type: Boolean,
              value: false
          },
          hideSendBtn: {
              type: Boolean,
              value: true
          },
          uploadFiles: {
              type: Array,
              value: []
          }
      }
  }

  static get observers() {
      return ['_recipientFilterChanged(recipientType, recipientFilter)',
          '_patientFilterChanged(patientFilter)',
          '_filesChanged(files.*)',
          '_destinationsChanged(newMessage.destinations)'];
  }

  constructor() {
      super()
  }

  ready() {
      super.ready()
  }

  open(params) {
      this.clearField();
      let vaadinUpload = this.shadowRoot.querySelector('#vaadin-upload')
      vaadinUpload.set('i18n.addFiles.many', this.localize('upl_fil', 'Upload file', this.language))
      vaadinUpload.set('i18n.dropFiles.many', this.localize('uplabel', 'Drop files here...', this.language))
      this.set('isSendingMsg', false)
      this.set('hideSendBtn', true)
      this.set('uploadFiles', [])

      this.set('newMessage.useReceivedReceipt', false)
      this.set('newMessage.useReadReceipt', false)
      this.set('newMessage.usePublicationReceipt', false)
      if (params) {
          let msgFrom = ''
          let msgNewTxt = ''
          if (params.destinations && params.destinations.length && params.received) {
              msgFrom = `> [${params.received}] ${params.destinations[0].lastName} ${params.destinations[0].firstName}`
          }
          if (params.document && params.document.textContent) {
              const lines = params.document.textContent.split('\n')
              lines.forEach(l => {
                  if (l.length) msgNewTxt += "> " + l + "\n"
              })
          } else {
              msgNewTxt = this.localize('empty', 'Empty', this.language)
          }
          this.set("newMessage.annex", params.annex || [])
          this.set("newMessage.customMetas", params.customMetas || {})
          // this.set("newMessage.delegations", params.delegations)
          // params.destinations.forEach(d=>delete d.delegations)
          this.set('newMessage.destinations', params.destinations || [])
          this.set('newMessage.document.title', params.document.title || '')
          this.set('newMessage.document.textContent',
              params.type === 'fwd' ? `\r\n\r\n====${this.localize(params.type, '', this.language)} ====\r\n${params && params.document && params.document.textContent || this.localize('empty', 'Empty', this.language)}`
                  : params.type === 'replyto' ? `\r\n\r\n${msgFrom} :\r\n${msgNewTxt}`
                  : ''
          )
          // this.set("newMessage.patientInss", params.patientInss)
          vaadinUpload.files = this.newMessage.annex
          this.set('isForwardOrReply',
              params.type === 'fwd' ? `(${this.localize(params.type, '', this.language)})`
                  : params.type === 'replyto' ? `(${this.localize('answer', 'Answer', this.language)})`
                  : ''
          )
      }
      this.$['new-msg'].open()
  }

  _destinationsChanged(dests) {
      console.log('_destinationsChanged', this.newMessage.destinations)
      this.set('hideSendBtn', dests.length ? false : true)
  }

  _cancel() {
      this.clearField();
      this.$['new-msg'].close()
  }

  _recipientFilterChanged(type, filter) {
      if (filter && filter.length > 2) {
          const reqIdx = (this.recipientReqIdx = (this.recipientReqIdx || 0) + 1)
          setTimeout(() => {
              if (reqIdx !== this.recipientReqIdx) {
                  return
              }
              this.set('isLoadingDestinations', true)
              this.api.fhc().Addressbookcontroller().searchHcpUsingGET(this.api.keystoreId, this.api.tokenId, this.credentials.ehpassword, filter + '*')
                  .then(hcps => {
                      if (reqIdx === this.recipientReqIdx) {
                          let setList = []
                          hcps.map(hcp => {
                              hcp.displayName = `${hcp.lastName} ${hcp.firstName} [${hcp.nihii}]`
                              setList.push(hcp)
                          })
                          this.set("hcpList", setList)
                      }
                  }).finally(() => this.set('isLoadingDestinations', false))
          }, 300)
      } else {
          this.set("hcpList", []);
          this.set('isLoadingDestinations', false)
      }
  }

  getHcpLight(hcp, type) {
      let newHcp = {};
      newHcp.nihii = hcp.nihii ? parseInt(hcp.nihii) : "";
      newHcp.cbe = hcp.cbe ? parseInt(hcp.cbe) : "";
      newHcp.ehp = hcp.ehp ? hcp.ehp : "";
      newHcp.lastName = hcp.lastName ? hcp.lastName.trim() : "";
      newHcp.firstName = hcp.firstName ? hcp.firstName.trim() : "";
      newHcp.displayName = newHcp.lastName + " " + newHcp.firstName + " [" + this.getTypeValue(hcp, type) + "]";
      return newHcp;
  }

  getTypeValue(hcp, type) {
      switch (type) {
          case "CBE":
              return hcp.cbe ? hcp.cbe.toString() : "";
          case "INSS":
              return hcp.ssin ? hcp.ssin.toString() : "";
          case "EHP":
              return hcp.ehp ? hcp.ehp.toString() : "";
          case "NIHII":
          case "NIHII-HOSPITAL":
          case "NIHII-PHARMACY":
              return hcp.nihii ? hcp.nihii.toString() : "";
          default:
              return "";
      }
  }

  _patientFilterChanged(filter) {
      if (filter && filter.length > 3) {
          const reqIdx = (this.patientReqIdx = (this.patientReqIdx || 0) + 1)
          setTimeout(() => {
              reqIdx === this.patientReqIdx && this.api.patient().findByNameBirthSsinAutoWithUser(this.user, this.user.healthcarePartyId, filter, null, null, 100, "asc")
                  .then(patients => {
                      if (reqIdx === this.patientReqIdx) {
                          console.log(patients);
                          let filtredpatients = patients.rows.filter(pat => pat.ssin)
                              .map(pat => {
                                  let newPat = {};
                                  newPat.firstName = pat.firstName ? pat.firstName : "";
                                  newPat.lastName = pat.lastName ? pat.lastName : "";
                                  newPat.ssin = pat.ssin ? pat.ssin : "";
                                  newPat.displayName = newPat.firstName + " " + newPat.lastName + " " + newPat.ssin;
                                  return newPat
                              })
                          this.set("patientList", _.uniqBy(filtredpatients, 'displayName'))
                      }
                  })
          }, 300)
      } else {
          this.set("patientList", [])
      }
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

  _filesChanged() {
      // if (!this.currentContact) {
      //     return;
      // }
      const files = _.clone(this.files);
      // console.log('cloned files',files)
      const vaadinUpload = this.shadowRoot.querySelector('#vaadin-upload');

      Promise.all(files.filter(f => !f.attached).map(f => {
          f.attached = true;
          return this.api.document().newInstance(this.user, null, {
              documentType: 'result',
              mainUti: this.api.document().uti(f.type),
              name: f.name
          }).then(d => this.api.document().createDocument(d)).then(d => {
              f.doc = d;
              f.uploadTarget = (f.uploadTarget || vaadinUpload.target).replace(/\{documentId\}/, d.id);
              return f;
          })
      })).then(files => {
          files.map(file => {
              console.log('enters in map', file)
              const fr = new FileReader();
              fr.onload = function (se) {
                  let fileByteArray = [];
                  new Uint8Array(se.target.result).forEach(int8 => fileByteArray.push(int8));
                  this.set('newMessage.annex', [{
                      "content": fileByteArray,
                      "filename": file.name,
                      "mimeType": file.type ? file.type : 'text/plain',
                      "title": file.name,
                      "size": file.size > 1024 ? (file.size / 1024).toFixed(2) + " ko" : file.size + " o"
                  }]);
                  console.log('annexes', this.newMessage.annex)
                  this.dispatchEvent(new CustomEvent('file-received', file));
              }.bind(this);
              fr.readAsArrayBuffer(file);
          })
          files.length && vaadinUpload.uploadFiles(files);
      });
  }

  saveCurrentContact() {
      if (!this.currentContact.id) {
          this.currentContact.id = this.api.crypto().randomUuid()
      }
      return (this.currentContact.rev ? this.api.contact().modifyContactWithUser(this.user, this.currentContact) : this.api.contact().createContactWithUser(this.user, this.currentContact)).then(c => this.api.register(c, 'contact')).then(c => (this.currentContact.rev = c.rev) && c);
  }

  _fileUpload(e) {
      e.preventDefault();

      if (e.detail && e.detail.file) {

          console.log('form', form)
          if (!this.currentContact) {
              console.log('no currentContact, return;')
              this.push('currentContact.subContacts', {services: []}); // return;
              // return;
          }
          const vaadinUpload = this.shadowRoot.querySelector('#vaadin-upload');
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
          console.log('currentContact', this.currentContact)
          sc.services.push({serviceId: svc.id});
          if (!vaadinUpload.files.find(f => !f.complete && !f.error)) {
              this.saveCurrentContact();
          }
          console.log('v-up.files', vaadinUpload.files)
          this.set('uploadFiles', vaadinUpload.files)
      }

  }

  _fileUploadRemove(e) {
      if (e.detail && e.detail.file) {
          this.newMessage.annex.splice(this.newMessage.annex.indexOf(e.detail.file), 1);
      }
  }

  _AddDestinations() {
      let newMsgTo = this.shadowRoot.querySelector('#newMsg-To')
      let typeTo = this.shadowRoot.querySelector('#type-To')
      if (newMsgTo.selectedItem || (!newMsgTo.selectedItem && parseInt(newMsgTo.value))) {
          console.log('addDest', newMsgTo.selectedItem)
          let hcp = {}
          if (newMsgTo.selectedItem) {
              hcp = newMsgTo.selectedItem
          } else {
              hcp.displayName = newMsgTo.value
              hcp.nihii = typeTo.value.includes("NIHII") ? newMsgTo.value : undefined
              hcp.cbe = typeTo.value === "CBE" ? newMsgTo.value : undefined
              hcp.ssin = typeTo.value === "INSS" ? newMsgTo.value : undefined
          }
          hcp.type = typeTo.value
          this.push('newMessage.destinations', hcp)
          if (this.newMessage.destinations.length) {
              this.set('hideSendBtn', false)
          }
          newMsgTo.value = ""
      }
  }

  _removeDestinations(e) {
      let index = e.target.getAttribute('indexed');
      this.newMessage.destinations.splice(index, 1);
      let destinationsList = this.shadowRoot.querySelector('#destinationsList')
      destinationsList.render();
      this._destinationsChanged(this.newMessage.destinations)
  }

  _AddSSIN(e) {
      this.set('isAddingNiss', true)
      let newMsgSSIN = this.shadowRoot.querySelector("#newMsg-SSIN")
      if (newMsgSSIN && newMsgSSIN.selectedItem) {
          let ssin = newMsgSSIN.selectedItem.ssin
          this.set("newMessage.patientInss", ssin)
      } else {
          this.set("newMessage.patientInss", undefined)
      }
      this.set('isAddingNiss', false)
  }

  manageMetadata() {
      this.$.metadataDialog.open()
  }

  addMetadata() {

      let customMetas = this.newMessage.customMetas;
      customMetas[this.$.newMsgMetadataKey.value] = this.$.newMsgMetadataValue.value;
      this.set("newMessage.customMetas", customMetas);
      this.set("customMetas", Object.keys(customMetas).map(key => [key, customMetas[key]]));

      let newMsgMetadataKey = this.shadowRoot.querySelector('#newMsgMetadataKey');
      newMsgMetadataKey.value = "";
      let newMsgMetadataValue = this.shadowRoot.querySelector('#newMsgMetadataValue');
      newMsgMetadataValue.value = "";
  }

  _removeCustomMetas(e) {
      let index = e.target.getAttribute('indexed');
      delete this.newMessage.customMetas[index];
      this.set("customMetas", Object.keys(this.newMessage.customMetas).map(key => [key, this.newMessage.customMetas[key]]));
      let customMetasList = this.shadowRoot.querySelector('#customMetasList');
      customMetasList.clearCache()
  }

  _SendNewMessage() {
      this.$['success'].classList.remove('displayNotif')
      this.$['failed'].classList.remove('displayNotif')
      this.set('isSendingMsg', true)
      this.set('hideSendBtn', true)
      console.log(this.newMessage)
      this.api.hcparty().getCurrentHealthcareParty().then(currentHcp => {
          console.log('currentHcp', currentHcp)

          const forcedMetas = this._setMetaDatas(currentHcp, currentHcp, this.setAddressee(this.newMessage.destinations[0]), this.newMessage.annex)
          let customMetas = this.newMessage.customMetas
          Object.keys(forcedMetas).forEach(k => customMetas[k] = forcedMetas[k])
          console.log('newMessage', this.newMessage)

          let builtStatus = 0 << 0 | 1 << 1
          builtStatus = this.newMessage && this.newMessage.important ? builtStatus | 1 << 2 : builtStatus
          builtStatus = this.newMessage && this.newMessage.encrypted ? builtStatus | 1 << 3 : builtStatus
          builtStatus = this.newMessage && this.newMessage.annex.length ? builtStatus | 1 << 4 : builtStatus
          console.log('status', builtStatus)

          let message = {
              id: this.api.crypto().randomUuid(),
              publicationId: (new Date).getTime(),
              publicationDateTime: parseInt(moment().format('YYYYMMDD')),
              expirationDateTime: parseInt(moment().add(1, "years").format('YYYYMMDD')),
              customMetas: customMetas,
              document: {
                  title: this.newMessage.document.title ? this.newMessage.document.title : 'No title',
                  textContent: this.newMessage.document.textContent,
                  mimeType: 'text/plain',
                  filename: this.newMessage.document.title ? this.newMessage.document.title : 'No title'
              },
              freeText: this.newMessage.document.textContent ? this.newMessage.document.textContent : '',
              freeInformationTableTitle: null,
              freeInformationTableRows: {},
              patientInss: this.newMessage && this.newMessage.patientInss ? this.newMessage.patientInss : null,
              annex: this.newMessage.annex,
              copyMailTo: [],
              documentTitle: this.newMessage.document.title ? this.newMessage.document.title : 'No title',
              annexList: this.newMessage.annex,
              useReceivedReceipt: this.newMessage && this.newMessage.useReceivedReceipt ? this.newMessage.useReceivedReceipt : false,
              useReadReceipt: this.newMessage && this.newMessage.useReadReceipt ? this.newMessage.useReadReceipt : false,
              usePublicationReceipt: this.newMessage && this.newMessage.usePublicationReceipt ? this.newMessage.usePublicationReceipt : false,
              hasAnnex: this.newMessage.annex && this.newMessage.annex.length > 0,
              hasFreeInformations: false,
              important: this.newMessage && this.newMessage.important ? this.newMessage.important : false,
              encrypted: this.newMessage && this.newMessage.encrypted ? this.newMessage.encrypted : false,
              destinations: this.newMessage.destinations.map(hcp => this.setAddressee(hcp)),
              sender: this.setSenderAddressee(currentHcp),
              fromHealthcarePartyId: currentHcp.id,
              status: builtStatus
          };

          console.log('request', this.api.keystoreId, this.api.tokenId, this.credentials.ehpassword, message,
              message.usePublicationReceipt,
              message.useReceivedReceipt,
              message.useReadReceipt)

          this.api.fhc().Ehboxcontroller().sendMessageUsingPOST(
              this.api.keystoreId,
              this.api.tokenId,
              this.credentials.ehpassword,
              message,
              "" + message.usePublicationReceipt,
              "" + message.useReceivedReceipt,
              "" + message.useReadReceipt)
              .then(response => {
                  console.log(response);
                  if (response) {
                      this.clearField();
                      this.set('isSendingMsg', false)
                      this.set('newMessage.annex', []);
                      this.set('uploadFiles', [])
                      this.$['success'].classList.add('displayNotif')
                      this.$['new-msg'].close()
                  }
              })
              .catch(ex => {
                  console.log(ex);
                  this.$['failed'].classList.add('displayNotif')
                  this.set('isSendingMsg', false)
                  this.set('hideSendBtn', false)
              })

      })
  }

  msgBodyFileInputSelected() {

      let messageBodyFile = this.shadowRoot.querySelector('#messageBodyFile');
      let messageBodyText = this.shadowRoot.querySelector('#messageBodyText');

      messageBodyText.value = undefined;
      messageBodyText.disabled = false;
      messageBodyText.classList.remove("form-disabled");

      if (messageBodyFile.inputElement && messageBodyFile.inputElement.inputElement &&
          messageBodyFile.inputElement.inputElement.files.length > 0) {
          let file = messageBodyFile.inputElement.inputElement.files[0];

          const fr = new FileReader();
          fr.onload = function (e) {
              // let binfile = btoa(new Uint8Array(e.target.result).reduce((data, byte) => data + String.fromCharCode(byte), ""));
              let fileByteArray = [];
              new Uint8Array(e.target.result).forEach(int8 => fileByteArray.push(int8));

              this.set('newMessage.document.content', fileByteArray);
          }.bind(this)
          fr.readAsArrayBuffer(file)

          this.set('newMessage.document.filename', file.name);
          this.set('newMessage.document.mimeType', file.type);

          messageBodyText.disabled = true;
          messageBodyText.classList.add("form-disabled");
      } else {
          this.set('newMessage.document.content', null);
          this.set('newMessage.document.filename', null);
          this.set('newMessage.document.mimeType', null);
      }
  }

  setSenderAddressee(hcp) {
      let Addressee = {};
      Addressee.identifierType = {type: hcp.nihii ? "NIHII" : hcp.cbe ? "CBE" : hcp.bic ? "BIC" : ""};
      Addressee.id = this.getTypeValue(hcp, hcp.nihii ? "NIHII" : hcp.cbe ? "CBE" : hcp.bic ? "BIC" : "");
      Addressee.quality = hcp.quality ? hcp.quality.toUpper() : "DOCTOR";
      Addressee.applicationId = hcp.applicationID || null;
      Addressee.lastName = hcp.lastName ? hcp.lastName : null;
      Addressee.firstName = hcp.firstName ? hcp.firstName : null;
      Addressee.organizationName = null;
      Addressee.personInOrganisation = null;
      // if(hcp.quality) Addressee.quality = hcp.quality;

      return Addressee;
  }

  setAddressee(hcp) {
      let Addressee = {};
      Addressee.identifierType = {type: hcp.type};
      Addressee.id = this.getTypeValue(hcp, hcp.type);
      Addressee.quality = hcp.quality ? hcp.quality.toUpper() : "DOCTOR";
      Addressee.applicationId = hcp.applicationID || null;
      Addressee.lastName = hcp.lastName ? hcp.lastName : null;
      Addressee.firstName = hcp.firstName ? hcp.firstName : null;
      Addressee.organizationName = null;
      Addressee.personInOrganisation = null;
      // if(hcp.quality) Addressee.quality = hcp.quality;

      return Addressee;
  }

  clearField() {
      this.files = [];
      this.set("newMessage", {customMetas: {}, document: {}, annex: [], destinations: []})
      this.set('isForwardOrReply', '')
      let newMsgSSIN = this.shadowRoot.querySelector('#newMsg-SSIN');
      newMsgSSIN.value = "";
  }

  _isPublicationReceipt(e) {
      this.set('newMessage.usePublicationReceipt', e.target.checked)
  }

  _isReceicedReceipt(e) {
      this.set('newMessage.useReceivedReceipt', e.target.checked)
  }

  _isReadReceipt(e) {
      this.set('newMessage.useReadReceipt', e.target.checked)
  }

  _isImportant(e) {
      this.set('newMessage.important', e.target.checked)
  }

  _isCryptedMessage(e) {
      this.set('newMessage.encrypted', e.target.checked)
  }

  // _readFile(file) {
  //     const reader = new FileReader()
  //     reader.onload = (f)=>{return f.target.result}
  //     reader.onerror = ()=>{return "error"}
  //     reader.readAsText(file, "UTF-8")
  // }

  _isMedical(file) {
      let fileInfos
      // this.api.beresultimport().getInfos(file.doc.id).then(res=>fileInfos = res)
      const ext = (/[^.]+$/.exec(file.filename ? file.filename : file.name)).toString().toUpperCase()
      // const content = this._readFile(file)
      return
      ext.startsWith('DMA-') || ext.startsWith('HDM-') || ext.startsWith('ALA-') || ext.startsWith('CI-') || ext.startsWith('COG-') || ext == 'KMEHR' || ext == 'SUMEHR' ||
      ext.includes('TEC') || ext.includes('REP') || ext.includes('REC') || ext.includes('LAB') || ext.includes('KOM') || ext.includes("IMA")
          ? true : false
  }

  _getMedicalFormat(file) {
      const ext = (/[^.]+$/.exec(file.filename ? file.filename : file.name)).toString().toUpperCase()
      // const content = this._readFile(file)z
      return
      ext.startsWith('DMA-') ? "Medidoc" :
          ext.startsWith('HDM-') ? "Health One" :
              ext.startsWith('ALA-') ? "Windoc/Medar" :
                  ext.startsWith('CI-') ? "Medibase" :
                      ext.startsWith('COG-') ? "Medigest" :
                          ext == 'KMEHR' ? ext :
                              ext == 'SUMEHR' ? ext :
                                  ""
  }

  _getTransportType(file) {
      const ext = (/[^.]+$/.exec(file.filename ? file.filename : file.name)).toString().toUpperCase()
      // const content = this._readFile(file)
      const format = this._getMedicalFormat(file)
      const descr =
          ext.includes('TEC') ? " technical report" :
              ext.includes('REP') || ext.includes('REC') ? " medical report" :
                  ext.includes('LAB') ? " lab result" :
                      ext.includes('KOM') ? " comment file" :
                          ext.includes("IMA") ? " medical imaging" :
                              ""
      return format + descr
  }

  _setMetaDatas(author, sender, recipient, files) {
      const isPerson = (person) => {
              return person.lastName ? true : false
          },
          isText = (file) => {
              return file.mimeType === 'text/plain'
          },
          getMediaType = (file) => {
              const ext = (/[^.]+$/.exec(file.filename ? file.filename : file.name)).toString().toUpperCase()
              return 'TODO MediaType.' + ext
          },
          isTransaction = (isPerson(recipient) && this.uploadFiles.length ? this._isMedical(this.uploadFiles[0]) : false) // bool

      // initialize metas //
      let encodingMetas = {}
      if (files.length) {
          files.forEach((f) => {
              if (isText(file)) {
                  const i = files.indexOf(f)
                  encodingMetas["HC-AttachmentEncodingType" + (i == 0 ? '' : `-${i + 1}`)] = "UTF-8"
              }
          }) // foreach end
      }
      // required
      const neededMetas = {
              // "CM-MediaType" : files.length ? getMediaType(files[0]) : '', // https://www.ehealth.fgov.be/standards/kmehr/en/tables TODO
              "CM-AuthorID": author.nihii ? author.nihii : author.ssin, // 12345625001
              "CM-AuthorIDType": author.nihii ? "NIHII" : "SSIN", // NIHII
              "CM-AuthorType": author.civility ? author.civility.toUpperCase() : 'NOTFOUND', // doctor
              "CM-SenderID": sender.nihii ? sender.nihii : sender.ssin, // 12345625001
              "CM-SenderIDType": sender.nihii ? "NIHII" : "SSIN", // NIHII
              "CM-RecipientID": recipient.id, // 12345625001
              "CM-RecipientIDType": recipient.identifierType.type, // NIHII
              "CM-SendDateTime": moment().format('YYYY-MM-DD hh:mm:ss'), // 1997-01-01 12:34:56
              "CM-Requestnumber": parseInt(moment().format('YYMMDDhmmss')).toFixed(1), // 123456789.0
              "CM-EhrMessageType": isTransaction ? "Transactionnal" : "Functionnal",
              "CM-EhrMessage": isTransaction || false, // bool
              "CM-EtkApplicationID": this.api.tokenId ? this.api.tokenId : '', // certificate ID
              // "CM-AttachmentTransportType": files.length ? this._getTransportType(files[0]) : '' // main message format (first annex) TODO
          }
          // author
          , authorMetas = isPerson(author) ? {
              "CM-AuthorLastName": author.lastName.toUpperCase(),
              "CM-AuthorFirstName": author.firstName
          } : {
              "CM-AuthorName": author.organizationName
          }
          // sender
          , senderMetas = isPerson(sender) ? {
              "CM-SenderLastName": sender.lastName.toUpperCase(),
              "CM-SenderFirstName": sender.firstName
          } : {
              "CM-SenderName": sender.organizationName
          }
          // recipient
          , recipientMetas = isPerson(recipient) ? {
              "CM-RecipientLastName": recipient.lastName.toUpperCase(),
              "CM-RecipientFirstName": recipient.firstName,
          } : {
              "CM-RecipientName": recipient.organizationName
          }

      // join JSONs //
      let finalMetas = {}
      Object.keys(neededMetas).forEach(k => finalMetas[k] = neededMetas[k])
      Object.keys(authorMetas).forEach(k => finalMetas[k] = authorMetas[k])
      Object.keys(senderMetas).forEach(k => finalMetas[k] = senderMetas[k])
      Object.keys(recipientMetas).forEach(k => finalMetas[k] = recipientMetas[k])
      Object.keys(encodingMetas).forEach(k => finalMetas[k] = encodingMetas[k])

      return finalMetas
  }
}

customElements.define(HtMsgNew.is, HtMsgNew)
