import { AppDefinition, InitializeWebApp } from './core/webapplication.js';
import { ASSETLIST, GameController } from './entities/game-controller.js';


window.onload = async function()
{
    AppDefinition.AssetList = ASSETLIST;
    AppDefinition.EntryPoint = GameController;

    InitializeWebApp();
}
