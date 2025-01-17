import { AppEvent } from './events.js';

/**
 * Event queue
 */
export class EventQueue
{
    /**
     * Constructor
     */
    constructor()
    {
        this._events = /** @type {AppEvent[]} */ ( [] );
    }

    /**
     * Enqueue an event
     * @param {AppEvent} event
     * @returns {void}
     */
    enqueue(event)
    {
        this._events.push(event);
    }

    /**
     * Removes and returns the first event from the queue
     * If the queue is empty, null is returned instead
     * @returns {AppEvent|null}
     */
    dequeue()
    {
        return this._events.shift() || null;
    }
}