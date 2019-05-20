import './ckmeans-grouping.js';
import './dynamic-form.js';
import {TkLocalizerMixin} from "../tk-localizer";

import {PolymerElement,html} from '@polymer/polymer/polymer-element.js';
class HtServicesList extends TkLocalizerMixin(PolymerElement) {
  static get template() {
    return html`
        <style>
            .form-title-bar-btn {
                height: 20px;
                width: 20px;
                padding: 2px;
            }

            .horizontal vaadin-date-picker {
                height: 90px;
                padding-bottom: 0px;
                @apply --padding-right-left-16
            }


            .link .ICD-10 span {
                content: '';
                display: inline-block;
                height: 6px;
                width: 6px;
                border-radius: 3px;
                margin-right: 3px;
                margin-bottom: 1px;
            }

            paper-listbox {
                min-width: 200px;
            }

            paper-menu-button {
                padding: 0;
            }

            vaadin-grid {
                /*height: unset;*/
                max-height: calc(100% - 104px);
                margin: 8px 0;
                box-shadow: var(--app-shadow-elevation-1);
                border: none;
                border-radius: 3px;
                overflow-y: auto;
                flex-grow: 1;
                margin-bottom: 46px;
            }

            span.outofrange-true {
                color: var(--app-status-color-nok);
            }

        </style>
        <vaadin-grid id="dynamic-list" size="10" multi-sort="[[multiSort]]" active-item="{{activeItem}}" items="[[_services(contacts,contacts.*)]]" on-tap="click">
            <vaadin-grid-column flex-grow="2" width="80px">
                <template class="header">
                    <vaadin-grid-sorter path="label">[[localize('lab','Label',language)]]</vaadin-grid-sorter>
                </template>
                <template><span class\$="outofrange-[[_isOutOfRange(item)]]">[[item.label]]</span></template>
            </vaadin-grid-column>
            <vaadin-grid-column flex-grow="1">
                <template class="header">
                    <vaadin-grid-sorter path="modified">[[localize('dat','Date',language)]]</vaadin-grid-sorter>
                </template>
                <template>[[_date(item)]]</template>
            </vaadin-grid-column>
            <vaadin-grid-column flex-grow="4">
                <template class="header">
                    Value
                </template>
                <template><span class\$="outofrange-[[_isOutOfRange(item)]]">[[_shortDescription(item)]]</span>
                </template>
            </vaadin-grid-column>
            <vaadin-grid-column flex-grow="4">
                <template class="header">
                    [[localize('nor_val','Normal values',language)]]
                </template>
                <template>[[_normalValues(item)]]</template>
            </vaadin-grid-column>
            <vaadin-grid-column flex-grow="2" width="80px">
                <template class="header">
                    <vaadin-grid-sorter path="function{[[_author(item)]]}">[[localize('aut','Author',language)]]
                    </vaadin-grid-sorter>
                </template>
                <template>[[_author(item)]]</template>
            </vaadin-grid-column>
        </vaadin-grid>
`;
  }

  static get is() {
      return 'ht-services-list';
  }

  static get properties() {
      return {
          api: {
              type: Object
          },
          user: {
              type: Object
          },
          contact: {
              type: Object,
              value: null
          },
          contacts: {
              type: Array,
              value: []
          },
          activeItem: {
              type: Object
          },
          currentContact: {
              type: Object,
              value: null
          },
          lastColumnSort: {
              type: String,
              value: null
          }
      };
  }

  constructor() {
      super();
  }

  ready() {
      super.ready()

      this._notifyResize()
  }

  _services(contacts) {
      return _.sortBy(_.flatMap(contacts, c => c.services), ['modified']);
  }

  _date(item) {
      return (item && item.modified) ? this.api.moment(item.modified).format(item.modified > 99991231 ? 'DD/MM/YYYY HH:mm' : 'DD/MM/YYYY') : '';
  }

  _author(item) {
      return this.api.getAuthor(item.author);
  }

  _isOutOfRange(svc) {
      const c = this.api.contact().preferredContent(svc, this.language)
      return (c && c.measureValue && (c.measureValue.value < c.measureValue.min || c.measureValue.value > c.measureValue.max))
  }

  _normalValues(svc) {
      const c = this.api.contact().preferredContent(svc, this.language)
      return c && c.measureValue && `${c.measureValue.ref ? c.measureValue.ref.toFixed(2) : ''} ${c.measureValue.min || c.measureValue.max ? `${c.measureValue.min ? c.measureValue.min.toFixed(1) : '*'} - ${c.measureValue.max ? c.measureValue.max.toFixed(1) : '*'}` : ''}` || '';
  }

  _shortDescription(svc) {
      return this.api.contact().shortServiceDescription(svc, this.language);
  }

  _notifyResize() {
      const grid = this.$['dynamic-list']
      if (grid) {
          grid.notifyResize()
      }
  }
}

customElements.define(HtServicesList.is, HtServicesList);
