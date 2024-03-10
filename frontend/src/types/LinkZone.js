import { getLinkZoneUrl } from "../config";
import axios from "axios"
export default class LinkZone {
  proxyURL;
  NETWORKS_TYPES = ['NO_SERVICE', '2G', '2G', '3G', '3G', '3G', '3G+', '3G+', '4G', '4G+']

  UssdCodes = [
    {
      "value": "*222#",
      "label": "Consultar Saldo"
    },
    {
      "value": "*222*266#",
      "label": "Consultar Bono"
    },
    {
      "value": "*222*328#",
      "label": "Consultar Datos"
    },
    {
      "value": "*133*5*1#",
      "label": "Plan Combinado 600 MB + 800 MB - $110"
    },
    {
      "value": "*133*5*2#",
      "label": "Plan Combinado 1.5 GB + 2 GB - $250"
    },
    {
      "value": "*133*5*3#",
      "label": "Plan Combinado 3.5 GB + 4.5 GB - $500"
    },
    {
      "value": "*133*1*4*1#",
      "label": "Plan LTE 1 GB - $100"
    },
    {
      "value": "*133*1*4*2#",
      "label": "Plan LTE 2.5 GB - $200"
    },
    {
      "value": "*133*1*4*3#",
      "label": "Plan LTE 4 GB + 12 GB - $950"
    },
    {
      "value": "*234*1#",
      "label": "Enviar saldo"
    }
  ]
  
  constructor(proxyURL) {
    this.proxyURL = proxyURL;
   }

  setLinkZoneUrl(url){
    this.proxyURL = getLinkZoneUrl(url);
  }

  getLinkZoneUrl(){
    console.log(this.proxyURL)
    return this.proxyURL;
  }

  sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
  }

  async linkZoneRequest(payload) {

    let data = {}
    try {
      await axios.post(this.proxyURL, payload, {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }).then(resp => {
        data = resp.data
      }).catch(err => {
        console.log(err)
      })
    } catch (err) {
      return err;
    }
    return data;
  }

  async getSystemStatus () {

    const data = {
      jsonrpc: "2.0",
      method: "GetSystemStatus",
      id: "13.4"
    }

    const res = await this.linkZoneRequest(data);
    const result = {
      "Connected": res?.data?.result?.ConnectionStatus == 2,
      "NetworkName": res?.data?.result?.NetworkName,
      "NetworkType": this.NETWORKS_TYPES[res?.result?.NetworkType],
      "SignalStrength": res?.data?.result?.SignalStrength,
      "TotalConnNum": res?.data?.result?.TotalConnNum,
      "BatCap": res?.data?.result?.bat_cap,
      "ChargeState": res?.data?.result?.chg_state,
    };
    //console.log('getSystemStatus', result);
    return result;
  }

  async getNetworkSettings () {

    const data = {
      jsonrpc: "2.0",
      method: "GetNetworkSettings",
      id: "4.6"
    }

    const res = await this.linkZoneRequest(data);
     let hasNetwork = true;
     if (res?.data?.result == null || res?.data?.code == "EHOSTUNREACH" || res?.code == "EACCES")
       hasNetwork = false;
     let result = {
       "NetworkMode": res?.data?.result?.NetworkMode,
       "NetSelectionMode": res?.data?.result?.NetselectionMode,
       "NetworkStatus": hasNetwork
     };
     if (result.NetworkMode != null)
       result.NetworkMode = (result.NetworkMode == 255) ? 0 : res.data.result.NetworkMode;
     //console.log('getNetworkSettings', result);
     return result;
  }

  async login(pass) {

    const data = {
      jsonrpc:"2.0",
      method:"Login",
      params: {
        UserName: "admin",
        Password: pass
      },
      id:"1.1"
    }

    const res = await this.linkZoneRequest(data);
    let result = {
      Token: null,
      Message: null
    };
    if (res.data?.error)
      result.Message = res.data?.error.message;

    else
      result.Token = res.data?.result.token;
    console.log('login', result);
    return result;
  }

  async setNetworkSettings(networkMode) {

    const data = {
      jsonrpc:"2.0",
      method:"SetNetworkSettings",
      params: {
        NetworkMode: +networkMode,
        NetselectionMode: 0
      },
      id:"4.7"
    }

    const res = await this.linkZoneRequest(data);
    console.log('setNetworkSettings', JSON.stringify(res?.data));
  }

  async connect(){

    const data = {
      jsonrpc:"2.0",
      method:"Connect",
      id:"3.2"
    }

    return await this.linkZoneRequest(data).then(async res => {
      // if(res.error)
      //   return newError(res.error.message, "500")
      
      const r = await this.sleep(5000);
      console.log('finish connect', res.data);
      return res.data;

    }, err => {
      console.log('error connect', err)
    });
  }

  async disconnect(){

    const data = {
      jsonrpc:"2.0",
      method:"DisConnect",
      id:"3.2"
    }

    const res = await this.linkZoneRequest(data);
    const r = await this.sleep(5000);
    console.log('finish disconnect', res);
    return res;
  }

  async getConnectionState(){

    const data = {
      jsonrpc:"2.0",
      method:"GetConnectionState",
      id:"3.1"
    }
    const res = await this.linkZoneRequest(data);
    const state = {
      ConnectionStatus: res?.result?.ConnectionStatus
    };
    console.log('getConnectionState', state);
    return state;
  }

  async setNetwork(networkMode) {
    
    return this.getConnectionState().then(async res => {
      if(res.ConnectionStatus == 2){ // si esta conectado
        const res_1 = await this.disconnect();
        this.setNetworkSettings(networkMode).then(res_2 => {
          this.connect().then(res_3 => {
            console.log('finish setNetwork');
          });
        });
      }
      const res_4 = await this.setNetworkSettings(networkMode);
      console.log('finish setNetwork');
    })
  }

  async sendUSSD(code, ussdType){
    const data = {
      jsonrpc: "2.0",
      method: "SendUSSD",
      params: {
        UssdContent: code,
        UssdType: +ussdType
      },
      id: "8.1"
    }
    const res = await this.linkZoneRequest(data);
    //console.log('sendUSSD', res);
    return res;
  }

  async setUSSDEnd(code, ussdType){
    const data = {
      jsonrpc: "2.0",
      method: "SetUSSDEnd",
      id: "8.3"
    }
    const res = await this.linkZoneRequest(data);
    console.log('setUSSDEnd', res);
    return res;
  }

  async getUSSDSendResult() {

    const data = {
      jsonrpc: "2.0",
      method: "GetUSSDSendResult",
      id: "8.2"
    }

    const res = await this.linkZoneRequest(data);
    const result = {
      "UssdType": res?.data?.result?.UssdType,
      "SendState": res?.data?.result?.SendState,
      "UssdContent": res?.data?.result?.UssdContent
    };
    //console.log('getUSSDSendResult', result);
    return result;
  }

  async sendUssdCode(code, ussdType) {
    
    const res = await this.sendUSSD(code, ussdType);
    const res_1 = await this.sleep(5000);
    const res_2 = await this.getUSSDSendResult();
    //console.log('sendUssdCode', res_2);
    return res_2;
  }
}