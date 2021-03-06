package br.ufpe.cin.pcvt.business.experiments.plan.state.impl;

import br.ufpe.cin.pcvt.business.experiments.plan.state.PlanStateTransitionStrategy;
import br.ufpe.cin.pcvt.data.models.experiments.EPlanState;
import br.ufpe.cin.pcvt.data.models.experiments.Plan;

public class ReadyToReviewStateStrategy extends PlanStateTransitionStrategy {

	public ReadyToReviewStateStrategy(Plan plan) {
		super(plan, EPlanState.ReadyToReview);
	}

	@Override
	protected boolean validateCurrentState() {
		return this.getPlan().getState() == EPlanState.Planning;
	}

	@Override
	protected void modifyState() {
		getPlan().setState(EPlanState.ReadyToReview);
	}

	@Override
	protected void afterTransitionAction() {
		// Do nothing
	}

}
