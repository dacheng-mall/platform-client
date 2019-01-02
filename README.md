## 2019-01-02
antd的form组件中一旦使用onFieldChange回调, 并且在回调中使用 error属性将会变为受控, validateFields方法会失效;  
要么不用onFieldsChagne, 要么就连errors和validateStatus也控制