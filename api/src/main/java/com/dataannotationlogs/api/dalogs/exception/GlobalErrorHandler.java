package com.dataannotationlogs.api.dalogs.exception;

import com.dataannotationlogs.api.dalogs.dto.base.ErrorResponse;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.security.SignatureException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.NoHandlerFoundException;

@RestControllerAdvice
public class GlobalErrorHandler {

    @ExceptionHandler
    public ResponseEntity<ErrorResponse> handleBadCredentials(BadCredentialsException ex) {
        System.out.println("❌ BAD CREDENTIALS: " + ex.getMessage());

        ErrorResponse error = new ErrorResponse("Invalid or missing email/password, please try again.",
                HttpStatus.BAD_REQUEST.value());
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler
    public ResponseEntity<ErrorResponse> handleInvalidInput(InvalidInputException ex) {
        System.out.println("❌ INVALID INPUT: " + ex.getMessage());

        ErrorResponse error = new ErrorResponse(ex.getMessage(), HttpStatus.BAD_REQUEST.value());
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler
    public ResponseEntity<ErrorResponse> handleUserAlreadyExists(UserAlreadyExistsException ex) {
        System.out.println("💨 USER ALREADY EXISTS: " + ex.getMessage());

        ErrorResponse error = new ErrorResponse(ex.getMessage(), HttpStatus.BAD_REQUEST.value());
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler
    public ResponseEntity<ErrorResponse> handleExpiredJWT(ExpiredJwtException ex) {
        System.out.println("🗑️ JWT EXPIRED: " + ex.getMessage());

        ErrorResponse error = new ErrorResponse("Access Denied: Please log in and try again.",
                HttpStatus.UNAUTHORIZED.value());
        return new ResponseEntity<>(error, HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler
    public ResponseEntity<ErrorResponse> handleInvalidJWT(SignatureException ex) {
        System.out.println("🚑 JWT INVALID: " + ex.getMessage());

        ErrorResponse error = new ErrorResponse("Access Denied: Please log in and try again.",
                HttpStatus.UNAUTHORIZED.value());
        return new ResponseEntity<>(error, HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler
    public ResponseEntity<ErrorResponse> handleAccessDenied(AccessDeniedException ex) {
        System.out.println("🛑 ACCESS DENIED: " + ex.getMessage());

        ErrorResponse error = new ErrorResponse("Access Denied: Please log in to gain access.",
                HttpStatus.UNAUTHORIZED.value());
        return new ResponseEntity<>(error, HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler
    public ResponseEntity<ErrorResponse> handleDataIntegrityViolation(DataIntegrityViolationException ex) {
        System.out.println("❌ DATA INTEGRITY VIOLATION: " + ex.getMessage());

        if (ex.getMessage().contains("Duplicate entry")) {
            ErrorResponse error = new ErrorResponse(
                    "Duplicate entry received.  Double check unique values and try again.",
                    HttpStatus.BAD_REQUEST.value());
            return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
        }

        ErrorResponse error = new ErrorResponse("Invalid arguments passed.  Please double check and try again.",
                HttpStatus.BAD_REQUEST.value());
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler
    public ResponseEntity<ErrorResponse> handleNotFoundError(NoHandlerFoundException ex) {
        System.out.println("⛔️ ROUTE NOT FOUND: " + ex.getMessage());

        ErrorResponse error = new ErrorResponse(
                String.format("The route you requested was not found: %s %s",
                        ex.getHttpMethod(),
                        ex.getRequestURL()),
                HttpStatus.NOT_FOUND.value());

        return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler
    public ResponseEntity<ErrorResponse> handleError(Exception ex) {
        System.out.println("🔥🔥🔥 UNEXPECTED ERROR 🔥🔥🔥: " + ex.getMessage());

        ErrorResponse error = new ErrorResponse(
                "Uh oh, something went wrong.... 🤔  Check back later!",
                HttpStatus.INTERNAL_SERVER_ERROR.value());

        return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }

}
