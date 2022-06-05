import { CONTEXT_NAME } from "@/constants";
import { Credentials } from "@verida/verifiable-credentials";
import store from "store";

class VeridaClient {
  private context: any;
  public did = "";
  public connected?: boolean;
  public errors?: any;
  public credentials?: Credentials;
  private messagingInstance: any;

  public async connectVault(context: any): Promise<void> {
    this.context = context;
    this.connected = true;
    store.set(CONTEXT_NAME, true);
    this.credentials = new Credentials();
    this.did = await context.getAccount().did();
    this.messagingInstance = await context.getMessaging();
  }

  async createDIDJwt(data: any, subjectId: string): Promise<any> {
    if (this.credentials) {
      console.log("have credentials")
      this.credentials.createCredentialJWT({
        subjectId,
        data,
        context: this.context,
      }).then((credentialData) => {
        return credentialData
      }).catch((err) => {
        console.log(err);
        console.log(this.credentials?.getErrors());
      })
      // const credentialData = await this.credentials.createCredentialJWT({
      //   subjectId,
      //   data,
      //   context: this.context,
      // });
      // console.log(credentialData);
      // console.log(this.credentials.getErrors());
      // return credentialData;
    } else {
      console.log("don't have credentials")
    }
  } 

  public async sendMessage(messageData: any, did: string): Promise<boolean> {
    const type = "inbox/type/dataSend";

    const data = {
      data: [messageData],
    };
    const config = {
      recipientContextName: "Verida: Vault",
    };
    const subject = "New " + messageData.healthType + " Credential";
    await this.messagingInstance.send(did, type, data, subject, config);
    return true;
  }

  logout() {
    this.context = null;
    this.connected = false;
    store.remove(CONTEXT_NAME);
  }
}

const veridaClient = new VeridaClient();

export default veridaClient;
