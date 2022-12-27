## Function adapter for [vuex-along](https://github.com/boenfu/vuex-along)

```shell
npm install vuex-along-function-adapter --save
# or
yarn add vuex-along-function-adapter
```

```javascript
import createVuexAlong from "vuex-along";
import functionAdapter from "vuex-along-function-adapter";

const store = new Vuex.Store({
  plugins: [
    createVuexAlong({
      adapterOptions: functionAdapter(),
    }),
  ],
});
```

## Notice
The function for persistent storage must be a [pure function](https://javascript.tutorialhorizon.com/2016/04/24/pure-vs-impure-functions/)


## License

- [MIT](https://opensource.org/licenses/MIT)
