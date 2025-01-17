import { GUIControl } from './gui-control.js';
import { AppEvent } from '../../core/events.js';

export class MainOverlay extends GUIControl
{
    constructor(game)
    {
        super(game);
    }

    get modelName() {
        return this._modelNameCtrl;
    }

    get sizeSlider() {
        return this._sizeSlider;
    }

    _createControl()
    {
        const container = new BABYLON.GUI.Container();

        const modelContainer = new BABYLON.GUI.Rectangle();
        modelContainer.background = "#00000080";
        modelContainer.height = "80px";
        modelContainer.width = "1000px";
        modelContainer.left = "0px";
        modelContainer.top = "0px";
        modelContainer.thickness = 0;
        modelContainer.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        modelContainer.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
        container.addControl(modelContainer);

        const modelLabel = new BABYLON.GUI.TextBlock();
        modelLabel.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        modelLabel.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
        modelLabel.text = 'Model:';
        modelLabel.color = 'white';
        modelLabel.fontFamily = 'arial';
        modelLabel.fontSize = 32;
        modelLabel.top = '20px';
        modelLabel.left = '10px';
        container.addControl(modelLabel);

        const modelTxt = new BABYLON.GUI.TextBlock();
        modelTxt.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        modelTxt.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
        modelTxt.text = 'model 1';
        modelTxt.color = 'white';
        modelTxt.fontFamily = 'arial';
        modelTxt.fontSize = 32;
        modelTxt.top = '20px';
        modelTxt.left = '130px';
        container.addControl(modelTxt);
        this._modelNameCtrl = modelTxt;

        const changeModelBtn = BABYLON.GUI.Button.CreateImageOnlyButton("changeModelBtn", "assets/upload.png");
        changeModelBtn.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
        changeModelBtn.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
        changeModelBtn.width = "50px";
        changeModelBtn.height = "50px";
        changeModelBtn.thickness = 0;
        changeModelBtn.top = '20px';
        changeModelBtn.left = '-30px';
        container.addControl(changeModelBtn);
        changeModelBtn.onPointerClickObservable.add(() => this._onClickModelChange(modelTxt));

        const modelSizeSlider = new BABYLON.GUI.Slider();
        modelSizeSlider.minimum = 0;
        modelSizeSlider.maximum = 100;
        modelSizeSlider.value = 50;
        modelSizeSlider.height = "15px";
        modelSizeSlider.width = "450px";
        modelSizeSlider.color = "white";
        modelSizeSlider.background = "gray";
        modelSizeSlider.left = "0px";
        modelSizeSlider.top = "-250px";
        modelSizeSlider.isThumbCircle = true;
        modelSizeSlider.thumbWidth = "50px";
        modelSizeSlider.thumbColor = "#59e6ff";
        modelSizeSlider.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        modelSizeSlider.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
        modelSizeSlider.onValueChangedObservable.add((value) => this._onModelSizeChange(value / 100.0));
        container.addControl(modelSizeSlider);
        this._sizeSlider = modelSizeSlider;

        const changeCameraBtn = BABYLON.GUI.Button.CreateImageOnlyButton("changeCameraBtn", "assets/camera.png");
        changeCameraBtn.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        changeCameraBtn.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
        changeCameraBtn.width = "120px";
        changeCameraBtn.height = "120px";
        changeCameraBtn.thickness = 0;
        changeCameraBtn.top = '-62px';
        changeCameraBtn.left = '0px';
        console.log(changeCameraBtn);
        container.addControl(changeCameraBtn);
        changeCameraBtn.onPointerClickObservable.add(() => this._onClickCameraChange());

        return container;
    }

    update()
    {
    }

    handleEvent(event)
    {
        this.control.isVisible = true;
    }

    _onClickCameraChange()
    {
        this._broadcast(new AppEvent('camerachanged'));
    }

    _onClickModelChange(pTextbox)
    {
        this._broadcast(new AppEvent('modelchanged', {
            textbox: pTextbox
        }));
    }

    _onModelSizeChange(pSliderValue)
    {
        this._broadcast(new AppEvent('modelsizechanged', {
            value: pSliderValue
        }));
    }
}
