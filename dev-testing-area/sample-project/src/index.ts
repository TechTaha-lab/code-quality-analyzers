const apiKey = "sk_test_dev_area_secret";

function greet(name: any) {
  const unused = 42;
  console.log("hello", name);
  return apiKey;
}

greet("dev");
