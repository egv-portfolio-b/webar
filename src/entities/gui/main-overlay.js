import { GUIControl } from './gui-control.js';
import { AppEvent } from '../../core/events.js';

export class MainOverlay extends GUIControl
{
    constructor(game)
    {
        super(game);

        this._modelNameCtrl = [];
    }

    get modelName() {
        return this._modelNameCtrl;
    }

    get sizeSlider() {
        return this._sizeSlider;
    }
    
    showNoticeBoard(pVal) {
        if (pVal) {
            this._rootContainer.addControl(this._noticeBoard);
        }
        else {
            this._rootContainer.removeControl(this._noticeBoard);
        }
    }

    _createControl()
    {
        const container = new BABYLON.GUI.Container();
        this._rootContainer = container;

        const modelContainer = new BABYLON.GUI.Rectangle();
        modelContainer.background = "#00000080";
        modelContainer.height = "120px";
        modelContainer.width = "1000px";
        modelContainer.left = "0px";
        modelContainer.top = "0px";
        modelContainer.thickness = 0;
        modelContainer.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        modelContainer.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
        container.addControl(modelContainer);

        this._createModel1Controls(container);
        this._createModel2Controls(container);

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
        changeCameraBtn.width = "100px";
        changeCameraBtn.height = "100px";
        changeCameraBtn.thickness = 0;
        changeCameraBtn.top = '-32px';
        changeCameraBtn.left = '0px';
        console.log(changeCameraBtn);
        container.addControl(changeCameraBtn);
        changeCameraBtn.onPointerClickObservable.add(() => this._onClickCameraChange());

        this._createNoticeBoard();


        return container;
    }

    _createNoticeBoard() {

        const noticeBoard = new BABYLON.GUI.Container();
        noticeBoard.background = "#000000d0";
        noticeBoard.height = "500px";
        noticeBoard.width = "500px";
        noticeBoard.left = "0px";
        noticeBoard.top = "-50px";
        noticeBoard.thickness = 0;
        noticeBoard.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        noticeBoard.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
        this._noticeBoard = noticeBoard;

        const noticeLabel = new BABYLON.GUI.TextBlock();
        noticeLabel.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        noticeLabel.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
        noticeLabel.text = 'Please upload a model first by\nclicking the folder icons at\nthe top.';
        noticeLabel.color = 'white';
        noticeLabel.fontFamily = 'Sans-serif';
        noticeLabel.fontSize = 32;
        noticeLabel.top = '0px';
        noticeLabel.left = '0px';
        noticeBoard.addControl(noticeLabel);
    }

    _createModel1Controls(pContainer) {

        let container = pContainer;

        const modelLabel = new BABYLON.GUI.TextBlock();
        modelLabel.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        modelLabel.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
        modelLabel.text = 'Model 1:';
        modelLabel.color = 'white';
        modelLabel.fontFamily = 'Sans-serif';
        modelLabel.fontSize = 24;
        modelLabel.top = '15px';
        modelLabel.left = '10px';
        container.addControl(modelLabel);

        const modelTxt = new BABYLON.GUI.TextBlock();
        modelTxt.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        modelTxt.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
        modelTxt.text = 'none';
        modelTxt.color = 'white';
        modelTxt.fontFamily = 'Sans-serif';
        modelTxt.fontSize = 24;
        modelTxt.top = '15px';
        modelTxt.left = '120px';
        container.addControl(modelTxt);
        this._modelNameCtrl.push(modelTxt);

        const changeModelBtn = BABYLON.GUI.Button.CreateImageOnlyButton("changeModelBtn", "assets/upload.png");
        changeModelBtn.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
        changeModelBtn.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
        changeModelBtn.width = "45px";
        changeModelBtn.height = "45px";
        changeModelBtn.thickness = 0;
        changeModelBtn.top = '0px';
        changeModelBtn.left = '-30px';
        container.addControl(changeModelBtn);
        changeModelBtn.onPointerClickObservable.add(() => this._onClickModelChange(0, modelTxt));
    }

    _createModel2Controls(pContainer) {

        let container = pContainer;

        const modelLabel = new BABYLON.GUI.TextBlock();
        modelLabel.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        modelLabel.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
        modelLabel.text = 'Model 2:';
        modelLabel.color = 'white';
        modelLabel.fontFamily = 'Sans-serif';
        modelLabel.fontSize = 24;
        modelLabel.top = '67px';
        modelLabel.left = '10px';
        container.addControl(modelLabel);

        const modelTxt = new BABYLON.GUI.TextBlock();
        modelTxt.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        modelTxt.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
        modelTxt.text = 'none';
        modelTxt.color = 'white';
        modelTxt.fontFamily = 'Sans-serif';
        modelTxt.fontSize = 24;
        modelTxt.top = '67px';
        modelTxt.left = '120px';
        container.addControl(modelTxt);
        this._modelNameCtrl.push(modelTxt);

        const changeModelBtn = BABYLON.GUI.Button.CreateImageOnlyButton("changeModelBtn", "assets/upload.png");
        changeModelBtn.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
        changeModelBtn.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
        changeModelBtn.width = "45px";
        changeModelBtn.height = "45px";
        changeModelBtn.thickness = 0;
        changeModelBtn.top = '60px';
        changeModelBtn.left = '-30px';
        container.addControl(changeModelBtn);
        changeModelBtn.onPointerClickObservable.add(() => this._onClickModelChange(1, modelTxt));
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

    _onClickModelChange(pIndex, pTextbox)
    {
        this._broadcast(new AppEvent('modelchanged-' + (pIndex + 1), {
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
