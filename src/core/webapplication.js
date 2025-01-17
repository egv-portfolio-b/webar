import { AppEvent } from './events.js';
import { EventQueue } from './event-queue.js';
import { GameController } from '../entities/game-controller.js';
import { Lights } from '../entities/lights.js';

class CustomResizeStrategy {
    
    clear(viewport) {
        viewport.container.style.cssText = '';
        viewport._subContainer.style.cssText = '';
    }

    resize(viewport) {

        const subContainer = viewport._subContainer;
        const windowAspectRatio = window.innerWidth / window.innerHeight;
        const viewportAspectRatio = viewport.aspectRatio;
        let width = 1, height = 1, left = '0px', top = '0px';
        if (viewportAspectRatio <= windowAspectRatio) {
            height = window.innerHeight;
            width = Math.round(height * viewportAspectRatio);
            width -= width % 2;
            left = `calc(50% - ${width >>> 1}px)`;
        }
        else {
            width = window.innerWidth;
            height = Math.round(width / viewportAspectRatio);
            height -= height % 2;
            top = `10px`;
        }
        subContainer.style.position = 'absolute';
        subContainer.style.left = left;
        subContainer.style.top = top;
        subContainer.style.width = width + 'px';
        subContainer.style.height = height + 'px';

        const CONTAINER_ZINDEX = 1000000000;
        const container = viewport.container;
        container.style.position = 'fixed';
        container.style.left = '0px';
        container.style.top = '0px';
        container.style.width = '100vw';
        container.style.height = '100vh';
        container.style.zIndex = String(CONTAINER_ZINDEX);
    }
}

export const AppDefinition = {
    AssetList: null,
    EntryPoint: null
}

export function InitializeWebApp() {

    if(typeof encantar === 'undefined')
        throw new Error(`Can't find the babylon.js plugin for encantar.js`);

    encantar(new WebApplication()).catch(error => {
        alert(error.message);
    });
}

export class WebApplication extends ARDemo
{
    constructor()
    {
        super();

        this._assetManager = new AssetManager();
        this._eventQueue = new EventQueue();
        this._entities = [];
        this._gui = null;
    }

    async startSession()
    {
        if(!AR.isSupported()) {
            throw new Error(
                'This device is not compatible with this AR experience.\n\n' +
                'User agent: ' + navigator.userAgent
            );
        }

        const imageTracker = AR.Tracker.Image({
            resolution: "sm"
        });
        imageTracker.addEventListener('targetfound', event => {
            this.broadcast(new AppEvent('targetfound', event.referenceImage));
        });

        imageTracker.addEventListener('targetlost', event => {
            this.broadcast(new AppEvent('targetlost', event.referenceImage));
        });
        await imageTracker.database.add([
        {
            name: 'referenceImage-1',
            image: document.getElementById('referenceImage-1')
        },
        {
            name: 'referenceImage-2',
            image: document.getElementById('referenceImage-2')
        }
        ]);

        const viewport = AR.Viewport({
            container: document.getElementById('ar-viewport'),
            fullscreenUI: false
        });
        viewport._resizer.setStrategy(new CustomResizeStrategy());

        if (!navigator.mediaDevices?.enumerateDevices) {
            throw new Error("enumerateDevices() not supported.");
        }
    
        if (!navigator.mediaDevices?.getUserMedia) {
            throw new Error("getUserMedia() not supported.");
        }
    
        let videoSource = null;
        if (sessionStorage.getItem("deviceId") == null) {
            videoSource = AR.Source.Camera();
        }
        else {
            videoSource = AR.Source.Camera({
                constraints: {
                    deviceId: sessionStorage.getItem("deviceId")
                }
            });
        }

        const pointerSource = AR.Source.Pointer();
        const pointerTracker = AR.Tracker.Pointer({
            space: 'adjusted'
        });

        const session = await AR.startSession({
            mode: 'immersive',
            viewport: viewport,
            trackers: [ imageTracker, pointerTracker ],
            sources: [ videoSource, pointerSource ],
            stats: false,
            gizmos: false,
        });

        return session;
    }

    preload()
    {
        console.log('Preloading assets...');

        return this._assetManager.preload(
            AppDefinition.AssetList.map(asset => 'assets/' + asset),
            { timeout: 30 }
        );
    }

    init()
    {
        return Promise.resolve()
        .then(() => this._initGUI())
        .then(() => this._spawnEntities())
        .then(() => this._flushEventQueue());
    }

    update()
    {
        for(let i = 0; i < this._entities.length; i++)
            this._entities[i].update();

        this._flushEventQueue();
    }

    release()
    {
        for(let i = 0; i < this._entities.length; i++)
            this._entities[i].release();
    }

    get assetManager()
    {
        return this._assetManager;
    }

    get gui()
    {
        return this._gui;
    }

    broadcast(event)
    {
        this._eventQueue.enqueue(event);
    }

    spawn(entityClass)
    {
        const entity = Reflect.construct(entityClass, [ this ]);
        this._entities.push(entity);

        return Promise.resolve()
        .then(() => entity.init())
        .then(() => entity);
    }

    _spawnEntities()
    {
        return Promise.all([
            this.spawn(GameController),
            this.spawn(Lights),
        ]).then(() => void 0);
    }

    _flushEventQueue()
    {
        let event;

        // new events may be broadcasted during this loop
        while((event = this._eventQueue.dequeue())) {
            for(let i = 0; i < this._entities.length; i++)
                this._entities[i].handleEvent(event);
        }
    }

    _initGUI()
    {
        this._gui = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI('UI');

        this._scaleGUI = this._scaleGUI.bind(this);
        this._scaleGUI();

        const viewport = this.ar.session.viewport;
        viewport.addEventListener('resize', this._scaleGUI);
    }

    _scaleGUI()
    {
        const idealHeightInLandscapeMode = 600;
        const viewport = this.ar.session.viewport;
        const aspectRatio = viewport.aspectRatio;
        let width, height;

        if(aspectRatio >= 1) {
            width = Math.round(idealHeightInLandscapeMode * aspectRatio);
            height = idealHeightInLandscapeMode;
        }
        else {
            width = idealHeightInLandscapeMode;
            height = Math.round(idealHeightInLandscapeMode / aspectRatio);
        }

        width -= width % 2;
        height -= height % 2;

        this._gui.scaleTo(width, height);

        const event = new AppEvent('guiresized');
        this.broadcast(event);
    }
}
