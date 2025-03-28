import { internationalClasses } from "./internationalClasses";
import { juniorHighClasses } from "./juniorHighClasses";
import { seniorHighClasses } from "./seniorHighClasses";
import { technicalHighClasses } from "./technicalHighClasses";

export const graduateClasses2025 = {
  all: [
    ...juniorHighClasses,
    ...seniorHighClasses,
    ...technicalHighClasses,
    ...internationalClasses,
  ],
  juniorHighClasses,
  seniorHighClasses,
  technicalHighClasses,
  internationalClasses,
};
