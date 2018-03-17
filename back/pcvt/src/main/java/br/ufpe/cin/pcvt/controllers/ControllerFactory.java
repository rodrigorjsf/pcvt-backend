package br.ufpe.cin.pcvt.controllers;

public class ControllerFactory {

	public static PlanController createPlanController() {
		return new PlanController();
	}

	public static ReviewController createReviewController() {
		return new ReviewController();
	}
	
	public static UserController createUserController() {
		return new UserController();
	}

	public static UserGroupController createUserGroupController() {
		return new UserGroupController();
	}
	
	public static UserTokenController createUserTokenController() {
		return new UserTokenController();
	}
	
	public static EmailController createEmailController() {
		return new EmailController();
	}

}