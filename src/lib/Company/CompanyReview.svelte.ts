import { LoadLocalState, StoreLocalState } from "../State/LocalStateUtil";
const localAppStateName = "dnxp_cr"

export type CompanyReviewEntry = {
	companyId?: number;
	q1?: string;
	q2?: string;
	q3?: string;
	stars?: number;
};

export const CompanyReview: {
	reviews: {[companyId: number]: CompanyReviewEntry};
	load: () => void;
	store: () => void;
} = $state({
	reviews: {},

	load: function () {

		LoadLocalState(localAppStateName, CompanyReview);
	},

	store: function () {
		StoreLocalState(localAppStateName, CompanyReview)
	},
});
