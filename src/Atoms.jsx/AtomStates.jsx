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

   export const savedProjectsAtom = atom([]);
   export const selectedSavedProjectAtom = atom([]);

   export const IS_LOGGED_IN = atom(false);
   export const USER = atom({
    id:'',
    email:'',
    nickname:''
   });

// feedType atom - 단순 초기값 설정
export const feedTypeAtom = atom('PROJECT');
export const toggleActiveAtom = atom(false);

export const selectedProjectDetailAtom = atom([]);

