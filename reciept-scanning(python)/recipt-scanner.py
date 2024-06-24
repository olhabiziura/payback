import requests
import json


amount_description=[]
currency_total=[]


receiptOcrEndpoint = 'https://ocr.asprise.com/api/v1/receipt' # Receipt OCR API endpoint
imageFile = "test_recipets.jpg" 
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


with open('reciepts.json','r') as file:
  data=json.load(file)


for dikt in data['items']:

  amount= dikt['amount']
  description=dikt['description']

  amount_description.append(dict(amount=amount, description=description ))

currency_total.append(data['currency'])
currency_total.append(data['total'])

print(amount_description) 
print(currency_total)
