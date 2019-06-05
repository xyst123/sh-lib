import env from './env';

const domainConfig = {
  dev: {
    user: '',
    article: '',
  },
  test: {
    user: 123,
    article: 2,
  },
  production: {
    user: 123,
    article: 2,
  },
};

const pathConfig = {
  dev: {
    userInfo: {
      domain: 'user',
      path: '/info',
    },
    userSubmit: {
      domain: 'user',
      path: '/submit',
    },
    articleAdd: {
      domain: 'article',
      path: '/add',
    },
    articleDelete: {
      domain: 'article',
      path: '/delete',
    },
  },
  test: {
    userInfo: {
      domain: 'user',
      path: '/info',
    },
    articleAdd: {
      domain: 'article',
      path: '/add',
    },
    articleDelete: {
      domain: 'article',
      path: '/delete',
    },
  },
  production: {
    userInfo: {
      domain: 'user',
      path: '/info',
    },
    articleAdd: {
      domain: 'article',
      path: '/add',
    },
    articleDelete: {
      domain: 'article',
      path: '/delete',
    },
  },
};

export default function getUrl(name) {
  const pathObject = pathConfig[env][name];
  const domain = domainConfig[env][pathObject.domain];
  const pathname = pathObject.path;
  return domain + pathname;
}
