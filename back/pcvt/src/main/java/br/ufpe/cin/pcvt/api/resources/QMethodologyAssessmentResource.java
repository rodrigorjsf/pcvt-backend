package br.ufpe.cin.pcvt.api.resources;

import br.ufpe.cin.pcvt.api.exceptions.ApiException;
import br.ufpe.cin.pcvt.controllers.ControllerFactory;
import br.ufpe.cin.pcvt.controllers.QMethodologyAssessmentController;
import br.ufpe.cin.pcvt.data.models.assessment.QMethodologyAssessment;

import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.core.GenericEntity;
import javax.ws.rs.core.Response;
import java.util.List;

@Path("qMethodologyAssessment")
public class QMethodologyAssessmentResource {

    private QMethodologyAssessmentController assessmentController =
            ControllerFactory.createQMethodologyAssessmentController();

    @POST
    public Response saveAssessment(QMethodologyAssessment assessment) throws ApiException {
        try {
            QMethodologyAssessment insertedAssessment = assessmentController.create(assessment);

            return Response.ok(insertedAssessment).build();

        } catch (ApiException e) {
            throw e;
        } catch (Exception e) {
            e.printStackTrace();
            throw new ApiException(Response.Status.INTERNAL_SERVER_ERROR,
                    "Internal server error. It was not possible to save the assessment");
        }
    }

    @GET
    public Response getAllAssessments() throws ApiException {
        try {
            List<QMethodologyAssessment> assessments = assessmentController.all();

            GenericEntity<List<QMethodologyAssessment>> genericList = new GenericEntity<List<QMethodologyAssessment>>(assessments) {};

            return Response.ok(genericList).build();

        } catch (ApiException e) {
            throw e;
        } catch (Exception e) {
            e.printStackTrace();
            throw new ApiException(Response.Status.INTERNAL_SERVER_ERROR,
                    "Internal server error. It was not possible to get the assessments");
        }
    }
}
