import { Entity } from '../entity.js';

/**
 * An entity that wraps BABYLON.GUI.Control
 * @abstract
 */
export class GUIControl extends Entity
{
    /**
     * Constructor
     * @param {WebApplication} app
     */
    constructor(app)
    {
        super(app);
        this._parent = app.gui;
        this._control = null;
    }

    /**
     * Create the control (template method)
     * @returns {BABYLON.GUI.Control}
     * @abstract
     */
    _createControl()
    {
        throw new Error('Abstract method');
    }

    /**
     * Get the underlying control
     * @returns {BABYLON.GUI.Control}
     */
    get control()
    {
        return this._control;
    }

    /**
     * Initialize the entity
     * @returns {void}
     */
    init()
    {
        this._control = this._createControl();
        this._control.isVisible = false;

        this._parent.addControl(this._control);
    }
}
