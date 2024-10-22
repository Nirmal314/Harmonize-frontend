export const getErrorMessage = (error: string): string => {
  switch (error) {
    case "OAuthCallback":
      return "We encountered an issue while authenticating. Please try again or contact our support team if the problem persists.";
    case "invalid_request":
      return "Oops! It seems there was an issue with your request. Please double-check your details and try again.";
    case "access_denied":
      return "Access to your account was denied. This might be due to insufficient permissions or an expired session.";
    default:
      return "An unexpected error occurred. Our team has been notified, and we're working on resolving it. Please try again later.";
  }
};

export const getErrorTitle = (error: string): string => {
  switch (error) {
    case "OAuthCallback":
      return "Authentication Error";
    case "invalid_request":
      return "Invalid Request";
    case "access_denied":
      return "Access Denied";
    default:
      return "Oops! Something Went Wrong";
  }
};
