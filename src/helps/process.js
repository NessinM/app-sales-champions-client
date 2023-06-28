import { enviroments } from "@/helps/constants";
import * as jose from "jose";

export const createTokenOctopus = async (empresa, usuario) => {
  var objOctopus = {
    empresa: empresa,
    usuario: usuario || "user-generic-flycom",
    app: "ddd",
  };

  const secret = new TextEncoder().encode(enviroments.API_SECRET_OCTOPUS);
  const alg = "HS256";
  const token = await new jose.SignJWT(objOctopus)
    .setProtectedHeader({ alg })
    .sign(secret);

  return token;
};
