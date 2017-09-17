import * as jsforce from 'jsforce';
export class ConnectionHandler {
    public currentConnection:any;

   /**
   * Initialize the AuthRouter
   */
  constructor() {
    this.init();
  }

  /**
   * Take each handler, and attach to one of the Express.Router's
   * endpoints.
   */
  init() {
    if(!this.currentConnection) {
        this.createConnection();
    }
    return this.currentConnection;
  }    



public createConnection() {
    var _this = this;
    _this.currentConnection = new jsforce.Connection({
            // you can change loginUrl to connect to sandbox or prerelease env.
             //loginUrl : process.env.SF_LOGIN_SERVER,
        });
        console.log("process.env.SF_USERNAME ",process.env.SF_USERNAME);
        console.log("process.env.SF_PASSWORD ",process.env.SF_PASSWORD);
        const username = process.env.SF_USERNAME || 'yourusername';
        const password = process.env.SF_PASSWORD || 'yourpassword+securitytoken';
        console.log("username",username);
        console.log("password",password);
        _this.currentConnection.login(username, password, function(err, userInfo) {
            if (err) { 
                console.log("ERROR while jsforce login");
                return console.error(err); 
            }
            // Now you can get the access token and instance URL information.
            // Save them to establish connection next time.
            console.log("accessToken => ",_this.currentConnection.accessToken);
            console.log("instanceUrl => ",_this.currentConnection.instanceUrl);
            // logged in user property
            console.log("User ID: " + userInfo.id);
            console.log("Org ID: " + userInfo.organizationId);
            // ...
            console.log("userInfo ",userInfo)
            console.log('JSForce Connect Successed!');
        });
    }
}

const connectionHandler = new ConnectionHandler();
connectionHandler.init();

export default connectionHandler.currentConnection;