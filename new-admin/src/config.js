export const amplifyConfig = {
  aws_project_region: process.env.NEXT_PUBLIC_AWS_PROJECT_REGION,
  aws_cognito_identity_pool_id: process.env.NEXT_PUBLIC_AWS_COGNITO_IDENTITY_POOL_ID,
  aws_cognito_region: process.env.NEXT_PUBLIC_AWS_COGNITO_REGION,
  aws_user_pools_id: process.env.NEXT_PUBLIC_AWS_USER_POOLS_ID,
  aws_user_pools_web_client_id: process.env.NEXT_PUBLIC_AWS_USER_POOLS_WEB_CLIENT_ID,
};

export const auth0Config = {
  client_id: process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID,
  domain: process.env.NEXT_PUBLIC_AUTH0_DOMAIN,
};

export const firebaseConfig = {
  apiKey: "AIzaSyBSEx2-ykPTb70keLZh3LAuDtQT2VyCsco",
  appId: "1:599725599274:web:8f9a716ca577fc72a1f153",
  authDomain: "evencloud-26d32.firebaseapp.com",
  databaseURL: "https://evencloud-26d32.firebaseio.com",
  messagingSenderId: "599725599274",
  projectId: "evencloud-26d32",
  storageBucket: "evencloud-26d32.appspot.com",
};

export const gtmConfig = {
  containerId: process.env.NEXT_PUBLIC_GTM_CONTAINER_ID,
};

// export const API_SERVICE = "http://localhost:5000/api/v1/main";
export const API_SERVICE = "http://54.168.106.12:5000/api/v1/main";
// export const API_SERVICE = "https://cybrclik.herokuapp.com/api/v1/main";

// export const API_SERVICE = "https://devcybrclik.herokuapp.com/api/v1/main";
