export class AppConst {
    public static remoteServiceBaseUrl: string;
    public static appBaseUrl: string;

    public static getAppRootUrl(): string{
        if(AppConst.appBaseUrl) return AppConst.appBaseUrl;

        if (!document.location.origin) {
          const port = document.location.port ? ':' + document.location.port : '';
          return document.location.protocol + '//' + document.location.hostname + port;
        }
      
        return document.location.origin;
    }
}