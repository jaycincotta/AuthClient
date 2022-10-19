const API = endpoint => "https://mydev.caseparts.com/secure/" + endpoint

const AppSettings = {
  AppName:"CPC",
  Urls: {
    Login:          API("authenticate/login"),
    Logout:         API("authenticate/logout"),
    Guest:          API("test/guest"),
    Customer:       API("test/customer"),
    LinkedCustomer: API("test/linkedcustomer"),
    Employee:       API("test/employee"),
  }
};

export default AppSettings;
