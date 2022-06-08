// https://www.postcss.parts/?searchTerm=

// https://github.com/michael-ciniawsky/postcss-load-config
// https://github.com/postcss/autoprefixer
// https://github.com/cuth/postcss-pxtorem

module.exports = {
    'plugins': {
        'autoprefixer': {
            'remove': false,
            'overrideBrowserslist': [ 'iOS >= 8', 'Android >= 4' ]
        },
        'postcss-pxtorem':{
            rootValue: 100,
            propWhiteList: []
        }
    }
};
