import { atom } from "jotai";

   export const likedProjectsAtom = atom([]);

   export const currentApplicantsAtom = atom([]);

   export const userProfileAtom = atom({
     avatarUrl: '',
     headLine: '',
     tags: [],
     experiences: [],
     educations: [],
     personalUrl: ''
   });
