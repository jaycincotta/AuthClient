const API = endpoint => "https://mydev.caseparts.com/secure/" + endpoint

const AppSettings = {
  AppName: "CPC",
  Urls: {
    Login: API("authenticate/login"),
    Logout: API("authenticate/logout"),
    Impersonate: email => email
      ? API("authenticate/impersonate?email=") + email
      : API("authenticate/impersonate"),
    Guest: API("test/guest"),
    Customer: API("test/customer"),
    LinkedCustomer: API("test/linkedcustomer"),
    Employee: API("test/employee")
  }
};

export default AppSettings;
