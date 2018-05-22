package br.ufpe.cin.pcvt.api.security;

import br.ufpe.cin.pcvt.api.models.ApiMessage;
import br.ufpe.cin.pcvt.api.utils.JwtUtils;
import io.jsonwebtoken.Claims;

import javax.annotation.Priority;
import javax.ws.rs.Priorities;
import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.container.ContainerRequestFilter;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.SecurityContext;
import javax.ws.rs.ext.Provider;
import java.io.IOException;
import java.security.Principal;

@SecureEndpoint
@Provider
@Priority(Priorities.AUTHENTICATION)
public class AuthorizationFilter implements ContainerRequestFilter {

    @Override
    public void filter(ContainerRequestContext containerRequestContext) throws IOException {
        String authHeader = containerRequestContext.getHeaderString("X-AUTH-TOKEN");

        try {
            if(authHeader == null || authHeader.trim().isEmpty())
                throw new Exception("User not authenticated.");

            Claims claims = JwtUtils.validateToken(authHeader);

            if(claims == null)
                throw new Exception("Invalid or expired token.");

            modifyRequestContext(containerRequestContext, claims.getId());
        } catch(Exception e) {
            e.printStackTrace();


            ApiMessage message = new ApiMessage(Response.Status.UNAUTHORIZED,
                    "Invalid or expired token.");

            containerRequestContext.abortWith(
                    Response.status(Response.Status.UNAUTHORIZED)
                            .entity(message)
                            .type(MediaType.APPLICATION_JSON)
                            .build()
            );
        }
    }


    private void modifyRequestContext(ContainerRequestContext requestContext, String login) {
        final SecurityContext currentSecurityContext = requestContext.getSecurityContext();

        requestContext.setSecurityContext(new SecurityContext() {
            @Override
            public Principal getUserPrincipal() {
                return new Principal() {
                    @Override
                    public String getName() {
                        return login;
                    }
                };
            }

            @Override
            public boolean isUserInRole(String s) {
                return true;
            }

            @Override
            public boolean isSecure() {
                return currentSecurityContext.isSecure();
            }

            @Override
            public String getAuthenticationScheme() {
                return "X-AUTH-TOKEN";
            }
        });
    }
}
