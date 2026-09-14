export type TrackerProviderId="google-health"|"oura"|"whoop"|"strava"|"garmin"|"apple-health"|"health-connect";
export type TrackerProviderCatalogItem={
 id:TrackerProviderId;
 name:string;
 kind:"Workout + Sleep"|"Sleep + Recovery"|"Workout"|"Mobile Health";
 sleep:boolean;
 workouts:boolean;
 cloudOAuth:boolean;
 note:string;
};

export const trackerCatalog:TrackerProviderCatalogItem[]=[
 {id:"google-health",name:"Google Health",kind:"Workout + Sleep",sleep:true,workouts:true,cloudOAuth:true,note:"Fitbit and Pixel Watch workout, sleep, resting-HR and HRV data through Google Health."},
 {id:"oura",name:"Oura",kind:"Sleep + Recovery",sleep:true,workouts:true,cloudOAuth:true,note:"Sleep, readiness, heart rate and workout summaries."},
 {id:"whoop",name:"WHOOP",kind:"Workout + Sleep",sleep:true,workouts:true,cloudOAuth:true,note:"Sleep, recovery, strain/cycles and workouts."},
 {id:"strava",name:"Strava",kind:"Workout",sleep:false,workouts:true,cloudOAuth:true,note:"Workout/activity import. Strava does not provide sleep data."},
 {id:"garmin",name:"Garmin",kind:"Workout + Sleep",sleep:true,workouts:true,cloudOAuth:false,note:"Architecture ready; production access requires Garmin developer-program approval."},
 {id:"apple-health",name:"Apple Health",kind:"Mobile Health",sleep:true,workouts:true,cloudOAuth:false,note:"Requires a future native iPhone app bridge; unavailable to a browser-only app."},
 {id:"health-connect",name:"Health Connect",kind:"Mobile Health",sleep:true,workouts:true,cloudOAuth:false,note:"Requires a future native Android app bridge; unavailable to a browser-only app."}
];
