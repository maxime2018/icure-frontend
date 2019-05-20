import '@polymer/iron-icon/iron-icon.js'
import '@polymer/iron-input/iron-input.js'
import '@polymer/paper-input/paper-input-container.js'
import '@polymer/paper-item/paper-item.js'
import '@polymer/paper-listbox/paper-listbox.js'
import '@polymer/paper-menu-button/paper-menu-button.js'
import './dynamic-link.js';
import '../../dropdown-style.js';
import '../../paper-input-style.js';
import {TkLocalizerMixin} from "../tk-localizer";

const $_documentContainer = document.createElement('template');

$_documentContainer.innerHTML = `<dom-module id="material-text-field-custom" theme-for="vaadin-text-field">
    <template>
        <style>
            :host {
                padding-top: 8px;
                margin-bottom: 0px;
            }

            [part="value"] {
                font-size: var(--font-size-normal);
            }
        </style>
    </template>
</dom-module>`;

document.head.appendChild($_documentContainer.content);
import {PolymerElement,html} from '@polymer/polymer/polymer-element.js';
import {mixinBehaviors} from '@polymer/polymer/lib/legacy/class'
import {IronResizableBehavior} from '@polymer/iron-resizable-behavior/iron-resizable-behavior.js';

class DynamicPopupMenu extends TkLocalizerMixin(mixinBehaviors([IronResizableBehavior], PolymerElement)) {
  static get template() {
    return html`
        <style include="paper-input-style">
            :host {
                flex-grow: var(--dynamic-field-width, 50);
                position: relative;
                min-width: calc(var(--dynamic-field-width-percent, '50%') - 12px);
                margin: 0 6px;
                --paper-font-caption_-_line-height: var(--font-size-normal);
                height: 40px;
            }

            dynamic-link {
                position: absolute;
                right: 0;
                top: 8px;
            }

            .modified-icon {
                width: 18px;
            }

            .modified-previous-value {
                color: var(--app-text-color-disabled);
                text-decoration: line-through;
                font-style: italic;
            }

            .modified-before-out {
                color: var(--app-secondary-color-dark);
                text-align: right;
                float: right;
                font-style: italic;
                border-bottom: 1px dotted var(--app-secondary-color-dark);
            }

            .modified-after-out {
                color: var(--app-secondary-color-dark);
                text-align: right;
                float: right;
                font-style: italic;
                border-bottom: 1px dotted var(--app-secondary-color-dark);
            }

            vaadin-combo-box {
                width: 100%;
                font-size: 11px;
            }

            paper-menu-button {
                padding: 0;
            }

            paper-input-container {
                --paper-input-container-input: {
                    height: 22px;
                    font-size: var(--font-size-normal);
                    line-height: var(--font-size-normal);
                    padding: 0 8px;
                    box-sizing: border-box;
                    background: var(--app-input-background-color);
                    border-radius: 4px 0 0 0;
                };
                --paper-input-suffix: {
                    background: var(--app-input-background-color);
                    padding: 2px 2px 0;
                    box-sizing: border-box;
                    border-radius: 0 4px 0 0;
                    height: 22px;
                };
                --paper-listbox: {
                    padding: 0;
                };

                --paper-item: {
                    height: 28px;
                    font-size: var(--font-size-normal);
                    padding: 0 12px;
                    min-height: 28px;
                };

            }

            paper-menu-button {
                height: 22px;
                width: 22px;
                top: 2px;
            }

            iron-input {
                min-width: 0;
                box-sizing: border-box;
                width: 100%;
                max-width: 100%;
                position: relative;
            }

            input {
                border: none;
                width: 0;
                min-width: 0;
                outline: 0;
                padding: 0;
                font-size: var(--font-size-normal);
                box-sizing: border-box;
                max-width: calc(100% - 16px);
                width: calc(100% - 22px);
                position: absolute;
                height: 100%;
                background: transparent;
            }


        </style>

        <template is="dom-if" if="[[readOnly]]">
            <paper-input-container always-float-label="true">
                <label slot="label">[[localize(label,label,language)]]
                    <template is="dom-if" if="[[wasModified]]">
                        <span class="modified-before-out">[[localize('mod','modified',language)]] [[lastModified]] <iron-icon class="modified-icon" icon="schedule"></iron-icon></span>
                    </template>
                    <template is="dom-if" if="[[isModifiedAfter]]">
                        <span class="modified-after-out">[[localize('obs_val','obsolete value',language)]]<iron-icon class="modified-icon" icon="report-problem"></iron-icon></span>
                    </template>
                </label>
                <iron-input slot="input" bind-value="{{traductValue}}">
                    <input type="text" value="{{traductValue::input}}" readonly="">
                </iron-input>
            </paper-input-container>
        </template>
        <template is="dom-if" if="[[!readOnly]]">
            <template is="dom-if" if="[[!dataSource]]">
                <paper-input-container always-float-label="true">
                    <label slot="label">[[localize(label,label,language)]]
                        <template is="dom-if" if="[[wasModified]]">
                            <span class="modified-before-out">[[localize('mod','modified',language)]] [[lastModified]] <iron-icon class="modified-icon" icon="schedule"></iron-icon></span>
                        </template>
                        <template is="dom-if" if="[[isModifiedAfter]]">
                            <span class="modified-after-out">[[localize('obs_val','obsolete value',language)]]<iron-icon class="modified-icon" icon="report-problem"></iron-icon></span>
                        </template>
                    </label>
                    <iron-input slot="input" bind-value="{{traductValue}}">
                        <input readonly="" type="text" value="{{traductValue::input}}" on-tap="_openPopupMenu">
                    </iron-input>
                    <paper-menu-button id="paper-menu-button" slot="suffix" horizontal-offset="[[listboxOffsetWidth]]">
                        <iron-icon icon="paper-dropdown-menu:arrow-drop-down" slot="dropdown-trigger"></iron-icon>
                        <paper-listbox id="dropdown-listbox" slot="dropdown-content" selected="{{selected}}">
                            <paper-item>[[localize('auc','Aucun',language)]]</paper-item>
                            <template is="dom-repeat" items="[[options]]">
                                <paper-item>[[localize(item,item,language)]]</paper-item>
                            </template>
                        </paper-listbox>
                    </paper-menu-button>
                </paper-input-container>
            </template>
            <template is="dom-if" if="[[dataSource]]">
                <vaadin-combo-box filtered-items="[[items]]" item-label-path="name" item-value-path="id" on-filter-changed="_filterChanged" label="[[_label(label)]]" value="{{comboBoxValue}}"></vaadin-combo-box>
            </template>
            <dynamic-link i18n="[[i18n]]" language="[[language]]" resources="[[resources]]" linkables="[[linkables]]" represented-object="[[key]]" api="[[api]]"></dynamic-link>
        </template>
`;
  }

  static get is() {
      return 'dynamic-popup-menu';
  }

  static get properties() {
      return {
          wasModified: {
              type: Boolean
          },
          isModifiedAfter: {
              type: Boolean
          },
          readOnly: {
              type: Boolean,
              value: false
          },
          lastModified: {
              type: String
          },
          label: {
              type: String
          },
          value: {
              type: String,
              notify: true,
              observer: '_valueChanged'
          },
          comboBoxValue: {
              type: String,
              observer: '_comboBoxValueChanged'
          },
          selected: {
              type: Number,
              observer: '_selectedChanged'
          },
          selectedItem: {
              type: String
          },
          options: {
              type: Array
          },
          dataSource: {
              type: Object,
              value: null,
              observer: '_dataSourceChanged'
          },
          width: {
              type: Number,
              value: 48,
              observer: '_widthChanged'
          },
          listboxOffsetWidth: {
              type: Number,
              value: -100
          },
          items: {
              type: Array,
              value: function () {
                  return [];
              }
          },
          traductValue: {
              type: String
          },
          displayAllAlways: {
              type: Boolean,
              value: false
          }
      };
  }

  ready() {
      super.ready();
      this.addEventListener('iron-resize', () => this.onWidthChange());
  }

  attached() {
      super.attached();
      this.async(this.notifyResize, 1);
  }

  onWidthChange() {
      if (!this.offsetWidth) {
          return;
      }
      this.set('listboxOffsetWidth', Math.min(-100, -this.offsetWidth + 16));
      if (this.width && this.$['dropdown-listbox']) {
          this.$['dropdown-listbox'].style.width = '' + (this.offsetWidth - 16) + 'px';
      }
  }

  _widthChanged(width) {
      this.updateStyles({'--dynamic-field-width': width, '--dynamic-field-width-percent': '' + width + '%'});
      if (this.$['dropdown-listbox']) {
          this.$['dropdown-listbox'].updateStyles({'--dynamic-field-width-percent': '' + width + '%'});
      }
  }

  _selectedChanged(selected) {
      if (this.readOnly) {
          return;
      }
      this.set('value', this.options[selected - 1] || null);
  }

  _openPopupMenu() {
      if (this.readOnly) {
          return;
      }
      this.shadowRoot.querySelector('#paper-menu-button').open();
  }

  _comboBoxValueChanged(value) {
      if (value !== this.value && (value || this.value)) {
          this.set('value', value)
      }
  }

  _valueChanged(value) {
      if (value && this.dataSource) {
          if (!this.items || !this.items.find(i => i.id === value)) {
              this.dataSource.get(this.value).then(res => {
                  res = res || {name: this.localize(value, value, this.language), id: value}
                  if (!this.items.map(x => x.id).includes(res.id)) {
                      this.set('items', [res].concat(this.items || []))
                  }
                  this.set('comboBoxValue', value)
              }).catch(() => {
                  const res = {name: this.localize(value, value, this.language), id: value}
                  if (!this.items.map(x => x.id).includes(res.id)) {
                      this.set('items', [res].concat(this.items || []))
                  }
                  this.set('comboBoxValue', value)
              })
          } else {
              this.set('comboBoxValue', value)
          }
      } else {
          this.set('comboBoxValue', null)
      }

      this.set('traductValue', (value ? this.localize(value, value, this.language) : ""))
      if (!this.readOnly) {
          this.dispatchEvent(new CustomEvent('field-changed', {
              detail: {
                  context: this.context,
                  value: value
              }
          }));
      }
  }

  _filterChanged(e) {
      if (this.displayAllAlways) return;
      const text = e.detail.value;

      this.dataSource && this.dataSource.filter(text)
          .then(items =>
              this.value ?
                  this.dataSource.get(this.value).then(res =>
                      res && !items.some(it => it.id === res.id) ? [res].concat(items) : items
                  )
                  : items
          )
          .then(items =>
              this.set('items', items)
          );
  }

  _label(label) {
      return this.localize(label, label, this.language) || "\u00a0";
  }

  _dataSourceChanged() {
      if (this.dataSource && this.displayAllAlways) {
          this.dataSource && this.dataSource.filter(" ")
              .then(items =>
                  this.value ? this.dataSource.get(this.value).then(res => res && !items.some(it => it.id === res.id) ? [res].concat(items) : items) : items
              )
              .then(items =>
                  this.set('items', items)
              );
      }
  }
}

customElements.define(DynamicPopupMenu.is, DynamicPopupMenu);
