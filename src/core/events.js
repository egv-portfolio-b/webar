export class AppEvent extends CustomEvent
{
    /**
     * Constructor
     * @param {string} type
     * @param {any} [detail]
     */
    constructor(type, detail)
    {
        super(type, { detail });
    }
}
