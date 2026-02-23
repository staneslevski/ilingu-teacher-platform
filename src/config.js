const dev = {
  amplify: {
    Auth: {
      mandatorySignIn: false,
      region: "ap-northeast-1",
      userPoolId: "ap-northeast-1_rWZ03rvWn",
      userPoolWebClientId: "36cbbcrmpum9t6c4umakbpcc4i",
      identityPoolId: "ap-northeast-1:d16d29c9-29a4-47aa-9f2c-b75c3444d204",
      cookieStorage: {
        domain: ".ilingu.test",
        path: "/",
        expires: 365,
        secure: false,
      },
    },
    Storage: {
      AWSS3: {
        bucket: "dev-mediafiles-bucket",
        region: "ap-northeast-1"
      },
    },
    API: {
      endpoints: [
        {
          name: "ilingu",
          endpoint: "https://96yc550phf.execute-api.ap-northeast-1.amazonaws.com/dev",
          region: "ap-northeast-1",
        },
      ]
    },
  },
  currencies: [
    {
      code: "GBP",
      symbol: "£",
    },
    {
      code: "HKD",
      symbol: "HK$"
    },
  ],
  sentry: {
    dsn: 'https://e7be128932fe4d36b3dc284cf7ca6195@sentry.io/1302901',
    environment: 'dev'
  },
};

export const testing = {
  amplify: {
    Auth: {
      mandatorySignIn: false,
      region: "ap-northeast-1",
      userPoolId: "ap-northeast-1_VBdvW09wo",
      userPoolWebClientId: "5m70ojqonuh54mo7defgdjroec",
      identityPoolId: "ap-northeast-1:e91fb7a6-d582-42ee-8b80-917244e1610f",
      cookieStorage: {
        domain: "localhost",
        path: "/",
        expires: 365,
        secure: false,
      },
    },
    Storage: {
      AWSS3: {
        bucket: "testing-mediafiles-bucket",
        region: "ap-northeast-1"
      },
    },
    API: {
      endpoints: [
        {
          name: "ilingu",
          endpoint: "https://mbt7kj8gi5.execute-api.ap-northeast-1.amazonaws.com/testing",
          region: "ap-northeast-1",
        },
      ]
    },
  },
  stripeKey: "pk_test_C2fMeiRfAmNwsqPy2WfvBErD",
  sentry: {
    dsn: 'https://e7be128932fe4d36b3dc284cf7ca6195@sentry.io/1302901',
    environment: 'testing'
  },
  currencies: [
    {
      code: "GBP",
      symbol: "£",
    },
  ],
};


const prod = {
  amplify: {
    Auth: {
      mandatorySignIn: true,
      region: "ap-northeast-1",
      userPoolId: "ap-northeast-1_kysXpg2rE",
      userPoolWebClientId: "lpv623fle572qohers6cit86j",
      identityPoolId: "ap-northeast-1:ff7c4c73-c653-4e28-98c0-10d6a46a0403",
      cookieStorage: {
        domain: ".ilingu.com",
        path: "/",
        expires: 365,
        secure: false,
      },
    },
    Storage: {
      AWSS3: {
        bucket: "production-mediafiles-bucket",
        region: "ap-northeast-1"
      },
    },
    API: {
      endpoints: [
        {
          name: "ilingu",
          endpoint: "https://1ms6gh5vg7.execute-api.ap-northeast-1.amazonaws.com/production",
          region: "ap-northeast-1",
        },
      ]
    }
  },
  s3: {
    REGION: "ap-northeast-1",
    BUCKET: "production-mediafiles-bucket"
  },
  apiGateway: {
    REGION: "ap-northeast-1",
    URL:
      "https://1ms6gh5vg7.execute-api.ap-northeast-1.amazonaws.com/production"
  },
  cognito: {
    REGION: "ap-northeast-1",
    USER_POOL_ID: "ap-northeast-1_kysXpg2rE",
    APP_CLIENT_ID: "lpv623fle572qohers6cit86j",
    IDENTITY_POOL_ID: "ap-northeast-1:ff7c4c73-c653-4e28-98c0-10d6a46a0403"
  },
  domain: {
    name: ".ilingu.com",
    secure: true
  },
  currencies: [
    {
      code: "GBP",
      symbol: "£",
    },
  ],
  sentry: {
    dsn: 'https://e7be128932fe4d36b3dc284cf7ca6195@sentry.io/1302901',
    environment: 'production'
  },
};

let config;
switch (process.env.REACT_APP_STAGE) {
  case "production":
    config = prod;
    break;
  case 'staging':
    config = {
      ...dev,
      amplify: {
        ...dev.amplify,
        Auth: {
          ...dev.amplify.Auth,
          cookieStorage: {
            domain: ".ilingu.com",
            path: "/",
            expires: 365,
            secure: true,
          },
        }
      },
      sentry: {
        dsn: 'https://e7be128932fe4d36b3dc284cf7ca6195@sentry.io/1302901',
        environment: 'staging'
      },
    };
    break;
  case 'testing':
    config = {
      ...testing,
    };
    break;
  case "dev":
    config = dev;
    break;
  default:
    console.log("Can not find the configuration");
}

export default {
  // Add common config values here
  MAX_ATTACHMENT_SIZE: 5000000,
  cloudinary: {
    cloud_name: 'ilingu',
    base_url: 'https://res.cloudinary.com/dnmujb2wk'
  },
  ...config
};
