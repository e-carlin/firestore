### Deploy  
$ firebase deploy

### Setup config vars
$ firebase functions:config:set plaid.clientid="59dd926b4e95b872dbbb6cdf" plaid.secretkey="2e17db39ac71ebd3810b276801569e" plaid.publickey="74912a00575badb2f1b0f1b8bdfde2" plaid.env="sandbox"
$ firebase functions:config:get > functions/.runtimeconfig.json #This adds the config variables to a file so local can pick them up  
### Run locally
$ firebase serve --only functions  

