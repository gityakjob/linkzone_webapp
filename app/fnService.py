import requests
import urllib3
import os

ipModem = os.environ.get("IPMR", "192.168.1.1")

def rpostSend(payload:dict, ipModem:str=ipModem):
  """
  payload: {
    "jsonrpc":"2.0",
    "method": string,
    "params": dict,
    "id": str(float)
  }
  """
  try:
    header = {'Content-Type':'application/json'}
    rl = requests.post("http://{}/jrd/webapi".format(ipModem), json=payload, headers=header)
    rl_data = rl.status_code
    rl.encoding = 'utf-8'
    return rl.json() if int(rl_data) == 200 else []
  except:
    return []