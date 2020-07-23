(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Class": {
        "usage": "dynamic",
        "require": true
      },
      "qx.ui.container.Composite": {
        "construct": true,
        "require": true
      },
      "qx.ui.layout.Grid": {
        "construct": true
      },
      "qx.ui.basic.Label": {},
      "qx.ui.basic.Image": {}
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);

  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2006 STZ-IDA, Germany, http://www.stz-ida.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Fabian Jakobs (fjakobs)
  
  ************************************************************************ */

  /**
   * The default header cell widget
   *
   * @childControl label {qx.ui.basic.Label} label of the header cell
   * @childControl sort-icon {qx.ui.basic.Image} sort icon of the header cell
   * @childControl icon {qx.ui.basic.Image} icon of the header cell
   */
  qx.Class.define("qx.ui.table.headerrenderer.HeaderCell", {
    extend: qx.ui.container.Composite,
    construct: function construct() {
      qx.ui.container.Composite.constructor.call(this);
      var layout = new qx.ui.layout.Grid();
      layout.setRowFlex(0, 1);
      layout.setColumnFlex(1, 1);
      layout.setColumnFlex(2, 1);
      this.setLayout(layout);
    },
    properties: {
      appearance: {
        refine: true,
        init: "table-header-cell"
      },

      /** header cell label */
      label: {
        check: "String",
        init: null,
        nullable: true,
        apply: "_applyLabel"
      },

      /** The icon URL of the sorting indicator */
      sortIcon: {
        check: "String",
        init: null,
        nullable: true,
        apply: "_applySortIcon",
        themeable: true
      },

      /** Icon URL */
      icon: {
        check: "String",
        init: null,
        nullable: true,
        apply: "_applyIcon"
      }
    },
    members: {
      // property apply
      _applyLabel: function _applyLabel(value, old) {
        if (value) {
          this._showChildControl("label").setValue(value);
        } else {
          this._excludeChildControl("label");
        }
      },
      // property apply
      _applySortIcon: function _applySortIcon(value, old) {
        if (value) {
          this._showChildControl("sort-icon").setSource(value);
        } else {
          this._excludeChildControl("sort-icon");
        }
      },
      // property apply
      _applyIcon: function _applyIcon(value, old) {
        if (value) {
          this._showChildControl("icon").setSource(value);
        } else {
          this._excludeChildControl("icon");
        }
      },
      // overridden
      _createChildControlImpl: function _createChildControlImpl(id, hash) {
        var control;

        switch (id) {
          case "label":
            control = new qx.ui.basic.Label(this.getLabel()).set({
              anonymous: true,
              allowShrinkX: true
            });

            this._add(control, {
              row: 0,
              column: 1
            });

            break;

          case "sort-icon":
            control = new qx.ui.basic.Image(this.getSortIcon());
            control.setAnonymous(true);

            this._add(control, {
              row: 0,
              column: 2
            });

            break;

          case "icon":
            control = new qx.ui.basic.Image(this.getIcon()).set({
              anonymous: true,
              allowShrinkX: true
            });

            this._add(control, {
              row: 0,
              column: 0
            });

            break;
        }

        return control || qx.ui.table.headerrenderer.HeaderCell.prototype._createChildControlImpl.base.call(this, id);
      }
    }
  });
  qx.ui.table.headerrenderer.HeaderCell.$$dbClassInfo = $$dbClassInfo;
})();

//# sourceMappingURL=HeaderCell.js.map?dt=1595486554331