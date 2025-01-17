import { WebApplication } from "../core/webapplication.js";

/**
 * Engine Entity
 */
export class Entity
{
    /**
     * Constructor
     * @param {WebApplication} game
     */
    constructor(game)
    {
        this._game = game;
    }

    /**
     * Initialize the entity
     * @returns {Promise<void>|void}
     */
    init()
    {
        return Promise.resolve();
    }

    /**
     * Update the entity
     * @returns {void}
     */
    update()
    {
    }

    /**
     * Release resources
     * @returns {void}
     */
    release()
    {
    }

    /**
     * Handle an event
     * @param {AppEvent} event
     * @returns {void}
     */
    handleEvent(event)
    {
    }

    /**
     * Broadcast an event
     * @param {AppEvent} event
     * @returns {void}
     */
    _broadcast(event)
    {
        this._game.broadcast(event);
    }

    /**
     * A reference to the ARSystem
     * @returns {ARSystem | null}
     */
    get ar()
    {
        return this._game.ar;
    }
}
