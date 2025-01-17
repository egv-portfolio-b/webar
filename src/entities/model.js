import { Entity } from "./entity.js";

export class Model extends Entity
{
    constructor(pGame)
    {
        super(pGame);
    }

    get name()
    {
        return this._name;
    }

    get position()
    {
        return this._model.position;
    }

    get euler()
    {
        return this._model.euler;
    }

    get scale()
    {
        return this._model.scaling;
    }

    async loadData(pName, pUrlData, pPluginLoader)
    {
        this._name = pName;

        BABYLON.SceneLoader.ImportMeshAsync("", pUrlData, "", this.ar.scene, null, pPluginLoader, "")
        .then(model => this._rawModel)
        .then(() => this._LoadMeshesFromRaw())
        .catch(error => alert(error));
    }

    async setVisibility(pVal)
    {
        this._rawModel.meshes.forEach(mesh => {
            
            if(mesh.name.startsWith('Collider_') || mesh.name.startsWith('Trigger_') || mesh.name.startsWith('Hook_')) {
                return;
            }

            mesh.isVisible = pVal;
        });
    }

    init()
    {
        this._model = new BABYLON.TransformNode(crypto.randomUUID(), this.ar.scene);
        this._model.parent = this.ar.root;

    }

    update()
    {

    }

    handleEvent(event)
    {
    }

    release()
    {
        this._model.parent.removeChild(this._model);
        this._rawModel.meshes.forEach(mesh => mesh.dispose());
    }

    _LoadMeshesFromRaw()
    {
        this._rawModel.meshes.forEach(mesh => {
            mesh.isVisible = false;
            if(mesh.parent == null) {
                this._model.addChild(mesh);
            }
        });
    }
}