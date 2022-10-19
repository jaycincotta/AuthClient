const API = endpoint => "https://mydev.caseparts.com/secure/" + endpoint
const OLD = endpoint => "https://mydev.caseparts.com/security/" + endpoint

const AppSettings = {
  AppName:"CPC",
  Urls: {
    Login:          OLD("authenticate/login"),
    Logout:         OLD("authenticate/logout"),
    Guest:          API("test/guest"),
    Customer:       API("test/customer"),
    LinkedCustomer: API("test/linkedcustomer"),
    Employee:       API("test/employee"),
  }
};

export default AppSettings;
