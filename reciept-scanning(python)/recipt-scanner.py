import requests
import json


new_data=[]


receiptOcrEndpoint = 'https://ocr.asprise.com/api/v1/receipt' # Receipt OCR API endpoint
imageFile = "receipt.png" # // Modify it to use your own file
r = requests.post(receiptOcrEndpoint, data = { \
  'api_key': 'TEST',        # Use 'TEST' for testing purpose \
  'recognizer': 'auto',       # can be 'US', 'CA', 'JP', 'SG' or 'auto' \
  'ref_no': 'ocr_python_123', # optional caller provided ref code \
  }, \
  files = {"file": open(imageFile, "rb")})

json_data=json.loads(r.text)
print(r.text)

save_file=open("reciepts.json","w")
json.dump(json_data['receipts'][0],save_file,indent=6)
save_file.close()

print("all good till here")


with open('reciepts.json','r') as file:
  data=json.load(file)

print(data)
amount= data['items']['amount']
description=data['items']['description']

new_data.append(dict(amount=amount,
                        description=description ))



#print(r.text) # result in JSON
