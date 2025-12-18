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
   export const selectedSavedProjectAtom = atom({});

   export const IS_LOGGED_IN = atom(false);
   export const USER = atom({
    id:'',
    email:'',
    nickname:''
   });

   export const USER_PROFILE = atom({
    tags: [],
      experiences: [],
      avatarUrl: null,
      headLine: "",
      educations: [],
      personalUrl: ""
    
   });

export const feedTypeAtom = atom('PROJECT');
export const toggleActiveAtom = atom(false);

export const selectedProjectDetailAtom = atom([]);

export const SELECTED_PERSON_ID = atom(null);
export const MESSAGE_LIST = atom([]);

