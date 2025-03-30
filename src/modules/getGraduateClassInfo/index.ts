import { ClientError } from "../clientError";
import { graduateClasses } from "../graduateClasses";
import { administrationTeam } from "../graduateClasses/classes/administrationTeam";
import { HttpStatus } from "../http/statusCodes";
import { GoogleUserCheckResponse } from "../mdApi/methods/googleUserCheck";

export function getGraduateClassInfo(userData: GoogleUserCheckResponse) {
  if (userData?.userIdentity === "stu") {
    const className = userData.className;

    const classInfo = graduateClasses[
      Number(process.env.CURRENT_GRADUATE_YEAR) as keyof typeof graduateClasses
    ].all.find((classInfo) => classInfo.name === className);
    if (classInfo) {
      return classInfo;
    } else {
      throw new ClientError(
        { errorMessage: "Not graduate class" },
        HttpStatus.FORBIDDEN,
      );
    }
  } else if (userData?.userIdentity === "teach") {
    const className = userData.className;

    const classInfo = graduateClasses[
      Number(process.env.CURRENT_GRADUATE_YEAR) as keyof typeof graduateClasses
    ].all.find((classInfo) => classInfo.name === className);
    if (classInfo) {
      return classInfo;
    } else {
      return administrationTeam;
    }
  } else {
    throw new ClientError(
      { errorMessage: "Only student or teacher can access" },
      HttpStatus.FORBIDDEN,
    );
  }
}
