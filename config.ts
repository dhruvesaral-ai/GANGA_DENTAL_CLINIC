let IFRAME_URL: string;


switch (process.env.Environment) {
  case "development":
    IFRAME_URL = "http://localhost:3000";
    break;
  case "production":
    IFRAME_URL = "https://ganga-dental-clinic.vercel.app";
    break;
  default:
    throw new Error("Invalid environment");
}