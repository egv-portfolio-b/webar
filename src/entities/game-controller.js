import { Entity } from './entity.js';
import { Model } from './model.js';
import { MainOverlay } from './gui/main-overlay.js';


export const ASSETLIST = [
    'goal.glb',
];

export class GameController extends Entity
{
    constructor(pGame)
    {
        super(pGame);
    }

    async init()
    {
        this.ui = await this._game.spawn(MainOverlay);

        this.changeModelSize(5);

        _loadCachedModel(0);
        _loadCachedModel(1);
    }

    update()
    {

    }

    handleEvent(pEvent)
    {
        console.log("GameController", "handlEvent", pEvent);
        
        switch(pEvent.type) {
            case 'camerachanged':
            {
                this._changeCamera();
                break;
            }
            case 'modelchanged-1':
            {
                this._changeModel(0);
                break;
            }
            case 'modelchanged-2':
            {
                this._changeModel(1);
                break;
            }
            case 'modelsizechanged':
            {
                this._changeModelSizes(pEvent.detail.value * 10);
                break;
            }
            case 'targetfound':
            {
                if (pEvent.detail.name == "referenceImage-1") this._showModel(0);
                if (pEvent.detail.name == "referenceImage-2") this._showModel(1);
                break;
            }
            case 'targetlost':
            {
                break;
            }
        }
    }

    async _changeCamera()
    {
        let devices = await navigator.mediaDevices.enumerateDevices();
        if (devices.length < 2) return;

        let isFrontCamera = sessionStorage.getItem("isFrontCamera") == "1";
        let nextCameraType = isFrontCamera ? "back" : "front";

        for(let i = 0; i < devices.length; i++) {

            let device = devices[i];

            if (device.kind == "videoinput" && device.label.indexOf(nextCameraType) > -1)
            {
                sessionStorage.setItem("isFrontCamera", (nextCameraType == "front") ? "1" : "0");
                sessionStorage.setItem("deviceId", device.deviceId);
                location.reload();
                break;
            }
        }
    }

    async _changeModel(pIndex)
    {
        let fileInput = document.createElement("input");
        fileInput.style.display = "none";
        fileInput.setAttribute("type", "file");
        fileInput.onchange = (e) => {

            if (e.target.files.length < 1) return;

            let file = e.target.files[0];

            const reader = new FileReader();
            reader.onload = async () => {

                const base64String = reader.result;
                const filename = file.name;

                localStorage.setItem("lastFilenameLoaded_" + (pIndex + 1), filename);
                localStorage.setItem("lastModelLoaded_" + (pIndex + 1), base64String);

                this._spawnModel(pIndex, filename, base64String);
            }
            reader.readAsDataURL(file);
        };
        document.body.appendChild(fileInput);
        fileInput.click();
    }

    async _showModel(pIndex)
    {
        if (this.model[pIndex] == null) return;

        for(let i = 0; i < this.model.length; i++)
        {
            this.model[i].setVisibility(i == pIndex);
        }
    }

    async _spawnModel(pIndex, pFilename, pBase64Data)
    {
        if (this.model[pIndex] != null) {
            this.model[pIndex].release();
        }

        this.model[pIndex] = await this._game.spawn(Model);
        this.model[pIndex].loadData(crypto.randomUUID(), pBase64Data, ".glb");
        this.changeModelSizes(this._modelSize);

        this.ui.modelName[pIndex].text = pFilename;
    }

    async _changeModelSizes(pValue)
    {
        this._modelSize = pValue;

        this.model.forEach(model => {
            model.scale.x  = model.scale.y = model.scale.z = this._modelSize;
        });
    }

    async _loadCachedModel(pIndex) {
        let lastFilenameLoaded = localStorage.getItem("lastFilenameLoaded_" + (pIndex + 1));
        if (lastFilenameLoaded != null && lastFilenameLoaded != "")
        {
            let lastModelLoaded = localStorage.getItem("lastModelLoaded_" + (pIndex + 1));

            this.ui.modelName[pIndex].text = lastFilenameLoaded;
            this._spawnModel(pIndex, lastFilenameLoaded, lastModelLoaded);
        }
    }
}
