// Function returning promise.
// When called, app is initialized and start to work.
// When app is finished, promise is resolved.
// When app is existed with error, promise is rejected with reason.
export type appDo = () => Promise<void>
