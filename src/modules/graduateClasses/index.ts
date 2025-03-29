import { graduateClasses2025 } from "./classes/2025";

export const graduateClasses: {
  2025: {
    all: ClassInfo[];
    juniorHighClasses: ClassInfo[];
    seniorHighClasses: ClassInfo[];
    technicalHighClasses: ClassInfo[];
    internationalClasses: ClassInfo[];
  };
} = {
  2025: graduateClasses2025,
};

export type ClassInfo = {
  code: string;
  name: string;
  value: string;
  globalCode: string;
  displayText: string;
};
