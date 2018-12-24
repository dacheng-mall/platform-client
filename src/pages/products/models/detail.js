import ptrx from "path-to-regexp";
import { getProduct } from "../services";
export default {
  namespace: 'detail',
  state: {
    data:null,
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        const pn = ptrx('/products/detail/:id').exec(pathname);
        if(pn){
          const id = ptrx('/products/detail/:id').exec(pathname)[1];
          dispatch({
            type: 'init',
            id
          })
        }
      });
    },
  },
  effects: {
    *init({id}, {call, put}){
      const {data} = yield call(getProduct, id);
      yield new Promise(function(res){
        setTimeout(() => {res()}, 1000);
      })
      yield put({
        type: 'upState',
        payload: { data }
      })
    }
  },
  reducers: {
    upState(state, { payload }) {
      return { ...state, ...payload };
    }
  }
}