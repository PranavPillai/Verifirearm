import { CONTEXT_NAME } from "@/constants";
import { Credentials } from "@verida/verifiable-credentials";
import store from "store";

const { VUE_APP_DMV_SCHEMA, VUE_APP_HEALTH_SCHEMA, VUE_APP_CRIME_SCHEMA } = process.env;

class VeridaClient {
  private context: any;
  public did = "";
  public connected?: boolean;
  public errors?: any;
  public credentials?: Credentials;
  private messagingInstance: any;

  private onMessage(message : any) {
    console.log
    console.log(message);
  }

  public async connectVault(context: any): Promise<void> {
    this.context = context;
    this.connected = true;
    store.set(CONTEXT_NAME, true);
    this.credentials = new Credentials();
    this.did = await context.getAccount().did();
    this.messagingInstance = await context.getMessaging();
    this.messagingInstance.onMessage((message : any) => this.onMessage(message));
  }

  async createDIDJwt(data: any, subjectDid: string): Promise<any> {
    if (this.credentials) {
      const credentialData = await this.credentials.createCredentialJWT(
        subjectDid,
        data,
        this.context
      );

      return credentialData;
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
    const subject = "New Credential";
    await this.messagingInstance.send(did, type, data, subject, config);
    return true;
  }

  public async requestVC(did: string, requestSchema: string) : Promise<any> {
    const message = "Please share your verifiable credential";
    const messageType = "inbox/type/dataRequest";

    const data = {
      requestSchema,
      filter: {},
      userSelect: true
    }

    const config = {
      recipientContextName: 'Verida: Vault'
    }

    await this.messagingInstance.send(did, messageType, data, message, config);
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
