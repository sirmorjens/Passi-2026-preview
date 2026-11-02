import { Api } from '../Api/Api'
import { AppState } from '../State/AppState.svelte';
import { LoadLocalState, StoreLocalState } from '../State/LocalStateUtil';

const localDuduStateName = "dnxp_ds"
export const duduState = $state({
	duduName: "Duuni-Dudu",
	color: {
		selected: 0,
		colors: [
			{fs: "#ff66ff", ls: "#594ffe",},
			{fs: "#000000",ls: "#ffffff",},
			{fs: "#ffff00",ls: "#ff00ff",},
			{fs: "#afee00",ls: "#00aeff",}],
	},
	eyecolor: {
		selected: 0,
		colors: ["#3c00be",
			"#000000"],
	},
	antennacolor: {
		selected: 0,
		colors: [
			{fs: "#ff66ff", ls: "#594ffe", stem: "#3c00be"},
			{fs: "#000000",ls: "#ffffff", stem: "#000000"}],
	},

	store: async function () {
		await Api.StoreDuduState(duduState);
		StoreLocalState(localDuduStateName, duduState)
	},

	load: async function () {
		LoadLocalState(localDuduStateName, duduState)
	},
	build: AppState.build,

	/* antenna and so on */
});
