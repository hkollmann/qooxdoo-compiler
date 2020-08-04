(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Class": {
        "usage": "dynamic",
        "require": true
      },
      "qx.ui.core.Widget": {
        "construct": true,
        "require": true
      },
      "qx.ui.core.MExecutable": {
        "require": true
      },
      "qx.ui.form.IExecutable": {
        "require": true
      },
      "qx.ui.menu.ButtonLayout": {
        "construct": true
      },
      "qx.ui.basic.Image": {},
      "qx.ui.basic.Label": {},
      "qx.event.Timer": {},
      "qx.ui.menu.Manager": {},
      "qx.locale.Manager": {},
      "qx.core.ObjectRegistry": {}
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);

  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2004-2008 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Sebastian Werner (wpbasti)
       * Fabian Jakobs (fjakobs)
  
  ************************************************************************ */

  /**
   * The abstract menu button class is used for all type of menu content
   * for example normal buttons, checkboxes or radiobuttons.
   *
   * @childControl icon {qx.ui.basic.Image} icon of the button
   * @childControl label {qx.ui.basic.Label} label of the button
   * @childControl shortcut {qx.ui.basic.Label} shows if specified the shortcut
   * @childControl arrow {qx.ui.basic.Image} shows the arrow to show an additional widget (e.g. popup or submenu)
   */
  qx.Class.define("qx.ui.menu.AbstractButton", {
    extend: qx.ui.core.Widget,
    include: [qx.ui.core.MExecutable],
    implement: [qx.ui.form.IExecutable],
    type: "abstract",

    /*
    *****************************************************************************
       CONSTRUCTOR
    *****************************************************************************
    */
    construct: function construct() {
      qx.ui.core.Widget.constructor.call(this); // Use hard coded layout

      this._setLayout(new qx.ui.menu.ButtonLayout()); // Add listeners


      this.addListener("tap", this._onTap);
      this.addListener("keypress", this._onKeyPress); // Add command listener

      this.addListener("changeCommand", this._onChangeCommand, this);
    },

    /*
    *****************************************************************************
       PROPERTIES
    *****************************************************************************
    */
    properties: {
      // overridden
      blockToolTip: {
        refine: true,
        init: true
      },

      /** The label text of the button */
      label: {
        check: "String",
        apply: "_applyLabel",
        nullable: true,
        event: "changeLabel"
      },

      /** Whether a sub menu should be shown and which one */
      menu: {
        check: "qx.ui.menu.Menu",
        apply: "_applyMenu",
        nullable: true,
        dereference: true,
        event: "changeMenu"
      },

      /** The icon to use */
      icon: {
        check: "String",
        apply: "_applyIcon",
        themeable: true,
        nullable: true,
        event: "changeIcon"
      },

      /** Indicates whether the label for the command (shortcut) should be visible or not. */
      showCommandLabel: {
        check: "Boolean",
        apply: "_applyShowCommandLabel",
        themeable: true,
        init: true,
        event: "changeShowCommandLabel"
      }
    },

    /*
    *****************************************************************************
       MEMBERS
    *****************************************************************************
    */
    members: {
      /*
      ---------------------------------------------------------------------------
        WIDGET API
      ---------------------------------------------------------------------------
      */
      // overridden
      _createChildControlImpl: function _createChildControlImpl(id, hash) {
        var control;

        switch (id) {
          case "icon":
            control = new qx.ui.basic.Image();
            control.setAnonymous(true);

            this._add(control, {
              column: 0
            });

            break;

          case "label":
            control = new qx.ui.basic.Label();
            control.setAnonymous(true);

            this._add(control, {
              column: 1
            });

            break;

          case "shortcut":
            control = new qx.ui.basic.Label();
            control.setAnonymous(true);

            if (!this.getShowCommandLabel()) {
              control.exclude();
            }

            this._add(control, {
              column: 2
            });

            break;

          case "arrow":
            control = new qx.ui.basic.Image();
            control.setAnonymous(true);

            this._add(control, {
              column: 3
            });

            break;
        }

        return control || qx.ui.menu.AbstractButton.prototype._createChildControlImpl.base.call(this, id);
      },
      // overridden

      /**
       * @lint ignoreReferenceField(_forwardStates)
       */
      _forwardStates: {
        selected: 1
      },

      /*
      ---------------------------------------------------------------------------
        LAYOUT UTILS
      ---------------------------------------------------------------------------
      */

      /**
       * Returns the dimensions of all children
       *
       * @return {Array} Preferred width of each child
       */
      getChildrenSizes: function getChildrenSizes() {
        var iconWidth = 0,
            labelWidth = 0,
            shortcutWidth = 0,
            arrowWidth = 0;

        if (this._isChildControlVisible("icon")) {
          var icon = this.getChildControl("icon");
          iconWidth = icon.getMarginLeft() + icon.getSizeHint().width + icon.getMarginRight();
        }

        if (this._isChildControlVisible("label")) {
          var label = this.getChildControl("label");
          labelWidth = label.getMarginLeft() + label.getSizeHint().width + label.getMarginRight();
        }

        if (this._isChildControlVisible("shortcut")) {
          var shortcut = this.getChildControl("shortcut");
          shortcutWidth = shortcut.getMarginLeft() + shortcut.getSizeHint().width + shortcut.getMarginRight();
        }

        if (this._isChildControlVisible("arrow")) {
          var arrow = this.getChildControl("arrow");
          arrowWidth = arrow.getMarginLeft() + arrow.getSizeHint().width + arrow.getMarginRight();
        }

        return [iconWidth, labelWidth, shortcutWidth, arrowWidth];
      },

      /*
      ---------------------------------------------------------------------------
        EVENT LISTENERS
      ---------------------------------------------------------------------------
      */

      /**
       * Event listener for tap
       *
       * @param e {qx.event.type.Pointer} pointer event
       */
      _onTap: function _onTap(e) {
        if (e.isLeftPressed()) {
          this.execute();
          qx.event.Timer.once(qx.ui.menu.Manager.getInstance().hideAll, qx.ui.menu.Manager.getInstance(), 0);
        } // right click
        else {
            // only prevent contextmenu event if button has no further context menu.
            if (!this.getContextMenu()) {
              qx.ui.menu.Manager.getInstance().preventContextMenuOnce();
            }
          }
      },

      /**
       * Event listener for keypress event
       *
       * @param e {qx.event.type.KeySequence} keypress event
       */
      _onKeyPress: function _onKeyPress(e) {
        this.execute();
      },

      /**
       * Event listener for command changes. Updates the text of the shortcut.
       *
       * @param e {qx.event.type.Data} Property change event
       */
      _onChangeCommand: function _onChangeCommand(e) {
        var command = e.getData(); // do nothing if no command is set

        if (command == null) {
          return;
        }

        {
          var oldCommand = e.getOldData();

          if (!oldCommand) {
            qx.locale.Manager.getInstance().addListener("changeLocale", this._onChangeLocale, this);
          }

          if (!command) {
            qx.locale.Manager.getInstance().removeListener("changeLocale", this._onChangeLocale, this);
          }
        }
        var cmdString = command != null ? command.toString() : "";
        this.getChildControl("shortcut").setValue(cmdString);
      },

      /**
       * Update command string on locale changes
       */
      _onChangeLocale: function _onChangeLocale(e) {
        var command = this.getCommand();

        if (command != null) {
          this.getChildControl("shortcut").setValue(command.toString());
        }
      },

      /*
      ---------------------------------------------------------------------------
        PROPERTY APPLY ROUTINES
      ---------------------------------------------------------------------------
      */
      // property apply
      _applyIcon: function _applyIcon(value, old) {
        if (value) {
          this._showChildControl("icon").setSource(value);
        } else {
          this._excludeChildControl("icon");
        }
      },
      // property apply
      _applyLabel: function _applyLabel(value, old) {
        if (value) {
          this._showChildControl("label").setValue(value);
        } else {
          this._excludeChildControl("label");
        }
      },
      // property apply
      _applyMenu: function _applyMenu(value, old) {
        if (old) {
          old.resetOpener();
          old.removeState("submenu");
        }

        if (value) {
          this._showChildControl("arrow");

          value.setOpener(this);
          value.addState("submenu");
        } else {
          this._excludeChildControl("arrow");
        }
      },
      // property apply
      _applyShowCommandLabel: function _applyShowCommandLabel(value, old) {
        if (value) {
          this._showChildControl("shortcut");
        } else {
          this._excludeChildControl("shortcut");
        }
      }
    },

    /*
     *****************************************************************************
        DESTRUCTOR
     *****************************************************************************
     */
    destruct: function destruct() {
      this.removeListener("changeCommand", this._onChangeCommand, this);

      if (this.getMenu()) {
        if (!qx.core.ObjectRegistry.inShutDown) {
          this.getMenu().destroy();
        }
      }

      {
        qx.locale.Manager.getInstance().removeListener("changeLocale", this._onChangeLocale, this);
      }
    }
  });
  qx.ui.menu.AbstractButton.$$dbClassInfo = $$dbClassInfo;
})();

//# sourceMappingURL=AbstractButton.js.map?dt=1596526411727