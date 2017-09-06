module.exports = {
    "env": {
        "browser": true,
        "es6": true,
        "node": true
    },
    "plugins": ["node"],
    "extends": "eslint:recommended",
    "parserOptions": {
        "sourceType": "module"
    },
    "rules": {
        "no-console": 0,
        "indent": [
            "warn",
            3
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "warn",
            "double"
        ],
        "semi": [
            "error",
            "never"
        ]
    }
};
