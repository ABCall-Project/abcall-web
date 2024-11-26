import BaseBuilder from "./BaseBuilder";
import Role from "src/app/models/Role";
import { SignUpRequest } from "src/app/models/auth/signUpRequest";

class SignUpRequestBuilder extends BaseBuilder<SignUpRequest> {
  constructor() {
    super();
    this.element = {
      email: "pcapriles@dinogeek.com",
      name: "Pedro",
      lastname: "Capriles",
      phoneNumber: "123456789",
      address: "Calle 123",
      birthdate: new Date(),
      roleId:  Role.COMPANY_ADMIN,
      document: "123456789",
      planId: Role.COMPANY_ADMIN,
      password: "TG5lt5izlalRH2Oeuduc9g==:ZheeJBm+21bapAigE0h1dw==",
    };
  }
}

export default SignUpRequestBuilder;

